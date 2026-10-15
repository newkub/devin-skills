# drizzle-kit Best Practices

Guidance for using `drizzle-kit` to manage schema migrations safely — generate, migrate, push, studio

## Recommended Patterns

### 1. Correct workflow: push in dev, migrate in production

```bash
# local dev — iterate fast without creating migration files
drizzle-kit push

# when the schema is ready to ship — create real migration files
drizzle-kit generate --name add_users_table

# apply on staging/production
drizzle-kit migrate
```

Rationale: `push` mutates the DB directly from the schema diff with no audit trail — suitable only for throwaway dev databases; `migrate` applies committed SQL files, making deploys reproducible and rollback possible

### 2. Review generated SQL every time

`drizzle-kit generate` uses snapshot diffing — rename detection is incomplete:

- a column rename may generate `DROP COLUMN` + `ADD COLUMN` → data loss
- a table rename may generate `DROP TABLE` + `CREATE TABLE` → whole-table data loss

If you see this pattern, edit the SQL in the migration file to `ALTER TABLE ... RENAME COLUMN ...` yourself before applying (only if it has not been migrated yet)

### 3. Always commit migrations to git

```
drizzle/
├── 0000_init.sql
├── 0001_add_users_table.sql
└── meta/
    ├── _journal.json
    └── snapshots/
```

Both SQL files and `meta/` snapshots must be in version control — snapshots are what `generate` diffs against next time; if they are lost, generated migrations will be wrong

### 4. Custom migrations for data changes

`generate` only sees schema diff — not data migrations such as backfill, seed, or reindex; use:

```bash
drizzle-kit generate --custom --name backfill_user_roles
```

You get an empty migration file to write SQL in, and the journal still tracks it correctly

### 5. A good drizzle.config.ts

```typescript
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/db/schema.ts',
  out: './drizzle',
  dbCredentials: {
    url: process.env.DATABASE_URL!
  },
  verbose: true,
  strict: true
})
```

- Use `strict: true` so interactive prompts confirm destructive changes (push)
- `dbCredentials` reads from env vars — never hard-code a connection string
- Multiple environments → multiple config files, selected with `--config`

## Do / Don't

| Do | Don't |
|---|---|
| use `migrate` in CI/CD and production | use `push` against a production DB |
| review each migration's SQL diff before commit | trust generated SQL without reading it |
| create a new migration when something must change | edit a migration that is already applied |
| use `--name` for readable migration names | leave long meaningless auto-generated names |
| back up the DB before migrating production | migrate production with no rollback plan |
| use `drizzle-kit check` for collisions before merging a PR | merge schema-changing branches without checking migration conflicts |

## Common Pitfalls

- Migration drift: editing SQL in `drizzle/` by hand desyncs the snapshots — the next `generate` will break or diff incorrectly; only edit migrations that are not yet applied
- Two developers generate at the same time: the journal sequence collides → use `drizzle-kit check` to catch the collision, then re-generate
- `push` on a real database with data: a destructive diff (drop/rename) can delete data — `strict: true` warns but should not be relied on for data you cannot lose
- Forgetting to commit `meta/` snapshots: others then generate migrations diffed against old snapshots → wrong output

## Performance / CI Notes

- In CI: run `drizzle-kit check` (fast, no DB needed) in the lint job to catch migration collisions before merge
- `migrate` in the deploy step needs a real DB connection — inject `DATABASE_URL` through secrets only
- `drizzle-kit export` converts schema to DDL without a DB — usable to verify schema output in CI
- `drizzle-kit pull` is useful when adopting drizzle with an existing DB — introspection yields a ready `schema.ts`, but clean it up before committing (naming, relations)
- `drizzle-kit studio` opens a local UI for browsing data — never open it with shared production credentials
