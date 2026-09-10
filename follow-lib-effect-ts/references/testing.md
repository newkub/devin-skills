# Effect-TS Testing Reference

Testing `effect@3.22.x` code with `vitest` + `@effect/vitest`.

## Install

```bash
# @effect/vitest@0.30.0 peer deps: effect ^3.22.0, vitest ^3.2.0
bun add -D vitest@^3.2 @effect/vitest

# Type-level tests (optional)
bun add -D tstyche
```

> `@effect/vitest` currently requires `vitest ^3.2.0` — if the project uses vitest 4/5, verify peer compatibility before upgrading.

## @effect/vitest Basics

```ts
import { it, expect, describe } from "@effect/vitest"
import { Effect, Exit } from "effect"

it.effect("computes total", () =>
  Effect.gen(function* () {
    const total = yield* computeTotal
    expect(total).toBe(96)
  }),
)
// runs the effect with TestContext (TestClock + deterministic services)
```

## Variants

| API | Use when |
|---|---|
| `it.effect` | Effect test needing `TestContext` |
| `it.scoped` | Effect test that requires `Scope` (acquireRelease, Stream.run, etc.) |
| `it.live` | Real clock/environment instead of `TestClock` |
| `it.layer(Layer)` | Share a built `Layer` across tests (built once per suite) |
| `it.prop` | Property-based tests via `fast-check` arbitraries |
| `it.effect.skip` / `.only` / `.each` | Standard vitest modifiers still work |

## Layer.mock And Test Layers

```ts
import { Layer, Effect } from "effect"

// Partial mock (v3.17.0+) — only stub what you need
const MyServiceTest = Layer.mock(MyService, {
  two: () => Effect.succeed(2),
})

// Full replacement
const FakeRepo = Layer.succeed(UserRepo, {
  findById: (id) => Effect.succeed(fakeUser),
})

it.effect("uses service", () =>
  Effect.gen(function* () {
    const svc = yield* MyService
    expect(yield* svc.two()).toBe(2)
  }).pipe(Effect.provide(MyServiceTest)),
)
```

## Sharing Layers Between Tests

```ts
const MainLive = Layer.mergeAll(MyService.Default, RepoLive)

it.layer(MainLive)("suite", (it) => {
  it.effect("a", () => /* has MainLive in context */ ...)
  it.effect("b", () => ...)
})
```

## TestClock (time control)

`it.effect` provides `TestClock` — `Effect.sleep`, `Schedule`, `Effect.timeout` are instant/deterministic:

```ts
import { TestClock, Effect } from "effect"

it.effect("retries with backoff", () =>
  Effect.gen(function* () {
    const fiber = yield* Effect.fork(task.pipe(Effect.retry(policy)))
    yield* TestClock.adjust("10 seconds") // advance virtual time
    yield* Fiber.join(fiber)
  }),
)
```

Use `it.live` when testing against real timers or real external calls.

## Asserting Failures

```ts
import { Effect, Exit } from "effect"

it.effect("fails with NotFound", () =>
  Effect.gen(function* () {
    const exit = yield* Effect.exit(findUser("nope"))
    expect(Exit.isFailure(exit)).toBe(true)
  }),
)
// Or: expect(yield* Effect.flip(program)).toBeInstanceOf(NotFound)
```

## Type-Level Tests (tstyche)

```ts
// test/types/effect.tst.ts — run: bunx tstyche
import { Effect } from "effect"
import { expect, test } from "tstyche"

test("effect types", () => {
  const eff = Effect.succeed(1)
  expect(eff).type.toBe<Effect.Effect<number, never, never>>()
})
```

## Commands

```bash
bunx vitest run        # execute once
bunx vitest            # watch mode
bunx tstyche           # type-level assertions
```

## Source

- https://effect.website/docs/testing/introduction/
- https://github.com/Effect-TS/effect/tree/main/packages/vitest
- https://tstyche.org
