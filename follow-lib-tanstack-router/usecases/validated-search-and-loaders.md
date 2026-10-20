# Use Case — Validated Search Params Driving a Loader

> Keep list state (page, query, sort) in the URL, validate it at the boundary, and refetch only when the validated params change. Source: https://tanstack.com/router/latest/docs/framework/solid/guide/validating-search-params (accessed 2026-10-20)

## 1. Declare the schema once

```ts
// src/routes/products.tsx
import { createFileRoute } from "@tanstack/react-router"
import { z } from "zod"

const searchSchema = z.object({
  page: z.number().int().min(1).catch(1),
  q: z.string().trim().optional(),
  sort: z.enum(["newest", "price"]).default("newest"),
})

export const Route = createFileRoute("/products")({
  validateSearch: searchSchema,        // Standard Schema — parsed, typed, defaults applied
  loaderDeps: ({ search }) => ({ page: search.page, q: search.q, sort: search.sort }),
  loader: ({ deps }) => listProducts(deps),
  pendingComponent: () => <Skeleton />,
})
```

`catch(1)` and `.default(...)` matter: a hand-edited URL must still produce a valid typed object, not a crash.

## 2. Read and write typed params

```tsx
function Products() {
  const search = Route.useSearch()          // { page: number; q?: string; sort: "newest" | "price" }
  const navigate = Route.useNavigate()

  return (
    <Link to="/products" search={(prev) => ({ ...prev, page: prev.page + 1 })}>Next</Link>
    // or imperative
    // navigate({ search: (prev) => ({ ...prev, sort: "price", page: 1 }) })
  )
}
```

The functional `search` updater keeps unrelated params (`q`) intact — never replace the whole object.

## 3. Keep the loader keyed to validated values

`loaderDeps` is the cache key. If the loader reads `search.page` but `loaderDeps` omits it, the route will not refetch on page change.

```ts
// Wrong: deps missing → stale page for every navigation
loaderDeps: () => ({})
loader: ({ routeContext }) => listProducts(routeContext.search)

// Right: every param the loader reads is in deps
loaderDeps: ({ search }) => ({ page: search.page, q: search.q, sort: search.sort })
```

Server-side prefetch (`router.prefetchRoute`/`createRouter({ defaultPreload: "intent" })`) uses the same deps, so hover prefetch and navigation share one cache entry.

## Pitfalls

- Coercing in the component (`Number(search.page)`) → two sources of truth; coerce in the schema with `z.coerce.number()`/`catch`.
- Resetting to the default sort by passing `search: {}` → users lose `q`; spread `prev`.
- A schema that throws on bad input → the route errors out; use `catch`/`default` for user-editable params.
- Loader not in `loaderDeps` → no refetch after `navigate`, looks like a cache bug.

## Related

- `references/apis.md`
- `usecases/auth-guards-with-beforeload.md`
