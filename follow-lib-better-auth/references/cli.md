# Better Auth CLI

> CLI package: `auth` (`@better-auth/cli@1.4.21`, verified 2026-09-13) — รันผ่าน `bunx auth@latest` ไม่ต้อง install แยก
> Docs: https://www.better-auth.com/docs/concepts/cli

## Install

```sh
bun add better-auth
# CLI ใช้ผ่าน bunx โดยตรง — ไม่ต้องติดตั้งแยก
# ถ้าต้องการ standalone CLI: bun add -D @better-auth/cli
```

## Commands

| Command | Description | Options |
|---------|-------------|---------|
| `bunx auth@latest init` | Scaffold Better Auth ใน Next.js project | — |
| `bunx auth@latest generate` | Generate schema/migration จาก `auth.ts` config | `--adapter prisma`, `--adapter drizzle`, `--output`, `-y` |
| `bunx auth@latest migrate` | Apply migrations (built-in Kysely adapter เท่านั้น) | — |
| `bunx auth@latest upgrade` | อัปเกรด `better-auth` และ `@better-auth/*` packages | — |
| `bunx auth@latest secret` | Generate `BETTER_AUTH_SECRET` ที่ปลอดภัย | — |

## Usage Notes

- `generate` อ่าน `auth.ts` เพื่อสร้าง schema ตาม adapter — Drizzle adapter ให้ output schema แล้ว migrate ผ่าน `drizzle-kit` ตามปกติ (`/follow-tool-drizzle-kit`)
- `migrate` ใช้ได้เฉพาะ built-in Kysely adapter (better-sqlite3, `pg` Pool, `mysql2`)
- รัน `generate` ทุกครั้งหลังเปลี่ยน `plugins` หรือ auth schema config ใน `auth.ts`
- ตั้ง `BETTER_AUTH_SECRET` ใน env ก่อนรัน CLI — หรือใช้ `bunx auth@latest secret` สร้างใหม่

## Sources

- CLI: https://www.better-auth.com/docs/concepts/cli
- Installation: https://www.better-auth.com/docs/installation
