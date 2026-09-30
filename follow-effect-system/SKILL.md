---
name: follow-effect-system
description: พัฒนา TypeScript ด้วย Effect — Effect.gen, Layer DI, tagged errors, Schema, structured concurrency
argument-hint: "[task]"
related:
  - follow-tool-vitest
  - follow-lib-effect-ts
  - deep-research
---

## Goal

พัฒนา TypeScript applications ด้วย Effect (`effect` package) อย่างถูกต้อง — type-safe error channel, dependency injection ผ่าน Layer, structured concurrency, Schema validation — ไม่ใช้ try/catch/throw ดิบใน Effect code

## Scope

ใช้กับ projects ที่ใช้ `effect` — core `Effect<A, E, R>` (success/error/requirements), services ผ่าน `Context.Tag` + `Layer`, `@effect/platform-*` (node/bun), `@effect/cli`, `@effect/rpc`

- Latest: `effect@3.22.2` (verified 2026-10-03) — Schema รวมอยู่ใน core (`effect/Schema`) ไม่ใช่แพ็กเกจแยกแล้ว

## Execute

### 1. Core Effect Values

> Goal: สร้างและ compose effects ถูกวิธี

1. ทุกอย่างคือ `Effect<A, E, R>` — lazy, ไม่รันจนกว่า `Effect.runPromise`/`runSync`/`runFork` ที่ edge เท่านั้น
2. Compose ด้วย `Effect.gen(function* () { const x = yield* eff })` — ห้าม `.then` chains; ใช้ `yield*` ดึงค่า
3. สร้างค่า: `Effect.succeed(v)`, `Effect.fail(e)`, `Effect.sync(() => v)` (sync), `Effect.promise(() => p)` (promise), `Effect.try({ try, catch })` (throwing code → typed error)
4. `pipe` style: `pipe(effect, Effect.map, Effect.flatMap, Effect.andThen)` — `flatMap` เมื่อ step ถัดไปต้องใช้ค่าก่อนหน้า
5. side effect ที่คืน void → `Effect.void`; เงื่อนไข → `Effect.if`/`Effect.when`

### 2. Services And Layers

> Goal: DI ผ่าน Context.Tag + Layer — ไม่ใช่ singleton/imports ตรง

1. นิยาม service: `class Foo extends Context.Tag("Foo")<Foo, { method: (...) => Effect<...}>() {}` (class-based tag — canonical ใน v3)
2. สร้าง Layer: `Layer.succeed(Foo, impl)` (sync), `Layer.effect(Foo, Effect.gen(...))` (needs other services), `Layer.scoped` (needs cleanup)
3. Compose: `Layer.mergeAll(a, b)`, `Layer.provide` (a ต้องการ b), `Layer.merge` — app layer เดียวรวมทั้งหมด
4. ใช้ service: `const foo = yield* Foo` ใน gen — `R` channel track requirements ให้ compiler บังคับ provide
5. ที่ edge: `Effect.runPromise(effect.pipe(Effect.provide(AppLayer)))` — provide ครั้งเดียวที่ boundary
6. test: `Layer.succeed(Foo, mockImpl)` swap ได้โดยไม่แก้ business code — DI คือ testability

### 3. Typed Error Handling

> Goal: errors เป็น typed values ใน E channel — ไม่ใช่ exceptions

1. tagged errors: `class NotFound extends Data.TaggedError("NotFound")<{ id: string }> {}` — discriminate ด้วย `_tag`
2. recover: `Effect.catchTag("NotFound", (e) => ...)`, `catchTags` หลายตัว, `Effect.orElse`, `Effect.orElseSucceed`
3. `Effect.match`/`matchEffect` — fold success+error เป็นค่าเดียว
4. retry: `Effect.retry(Schedule.exponential("100 millis"))` — compose schedules (jittered, recurs, spaced)
5. defects (unexpected throws) แยกจาก typed errors — `Effect.catchAllDefect` เฉพาะ boundary; ห้ามเปลี่ยน defects เป็น business flow

### 4. Schema Validation

> Goal: validate boundary data ด้วย `effect/Schema`

1. define: `const User = Schema.Struct({ id: Schema.String, age: Schema.Number })` — type อนุมานอัตโนมัติ
2. decode: `Schema.decodeUnknown(User)(raw)` → `Effect<User, ParseError>` — validate ทุก external input (API, env, files)
3. transform: `Schema.transform`, `Schema.fromKey`, defaults ด้วย `Schema.withDefaults`
4. branded types: `Schema.String.pipe(Schema.brand("UserId"))` — nominal typing กัน mix IDs
5. JSON round-trip: `Schema.encode`/`decode` — ใช้ `Schema.parseJson` สำหรับ wire format

### 5. Concurrency And Resources

> Goal: structured concurrency + resource safety

1. parallel: `Effect.all([a, b, c], { concurrency: "unbounded" | n })` — results tuple; `{ mode: "either" }` เก็บ partial results
2. racing/timeouts: `Effect.race`, `Effect.timeout("5 seconds")`, `Effect.timeoutFail`
3. fibers: `Effect.fork` + `Fiber.join` — interruption propagates ตาม structured concurrency; `Effect.scoped` เป็น boundary
4. resources: `Effect.acquireRelease(acquire, (r) => release)` — release รันเสมอแม้ interrupt; wrap ด้วย `Effect.scoped`
5. streams: `Stream` module สำหรับ unbounded data — `Stream.runCollect`, `Stream.runForEach`, `Stream.pipe` + `Stream.mapEffect`
6. observability: `Effect.log`, `Effect.logInfo/Warning/Error`, `Effect.withSpan("name")` (tracing), Metrics module

### 6. Edge And Interop

> Goal: รัน Effect ที่ boundary เดียว + interop กับ Promise world

1. `Effect.runPromise` (async edge), `Effect.runSync` (pure only), `Effect.runFork` (background fiber), `Effect.runCallback` (exit)
2. `Exit` type แยก success/failure/defect — ใช้เมื่อต้อง inspect result ไม่ throw
3. Promise libs → `Effect.tryPromise({ try, catch })` ห่อเสมอ — อย่าปล่อย untyped rejection เข้า Effect code
4. platform layers: `@effect/platform-node` (`NodeContext`, `NodeRuntime`), `@effect/platform-bun` สำหรับ Bun (`BunContext`, `BunRuntime`) — HttpServer, FileSystem, Terminal services

## Rules

### 1. Effect-First

- business logic อยู่ใน `Effect` เสมอ — `runPromise` เฉพาะ edge (entry point, handler boundary, test)
- errors เป็น values ใน `E` channel — ห้าม `throw` ใน Effect code; defects เฉพาะ bugs จริง
- requirements ผ่าน `R` channel/Layer — ห้าม import singletons/globals ตรงใน Effect code

### 2. Composition

- `Effect.gen` เป็นวิธีหลัก compose — pipe combinators เมื่อสั้น; ห้าม nest callbacks
- layers รวมเป็น app layer เดียว ที่ root — provide ครั้งเดียวที่ edge
- resource cleanup ผ่าน `acquireRelease`/`scoped` เสมอ — ไม่ใช่ try/finally ดิบ

### 3. Type Safety

- validate external data ด้วย Schema เสมอ — ห้าม cast `as T` ที่ boundary
- tagged errors ครอบทุก failure mode ที่ caller ต้องจัดการ — recover เฉพาะ tag ที่เกี่ยว

- ใช้ /deep-research ถ้าจำเป็น (Effect ecosystem API เปลี่ยนเร็ว — เช็ค official docs)
- ใช้ /follow-tool-vitest ถ้าจำเป็น
- ใช้ `@effect/language-service` editor plugin เตือน violations พวกนี้ตอนเขียนโค้ด (`floatingEffect`, `tryCatchInEffectGen`, `runEffectInsideEffect`, `missingStarInYieldEffectGen` ฯลฯ) — setup ดู `/follow-lib-effect-ts`; TypeScript `>= 7` ใช้ `@effect/tsgo`

## Expected Outcome

- Effect values compose ผ่าน `Effect.gen`/pipe — typed errors + requirements ครบ
- Services ผ่าน Context.Tag + Layer — test swap ได้โดยไม่แก้ logic
- Schema validation ทุก external boundary
- Resources/concurrency structured — interruption + cleanup ถูกต้อง
- `runPromise` เฉพาะ edge — ไม่มี throw/singleton ใน Effect code
