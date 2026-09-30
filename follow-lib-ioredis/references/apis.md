| key | value |
|---|---|
| version | 6.0.0 |
| package registry | https://www.npmjs.com/package/ioredis |
| repository | https://github.com/redis/ioredis |
| docs | https://redis.github.io/ioredis/ |

| api | description | default | options |
|---|---|---|---|
| `new Redis()` / `new Redis(url)` | Create client | localhost:6379 | `host`, `port`, `password`, `db`, `keyPrefix`, `lazyConnect` |
| `redis.get` / `set` / `del` | Key commands | - | `EX`, `NX`, pipeline |
| `redis.pipeline()` | Batch commands | - | `.exec()` |
| `redis.multi()` | Transaction | - | `.exec()` |
| `redis.subscribe` / `psubscribe` | Pub/Sub | - | - |
| `new Redis.Cluster([...])` | Cluster client | - | `redisOptions`, `clusterRetryStrategy` |
| `new Redis(..., {sentinels})` | Sentinel mode | - | `name`, `sentinelPassword` |
