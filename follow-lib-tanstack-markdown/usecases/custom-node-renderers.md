# Use Case — Render Nodes With the App's Own Components

> Map the document model onto design-system components, with links, code, and HTML handled safely. Source: https://tanstack.com/markdown/latest (accessed 2026-10-20)

## 1. Start from a single node map

```tsx
// src/markdown/nodes.tsx
import type { DocNode } from "./parse";

export const nodeRenderers: Record<string, (node: DocNode) => React.ReactNode> = {
  heading: (node) => <Heading level={node.depth}>{renderChildren(node)}</Heading>,
  paragraph: (node) => <p>{renderChildren(node)}</p>,
  code: (node) => <Code code={node.value} language={node.language ?? "text"} />,
  table: (node) => <DataTable node={node} />,
};
```

One map, keyed by node type. Adding a node type is one entry; the renderer walks the tree and falls back to a plain element for anything unmapped.

## 2. Route links through the app router

```tsx
link: (node) =>
  node.href.startsWith("/") ? (
    <Link to={node.href}>{renderChildren(node)}</Link>
  ) : (
    <a href={node.href} rel="noreferrer noopener" target="_blank">
      {renderChildren(node)}
    </a>
  ),
```

Internal links must not full-page reload, and external links need `rel` — markdown is attacker-controlled text in any chat or comment surface.

## 3. Delegate code to the highlighter

`code` nodes hand off to `/follow-lib-tanstack-highlight`: precomputed HTML for static docs, the client highlighter for live output. The markdown layer stays unaware of how the tokens are coloured.

## 4. Handle raw HTML as a trust boundary

1. Sanitize any raw HTML node before rendering — allow a short tag list, drop `script`, `iframe`, `on*` attributes
2. Prefer rendering the sanitized string through the app's existing sanitizer rather than trusting the parser
3. Never render an unsanitized `html` node just because the source came from an AI response

## 5. Verify with adversarial input

1. A link to `javascript:alert(1)` — must not become a clickable `href`
2. An image with `onerror` — must not execute
3. A code fence containing `</code><script>` — must render as text
4. `/run-test` with a snapshot per node type, so a design-system rename shows up as a diff
5. `/run-typecheck` — the node map must stay exhaustively typed

## Pitfalls

- Building the node map inline in the component, so every render creates new component identities and remounts the subtree.
- Mapping `table` to a plain `<table>` and losing the container that makes wide tables scroll on mobile.
- Treating `link` nodes as plain `<a>` in an SPA, which reloads the page and drops client state.
- Sanitizing after render via `innerHTML` on a live node, which is already too late.

## Related

- `references/apis.md`
- `best-practices/tanstack-markdown.md`
- `usecases/stream-ai-markdown.md`
