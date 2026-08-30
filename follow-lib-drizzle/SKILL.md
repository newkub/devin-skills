---
name: follow-lib-drizzle
description: ตั้งค่าและใช้งาน Drizzle ORM สำหรับ TypeScript-first database operations ด้วย SQL-like syntax
related:
  - run-drizzle-studio
  - follow-lib-animejs
  - follow-lib-arktype
  - follow-best-practice
  - use-my-packages-on-registry
  - setup-cicd
---

## Goal

ตั้งค่าและใช้งาน Drizzle ORM สำหรับ TypeScript-first database operations ด้วย SQL-like syntax และ relational query API

## Scope

ตั้งค่า Drizzle ORM สำหรับ type-safe database operations ด้วย SQL-like syntax, zero dependencies และ excellent TypeScript support

- ติดตั้ง Drizzle ORM และ Kit
- กำหนดค่า `drizzle.config.ts`
- สร้าง database schema และ migrations
- ใช้งาน query builder แบบ type-safe และ relational queries
- รองรับ 6 dialects และ serverless drivers

## Execute

### 1. Check Precondition

> Goal: ตรวจสอบ environment ก่อนเริ่ม

1. ยืนยันว่า Bun ติดตั้งแล้ว โดยรัน `bun --version`
2. ยืนยันว่ามี database server หรือ SQLite file ที่กำหนดใช้งานได้
3. อ่าน `package.json` ของ project
4. ถ้าไม่มี `package.json` → stop และ report

### 2. Setup

> Goal: ติดตั้ง Drizzle ORM, driver, และ drizzle-kit

1. รัน `bun add drizzle-orm`
2. ติดตั้ง driver ตาม runtime และ database — ดูรายละเอียดใน [references/components/drivers.md](references/components/drivers.md)
3. รัน `bun add -D drizzle-kit`
4. ตรวจสอบว่า dependencies อยู่ใน `package.json`

### 3. Configure

> Goal: สร้าง `drizzle.config.ts` และเลือก dialect/driver

1. สร้าง `drizzle.config.ts` ด้วย `defineConfig` — ดูตัวอย่างใน [references/components/config.md](references/components/config.md)
2. ระบุ `dialect` ตาม database: `postgresql`, `mysql`, `sqlite`, `singlestore`, `mssql`, หรือ `cockroach`
3. ระบุ `driver` เฉพาะเมื่อใช้ driver พิเศษ: `turso`, `d1-http`, `expo`, `aws-data-api`, `pglite`
4. ระบุ `schema`, `out`, และ `dbCredentials.url` อ่านจาก `DATABASE_URL` หรือ environment ที่เหมาะสม
5. อย่า hardcode credentials ใน `drizzle.config.ts`

### 4. Define Schema

> Goal: สร้าง database schema ด้วย type-safe columns

1. สร้าง `src/db/schema.ts` หรือแยกเป็นไฟล์ใน `src/db/schema/`
2. นิยาม tables, columns, indexes, และ relations — ดู [references/api/schema.md](references/api/schema.md)
3. ใช้ `pgTable` (PostgreSQL/CockroachDB), `mysqlTable` (MySQL/SingleStore), `sqliteTable` (SQLite), `mssqlTable` (MS SQL)
4. ระบุ `notNull`, `unique`, `defaultNow` ตามที่จำเป็น
5. สร้าง type จาก schema ด้วย `typeof table.$inferSelect` และ `$inferInsert`
6. นิยาม `relations()` เพื่อเปิดใช้งาน relational query API

### 5. Create Client

> Goal: สร้าง database client สำหรับ runtime ที่ใช้

1. สร้าง `src/db/index.ts` ตาม runtime — ดู [references/components/drivers.md](references/components/drivers.md)
2. สำหรับ SQLite: เปิดใช้งาน WAL mode (`PRAGMA journal_mode = WAL`) เพื่อ performance
3. สำหรับ relational queries: ส่ง `schema` object เข้า `drizzle()` เช่น `drizzle(url, { schema })`
4. export `db` instance ที่ import schema ทั้งหมด
5. อย่า expose client credentials ใน source code

### 6. Manage Migrations

> Goal: เลือก migration strategy และรัน migrations

1. เลือก strategy ตาม use case — ดู [references/cli.md](references/cli.md)
   - Rapid prototyping: `bunx drizzle-kit push`
   - Production/team: `bunx drizzle-kit generate` แล้ว `bunx drizzle-kit migrate`
   - Existing database: `bunx drizzle-kit pull`
2. สำหรับ production: generate migrations ด้วย `bunx drizzle-kit generate --name=<name>`
3. ตรวจสอบไฟล์ migrations ใน output directory
4. รัน migrations ด้วย `bunx drizzle-kit migrate`
5. ตรวจ drift ด้วย `bunx drizzle-kit check`

### 7. Query Data

> Goal: ใช้งาน type-safe queries และ relational API

1. import `db` และ schema จาก `src/db`
2. ใช้ SQL-like API: `db.insert()`, `db.select().from()`, `db.update()`, `db.delete()` — ดู [references/api/queries.md](references/api/queries.md)
3. ใช้ relational API: `db.query.<table>.findMany({ with: {...} })` สำหรับ nested data
4. ใช้ `db.transaction()` สำหรับ atomic operations — ดู [references/api/transactions.md](references/api/transactions.md)
5. ใช้ `eq`, `and`, `or`, `like`, `gt` ฯลฯ จาก `drizzle-orm` สำหรับ filters

### 8. Inspect With Studio

> Goal: ใช้ Drizzle Studio สำหรับ browse data

1. รัน `bunx drizzle-kit studio` เพื่อเปิด GUI
2. ใช้สำหรับ browse, filter, และ edit records ระหว่าง development
3. อย่าใช้ใน production

## Rules

### 1. Installation

- `bun add drizzle-orm` + driver ตาม runtime
- `bun add -D drizzle-kit` สำหรับ dev tools

### 2. Configuration

- สร้าง `drizzle.config.ts` ด้วย `defineConfig`
- ระบุ `dialect` (required), `driver` (optional), `schema`, `out`, และ `dbCredentials`
- อ่าน database URL จาก environment variables

### 3. Schema

- กำหนด schema ในไฟล์แยกหรือใช้ glob patterns
- ใช้ type inference จาก schema (`$inferSelect`, `$inferInsert`)
- นิยาม `relations()` เพื่อเปิดใช้งาน `db.query` API
- ไม่ hardcode credentials

### 4. Migrations

- เลือก migration strategy ตาม use case
- Production ต้อง generate + migrate
- Development ใช้ push ได้
- ตรวจ drift ด้วย `check`

### 5. Driver Selection

- ใช้ driver ที่เหมาะสมกับ runtime และ database
- Serverless: `neon-http`, `neon-serverless`, `vercel-pg`, `planetscale-serverless`, `d1`
- Edge/browser: `pglite`
- ดูรายละเอียดใน [references/components/drivers.md](references/components/drivers.md)

## Expected Outcome

- Drizzle ORM ติดตั้งและทำงานได้ด้วย driver ที่ถูกต้อง
- Schema กำหนดค่าถูกต้องตาม column types และ dialect
- Migrations จัดการตาม strategy ที่เหมาะสม
- Type-safe queries และ relational API ทำงานได้
- Transactions รองรับ rollback และ nested savepoints
- Performance ได้รับการ optimize ด้วย WAL mode และ indexes
