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

Validate external data ด้วย Zod ที่ boundaries — parse vs safeParse, API boundaries, env config, async schemas

## Scope

validation application — `.parse`/`.safeParse`/`.parseAsync`, boundary placement (requests, responses, env, files), error propagation

## Execute

### 1. Parse vs SafeParse

```ts
// throw on invalid — boundaries ที่ trust สูงหรือ 500-worthy
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

// response validation (defensive — API ภายนอก)
const ext = ExternalApiResponse.parse(await res.json())
```

### 3. Env/Config Validation

```ts
const Env = z.object({
  DATABASE_URL: z.url(),
  PORT: z.coerce.number().int().positive().default(3000),
  NODE_ENV: z.enum(['development', 'test', 'production']),
})
export const env = Env.parse(process.env)   // fail-fast ตอน boot
```

- Validate env ตอน startup — fail fast ก่อน app run; `z.coerce.*` สำหรับ string→number/bool env vars

### 4. Data Sources

1. **Request bodies/params/query**: validate ก่อน business logic
2. **External API responses**: validate ถ้า trust ต่ำ; skip ถ้า internal type-safe contract (perf)
3. **File uploads/JSON files**: parse → validate → use
4. **WebSocket/stream payloads**: validate per message
5. **Queue/job payloads**: validate ตอน consume

## Rules

- `.safeParse` ที่ boundaries ที่ input ควร invalid ได้ — `.parse` เมื่อ invalid = bug (500)
- Env validation ตอน boot เสมอ — late env errors = runtime surprises
- Validate ครั้งเดียวที่ boundary — ภายใน trust types แล้ว (อย่า re-parse)
- Async refinements ต้อง `parseAsync` — sync parse throw บน async schemas

## Expected Outcome

- Boundaries ทุกจุด validate — env boot-checked, requests 400 ถูกต้อง
- parse/safeParse เลือกถูกตาม error semantics
