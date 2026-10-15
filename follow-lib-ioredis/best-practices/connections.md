# ioredis — Connection Management

## Recommended Patterns

### Client Lifecycle

- create one client shared across the whole app (singleton) — `new Redis(url)` or `new Redis({host, port, ...})`
- reuse the connection, don't open/close per request — TCP handshake + AUTH is expensive
- credentials always from `REDIS_URL`/env — never hardcode (see `/follow-secret-manager`)
- graceful shutdown: `await redis.quit()` lets pending commands finish — `redis.disconnect()` only when cutting immediately

### Reconnect Strategy

- `retryStrategy(times)` returns a delay in ms (or `null` to stop retrying) — use exponential backoff: `Math.min(times * 200, 2000)`
- `maxRetriesPerRequest` caps retries per command — the default suits general use; BullMQ requires `null`
- `lazyConnect: true` when deferring the connection until the first command — fits serverless that imports but may not use
- `enableOfflineQueue` — default `true` queues commands during reconnect; set `false` when you want fail fast

### Ready Vs Connect Events

- `connect` = TCP ready, `ready` = the client is truly usable (AUTH/select db done)
- send commands from the `ready` listener, not `connect` — especially when `enableOfflineQueue: false` (commands in the connect listener may reject)
- in v6 RESP3 mode, a subscriber connection can run regular commands while subscribed — but separating connections is still the clearer pattern

### Pub/Sub Isolation

- separate the subscriber connection from the command client — RESP2 subscriber mode blocks all other commands
- the publisher can use a normal client — publish needs no dedicated connection
- `psubscribe` for pattern-based channels — check the `pmessage` event separately from `message`

### Cluster And Sentinel

- `new Redis.Cluster([{host, port}, ...], {redisOptions: {...}})` — per-node options go in `redisOptions` in v6
- `clusterRetryStrategy` controls slot refresh/retry during topology changes
- Sentinel: `new Redis({sentinels: [...], name: 'mymaster'})` — set `sentinelPassword` separately from `password` if they differ
- MOVED/ASK redirects are handled automatically — no need to handle them yourself

## Do / Don't

| Do | Don't |
|---|---|
| share one client instance across the app | `new Redis()` on every request |
| `await redis.quit()` at shutdown | `disconnect()` cutting off pending commands |
| send commands from the `ready` listener | send from `connect` when the offline queue is off |
| separate the subscriber connection | sharing a subscriber with the command client (RESP2) |
| set `maxRetriesPerRequest: null` for BullMQ | using the default with BullMQ, losing jobs |
| TLS when crossing a public network | exposing the Redis port on the public internet without TLS |

## Common Pitfalls

- `new Redis()` in a request handler → connection leaks, Redis `maxclients` fills up
- forgetting `quit()` at shutdown → pending commands lost or the process hangs
- BullMQ with the default `maxRetriesPerRequest` → blocking commands fail after the retry limit
- assuming the `connect` event can send commands → commands reject before AUTH completes
- Cluster `redisOptions` placed at the wrong level (top-level instead of nested) → options never applied

## Performance Notes

- connection reuse is the main latency win — handshake + AUTH carry a cost
- an aggressive `retryStrategy` (retrying too fast) hammers the server while it's down — backoff + jitter
- the offline queue eats memory during long reconnects — `enableOfflineQueue: false` for fail-fast services

## Ecosystem / Integration

- on Cloudflare Workers/edge runtimes there is no TCP → use a REST client (Upstash) instead
- TLS via option `{tls: {}}` or a `rediss://` URL — managed Redis (ElastiCache, Upstash) forces TLS
- v6 defaults to RESP3 (`HELLO 3` + auto-fallback to RESP2) — `protocol: 2` keeps v5 wire behavior
