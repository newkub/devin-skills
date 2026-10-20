# Use Case — Streaming Chat End to End

> Server adapter streams tokens, client renders message parts, and `stop()` actually cancels. Source: https://tanstack.com/ai/latest (accessed 2026-10-20)

## 1. Install the core plus one adapter

```sh
bun add @tanstack/ai @tanstack/ai-client @tanstack/ai-react
bun add @tanstack/ai-openai
```

The adapter is the only provider-specific import — swapping providers later touches the server alone.

## 2. Expose a server endpoint

```ts
// src/routes/api/chat.ts
import { chat, toStreamResponse } from "@tanstack/ai";
import { openaiText } from "@tanstack/ai-openai";

export const POST = async ({ request }: { request: Request }) => {
  const { messages } = await request.json();
  const stream = chat({ adapter: openaiText(), messages });
  return toStreamResponse(stream);
};
```

`chat()` and the adapter stay server-side; the browser only ever sees the SSE stream.

## 3. Connect the client

```tsx
import { useChat, fetchServerSentEvents } from "@tanstack/ai-react";

export function Chat() {
  const { messages, sendMessage, isLoading, stop } = useChat({
    connection: fetchServerSentEvents("/api/chat"),
  });

  return (
    <div>
      {messages.map((message) => (
        <article key={message.id}>
          {message.parts.map((part, i) =>
            part.type === "text" ? <p key={i}>{part.text}</p> : null,
          )}
        </article>
      ))}

      <button disabled={isLoading} onClick={() => sendMessage({ role: "user", content: input })}>
        Send
      </button>
      {isLoading && <button onClick={stop}>Stop</button>}
    </div>
  );
}
```

`messages[].parts` is the source of truth: text, tool-call, and tool-result each arrive as their own part, and new part types appear as the library evolves.

## 4. Render parts by type instead of concatenating text

```tsx
{message.parts.map((part, i) => {
  switch (part.type) {
    case "text":
      return <p key={i}>{part.text}</p>;
    case "tool-call":
      return <ToolCallCard key={i} part={part} />;
    case "tool-result":
      return <ToolResultCard key={i} part={part} />;
    default:
      return null;
  }
})}
```

Parsing the raw text stream yourself re-implements the contract and breaks the moment a tool call appears.

## 5. Verify streaming, not just the final answer

1. Tokens appear progressively, not all at once at the end
2. `stop()` aborts within a second and leaves the partial message intact
3. A network error surfaces as an error state, not a spinner that never resolves
4. Swap to a second adapter on the server and confirm the client code is unchanged

## Pitfalls

- Putting the adapter or API key in the client bundle — the provider call must stay on the server.
- Treating `messages` as plain strings; the parts array is what carries tool calls and results.
- Assuming a fixed API: `0.x` moves fast, so pin the version and re-check the docs before copying examples.
- Ignoring `isLoading` so the send button fires concurrent requests into the same stream.
- Rendering only the last message and losing the tool-call history.
- Testing with a mock that resolves instantly, which hides ordering bugs in streaming.

## Related

- `references/apis.md`
- `best-practices/tanstack-ai.md`
- `usecases/tool-calling-and-approval.md`
