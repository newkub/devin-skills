# Use Case — Pub/Sub Fan-Out and a Distributed Lock

> Push events to every instance on a dedicated subscriber connection, and guard a critical section with a token-based lock. Source: https://github.com/redis/ioredis (accessed 2026-10-20)

## 1. Duplicate the connection for subscribing

```ts
import { redis } from "./redis.js"

const subscriber = redis.duplicate()

await subscriber.subscribe("orders.created")
subscriber.on("message", (channel, message) => {
  if (channel !== "orders.created") return
  handleOrder(JSON.parse(message))
})
```

In RESP2 a subscribed connection cannot run normal commands. A duplicate keeps the command client free; on RESP3 the same connection can do both, but a duplicate is still the simplest safe default.

## 2. Publish from the command client

```ts
await redis.publish("orders.created", JSON.stringify({ id: order.id }))
```

Publish after the transaction commits — subscribers must not see an event for a rollback.

## 3. Acquire a lock with SET NX PX

```ts
import { randomUUID } from "node:crypto"

async function acquire(key: string, ttlMs: number) {
  const token = randomUUID()
  const ok = await redis.set(key, token, "PX", ttlMs, "NX")
  return ok === "OK" ? token : null
}
```

`NX` makes the write conditional, `PX` guarantees the lock expires even if the holder dies. The token proves ownership.

## 4. Release only your own lock

```ts
const RELEASE = `
if redis.call("get", KEYS[1]) == ARGV[1] then
  return redis.call("del", KEYS[1])
end
return 0
`

async function release(key: string, token: string) {
  await redis.eval(RELEASE, 1, key, token)
}
```

A plain `DEL` can delete a lock that already expired and was re-acquired by another worker.

## 5. Handle the subscription lifecycle

```ts
process.on("SIGTERM", async () => {
  await subscriber.unsubscribe()
  subscriber.disconnect()
  redis.disconnect()
})
```

Close subscribers before the command client so in-flight handlers finish.

## Pitfalls

- Subscribing on the shared command client → every other command on that connection stalls.
- Releasing with `DEL` instead of the compare-and-delete script → deletes another worker's lock.
- Using pub/sub for durable work → messages are fire-and-forget; use a stream or a queue when delivery must be guaranteed.
- Setting no TTL on the lock → a crashed holder blocks the key forever.

## Related

- `references/apis.md`
- `best-practices/connections.md`
- `best-practices/performance.md`
- `usecases/cache-aside-reads.md`
