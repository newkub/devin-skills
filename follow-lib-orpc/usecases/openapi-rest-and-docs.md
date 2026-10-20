# Use Case — Serve REST and Generate OpenAPI Docs

> The same router answers the typed RPC client on `/rpc` and a public REST API on `/api`, and one script turns it into a spec you can serve, test, and import into Bruno. Source: https://orpc.dev/docs/openapi/routing (accessed 2026-10-20)

## 1. Give every procedure a route

```ts
// src/orpc/router.ts
import { oc } from "@orpc/contract"
import { z } from "zod"

export const contract = oc.router({
  planets: {
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
      .route({ method: "POST", path: "/planets" }),
  },
})
```

`{id}` marks a path parameter; without `.route()` the procedure still works over RPC but never appears in the spec. Add tags, summaries, and descriptions through `.meta(...)` when the generated docs need prose.

## 2. Mount both handlers behind distinct prefixes

```ts
// src/index.ts
import { RPCHandler } from "@orpc/server/fetch"
import { OpenAPIHandler } from "@orpc/openapi/fetch"
import { CORSPlugin } from "@orpc/server/plugins"
import { router } from "./orpc/implement"

const rpcHandler = new RPCHandler(router, { plugins: [new CORSPlugin()] })
const restHandler = new OpenAPIHandler(router)

export default {
  async fetch(request: Request) {
    const context = { headers: request.headers }

    const rpc = await rpcHandler.handle(request, { prefix: "/rpc", context })
    if (rpc.matched) return rpc.response

    const rest = await restHandler.handle(request, { prefix: "/api", context })
    if (rest.matched) return rest.response

    return new Response("Not found", { status: 404 })
  },
}
```

Both handlers receive the same router and the same per-request context. `matched` is the routing signal — returning early on the first match keeps `/rpc` and `/api` from shadowing each other.

## 3. Generate the spec with the right schema converter

```ts
// scripts/gen-openapi.ts
import { OpenAPIGenerator } from "@orpc/openapi"
import { ZodToJsonSchemaConverter } from "@orpc/zod/zod4"
import { router } from "../src/orpc/implement"

const generator = new OpenAPIGenerator({
  schemaConverters: [new ZodToJsonSchemaConverter()],
})

const spec = await generator.generate(router, {
  info: { title: "Planets API", version: "1.0.0" },
})

await Bun.write("openapi.json", JSON.stringify(spec, null, 2))
```

The converter must match the validator: Zod v4 uses `@orpc/zod/zod4`, v3 uses the v3 entry, Valibot uses `ValibotToJsonSchemaConverter`. The wrong converter produces empty `components.schemas`, not an error.

## 4. Publish the spec and serve the docs

```ts
const spec = await Bun.file("openapi.json").json()

export default {
  async fetch(request: Request) {
    const url = new URL(request.url)
    if (url.pathname === "/api/spec.json") return Response.json(spec)
    // ...rpc and rest handlers
  },
}
```

```bash
bun run scripts/gen-openapi.ts
# interactive Scalar reference from the spec
/run-api-docs openapi.json
```

Commit the generated `openapi.json` or rebuild it in CI — either way the artifact must come from the router, never be hand-edited.

## 5. Prove the REST path matches the RPC path

```bash
# RPC
curl -s localhost:3000/rpc/planets/find -H 'content-type: application/json' \
  -d '{"json":{"id":"7f1c2f9e-6c1a-4d0f-9a3b-2f6d1f0b8c11"}}'

# REST, generated from the same procedure
curl -s localhost:3000/api/planets/7f1c2f9e-6c1a-4d0f-9a3b-2f6d1f0b8c11
```

A 404 from `/api` while `/rpc` works almost always means the `path` template and the client URL disagree, or the handler prefix does not match the mounted route.

## 6. Feed the spec to tests and tooling

```bash
# import the generated spec into a Bruno collection
bru import openapi --source openapi.json

# contract checks against the running server
/deep-test api
```

`/deep-test api` exercises the documented surface — required fields, status codes from `.errors({ status })`, and the error envelope. It fails when the spec and the server disagree, which is the point.

## 7. Verify

1. `bun run scripts/gen-openapi.ts` — `openapi.json` contains every procedure with a `.route()`
2. A procedure added without `.route()` — absent from the spec and still reachable on `/rpc`
3. `GET /api/planets` — 200 with the list shape; `GET /api/planets/<unknown>` — 404 with the declared body
4. `GET /api/spec.json` — the same document the generator wrote
5. `/run-api-docs openapi.json` — the Scalar page renders every operation
6. `bru import openapi` then run the imported request — it hits the live server successfully
7. `/deep-test api` — no schema drift between spec and responses

## Pitfalls

- Mounting `OpenAPIHandler` at `/` and shadowing the RPC prefix — both handlers need explicit, non-overlapping prefixes.
- Forgetting `.route()` on one procedure and assuming the spec is broken.
- Using `ZodToJsonSchemaConverter` from the wrong Zod entry — schemas come out empty.
- Hand-editing `openapi.json`, so the docs drift from the router on the next deploy.
- Returning the raw `orm.Error` to the client instead of `errors.NOT_FOUND()` — REST gets a 500 where the contract promised 404.
- Leaving CORS off the RPC handler while the REST handler has it, so only one surface works cross-origin.
- Committing a spec generated before a contract change — regenerate in CI and diff it.

## Related

- `references/apis.md`
- `best-practices/server-design.md`
- `workflows/serve-openapi/SKILL.md`
- `usecases/contract-first-router.md`
- `usecases/typed-errors-and-safe-client.md`
