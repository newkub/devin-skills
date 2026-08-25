# Drizzle Kit CLI

## Commands

```bash
# Push schema directly to database (rapid prototyping)
bunx drizzle-kit push

# Generate migration files from schema diff
bunx drizzle-kit generate

# Generate with name
bunx drizzle-kit generate --name=add_users_table

# Apply generated migrations
bunx drizzle-kit migrate

# Pull schema from existing database (introspection)
bunx drizzle-kit pull

# Export schema as SQL
bunx drizzle-kit export

# Check for schema drift between migrations and schema
bunx drizzle-kit check

# Open Drizzle Studio (GUI for browsing data)
bunx drizzle-kit studio

# Use custom config file
bunx drizzle-kit generate --config=drizzle-dev.config.ts
```

## Migration Strategy

| Use case | Command | Notes |
|---|---|---|
| Rapid prototyping | `drizzle-kit push` | Sync schema directly, no migration files |
| Production / team | `drizzle-kit generate` + `drizzle-kit migrate` | Versioned migration files in `out/` |
| Existing database | `drizzle-kit pull` | Introspect DB → generate schema files |
| Drift detection | `drizzle-kit check` | Verify migrations match current schema |

## Sources

- CLI: https://orm.drizzle.team/docs/kit-overview
- Migrations: https://orm.drizzle.team/docs/migrations
- Studio: https://orm.drizzle.team/docs/studio
