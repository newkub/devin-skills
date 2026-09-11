# Tool Drizzle Kit API & Dependencies

## Install

```sh
bun add drizzle-orm          # runtime ORM
bun add -D drizzle-kit       # CLI สำหรับ migrations/introspection
```

## Version

- `drizzle-kit`: `0.31.10` (verified 2026-09-11)
- [Package Registry](https://www.npmjs.com/package/drizzle-kit)
- [Repository](https://github.com/drizzle-team/drizzle-orm)

## Dependencies

- ต้องมี `drizzle-orm` + database driver (`postgres`, `better-sqlite3`, `mysql2`, `@libsql/client`)
- `drizzle.config.ts` ใน project root — กำหนด `dialect`, `schema`, `out`, `dbCredentials`

## Common API / Commands

| commands | description | default | options |
|---|---|---|---|
| `drizzle-kit generate` | สร้าง SQL migration จาก schema | `./drizzle` out | --name, --custom |
| `drizzle-kit migrate` | Apply migrations | - | - |
| `drizzle-kit push` | Push schema ตรงๆ (dev) | - | --force |
| `drizzle-kit pull` | Introspect DB → schema | - | --tablesFilter |
| `drizzle-kit check` | Validate migrations | - | - |
| `drizzle-kit studio` | Data browser UI | - | --port |
| `drizzle-kit up` | Upgrade snapshots | - | - |

## Source

- Official docs: https://orm.drizzle.team/docs/kit-overview
- Description: Drizzle Kit — migration generator, introspection, studio สำหรับ drizzle-orm.
