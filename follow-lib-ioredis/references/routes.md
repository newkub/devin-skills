# Lib Ioredis Routes / Topics

| Route / Topic | URL |
|---|---|
| API docs | https://redis.github.io/ioredis/ |
| Cluster | https://redis.github.io/ioredis/classes/Cluster.html |
| Sentinel | https://github.com/redis/ioredis#sentinel |
| Pub/Sub | https://github.com/redis/ioredis#pubsub |
| Pipelining | https://github.com/redis/ioredis#pipelining |
| Streams | https://github.com/redis/ioredis#stream |
| Lua scripting | https://github.com/redis/ioredis#lua-scripting |
| Migration v5→v6 | https://github.com/redis/ioredis/releases |

## Key Concepts

- `lazyConnect: true` — defer connect จน command แรก
- `retryStrategy` / `reconnectOnError` — custom reconnect logic
- v6: ESM+CJS dual, Node 18+, improved types — อ่าน migration notes ใน releases
- Pub/Sub connection แยกจาก command connection
