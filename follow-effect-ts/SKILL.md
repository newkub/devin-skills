---
name: follow-effect-ts
description: แนวทางการพัฒนาด้วย Effect-TS v3.x สำหรับ functional programming และ type-safe effects
allowed-tools:
  - read
  - write
  - edit
  - grep
  - glob
  - exec
triggers:
  - user
  - model
related:
  - follow-bun
  - follow-typescript
  - follow-vitest
---

## Goal

กำหนดมาตรฐานการพัฒนาด้วย Effect-TS v3.x สำหรับ functional programming ที่มี type safety, error handling และ dependency injection

## Scope

ใช้สำหรับโปรเจกต์ที่ต้องการ functional programming ด้วย Effect-TS

## Execute

### 1. Setup TypeScript Config

> Goal: ตั้งค่า `tsconfig.json` ให้รองรับ strict mode และ Effect types

1. แก้ไข `tsconfig.json` ให้มี:
   - `strict: true`
   - `noUncheckedIndexedAccess: true`
   - `exactOptionalPropertyTypes: true`
   - `skipLibCheck: true`

### 2. Install Effect Packages

> Goal: ติดตั้ง dependencies ของ Effect-TS ตามความจำเป็น

1. รัน `bun add effect` สำหรับ core library
2. รัน `bun add @effect/schema` สำหรับ data validation
3. รัน `bun add @effect/platform` ถ้าต้องการ platform abstractions
4. รัน `bun add @effect/platform-bun` สำหรับ Bun runtime
5. รัน `bun add -D vitest` สำหรับ testing
6. รัน `bun add -D tstyche` สำหรับ type-level tests

### 3. Create Project Structure

> Goal: สร้างโครงสร้างโฟลเดอร์ตาม Effect architecture

1. ใช้ `exec` รัน `mkdir -p src/app src/domain src/services src/adapters src/config src/types src/utils test/unit test/integration`
2. สร้าง `src/app/` สำหรับ composition root
3. สร้าง `src/domain/` สำหรับ pure business logic
4. สร้าง `src/services/` สำหรับ side effects
5. สร้าง `src/adapters/` สำหรับ external lib wrappers
6. สร้าง `src/config/` สำหรับ runtime config
7. สร้าง `src/types/` สำหรับ shared types
8. สร้าง `src/utils/` สำหรับ pure helpers
9. สร้าง `test/unit/` สำหรับ unit tests
10. สร้าง `test/integration/` สำหรับ integration tests

### 4. Implement Effect Patterns

> Goal: เขียน code ตาม Effect patterns มาตรฐานของ Effect-TS v3.x

1. ใช้ `Effect.gen` แทน pipe สำหรับ ergonomic code
2. ใช้ `Data.TaggedError` สำหรับ type-safe errors
3. ใช้ `Context.Tag` + `Layer` สำหรับ dependency injection
4. ใช้ `Schedule` สำหรับ retry/backoff policies
5. ใช้ `@effect/schema` สำหรับ data validation
6. ใช้ `Layer.mock` สำหรับ testing (v3.17.0+)

### 5. Write Tests

> Goal: เขียน tests ด้วย vitest และ tstyche ให้ครอบคลุม runtime และ type-level

1. ใช้ `it.effect` สำหรับ Effect-based tests
2. ใช้ `tstyche` สำหรับ type-level assertions
3. ใช้ `Layer.mock` สำหรับ partial implementations
4. รัน `bunx vitest` เพื่อ execute tests

## Rules

### 1. TypeScript Configuration

- ต้องมี `strict: true`
- ต้องมี `noUncheckedIndexedAccess: true`
- ต้องมี `exactOptionalPropertyTypes: true`

### 2. Core Libraries

- ใช้ `effect` (v3.x) เป็น core library
- ใช้ `@effect/schema` สำหรับ data validation
- ใช้ `@effect/platform` สำหรับ platform abstractions (ถ้าจำเป็น)

### 3. Code Patterns

- ใช้ `Effect.gen` แทน pipe
- ใช้ `Data.TaggedError` สำหรับ errors
- ใช้ `Context.Tag` + `Layer` สำหรับ DI
- ใช้ `Schedule` สำหรับ resilience

### 4. Project Structure

- `app/` <-- domain, services, types, config
- `domain/` <-- types, utils
- `services/` <-- types, config, adapters
- `adapters/` <-- external libs only
- `types/` <-- no internal dependencies
- `utils/` <-- no internal dependencies

### 5. Testing

- ใช้ `vitest` สำหรับ runtime tests
- ใช้ `tstyche` สำหรับ type-level tests
- ใช้ `Layer.mock` สำหรับ mocking

## Expected Outcome

- TypeScript config กำหนด strict mode สำหรับ Effect
- Effect v3.x libraries ติดตั้งสำเร็จ
- โครงสร้างโปรเจกต์ตาม Effect patterns
- ใช้ Effect.gen, Data.TaggedError, Context.Tag, Layer, Schedule
- Testing ด้วย vitest + tstyche
- Import dependencies ถูกต้องตามกฎ
