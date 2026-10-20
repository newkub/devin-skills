# Use Case — Authenticated Area with beforeLoad Guards

> Guard a route subtree once, keep the redirect target, and expose the session to loaders as typed route context. Source: https://tanstack.com/router/latest/docs/framework/solid/guide/authenticated-routes (accessed 2026-10-20)

## 1. Typed router context

```ts
// src/router.tsx
import { createRouter } from "@tanstack/solid-router"
import { createRootRouteWithContext } from "@tanstack/solid-router"

export type RouterContext = { auth: { user: User | null } }

const rootRoute = createRootRouteWithContext<RouterContext>()({ component: AppShell })

export const router = createRouter({
  routeTree: routeTree,
  context: { auth: { user: null } },
  defaultPreload: "intent",
})
```

The context object is mutable-by-reference: the auth provider updates `router.options.context.auth.user` after login, and guards read the current value.

## 2. A layout route that guards its subtree

```tsx
// src/routes/_authed.tsx
import { createFileRoute, redirect, Outlet } from "@tanstack/solid-router"

export const Route = createFileRoute("/_authed")({
  beforeLoad: ({ context, location }) => {
    if (!context.auth.user) {
      throw redirect({ to: "/login", search: { redirect: location.href } })
    }
    return { user: context.auth.user }   // narrowed — children get a non-null user
  },
  component: () => <Outlet />,
})
```

Every child under `_authed` gets the guard for free; child loaders read `{ context: { user } }` with `user` already non-null.

## 3. Role checks at the leaf

```tsx
// src/routes/_authed/admin.tsx
export const Route = createFileRoute("/_authed/admin")({
  beforeLoad: ({ context }) => {
    if (context.user.role !== "admin") throw redirect({ to: "/dashboard" })
  },
  loader: ({ context }) => listAllUsers(),   // only reached with an admin session
})
```

## 4. Come back to where the user was

```tsx
// src/routes/login.tsx
const loginSchema = z.object({ redirect: z.string().optional() })

export const Route = createFileRoute("/login")({
  validateSearch: loginSchema,
  component: () => {
    const { redirect: to } = Route.useSearch()
    return <LoginForm onSuccess={() => router.navigate({ to: to ?? "/dashboard" })} />
  },
})
```

## Pitfalls

- Checking auth inside the component → the loader already ran and leaked data; guard in `beforeLoad`.
- `throw new Error()` instead of `redirect()` → the route shows an error boundary, not the login page.
- Guarding each child separately → duplicated checks and inconsistent redirects; use one layout route.
- Redirecting to a hard-coded `/login` without the `redirect` param → users land on the dashboard after login, losing their place.

## Related

- `references/apis.md`
- `usecases/validated-search-and-loaders.md`
