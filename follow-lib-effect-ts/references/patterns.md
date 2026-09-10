# Effect-TS v3.x Patterns Reference

Advanced patterns for `effect@3.22.x`. Check installed version first — v4 RC APIs differ.

## Error Handling

### Expected errors vs defects

- Expected errors: typed `E` channel — use `Data.TaggedError`/`Schema.TaggedError`, handle with `Effect.catchTag(s)`/`Effect.match`
- Defects: bugs/unexpected crashes — untyped, surface via `Cause.die`; do not try/catch them as business logic

```ts
import { Effect, Exit, Cause } from "effect"

class NotFound extends Data.TaggedError("NotFound")<{ id: string }> {}

const program = Effect.gen(function* () {
  yield* Effect.fail(new NotFound({ id: "1" }))
})

// Handle by tag
const handled = program.pipe(
  Effect.catchTag("NotFound", (e) => Effect.succeed(`missing: ${e.id}`)),
)

// Handle both success and failure
const mapped = program.pipe(
  Effect.match({
    onFailure: (e) => `failed: ${e.id}`,
    onSuccess: (v) => `ok: ${v}`,
  }),
)

// Inspect full result incl. defects
const exit = await Effect.runPromiseExit(program)
Exit.isFailure(exit) && Cause.pretty(exit.cause)
```

### Common combinators

```ts
effect.pipe(Effect.orElse(() => fallback))       // fallback on any failure
effect.pipe(Effect.orElseFail(() => newErr))     // replace error
effect.pipe(Effect.option)                       // Effect<Option<A>> — None on failure
effect.pipe(Effect.either)                       // Effect<Either<E, A>>
effect.pipe(Effect.ignore)                       // discard success + swallow failures
Effect.try(() => JSON.parse(raw))                // wrap throwing code → UnknownException
Effect.tryPromise({ try, catch })                // wrap Promise → typed error
```

## Config (env configuration)

```ts
import { Config, Effect } from "effect"

const program = Effect.gen(function* () {
  const host = yield* Config.string("HOST")
  const port = yield* Config.number("PORT").pipe(Config.withDefault(8080))
  const secret = yield* Config.redacted("API_KEY")
  const urls = yield* Config.array(Config.string(), "ALLOWED_ORIGINS")
  return { host, port }
})

// Config is itself an Effect — provide via ConfigProvider for tests:
// program.pipe(Effect.withConfigProvider(ConfigProvider.fromMap(new Map([["HOST", "x"]]))))
```

## Option And Either

```ts
import { Option, Either, Effect } from "effect"

// Option: absent values — yield* directly in Effect.gen
const maybe = Option.some(42)
const found = Effect.gen(function* () {
  const value = yield* maybe // None → NoSuchElementException defect
  return value * 2
})

// Either: Left (error) or Right (success) — yield* fails with Left value
const doubled = Effect.gen(function* () {
  return (yield* Either.right(10)) * 2
})
```

## Schedule (retry, repeat, timeout)

```ts
import { Effect, Schedule } from "effect"

const policy = Schedule.exponential("100 millis").pipe(
  Schedule.jittered,
  Schedule.compose(Schedule.upTo("30 seconds")),
  Schedule.whileInput((err: NetworkError) => err.retryable),
)

const resilient = fetchRemote.pipe(
  Effect.retry(policy),
  Effect.timeout("5 seconds"), // fails with TimeoutException
)

effect.pipe(Effect.repeat(Schedule.spaced("1 minute"))) // polling
effect.pipe(Effect.schedule(Schedule.cron("0 0 * * *"))) // cron-style
```

## Concurrency

```ts
import { Effect, Fiber } from "effect"

// Parallel — results as tuple/array; fails fast on first error
const [a, b] = yield* Effect.all([taskA, taskB], { concurrency: 2 })
const users = yield* Effect.forEach(ids, fetchUser, { concurrency: "unbounded" })

// Racing
const fastest = yield* Effect.race(taskA, taskB)

// Background work
const fiber = yield* Effect.fork(longRunning)
yield* Fiber.join(fiber)          // await result
yield* Fiber.interrupt(fiber)     // cancel

// Limit shared concurrency
yield* Effect.withSemaphore(sem)(5)(task)
```

## Resource Safety (Scope)

```ts
import { Effect, Scope } from "effect"

const withConn = Effect.acquireRelease(
  openConnection,
  (conn) => Effect.promise(() => conn.close()),
)

const program = Effect.scoped(
  Effect.gen(function* () {
    const conn = yield* withConn
    yield* Effect.addFinalizer(() => Effect.log("cleanup"))
    return yield* conn.query("SELECT 1")
  }),
)

// Services needing Scope → build with Layer.scoped
const DbLive = Layer.scoped(Db, withConn.pipe(Effect.map(makeDb)))
```

## Layer Composition

```ts
const AppLayer = DbLive.pipe(
  Layer.provideMerge(UserRepoLive),
  Layer.merge(CacheLive),
)

const shared = Layer.memoize(ExpensiveLive)      // build once, share
const runtime = ManagedRuntime.make(AppLayer)    // long-lived runtime
Layer.launch(AppLayer)                           // run layer forever (daemon)
```

## Stream And Sink

```ts
import { Stream, Sink, Effect } from "effect"

const count = yield* Stream.range(1, 100).pipe(
  Stream.filter((n) => n % 2 === 0),
  Stream.mapEffect((n) => process(n), { concurrency: 4 }),
  Stream.run(Sink.sum),
)

// Stream to file via @effect/platform FileSystem
```

## Running And Runtime

```ts
import { Effect, ManagedRuntime } from "effect"
import { BunRuntime, BunContext } from "@effect/platform-bun"

// One-shot (boundary only)
Effect.runPromise(program.pipe(Effect.provide(AppLayer)))
Effect.runSync(pureProgram)
Effect.runFork(program)

// Bun entrypoint — handles interrupts + exit codes
BunRuntime.runMain(program.pipe(Effect.provide(BunContext.layer)))

// Reused runtime (e.g. HTTP handlers sharing layers)
const rt = ManagedRuntime.make(AppLayer)
await rt.runPromise(handler)
```

## Observability

```ts
import { Effect, Logger, Metric } from "effect"

const program = task.pipe(
  Effect.withSpan("task", { attributes: { key: "value" } }),
  Effect.tap((v) => Effect.logInfo("done", v)),
  Effect.tapErrorCause(Effect.logError),
  Effect.annotateLogs({ requestId }),
)

// OTel: bun add @effect/opentelemetry → provide NodeSdk layer
// Custom logger: Logger.replace(Logger.defaultLogger, myLogger)
```

## Source

- https://effect.website/docs/error-management/expected-errors/
- https://effect.website/docs/scheduling/introduction/
- https://effect.website/docs/concurrency/basic-concurrency/
- https://effect.website/docs/resource-management/scope/
- https://effect.website/docs/stream/introduction/
- https://effect.website/docs/observability/logging/
