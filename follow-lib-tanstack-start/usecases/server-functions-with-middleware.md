# Use Case — Validated, Authenticated Server Functions

> Ship a mutation that validates input on the server, resolves the session in middleware, and never bundles database code to the client. Source: https://tanstack.com/start/latest/docs/framework/react/server-functions (accessed 2026-10-20)

## 1. One middleware that resolves the session

```ts
// src/server/auth.ts
import { createMiddleware } from "@tanstack/react-start"
import { redirect } from "@tanstack/react-router"

export const authMiddleware = createMiddleware().server(async ({ next, request }) => {
  const session = await getSession(request.headers.get("cookie"))
  if (!session) throw redirect({ to: "/login" })
  return next({ context: { userId: session.userId } })
})
```

`next({ context })` merges into the handler context — downstream handlers get a typed, non-null `userId`.

## 2. Validator runs before the handler

```ts
// src/server/todos.ts
import { createServerFn } from "@tanstack/react-start"
import { z } from "zod"
import { authMiddleware } from "./auth"

export const listTodos = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(({ context }) => db.select().from(todos).where(eq(todos.userId, context.userId)))

export const createTodo = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) =>
    z.object({ title: z.string().trim().min(1).max(200) }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const [row] = await db
      .insert(todos)
      .values({ title: data.title, userId: context.userId })
      .returning()
    return row
  })
```

`data` is typed from the validator; a bad payload throws before any DB work.

## 3. Call it and refresh the route

```tsx
const router = useRouter()
const [isPending, startTransition] = useTransition()

function onSubmit(title: string) {
  startTransition(async () => {
    await createTodo({ data: { title } })
    await router.invalidate()               // re-runs loaders for the active routes
  })
}
```

## Pitfalls

- Importing a module with DB/env access at the top of a client component → server code leaks into the bundle; keep it inside the `.handler()` or in `src/server/*` imported only there.
- Trusting the client's `userId` → always take it from middleware context, never from `data`.
- Returning class instances or functions → serialization fails across the boundary; return plain data.
- Forgetting `router.invalidate()` → the mutation succeeds but the list stays stale until reload.

## Related

- `references/apis.md`
- `usecases/ssr-loader-and-pending-ui.md`
