---
name: follow-lib-zod-handle-errors
description: Zod error handling — ZodError structure, issue codes, flatten/format, custom messages, i18n locales
argument-hint: "[scope]"
related:
  - follow-lib-zod
  - run-test
  - resolve-errors
---

## Goal

จัดการ Zod errors — `ZodError` structure, issue codes, `.flatten()`/`z.treeifyError`, custom messages, locale/i18n, error UX

## Scope

error consumption — issue inspection, formatting for APIs/forms, custom error maps, v4 locales (`zod/locales`)

## Execute

### 1. ZodError Anatomy

```ts
const result = Schema.safeParse(data)
if (!result.success) {
  result.error.issues        // ZodIssue[] — { code, path, message, expected, received, ... }
  result.error.flatten()     // { formErrors: [], fieldErrors: { field: [] } }
  z.treeifyError(result.error)  // v4 — nested object tree (better for nested errors)
  z.flattenError(result.error)  // v4 — flat structure
  z.prettifyError(result.error) // v4 — readable string
}
```

- v3: `.flatten()`; v4: `z.treeifyError`/`z.flattenError`/`z.prettifyError` helpers
- Issue codes: `invalid_type`, `too_small`, `too_big`, `invalid_format` (v4), `custom`, `unrecognized_keys` ...

### 2. Custom Messages

```ts
z.string().min(1, 'Required')                                // inline message
z.email({ error: 'Invalid email format' })                   // v4 error param

// v4 unified error param accepts string | function
z.string({ error: (iss) => iss.input === undefined ? 'required' : 'invalid' })
```

- v3 `errorMap`/`setErrorMap` → v4 `error` param (string/function/object)
- Per-field params: `{ error: 'msg' }` ใน schema options

### 3. API Error Responses

```ts
if (!parsed.success) {
  return Response.json({
    error: 'validation_failed',
    fields: z.flattenError(parsed.error).fieldErrors,
  }, { status: 400 })
}
```

- Return `issues` (full detail) หรือ `fieldErrors` (form-friendly) — เลือกตาม client
- ห้าม leak internal schema details ถ้า public API — map เป็น user-friendly fields

### 4. I18n And Locales

```ts
import { z } from 'zod'
import th from 'zod/locales/th'      // v4 built-in locales
z.config(th())
```

- v4 ships locales per language — `z.config(locale)` set error messages
- Custom per-instance: `error` params + message catalogs ของ app

## Rules

- ใช้ `issues` array เป็น source of truth — `.flatten`/`treeifyError` เป็น view
- Custom messages ใส่ใน schema (co-located) — ห้าม post-process string matching
- API errors structure คงที่ — client parse ได้ (code + fields map)
- v4 `error` param API — อย่าใช้ v3 `errorMap` style ใน code ใหม่

## Expected Outcome

- Errors formatted ตาม consumer (API/form/log)
- Custom messages + locales ครบ, ไม่ leak internals
