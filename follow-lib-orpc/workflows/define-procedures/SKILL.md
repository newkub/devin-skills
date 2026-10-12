---
name: follow-lib-orpc-define-procedures
description: oRPC procedures + router impl — os/os.contract, context, middleware, lazy loading, implement()
argument-hint: "[scope]"
related:
  - follow-lib-orpc
  - run-test
  - resolve-errors
---

## Goal

Implement oRPC procedures + router — `implement(contract)`, procedure builder `os`, context injection, middleware chaining, lazy routers

## Scope

server-side implementation — procedures, context types, middleware, router assembly; contract design → `define-contracts`; serving → `serve-openapi`/adapters

## Execute

### 1. Implement Contract

```ts
import { implement } from '@orpc/server'

const pub = implement(contract).$context<Context>()   // typed context required

export const router = pub.router({
  getUser: pub.getUser.handler(async ({ input, context, errors }) => {
    const user = await context.db.users.find(input.id)
    if (!user) throw errors.NOT_FOUND({ data: { id: input.id } })
    return user
  }),
})
```

- `implement(contract)` — builder bound to contract (types enforce handler signature)
- `errors.NOT_FOUND({ data })` — typed error throw matching contract `.errors()` map
- `os` (non-contract) — procedure builder โดยไม่ต้อง contract: `os.input().output().handler()`

### 2. Context And Middleware

```ts
const requireAuth = middleware(({ context, next, errors }) => {
  if (!context.user) throw errors.UNAUTHORIZED()
  return next({ context: { user: context.user } })  // extend context downstream
})

const authed = pub.use(requireAuth)
```

- `context` injected per-request — typed via `$context<Context>()`
- `.use(middleware)` — compose; middleware can extend context + short-circuit
- `onError`, `onSuccess`, `onFinish` interceptors ใน middleware options

### 3. Router Composition

- `pub.router({...})` — nested paths auto-prefix
- `implement(contract).lazy(() => import('./heavy-router'))` — lazy-load sub-routers (cold start)
- Merge routers: `os.router({ a: routerA, b: routerB })`

### 4. Handler Utilities

- `input`/`output` auto-validated ตาม contract schemas
- `event`/`signal` — request signal, headers access via context adapter
- Streaming: `eventIterator` types (`@orpc/server` event iterator responses)

## Rules

- Typed errors throw via `errors.KEY` — ห้าม raw `throw` สำหรับ declared errors
- Middleware extends context ผ่าน `next({ context })` — ไม่ mutate context ตรงๆ
- Contract impl ต้องครบทุก proc — missing handler = type error (good)
- `$context<Context>` กำหนดตอน implement — context shape ต้องตรง adapter ที่ serve

## Expected Outcome

- Handlers implement contract ครบ, context/middleware typed
- Errors declared+typed — client consume ได้ type-safe
