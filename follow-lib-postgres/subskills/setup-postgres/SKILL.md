---
name: follow-lib-postgres-setup-postgres
description: ติดตั้ง postgres.js driver และตั้งค่า connection string/client ให้พร้อมใช้งาน
argument-hint: "[database-url-or-scope]"
related:
  - follow-lib-postgres
  - follow-lib-drizzle
  - follow-secret-manager
  - learn-web
  - resolve-errors
---

## Goal

ติดตั้ง `postgres` (postgres.js) driver, ตั้งค่า connection string และสร้าง client ให้ query ได้จริง — first-time setup เท่านั้น

## Scope

- ใช้เมื่อ project ยังไม่มี postgres.js (ถ้ามีอยู่แล้ว → verify เท่านั้น)
- ครอบคลุม: install, `DATABASE_URL`, `postgres()` client, basic queries/transactions
- ไม่ครอบคลุม pool tuning — ทำ `subskills/optimize-pool/SKILL.md` แทน

## Execute

### 1. Check Precondition

> Goal: ตรวจสอบ environment ก่อน setup

1. อ่าน `package.json` — ถ้ามี `postgres` แล้ว → skip ไป verify
2. ยืนยัน PostgreSQL server เข้าถึงได้ (host, port, credentials)
3. ตรวจ `DATABASE_URL` — ถ้าขาด → stop และแจ้ง user; เก็บผ่าน `/follow-secret-manager` ห้าม commit
4. ตรวจ runtime — postgres.js ต้อง TCP; บน Cloudflare Workers ใช้ Hyperdrive หรือ driver อื่น (ดู official docs)

### 2. Install

> Goal: ติดตั้ง postgres เป็น runtime dependency

1. รัน `bun add postgres` (หรือ package manager ตาม lockfile)
2. ยืนยัน `postgres` อยู่ใน `dependencies`
3. ถ้าใช้คู่ Drizzle → ทำ `/follow-lib-drizzle` (drizzle ใช้ postgres.js เป็น driver)

### 3. Create Client

> Goal: client เดียวที่ export ใช้ร่วมทั้ง app

1. สร้าง `src/db/index.ts` (หรือตาม structure เดิม): `import postgres from "postgres"` แล้ว `const sql = postgres(process.env.DATABASE_URL)`
2. Default options เพียงพอตอน setup — pool sizing/`prepare` tuning ทำใน `optimize-pool`
3. Export `sql` instance เดียว — ห้ามสร้าง client ใหม่ต่อ request/module
4. บน serverless: ใช้ Hyperdrive/PgBouncer pooling — อย่าเปิด connection ต่อ request

### 4. Basic Usage

> Goal: query ด้วย tagged template ที่ปลอดภัย

1. ใช้ tagged template `` sql`SELECT * FROM t WHERE id = ${id}` `` — parameterized อัตโนมัติ
2. `sql.begin()` สำหรับ transactions
3. `sql.listen(channel, onnotify)` สำหรับ LISTEN/NOTIFY (เพิ่มเมื่อจำเป็น)
4. ปิดด้วย `sql.end()` ใน teardown/graceful shutdown

### 5. Verify

> Goal: smoke query ผ่านจริง

1. รัน `` sql`SELECT 1` `` หรือ query เล็กๆ เป็น smoke test
2. รัน lint/typecheck ของ project
3. ถ้า verify ไม่ผ่าน → ทำ `/resolve-errors` max 3 รอบ แล้ว stop report; ผ่าน → `/suggest-next-action`

## Rules

- Idempotent — ถ้า setup ไปแล้วให้ verify เท่านั้น ห้ามสร้าง client ซ้ำ
- ห้าม string-concat queries — tagged template เสมอ; `sql.unsafe()` เฉพาะ dynamic queries ที่ parameterized ไม่ได้
- Connection string จาก env เสมอ — ห้าม hardcode host/credentials
- Client instance เดียวต่อ process — ถ้าไม่แน่ใจ options → ดู official docs (github.com/porsager/postgres)

## Expected Outcome

- `postgres` ติดตั้ง, `DATABASE_URL` ถูกตั้งค่าผ่าน env
- `sql` client เดียว export ใช้ร่วม, smoke query ผ่าน
- พร้อมทำ `subskills/optimize-pool/SKILL.md` ถ้าต้อง tuning
