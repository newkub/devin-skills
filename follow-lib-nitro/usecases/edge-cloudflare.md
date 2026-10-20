# Use Case — Deploy to Cloudflare Workers (Edge)

> Build to a Worker module with `cloudflare-module`, wire D1/KV/R2 bindings, and deploy with wrangler. Source: https://nitro.build/deploy/providers/cloudflare, /follow-service-cloudflare (accessed 2026-10-20)

## Pick the preset

Set the preset via env or `nitro.config.ts` — v3 `nitro()` does **not** accept a `preset` option, and never set both to conflicting values.

```bash
NITRO_PRESET=cloudflare-module bun run build
```

Output is a Worker module (not `.output/server/index.mjs`) — deploy with `wrangler deploy`.

## Declare bindings

```jsonc [wrangler.jsonc]
{
  "name": "my-nitro-app",
  "main": ".output/server/index.mjs",
  "compatibility_date": "2026-01-01",
  "d1_databases": [
    { "binding": "DB", "database_name": "app-db", "database_id": "<id>" }
  ],
  "kv_namespaces": [
    { "binding": "CACHE", "id": "<namespace-id>" }
  ],
  "r2_buckets": [
    { "binding": "ASSETS", "bucket_name": "uploads" }
  ]
}
```

Generate types so bindings are typed in handlers:

```bash
wrangler types   # → worker-configuration.d.ts (Env with DB, CACHE, ASSETS)
```

## Read bindings in a handler

```ts [server/routes/api/notes.get.ts]
import { defineHandler } from "nitro";

export default defineHandler(async (event) => {
  const { DB } = event.context.env as Env; // bindings on the request env
  const { results } = await DB.prepare("SELECT id, text FROM notes").all();
  return results;
});
```

- `Env` comes from the generated `worker-configuration.d.ts` — never hand-type binding shapes.
- Map Nitro's storage/cache/database layers to CF primitives: KV binding → `cloudflare-kv-binding` driver, D1 → `cloudflare-d1` connector.

## Storage + cache on KV

```ts [nitro.config.ts]
import { defineConfig } from "nitro";

export default defineConfig({
  kv: {
    cache: { driver: "cloudflare-kv-binding" }, // binds the KV namespace
  },
  cache: { driver: "kv" },
});
```

## SQL database on D1

```ts [nitro.config.ts]
export default defineConfig({
  experimental: { database: true },
  database: {
    default: { connector: "cloudflare-d1" },
  },
});
```

```ts
import { useDatabase } from "nitro/database";
const db = useDatabase();
const { rows } = await db.sql`SELECT * FROM notes`;
```

## Secrets & env

- Secrets: `wrangler secret put STRIPE_WEBHOOK_SECRET` — never in `vars` or committed config.
- Non-secret vars: `vars` in `wrangler.jsonc`.
- `runtimeConfig` overrides via `NITRO_*` env on the dashboard.
- Follow `/follow-service-cloudflare` for deploy/secrets/rollback depth.

## Scheduled tasks → Cron Triggers

`scheduledTasks` in `nitro.config.ts` are compiled into native Cloudflare Cron Triggers at build time — no manual wrangler `triggers` needed (see `background-tasks.md`).

## Verify

1. `wrangler deploy` → smoke-test a critical route on the Worker URL.
2. Confirm a binding is present: log/handle `event.context.env.DB` — `undefined` = the binding isn't declared in `wrangler.jsonc`.
3. Rollback path: keep the previous build or use a CF version rollback.

## Pitfalls

- Deploying to Cloudflare without declaring a binding → `env.X` is `undefined` at runtime.
- Using Node APIs (`fs`, `path`, `node:sqlite`) on a Worker → they don't exist on edge; use portable APIs + D1/KV/R2.
- `fs` storage/cache driver on Workers → not persistent; use the `kv`/binding drivers.
- Passing `preset` into the `nitro()` vite plugin → v3 ignores/errors; use `NITRO_PRESET` or config.
- Hardcoding a `database_id`/namespace `id` from another environment → point each env at its own resources.
