# Use Case — Typed Error Pipeline With Effect

> Model expected failures as tagged errors, recover per tag, and run the effect only at the boundary. Source: https://effect.website/docs (accessed 2026-10-20)

## 1. Install and declare errors

```bash
bun add effect
```

```ts
import { Effect, Data } from "effect"

class OrderNotFound extends Data.TaggedError("OrderNotFound")<{ id: string }> {}
class DbUnavailable extends Data.TaggedError("DbUnavailable")<{ cause: unknown }> {}
```

Tagged errors are values, not exceptions: they appear in the effect's error channel (`E`) and the compiler forces callers to handle them.

## 2. Compose with Effect.gen

```ts
const getOrder = (id: string) =>
  Effect.gen(function* () {
    const row = yield* Effect.tryPromise({
      try: () => db.order.find(id),
      catch: (cause) => new DbUnavailable({ cause }),
    })

    if (!row) return yield* new OrderNotFound({ id })
    return row
  })
```

`yield*` works on `Effect`, `Option`, `Either`, and `TaggedError` — never on a plain value.

## 3. Recover per tag

```ts
const respond = (id: string) =>
  getOrder(id).pipe(
    Effect.catchTag("OrderNotFound", () =>
      Effect.succeed({ status: 404, body: "Order not found" }),
    ),
    Effect.catchTag("DbUnavailable", () =>
      Effect.succeed({ status: 503, body: "Try again later" }),
    ),
  )
```

`catchTag` narrows the error union; `catchTags` handles several at once; `Effect.match` maps both channels.

## 4. Run at the edge

```ts
const result = await Effect.runPromise(respond("o_123"))
```

`Effect.runPromise` belongs in the server entry point, never inside a service or domain module.

## Pitfalls

- `try/catch` around `yield*` → effect failures are values, not throws; use `catchTag`/`catchAll`.
- Using `new Error()` for expected failures → the error channel collapses to `unknown`; declare one tagged error per case.
- Running effects inside a service → untestable and unrecoverable; return an `Effect` and run it at the boundary.
- Throwing inside `Effect.gen` → becomes a defect (die) that `catchTag` cannot see; `yield*` the error instead.

## Related

- `references/apis.md`
- `best-practices/effect.md`
- `usecases/retry-and-services.md`
