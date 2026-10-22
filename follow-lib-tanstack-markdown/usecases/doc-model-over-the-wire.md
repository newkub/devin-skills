# Use Case — Ship the Document Model Over the Wire

> Parse once on the server, send a JSON document, and render it on the client without shipping a parser or trusting a rendered HTML string. Source: https://tanstack.com/markdown/latest (accessed 2026-10-20)

## 1. Wrap the model in a versioned envelope

```ts
// src/markdown/wire.ts
import type { DocNode } from "./parse";

export type DocPayload = {
  v: 1;
  nodes: DocNode[];   // plain data only — no functions, no components
};

export function toPayload(nodes: DocNode[]): DocPayload {
  return { v: 1, nodes };
}
```

The version field is what lets a cached payload from the previous release be detected and re-parsed instead of crashed on.

## 2. Parse on the server only

```ts
// src/server/post.ts
import { parseMarkdown } from "../markdown/parse";
import { toPayload } from "../markdown/wire";

export async function getPost(slug: string) {
  const post = await db.posts.findBySlug(slug);
  const nodes = parseMarkdown(post.body);
  return { title: post.title, doc: toPayload(nodes) };
}
```

The parser stays out of the client bundle entirely — the browser receives data and a renderer.

## 3. Reject a payload you cannot render

```ts
// src/markdown/read.ts
import type { DocPayload } from "./wire";

export function readPayload(value: unknown): DocPayload | null {
  if (typeof value !== "object" || value === null) return null;
  const p = value as Partial<DocPayload>;
  if (p.v !== 1 || !Array.isArray(p.nodes)) return null;
  return p as DocPayload;
}
```

An envelope check costs one function and prevents the "cannot read `type` of undefined" crash that a stale cache produces after a deploy.

## 4. Render the same model on both sides

```tsx
export function PostBody({ doc }: { doc: DocPayload }) {
  return <article>{doc.nodes.map((node, i) => <Node key={i} node={node} />)}</article>;
}
```

Because the server and the client render the same node tree from the same JSON, hydration matches by construction — there is no second HTML-producing path to drift.

## 5. Verify

1. `/run-test` — feed a real payload through `readPayload`, then through the renderer; assert the heading and code node count
2. Corrupt the payload (`v: 2`, `nodes: null`) — the page shows a fallback, not a crash
3. View the client bundle — no parser module is present
4. Add a node type on the server, deploy, load an old cached payload — it is rejected, not half-rendered
5. On failure → `/resolve-errors` max 3 rounds

## Pitfalls

- Sending rendered HTML instead of the model → the client loses the ability to re-render, restyle, or link-route the content.
- Storing a component or a callback in a node → `JSON.stringify` drops it and the client renders a hole.
- Parsing again on the client "just in case" → double the grammar cost and two code paths that can disagree.
- No envelope version → cache invalid after deploy becomes a runtime error instead of a re-parse.
- Rendering `nodes.map` without stable keys → React reuses DOM across node types and inputs inside embeds lose state.

## Related

- `references/apis.md`
- `best-practices/tanstack-markdown.md`
- `usecases/stream-ai-markdown.md`
- `usecases/custom-node-renderers.md`
