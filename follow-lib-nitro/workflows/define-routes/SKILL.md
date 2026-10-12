---
name: follow-lib-nitro-define-routes
description: เขียน Nitro routes/handlers — api/, routes/, event handlers, body/params, websockets, tasks
argument-hint: "[route-type]"
related:
  - follow-lib-nitro
  - run-dev
  - run-test
  - resolve-errors
---

## Goal

เขียน Nitro server routes ครบ — file-based API routes, event handlers, body/params/cookies, websockets, scheduled tasks

## Scope

route handler authoring — Nitro ใช้ h3 event model (`defineEventHandler`); file routes auto-register จาก `api/`, `routes/`, `server/` conventions

## Execute

### 1. File-Based Routes

> Goal: routes จาก filesystem convention

```
api/hello.ts        → /api/hello
api/users/[id].ts   → /api/users/:id   (dynamic param)
routes/index.ts     → /                (root routes)
middleware/auth.ts  → global middleware (run ก่อนทุก request)
```

```ts
// api/users/[id].ts
import { defineEventHandler, getRouterParam } from 'nitro/h3' // หรือ 'h3'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  return { id }
})
```

### 2. Request/Response APIs

> Goal: h3 helpers ครบ

1. Params: `getRouterParam(event, 'id')`; query: `getQuery(event)`; body: `readBody(event)`/`readValidatedBody(event, schema)`
2. Headers/cookies: `getRequestHeader`, `setResponseHeader`, `getCookie`, `setCookie`
3. Status/redirect/error: `setResponseStatus`, `sendRedirect`, `throw createError({ statusCode, statusMessage })`
4. Streaming/SSE: `event.node.res` หรือ `createEventStream` (h3) สำหรับ SSE

### 3. Advanced

1. **WebSockets**: `defineWebSocketHandler` — nitro v3 ws support (cross-platform)
2. **Tasks**: `defineTask` + `tasks:` config สำหรับ scheduled/queued jobs (`nitro task run`)
3. **Route-specific middleware**: `middleware/` ใน route dirs หรือ `event.context` guards

### 4. Verify

1. `wrangler dev`-equivalent: `bun run dev` + `curl` routes
2. `/run-test` สำหรับ handlers; fail → `/resolve-errors` max 3 รอบ

## Rules

- h3 event = single request context — ห้ามแชร์ mutable state ข้าม handlers
- `readValidatedBody` กับ schema lib เมื่อรับ input — ห้าม trust raw body
- `createError` สำหรับ error responses — structured status/message
- Route files export default handler เท่านั้น — logic ใหญ่แยกไป `server/utils` (auto-imported)

## Expected Outcome

- Routes/handlers register ถูกทุก convention dir
- Request parsing + error + streaming patterns ครบ
