| Command | Description | Options |
|---------|-------------|---------|
| `bunx auth@latest init` | Scaffold Better Auth ใน Next.js project | — |
| `bunx auth@latest generate` | Generate schema/migration จาก `auth.ts` config | `--adapter prisma`, `--adapter drizzle`, `--output`, `-y` |
| `bunx auth@latest migrate` | Apply migrations (built-in Kysely adapter เท่านั้น) | — |
| `bunx auth@latest upgrade` | อัปเกรด `better-auth` และ `@better-auth/*` packages | — |
| `bunx auth@latest secret` | Generate `BETTER_AUTH_SECRET` ที่ปลอดภัย | — |
