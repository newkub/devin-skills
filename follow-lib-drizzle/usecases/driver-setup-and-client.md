# Use Case — Driver Setup and a Single Client

> Choose the driver the runtime can actually reach, create one client per process, and pass the schema so every query is typed. Source: https://orm.drizzle.team/docs/get-started (accessed 2026-10-20)

## 1. Postgres with `postgres-js`

```ts
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const queryClient = postgres(process.env.DATABASE_URL!, { max: 10 });

export const db = drizzle({ client: queryClient, schema, casing: "snake_case" });
```

The driver mirrors the runtime, not the preference: `drizzle-orm/postgres-js` for Node/Bun, `drizzle-orm/neon-http` for a serverless Neon endpoint, `drizzle-orm/d1` for a Cloudflare binding, `drizzle-orm/bun-sqlite` / `drizzle-orm/better-sqlite3` for SQLite.

`casing: "snake_case"` lets the TypeScript schema use camelCase while the database columns stay snake_case — set it once here, not in every table.

## 2. Serverless and edge drivers

```ts
// Cloudflare Workers — the binding is the client
import { drizzle } from "drizzle-orm/d1";
export const db = (env: Env) => drizzle(env.DB, { schema });

// Neon over HTTP — no TCP pool
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
const sql = neon(process.env.DATABASE_URL!);
export const neonDb = drizzle({ client: sql, schema });
```

A Worker cannot hold a TCP pool across requests, so the D1 binding is created per request and the `neon-http` driver trades pooling for per-query HTTP. Do not import the postgres-js client into an edge bundle — it fails at build or at first query.

## 3. One client per process

```ts
declare global {
  var __db: ReturnType<typeof createDb> | undefined;
}

function createDb() {
  return drizzle({ client: postgres(process.env.DATABASE_URL!, { max: 10 }), schema });
}

export const db = globalThis.__db ?? createDb();
if (process.env.NODE_ENV !== "production") globalThis.__db = db;
```

Dev servers reload modules on every edit; without the global cache each reload opens a new pool and the database hits its connection limit after a few saves.

## 4. Verify

1. `/run-dev` — one pool per process; check `pg_stat_activity` after ten HMR reloads
2. `/run-typecheck` — a query on a table missing from `schema` is a type error
3. Cold start on the target runtime: a Worker bundle has no `pg` import
4. `/run-test` against a throwaway database; close the client in `afterAll` so the runner exits

## Pitfalls

- Mixing drivers in one process (a pooled client and an HTTP client over the same schema), which doubles the connections and splits transactions.
- Re-creating the client inside a request handler, exhausting the pool under load.
- Forgetting `schema`, which silently removes the relational query API (`db.query.*`).
- `casing` set on the client but not in the migration, so the generated SQL targets the wrong column names.
- Importing a Node driver in an edge runtime and only noticing at deploy time.

## Related

- `references/apis.md`
- `best-practices/drizzle.md`
- `usecases/schema-and-relations.md`
- `usecases/relational-queries-with.md`
