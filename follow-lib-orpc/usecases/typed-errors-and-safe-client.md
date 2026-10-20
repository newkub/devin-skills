# Use Case — Typed Errors and the Safe Client

> Declare the failure modes on the procedure, then read them on the client as a typed tuple instead of guessing from an opaque `Error`. Source: https://orpc.dev/docs/error-handling (accessed 2026-10-20)

## 1. Declare errors next to the input

```ts
// src/orpc/planets.ts
import { z } from "zod"
import { base } from "./base"

export const findPlanet = base
  .input(z.object({ id: z.uuid() }))
  .errors({
    NOT_FOUND: {
      status: 404,
      message: "Planet not found",
      data: z.object({ id: z.string() }),
    },
  })
  .handler(async ({ input, context, errors }) => {
    const planet = await context.db.planets.findById(input.id)
    if (!planet) throw errors.NOT_FOUND({ data: { id: input.id } })
    return planet
  })
```

`errors.NOT_FOUND(...)` validates `data` against the schema you declared, and the router exposes the same shape to the client. `status` is what the OpenAPI handler returns over REST.

## 2. Reuse an error across modules with a factory

```ts
// src/orpc/errors.ts
import { error } from "@orpc/server"
import { z } from "zod"

export const RateLimitedError = error("RATE_LIMITED", {
  message: "You are being rate limited",
  data: z.object({ retryAfter: z.number() }),
})
```

```ts
export const searchPlanets = base
  .errors({ [RateLimitedError.code]: RateLimitedError })
  .handler(async ({ errors }) => {
    throw errors.RATE_LIMITED({ data: { retryAfter: 60 } })
  })

// instanceof narrows to the factory's data type
try {
  await searchPlanets.call({})
} catch (err) {
  if (err instanceof RateLimitedError) console.log(err.data.retryAfter)
}
```

Registering a factory in `.errors()` makes it part of the typed surface; the factory alone only gives you `instanceof` narrowing.

## 3. Read the tuple with `safe`

```ts
import { isDefinedError, safe } from "@orpc/client"

const [error, data, definedError] = await safe(client.planets.find({ id }))

if (isDefinedError(error)) {
  return renderNotFound(error.data.id)        // data is { id: string }
}
if (error) {
  return showToast(error.message)             // unknown error: network, 500, plain throw
}
return render(data)
```

`safe` also accepts an object form, `{ error, data, definedError }`, when positional tuples read badly. `definedError` is the same object as `error` when the code matched a declaration, otherwise `null` — branching on `definedError` avoids re-running `isDefinedError`.

## 4. Handle common codes separately

```ts
if (error) {
  if (isDefinedError(error)) return renderNotFound(error.data.id)
  if (error.code === "UNAUTHORIZED") return redirectToLogin()
  return showToast(error.message)
}
```

`isDefinedError` only covers `.errors()` entries. `UNAUTHORIZED`, `FORBIDDEN`, and `RATE_LIMITED` may be thrown by middleware without a per-procedure declaration, so check `error.code` for those.

## 5. Drop the repeated tuple when every call is safe

```ts
import { createSafeClient } from "@orpc/client"

const safeClient = createSafeClient(client)

const [listError, planets] = await safeClient.planets.list({ limit: 20 })
const [findError, planet] = await safeClient.planets.find({ id })
```

`createSafeClient` wraps every procedure; the return shape stays `[error, data]` and still narrows with `isDefinedError`.

## 6. Log once, not at every call site

```ts
import { onError } from "@orpc/client"
import { RPCLink } from "@orpc/client/fetch"

const link = new RPCLink({
  url: "/rpc",
  interceptors: [onError((error) => reportToSentry(error))],
})
```

With a central interceptor, call sites handle only what the user must see — no duplicate toasts and no swallowed errors.

## 7. Keep secrets out of `message` and `data`

```ts
// leaked: the client receives the SQL and the connection string
throw errors.INTERNAL_ERROR({ data: { sql, dsn: process.env.DATABASE_URL } })

// safe: an opaque reference the server can look up in logs
throw errors.INTERNAL_ERROR({ data: { incidentId } })
```

Both fields cross the wire. Log the detail server-side; send an id.

## 8. Verify

1. Call the procedure with a missing id — the client reaches the `isDefinedError` branch and `error.data` is typed
2. Change the schema in `.errors()` — the client stops compiling where it reads the old field
3. Throw a plain `new Error()` in the handler — the client falls into the `error` branch with no `data`
4. Call without a token — `error.code === "UNAUTHORIZED"` even though no `.errors()` declared it
5. `createSafeClient` on the same router — every call returns a tuple, no `try/catch` left
6. `/run-typecheck` — no `any` leaks from `safe` in any call site
7. `/deep-test api` — REST call to the same procedure returns 404 with the declared body

## Pitfalls

- Destructuring `[data, error]` — the order is `[error, data, definedError]`.
- Using `error.data` before `isDefinedError` — the field is unknown on the common error branch.
- Declaring every HTTP code in `.errors()` — it inflates type inference; keep it for application-specific failures.
- `throw new Error("not found")` — the client gets an opaque 500 and no typed branch.
- Putting the row id, email, or SQL in `message` — everything is sent to the caller.
- Creating the client once with a snapshot token instead of `headers: () => ({ ... })`, so a refreshed token is ignored.

## Related

- `references/apis.md`
- `best-practices/client-and-errors.md`
- `best-practices/server-design.md`
- `usecases/procedure-with-validation-and-middleware.md`
- `usecases/client-with-tanstack-query.md`
