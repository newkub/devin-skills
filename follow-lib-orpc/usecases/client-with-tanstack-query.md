# Use Case — Typed Client Wired into TanStack Query

> Consume the router from the browser with full type inference, query keys derived from the router, and cache invalidation after a mutation. Source: https://orpc.unnoq.com/docs/integrations/tanstack-query (accessed 2026-10-20)

## 1. Link + client in one place

```ts
// src/orpc/client.ts
import { createORPCClient } from "@orpc/client"
import { RPCLink } from "@orpc/client/fetch"
import { createTanstackQueryUtils } from "@orpc/tanstack-query"
import type { RouterClient } from "@orpc/server"
import type { AppRouter } from "./router"

const link = new RPCLink({ url: `${globalThis.location.origin}/rpc` })

export const client: RouterClient<AppRouter> = createORPCClient(link)
export const orpc = createTanstackQueryUtils(client)
```

`orpc` mirrors the router shape, so a typo in a path or input is a TypeScript error, not a runtime 404.

## 2. Queries

```tsx
const { data, isPending } = useQuery(
  orpc.posts.list.queryOptions({ input: { limit: 20 } }),
)
```

Pass the whole `queryOptions(...)` result — it already contains `queryKey` + `queryFn`, and the key is derivable for invalidation.

## 3. Mutations that refresh the right lists

```tsx
const qc = useQueryClient()

const create = useMutation(
  orpc.posts.create.mutationOptions({
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: orpc.posts.list.key() })       // whole list family
      qc.invalidateQueries({ queryKey: orpc.posts.list.key({ input: { limit: 20 } }) })
    },
  }),
)

create.mutate({ title: "Hello" })   // typed input, typed error
```

`key()` without arguments invalidates every variant; with `{ input }` it targets one cache entry.

## 4. Errors carry the ORPC code

```tsx
const { error } = useQuery(orpc.posts.list.queryOptions({ input: { limit: 20 } }))
if (error?.code === "UNAUTHORIZED") return <LoginPrompt />
```

## Pitfalls

- Hand-writing `queryKey: ["posts"]` → invalidation misses entries created by `orpc`; always use `.key()`.
- Calling `client.posts.create(...)` directly for a write the UI depends on → no cache update; use the mutation options.
- Recreating the link/client inside a component → new identity each render, refetch storms; export a module singleton.
- Pointing the browser client at a server-only URL env var → the request 404s in production; use a path on the same origin.

## Related

- `references/apis.md`
- `best-practices/client-and-errors.md`
- `usecases/procedure-with-validation-and-middleware.md`
