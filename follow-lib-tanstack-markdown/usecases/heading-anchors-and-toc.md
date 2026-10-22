# Use Case — Heading Anchors and a Table of Contents

> Build the TOC from the same tree you render, so anchors and navigation can never point at headings that moved. Source: https://tanstack.com/markdown/latest (accessed 2026-10-20)

## 1. One slug function for both passes

```ts
// src/markdown/slug.ts
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\p{Letter}\p{Number}\s-]/gu, "")
    .replace(/\s+/g, "-");
}

export function uniqueSlug(text: string, seen: Map<string, number>): string {
  const base = slugify(text);
  const n = seen.get(base) ?? 0;
  seen.set(base, n + 1);
  return n === 0 ? base : `${base}-${n}`;
}
```

Rendering and TOC extraction must use this exact pair. Two slug implementations is how "Getting Started" ends up linked as `#getting-started` while the heading carries `#gettingstarted`.

## 2. Extract headings in document order

```ts
// src/markdown/toc.ts
import type { DocNode } from "./parse";
import { uniqueSlug } from "./slug";

export type TocEntry = { id: string; text: string; depth: number };

export function collectHeadings(nodes: DocNode[]): { toc: TocEntry[]; ids: Map<DocNode, string> } {
  const seen = new Map<string, number>();
  const ids = new Map<DocNode, string>();
  const toc: TocEntry[] = [];

  for (const node of nodes) {
    if (node.type !== "heading") continue;
    const text = textOf(node);                    // flatten inline children
    const id = uniqueSlug(text, seen);
    ids.set(node, id);
    toc.push({ id, text, depth: node.depth });
  }
  return { toc, ids };
}
```

The `Map` from node → id is what the renderer consumes, so the id is computed once and both consumers share it.

## 3. Render the heading with that id

```tsx
function Heading({ node, id }: { node: HeadingNode; id: string }) {
  const Tag = `h${node.depth}` as const;
  return (
    <Tag id={id} className="group scroll-mt-24">
      <a href={`#${id}`} aria-hidden={false} className="opacity-0 group-hover:opacity-100">#</a>
      <Inline nodes={node.children} />
    </Tag>
  );
}
```

`scroll-mt-24` (or a `scroll-margin-top`) keeps a heading visible below a sticky header after `#anchor` navigation — without it the browser scrolls the heading under the header.

## 4. Render the TOC with the active section

```tsx
export function Toc({ entries }: { entries: TocEntry[] }) {
  const active = useActiveHeading(entries.map((e) => e.id));   // IntersectionObserver
  return (
    <nav aria-label="On this page">
      <ol>
        {entries.filter((e) => e.depth <= 3).map((e) => (
          <li key={e.id} style={{ paddingInlineStart: (e.depth - 2) * 12 }}>
            <a href={`#${e.id}`} aria-current={active === e.id ? "location" : undefined}>{e.text}</a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
```

Depth filter: `h4`+ in a sidebar TOC is noise; keep the full depth in the document itself.

## 5. Verify

1. `/run-test` — two headings with the same text get `intro` and `intro-1`, and the TOC links match the rendered ids
2. Click a TOC entry — the heading lands below the sticky header, not under it
3. Back/forward after a `#hash` — the scroll position is restored to the heading
4. `/run-typecheck` — the node → id map stays typed
5. On failure → `/resolve-errors` max 3 rounds

## Pitfalls

- Slugging in the renderer and again in the TOC with different rules → dead links; share one function.
- Ignoring duplicates → the second "Overview" heading gets no anchor and both TOC rows jump to the first.
- Building ids from `innerHTML` after rendering → whitespace and inline tags leak into the slug.
- No `scroll-margin` → every anchor click hides the heading behind the header.
- Filtering headings from the TOC but still rendering an anchor link in the body → no user-visible harm, but keep one `aria-label` and one structure.

## Related

- `references/apis.md`
- `best-practices/tanstack-markdown.md`
- `usecases/custom-node-renderers.md`
- `usecases/doc-model-over-the-wire.md`
