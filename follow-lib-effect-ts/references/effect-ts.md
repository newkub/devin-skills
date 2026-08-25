# Effect-TS v3.x Reference

## Install

```bash
# Core library
bun add effect

# Data validation (legacy — Schema is included in core `effect` since v3.x)
# bun add @effect/schema  # only if using the standalone package

# Platform abstractions
bun add @effect/platform
bun add @effect/platform-bun

# Testing
bun add -D vitest
bun add -D tstyche
```

## Version Info

- Latest stable: `3.22.x` (as of 2026)
- Effect v4 in RC (not yet stable)
- TypeScript >= 5.4 required
- Supports Node.js, Deno, and Bun

## TypeScript Config

`tsconfig.json`:

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "skipLibCheck": true
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

Run:

```bash
bun src/index.ts
```

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

## Layer.mock (Testing)

Partial implementations for testing (v3.17.0+):

```ts
import { Context, Effect, Layer } from "effect"

const MyServiceTest = Layer.mock(MyService, {
  two: () => Effect.succeed(2),
})
```

## Schedule (Retry/Backoff)

```ts
import { Effect, Schedule } from "effect"

const program = Effect.fail("error").pipe(
  Effect.retry(Schedule.exponential("1 seconds").pipe(Schedule.upTo("30 seconds")))
)
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

## Source

- https://effect.website/docs/getting-started/installation/
- https://effect.website/docs/getting-started/using-generators/
- https://effect.website/docs/error-management/yieldable-errors/
- https://effect.website/docs/error-management/expected-errors/
- https://effect.website/docs/requirements-management/managing-layers/
- https://effect.website/docs/schema/getting-started/
- https://www.npmjs.com/package/effect
