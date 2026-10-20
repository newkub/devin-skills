# Use Case — Connection Lifecycle and Reconnect

> Control when the client connects, what happens while the server is away, and how the process exits. Source: https://github.com/redis/ioredis (accessed 2026-10-20)

## 1. Connect explicitly in short-lived processes

```ts
import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL!, {
  lazyConnect: true,
  maxRetriesPerRequest: 2,
});

await redis.connect();
```

A script, CLI, or serverless handler that creates a client and exits has no time for the default eager connect plus infinite retry. `lazyConnect` defers the socket until `connect()` is awaited, and `maxRetriesPerRequest` bounds how long a command waits before rejecting.

## 2. Bound the retry strategy

```ts
const redis = new Redis(process.env.REDIS_URL!, {
  retryStrategy(times) {
    if (times > 10) return null;
    return Math.min(times * 200, 2_000);
  },
});
```

Returning a number schedules another attempt after that many milliseconds; returning `null` stops reconnecting and lets the process fail. A strategy that always returns a delay keeps a broken deployment alive forever, retrying behind a health check that never turns red.

## 3. Decide what commands do while the socket is down

```ts
const worker = new Redis(process.env.REDIS_URL!, {
  enableOfflineQueue: false,
  maxRetriesPerRequest: 1,
});

worker.on("ready", async () => {
  await worker.subscribe("orders");
  console.log("subscribed after reconnect");
});
```

With the offline queue enabled, commands issued before the connection is ready are buffered and replayed later — convenient for a cache read, dangerous for a job that must not run twice. With it disabled, the command rejects immediately instead of hanging. In that mode, subscribe from the `ready` event rather than `connect`: at `connect` the client can still reject the command before the handshake finishes.

## 4. Log the whole lifecycle once

```ts
for (const event of ["connect", "ready", "close", "reconnecting", "end"] as const) {
  redis.on(event, (...args: unknown[]) => logger.info({ event, args }, "redis"));
}

redis.on("error", (error) => logger.error({ error }, "redis error"));
```

An `error` listener is mandatory: without one, Node treats a connection error as an unhandled event and crashes the process. The other events explain the timeline — `close` then `reconnecting` is a lost socket, `end` means the strategy gave up.

## 5. Shut down without losing replies

```ts
async function shutdown(signal: string) {
  logger.info({ signal }, "shutting down");
  await redis.quit();
  process.exit(0);
}

process.on("SIGTERM", () => void shutdown("SIGTERM"));
```

`quit()` sends `QUIT` and waits for pending replies; `disconnect()` closes the socket immediately and drops them. A deploy that calls `disconnect()` in the shutdown hook truncates in-flight writes and leaves the client reporting success locally.

## 6. Verify

1. Start the app with Redis stopped — commands reject per `maxRetriesPerRequest` instead of hanging
2. Start Redis — the client reaches `ready` and the subscription is re-established once
3. Kill the container — the process exits within the retry budget instead of retrying forever
4. Send `SIGTERM` with work in flight — the process exits after the pending commands finish
5. `/run-test` — the connection options are exercised in a test that stops and restarts a local Redis

## Pitfalls

- Setting `lazyConnect: true` and forgetting `await redis.connect()`, so every command queues forever.
- A `retryStrategy` that never returns `null`, which hides a dead dependency behind endless retries.
- Issuing `subscribe()` at module scope with `enableOfflineQueue: false`, so it rejects with "Stream isn't writeable".
- Calling `quit()` twice in overlapping shutdown hooks, which rejects the second call and skips cleanup.
- Handling `SIGTERM` without a timeout, so a stuck socket blocks the deploy until the platform kills the process.

## Related

- `references/apis.md`
- `best-practices/connections.md`
- `usecases/cache-aside-reads.md`
- `usecases/cluster-and-sentinel.md`
- `usecases/resp3-and-tls-migration.md`
