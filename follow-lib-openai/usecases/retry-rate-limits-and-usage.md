# Use Case — Retries, Rate Limits, and Usage

> Treat 429s and timeouts as normal, retry only what is safe to retry, and record token usage where the request happened. Source: https://platform.openai.com/docs/guides/error-codes (accessed 2026-10-20)

## 1. Set the deadline and retry budget on the client

```ts
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  timeout: 60_000,
  maxRetries: 3,
});
```

The SDK already retries `408`, `409`, `429`, and `5xx` twice with exponential backoff and honors a `retry-after` header. `maxRetries: 3` is usually enough; raising it multiplies the worst-case latency, because `timeout` applies per attempt, not to the whole call.

## 2. Branch on the error class

```ts
import { APIConnectionError, APIError, RateLimitError } from "openai";

type Action = "wait-retry-after" | "backoff" | "never";

export function classify(error: unknown): Action {
  if (error instanceof RateLimitError) return "wait-retry-after";
  if (error instanceof APIConnectionError) return "backoff";
  if (error instanceof APIError && error.status >= 500) return "backoff";
  return "never";
}
```

A `400` from a malformed schema and a `500` from an overloaded backend look identical if you only check `instanceof Error`. The class tells you whether a retry is meaningful; `never` covers everything deterministic — auth, validation, not found, cancelled.

## 3. Respect `retry-after` when you retry yourself

```ts
export async function withRetry<T>(run: () => Promise<T>, attempts = 4): Promise<T> {
  for (let attempt = 1; ; attempt += 1) {
    try {
      return await run();
    } catch (error) {
      if (classify(error) === "never" || attempt >= attempts) throw error;

      const header = error instanceof APIError ? error.headers?.get("retry-after") : null;
      const waitMs = header ? Number(header) * 1_000 : 2 ** attempt * 250 + Math.random() * 250;

      await new Promise((resolve) => setTimeout(resolve, waitMs));
    }
  }
}
```

Even with `maxRetries` on the client, one retry layer is worth owning: it is where you honour `retry-after` and add jitter. If your own retry fires sooner than the header says, it burns the quota the wait was meant to restore; without jitter, several workers that failed together retry together for ever.

## 4. Record usage where the call happens

```ts
const completion = await client.chat.completions.create({ model: MODEL, messages });
const usage = completion.usage;

logger.info({
  requestId: completion.id,
  model: MODEL,
  input: usage?.prompt_tokens,
  cached: usage?.prompt_tokens_details?.cached_tokens ?? 0,
  output: usage?.completion_tokens,
  total: usage?.total_tokens,
});
```

Logging at the call site keeps the numbers attached to the feature that spent them. A single middleware that logs "tokens" without the model, the route, or the request id cannot answer which feature doubled the bill.

## 5. Capture usage from streams

```ts
const stream = await client.chat.completions.create({
  model: MODEL,
  messages,
  stream: true,
  stream_options: { include_usage: true },
});

let usage: OpenAI.CompletionUsage | undefined;

for await (const chunk of stream) {
  if (chunk.usage) usage = chunk.usage;
  process.stdout.write(chunk.choices[0]?.delta?.content ?? "");
}
```

A streaming response has no `usage` field unless you ask for it, and the chunk that carries it arrives last with an empty `choices` array. Without `include_usage`, a streaming feature is invisible in the cost report.

## 6. Turn usage into cost in one place

```ts
type Price = { inputPerM: number; cachedInputPerM: number; outputPerM: number };

export function costUsd(usage: OpenAI.CompletionUsage, price: Price): number {
  const cached = usage.prompt_tokens_details?.cached_tokens ?? 0;

  return (
    (usage.prompt_tokens - cached) * price.inputPerM +
    cached * price.cachedInputPerM +
    usage.completion_tokens * price.outputPerM
  ) / 1_000_000;
}
```

Keep the price table in the same module, sourced from the provider's pricing page, and subtract cached tokens from the full-price input count — otherwise cached reads are billed twice at the wrong rate. A model missing from the table should throw, not default to zero, or a new model silently costs nothing.

## 7. Verify

1. `/run-test` — a stubbed `429` with `retry-after: 1` produces exactly one wait and one retry
2. A stubbed `400` does not retry
3. Every completion in the logs has a request id, model, and total token count
4. A streamed answer produces a usage row equal to the non-streamed answer for the same prompt
5. Sum the logged cost for a test run and compare it with the provider's usage dashboard for the same window
6. `/run-verify`

## Pitfalls

- Retrying a `400`, which repeats a request the server already rejected deterministically.
- Treating `maxRetries` as free — it multiplies latency for a failing request.
- Ignoring `retry-after` and retrying into the same exhausted quota.
- Setting `timeout` high enough that a hung request holds a worker for minutes.
- Reading `usage` from a stream that did not request it, then logging zeros.
- Retrying a tool-calling turn that already performed a side effect, duplicating the write.
- Cost calculated from `total_tokens` alone, which hides the much cheaper cached input and the much more expensive output.

## Related

- `references/apis.md`
- `best-practices/usage.md`
- `usecases/structured-output.md`
- `usecases/tool-calling-loop.md`
