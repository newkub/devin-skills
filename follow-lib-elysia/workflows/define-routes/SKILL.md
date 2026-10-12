---
name: follow-lib-elysia-define-routes
description: Elysia routing — methods, params/wildcards, path types, groups/prefix, macro, mount, WebSocket routes
argument-hint: "[scope]"
related:
  - follow-lib-elysia
  - run-dev
  - run-test
  - resolve-errors
---

## Goal

ออกแบบ Elysia routes ครบ — HTTP methods, path params/wildcards, route groups, `.mount` sub-apps, macros, WebSocket routes

## Scope

routing surface — `app.get/post/put/delete/...`, path typing, `.group` prefix, `.guard`, `.macro`, `.mount`, `.ws`; request validation → `validate-requests`; lifecycle hooks → `use-lifecycle`

## Execute

### 1. Route Basics

```ts
import { Elysia } from 'elysia'

new Elysia()
  .get('/', () => 'hello')
  .post('/users', ({ body }) => body)
  .get('/users/:id', ({ params }) => params.id)         // typed params
  .get('/files/*', ({ params }) => params['*'])          // wildcard
  .get('/opt/:id?', ({ params }) => params.id)           // optional param
  .listen(3000)
```

- Methods: `get`/`post`/`put`/`patch`/`delete`/`options`/`head`/`all`/`ws`
- Handler signature: `({ params, body, query, headers, cookie, set, request }) => value`
- Return types auto: object→JSON, `Response`→raw, `file()`/`stream` support

### 2. Path Params And Types

- `:param` typed string โดย default — validate/transform ผ่าน `params` schema (TypeBox/Standard Schema)
- `* wildcard`, `:param?` optional, custom path types — params inferred into handler
- `set.status`/`set.headers` — response control ใน handler

### 3. Groups, Guards, Mount

```ts
new Elysia()
  .group('/api', app => app
    .get('/a', () => 'a')            // /api/a
    .guard({ isAuth: true }, g => g  // scoped guard
      .get('/b', () => 'b')))
  .mount('/sub', subApp.fetch)       // หรือ .use(subApp) Elysia sub-app
```

- `.group(prefix, app => ...)` — path prefix + scoped hooks/schemas
- `.guard(schemas|options)` — apply validation/hooks ภายใน block เท่านั้น
- `.use(plugin)`/`mount` — compose sub-apps; instance isolation ผ่าน `.use()` semantics (prefix per instance)

### 4. WebSocket Routes

```ts
.ws('/chat', {
  message(ws, msg) { ws.send(msg) },
  open(ws) {}, close(ws) {},
})
```

- `ws` route — `message`/`open`/`close`/`drain` handlers; Bun-native WS
- Body validation กับ ws messages ได้เช่นกัน

## Rules

- Handler return = response body — `set.status`/`set.headers` สำหรับ status/headers
- Path params typed+validated ผ่าน schema — อย่า trust raw string
- `.group` for prefixes; `.guard` for scoped constraints — อย่า duplicate prefix strings
- WS ใช้ `.ws()` — ไม่ใช่ manual upgrade

## Expected Outcome

- Routes ครบ methods/params/wildcards/groups ถูก pattern
- Sub-app composition + WS routes ทำงาน
