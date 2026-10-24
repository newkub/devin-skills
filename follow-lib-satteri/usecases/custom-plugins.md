# Use Case — Write MDAST and HAST Plugins

> Extend the pipeline at the tree stage instead of post-processing HTML strings. Source: https://satteri.bruits.org/docs/plugin-api (read 2026-10-24)

## 1. Choose the stage

| Stage  | Sees                        | Use for                                        |
| ------ | --------------------------- | ---------------------------------------------- |
| MDAST  | Markdown semantics          | Headings, links, code fences, custom node types |
| HAST   | Elements and raw HTML       | Classes, ids, wrapping, attribute rewriting     |

Prefer MDAST when the intent is Markdown-level; prefer HAST when it is DOM-level.

## 2. Define a stateless plugin

```ts
import { defineHastPlugin } from "satteri";

export const externalLinks = defineHastPlugin({
  name: "external-links",
  element(node) {
    if (node.tagName !== "a") return;
    const rel = node.properties?.rel;
    node.properties = { ...node.properties, target: "_blank", rel: "noopener noreferrer" };
  },
});
```

A definition carries no per-document state and is reused across compiles.

## 3. Use a factory for per-document state

```ts
import { defineMdastPlugin } from "satteri";

export const collectHeadings = () =>
  defineMdastPlugin({
    name: "collect-headings",
    heading(node, ctx) {
      const slugs = (ctx.data.slugs ??= new Set<string>());
      slugs.add(slugify(textOf(node)));
    },
  });

const result = markdownToHtml(source, { mdastPlugins: [collectHeadings()] });
console.log(result.data.slugs);
```

`ctx` exposes `fileURL`, `sourceFormat`, `source`, and the shared `data` bag. `fileURL` is only set when you pass `fileURL` as a `URL`.

## 4. Compose and skip

```ts
const plugins = [
  [externalLinks, collectHeadings()], // bundle: runs in place
  process.env.NODE_ENV === "production" && onlyInDev(), // false → skipped
];
```

`null`, `undefined`, and `false` skip an entry; any other non-plugin value throws.

## 5. Return or mutate

```ts
defineMdastPlugin({
  name: "stamp",
  paragraph(node) {
    if (!node.children.length) return; // keep the node as-is
    return { ...node, data: { ...node.data, seen: true } }; // replace it
  },
});
```

Return a node to replace, a `{ raw }` object to splice in Markdown-reparsed content, or nothing to keep the node and keep any mutations you made.

## Pitfalls

- Returning `{ rawHtml }` → deprecated; use `{ raw, mdxExpressions: false }`.
- Emitting an mdast `html` node in an MDX pipeline → renders under `markdownToHtml`, throws under `mdxToJs`.
- Reading `node.position` without opting in → undefined unless the plugin sets `options: { position: true }`, which costs ~15% of parse time.
- Creating fresh plugin objects per document when they hold no state → wasted allocation; hoist definitions.
- Mutating `ctx.data` in a shared definition → state leaks between documents; use a factory.

## Related

- `references/apis.md`
- `best-practices/satteri.md`
- `usecases/parse-tree-and-remark-pipeline.md`
