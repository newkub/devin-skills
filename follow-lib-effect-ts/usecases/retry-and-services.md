# Use Case — Retried Service Calls With a Layer

> Declare a service, provide it through a Layer, and retry transient failures on a schedule that tests can control. Source: https://effect.website/docs (accessed 2026-10-20)

## 1. Define the service

```ts
import { Effect, Schedule } from "effect"

class Rates extends Effect.Service<Rates>()("Rates", {
  effect: Effect.sync(() => ({
    lookup: (currency: string) => fetchRate(currency),
  })),
}) {}
```

`Effect.Service` gives a default Layer (`Rates.Default`) and a tag you can `yield*`.

## 2. Retry and time out the call

```ts
const policy = Schedule.exponential("200 millis").pipe(
  Schedule.compose(Schedule.recurs(4)),
)

const convert = (amount: number, currency: string) =>
  Effect.gen(function* () {
    const rates = yield* Rates
    const rate = yield* Effect.tryPromise({
      try: () => rates.lookup(currency),
      catch: (cause) => new RatesUnavailable({ cause }),
    }).pipe(
      Effect.retry(policy),
      Effect.timeout("5 seconds"),
    )

    return amount * rate
  })
```

## 3. Provide the layer at the boundary

```ts
const program = convert(100, "EUR").pipe(Effect.provide(Rates.Default))
const result = await Effect.runPromise(program)
```

For tests, provide a mock layer instead of the default one.

## 4. Control time in tests

```ts
import { it } from "@effect/vitest"
import { TestClock, Effect, Layer } from "effect"

it.effect("retries then succeeds", () =>
  Effect.gen(function* () {
    const result = yield* flaky.pipe(Effect.retry(policy))
    yield* TestClock.adjust("2 seconds")
    expect(result).toBe("ok")
  }).pipe(Effect.provide(FakeRates)),
)
```

`TestClock` makes `Schedule` and `Effect.sleep` instant and deterministic — no real timers, no flaky sleeps.

## Pitfalls

- `Effect.retry` without a bound → an outage becomes an infinite loop; always compose a `recurs` limit or a deadline.
- Retrying inside the service implementation → callers cannot choose a policy per call site.
- Real `setTimeout` in tests → slow and flaky; provide `TestClock` through `it.effect`.
- Forgetting `Effect.provide` → the program still requires the service in `R` and fails to run.

## Related

- `references/apis.md`
- `best-practices/effect.md`
- `usecases/typed-error-pipeline.md`
