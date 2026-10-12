---
name: follow-lib-elysia-use-lifecycle
description: Elysia lifecycle hooks — onRequest→derive→beforeHandle→afterHandle→onError→onResponse, derive/decorate, guard scope
argument-hint: "[hook]"
related:
  - follow-lib-elysia
  - run-test
  - resolve-errors
---

## Goal

ใช้ Elysia lifecycle hooks ครบ — request pipeline order, `derive`/`decorate`/`resolve`, error handling, scoped/global hooks

## Scope

lifecycle — `onRequest`, `parse`, `transform`, `beforeHandle`, `afterHandle`, `mapResponse`, `onError`, `onResponse`, `onStart`/`onStop`; `derive` (per-request), `decorate` (app state), `resolve` (derived+validated), `as` scope control

## Execute

### 1. Lifecycle Order

```
onStart → (server up)
per-request: onRequest → parse → transform → beforeHandle → [handler] → afterHandle → mapResponse → onResponse
errors: onError (validation/handler errors) ; onStop (shutdown)
```

### 2. Hook APIs

```ts
app
  .onRequest(({ request }) => { /* earliest — before parse */ })
  .onParse(({ request, contentType }) => customParser)
  .onTransform(({ body, params, query, headers }) => { /* mutate pre-validation */ })
  .onBeforeHandle(({ set }) => { set.status = 401; return 'nope' })   // short-circuit
  .onAfterHandle(({ response }) => { /* post-process response */ })
  .mapResponse(({ response }) => new Response(modified))
  .onResponse(() => log())
  .onError(({ code, error, set }) => code === 'VALIDATION' ? { detail: error } : error)
  .onStop(() => cleanup())
```

- Return value จาก `beforeHandle`/`onError` = short-circuit response
- `code` ใน onError: `VALIDATION`, `NOT_FOUND`, `PARSE`, `INTERNAL_SERVER_ERROR`, `UNKNOWN`, custom named errors

### 3. derive, decorate, resolve

```ts
app
  .decorate('db', dbClient)                       // app-level singleton
  .derive(({ headers }) => ({ user: auth(headers.authorization) }))  // per-request derived
  .resolve(({ cookie }) => ({ session: loadSession(cookie) }))       // derived + can validate
```

- `decorate` — shared services (db, logger); `derive` — per-request computed context (cheap, no validation)
- `resolve` — like derive but after validation, can short-circuit (return value → response, e.g. 401)

### 4. Scoped Hooks And Guards

- Hooks default = **local** (instance ที่ define) — `.as('global')` / `.as('scoped')` propagate to `.use()` consumers
- `guard({ beforeHandle: fn, schema keys })` — apply ภายใน block เท่านั้น
- Plugin pattern: `new Elysia({ prefix }).derive().onError()` self-contained → `.use(plugin)`

## Rules

- Order fixed — derive/transform ก่อน validation, beforeHandle หลัง validation
- `resolve` สำหรับ auth-style short-circuit; `derive` สำหรับ pure computed context
- Hooks local โดย default — `.as('global')` อย่างระวัง (leak semantics)
- `onError` central error format — ห้าม try/catch per handler ทุกที่

## Expected Outcome

- Pipeline hooks ถูกลำดับ — auth/derive/short-circuit ทำงาน
- `decorate`/`derive`/`resolve` ใช้ถูก scope
