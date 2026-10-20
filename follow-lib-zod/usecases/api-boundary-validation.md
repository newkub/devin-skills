# Use Case — API Request and Response Contracts

> Type the wire, not just the handler: parse inbound payloads and outbound responses, then derive JSON Schema for OpenAPI from the same definitions. Source: https://zod.dev/json-schema (accessed 2026-10-20)

## 1. Model the endpoint

```ts
import * as z from "zod"

export const createTodoBody = z.object({
  title: z.string().min(1).max(120),
  dueAt: z.iso.datetime().optional(),
})

export const todo = z.object({
  id: z.uuid(),
  title: z.string(),
  done: z.boolean(),
  dueAt: z.iso.datetime().nullable(),
})

export const createTodoResponse = z.discriminatedUnion("ok", [
  z.object({ ok: z.literal(true), data: todo }),
  z.object({ ok: z.literal(false), issues: z.array(z.object({ path: z.string(), message: z.string() })) }),
])
```

`z.iso.datetime()` is the v4 ISO-8601 validator; `z.uuid()` and `z.email()` are top-level formats (v3's `z.string().uuid()` is legacy).

## 2. Guard the handler and the client

```ts
// server
const body = createTodoBody.safeParse(await req.json())
if (!body.success) return Response.json({ ok: false, issues: toIssues(body.error) }, { status: 422 })

// client — never trust the response shape either
const res = await fetch("/api/todos", { method: "POST", body: JSON.stringify(body.data) })
const parsed = createTodoResponse.parse(await res.json())
if (!parsed.ok) throw new Error(parsed.issues.map(i => i.message).join(", "))
```

## 3. Emit JSON Schema for docs / OpenAPI

```ts
const jsonSchema = z.toJSONSchema(createTodoBody, { io: "input" })
```

Feed that object into the OpenAPI generator instead of hand-writing a second schema.

## Pitfalls

- Parsing only the request and casting the response (`as Todo`) → a server change breaks the UI silently.
- A non-literal discriminator in `z.discriminatedUnion` → every branch is tried; keep the literal `ok`/`type` key.
- Generating JSON Schema with the output mode for request bodies → required/default differences are lost; pass `io: "input"`.
- Letting `ZodError` escape an HTTP handler → the framework answers 500 instead of a 422 with issues.

## Related

- `references/apis.md`
- `usecases/form-and-server-validation.md`
- `usecases/env-config-parsing.md`
