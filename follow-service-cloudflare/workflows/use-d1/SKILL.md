---
name: follow-service-cloudflare-use-d1
description: ใช้ Cloudflare D1 — schema migrations, prepared queries, batch, transactions
argument-hint: "[db-name]"
related:
  - follow-service-cloudflare
  - run-test
  - resolve-errors
---

## Goal

ใช้ Cloudflare D1 ครบ — create db, migrations (local/remote), queries, batch และ transactions ผ่าน binding `env.DB`

## Scope

ใช้เมื่อ Worker/Pages ต้องการ SQL database — detail migration commands อยู่ที่ `references/d1-migrations.md`; binding config → `config-bindings`

## Execute

### 1. Provision And Bind

1. `wrangler d1 create <NAME>` — เก็บ `database_id`
2. ผูกใน `wrangler.jsonc`: `d1_databases: [{ binding: "DB", database_name, database_id }]`
3. `wrangler types` regenerate `Env`

### 2. Migrations

> Goal: schema เวอร์ชันนิ่งทั้ง local และ remote

1. วาง `.sql` ไฟล์ใน `migrations/` ตามลำดับ (`0001_init.sql`)
2. Apply local: `wrangler d1 migrations apply DB --local`; remote: `--remote`
3. Check: `wrangler d1 migrations list DB` — รายละเอียด `references/d1-migrations.md`
4. ห้ามแก้ migration ที่ apply แล้ว — เพิ่มไฟล์ใหม่เสมอ

### 3. Query Patterns

> Goal: prepared statements + batch + tx

```ts
// prepared + bind — ห้าม string concat
const { results } = await env.DB
  .prepare('SELECT * FROM todos WHERE done = ?1')
  .bind(0)
  .all()

await env.DB.prepare('INSERT INTO todos (title) VALUES (?1)').bind(title).run()

// batch — หลาย statements atomic
await env.DB.batch([stmt1, stmt2, stmt3])
```

- `.all()` / `.first()` / `.run()` / `.raw()` เลือกตาม shape
- `withSession`/`bookmark` สำหรับ read-replication consistency (ตรวจ docs ล่าสุด)

### 4. Verify

1. `wrangler dev` query จริงผ่าน local D1
2. `/run-test`; fail → `/resolve-errors` max 3 รอบ

## Rules

- Parameterized queries เท่านั้น — ห้าม interpolate
- Migration remote ก่อน deploy code ที่ใช้ schema ใหม่ (deploy order)
- `env.DB` ไม่มีใน `.local` dev ถ้าไม่มี binding — ตรวจ `wrangler types` output

## Expected Outcome

- D1 bound + migrations apply ทั้ง local/remote
- Queries ปลอดภัยด้วย prepared+bind, batch ใช้ถูก
