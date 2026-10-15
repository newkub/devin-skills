---
name: follow-lib-zod-validate-data
description: Zod validation at boundaries — parse/safeParse, API request/response, env vars, async validation
argument-hint: "[boundary]"
related:
  - follow-lib-zod
  - run-test
  - resolve-errors
---

## Goal

Validate external data with Zod at boundaries — parse vs safeParse, API boundaries, env config, async schemas

## Scope

validation application — `.parse`/`.safeParse`/`.parseAsync`, boundary placement (requests, responses, env, files), error propagation

## Execute

### 1. Parse vs SafeParse

```ts
// throw on invalid — high-trust boundaries or 500-worthy ones
const user = UserSchema.parse(rawInput)

// return result object — expected-invalid paths (forms, external input)
const result = UserSchema.safeParse(rawInput)
if (!result.success) { return { error: result.error } }
result.data // typed

// async refinements/transforms
await Schema.parseAsync(data)
await Schema.safeParseAsync(data)
```

### 2. API Boundary Validation

```ts
// request body
const body = await req.json()
const parsed = CreateTodo.safeParse(body)
if (!parsed.success) return Response.json({ issues: parsed.error.issues }, { status: 400 })

// response validation (defensive — external APIs)
const ext = ExternalApiResponse.parse(await res.json())
```

### 3. Env/Config Validation

```ts
const Env = z.object({
  DATABASE_URL: z.url(),
  PORT: z.coerce.number().int().positive().default(3000),
  NODE_ENV: z.enum(['development', 'test', 'production']),
})
export const env = Env.parse(process.env)   // fail-fast at boot
```

- Validate env at startup — fail fast before the app runs; use `z.coerce.*` for string→number/bool env vars

### 4. Data Sources

1. **Request bodies/params/query**: validate before business logic
2. **External API responses**: validate if trust is low; skip if it's an internal type-safe contract (perf)
3. **File uploads/JSON files**: parse → validate → use
4. **WebSocket/stream payloads**: validate per message
5. **Queue/job payloads**: validate on consume

## Rules

- `.safeParse` at boundaries where input may legitimately be invalid — `.parse` when invalid = bug (500)
- Always validate env at boot — late env errors = runtime surprises
- Validate once at the boundary — internally trust the types (don't re-parse)
- Async refinements require `parseAsync` — sync parse throws on async schemas

## Expected Outcome

- Every boundary validates — env is boot-checked, requests return 400 correctly
- parse/safeParse chosen per the error semantics
