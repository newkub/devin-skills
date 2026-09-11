# Tool Drizzle Kit Routes / Topics

| Route / Topic | URL |
|---|---|
| Kit overview | https://orm.drizzle.team/docs/kit-overview |
| drizzle.config.ts | https://orm.drizzle.team/docs/drizzle-config-file |
| generate | https://orm.drizzle.team/docs/drizzle-kit-generate |
| migrate / push / pull | https://orm.drizzle.team/docs/kit-commands |
| Studio | https://orm.drizzle.team/drizzle-studio/overview |
| drizzle-orm skill | `/follow-lib-drizzle` |

## Key Concepts

- `generate` สร้าง migration files → `migrate` apply — flow สำหรับ production
- `push` skip migration files — dev prototyping เท่านั้น
- `dialect`: `postgresql`, `mysql`, `sqlite`, `singlestore`, `gel`, `turso`
- Config: `dbCredentials: { url: process.env.DATABASE_URL! }`
