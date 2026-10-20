# Use Case — Render AI Output While It Streams

> Parse markdown that arrives in chunks, without flicker and without breaking on a half-written code fence. Source: https://tanstack.com/markdown/latest (accessed 2026-10-20)

## 1. Keep parsing behind one adapter

```ts
// src/markdown/parse.ts
// The only file that names the package's parse entry. Confirm the export name at
// https://tanstack.com/markdown/latest — v1 may still refine it.
import { parse } from "@tanstack/markdown";

export type DocNode = ReturnType<typeof parse>["children"][number];

export function parseMarkdown(source: string) {
  return parse(source);
}
```

The doc model is the app's data. Everything downstream — renderers, transport, tests — depends on `DocNode`, not on the package.

## 2. Hold the source, derive the model

```tsx
// src/markdown/use-streamed-document.ts
import { useMemo } from "react";
import { parseMarkdown } from "./parse";

export function useStreamedDocument(source: string) {
  return useMemo(() => parseMarkdown(source), [source]);
}
```

Recompute only when the accumulated string changes. Parsing inside a render that also tracks hover state re-parses the whole message on every mouse move.

## 3. Accumulate chunks without losing the tail

```ts
// src/markdown/stream-buffer.ts
export function appendChunk(previous: string, chunk: string): string {
  return previous + chunk;
}
```

Each SSE delta is appended verbatim. Never trim the buffer, and never pretty-print it — a trailing newline is what closes a fence or a list, and removing it changes the parse result mid-stream.

## 4. Render incomplete blocks as pending

1. An unterminated code fence renders as a code block with a caret, not as an error
2. A table with a header row and no body rows renders the header only
3. A list item without a trailing newline renders as an item, not as raw `- ` text

If the model reports a node as partial, show a subtle pending state. Replacing the block with a spinner causes the scroll jump users notice most.

## 5. Feed it from the chat stream

```tsx
const [source, setSource] = useState("");

for await (const chunk of responseStream) {
  setSource((prev) => appendChunk(prev, chunk));
}
```

Pair this with the message `parts` the AI layer produces. Batching chunks on a short timer cuts re-parses on fast streams without making the text arrive late.

## 6. Verify partial states, not just finished text

1. `/run-typecheck` + `/run-test`
2. Parse these exact inputs as separate cases: `"```ts\nconst a = 1"`, `"| a |"`, `"- one\n- two"`, `"# Title *partial"`
3. Confirm no case throws and none renders raw markers to the user
4. On failure → `/resolve-errors` max 3 rounds

## Pitfalls

- Escaping the whole buffer before parsing, which turns every fence into visible backslashes.
- Re-mounting the renderer per chunk with a `key` on the text length, which resets selection and scroll on every frame.
- Treating a parse error as fatal mid-stream; a partial document is a normal state, not a failure.
- Storing components or callbacks in nodes to make rendering "simpler", which breaks JSON transport and caching.

## Related

- `references/apis.md`
- `best-practices/tanstack-markdown.md`
- `usecases/custom-node-renderers.md`
