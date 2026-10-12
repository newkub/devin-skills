---
name: follow-lib-elysia-use-eden
description: Eden type-safe client — treaty, fetch, WS subscriptions, type exports for FE
argument-hint: "[mode]"
related:
  - follow-lib-elysia
  - run-typecheck
  - run-test
  - resolve-errors
---

## Goal

ใช้ Eden — end-to-end type-safe client สำหรับ Elysia apps — `treaty`, `edenFetch`, WS subscriptions, `App` type export

## Scope

client-side type safety — `@elysiajs/eden` treaty (fetch-based typed client), `eden` helpers; server routes → `define-routes`/`validate-requests`

## Execute

### 1. Export App Type

```ts
// server — export type, client imports it (ไม่ต้อง import server code)
const app = new Elysia().get('/users/:id', h).listen(3000)
export type App = typeof app
```

### 2. Treaty Client

```ts
import { treaty } from '@elysiajs/eden'
import type { App } from './server'         // type-only import

const api = treaty<App>('localhost:3000')
const { data, error } = await api.users({ id: '1' }).get()
const { data: created } = await api.users.post({ name: 'x' })
```

- `treaty<App>(url)` — path-chained calls mirror routes; `data`/`error` discriminated result (ไม่ throw)
- Params: `api.users({ id }).get()`; body: `.post(body)`; query: `.get({ query: {...} })`; headers: `.get({}, { headers })`
- `error.value` typed จาก `response` schemas — typed error handling บน client

### 3. Eden Fetch (low-level)

```ts
// treaty(...).fetch — fetch-compatible escape hatch สำหรับ edge cases
const res = await api.users({ id: '1' }).get({ fetch: { credentials: 'include' } })
```

- fetch options (credentials, headers, signal) ผ่าน `{ fetch: {...} }` param

### 4. WS Subscriptions

```ts
const chat = api.chat.subscribe()
chat.on('message', ({ data }) => { /* typed messages */ })
chat.send(msg)
chat.close()
```

- WS routes → typed subscriptions via treaty — `subscribe`, `on('message'|'open'|'close')`, `send`

### 5. Response Type Requirements

- Eden inference ต้องการ `response` schemas — ใส่ `response:` key ทุก route ที่ client consume
- File uploads: `t.File` fields → treaty `.post({ file })` auto multipart

## Rules

- `treaty` preferred — full path/method inference; fetch escape hatch เมื่อจำเป็น
- Import `type App` เท่านั้น — server code ห้าม leak เข้า client bundle
- `data`/`error` destructuring pattern — ห้าม try/catch (treaty ไม่ throw โดย default)
- Response schemas ครบ = client types ครบ — missing response → `unknown` types ฝั่ง client

## Expected Outcome

- Client calls typed E2E (params/body/query/response/errors)
- WS subscriptions typed; ไม่มี manual API types
