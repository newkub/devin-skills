# Repository Pattern

## Goal

แยก database logic ออกจาก business logic ด้วย repository pattern — interfaces, adapters, mappers, QuerySpec, UnitOfWork — เพื่อให้ code testable และ ORM ถูก isolate

## Steps

### 1. Define Repository Interfaces

1. กำหนด `Repository<T>` interface ด้วย domain types — methods `findById`, `findMany`, `create`, `update`, `delete` ตามที่ต้องการ
2. input/output ใช้ business model types ไม่ใช่ ORM row types — ห้าม import ORM package ใน interfaces
3. กำหนด error types: `RepositoryError`, `NotFoundError`, `ConflictError`
4. หลาย modules → repository interface ต่อ module

### 2. Implement Repository Adapters

1. ทำ `/follow-lib-drizzle` หรือ ORM-specific skill ของ ORM ที่ตรวจพบ
2. Implement interfaces ด้วย ORM API — แปลง ORM row ↔ business model ที่ boundary
3. Connection, transaction, error mapping (`RepositoryError`) อยู่ใน repository เท่านั้น
4. ไม่ leak ORM types/query objects ไปยัง business logic

### 3. Map Business Models To ORM Schemas

1. ORM table definitions ผ่าน ORM API; business models เป็น `readonly` types แยก
2. Mapper functions แปลง ORM row → business model (read) และ business model → ORM row (write)
3. ไม่ใช้ ORM type inference (`$inferSelect`) เป็น business type — สร้าง type แยก
4. mapping ซับซ้อน → pure function ที่ unit test ได้

### 4. Implement Query Specifications

1. `QuerySpec<T>` เป็น plain object: `filter`, `sort`, `pagination`, `select`
2. Repository แปลง `QuerySpec` → ORM query builder calls — ไม่ leak builder objects
3. รองรับ filtering, sorting, pagination, eager loading

### 5. Manage Transactions

1. `UnitOfWork` interface สำหรับ multi-step operations — implement ด้วย ORM transaction API
2. Business logic ส่ง callback ที่ใช้ repositories ภายใน transaction
3. Rollback/error recovery อยู่ใน repository เท่านั้น — ไม่เปิด transaction ใน business logic

### 6. Migrations And Tests

1. Migration strategy: `push` (dev) หรือ `generate + migrate` (production) — schema changes อยู่ใน migration files เท่านั้น
2. Business models ไม่กระทบเมื่อ schema เปลี่ยน — อัปเดต mapper เท่านั้น; seed scripts แยก
3. `/update-tests`: integration tests กับ real test DB, unit tests สำหรับ mappers, mock repository interfaces ใน business logic tests, transaction rollback + error cases (connection fail, constraint violation, not found)

## Rules

- Separation: business models / repository interfaces / business logic ไม่รู้จัก ORM — เฉพาะ repository implementations เท่านั้น
- Interfaces ใช้ business types + error types ของตัวเอง + `QuerySpec` + `UnitOfWork` — framework-agnostic
- Mappers เป็น pure functions — ห้าม `any` สำหรับ database results
- Anti-patterns: import ORM ใน business logic, ORM row types เป็น business types, leak query builder, transaction ใน business logic
- ใช้ /deep-review, /deep-review, /run-drizzle-studio ถ้าจำเป็น
