---
name: follow-drizzle
description: ตั้งค่าและใช้งาน Drizzle ORM สำหรับ TypeScript-first database operations ด้วย SQL-like syntax
allowed-tools:
  - read
  - edit
  - write
  - grep
  - glob
  - exec
  - ask_user_question
triggers:
  - user
  - model
related:
---

## Goal

ตั้งค่าและใช้งาน Drizzle ORM สำหรับ TypeScript-first database operations ด้วย SQL-like syntax

## Scope

ตั้งค่า Drizzle ORM สำหรับ type-safe database operations ด้วย SQL-like syntax, zero dependencies และ excellent TypeScript support

- ติดตั้ง Drizzle ORM และ Kit
- กำหนดค่า `drizzle.config.ts`
- สร้าง database schema และ migrations
- ใช้งาน query builder แบบ type-safe

## Execute

### 1. Check Precondition

> Goal: ตรวจสอบ environment ก่อนเริ่ม
> Goal: มี Bun, database server, และ package.json พร้อม

1. ยืนยันว่า Bun ติดตั้งแล้ว โดยรัน `bun --version`
2. ยืนยันว่ามี database server (PostgreSQL หรือ MySQL) หรือ SQLite file ที่กำหนดใช้งานได้
3. อ่าน `package.json` ของ project
4. ถ้าไม่มี `package.json` → stop และ report

### 2. Setup

> Goal: ติดตั้ง Drizzle ORM, driver, และ drizzle-kit
> Goal: project มี dependencies ครบถ้วนตาม runtime

1. รัน `bun add drizzle-orm`
2. ติดตั้ง driver ตาม runtime และ database:
   - Bun + SQLite: ใช้ native `bun:sqlite`
   - Node.js + SQLite: `bun add better-sqlite3`
   - PostgreSQL: `bun add postgres`
   - MySQL: `bun add mysql2`
   - Turso/libsql: `bun add @libsql/client`
3. รัน `bun add -D drizzle-kit`
4. ตรวจสอบว่า dependencies อยู่ใน `package.json`

### 3. Configure

> Goal: สร้าง `drizzle.config.ts` และเลือก driver
> Goal: Drizzle Kit สามารถ connect และ generate migrations ได้

1. สร้าง `drizzle.config.ts` ด้วย `defineConfig`:
   - `schema`: path ของ schema files (เช่น `./src/db/schema.ts` หรือ glob `./src/db/**/*.ts`)
   - `out`: output directory ของ migrations (เช่น `./src/db/migrations`)
   - `dialect`: `postgresql`, `mysql`, หรือ `sqlite`
   - `driver`: `postgres`, `mysql2`, `better-sqlite`, `bun`, หรือ `turso`
   - `dbCredentials.url`: อ่านจาก `DATABASE_URL` หรือ environment ที่เหมาะสม
2. เลือก driver ให้ตรงกับ runtime และ database
3. อย่า hardcode credentials ใน `drizzle.config.ts`

### 4. Define Schema

> Goal: สร้าง database schema ด้วย type-safe columns
> Goal: schema ถูกต้องและสอดคล้องกับ business requirements

1. สร้าง `src/db/schema.ts` หรือแยกเป็นไฟล์ใน `src/db/schema/`
2. นิยาม tables, columns, indexes, และ relations
3. ใช้ `pgTable` สำหรับ PostgreSQL, `sqliteTable` สำหรับ SQLite, `mysqlTable` สำหรับ MySQL
4. ระบุ `notNull`, `unique`, `defaultNow` ตามที่จำเป็น
5. สร้าง type จาก schema ด้วย `typeof table.$inferSelect` และ `$inferInsert`

### 5. Create Client

> Goal: สร้าง database client สำหรับ runtime ทีใช้
> Goal: สามารถ query database ได้จาก application

1. สร้าง `src/db/index.ts` ตาม runtime:
   - Bun + SQLite: `import { drizzle } from 'drizzle-orm/bun-sqlite'`
   - Node.js + SQLite: `import { drizzle } from 'drizzle-orm/better-sqlite3'`
   - PostgreSQL: `import { drizzle } from 'drizzle-orm/node-postgres'`
2. เปิดใช้งาน WAL mode สำหรับ SQLite ด้วย `PRAGMA journal_mode = WAL` เพื่อ performance
3. export `db` instance ที่ import schema ทั้งหมด
4. อย่า expose client credentials ใน source code

### 6. Manage Migrations

> Goal: เลือก migration strategy และรัน migrations
> Goal: database schema sync กับโค้ดอย่างปลอดภัย

1. เลือก strategy ตาม use case:
   - Rapid prototyping: `bunx drizzle-kit push`
   - Production/team: `bunx drizzle-kit generate` แล้ว `bunx drizzle-kit migrate`
   - Existing database: `bunx drizzle-kit pull`
2. สำหรับ production: generate migrations ด้วย `bunx drizzle-kit generate --name=<name>`
3. ตรวจสอบไฟล์ migrations ใน output directory
4. รัน migrations ด้วย `bunx drizzle-kit migrate`
5. สำหรับ development: ใช้ `bunx drizzle-kit push` เพื่อ sync schema เร็ว

### 7. Query Data

> Goal: ใช้งาน type-safe queries
> Goal: CRUD operations ทำงานได้และ type-safe

1. import `db` และ schema จาก `src/db`
2. ใช้ `db.insert(table).values(...).returning()` สำหรับ create
3. ใช้ `db.select().from(table).where(eq(table.id, ...))` สำหรับ read
4. ใช้ `db.update(table).set(...).where(...)` สำหรับ update
5. ใช้ `db.delete(table).where(...)` สำหรับ delete
6. ใช้ `eq`, `and`, `or`, `like`, ฯลฯ จาก `drizzle-orm` สำหรับ filters

## Rules

### 1. Installation

- `bun add drizzle-orm` + driver ตาม runtime
- `bun add -D drizzle-kit` สำหรับ dev tools

### 2. Configuration

- สร้าง `drizzle.config.ts` ด้วย `defineConfig`
- ระบุ `schema`, `out`, `dialect`, `driver`, และ `dbCredentials`
- อ่าน database URL จาก environment variables

### 3. Schema

- กำหนด schema ในไฟล์แยกหรือใช้ glob patterns
- ใช้ type inference จาก schema
- ไม่ hardcode credentials

### 4. Migrations

- เลือก migration strategy ตาม use case
- Production ต้อง generate + migrate
- Development ใช้ push ได้

### 5. Driver Selection

- ใช้ driver ที่เหมาะสมกับ runtime และ database
- Bun + SQLite ใช้ `drizzle-orm/bun-sqlite`
- Node.js + SQLite ใช้ `drizzle-orm/better-sqlite3`

## Expected Outcome

- Drizzle ORM ติดตั้งและทำงานได้ด้วย driver ทีถูกต้อง
- Schema กำหนดค่าถูกต้องตาม column types
- Migrations จัดการตาม strategy ทีเหมาะสม
- Type-safe queries ทำงานได้
- Performance ได้รับการ optimize ด้วย WAL mode และ indexes
