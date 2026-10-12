---
name: follow-lib-effect-ts-handle-errors
description: Effect error handling — TaggedError, catchTag*, Cause/Exit, defects vs expected errors, retry/Schedule
argument-hint: "[scope]"
related:
  - follow-lib-effect-ts
  - run-test
  - resolve-errors
---

## Goal

จัดการ errors ใน Effect อย่าง type-safe — expected errors ผ่าน `E` channel, defects (bugs) แยกออก, retry/timeout/schedule

## Scope

error model ของ Effect — `Data.TaggedError`, `Effect.catchTag*`, `Cause`/`Exit`, `Effect.retry`+`Schedule`, `Effect.timeout`

## Execute

### 1. Model Expected Errors

```ts
import { Data } from "effect"

class NotFound extends Data.TaggedError("NotFound")<{ id: string }> {}
class DbError extends Data.TaggedError("DbError")<{ cause: unknown }> {}
// Schema.TaggedError เมื่อต้อง serialize errors ข้าม boundary
```

- `yield*` errors ได้ใน `Effect.gen` (TaggedError yieldable)

### 2. Catch And Recover

```ts
program.pipe(
  Effect.catchTag("NotFound", (e) => Effect.succeed(fallback)),
  Effect.catchTags({ DbError: (e) => Effect.fail(new Fatal(e)) }),
  Effect.catchAll((e) => ...),        // เหลือทุก expected error
  Effect.catchAllDefect((d) => ...),  // bugs/defects แยก
  Effect.match({ onFailure, onSuccess }),
)
```

- `catchTag` narrow ตาม `_tag`; `catchAll` handle ทั้ง `E` channel
- `Effect.orElse`/`Effect.orElseFail` สำหรับ fallback effects

### 3. Defects, Cause, Exit

- Defects = bugs (throws, type errors) — ไม่ควร catch; inspect ด้วย `Cause`/`Effect.sandbox`
- `Effect.exit` → `Exit<A, E>` inspect success/failure โดยไม่ throw (ใช้ใน tests)
- `Effect.tapError`/`tapErrorTag` สำหรับ logging โดยไม่เปลี่ยน outcome

### 4. Retry, Timeout, Schedule

```ts
Effect.retry(program, Schedule.exponential("100 millis").pipe(Schedule.compose(Schedule.recurs(5))))
Effect.timeout(program, "5 seconds")               // TimeoutException defect? no — Option/timeout error
Effect.timeoutOption / timeoutTo เมื่อต้อง custom timeout result
```

- `Schedule` combinators: `exponential`, `fixed`, `jittered`, `recurs`, `whileInput`

## Rules

- Expected errors ใช้ `TaggedError` — defects ปล่อยผ่าน (อย่า swallow bugs)
- ห้าม `try/catch` รอบ Effect code — ใช้ `catchTag*` combinators
- retry เฉพาะ idempotent operations — mutation ต้องดู side effects
- `Effect.timeout` = deadline ที่ enforce จริงผ่าน interruption

## Expected Outcome

- Error types ชัด expected vs defect
- Retry/timeout ตาม policy, errors traceable ผ่าน Cause/Exit
