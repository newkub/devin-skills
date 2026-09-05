---
name: follow-lib-effect-ts
description: แนวทางการพัฒนาด้วย Effect-TS 3.22+ สำหรับ functional programming และ type-safe effects
argument-hint: "[scope]"
related:
  - follow-best-practice
  - use-my-packages-on-registry
  - setup-cicd
---

## Goal

กำหนดมาตรฐานการพัฒนาด้วย Effect-TS เวอร์ชันล่าสุด สำหรับ functional programming ที่มี type safety, error handling และ dependency injection

## Scope

ใช้สำหรับโปรเจกต์ที่ต้องการ functional programming ด้วย Effect-TS

- ตั้งค่า `tsconfig.json` ให้รองรับ strict mode และ Effect types
- ติดตั้ง `effect`, `@effect/platform`, `@effect/vitest`, และ dependencies ที่เกี่ยวข้อง
- สร้างโครงสร้างโปรเจกต์ตาม Effect patterns
- เขียน code ด้วย `Effect.gen`, `Data.TaggedError`, `Context.GenericTag`, `Layer`, `Schedule`, `Schema`
- เขียน tests ด้วย `vitest` และ `@effect/vitest`

## Execute

### 1. Setup TypeScript Config

> Goal: ตั้งค่า `tsconfig.json` ให้รองรับ strict mode และ Effect types

1. ตรวจสอบว่า TypeScript เวอร์ชัน `5.4` หรือใหม่กว่า
2. แก้ไข `tsconfig.json` ให้มี:
   - `strict: true`
   - `noUncheckedIndexedAccess: true`
   - `exactOptionalPropertyTypes: true`
   - `skipLibCheck: true`

### 2. Install Effect Packages

> Goal: ติดตั้ง dependencies ของ Effect-TS ตามความจำเป็น

1. รัน `bun add effect@3.22.1` หรือ `bun add effect` สำหรับ core library (latest stable)
2. `Schema` รวมอยู่ใน core `effect` ตั้งแต่ v3.x (ไม่ต้องติดตั้ง `@effect/schema` แยก)
3. รัน `bun add @effect/platform` ถ้าต้องการ platform abstractions
4. รัน `bun add @effect/platform-bun` สำหรับ Bun runtime
5. รัน `bun add -D vitest @effect/vitest` สำหรับ testing
6. รัน `bun add -D tstyche` สำหรับ type-level tests (optional)

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

1. ใช้ `Effect.gen` สำหรับ ergonomic effect composition
2. ใช้ `Data.TaggedError` หรือ `Schema.TaggedError` สำหรับ type-safe errors
3. ใช้ `Context.GenericTag` + `Layer` สำหรับ dependency injection (แนะนำใน v3.22)
4. ใช้ `Effect.Service` ได้ถ้าต้องการสร้าง service พร้อม default layer ใน v3
5. ใช้ `Schedule` สำหรับ retry/backoff policies
6. ใช้ `Schema` จาก core `effect` สำหรับ data validation
7. ใช้ `Layer` สำหรับ provide test implementations ถ้า version รองรับ

### 5. Write Tests

> Goal: เขียน tests ด้วย vitest และ @effect/vitest ให้ครอบคลุม runtime และ type-level

1. ใช้ `it.effect` จาก `@effect/vitest` สำหรับ Effect-based tests
2. ใช้ `it.live` ถ้าต้องการทดสอบกับ live environment
3. ใช้ `it.layer` สำหรับ share `Layer` ระหว่าง tests
4. ใช้ `tstyche` สำหรับ type-level assertions (optional)
5. ใช้ `Layer` สำหรับ partial implementations ถ้า version รองรับ
6. รัน `bunx vitest` เพื่อ execute tests

## Rules

### 1. TypeScript Configuration

- ต้องใช้ TypeScript `5.4` หรือใหม่กว่า
- ต้องมี `strict: true`
- ต้องมี `noUncheckedIndexedAccess: true`
- ต้องมี `exactOptionalPropertyTypes: true`

### 2. Core Libraries

- ใช้ `effect` (v3.x) เป็น core library
- ใช้ `Schema` จาก core `effect` สำหรับ data validation (`@effect/schema` เป็น legacy)
- ใช้ `@effect/platform` สำหรับ platform abstractions (ถ้าจำเป็น)
- ใช้ `@effect/vitest` สำหรับ Effect-aware tests

### 3. Code Patterns

- ใช้ `Effect.gen` สำหรับ effect composition
- ใช้ `Data.TaggedError` หรือ `Schema.TaggedError` สำหรับ errors
- ใช้ `Context.GenericTag` + `Layer` สำหรับ DI (v3.22)
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
- ใช้ `@effect/vitest` (`it.effect`, `it.live`, `it.layer`) สำหรับ Effect tests
- ใช้ `tstyche` สำหรับ type-level tests (optional)
- ใช้ `Layer` สำหรับ testing ถ้า version รองรับ

### 6. Version Notes

- Latest stable: `effect@3.22.1` (verified 2026-07-30)
- Effect v4 RC: `effect@rc` (4.0.0-rc.112) มี breaking changes หลัก: package consolidation (`effect/unstable/*`), `Context.Service` แทน `Context.Tag`/`Context.GenericTag`/`Effect.Service`, `Yieldable` types ต้องใช้ `.asEffect()`, `Layer`/`Runtime` API เปลี่ยน
- ตรวจสอบ version ใน `package.json` ก่อนเลือก API

- ใช้ `/follow-best-practice` ถ้าจำเป็น
- ใช้ `/use-my-packages-on-registry` ถ้าจำเป็น
- ใช้ `/setup-cicd` ถ้าจำเป็น

## Expected Outcome

- TypeScript config กำหนด strict mode สำหรับ Effect
- Effect v3.x libraries ติดตั้งสำเร็จ
- โครงสร้างโปรเจกต์ตาม Effect patterns
- ใช้ Effect.gen, Data.TaggedError, Context.GenericTag, Layer, Schedule
- Testing ด้วย vitest + @effect/vitest
- Import dependencies ถูกต้องตามกฎ
