# Use Case — Tool Calling Loop

> Give the model a set of functions, execute whatever it asks for, and feed the results back until it answers — with a hard stop. Source: https://platform.openai.com/docs/guides/function-calling (accessed 2026-10-20)

## 1. Declare a tool next to its implementation

```ts
import OpenAI from "openai";
import { z } from "zod";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  timeout: 30_000,
  maxRetries: 3,
});

const MODEL = process.env.OPENAI_MODEL ?? "gpt-4.1-mini";

const OrderArgs = z.object({ orderId: z.string().min(3) });

const tools: OpenAI.ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "get_order",
      description: "Look up one order and return its status, total, and line items",
      parameters: {
        type: "object",
        properties: {
          orderId: { type: "string", description: "Order id such as ord_123" },
        },
        required: ["orderId"],
        additionalProperties: false,
      },
    },
  },
];

const handlers = {
  get_order: async (raw: unknown) => {
    const { orderId } = OrderArgs.parse(raw);
    return db.order.findUniqueOrThrow({ where: { id: orderId } });
  },
};
```

The `parameters` schema is what the model sees, so name the tool after the question it answers ("get_order"), not after the internal function. `additionalProperties: false` stops the model from inventing extra fields.

## 2. Ask the model what to call

```ts
const messages: OpenAI.ChatCompletionMessageParam[] = [
  { role: "system", content: "You are a support agent. Use tools for order facts; never guess." },
  { role: "user", content: "Where is order ord_123?" },
];

const first = await client.chat.completions.create({
  model: MODEL,
  messages,
  tools,
  tool_choice: "auto",
});

const message = first.choices[0].message;
const calls = message.tool_calls ?? [];
```

`tool_calls` is empty when the model answers directly. Treat that as a normal outcome, not as an error.

## 3. Execute and append the results

```ts
messages.push(message);

for (const call of calls) {
  if (call.type !== "function") continue;

  const handler = handlers[call.function.name as keyof typeof handlers];
  const result = handler
    ? await handler(JSON.parse(call.function.arguments))
    : { error: `unknown tool ${call.function.name}` };

  messages.push({
    role: "tool",
    tool_call_id: call.id,
    content: JSON.stringify(result),
  });
}
```

The assistant message must be pushed before the tool results, and every `tool_call_id` needs exactly one matching tool message — the API rejects the next request otherwise. `arguments` is a JSON string, and it can be malformed, so parse inside a `try` or validate with zod as above.

## 4. Loop until it stops

```ts
for (let turn = 0; turn < 5; turn += 1) {
  const completion = await client.chat.completions.create({
    model: MODEL,
    messages,
    tools,
    tool_choice: "auto",
  });

  const reply = completion.choices[0].message;
  messages.push(reply);

  if (!reply.tool_calls?.length) {
    return reply.content ?? "";
  }

  for (const call of reply.tool_calls) {
    if (call.type !== "function") continue;
    const handler = handlers[call.function.name as keyof typeof handlers];
    const result = handler
      ? await handler(JSON.parse(call.function.arguments))
      : { error: `unknown tool ${call.function.name}` };

    messages.push({ role: "tool", tool_call_id: call.id, content: JSON.stringify(result) });
  }
}

throw new Error("tool loop did not converge within 5 turns");
```

The turn cap is the difference between a bounded feature and an invoice. Five turns covers a lookup plus a follow-up; a workflow that needs twenty is usually a workflow that should be code with one model call.

## 5. Handle parallel calls

```ts
const settled = await Promise.allSettled(
  reply.tool_calls.map(async (call) => {
    if (call.type !== "function") throw new Error("not a function call");
    return {
      id: call.id,
      result: await handlers[call.function.name as keyof typeof handlers](
        JSON.parse(call.function.arguments),
      ),
    };
  }),
);
```

The model may request several calls in one turn. `Promise.allSettled` keeps one failing lookup from cancelling the rest, and each rejection still has to be turned into a `tool` message so the model can react to it.

## 6. Verify

1. `/run-test` — ask a question that needs `get_order`; the transcript shows a tool message with the order JSON
2. Ask something answerable without tools — no tool message appears
3. Request a nonexistent order id — the model receives the error result and apologises instead of inventing a status
4. Set the cap to 1 with a prompt that always calls a tool — the loop throws instead of running forever
5. `/run-verify` — `handlers` keyed by the tool names, no `as any` on the arguments
6. `/run-test` cost check: total tokens per conversation stay flat across runs

## Pitfalls

- Pushing tool results without the assistant message that requested them, which the API rejects.
- Forgetting that `arguments` is a string, then spreading it as an object.
- Throwing inside a handler and losing the error — return `{ error }` so the model can recover.
- No turn cap, so a tool that always fails loops until the context window or the budget runs out.
- Side effects inside a tool that is retried by `maxRetries`, producing duplicate actions.
- A tool description that explains the implementation instead of when to use it, so the model picks the wrong one.
- Sending every internal function as a tool, which inflates the prompt and degrades selection.

## Related

- `references/apis.md`
- `best-practices/usage.md`
- `usecases/structured-output.md`
- `usecases/retry-rate-limits-and-usage.md`
