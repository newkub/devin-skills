# Use Case — Contract-First Router Shared by Server and Client

> Write the API surface once in a contract package, implement it with `implement(contract)`, and let a type mismatch at the server be a compile error. Source: https://orpc.dev/docs/contract-first/implement-contract (accessed 2026-10-20)

## 1. Put the contract in its own package

```ts
// packages/contract/src/planets.ts
import { oc } from "@orpc/contract"
import { z } from "zod"

export const PlanetSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  massKg: z.number(),
})

export const planetsContract = {
  list: oc
    .input(z.object({ limit: z.number().int().min(1).max(100).default(20) }))
    .output(z.array(PlanetSchema))
    .route({ method: "GET", path: "/planets" }),
  find: oc
    .input(z.object({ id: z.uuid() }))
    .output(PlanetSchema)
    .errors({ NOT_FOUND: { status: 404, data: z.object({ id: z.string() }) } })
    .route({ method: "GET", path: "/planets/{id}" }),
  create: oc
    .input(PlanetSchema.omit({ id: true }))
    .output(PlanetSchema)
    .errors({ UNAUTHORIZED: { status: 401 } })
    .route({ method: "POST", path: "/planets" }),
}
```

```ts
// packages/contract/src/index.ts
import { oc } from "@orpc/contract"
import { planetsContract } from "./planets"

export const contract = oc.router({ planets: planetsContract })
```

The package holds no handler and no database import, so the web app can depend on it without pulling server code into the bundle.

## 2. Implement the contract

```ts
// apps/api/src/router.ts
import { ORPCError, implement } from "@orpc/server"
import { contract } from "@acme/contract"

type Context = { db: DB; user?: { id: string } }

const os = implement(contract).$context<Context>()

const requireUser = os.middleware(({ context, next }) => {
  if (!context.user) throw new ORPCError("UNAUTHORIZED")
  return next({ context: { user: context.user } })
})

export const router = os.router({
  planets: {
    list: os.planets.list.handler(({ input, context }) =>
      context.db.planets.list({ limit: input.limit }),
    ),
    find: os.planets.find.handler(async ({ input, context, errors }) => {
      const planet = await context.db.planets.findById(input.id)
      if (!planet) throw errors.NOT_FOUND({ data: { id: input.id } })
      return planet
    }),
    create: os.planets.create.use(requireUser).handler(({ input, context }) =>
      context.db.planets.create(input),
    ),
  },
})
```

`os.planets.create` exists only because the contract declared it, and its handler's return type is checked against `output`. Forgetting a procedure or returning the wrong shape fails typecheck, not production.

## 3. Apply middleware at the right level

```ts
// every procedure under planets, wrapping validation once
export const router = os.planets
  .use(({ context, next }) => {
    if (!context.user) throw new ORPCError("UNAUTHORIZED")
    return next()
  })
  .router({ list: listPlanet, find: findPlanet, create: createPlanet })
```

Router-level `.use()` wraps validation; procedure-level `.use()` runs after it. Applying both levels runs the middleware twice — pick one.

## 4. Derive the client from the contract

```ts
// apps/web/src/orpc/client.ts
import { createORPCClient } from "@orpc/client"
import { RPCLink } from "@orpc/client/fetch"
import type { ContractRouterClient } from "@orpc/contract"
import { contract } from "@acme/contract"

const link = new RPCLink({
  url: "/rpc",
  headers: () => ({ authorization: `Bearer ${getToken()}` }),
})

export const client: ContractRouterClient<typeof contract> = createORPCClient(link)
```

The web app never imports the router — only the contract. `client.planets.find({ id })` is typed from `PlanetSchema` and its errors from `.errors()`.

## 5. Reuse the contract's types elsewhere

```ts
import type { InferContractRouterInputs, InferContractRouterOutputs } from "@orpc/contract"
import { contract } from "@acme/contract"

type Inputs = InferContractRouterInputs<typeof contract>
type Outputs = InferContractRouterOutputs<typeof contract>

type CreatePlanetInput = Inputs["planets"]["create"]     // { name: string; massKg: number }
type Planet = Outputs["planets"]["find"]                 // { id: string; name: string; massKg: number }
```

Use these in form components, test fixtures, and seed scripts so one schema change surfaces everywhere at once.

## 6. Change the contract first, then fix the compiler

```bash
# 1. edit packages/contract/src/planets.ts
# 2. every break is now a type error
bun run typecheck
# 3. fix apps/api (handler + return) and apps/web (call sites) until green
```

Because the contract is the source of truth, the compiler produces the work list. Runtime drift between the two apps becomes impossible without a type error on the way in.

## 7. Verify

1. Delete `list` from `os.router({ planets: { ... } })` — typecheck fails with a missing procedure
2. Return `{ id, name }` without `massKg` from `find` — typecheck fails against `output`
3. `throw errors.NOT_FOUND({ data: { id } })` — the web call site narrows `error.data.id`
4. Add a field to `PlanetSchema` — both the handler and every web consumer report the change
5. `bun run typecheck` in the contract package alone — it compiles without any server or web dependency
6. `/deep-test api` — REST paths come from `.route()` and match the contract
7. `/run-api-docs` against the generated spec — the documented surface equals the contract

## Pitfalls

- Defining the contract inside the server app — the web app then imports server code to get types.
- `oc.router` without `.route()` on a procedure — it works over RPC and is invisible to OpenAPI.
- Leaving `.output()` off a contract procedure — the handler can return anything and the client type silently widens.
- Reusing a base `os` from the implementation side — middleware chains diverge and the contract stops being the source of truth.
- Duplicating Zod schemas in the web app "for the form" — derive them from the contract instead.
- Applying `.use()` at both router and procedure level, which runs the middleware twice per call.
- Treating a contract change as a server-only PR — it is a breaking change for every consumer.

## Related

- `references/apis.md`
- `best-practices/server-design.md`
- `best-practices/client-and-errors.md`
- `workflows/define-contracts/SKILL.md`
- `usecases/typed-errors-and-safe-client.md`
- `usecases/openapi-rest-and-docs.md`
