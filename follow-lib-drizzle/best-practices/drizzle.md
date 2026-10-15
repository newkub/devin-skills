# Drizzle ORM — Best Practices

Schema-first ORM patterns, query discipline and migration hygiene

## Recommended Patterns

- Schema = single source of truth — write `pgTable`/`sqliteTable`/`mysqlTable` to mirror the real DB, relations in separate `relations()` blocks
- Relational queries (`db.query.table.findMany({ with: ... })`) for reads that need nested — core API (`select().from().leftJoin()`) when you must tightly control columns/shape
- Prepared statements for hot paths: `db.select()...prepare()` — reuse across requests
- Transactions: `db.transaction(async (tx) => ...)` for multi-write — don't trust partial success
- Indexes/unique/FK always declared in the schema — don't rely on a DB that was "once done by hand"

## Common Pitfalls

- `drizzle-kit generate` vs `push` — `generate` = migration files (production), `push` = dev-only shortcut; never push on a prod schema
- Migration files = artifacts that must be committed — never regenerate over history that was already applied
- `with` nested queries can create N+1 patterns if `limit` isn't controlled — beware deep nesting + big tables
- `.returning()` works only on supporting dialects (pg/sqlite) — mysql doesn't have it
- Snake↔camel: use the `casing` option in the drizzle config instead of writing every column name yourself

## Perf Notes

- Pick columns deliberately (`select({ id: t.id })`) — `select *` drags JSON blobs/bytea unnecessarily
- `db.$count` / `sql` fragments for aggregates — don't fetch rows just to count them yourself
- Connection: use a pool driver (`postgres.js`, `@electric-sql/pglite`, D1 adapter) per runtime — serverless → an adapter that doesn't hold sockets (neon/http, D1)

## Do / Don't

| Do | Don't |
|----|-------|
| schema-first + `generate` migrations | `push` on production |
| prepared statements in hot paths | rebuild query objects every request |
| transactions for multi-write | sequential non-atomic writes |
| indexes/FK in the schema | hand-made DB constraints outside the repo |
