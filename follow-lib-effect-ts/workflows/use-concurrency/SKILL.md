---
name: follow-lib-effect-ts-use-concurrency
description: Effect concurrency — Effect.all, forEach, fibers, racing, interruption, Deferred/Queue coordination
argument-hint: "[scope]"
related:
  - follow-lib-effect-ts
  - run-test
  - resolve-errors
---

## Goal

ใช้ concurrency primitives ของ Effect ครบ — parallel composition, fibers, racing, interruption, fiber-local coordination

## Scope

concurrent execution — `Effect.all`/`Effect.forEach`, `Effect.fork`, `Fiber`, `Effect.race`, `Deferred`/`Queue`/`Semaphore`, interruption semantics

## Execute

### 1. Parallel Composition

```ts
Effect.all([a, b, c])                          // tuple → tuple result
Effect.all({ a, b, c })                        // record → record
Effect.forEach(items, fn, { concurrency: 4 })  // bounded parallel map
Effect.all(tasks, { concurrency: "unbounded", mode: "either" })
```

- `Effect.forEach` + `concurrency` = workhorse สำหรับ batch IO
- Options: `{ concurrency: N }`, `{ batching: true }`, `{ discard: true }` (fire-and-collect-unit)
- `mode: "either"` = first success wins; `"validate"` = collect errors

### 2. Fibers

```ts
const fiber = yield* Effect.fork(work)
yield* Fiber.join(fiber)                        // wait + get result
yield* Fiber.interrupt(fiber)                   // cooperative cancel
Effect.forkDaemon(fireAndForget)                // survives parent
```

- Fiber = lightweight thread, cooperative cancellation — interruption ไม่ทิ้ง state ค้าง
- `Effect.scoped`/`forkIn(scope)` ties fiber lifetime ให้ scope

### 3. Racing And Timeouts

- `Effect.race(a, b)` — loser interrupted
- `Effect.raceAll`, `Effect.timeout`, `Effect.timeoutFail`
- `Effect.disconnect` สำหรับ uninterruptible regions (critical cleanup)

### 4. Coordination Primitives

- `Deferred.make` — one-shot async value (promise ที่ cancel-safe)
- `Queue.bounded/unbounded` — producer/consumer
- `Effect.makeSemaphore(n).withPermits` — bounded resource access
- `Ref.make` — atomic mutable state; `Ref.Synchronized` สำหรับ effectful updates

## Rules

- `concurrency` bound เสมอเมื่อ over collections — unbounded บน thousands items = resource exhaustion
- Fire-and-forget ใช้ `forkDaemon`/`forkScoped` ชัดเจน — `fork` ธรรมดา tie กับ parent
- Interruption = cooperative — long CPU loops ต้อง `Effect.yieldNow` เผื่อ cancel points
- อย่าใช้ raw Promise.all ข้างใน Effect — เสีย interruption + error channel

## Expected Outcome

- Parallel work bounded + cancel-safe
- Fiber lifetime ชัดเจน, coordination ผ่าน Deferred/Queue/Ref
