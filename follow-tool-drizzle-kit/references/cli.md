# Tool Drizzle Kit CLI

## Install

```sh
bun add -D drizzle-kit
```

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
| `drizzle-kit export` | Export SQL | --sql |

## Examples

```sh
bunx drizzle-kit generate --name add_users_table
bunx drizzle-kit migrate
bunx drizzle-kit studio --port 4983
```
