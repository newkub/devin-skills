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

Handle Zod errors — `ZodError` structure, issue codes, `.flatten()`/`z.treeifyError`, custom messages, locale/i18n, error UX

## Scope

error consumption — issue inspection, formatting for APIs/forms, custom error maps, v4 locales (`zod/locales`)

## Execute

### 1. ZodError Anatomy

> Goal: ZodError Anatomy.

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

> Goal: Custom Messages.

```ts
z.string().min(1, 'Required')                                // inline message
z.email({ error: 'Invalid email format' })                   // v4 error param

// the v4 unified error param accepts string | function
z.string({ error: (iss) => iss.input === undefined ? 'required' : 'invalid' })
```

- v3 `errorMap`/`setErrorMap` → v4 `error` param (string/function/object)
- Per-field params: `{ error: 'msg' }` in schema options

### 3. API Error Responses

> Goal: API Error Responses.

```ts
if (!parsed.success) {
  return Response.json({
    error: 'validation_failed',
    fields: z.flattenError(parsed.error).fieldErrors,
  }, { status: 400 })
}
```

- Return `issues` (full detail) or `fieldErrors` (form-friendly) — pick per the client
- Never leak internal schema details on a public API — map to user-friendly fields

### 4. I18n And Locales

> Goal: I18n And Locales.

```ts
import { z } from 'zod'
import th from 'zod/locales/th'      // v4 built-in locales
z.config(th())
```

- v4 ships locales per language — `z.config(locale)` sets error messages
- Custom per-instance: `error` params + the app's message catalogs

## Rules

- Use the `issues` array as the source of truth — `.flatten`/`treeifyError` are views
- Put custom messages in the schema (co-located) — never post-process with string matching
- Keep API error structure stable — the client can parse it (code + fields map)
- Use the v4 `error` param API — don't use v3 `errorMap` style in new code

## Expected Outcome

- Errors formatted per consumer (API/form/log)
- Custom messages + locales complete, no internals leaked
