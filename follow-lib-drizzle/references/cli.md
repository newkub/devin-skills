# Drizzle Kit CLI

## Install

```sh
bun add -D drizzle-kit
```

## Version

- Latest: see `drizzle-kit` on npm
- Docs: https://orm.drizzle.team/docs/kit-overview

## Commands

| commands | description | default | options |
|---|---|---|---|
| `drizzle-kit push` | Push schema directly to database | no migration files | `--config`, `--connection-string` |
| `drizzle-kit generate` | Generate migration files from schema diff | migrations in `./drizzle` | `--name`, `--config` |
| `drizzle-kit migrate` | Apply generated migrations | run pending migrations | `--config`, `--connection-string` |
| `drizzle-kit pull` | Pull schema from existing database | introspect into schema file | `--config`, `--connection-string` |
| `drizzle-kit export` | Export schema as SQL | output SQL file | `--config` |
| `drizzle-kit check` | Check schema drift between migrations and schema | report drift | `--config` |
| `drizzle-kit studio` | Open Drizzle Studio GUI | open browser | `--config`, `--port`, `--host` |

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
