# Lib Postgres API & Dependencies

## Install

```sh
bun add postgres   # postgres.js — porsager/postgres
```

## Version

- Latest: `3.4.9` (verified 2026-09-11)
- [Package Registry](https://www.npmjs.com/package/postgres)
- [Repository](https://github.com/porsager/postgres)

## Dependencies

- Zero runtime dependencies — pure JS driver
- Bun มี `Bun.sql` built-in (postgres.js-compatible API) — พิจารณาถ้าบน Bun only

## Common API / Commands

| api | description | default | options |
|---|---|---|---|
| `postgres(url, opts)` | Create client | - | `host`, `max`, `ssl`, `prepare`, `idle_timeout`, `connect_timeout` |
| `` sql`SELECT ...` `` | Tagged template query | - | auto-parameterized |
| `sql.begin(fn)` / `sql.transaction` | Transaction | - | callback receives tx `sql` |
| `sql.unsafe(str, params)` | Raw query | - | ใช้เมื่อ dynamic identifiers |
| `` sql([{...}]).insert/update `` | Helper insert/update | - | `sql(table)` |
| `sql.listen(channel, cb)` | LISTEN/NOTIFY | - | - |
| `sql.end()` | Close pool | - | `{timeout}` |

## Source

- Official docs: https://github.com/porsager/postgres
- Description: Fastest full-featured PostgreSQL client — tagged template literals.
