# Use Case — Stream a Typed Table from `outputSchema`

> Waiting for the full object leaves the UI empty; passing one schema to both sides lets the table fill row by row while the model is still writing JSON. Source: https://tanstack.com/ai/latest/docs/tutorials/streaming-structured-table (accessed 2026-10-20)

## 1. Share one schema

```ts
// src/lib/table-schema.ts
import { z } from "zod";

export const comparisonSchema = z.object({
  title: z.string().meta({ description: "Short title for the table" }),
  rows: z.array(
    z.object({
      name: z.string().meta({ description: "Row name" }),
      year: z.number().meta({ description: "First release year" }),
      kind: z.string().meta({ description: "Category or paradigm" }),
      note: z.string().meta({ description: "One-line typical use" }),
    }),
  ),
});

export type Comparison = z.infer<typeof comparisonSchema>;
```

The client and the server import this file, so the streamed shape and the rendered shape cannot drift. The field descriptions are the model's instructions — without them the column contents are guesses.

## 2. Ask the server for structured output

```ts
// src/routes/api/chat.ts
import { chat, chatParamsFromRequest, toServerSentEventsResponse } from "@tanstack/ai";
import { openaiText } from "@tanstack/ai-openai";
import { comparisonSchema } from "@/lib/table-schema";

export async function POST({ request }: { request: Request }) {
  const params = await chatParamsFromRequest(request);

  const stream = chat({
    adapter: openaiText("gpt-5.2"),
    messages: params.messages,
    threadId: params.threadId,
    runId: params.runId,
    outputSchema: comparisonSchema,
    stream: true,
  });

  return toServerSentEventsResponse(stream);
}
```

Both options matter: `outputSchema` constrains the model, and `stream: true` emits the JSON in chunks instead of one final blob. `chatParamsFromRequest` reads the messages, thread, and run ids that the client connection already sends.

## 3. Type the client with the same schema

```tsx
"use client";
import { fetchServerSentEvents, useChat } from "@tanstack/ai-react";
import { comparisonSchema } from "@/lib/table-schema";

export function ComparisonTable() {
  const { sendMessage, isLoading, error, stop, partial, final } = useChat({
    connection: fetchServerSentEvents("/api/chat"),
    outputSchema: comparisonSchema,
  });

  const rows = partial.rows ?? [];
  // ...
}
```

`partial` is a deep-partial of the schema and updates as chunks parse; `final` stays `null` until the stream ends. Passing `outputSchema` on the client is what types both — the server option alone gives the UI `unknown`.

## 4. Render missing cells as pending

```tsx
<table aria-busy={isLoading}>
  <caption>{partial.title ?? "Results"}</caption>
  <tbody>
    {rows.map((row, index) => (
      <tr key={index}>
        <th scope="row">{row.name ?? "…"}</th>
        <td>{row.year ?? "…"}</td>
        <td>{row.kind ?? "…"}</td>
        <td>{row.note ?? "…"}</td>
      </tr>
    ))}
  </tbody>
</table>
```

A row can exist before all of its cells have arrived, so every field is optional. Rendering `row.year.toString()` crashes on the first partial row — the `?? "…"` placeholder is the contract, not a nicety.

## 5. Persist only the completed object

```tsx
import { useEffect } from "react";

useEffect(() => {
  if (!final) return;
  void fetch("/api/tables", { method: "POST", body: JSON.stringify(final) });
}, [final]);
```

`final` is the validated whole object; `partial` is a view state. Saving `partial` stores half a row and a title that may still change.

## 6. Verify

1. Send a prompt — rows appear while `isLoading` is still true
2. Watch one row — cells fill in independently and show `…` until parsed
3. `final` — `null` during the stream, non-null exactly once at the end
4. Typecheck — `partial.rows[0].year` is `number | undefined`, and no non-null assertion is needed
5. Press stop mid-stream — nothing is persisted from the incomplete object
6. Ask for a column not in the schema — the output does not invent it

## Pitfalls

- Reading only `final` — the table stays empty for the whole run, which is the bug this pattern exists to avoid.
- Passing `outputSchema` to `chat()` but not to `useChat()`, so `partial` and `final` are untyped.
- Treating `partial` rows as complete and calling `.toString()` or a formatter on an undefined field.
- Persisting or emailing `partial` instead of `final`.
- Omitting `stream: true` and expecting progressive rows.
- Writing the schema twice — one copy on the server, one type in the client — which drifts on the first field rename.
- The 0.x line renamed the response helper: match `toServerSentEventsResponse` (or the older `toStreamResponse`) to the version you actually installed.

## Related

- `references/apis.md`
- `best-practices/tanstack-ai.md`
- `usecases/streaming-chat.md`
- `usecases/typed-decisions.md`
