# Use Case — Typed Procedures with Auth Middleware

> One base procedure carries context and validation, and every route reuses it so no endpoint forgets the auth check. Source: https://orpc.unnoq.com/docs/procedure (accessed 2026-10-20)

## 1. Base procedure with typed context

```ts
// src/orpc/base.ts
import { os, ORPCError } from "@orpc/server"
import { z } from "zod"

export type Context = { db: DB; headers: Headers; user?: { id: string; role: "user" | "admin" } }

export const base = os.$context<Context>()
```

`$context` is only a type — the server supplies the real object per request, so tests can inject a fake `db`.

## 2. Reusable middlewares

```ts
export const requireUser = base.middleware(async ({ context, next }) => {
  if (!context.user) throw new ORPCError("UNAUTHORIZED")
  return next({ context: { user: context.user } })     // narrowed to non-optional
})

export const requireAdmin = requireUser.middleware(({ context, next }) => {
  if (context.user.role !== "admin") throw new ORPCError("FORBIDDEN")
  return next()
})
```

Middleware chains compose: admin implies user, and `context.user` is guaranteed inside the handler.

## 3. A validated procedure

```ts
// src/orpc/posts.ts
import { z } from "zod"

export const createPost = base
  .use(requireUser)
  .input(z.object({ title: z.string().min(1), tags: z.array(z.string()).default([]) }))
  .output(z.object({ id: z.string(), title: z.string() }))
  .handler(async ({ input, context }) => {
    const [row] = await context.db.insert(posts).values({ ...input, authorId: context.user.id }).returning()
    if (!row) throw new ORPCError("INTERNAL_SERVER_ERROR")
    return { id: row.id, title: row.title }
  })
```

`.output()` is a contract: returning an unexpected shape is a server error, not a silent leak.

## 4. A router

```ts
export const router = {
  posts: { create: createPost },
  admin: { stats: base.use(requireAdmin).handler(() => getStats()) },
}
export type AppRouter = typeof router
```

## Pitfalls

- Trusting `input.userId` → always read the caller from context, never from the payload.
- `.use(requireUser)` after `.input()` → context inference still works, but keep middlewares first for readability and ordering sanity.
- Throwing plain `Error` → the client sees an opaque 500; use `ORPCError("BAD_REQUEST")` with a message.
- Declaring `.output()` with `z.any()` → the contract is unenforced; describe the real fields.

## Related

- `references/apis.md`
- `best-practices/server-design.md`
- `usecases/client-with-tanstack-query.md`
