---
name: follow-orm
description: กำหนด ORM และ data access patterns ด้วย repository pattern และ type-safe mappings
allowed-tools:
  - read
  - edit
  - grep
  - glob
  - exec
  - write
triggers:
  - user
  - model
related: []
---
## Goal

กำหนด ORM และ data access patterns ที่แยก database logic ออกจาก business logic เพื่อให้ code testable และ maintainable

## Scope

ใช้สำหรับ projects ที่ใช้ ORM (Drizzle, Prisma, TypeORM) และต้องการแยก data access ออกจาก business logic

## Execute

### 1. Define Repository Interfaces

> Goal: กำหนด repository interfaces เพื่อ abstract data access
> Goal: Business logic ไม่รู้จัก ORM หรือ database implementation

1. กำหนด `Repository<T>` interface โดยใช้ domain types ไม่ใช่ ORM types
2. ระบุ methods: `findById`, `findMany`, `create`, `update`, `delete` ตามที่ต้องการ
3. ใช้ business model types เป็น input/output ไม่ใช่ ORM row types
4. ไม่ import ORM package ใน interfaces — ต้อง framework-agnostic
5. กำหนด error types: `RepositoryError`, `NotFoundError`, `ConflictError`
6. ถ้า project มีหลาย modules → สร้าง repository interface ต่อ module

### 2. Implement Repository Adapters

> Goal: เขียน repository implementations โดยใช้ ORM
> Goal: Database operations ถูก isolate ใน data access layer เท่านั้น

1. ทำ `/follow-drizzle` ถ้า project ใช้ Drizzle (หรือ ORM ที่ตรวจพบ)
2. สร้าง repository implementations ที่ implement interfaces
3. แปลง ORM row types เป็น business model types ที่ boundary
4. จัดการ connection และ transaction ใน repository เท่านั้น
5. แปลง ORM errors เป็น `RepositoryError` types
6. ไม่ leak ORM types หรือ query objects ไปยัง business logic

### 3. Map Business Models To ORM Schemas

> Goal: แยก business models จาก ORM table definitions
> Goal: Business models ไม่ผูกกับ database schema

1. กำหนด ORM table definitions โดยใช้ ORM API
2. กำหนด business models เป็น `readonly` types แยกจาก ORM
3. สร้าง mapper functions สำหรับแปลงระหว่าง ORM row ↔ business model
4. Mapper แปลง ORM row → business model (read) และ business model → ORM row (write)
5. ไม่ใช้ ORM type inference (`$inferSelect`) เป็น business type — สร้าง type แยก
6. ถ้า mapping ซับซ้อน → แยก mapper เป็น pure function ที่ test ได้

### 4. Implement Query Specifications

> Goal: สร้าง query specification pattern สำหรับ complex queries
> Goal: Business logic ส่ง query spec ได้โดยไม่รู้จัก ORM query builder

1. กำหนด `QuerySpec<T>` type เป็น plain object
2. ระบุ fields: `filter`, `sort`, `pagination`, `select`
3. Repository แปลง `QuerySpec` เป็น ORM query builder calls
4. ไม่ leak ORM query builder objects ไปยัง business logic
5. รองรับ common patterns: filtering, sorting, pagination, eager loading

### 5. Manage Transactions

> Goal: จัดการ transactions โดยใช้ unit of work pattern
> Goal: Transaction boundaries ชัดเจน ไม่กระทบ business logic

1. กำหนด `UnitOfWork` interface สำหรับ multi-step operations
2. Implement `UnitOfWork` โดยใช้ ORM transaction API
3. Business logic ส่ง callback ที่ใช้ repositories ภายใน transaction
4. จัดการ rollback และ error recovery ใน repository เท่านั้น
5. ไม่เปิด transaction ใน business logic layer

### 6. Handle Migrations

> Goal: ทำ `/follow-drizzle` สำหรับ migration strategy
> Goal: Migrations จัดการโดยไม่กระทบ business logic

1. กำหนด migration strategy: `push` (dev) หรือ `generate + migrate` (production)
2. Schema changes อยู่ใน migration files เท่านั้น
3. ไม่กระทบ business models เมื่อ schema เปลี่ยน — อัปเดต mapper เท่านั้น
4. ทดสอบ migrations ก่อน deploy
5. สร้าง seed scripts แยกจาก business logic

### 7. Test Data Access

> Goal: ทำ `/write-test` เพื่อทดสอบ repository implementations
> Goal: Repository implementations มี test coverage ครบ

1. Integration tests สำหรับ repository implementations กับ test database
2. Unit tests สำหรับ mapper functions — test pure transformation
3. Mock repository interfaces ใน business logic tests
4. Test transaction rollback scenarios
5. Test error handling: connection fail, constraint violation, not found

## Rules

### 1. Separation Of Concerns

| Concern | Responsibility | Knows About ORM |
|---------|---------------|-----------------|
| Business models | Domain types | No |
| Repository interfaces | Data access contracts | No |
| Business logic | Use cases using repositories | No |
| Repository implementations | ORM operations | Yes |

### 2. Interface Rules

- Interfaces ใช้ business types เป็น input/output ไม่ใช่ ORM types
- Interfaces ไม่ import ORM package ใดๆ
- Interfaces กำหนด error types ของตัวเอง: `RepositoryError`, `NotFoundError`
- Interfaces รองรับ `QuerySpec` สำหรับ complex queries ไม่ใช่ ORM query builder
- Interfaces กำหนด `UnitOfWork` สำหรับ transaction boundaries

### 3. Implementation Rules

- Implementations ใช้ ORM API โดย implement interfaces
- Implementations แปลง ORM types ↔ business types ที่ boundary
- Implementations จัดการ connection, transaction, และ error mapping
- Implementations ไม่ส่ง ORM objects ไปยัง business logic
- ORM table definitions แยกจาก business models

### 4. Mapping Rules

- สร้าง business model types แยกจาก ORM row types
- Mapper functions เป็น pure functions ที่ test ได้
- ไม่ใช้ ORM type inference เป็น business type
- ถ้า mapping ซับซ้อน → แยกเป็น pure function แล้ว unit test

### 5. Anti-Patterns

- ห้าม import ORM ใน business logic
- ห้ามใช้ ORM row types เป็น business model types
- ห้าม leak ORM query builder ไปยัง business logic
- ห้ามเปิด transaction ใน business logic
- ห้ามใช้ `any` สำหรับ database results — ใช้ mapper functions

## Expected Outcome

- Repository interfaces ที่ framework-agnostic
- Repository implementations ที่ isolate ORM
- Business models แยกจาก ORM table definitions
- Transaction boundaries จำกัดใน data access layer
- Query specifications ที่ไม่ผูกกับ ORM
- Test coverage ครบสำหรับ mappers และ repository implementations
