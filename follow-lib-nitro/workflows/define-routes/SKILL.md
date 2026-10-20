---
name: follow-lib-nitro-define-routes
description: Write Nitro routes/handlers — api/, routes/, event handlers, body/params, websockets, tasks
argument-hint: "[route-type]"
related:
  - follow-lib-nitro
  - run-dev
  - run-test
  - resolve-errors
---

## Goal

Write complete Nitro server routes — file-based API routes, event handlers, body/params/cookies, websockets, scheduled tasks

## Scope

route handler authoring — Nitro v3 uses the h3 event model (`defineHandler`); files under `api/` and `routes/` inside `serverDir` auto-register, and nothing is scanned without `serverDir`/`scanDirs`

## Execute

### 1. File-Based Routes

> Goal: routes from filesystem convention

1. Add `serverDir: "./server"` (or `scanDirs`) to `nitro.config.ts` — no directory is scanned by default
2. Map files to URLs from the `api/` and `routes/` folders inside it:

```
server/api/hello.ts            → /api/hello
server/api/users.get.ts        → GET  /api/users   (other methods → 405 + Allow)
server/api/users.post.ts       → POST /api/users
server/api/users/[id].get.ts   → GET  /api/users/:id
server/api/[org]/[repo].ts     → /api/:org/:repo   (one param per folder)
server/api/[...].ts            → catch-all fallback
server/middleware/auth.ts      → global middleware (runs before every request)
```

```ts
// server/api/users/[id].get.ts
import { defineHandler } from "nitro";

export default defineHandler((event) => {
  const id = getRouterParam(event, "id");
  return { id };
});
```

### 2. Request/Response APIs

> Goal: full h3 helpers

1. Params: `getRouterParam(event, 'id')`; query: `getQuery(event)`; body: `readBody(event)`/`readValidatedBody(event, schema)`
2. Headers/cookies: `getRequestHeader`, `setResponseHeader`, `getCookie`, `setCookie`
3. Status/redirect/error: `setResponseStatus`, `sendRedirect`, `throw createError({ statusCode, statusMessage })`
4. Streaming/SSE: `createEventStream` from `nitro/h3` — it sets the `text/event-stream` headers; never write the headers by hand

### 3. Advanced

1. `WebSockets`: `defineWebSocketHandler` — nitro v3 ws support (cross-platform), route file in `api/` or `routes/`
2. `Tasks`: `experimental: { tasks: true }` + `tasks/<name>.ts` (`defineTask`) under `serverDir`; nested folders join with `:` (`tasks/db/migrate.ts` → `db:migrate`); run from code with `runTask()` or from the CLI with `nitro task run <name>` against a running dev server
3. `Route-specific middleware`: `middleware/` in route dirs or `event.context` guards

### 4. Verify

1. `wrangler dev`-equivalent: `bun run dev` + `curl` routes
2. `/run-test` for handlers; fail → `/resolve-errors` max 3 rounds

## Rules

- h3 event = single request context — never share mutable state across handlers
- Use `readValidatedBody` with a schema lib when accepting input — never trust the raw body
- Use `createError` for error responses — structured status/message
- Route files export default handler only — split big logic into `server/utils` (auto-imported)

## Expected Outcome

- Routes/handlers register correctly for every convention dir
- Request parsing + error + streaming patterns complete
