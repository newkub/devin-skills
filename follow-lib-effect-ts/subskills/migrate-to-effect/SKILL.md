---
name: follow-lib-effect-ts-migrate-to-effect
description: ย้าย codebase neverthrow/promise มาใช้ Effect แบบ incremental
argument-hint: "[module-or-scope]"
related:
  - follow-lib-effect-ts
  - plan
  - scan-codebase
  - run-typecheck
  - run-test
  - report-before-after
---

## Goal

adopt Effect-TS เข้า codebase ที่ใช้ neverthrow/Promise/try-catch อยู่แบบ incremental — ทีละ module, ทำงานคู่กันได้, rollback ได้

## Scope

- ใช้เมื่อ project มี `effect` ติดตั้งแล้ว (ถ้ายัง → ทำ `subskills/setup-effect/SKILL.md` ก่อน) และต้องย้าย error handling/async patterns เดิมมาเป็น Effect
- ครอบคลุม: mapping patterns (Result → Effect, Promise → Effect.tryPromise), interop, incremental adoption
- ไม่บังคับ rewrite ทั้ง codebase — boundaries เดิมยังทำงานได้ระหว่าง migrate

## Execute

### 1. Plan And Map Impact

> Goal: เลือก scope และลำดับ migration

1. ทำ `/plan` — ระบุ modules ที่จะ migrate, dependency order (leaf modules ก่อน, entry point สุดท้าย)
2. ทำ `/scan-codebase` หา patterns เดิม: `Result`/`ResultAsync` (neverthrow), `try/catch` + `await`, `Promise` chains, custom error types
3. เขียน rollback path — migrate แยก commit ต่อ module ให้ revert ทีละ module ได้
4. ห้ามผสม migration กับ feature work ใน commit เดียว

### 2. Establish Interop Boundary

> Goal: code เก่าและ Effect ทำงานคู่กันได้ระหว่าง migrate

1. Wrap calls ที่ boundary: `Effect.tryPromise(() => promiseFn())` สำหรับ Promise-based code, `Effect.try` สำหรับ sync throws
2. neverthrow interop: `Result` → `Effect.succeed`/`Effect.fail`; `ResultAsync` → `Effect.tryPromise` + match — เขียน adapter helper เดียวใช้ร่วม
3. Expose Effect services กลับเป็น Promise ด้วย `Effect.runPromise` เมื่อ caller เก่ายังไม่ migrate
4. วาง adapters ใน `src/adapters/` — ห้ามกระจาย interop code ทั่ว codebase

### 3. Migrate Modules Incrementally

> Goal: ย้ายทีละ module ตามลำดับ leaf → root

1. Errors: custom error classes/`Err` → `Data.TaggedError`; จับด้วย `Effect.catchTag`/`catchTags`/`match`
2. Async: `try/catch` + `await` → `Effect.gen` + `yield*` + `Effect.tryPromise`; `ResultAsync` → `Effect` โดยตรง
3. Dependencies: constructor injection/factory params → `Effect.Service`/`Context.Tag` + `Layer`
4. Env/config: `process.env` reads → `Config` module
5. Resources: `try/finally` cleanup → `Effect.acquireRelease`/`Scope`/`Layer.scoped`
6. Retries/timeouts: manual retry loops → `Schedule` + `Effect.retry`/`Effect.timeout`

### 4. Verify Each Step

> Goal: ทุก module ที่ migrate typecheck และ tests ผ่าน

1. รัน `bunx tsc --noEmit` หลังแต่ละ module (ทำ `/run-typecheck`)
2. รัน tests ของ module นั้น (ทำ `/run-test`) — เพิ่ม `it.effect` tests สำหรับ behavior ใหม่
3. Assert error paths ด้วย `Effect.exit` + `Exit` แทน try/catch ใน tests
4. Runtime smoke ที่ entry point — ยืนยัน callers เก่ายังทำงานผ่าน interop boundary

### 5. Complete And Report

> Goal: สรุป coverage และงานค้าง

1. ตรวจ `Effect.run*` เหลือเฉพาะ entry point — ไม่มีใน service code
2. ถ้า migrate ไม่ครบ → ระบุ TODO list ต่อ module พร้อมสาเหตุ
3. เสร็จ → `/report-before-after` แล้ว `/ship`

## Rules

- Incremental เสมอ — ทีละ module, commit แยก, rollback ได้ทีละชิ้น
- Interop ที่ boundary เท่านั้น — ห้ามปน Promise/Result ใน Effect internals หรือกลับกัน
- Expected errors = `Data.TaggedError` ใน error channel; bugs ปล่อยเป็น defects (die)
- ถ้า API/pattern ไม่แน่ใจ → ดู official docs (effect.website)

## Expected Outcome

- Modules ที่ migrate ใช้ `Effect.gen`, `Data.TaggedError`, `Layer` ถูกต้อง
- Code เก่ายังทำงานผ่าน interop boundary ระหว่าง migrate
- Typecheck + tests ผ่านทุก commit — rollback ได้ทีละ module
