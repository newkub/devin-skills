# Use Case — Stream a Chat Response to the Browser

> Stream tokens from a server route so the UI shows progress instead of waiting for the whole answer. Source: https://platform.openai.com/docs/guides/streaming-responses (accessed 2026-10-20)

## 1. Create the stream on the server

```ts
import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY, maxRetries: 3 });
const MODEL = process.env.OPENAI_MODEL ?? "gpt-4.1-mini";

const stream = await client.chat.completions.create({
  model: MODEL,
  messages: [
    { role: "system", content: "Answer in concise paragraphs." },
    { role: "user", content: prompt },
  ],
  stream: true,
  stream_options: { include_usage: true },
});
```

`stream: true` changes the return type from a completion to an async iterable of chunks — nothing is awaited twice.

## 2. Expose it as an HTTP stream

```ts
// Hono-style handler — any runtime with Web streams works the same
app.post("/api/chat", async (c) => {
  const { prompt } = await c.req.json<{ prompt: string }>();
  const stream = await client.chat.completions.create({
    model: MODEL,
    messages: [{ role: "user", content: prompt }],
    stream: true,
    stream_options: { include_usage: true },
  });

  return new Response(stream.toReadableStream(), {
    headers: {
      "content-type": "text/event-stream; charset=utf-8",
      "cache-control": "no-cache, no-transform",
    },
  });
});
```

## 3. Consume it in the browser

```ts
async function ask(prompt: string, onDelta: (text: string) => void) {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ prompt }),
  });
  if (!res.body) throw new Error(`stream failed: ${res.status}`);

  const reader = res.body.pipeThrough(new TextDecoderStream()).getReader();
  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    onDelta(value);
  }
}
```

The client never sees the API key — it only talks to your route.

## 4. Iterate chunks on the server when you need to post-process

```ts
let text = "";
let usage: OpenAI.CompletionUsage | undefined;

for await (const chunk of stream) {
  const delta = chunk.choices[0]?.delta?.content;
  if (delta) {
    text += delta;
    process.stdout.write(delta);
  }
  if (chunk.usage) usage = chunk.usage; // last chunk, thanks to include_usage
}

console.error({ chars: text.length, tokens: usage?.total_tokens });
```

Usage arrives only on the final chunk when `include_usage` is set — read it after the loop, not inside the first iteration.

## 5. Handle cancel and failure

```ts
const controller = new AbortController();
req.on("close", () => controller.abort());

try {
  const stream = await client.chat.completions.create(
    { model: MODEL, messages, stream: true },
    { signal: controller.signal },
  );
  // ...
} catch (err) {
  if (err instanceof OpenAI.APIUserAbortError) return;      // client went away
  if (err instanceof OpenAI.RateLimitError) return retryWithBackoff(stream);
  throw err;
}
```

Abort the upstream request when the browser disconnects, otherwise the tokens keep being billed for nobody.

## Pitfalls

- Proxying from the browser straight to the API exposes the key — stream through your own route.
- Forgetting `stream_options.include_usage` means no token accounting and no cost visibility.
- Buffering the whole response before sending defeats streaming; pipe the readable stream straight through.
- Missing `cache-control: no-cache, no-transform` lets proxies buffer or gzip the event stream into one late blob.
- JSON-parsing each chunk as a whole message fails — deltas are fragments; concatenate before rendering final markup.
- Ignoring `OpenAI.APIUserAbortError` turns a normal client disconnect into a 500 and a log-spam loop.

## Related

- `references/apis.md`
- `best-practices/usage.md`
- `usecases/structured-output.md`
