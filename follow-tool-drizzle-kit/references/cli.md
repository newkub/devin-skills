# Tool Drizzle Kit CLI

## Install

```sh
bun add -D drizzle-kit
```

## Version

- Latest: `0.31.10` (npm, verified 2026-09-13) — pair with `drizzle-orm@0.45.2`; v1.0.0 อยู่ใน beta/rc channel
- Repository: https://github.com/drizzle-team/drizzle-orm
- Docs: https://orm.drizzle.team/docs/kit-overview

## Commands

| Command | Description | Options |
|---|---|---|
| `drizzle-kit generate` | Generate SQL migrations จาก schema diff | --name, --custom, --breakpoints |
| `drizzle-kit migrate` | Run migrations against DB | - |
| `drizzle-kit push` | Push schema โดยตรง (dev only) | --force, --strict |
| `drizzle-kit pull` | Introspect existing DB → drizzle schema | --tablesFilter, --extensionsFilters |
| `drizzle-kit check` | Check migration files consistency | - |
| `drizzle-kit studio` | Launch Drizzle Studio UI | --port, --host |
| `drizzle-kit up` | Upgrade snapshot format | - |
| `drizzle-kit export` | Export schema เป็น SQL DDL (ไม่ต้องมี DB) | --config |

## Examples

```sh
bunx drizzle-kit generate --name add_users_table
bunx drizzle-kit migrate
bunx drizzle-kit studio --port 4983
```
