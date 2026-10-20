# Use Case — Auth & Route-Scoped Middleware

> Guard routes with JWT/session auth, attach user context, control middleware order. Source: https://nitro.build/docs/routing (Middleware), /docs/lifecycle (accessed 2026-10-20)

## Global middleware

Files in `middleware/` auto-register and run before every route handler. Middleware is defined like a handler but **must not return a value** — returning closes the request and skips remaining handlers.

```ts [middleware/auth.ts]
import { defineHandler, createError, getRequestHeader } from "nitro";

export default defineHandler(async (event) => {
  if (!event.url.pathname.startsWith("/api/private")) return; // scope it yourself
  const token = getRequestHeader(event, "authorization")?.replace(/^Bearer /, "");
  const user = token && (await verifyToken(token));
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }
  event.context.user = user; // read it in handlers via event.context.user
});
```

## Execution order

Middleware runs in directory-listing (string) order. Prefix numbers to make it explicit:

```txt
middleware/
  01.logger.ts   <-- first
  02.request-id.ts
  03.auth.ts     <-- last, so it sees parsed context
```

> Filenames sort as strings, so `10.x.ts` lands between `1.x.ts` and `2.x.ts`. With >9 middleware, zero-pad (`01`, `02`, …).

## Route-scoped middleware

To bind middleware to a pattern instead of scoping by `event.url` checks, register it via `handlers` with `middleware: true`:

```ts [nitro.config.ts]
import { defineConfig } from "nitro";

export default defineConfig({
  serverDir: "./server",
  handlers: [
    { route: "/api/**", handler: "./server/utils/api-auth.ts", middleware: true },
  ],
});
```

## Read context in a handler

```ts [server/routes/api/private/me.get.ts]
import { defineHandler } from "nitro";

export default defineHandler((event) => {
  return { user: event.context.user };
});
```

## Verify

1. `GET /api/private/me` with no token → expect `401`, not a `500`.
2. With a valid token → expect `event.context.user` to reach the handler.
3. Confirm the intended order with a request test (order is behavior).

## Pitfalls

- Returning a value from middleware → the request short-circuits and downstream routes never run.
- Global middleware touching every route without a path guard → wasted work and surprising 401s on public routes.
- Storing the user on module scope or a global instead of `event.context` → leaks identity across concurrent requests.
- Assuming a `fs`-backed token store on an edge preset → use `/docs/storage` mounts that match the target.
