---
name: follow-lib-effect-ts
description: แนวทางการพัฒนาด้วย Effect-TS 3.22+ สำหรับ functional programming และ type-safe effects
argument-hint: "[scope]"
related:
  - follow-best-practice
  - follow-lang-typescript
  - follow-tool-vitest
  - use-my-packages-on-registry
  - setup-cicd
---

## Goal

กำหนดมาตรฐานการพัฒนาด้วย Effect-TS เวอร์ชันล่าสุด สำหรับ functional programming ที่มี type safety, error handling และ dependency injection

## Scope

ใช้สำหรับโปรเจกต์ที่ต้องการ functional programming ด้วย Effect-TS

- ตรวจ version ของ `effect` ใน `package.json` ก่อนเลือก API (v3.x vs v4 RC ต่างกัน)
- ตั้งค่า `tsconfig.json` ให้รองรับ strict mode และ Effect types
- ติดตั้ง `effect`, `@effect/platform`, `@effect/vitest` และ dependencies ที่เกี่ยวข้อง
- สร้างโครงสร้างโปรเจกต์ตาม Effect architecture
- เขียน code ด้วย `Effect.gen`, `Effect.fn`, `Data.TaggedError`, `Context.Tag`, `Effect.Service`, `Layer`, `Schedule`, `Schema`
- เขียน tests ด้วย `vitest` และ `@effect/vitest`

## Execute

### 1. Detect Version And Ecosystem

> Goal: เลือก API ที่ตรงกับ effect version และ package manager ของ project

1. อ่าน `package.json` → ถ้า `effect` เป็น `3.x` ใช้ v3 API; ถ้า `4.x` หรือ `-rc`/`-beta` ใช้ v4 API (ดู Version Notes ใน [references/effect-ts.md](references/effect-ts.md))
2. ตรวจ package manager จาก lockfile (`bun.lock`/`bun.lockb` → `bun`, `pnpm-lock.yaml` → `pnpm`, `package-lock.json` → `npm`) แล้วใช้ command ที่ตรงกัน
3. ถ้า project ยังไม่มี `effect` → ติดตั้ง latest stable (v3.x) ตาม step 3

### 2. Setup TypeScript Config

> Goal: ตั้งค่า `tsconfig.json` ให้รองรับ strict mode และ Effect types

1. ตรวจสอบว่า TypeScript เวอร์ชัน `5.4` หรือใหม่กว่า (`bunx tsc --version`)
2. แก้ไข `tsconfig.json` ให้มี:
   - `strict: true`
   - `noUncheckedIndexedAccess: true`
   - `exactOptionalPropertyTypes: true`
   - `skipLibCheck: true`
   - `module: "ESNext"`/`"Preserve"` + `moduleResolution: "bundler"` หรือ `"nodenext"` ตาม runtime
   - `target: "ES2022"` หรือใหม่กว่า

### 3. Install Effect Packages

> Goal: ติดตั้ง dependencies ของ Effect-TS ตามความจำเป็น

1. รัน `bun add effect` สำหรับ core library (latest stable `3.22.2`, verified 2026-09-11) — `effect` เป็น runtime dependency ห้ามใส่ `-D`
2. `Schema` รวมอยู่ใน core `effect` ตั้งแต่ v3.x (ไม่ต้องติดตั้ง `@effect/schema` แยก)
3. รัน `bun add @effect/platform` ถ้าต้องการ platform abstractions (`FileSystem`, `Path`, `HttpClient`, `Terminal`)
4. รัน `bun add @effect/platform-bun` สำหรับ Bun runtime หรือ `bun add @effect/platform-node` สำหรับ Node.js
5. รัน `bun add -D vitest@^3.2 @effect/vitest` สำหรับ testing — `@effect/vitest@0.30.0` ต้องการ peer `vitest ^3.2.0` ถ้า project ใช้ vitest 4/5 ให้ตรวจ peer ก่อน
6. รัน `bun add -D tstyche` สำหรับ type-level tests (optional)
7. รัน `bun add @effect/cli` เมื่อสร้าง CLI app หรือ `bun add @effect/experimental` สำหรับ experimental APIs (optional)

### 4. Create Project Structure

> Goal: สร้างโครงสร้างโฟลเดอร์ตาม Effect architecture

1. ใช้ `exec` รันคำสั่งตาม OS — Windows PowerShell:
   `New-Item -ItemType Directory -Force -Path src/app,src/domain,src/services,src/adapters,src/config,src/types,src/utils,test/unit,test/integration`
   หรือ POSIX shell: `mkdir -p src/app src/domain src/services src/adapters src/config src/types src/utils test/unit test/integration`
2. สร้าง `src/app/` สำหรับ composition root (entry point, `MainLayer`, `runMain`)
3. สร้าง `src/domain/` สำหรับ pure business logic, domain schemas และ errors
4. สร้าง `src/services/` สำหรับ service interfaces (`Tag`/`Effect.Service`) และ implementations (`Layer`)
5. สร้าง `src/adapters/` สำหรับ external lib wrappers
6. สร้าง `src/config/` สำหรับ runtime config ด้วย `Config` module
7. สร้าง `src/types/` สำหรับ shared types
8. สร้าง `src/utils/` สำหรับ pure helpers
9. สร้าง `test/unit/` สำหรับ unit tests และ `test/integration/` สำหรับ integration tests
10. วาง entry point ที่ `src/index.ts` หรือ `src/app/main.ts` แล้ว run ด้วย `Effect.runPromise`/`BunRuntime.runMain` ที่ edge เท่านั้น

### 5. Implement Effect Patterns

> Goal: เขียน code ตาม Effect patterns มาตรฐาน — ตัวอย่างครบใน [references/effect-ts.md](references/effect-ts.md) และ [references/patterns.md](references/patterns.md)

1. ใช้ `Effect.gen` + `yield*` สำหรับ effect composition และ `pipe` สำหรับ chaining
2. ใช้ `Effect.fn`/`Effect.fnUntraced` สำหรับ named functions ที่ traceable
3. ใช้ `Data.TaggedError` หรือ `Schema.TaggedError` สำหรับ type-safe errors แล้วจับด้วย `Effect.catchTag`/`Effect.catchTags`/`Effect.match`
4. ใช้ `Effect.Service` (v3.9+) สำหรับ service พร้อม default layer หรือ `Context.Tag`/`Context.GenericTag` + `Layer.succeed`/`Layer.effect`/`Layer.scoped` สำหรับ manual DI
5. ใช้ `Config` module (`Config.string`, `Config.number`, `Config.redacted`) สำหรับ env config
6. ใช้ `Schedule` + `Effect.retry`/`Effect.timeout` สำหรับ resilience
7. ใช้ `Effect.acquireRelease`/`Effect.scoped`/`Layer.scoped` สำหรับ resource safety
8. ใช้ `Effect.all`/`Effect.forEach` (กำหนด `concurrency`) สำหรับ concurrency และ `Effect.fork` + `Fiber` สำหรับ background work
9. ใช้ `Schema` จาก core `effect` สำหรับ data validation และ `Option`/`Either` สำหรับ domain values
10. ใช้ `Stream`/`Sink` เมื่อข้อมูลเป็น streaming
11. Run effects ที่ boundary เท่านั้น: `Effect.runPromise`, `Effect.runSync`, `Effect.runFork`, `ManagedRuntime` หรือ `BunRuntime.runMain`
12. เพิ่ม observability ด้วย `Effect.log`, `Effect.withSpan`, `Logger`, `Metric` ตามความจำเป็น

### 6. Write Tests

> Goal: เขียน tests ด้วย vitest และ @effect/vitest — รายละเอียดใน [references/testing.md](references/testing.md)

1. ใช้ `it.effect` จาก `@effect/vitest` สำหรับ Effect-based tests (ได้ `TestContext` อัตโนมัติ)
2. ใช้ `it.live` เมื่อต้องการ live clock/environment และ `it.scoped` เมื่อ test ต้องการ `Scope`
3. ใช้ `it.layer` สำหรับ share `Layer` ระหว่าง tests
4. ใช้ `Layer.mock` (v3.17+) สำหรับ partial implementations หรือ `Layer.succeed` + `Effect.provide` สำหรับ test layer
5. ใช้ `TestClock` เพื่อควบคุมเวลาใน tests ที่ใช้ `Schedule`/`Effect.sleep`
6. Assert failures ด้วย `Effect.exit` + `Exit` แทน try/catch
7. ใช้ `tstyche` สำหรับ type-level assertions (optional)
8. รัน `bunx vitest run` เพื่อ execute tests

### 7. Validate

> Goal: project typecheck และ tests ผ่านก่อนส่งมอบ

1. รัน `bunx tsc --noEmit` ให้ผ่าน
2. รัน `bunx vitest run` ให้ผ่าน
3. ตรวจว่าไม่มี `Effect.run*` ใน library/service code (อนุญาตเฉพาะ entry point)

## Rules

### 1. TypeScript Configuration

- ทำตาม `/follow-lang-typescript` สำหรับ base config (strict mode, moduleResolution)

- ต้องใช้ TypeScript `5.4` หรือใหม่กว่า
- ต้องมี `strict: true`, `noUncheckedIndexedAccess: true`, `exactOptionalPropertyTypes: true`
- ใช้ `moduleResolution: "bundler"` หรือ `"nodenext"` ตาม runtime

### 2. Imports And Dependencies

- Import แบบ namespace จาก package เดียว: `import { Effect, Schema, Layer, Context, Schedule } from "effect"`
- ถ้าใช้ subpath imports เช่น `import * as Effect from "effect/Effect"` ให้เลือก style เดียวสม่ำเสมอทั้ง project
- `effect` เป็น runtime dependency (`bun add effect` ไม่ใช่ `-D`)
- `@effect/schema` standalone เป็น legacy — ใช้ `Schema` จาก `effect` เท่านั้น
- `@effect/vitest@0.30.0` ต้องการ peer `vitest ^3.2.0` และ `effect ^3.22.0` — pin vitest ให้ตรงก่อนติดตั้ง (setup ดู `/follow-tool-vitest`)

### 3. Code Patterns

- `Effect.gen` สำหรับ composition; ห้าม `yield*` ค่าที่ไม่ใช่ yieldable (`Effect`, `Option`, `Either`, `TaggedError`)
- `Data.TaggedError`/`Schema.TaggedError` สำหรับ expected errors; defects (bugs) ปล่อยเป็น die ใน `Cause`
- `Effect.Service` (v3.9+) เป็นวิธีแนะนำสำหรับ services; `Context.Tag`/`GenericTag` + `Layer` เมื่อต้องการ manual control
- `Schedule` + `Effect.retry` สำหรับ resilience; `Effect.timeout` สำหรับ deadline
- `Effect.acquireRelease`/`Scope`/`Layer.scoped` สำหรับ resources ที่ต้อง cleanup
- Run (`Effect.run*`) เฉพาะที่ application boundary เท่านั้น

### 4. Project Structure

- `app/` <-- domain, services, types, config (composition root เท่านั้นที่ run effects)
- `domain/` <-- types, utils (pure, ไม่มี side effects)
- `services/` <-- types, config, adapters
- `adapters/` <-- external libs only
- `types/`, `utils/` <-- no internal dependencies

### 5. Testing

- ใช้ `vitest` + `@effect/vitest` (`it.effect`, `it.live`, `it.scoped`, `it.layer`) สำหรับ Effect tests
- ใช้ `TestClock`/`TestContext` แทน real timers และ `Layer.mock` สำหรับ mocks
- ใช้ `tstyche` สำหรับ type-level tests (optional)

### 6. Version Notes

- Latest stable (verified 2026-09-11): `effect@3.22.2`, `@effect/platform@0.97.2`, `@effect/platform-bun@0.91.2`, `@effect/platform-node@0.108.2`, `@effect/vitest@0.30.0`
- Effect v4 RC: `effect@rc` (`4.0.0-rc.113`) มี breaking changes หลัก: package consolidation (`effect/unstable/*`), `Context.Service` แทน `Context.Tag`/`Context.GenericTag`/`Effect.Service`, `Yieldable` types ต้องใช้ `.asEffect()`, `Layer`/`Runtime` API เปลี่ยน
- TypeScript latest: `7.0.2` (native/tsgo) — `effect` ต้องการขั้นต่ำ `5.4`; ตรวจ compatibility กับ toolchain ของ project ก่อนใช้
- ตรวจสอบ version ใน `package.json` ก่อนเลือก API เสมอ

- ใช้ `/follow-best-practice` ถ้าจำเป็น
- ใช้ `/use-my-packages-on-registry` ถ้าจำเป็น
- ใช้ `/setup-cicd` ถ้าจำเป็น

## Expected Outcome

- TypeScript config กำหนด strict mode สำหรับ Effect
- Effect libraries ติดตั้งสำเร็จตรง peer constraints
- โครงสร้างโปรเจกต์ตาม Effect architecture และ dependency rules
- Code ใช้ `Effect.gen`, `Effect.fn`, `Data.TaggedError`, `Effect.Service`/`Context.Tag`, `Layer`, `Schedule`, `Schema`
- Tests ผ่านด้วย `vitest` + `@effect/vitest`
- `bunx tsc --noEmit` และ `bunx vitest run` ผ่านทั้งหมด
