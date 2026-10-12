---
name: follow-lib-effect-ts-define-services
description: Effect services + Layer DI — Effect.Service, Context.Tag, Layer composition, scoped deps
argument-hint: "[scope]"
related:
  - follow-lib-effect-ts
  - run-typecheck
  - resolve-errors
---

## Goal

เขียน services + dependency injection ด้วย `Effect.Service` / `Context.Tag` + `Layer` อย่างถูกต้อง

## Scope

service definition, layer composition, dependency graph — ติดตั้งอยู่ที่ `setup-effect`; v3 API (v4 RC → `Context.Service` แทน, ดู `migrate-to-effect`)

## Execute

### 1. Define Service

> Goal: service พร้อม default layer

```ts
import { Effect } from "effect"

class TodoRepo extends Effect.Service<TodoRepo>()("TodoRepo", {
  effect: Effect.gen(function* () {
    const db = yield* Database
    return {
      findAll: () => db.query("SELECT * FROM todos"),
      create: (t: Todo) => db.insert(t),
    }
  }),
  dependencies: [Database.Default],   // declared deps
}) {}
```

- `Effect.Service` (v3.9+) = Tag + Layer ในตัวเดียว — default layer `TodoRepo.Default`
- Manual control → `Context.Tag`/`Context.GenericTag` + `Layer.succeed`/`Layer.effect`/`Layer.scoped`

### 2. Compose Layers

> Goal: graph ของ dependencies

```ts
const AppLayer = Layer.mergeAll(Database.Default, HttpLive)
  .pipe(Layer.provideMerge(ConfigLayer))
// หรือ TodoRepo.Default — deps ผูกแล้วจาก `dependencies`
```

- `Layer.mergeAll` (parallel), `Layer.provide`/`provideMerge` (ข้าม dep), `Layer.scoped` (acquire/release)
- `Layer.succeed` = pure impl; `Layer.effect` = effectful init; `Layer.scoped` = ต้อง cleanup

### 3. Consume In Effects

```ts
const program = Effect.gen(function* () {
  const repo = yield* TodoRepo          // yield* service tag ได้ requirements
  return yield* repo.findAll()
})
Effect.runPromise(program.pipe(Effect.provide(TodoRepo.Default)))
```

- `R` channel = requirements — provide ครบที่ boundary เท่านั้น
- Access pattern variants: `Effect.serviceFunctions`, `Effect.serviceMembers` สำหรับ fn-style

### 4. Test Substitution

- `Layer.mock(TodoRepo)` (v3.17+) partial impl หรือ `Layer.succeed(TodoRepo, fakeImpl)` — ดู `test-effect`

## Rules

- ทุก external dep (db, http, clock, config) = service — ห้าม import singleton ตรง
- `dependencies` array ครบ — ห้าม provide ภายหลังซ้อน
- `Layer.scoped` สำหรับ resources ที่ต้อง release (connections, file handles)
- Requirements ไหลผ่าน type เท่านั้น — ห้าม hidden globals

## Expected Outcome

- Services เขียนด้วย `Effect.Service` + Layer graph ชัด
- Test แทนที่ impl ได้ผ่าน Layer — ไม่แก้ business code
