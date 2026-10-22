# Use Case — Cookie Sessions Without Leaking Server Code

> Read and write an httpOnly session cookie from server functions, and keep the database client on the server side of the boundary. Source: https://tanstack.com/start/latest/docs/framework/react/guide/cookies (accessed 2026-10-20)

## 1. Set the session cookie in one server function

```ts
// src/server/auth.ts
import { createServerFn } from "@tanstack/react-start";
import { getCookie, setCookie, deleteCookie } from "@tanstack/react-start/server";

export const login = createServerFn({ method: "POST" })
  .inputValidator((data: { email: string; password: string }) => data)
  .handler(async ({ data }) => {
    const session = await auth.verifyCredentials(data);       // server-only module
    if (!session) return { ok: false as const };

    setCookie("session", session.token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return { ok: true as const };
  });

export const logout = createServerFn({ method: "POST" }).handler(async () => {
  deleteCookie("session", { path: "/" });
});
```

`getCookie`/`setCookie`/`deleteCookie` come from the server entry. Importing them from a shared module is what pulls server code into the client graph.

## 2. Resolve the session in middleware, once

```ts
// src/server/middleware.ts
import { createMiddleware } from "@tanstack/react-start";
import { getCookie } from "@tanstack/react-start/server";

export const authMiddleware = createMiddleware().server(async ({ next }) => {
  const token = getCookie("session");
  const user = token ? await sessions.findUser(token) : null;   // db is server-only
  return next({ context: { user } });
});
```

Every server function that needs a user chains `.middleware([authMiddleware])` and reads `context.user` — no repeated cookie parsing, one place that decides what "logged in" means.

## 3. Guard the boundary with `serverOnly`

```ts
// src/server/db.ts
import { serverOnly } from "@tanstack/react-start";

export const db = serverOnly(() => createDbClient(process.env.DATABASE_URL!));
```

`serverOnly` fails the build when the module is reachable from client code, instead of shipping a database URL or a client bundle that cannot run in a browser. Prefer a build error over a runtime `process is not defined`.

## 4. Validate the token, not just its presence

```ts
const session = token ? await sessions.verify(token) : null;
if (!session || session.expiresAt < Date.now()) {
  deleteCookie("session", { path: "/" });
  return next({ context: { user: null } });
}
```

A cookie is attacker-controlled input. Presence is not authentication: verify the signature, check expiry, and clear the cookie when it fails so the browser stops resending it.

## 5. Verify

1. `/run-build` — the client chunk has no `DATABASE_URL`, no db client, and no reference to `src/server/*`
2. Login sets `HttpOnly; Secure; SameSite=Lax` (check the response headers, not the JS)
3. Call a protected server function without the cookie — 401, no data
4. Tamper with the cookie value — treated as logged out, cookie cleared
5. `/run-typecheck` — `context.user` is typed inside the handler
6. On failure → `/resolve-errors` max 3 rounds

## Pitfalls

- `httpOnly: false` because the client "needs to read the user" → XSS can steal the session; return the user from a server function instead.
- `secure: true` missing → the cookie travels over plain HTTP in development and in any misconfigured proxy.
- Storing the whole session object in the cookie → size limits and stale permissions; store an id/token and look it up.
- Importing the db module in a component "just for types" → a value import drags it into the client bundle; use `import type`.
- Trusting `getCookie("session")` to mean authenticated → any user can set an arbitrary cookie value.

## Related

- `references/apis.md`
- `best-practices/tanstack-start.md`
- `usecases/server-functions-with-middleware.md`
- `usecases/verified-webhook-api-route.md`
