# Use Case — Rename a Column Without Losing Data

> drizzle-kit diffs schema snapshots, so a rename is indistinguishable from a drop plus an add unless someone reads the generated SQL. This walks the rename from `generate` to `migrate` with the rows intact. Source: https://orm.drizzle.team/docs/kit-overview (accessed 2026-10-21)

## 1. Generate the migration, then read it

```bash
bunx drizzle-kit generate --name rename_shop_title
```

Open the new file under `drizzle/`. A rename drizzle-kit did not detect looks like this:

```sql
ALTER TABLE "shops" DROP COLUMN "title";
ALTER TABLE "shops" ADD COLUMN "name" text NOT NULL;
```

Applied as written, every title is gone — and the `NOT NULL` add rejects a non-empty table unless a default is supplied.

## 2. Rewrite it as a rename before anything runs

```sql
ALTER TABLE "shops" RENAME COLUMN "title" TO "name";
```

The migration has not been applied, so editing the SQL is safe. Leave `drizzle/meta/` alone: the snapshots already describe the new schema, and they are what the next `generate` diffs against.

## 3. Keep a constraint change in its own statement

If the rename also changes nullability or type, do it after the rename rather than as part of the add:

```sql
ALTER TABLE "shops" RENAME COLUMN "title" TO "name";
ALTER TABLE "shops" ALTER COLUMN "name" SET NOT NULL;
```

On SQLite the second statement needs a table rebuild (new table, copy, drop, rename) — a dialect fact you have to write out, not something `generate` infers.

## 4. Rehearse on a copy of the database

```bash
cp data/buuyook.db data/rehearse.db
DATABASE_URL=file:data/rehearse.db bunx drizzle-kit migrate
```

The journal must advance by exactly one entry and the copy must finish clean. A failed rehearsal is a free failure.

## 5. Move every reference in the same change

The schema types feed the queries and the UI, so rename the usages together: schema file, query layer, form fields, seed data. A half-renamed column typechecks until the first query runs.

## 6. Verify

1. `bunx drizzle-kit check` — no journal collision introduced by the edit
2. `bunx drizzle-kit migrate` on the copy — one entry consumed, no error
3. Compare row count and a checksum of the renamed column before/after on the copy
4. `bunx drizzle-kit studio` — inspect the copy, confirm the column holds the old values
5. `/run-test` on the queries that read the column
6. Rollback path ready: the inverse migration (or the backup) before this runs anywhere real

## Pitfalls

- Hand-editing `drizzle/meta/` to "fix" the rename — snapshots are the diff base, hand edits desync every later `generate`.
- Editing a migration that is already applied instead of writing a new one.
- Reaching for `push` to skip the problem: it takes the same diff path and drops the column with no journal entry.
- Renaming a column and changing its type in a single statement — `RENAME` plus `ALTER COLUMN` fails on most engines and invites a drop/add instead.
- Doing the "safe" half now and dropping the old column in a later deploy — same data loss, one deploy later.

## Related

- `references/apis.md`
- `references/cli.md`
- `best-practices/migrations.md`
- `workflows/migrate-schema/SKILL.md`
- `usecases/ci-migration-collision-gate.md`
