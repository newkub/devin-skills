# Use Case — Encapsulated Auth Plugin with Scoped Hooks

> Reuse one session resolver across route groups without leaking `user` into handlers that never opted in. Source: https://elysiajs.com/essential/plugin.html (accessed 2026-10-20)

## 1. A named, scoped plugin

```ts
// src/plugins/auth.ts
import { Elysia } from "elysia"

export const authPlugin = new Elysia({ name: "auth" })
  .derive({ as: "scoped" }, async ({ request }) => {
    const session = await getSession(request.headers.get("cookie"))
    return { user: session?.user ?? null }
  })
  .macro({
    isSignedIn(enabled: boolean) {
      if (!enabled) return
      return {
        beforeHandle({ user, status }) {
          if (!user) return status(401, "Unauthorized")
        },
      }
    },
  })
```

`as: "scoped"` keeps the derived `user` inside the plugin and the groups that consume it — it does not appear on unrelated routes.

## 2. Consume it with a type-safe macro

```ts
// src/modules/posts.ts
import { Elysia, t } from "elysia"
import { authPlugin } from "../plugins/auth"

export const postRoutes = new Elysia({ prefix: "/posts" })
  .use(authPlugin)
  .get("/", ({ user }) => listPosts(user?.id), { isSignedIn: true })
  .post(
    "/",
    ({ body, user }) => createPost({ ...body, authorId: user!.id }),
    { isSignedIn: true, body: t.Object({ title: t.String({ minLength: 1 }) }) },
  )
```

The macro reads as a route option, and `beforeHandle` runs before the handler — no repeated `if (!user)` blocks.

## 3. Compose at the app root

```ts
// src/index.ts
import { Elysia } from "elysia"

new Elysia()
  .onError(({ code, error, status }) =>
    code === "VALIDATION" ? status(422, error.message) : status(500, "Internal error"),
  )
  .use(postRoutes)
  .listen(3000)
```

Plugins are registered once; `derive` runs per request for the routes that consumed the plugin.

## Pitfalls

- `as: "global"` on a session plugin → every route gains `user` and the auth lookup runs even for public endpoints.
- Forgetting `{ name }` on a plugin → Elysia cannot deduplicate it when two modules `.use()` the same plugin, so hooks run twice.
- Mutating `request` or reading the body in `derive` → body parsing is not available there; use `beforeHandle`/handler.
- Returning `status(...)` inside a `macro` without `return` → create the response object and return it.

## Related

- `references/apis.md`
- `references/cli.md`
- `best-practices/elysia.md`
- `usecases/validated-rest-crud.md`
