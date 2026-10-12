---
name: follow-lib-elysia-validate-requests
description: Elysia validation — TypeBox t.*, body/query/params/headers/response schemas, Standard Schema, type inference
argument-hint: "[scope]"
related:
  - follow-lib-elysia
  - follow-lib-zod
  - run-typecheck
  - resolve-errors
---

## Goal

Validate requests/responses ใน Elysia — TypeBox `t.*` schemas ต่อ field (body/query/params/headers/cookie), response schemas, Standard Schema interop

## Scope

request/response validation — `t.Object`/`t.String`/... schema keys per handler+group+global; Standard Schema (Zod/Valibot/ArkType/Effect) ใช้แทน TypeBox ได้; error handling → `use-lifecycle` onError

## Execute

### 1. Per-Route Schemas

```ts
import { Elysia, t } from 'elysia'

app.post('/users', ({ body }) => body, {
  body: t.Object({
    name: t.String({ minLength: 1 }),
    age: t.Optional(t.Integer({ minimum: 0 })),
    email: t.String({ format: 'email' }),
  }),
  query: t.Object({ verbose: t.Optional(t.BooleanString()) }),
  params: t.Object({ id: t.Numeric() }),          // auto-coerce string→number
  headers: t.Object({ authorization: t.String() }),
  response: { 200: UserSchema, 422: ErrorSchema }, // per-status response validation
})
```

- Schema keys: `body`, `query`, `params`, `headers`, `cookie`, `response`
- Coercion built-ins: `t.Numeric()`, `t.BooleanString()`, `t.File()`/`t.Files()` (uploads)
- Validated values **replace** raw — handler sees typed+coerced data

### 2. TypeBox Essentials

- `t.Object`, `t.String({ format })`, `t.Number`, `t.Integer`, `t.Boolean`, `t.Array(t.X)`, `t.Union`, `t.Literal`, `t.Record`, `t.Optional`, `t.Nullable`, `t.Partial`, `t.Pick`, `t.Omit`, `t.Ref`/`t.Model` shared
- `t.File({ type: 'image', maxSize: '5m' })` — upload validation
- Custom formats: `t.String({ format: 'email'|'uuid'|'date-time'|... })`

### 3. Shared Models

```ts
app.model({ user: t.Object({...}), error: t.Object({ message: t.String() }) })
app.post('/', h, { body: 'user', response: { 422: 'error' } })   // string ref → shared model
```

- `.model({ name: schema })` — app-level shared schemas, ref ด้วย string keys
- Reuse ข้าม routes/groups — single source

### 4. Standard Schema Interop

```ts
import { z } from 'zod'
app.post('/', h, { body: z.object({ name: z.string() }) })  // Zod/Valibot/ArkType work ตรง
```

- Elysia supports Standard Schema validators — Zod/Valibot/ArkType/Effect Schema drop-in
- TypeBox preferred — JIT-compiled fastest + Elysia-native inference; Standard Schema เมื่อ schemas shared กับ libs อื่น

### 5. Inference

- `t` schemas → typed `body`/`params`/`query`/`headers` ใน handler อัตโนมัติ
- Response schema → client type inference ผ่าน Eden (`use-eden`)

## Rules

- Validate ที่ schema keys — ห้าม manual `if (!body.x)` guards ใน handler
- `t.Numeric`/`BooleanString` coercion — ไม่ใช่ string parsing ใน handler
- `response` schema ใส่ทุก route ที่ Eden client ใช้ — inference + contract check
- Standard Schema lib = consistent ทั้ง app — อย่าปน TypeBox+Zod per route โดยไม่มีเหตุ

## Expected Outcome

- Requests validated+coerced ทุก boundary — handler ใช้ typed data ตรง
- Shared models reuse, Eden inference ได้ response types
