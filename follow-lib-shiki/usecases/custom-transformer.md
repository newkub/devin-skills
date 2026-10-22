# Use Case — Write a Custom Transformer

> Transformers are hooks over the HAST tree, so line numbers, fence titles, and per-token metadata are additive edits — not a second pass over the HTML string. Source: https://shiki.style/guide/transformers (accessed 2026-10-20)

## 1. Number the lines

```ts
// src/transformer-line-numbers.ts
import type { ShikiTransformer } from "shiki";

export const transformerLineNumbers: ShikiTransformer = {
  name: "line-numbers",
  line(node, line) {
    node.properties["data-line"] = line;
  },
  pre(node) {
    this.addClassToHast(node, "has-line-numbers");
  },
};
```

`line` runs once per line element with its 1-based number, and `pre` runs once on the outer element. `this.addClassToHast` appends to the existing class list instead of overwriting the theme's classes.

## 2. Draw the numbers in CSS

```css
.shiki.has-line-numbers .line {
  display: block;
  counter-increment: line;
}

.shiki.has-line-numbers .line::before {
  content: counter(line);
  display: inline-block;
  width: 2.5rem;
  margin-right: 1rem;
  text-align: right;
  opacity: 0.45;
  user-select: none;
}
```

The counter increments per block-level line, so the markup stays free of number spans. `user-select: none` keeps a copied snippet clean — the numbers exist for reading, not for pasting.

## 3. Read the fence metadata

```ts
export const transformerFenceTitle: ShikiTransformer = {
  name: "fence-title",
  pre(node) {
    const title = this.options.meta?.__raw?.match(/title="([^"]+)"/)?.[1];
    if (!title) return;
    node.properties["data-title"] = title;
  },
};
```

````md
```ts title="src/app.ts"
export const app = createApp();
```
````

`this.options.meta.__raw` is the raw string markdown-it or rehype attached to the fence; treat it as untrusted text and put the parsed value in an attribute rather than building markup from it. Guard on `meta` — the same transformer also runs for direct `codeToHtml` calls, where there is no fence.

## 4. Tag tokens only when something consumes them

```ts
export const transformerTokenIndex: ShikiTransformer = {
  name: "token-index",
  span(node, line, col) {
    node.properties["data-token"] = `${line}:${col}`;
  },
};
```

`span` runs for every token, so this adds thousands of attributes on a long file. It is worth it for a playground that inspects tokens on hover; it is pure weight for a docs site that only renders colors.

## 5. Control the order deliberately

```ts
export const transformerNormalizeWhitespace: ShikiTransformer = {
  name: "normalize-whitespace",
  enforce: "pre",
  line(node) {
    this.addClassToHast(node, "whitespace-pre-wrap");
  },
};
```

`enforce: "pre"` runs before normal transformers, `"post"` after. Use `"pre"` when the transformer must see the original line structure (before notation transformers merge or annotate lines), and `"post"` when it must see their classes. If two transformers write the same property, ordering is a workaround — make them write different properties instead.

## 6. Verify

1. A three-line block — every line carries `data-line` 1–3 and the `pre` has `has-line-numbers`
2. Numbers render right-aligned, do not appear when the snippet is copied, and match the visible line count
3. A fence with `title="src/app.ts"` — `data-title` is present; a fence without meta gets no attribute
4. A `// [!code ++]` line plus numbering — the number still points at the right source line
5. A 200-line file with the token transformer — measure the HTML size and drop it if nothing reads the attribute
6. `/run-test` — a snapshot of `codeToHtml` output with your transformer array

## Pitfalls

- Replacing `node.properties.class` instead of using `addClassToHast`, which drops the theme classes and kills the colors.
- Rebuilding HTML in `postprocess` with a regex instead of editing the HAST node that already exists.
- Reading `this.options.meta.__raw` without a guard, which throws on direct `codeToHtml` calls.
- Interpolating fence meta into raw HTML — it comes from the document, not from your code.
- A `span` transformer that adds attributes for every token on every page.
- Fixing transformer conflicts with `enforce` when the real fix is separate properties.
- Expecting `postprocess` to run for `codeToHast` — it only runs when HTML is generated.

## Related

- `references/apis.md`
- `best-practices/shiki.md`
- `usecases/dual-theme-and-transformers.md`
- `usecases/markdown-pipeline.md`
