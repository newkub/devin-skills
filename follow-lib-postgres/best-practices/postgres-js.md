# Best Practices: postgres.js (postgres Driver)

Guidelines for using the `postgres` driver safely against injection, without overflowing the pool, and with correct transactions

## Recommended Patterns

- Create the client once per app — `postgres(url, {max, prepare, idle_timeout})` — the pool manages itself
- Always query with tagged templates `` sql`SELECT * FROM t WHERE id = ${id}` `` — automatically parameterized, prevents SQL injection
- Transact with `sql.begin(async sql => {...})` — the callback gets a tx-scoped `sql`; an error = automatic rollback
- Insert/update helpers: `sql(table).insert({...})` or `sql([{...}])` for bulk — reduces dynamic SQL
- LISTEN/NOTIFY via `sql.listen(channel, cb)` / `sql.notify(channel, payload)` — simple realtime without a separate pub/sub
- `sql.subscribe(pattern, cb)` for row-change events — it creates a dedicated connection for you
- Close the pool with `await sql.end()` in shutdown — graceful drain

## Do / Don't

| Do | Don't |
|---|---|
| Use tagged templates for every query | concatenate strings into SQL (injection) |
| `sql.unsafe(str, params)` only for genuinely dynamic identifiers | use `sql.unsafe` with raw user input |
| Set pool `max` per DB capacity + app concurrency | open a connection per request (serverless) — use a pooler |
| `sql.begin` for multi-statement atomicity | issue `BEGIN`/`COMMIT` yourself through `sql.unsafe` |
| Handle the `error` event + connection retry | assume the pool always heals itself |
| `sql.end()` in graceful shutdown | kill the process leaving connections hanging |

## Common Pitfalls

- String concat `` `WHERE id = ${id}` `` (not a tagged template) = injection — the template tag must always be the `sql` prefix
- `sql.unsafe` with dynamic table/column names — whitelist identifiers yourself; never pass user input directly
- Pool exhaustion: `max` set above Postgres's `max_connections` → connection refused; count across every instance
- A transaction callback that throws — rollback happens automatically, but swallowing the error inside the callback causes a silent failure
- LISTEN on a pooled connection — `sql.listen` uses a dedicated conn; don't assume the listener shares the query pool
- Prepared statement name collisions across sessions — `prepare: false` when debugging or with frequent dynamic shapes
- `sql.end({timeout})` doesn't wait — set a timeout so pending queries finish

## Performance Notes

- A `max` pool size of ~10-20 per instance is enough — more thrashes; it depends on query latency and DB size
- `prepare: true` (default) caches statements — repeating query shapes get faster; large dynamic IN clauses may invalidate
- `idle_timeout` + `connect_timeout` prevent zombie connections on serverless/spotty networks
- Serverless (Lambda, Workers): never open a pool per invocation — use PgBouncer, RDS Proxy, or Hyperdrive
- Batch with `sql([{...}]).insert` / unnest arrays instead of insert loops
- LISTEN/NOTIFY payload limit ~8KB — send an id/key, not the full payload

## Ecosystem / Integration

- ORM layer → `/follow-lib-drizzle` (drizzle uses postgres.js as its driver)
- Bun-only projects: consider the built-in `Bun.sql` — but postgres.js is more portable
- Separate migration tooling (drizzle-kit, or sql files) — the driver has no migrations
- PgBouncer/Hyperdrive for serverless pooling; connection string points at the pooler endpoint
