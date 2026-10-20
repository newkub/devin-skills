# Use Case — RESP3 and TLS Migration

> Move to the current wire protocol deliberately, and connect over TLS without a certificate surprise. Source: https://github.com/redis/ioredis (accessed 2026-10-20)

## 1. Check what the connection actually negotiated

```ts
import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL!);
const info = (await redis.call("CLIENT", "INFO")) as string;

console.log(info.match(/resp=\d/)?.[0]); // resp=3 or resp=2
```

The client now opens the connection with `HELLO 3` and falls back to RESP2 when the server does not understand it. Reading `resp=` from `CLIENT INFO` tells you which one this connection ended up on — the fallback is per connection, so two services can disagree without any config difference.

## 2. Pin RESP2 while the fleet is mixed

```ts
const redis = new Redis(process.env.REDIS_URL!, {
  protocol: 2,
});
```

A proxy, an old self-hosted server, or a fork that answers `HELLO` incorrectly all produce a fallback you did not plan for. `protocol: 2` keeps the v5 wire behaviour everywhere, which makes the rollout a deliberate step instead of an accidental one.

## 3. Opt into the new reply shapes only when ready

```ts
const redis = new Redis(process.env.REDIS_URL!, {
  protocol: 3,
  replyStyle: "resp3",
});

const result = await redis.hgetall("user:42");
```

The default `replyStyle: "legacy"` converts RESP3 replies back to the JavaScript shapes the previous version returned, so existing code keeps working. `"resp3"` hands you the native shapes, which means code that assumes a flat object from `HGETALL` needs to handle the new structure. Change this one client at a time.

## 4. Subscribe on a RESP3 connection when you need commands too

```ts
const redis = new Redis(process.env.REDIS_URL!, { protocol: 3 });

await redis.subscribe("orders");
await redis.ping(); // works on RESP3; blocked on a RESP2 subscriber
```

On a RESP2 connection, entering subscriber mode blocks every other command until you unsubscribe, which is why the usual advice is a dedicated connection. On RESP3 that restriction is lifted — but only if the connection actually negotiated 3. Verify before removing the second client.

## 5. Connect over TLS

```ts
const redis = new Redis(`rediss://default:${process.env.REDIS_PASSWORD}@redis.example.com:6380`);
```

```ts
const redis = new Redis({
  host: "redis.example.com",
  port: 6380,
  tls: { servername: "redis.example.com" },
});
```

`rediss://` turns TLS on from the URL; the options form needs `tls` set explicitly. When you connect by IP, pass `servername` with the certificate's hostname — otherwise verification fails with `ERR_TLS_CERT_ALTNAME_INVALID` even though the certificate is valid.

## 6. Verify

1. `CLIENT INFO` on every service reports the same `resp=` value you intended
2. `/run-test` — the suite passes under `protocol: 2` and under `protocol: 3` with the legacy reply style
3. A test that reads a hash and a sorted set passes with `replyStyle: "resp3"`, or those code paths are updated
4. TLS handshake succeeds against the real hostname, not only against an IP
5. `/run-verify` — no `tls: {}` left on a plaintext local connection that now fails in development

## Pitfalls

- Assuming RESP3 is in use because it is the default, while the deployment silently fell back to RESP2.
- Switching `replyStyle` to `"resp3"` in one release across every service, so all consumers change at once.
- Removing the dedicated subscriber connection before confirming the connection negotiated RESP3.
- Connecting over TLS by IP without `servername`, then disabling verification to make it work.
- Leaving `tls: {}` in a local compose setup where the server speaks plaintext, which fails with a confusing handshake error.

## Related

- `references/apis.md`
- `best-practices/connections.md`
- `usecases/connection-lifecycle-and-reconnect.md`
- `usecases/cluster-and-sentinel.md`
- `usecases/pubsub-and-locks.md`
