# ioredis — Data Access And Performance

## Recommended Patterns

### Pipelining And Transactions

- batch commands with `redis.pipeline()` — sends many commands in one round-trip, cutting latency a lot
- `redis.multi()` for transactions (atomic EXEC) — use when commands must be all-or-nothing
- pipeline vs multi differ: pipeline = batch (not atomic), multi = transaction (atomic, WATCH support)
- split very large pipelines into chunks (~hundreds per batch) — a ten-thousand-command pipeline eats memory on both sides

### Key Patterns

- `SCAN` instead of `KEYS` — `KEYS *` blocks the server on a large keyspace; `scanStream()` iterates as a stream
- the `keyPrefix` option sets a prefix automatically on every command — beware with Cluster (hash tag constraints) and when reading keys written by other clients
- always expire cache keys — `SET key val EX 300` or `EXPIRE` afterwards — memory leaks from no-TTL keys are real
- use `SET key val NX EX` for distributed locks — atomic check-and-set

### Atomic Operations

- use Lua scripts via `redis.eval`/`defineCommand` when an atomic read-modify-write is needed that multi can't do
- `defineCommand` registers a script as a method — easier to reuse than raw eval
- prefer `EVALSHA` semantics via `defineCommand` — the script is cached server-side

### Monitoring

- `INFO` for memory/clients/hit ratio — `used_memory`, `connected_clients`, `keyspace_hits/misses`
- `SLOWLOG` to find slow commands — O(N) commands on big collections usually show up here
- `MONITOR` for debugging only — it logs every command, extremely costly in production

## Do / Don't

| Do | Don't |
|---|---|
| `pipeline()` for batch reads/writes | `await`-ing one command at a time in a loop |
| `multi()` when atomicity is required | using a pipeline then expecting atomicity |
| `SCAN`/`scanStream` to iterate the keyspace | `KEYS *` in production |
| set a TTL on every cache key | leaving keys without expiry until memory fills |
| Lua scripts for read-modify-write | separate GET → modify → SET (race condition) |
| chunk big pipelines | one pipeline of ten thousand commands |

## Common Pitfalls

- `KEYS` or `SMEMBERS` on a large collection → blocks the Redis-side event loop
- a pipeline without `.exec()` → commands never sent
- `multi().exec()` returns an array of `[err, result]` — you must check errors yourself, the promise doesn't reject collectively
- `keyPrefix` + Cluster → CROSSSLOT errors if the prefix has no hash tag `{...}`
- separate GET→SET for a counter → race condition; use `INCR` or Lua

## Performance Notes

- pipelines cut RTT — 100 commands: ~100 RTT → 1 RTT (a big win on remote Redis)
- `multi` carries slightly more overhead than a pipeline (EXEC wrapping) — use only when atomicity is needed
- hashes (`HSET`) save memory versus flat keys when storing many object fields
- large values (>100KB) should be compressed or kept in object storage — Redis is a memory store

## Ecosystem / Integration

- BullMQ requires `maxRetriesPerRequest: null` + `enableReadyCheck: false` on a shared client
- cache-aside pattern: GET → miss → DB → SET EX — standard, no extra lib needed
- for edge runtimes without TCP → a REST-based client (Upstash) instead
- v6 defaults to RESP3 — `replyStyle: 'resp3'` when you want RESP3 reply shapes, `protocol: 2` if the old stack needs RESP2
