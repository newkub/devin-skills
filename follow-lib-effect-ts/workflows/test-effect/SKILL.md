---
name: follow-lib-effect-ts-test-effect
description: Test Effect code — @effect/vitest, Effect.runPromise, TestClock, layer mocking, Exit/Cause assertions
argument-hint: "[scope]"
related:
  - follow-lib-effect-ts
  - run-test
  - resolve-errors
  - improve-coverage
---

## Goal

เขียน tests สำหรับ Effect programs — `@effect/vitest` integration, `Effect.runPromise`, `TestClock`, `Layer` substitution, `Exit`/`Cause` assertions

## Scope

testing Effect code — `@effect/vitest` (`it.effect`, `it.scoped`, `it.live`), deterministic `TestClock`, Layer-based fakes, `Arbitrary` property testing

## Execute

### 1. Setup

```bash
bun i -D @effect/vitest vitest
```

```ts
import { describe, it } from "@effect/vitest"
// @effect/vitest@0.30+ requires vitest ^3.2 + effect ^3.22
```

### 2. Basic Assertions

```ts
it.effect("returns todos", () =>
  Effect.gen(function* () {
    const result = yield* program
    expect(result).toEqual(expected)
  }))

it.effect("fails with NotFound", () =>
  Effect.gen(function* () {
    const exit = yield* Effect.exit(program)
    expect(Exit.isFailure(exit)).toBe(true)
  }))
```

- `it.effect` — effect test body (TestClock ใส่มาให้, time ops deterministic)
- `it.live` — real clock เมื่อเทสกับ timing จริง
- `it.scoped` — tests ที่ต้อง `Scope` (acquireRelease, fibers scoped)

### 3. TestClock And Time

```ts
yield* TestClock.adjust("5 seconds")   // advance deterministic clock
```

- `TestClock` = default ใน `it.effect` — `Effect.sleep`/`timeout`/`retry` schedules test ได้ไม่ต้องรอจริง
- Timing-sensitive integration ใช้ `it.live`

### 4. Layer Substitution

```ts
const TestLayer = Layer.mergeAll(
  Layer.succeed(TodoRepo, { findAll: () => Effect.succeed(fixtures) }),
  Layer.mock(HttpClient)  // partial mocks
)
it.effect("with fake repo", () => program.pipe(Effect.provide(TestLayer)))
```

- `Layer.succeed(Tag, fakeImpl)` — full replacement; `Layer.mock` — partial + defaults throw
- Platform services: `FileSystem` in-memory layers, `Terminal` capture — ดู `use-platform`

### 5. Property Testing

- `Arbitrary.make(Schema)` → fast-check generators จาก schemas — random valid inputs

## Rules

- ทุก test ที่แตะ time → `it.effect` + `TestClock` — ไม่ใช้ `setTimeout`/real sleeps
- Mock ผ่าน `Layer.succeed`/`Layer.mock` — ห้าม `vi.mock` module-level สำหรับ services
- `Effect.exit`/`Exit.match` assert failures — ไม่ใช่ try/catch รอบ runPromise
- `it.live` เมื่อเทสกับ real IO/timing เท่านั้น

## Expected Outcome

- Tests deterministic ผ่าน TestClock + Layer fakes
- Failure cases assert ผ่าน Exit/Cause — ครอบ expected errors + defects
