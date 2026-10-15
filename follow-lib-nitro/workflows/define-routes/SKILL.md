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

route handler authoring — Nitro uses the h3 event model (`defineEventHandler`); file routes auto-register from `api/`, `routes/`, `server/` conventions

## Execute

### 1. File-Based Routes

> Goal: routes from filesystem convention

```
api/hello.ts        → /api/hello
api/users/[id].ts   → /api/users/:id   (dynamic param)
routes/index.ts     → /                (root routes)
middleware/auth.ts  → global middleware (runs before every request)
```

```ts
// api/users/[id].ts
import { defineEventHandler, getRouterParam } from 'nitro/h3' // or 'h3'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  return { id }
})
```

### 2. Request/Response APIs

> Goal: full h3 helpers

1. Params: `getRouterParam(event, 'id')`; query: `getQuery(event)`; body: `readBody(event)`/`readValidatedBody(event, schema)`
2. Headers/cookies: `getRequestHeader`, `setResponseHeader`, `getCookie`, `setCookie`
3. Status/redirect/error: `setResponseStatus`, `sendRedirect`, `throw createError({ statusCode, statusMessage })`
4. Streaming/SSE: `event.node.res` or `createEventStream` (h3) for SSE

### 3. Advanced

1. **WebSockets**: `defineWebSocketHandler` — nitro v3 ws support (cross-platform)
2. **Tasks**: `defineTask` + `tasks:` config for scheduled/queued jobs (`nitro task run`)
3. **Route-specific middleware**: `middleware/` in route dirs or `event.context` guards

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
