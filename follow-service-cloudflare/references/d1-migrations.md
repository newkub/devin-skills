
# Wrangler D1 Migrations

D1 migrations for versioning database schema changes

## Subcommands

| Command | Description |
|---|---|
| `wrangler d1 migrations create [DB] [MESSAGE]` | Create a new migration file |
| `wrangler d1 migrations list [DB]` | List unapplied migrations |
| `wrangler d1 migrations apply [DB]` | Apply unapplied migrations |

## Migration Workflow

```bash
# 1. Create migration
bunx wrangler d1 migrations create my-db create_user_table
# Creates migrations/0001_create_user_table.sql

# 2. Edit SQL file
# Add CREATE TABLE, ALTER TABLE, etc.

# 3. Apply to local
bunx wrangler d1 migrations apply my-db --local

# 4. Apply to remote
bunx wrangler d1 migrations apply my-db --remote

# 5. List unapplied
bunx wrangler d1 migrations list my-db
```

## Flags

| Flag | Description |
|---|---|
| `--local` | Apply to local DB (for `wrangler dev`) |
| `--remote` | Apply to remote DB (production) |
| `--preview` | Apply to preview D1 DB |
| `--persist-to [DIR]` | Custom persistence directory (must be used with `--local`) |

## Migration File Format

- Naming: `{VERSION}_{DESCRIPTION}.sql` (e.g. `0001_create_user_table.sql`)
- Stored in the `migrations/` folder (created automatically)
- Each file is SQL queries that run in version order

```sql
-- migrations/0001_create_user_table.sql
CREATE TABLE IF NOT EXISTS users (
  user_id INTEGER PRIMARY KEY,
  email_address TEXT,
  created_at INTEGER,
  deleted INTEGER,
  settings TEXT
);
```

## Configuration

```jsonc
{
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "my-db",
      "database_id": "<UUID>",
      "migrations_table": "d1_migrations",
      "migrations_dir": "migrations",
      "migrations_pattern": "migrations/*.sql"
    }
  ]
}
```

| Key | Default | Description |
|---|---|---|
| `migrations_table` | `d1_migrations` | Tracking table name |
| `migrations_dir` | `migrations` | Folder holding migration files |
| `migrations_pattern` | `${migrations_dir}/*.sql` | Glob pattern for finding files |

## ORM Integration (Drizzle)

For a nested layout such as Drizzle (`migrations/0001_init/migration.sql`):

```jsonc
{
  "migrations_dir": "migrations",
  "migrations_pattern": "migrations/*/migration.sql"
}
```

## Rollback

### Automatic Rollback

If a migration fails, the system rolls back automatically — previous migrations remain applied

### Time Travel Restore

D1 has no separate `rollback` command — use Time Travel instead:

```bash
bunx wrangler d1 time-travel info my-db
bunx wrangler d1 time-travel restore my-db --bookmark=<BOOKMARK_ID>
```

## Best Practices

- Use the database name (not the binding name) to avoid running through the wrong binding
- Always test locally before applying to remote
- Name migrations descriptively
- Use `PRAGMA defer_foreign_keys = true;` when foreign key constraints are involved

## Source

- [D1 and Workers](https://developers.cloudflare.com/d1/)
- [D1 Migrations](https://developers.cloudflare.com/d1/reference/migrations/)

