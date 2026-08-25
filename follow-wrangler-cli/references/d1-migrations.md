# Wrangler D1 Migrations

D1 migrations สำหรับ versioning database schema changes

## Subcommands

| Command | Description |
|---|---|
| `wrangler d1 migrations create [DB] [MESSAGE]` | Create a new migration file |
| `wrangler d1 migrations list [DB]` | List unapplied migrations |
| `wrangler d1 migrations apply [DB]` | Apply unapplied migrations |

## Migration Workflow

```bash
# 1. Create migration
npx wrangler d1 migrations create my-db create_user_table
# สร้าง migrations/0001_create_user_table.sql

# 2. Edit SQL file
# เพิ่ม CREATE TABLE, ALTER TABLE, etc.

# 3. Apply to local
npx wrangler d1 migrations apply my-db --local

# 4. Apply to remote
npx wrangler d1 migrations apply my-db --remote

# 5. List unapplied
npx wrangler d1 migrations list my-db
```

## Flags

| Flag | Description |
|---|---|
| `--local` | Apply to local DB (สำหรับ `wrangler dev`) |
| `--remote` | Apply to remote DB (production) |
| `--preview` | Apply to preview D1 DB |
| `--persist-to [DIR]` | Custom persistence directory (ต้องใช้กับ `--local`) |

## Migration File Format

- ตั้งชื่อ: `{VERSION}_{DESCRIPTION}.sql` (เช่น `0001_create_user_table.sql`)
- เก็บใน `migrations/` folder (สร้างอัตโนมัติ)
- แต่ละไฟล์คือ SQL queries ที่จะ run ตามลำดับ version

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
| `migrations_table` | `d1_migrations` | ชื่อตาราง tracking |
| `migrations_dir` | `migrations` | โฟลเดอร์เก็บ migration files |
| `migrations_pattern` | `${migrations_dir}/*.sql` | Glob pattern สำหรับหา files |

## ORM Integration (Drizzle)

สำหรับ nested layout เช่น Drizzle (`migrations/0001_init/migration.sql`):

```jsonc
{
  "migrations_dir": "migrations",
  "migrations_pattern": "migrations/*/migration.sql"
}
```

## Rollback

### Automatic Rollback

ถ้า migration ล้มเหลว ระบบ rollback อัตโนมัติ migration ก่อนหน้ายัง applied อยู่

### Time Travel Restore

D1 ไม่มี `rollback` command แยก ใช้ Time Travel แทน:

```bash
npx wrangler d1 time-travel info my-db
npx wrangler d1 time-travel restore my-db --bookmark=<BOOKMARK_ID>
```

## Best Practices

- ใช้ database name (ไม่ใช่ binding name) เพื่อหลีกเลี่ยงการ run ผ่าน binding ผิด
- Test ใน local ก่อน apply remote เสมอ
- ตั้งชื่อ migration ให้ descriptive
- ใช้ `PRAGMA defer_foreign_keys = true;` ถ้ามี foreign key constraints

## Source

- [D1 and Workers](https://developers.cloudflare.com/d1/worker-d1/d1-and-workers/)
- [D1 Migrations](https://developers.cloudflare.com/d1/reference/migrations/)
