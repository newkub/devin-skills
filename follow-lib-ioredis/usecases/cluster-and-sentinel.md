# Use Case — Cluster and Sentinel

> Point the client at a managed Redis topology instead of one host, and keep multi-key commands on a single slot. Source: https://github.com/redis/ioredis (accessed 2026-10-20)

## 1. Cluster with per-node options

```ts
import Redis from "ioredis";

export const redis = new Redis.Cluster(
  [
    { host: "10.0.0.11", port: 6379 },
    { host: "10.0.0.12", port: 6379 },
    { host: "10.0.0.13", port: 6379 },
  ],
  {
    redisOptions: {
      password: process.env.REDIS_PASSWORD,
      tls: {},
    },
    scaleReads: "slave",
    slotsRefreshTimeout: 2_000,
  },
);
```

In the current major, connection options belong under `redisOptions`. Passing `password` or `tls` at the top level of the cluster options is accepted by the type checker in some versions and then ignored, which surfaces as `NOAUTH` on the first command rather than a config error.

`scaleReads: "slave"` sends read commands to replicas; writes still go to the master of each slot. Use `"master"` when every command must see the latest write.

## 2. Keep related keys in one slot

```ts
const userKey = (id: string, field: string) => `{user:${id}}:${field}`;

await redis.mset({
  [userKey("42", "name")]: "ada",
  [userKey("42", "role")]: "admin",
});

const [name, role] = await redis.mget(
  userKey("42", "name"),
  userKey("42", "role"),
);
```

Cluster hashes the whole key, so `user:42:name` and `user:42:role` can land on different shards and `MGET` fails with `CROSSSLOT Keys in request don't hash to the same slot`. The `{...}` hash tag pins every key in the group to one slot.

## 3. Sentinel for a single master with failover

```ts
export const redis = new Redis({
  sentinels: [
    { host: "10.0.0.21", port: 26379 },
    { host: "10.0.0.22", port: 26379 },
  ],
  name: "mymaster",
  sentinelPassword: process.env.SENTINEL_PASSWORD,
  role: "master",
});
```

`name` must match the master name configured on the Sentinels — a mismatch produces a client that connects to nothing and retries forever. Sentinel is the right topology when you have one primary and one or more replicas and no sharding.

## 4. Choose the topology from the deployment, not the habit

| Deployment | Client |
|---|---|
| Single managed instance or replica pair | `new Redis(url)` |
| Primary with automatic failover | Sentinel |
| Sharded dataset that outgrows one node | `Redis.Cluster` |

Moving from a single node to a cluster is a data-model change, not a connection-string change: every multi-key command that worked before now needs a hash tag or a redesign.

## 5. Verify the topology you think you have

```ts
const masters = redis.nodes("master");
console.log(masters.map((node) => `${node.options.host}:${node.options.port}`));

await redis.mset({ "{user:42}:name": "ada", "{user:42}:role": "admin" });
await redis.mget("{user:42}:name", "{user:42}:role");
```

1. `nodes("master")` returns one master per shard, matching the cluster's slot map
2. The two hash-tagged commands succeed with no `CROSSSLOT` error
3. Stop one replica in staging — reads keep working and the client logs a reconnect
4. `/run-test` — the cache layer passes with the cluster client, not only against a local single node

## Pitfalls

- Putting `password`/`tls` at the top level of the cluster options instead of inside `redisOptions`.
- Running `KEYS`, `FLUSHALL`, or a wide `SCAN` on a cluster and expecting one global result.
- Using multi-key commands without hash tags, then treating `CROSSSLOT` as a client bug.
- Setting `scaleReads: "all"` on a workload that reads its own writes, so a replica lag shows up as missing data.
- Configuring Sentinel with a `name` that does not match the monitored master.

## Related

- `references/apis.md`
- `best-practices/connections.md`
- `best-practices/performance.md`
- `usecases/connection-lifecycle-and-reconnect.md`
- `usecases/resp3-and-tls-migration.md`
