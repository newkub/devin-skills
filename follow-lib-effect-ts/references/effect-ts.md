# Effect-TS v3.x Reference

## Install

```bash
# Core library
bun add effect

# Data validation (legacy — Schema is included in core `effect` since v3.x)
# bun add @effect/schema  # only if using the standalone package

# Platform abstractions
bun add @effect/platform
bun add @effect/platform-bun   # Bun runtime
bun add @effect/platform-node  # Node.js runtime

# Testing (@effect/vitest peers: effect ^3.22.0, vitest ^3.2.0)
bun add -D vitest@^3.2 @effect/vitest
bun add -D tstyche
```

## Version Info

- Latest stable: `3.22.2` (verified 2026-09-11)
- Effect v4 in RC (`4.0.0-rc.113`) — not yet stable; API differs from v3 (see below)
- TypeScript >= 5.4 required (TS 7.x/tsgo is the latest major — verify toolchain support)
- Supports Node.js, Deno, and Bun

## v3 vs v4 API Differences

- v3: `Context.Tag`/`Context.GenericTag`/`Effect.Service` for services; v4: unified `Context.Service`
- v3: yield `Effect`/`Option`/`Either`/`TaggedError` directly; v4: `Yieldable` types may need `.asEffect()`
- v4 consolidates packages under `effect/unstable/*` and changes `Layer`/`Runtime` APIs
- Always check the installed version in `package.json` before choosing an API

## TypeScript Config

`tsconfig.json`:

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "target": "ES2022"
  }
}
```

## Hello World

`src/index.ts`:

```ts
import { Effect, Console } from "effect"

const program = Console.log("Hello, World!")

Effect.runSync(program)
```

Run with `bun src/index.ts`.

## Effect.gen

Use generators instead of pipe for ergonomic code:

```ts
import { Effect } from "effect"

const addServiceCharge = (amount: number) => amount + 1

const applyDiscount = (
  total: number,
  discountRate: number,
): Effect.Effect<number, Error> =>
  discountRate === 0
    ? Effect.fail(new Error("Discount rate cannot be zero"))
    : Effect.succeed(total - (total * discountRate) / 100)

const fetchTransactionAmount = Effect.promise(() => Promise.resolve(100))
const fetchDiscountRate = Effect.promise(() => Promise.resolve(5))

const program = Effect.gen(function* () {
  const transactionAmount = yield* fetchTransactionAmount
  const discountRate = yield* fetchDiscountRate
  const discountedAmount = yield* applyDiscount(transactionAmount, discountRate)
  const finalAmount = addServiceCharge(discountedAmount)
  return `Final amount to charge: ${finalAmount}`
})

Effect.runPromise(program).then(console.log)
// Output: Final amount to charge: 96
```

## Data.TaggedError

Type-safe yieldable errors:

```ts
import { Effect, Data, Random } from "effect"

class FooError extends Data.TaggedError("Foo")<{
  message: string
}> {}

class BarError extends Data.TaggedError("Bar")<{
  randomNumber: number
}> {}

const program = Effect.gen(function* () {
  const n = yield* Random.next
  return n > 0.5
    ? "yay!"
    : n < 0.2
      ? yield* new FooError({ message: "Oh no!" })
      : yield* new BarError({ randomNumber: n })
}).pipe(
  Effect.catchTags({
    Foo: (error) => Effect.succeed(`Foo error: ${error.message}`),
    Bar: (error) => Effect.succeed(`Bar error: ${error.randomNumber}`),
  }),
)

Effect.runPromise(program).then(console.log, console.error)
```

## Context.Tag And Layer

Dependency injection:

```ts
import { Context, Effect, Layer } from "effect"

class MyService extends Context.Tag("MyService")<
  MyService,
  {
    one: Effect.Effect<number>
    two(): Effect.Effect<number>
  }
>() {}

const MyServiceLive = Layer.effect(
  MyService,
  Effect.gen(function* () {
    return {
      one: Effect.succeed(1),
      two: () => Effect.succeed(2),
    }
  }),
)

const program = Effect.gen(function* () {
  const service = yield* MyService
  return yield* service.two()
}).pipe(
  Effect.provide(MyServiceLive),
)

Effect.runPromise(program).then(console.log) // 2
```

## Effect.Service (v3.9+, recommended)

Creates a service Tag with a default Layer in one declaration:

```ts
import { Effect } from "effect"

class MyService extends Effect.Service<MyService>()("MyService", {
  effect: Effect.gen(function* () {
    return {
      one: Effect.succeed(1),
      two: () => Effect.succeed(2),
    } as const
  }),
}) {}

// Auto-generated layers: MyService.Default, MyService.DefaultWithoutDependencies
// Test with: MyService.layerTest or Layer.mock(MyService, { ... })

const program = Effect.gen(function* () {
  const service = yield* MyService
  return yield* service.two()
}).pipe(Effect.provide(MyService.Default))
```

## Effect.fn (named traced functions)

```ts
import { Effect } from "effect"

const fetchUser = Effect.fn("fetchUser")(function* (id: string) {
  const service = yield* MyService
  return yield* service.two()
})
// Creates a span named "fetchUser" when tracing is enabled
// Use Effect.fnUntraced to skip span creation
```

## Schema (core `effect` package)

`Schema` is part of core `effect` in v3.x — no separate install needed:

```ts
import { Schema } from "effect"

const UserSchema = Schema.Struct({
  id: Schema.Number,
  name: Schema.String,
  email: Schema.String,
})

type User = Schema.Schema.Type<typeof UserSchema>

const decode = Schema.decodeUnknownSync(UserSchema)
const user = decode({ id: 1, name: "Alice", email: "alice@example.com" })
```

> `@effect/schema` (v0.75.x) is the legacy standalone package; prefer `import { Schema } from "effect"` for v3.x

## Running Effects

```ts
Effect.runSync(program)       // Synchronous execution
Effect.runPromise(program)    // Asynchronous (returns Promise)
Effect.runFork(program)       // Fork as a fiber
```

## See Also

- Advanced patterns (Config, Option/Either, Schedule, concurrency, Scope, Stream, platform runtimes, observability): [patterns.md](patterns.md)
- Testing (`@effect/vitest`, `Layer.mock`, `TestClock`, type-level tests): [testing.md](testing.md)

## Source

- https://effect.website/docs/getting-started/installation/
- https://effect.website/docs/getting-started/using-generators/
- https://effect.website/docs/error-management/yieldable-errors/
- https://effect.website/docs/error-management/expected-errors/
- https://effect.website/docs/requirements-management/managing-layers/
- https://effect.website/docs/schema/getting-started/
- https://www.npmjs.com/package/effect
