---
name: follow-lib-drizzle-setup-drizzle
description: ติดตั้ง Drizzle ORM, สร้าง schema.ts และ db client ให้พร้อมใช้งาน
argument-hint: "[dialect-or-driver]"
related:
  - follow-lib-postgres
  - follow-lib-zod
  - run-drizzle-studio
  - learn-web
  - resolve-errors
---

## Goal

ติดตั้ง Drizzle ORM, driver, `drizzle-kit` แล้วสร้าง `drizzle.config.ts`, `schema.ts` และ db client ให้ query ได้จริง — first-time setup เท่านั้น

## Scope

- ใช้เมื่อ project ยังไม่มี Drizzle หรือต้อง setup ใหม่ (ถ้ามีอยู่แล้ว → verify เท่านั้น)
- ครอบคลุม: install, `drizzle.config.ts`, `src/db/schema.ts`, `src/db/index.ts`
- ไม่ครอบคลุม migrations — ทำ `subskills/migrate-schema/SKILL.md` แทน

## Execute

### 1. Check Precondition

> Goal: ตรวจสอบ environment และ current state ก่อน setup

1. ยืนยัน runtime (`bun --version` หรือ `node --version`) และ database server/file พร้อมใช้
2. อ่าน `package.json` — ถ้าไม่มี → stop และ report; ถ้ามี `drizzle-orm` แล้ว → skip ไป verify
3. ตรวจ `DATABASE_URL` หรือ env ที่เกี่ยวข้อง — ถ้าขาด secret/env → stop และแจ้ง user

### 2. Install Packages

> Goal: ติดตั้ง `drizzle-orm`, driver และ `drizzle-kit`

1. รัน `bun add drizzle-orm` แล้ว `bun add -D drizzle-kit` (หรือ package manager ตาม lockfile)
2. ติดตั้ง driver ตาม runtime/database — ดู [../../references/components/drivers.md](../../references/components/drivers.md)
3. ยืนยันว่า dependencies ลง `package.json` ถูกต้อง (`drizzle-orm` เป็น runtime dep, `drizzle-kit` เป็น dev)
4. ถ้าไม่แน่ใจ version/API → ทำ `/learn-web` ดู official docs

### 3. Configure drizzle.config.ts

> Goal: สร้าง config ขั้นต่ำที่จำเป็น

1. สร้าง `drizzle.config.ts` ด้วย `defineConfig` — ดู [../../references/components/config.md](../../references/components/config.md)
2. ระบุ `dialect`, `schema`, `out` และ `dbCredentials.url` อ่านจาก `DATABASE_URL`
3. ระบุ `driver` เฉพาะเมื่อใช้ driver พิเศษ (`turso`, `d1-http`, `pglite`, `neon-http` ฯลฯ)
4. ห้าม hardcode credentials — เก็บ secrets ผ่าน `/follow-secret-manager`

### 4. Define Schema And Client

> Goal: สร้าง `schema.ts` และ db client ที่ export `db`

1. สร้าง `src/db/schema.ts` ด้วย `pgTable`/`mysqlTable`/`sqliteTable` ตาม dialect — ดู [../../references/api/schema.md](../../references/api/schema.md)
2. สร้าง type ด้วย `typeof table.$inferSelect` และ `$inferInsert`; นิยาม `relations()` ถ้าใช้ relational queries
3. สร้าง `src/db/index.ts` ที่ `drizzle(url, { schema })` แล้ว export `db` instance — SQLite เปิด WAL mode (`PRAGMA journal_mode = WAL`)
4. ห้าม expose credentials ใน source code

### 5. Verify Setup

> Goal: smoke check ว่า setup ทำงานจริง

1. รัน `bunx drizzle-kit check` หรือ query เล็กๆ (เช่น `db.select().from(table).limit(1)`) เป็น smoke test
2. รัน lint/typecheck ของ project
3. ถ้า verify ไม่ผ่าน → ทำ `/resolve-errors` max 3 รอบ แล้ว stop report; ผ่าน → `/suggest-next-action`

## Rules

- Idempotent — ถ้า setup ไปแล้วให้ verify เท่านั้น ห้าม reinstall/overwrite config เดิม
- เขียน config ขั้นต่ำก่อน แล้วค่อยเพิ่ม options — ห้าม copy config เต็มจาก docs โดยไม่จำเป็น
- อ่าน credentials จาก environment เสมอ ห้าม commit secrets
- ตรวจ version ใน `package.json` ก่อนเลือก API (v0.x `relations()` vs v1.0 RC `defineRelations()`)

## Expected Outcome

- `drizzle-orm`, `drizzle-kit` และ driver ติดตั้งครบใน `package.json`
- `drizzle.config.ts`, `src/db/schema.ts`, `src/db/index.ts` พร้อมใช้
- Smoke query รันผ่าน — พร้อมทำ `subskills/migrate-schema/SKILL.md` ต่อ
