| key | value |
|---|---|
| version | 0.31.11 |
| repository | https://github.com/drizzle-team/drizzle-orm |
| docs | https://orm.drizzle.team/docs/kit-overview |

| Command | Description | Options |
|---|---|---|
| `drizzle-kit generate` | Generate SQL migrations from schema diff | --name, --custom, --breakpoints |
| `drizzle-kit migrate` | Run migrations against DB | - |
| `drizzle-kit push` | Push schema directly (dev only) | --force, --strict |
| `drizzle-kit pull` | Introspect existing DB → drizzle schema | --tablesFilter, --extensionsFilters |
| `drizzle-kit check` | Check migration files consistency | - |
| `drizzle-kit studio` | Launch Drizzle Studio UI | --port, --host |
| `drizzle-kit up` | Upgrade snapshot format | - |
| `drizzle-kit export` | Export schema as SQL DDL (no DB needed) | --config |
