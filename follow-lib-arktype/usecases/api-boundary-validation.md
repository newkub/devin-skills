# Use Case — Validate Request Bodies at the API Boundary

> Parse untrusted JSON once at the HTTP edge and return field-level errors instead of a stack trace. Source: https://arktype.io/docs (accessed 2026-10-20)

## 1. Install and define the schema

```bash
bun add arktype
```

```ts
import { type } from "arktype"

export const createUser = type({
  email: "string.email",
  name: "string >= 1",
  "age?": "number.integer",
})

export type CreateUser = typeof createUser.infer
```

The schema is the type: `typeof schema.infer` keeps compile-time and runtime in sync without a second declaration.

## 2. Validate at the handler

```ts
const result = createUser(await request.json())

if (result instanceof type.errors) {
  return Response.json(
    {
      error: "invalid_request",
      issues: result.map((e) => ({ path: e.path.join("."), message: e.message })),
    },
    { status: 422 },
  )
}

const body: CreateUser = result
```

`schema(data)` returns the parsed output on success and `ArkErrors` on failure. Use `type.errors` for the `instanceof` check rather than importing a separate class.

## 3. Choose the right validation method

```ts
createUser.assert(payload)       // throws TraversalError — internal jobs, CLIs
createUser.allows(payload)       // boolean type guard — feature flags, branching
await createUser(data)           // await only when the schema contains morphs
```

## 4. Reuse the schema for the response

```ts
const userResponse = type({
  id: "string.uuid",
  email: "string.email",
  name: "string",
})

return Response.json(userResponse.assert(row))
```

Validating the response too catches accidental field leaks (extra columns, internal flags) before they leave the process.

## Pitfalls

- Returning `result` directly as JSON → success data and errors look alike; branch on `instanceof type.errors` first.
- Using `.assert()` in an HTTP handler → an unhandled `TraversalError` becomes a 500; reserve it for code paths where a throw is the contract.
- Defining a TypeScript interface next to the schema → the two drift; infer from the schema.
- Forgetting `await` when the schema has morphs → you get a promise instead of the parsed value.

## Related

- `references/apis.md`
- `best-practices/arktype.md`
- `usecases/env-config-parsing.md`
