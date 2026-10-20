# Use Case — Cache-Aside Reads With ioredis

> One shared client, JSON values with a TTL, and a cache miss path that cannot stampede. Source: https://github.com/redis/ioredis (accessed 2026-10-20)

## 1. Create one client per process

```ts
import Redis from "ioredis"

export const redis = new Redis(process.env.REDIS_URL!, {
  maxRetriesPerRequest: 3,
  enableOfflineQueue: true,
})
```

A new client per request opens a new TCP connection each time; keep a module-level singleton.

## 2. Cache-aside read

```ts
async function getProduct(id: string) {
  const key = `product:${id}`
  const cached = await redis.get(key)
  if (cached) return JSON.parse(cached) as Product

  const product = await db.product.find(id)
  await redis.set(key, JSON.stringify(product), "EX", 300)
  return product
}
```

`EX` keeps a TTL on every write — a cache entry without expiry outlives the schema that produced it.

## 3. Invalidate on write

```ts
async function updateProduct(id: string, patch: Partial<Product>) {
  const product = await db.product.update(id, patch)
  await redis.del(`product:${id}`)
  return product
}
```

Invalidate after the database commit, never before: a failed write must not leave the cache empty of a value that still exists.

## 4. Batch related reads with a pipeline

```ts
const keys = ids.map((id) => `product:${id}`)
const rows = await redis.pipeline(keys.map((k) => ["get", k])).exec()
```

A pipeline sends one round trip instead of N; use `multi()` only when the commands must be atomic.

## 5. Fail soft

```ts
try {
  return await getProduct(id)
} catch (error) {
  logger.warn({ error }, "redis unavailable, falling back to db")
  return db.product.find(id)
}
```

Redis being down should degrade latency, not availability.

## Pitfalls

- Storing objects without `JSON.stringify` → ioredis stores `[object Object]`.
- Forgetting the TTL → stale values survive deploys and data fixes.
- Creating a client inside a request handler → connection churn and file-descriptor leaks.
- Using `KEYS *` to invalidate a group → blocks the server; keep an index set or version the key prefix.

## Related

- `references/apis.md`
- `best-practices/connections.md`
- `best-practices/performance.md`
- `usecases/pubsub-and-locks.md`
