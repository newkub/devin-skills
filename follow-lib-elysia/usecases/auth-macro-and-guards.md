# Use Case — Auth Guard as a Resolve Macro

> Resolve the caller once in a macro, hand the typed user to the handler, and keep unauthenticated routes free of the check. Source: https://elysiajs.com/essential/plugin.html (accessed 2026-10-20)

## 1. Declare the guard as a plugin

```ts
import { Elysia } from "elysia";
import { verifyBearer } from "./tokens";

export const auth = new Elysia({ name: "auth" }).macro({
  isAuth: {
    async resolve({ request, status }) {
      const user = await verifyBearer(request.headers.get("authorization"));
      if (!user) return status(401, "missing or invalid token");
      return { user };
    },
  },
});
```

`name: "auth"` makes the plugin deduplicate when mounted twice, which prevents the guard from running twice per request.

`resolve` returns an object that is merged into the handler context. Returning `status(401, ...)` short-circuits — the handler never runs and the response is already shaped.

## 2. Apply it per route

```ts
export const users = new Elysia({ prefix: "/users" })
  .use(auth)
  .get("/me", ({ user }) => user, { isAuth: true })
  .get("/:id", ({ params }) => findPublicProfile(params.id));
```

`isAuth: true` opts a route in; the public route next to it stays open. This is the opposite of a global `onBeforeHandle`, where every new route is protected until someone remembers to exempt it.

The handler's `user` is typed from the macro's return, so no cast and no non-null assertion is needed.

## 3. Scope a group instead of repeating the flag

```ts
export const admin = new Elysia({ prefix: "/admin" })
  .use(auth)
  .guard({ isAuth: true }, (app) =>
    app
      .get("/stats", ({ user }) => requireRole(user, "admin") && stats())
      .post("/users/:id/ban", ({ params, user }) => banUser(user, params.id)),
  );
```

`.guard()` applies the macro to every route declared inside the callback. Authentication at the group, authorization in the handler — the role check stays next to the action it protects.

## 4. Verify

1. `/run-test` — `/users/me` without a header returns 401, with a valid token returns the user
2. `/users/:id` stays public after the plugin is mounted
3. A request with an expired token returns 401, not a 500 from the verifier
4. `/deep-test api` — the admin group rejects a valid non-admin token with 403, not 401
5. `/docs` shows the 401 response on guarded routes

## Pitfalls

- Returning the user from `onBeforeHandle` instead of `resolve`, so the handler still has to re-read it.
- A global `onBeforeHandle` guard, which protects new public routes by accident and breaks health checks.
- Letting `verifyBearer` throw on a malformed header instead of returning `null`.
- Checking the role in the macro and again in the handler with different rules.
- Forgetting `.use(auth)` on the group, so `isAuth` is silently unknown and the routes are public.

## Related

- `references/apis.md`
- `best-practices/elysia.md`
- `usecases/plugin-with-scoped-hooks.md`
- `usecases/validated-rest-crud.md`
