# Use Case — Server-Sent Events (SSE) Streaming

> Stream server→client updates over plain HTTP: live feeds and token-by-token LLM output. Source: https://nitro.build/docs/websocket (SSE section), createEventStream from nitro/h3 (accessed 2026-10-20)

## 1. When SSE, not WebSocket

Use SSE when the flow is one-way server→client (notifications, progress, LLM tokens). It uses standard HTTP, reconnects automatically via `EventSource`, and needs no upgrade handshake. Choose WebSocket (`realtime-websocket.md`) only when the client must also push frames.

## 2. Basic stream

```ts [routes/sse.ts]
import { defineHandler } from "nitro";
import { createEventStream } from "nitro/h3";

export default defineHandler((event) => {
  const stream = createEventStream(event);

  const interval = setInterval(async () => {
    await stream.push(`Message @ ${new Date().toLocaleTimeString()}`);
  }, 1000);

  stream.onClosed(() => clearInterval(interval)); // always clean up

  return stream.send();
});
```

Client:

```js
const source = new EventSource("/sse");
source.onmessage = (event) => console.log(event.data);
```

## 3. Structured messages

`push` accepts an object with the SSE fields `id`, `event`, `data`, `retry`:

```ts
await stream.push({
  id: String(id++),
  event: "update",
  data: JSON.stringify({ value: Math.random() }),
  retry: 3000,
});
```

The client listens per named event with `source.addEventListener("update", ...)`.

## 4. Stream an upstream LLM response

```ts [server/routes/api/chat.stream.post.ts]
import { defineHandler } from "nitro";
import { createEventStream } from "nitro/h3";

export default defineHandler(async (event) => {
  const upstream = await fetch("https://example.com/llm", {
    method: "POST",
    body: await event.req.text(),
  });

  const stream = createEventStream(event);
  const reader = upstream.body!.getReader();
  const decoder = new TextDecoder();

  (async () => {
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        await stream.push({ event: "token", data: decoder.decode(value, { stream: true }) });
      }
    } finally {
      await stream.close();
    }
  })();

  return stream.send();
});
```

## 5. Keep-alive on edge runtimes

On edge workers the instance can be torn down after the response unless work is registered. Tie the stream lifetime to the request with `event.waitUntil(...)` for the pump loop, and send periodic `retry`/comment frames so intermediaries don't close an idle connection.

## Pitfalls

- Leaking the `setInterval`/reader when the client disconnects → always close it in `onClosed`/`finally`.
- Returning a normal JSON body instead of `stream.send()` → the client never gets an event stream.
- Manually setting `content-type: text/event-stream` — `createEventStream` sets the SSE headers for you.
- Emitting raw objects as `data` without serializing → multi-line/JSON payloads must be string per SSE framing.
- Assuming two-way chat over SSE → the client cannot send on the same channel; that's a WebSocket case.

## Related

- `references/apis.md`
- `references/cli.md`
- `best-practices/deploy.md`
- `usecases/realtime-websocket.md`
