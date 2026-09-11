# Lib Ioredis API & Dependencies

## Install

```sh
bun add ioredis
```

## Version

- Latest: `6.0.0` — major version: Node ≥20, RESP3 โดย default (`protocol: 2` คง wire protocol เดิม, `replyStyle: "resp3"` สำหรับ RESP3 shapes) (verified 2026-09-12)
- [Package Registry](https://www.npmjs.com/package/ioredis)
- [Repository](https://github.com/redis/ioredis)

## Dependencies

- Runtime: `cluster-key-slot`, `debug`, `redis-errors`, `redis-parser`, `standard-as-callback` ฯลฯ
- TypeScript types รวมอยู่ใน package

## Common API / Commands

| api | description | default | options |
|---|---|---|---|
| `new Redis()` / `new Redis(url)` | Create client | localhost:6379 | `host`, `port`, `password`, `db`, `keyPrefix`, `lazyConnect` |
| `redis.get` / `set` / `del` | Key commands | - | `EX`, `NX`, pipeline |
| `redis.pipeline()` | Batch commands | - | `.exec()` |
| `redis.multi()` | Transaction | - | `.exec()` |
| `redis.subscribe` / `psubscribe` | Pub/Sub | - | - |
| `new Redis.Cluster([...])` | Cluster client | - | `redisOptions`, `clusterRetryStrategy` |
| `new Redis(..., {sentinels})` | Sentinel mode | - | `name`, `sentinelPassword` |

## Source

- Official docs: https://redis.github.io/ioredis/
- Description: Robust Redis client for Node.js — cluster, sentinel, streams, Lua.
