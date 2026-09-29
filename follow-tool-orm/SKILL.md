---
name: follow-tool-orm
description: ใช้งาน ORM ใน project — models, queries, migrations และ relations อย่าง type-safe
argument-hint: "[scope]"
related:
  - follow-tool-data-validation
  - follow-tool-drizzle-kit
  - review-database
  - review-database
  - update-tests
  - run-test
  - resolve-errors
---

## Goal

ใช้งาน ORM ใน project เพื่อจัดการ data access — models, relations, queries และ migrations — อย่าง type-safe และ consistent

## Scope

ใช้สำหรับ projects ที่ต้อง data access layer ผ่าน ORM แทน raw SQL รองรับ TypeScript, Rust, Python, Go

- Boundary: skill นี้ครอบคลุม ORM usage เท่านั้น — schema design/review ใช้ `/review-database`; migration drift audit ใช้ `/review-database`; drizzle-kit commands ลึกใช้ `/follow-tool-drizzle-kit`

## Execute

### 1. Select ORM

> Goal: เลือก ORM ตาม tech stack

1. ตรวจสอบ tech stack ของ project
2. เลือก ORM ตามความเหมาะสม:
   - TypeScript/JavaScript: drizzle (type-safe SQL-like), prisma (schema-first), kysely (query builder), typeorm, mikro-orm
   - Rust: sea-orm, diesel, sqlx (query builder)
   - Python: sqlalchemy, django-orm, tortoise-orm
   - Go: gorm, ent, sqlc (generated)
3. ถ้ามี existing ORM อยู่แล้ว → ใช้ตัวเดิม ห้ามเพิ่ม ORM ที่สองใน project เดียว
4. ถ้า project เป็น greenfield → เลือกตาม ecosystem + team familiarity ผ่าน `/follow-my-techstack`

### 2. Define Models And Relations

> Goal: models ตรง schema และ relations ครบ

1. สร้าง model/entity ต่อ domain model — ชื่อตาราง/field ตาม convention ของ ORM
2. กำหนด relations ชัดเจน: hasOne, hasMany, belongsTo, many-to-many (join table)
3. ใช้ type inference จาก ORM (เช่น `$inferSelect`/`$inferInsert` ของ drizzle, generated types ของ prisma)
4. indexes บน foreign keys และ columns ที่ query บ่อย
5. timestamps (`createdAt`, `updatedAt`) และ soft-delete column ถ้า domain ต้องการ

### 3. Write Queries

> Goal: queries type-safe, ไม่ N+1, parameterized เสมอ

1. ใช้ query builder ของ ORM — ห้าม string-interpolate SQL เอง
2. eager-load relations ที่ใช้ (`with`/`include`/`preload`) — ป้องกัน N+1
3. pagination: cursor-based สำหรับ dataset ใหญ่, offset เฉพาะ dataset เล็ก
4. transactions สำหรับ multi-write ที่ต้อง atomic — `db.transaction(async (tx) => ...)`
5. raw SQL เฉพาะเมื่อ ORM ทำไม่ได้ — parameterized เสมอ ห้าม concat ค่า

### 4. Manage Migrations

> Goal: schema changes versioned และ reproducible

1. generate migration จาก model changes — review generated SQL ก่อน apply เสมอ
2. ทำ `/review-database` เทียบ pending vs applied ก่อน deploy
3. destructive changes (drop column/table) → dry-run + user confirm
4. seed script แยกจาก migrations — ไม่ผสม data กับ schema
5. ถ้า migration fail → `/resolve-errors` ก่อนดำเนินต่อ

### 5. Test Data Layer

> Goal: queries และ migrations verified

1. ทำ `/update-tests` — repository/query functions ต่อ real test DB (ไม่ mock ORM internals)
2. ทดสอบ relations: eager load ครบ, cascade delete ถูกต้อง
3. ทดสอบ migration up/down บน clean DB
4. รัน `/run-test` เพื่อ verify

## Rules

### 1. Type Safety

- ใช้ inferred types จาก ORM — ห้ามประกาศ row types ซ้ำที่ drift จาก schema
- ไม่ใช้ `any` สำหรับ query results — validate boundary data ด้วย `/follow-tool-data-validation`

### 2. Query Discipline

- parameterized queries เสมอ — ห้าม string-interpolate user input เข้า SQL
- N+1 ห้าม — eager-load หรือ join แทน loop-query
- transactions สำหรับ multi-write เสมอ — partial writes = corrupted state

### 3. Single ORM

- หนึ่ง project หนึ่ง ORM — ห้ามผสม prisma + drizzle ใน codebase เดียว
- ห้าม bypass ORM ด้วย raw connection ถ้าไม่จำเป็น — consistency สำคัญกว่า

### 4. Migrations

- migrations เป็น source of truth ของ schema — ห้ามแก้ DB มือแล้ว drift
- ทุก migration ต้อง rollback-able (มี down path) หรือระบุไว้ชัดเจน
- ไม่ edit applied migrations — สร้าง migration ใหม่แทน

- ใช้ /follow-tool-drizzle-kit ถ้าจำเป็น
- ใช้ /follow-tool-data-validation ถ้าจำเป็น
- ใช้ /review-database ถ้าจำเป็น
- ใช้ /run-test ถ้าจำเป็น

## Expected Outcome

- ORM ถูกเลือกและตั้งค่าตาม tech stack — หนึ่ง ORM ต่อ project
- Models/relations ครบและ type-safe, queries ไม่มี N+1 หรือ injection surface
- Migrations versioned, tested และ sync กับ code
- Tests ครอบคลุม data layer บน real test DB
