# Use Case — Server Tools and Approval Flow

> Let the model call real functions on the server, and require a human click before anything destructive runs. Source: https://tanstack.com/ai/latest (accessed 2026-10-20)

## 1. Declare a server tool

```ts
import { toolDefinition } from "@tanstack/ai";
import { z } from "zod";

const getWeather = toolDefinition({
  name: "get_weather",
  description: "Get the current weather for a city",
  inputSchema: z.object({ city: z.string().describe("City name") }),
}).server(async ({ city }) => fetchWeather(city));
```

`.server(fn)` keeps execution and credentials on the server; the client only learns that a tool was called.

## 2. Pass tools to `chat()`

```ts
import { chat, toStreamResponse } from "@tanstack/ai";
import { openaiText } from "@tanstack/ai-openai";

export const POST = async ({ request }: { request: Request }) => {
  const { messages } = await request.json();
  const stream = chat({
    adapter: openaiText(),
    messages,
    tools: [getWeather],
    maxIterations: 5,
  });
  return toStreamResponse(stream);
};
```

`maxIterations` bounds the agent loop: the model can call tools, read results, and call again — up to the limit you set.

## 3. Require approval for side effects

```ts
const refundOrder = toolDefinition({
  name: "refund_order",
  description: "Refund an order. Requires customer confirmation.",
  inputSchema: z.object({ orderId: z.string(), amount: z.number().positive() }),
}).client(async ({ orderId, amount }) => {
  const ok = await confirmDialog(`Refund ${amount} for ${orderId}?`);
  if (!ok) throw new Error("user declined");
  return refund(orderId, amount);
});
```

A client tool is the right home for anything a human must approve: nothing executes until the UI calls it.

## 4. Render the tool call as a first-class message part

```tsx
{message.parts.map((part, i) =>
  part.type === "tool-call" ? (
    <div key={i} class="rounded border p-3">
      <p>Model wants to run {part.name}</p>
      <pre>{JSON.stringify(part.input, null, 2)}</pre>
      <button onClick={() => approve(part.id)}>Approve</button>
      <button onClick={() => reject(part.id)}>Reject</button>
    </div>
  ) : part.type === "text" ? (
    <p key={i}>{part.text}</p>
  ) : null,
)}
```

Showing the resolved input is what makes an approval meaningful — approving a tool name alone is not informed consent.

## 5. Test the loop deterministically

1. Tool call appears as a `tool-call` part with typed input
2. Server tools return a `tool-result` part the model uses in the next turn
3. Rejecting a client tool ends the turn cleanly instead of hanging
4. `maxIterations` stops a model that keeps re-calling the same tool

## Pitfalls

- Putting a side-effecting tool in `.server()` and calling it "approved" — approval must be in the client or a policy layer.
- No `maxIterations`: a confused model can loop forever and burn tokens.
- Validating tool input only in the prompt — the `inputSchema` is the real guard.
- Throwing from a server tool without a message the model can act on, producing an unhelpful retry loop.
- Logging full tool inputs containing PII or secrets.
- Assuming the API is stable: pin the version and re-read the docs before shipping an agent loop.

## Related

- `references/apis.md`
- `best-practices/tanstack-ai.md`
- `usecases/streaming-chat.md`
