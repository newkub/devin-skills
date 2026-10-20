# Use Case — One Schema for Form and Server

> Reuse the same Zod schema in the browser form and the server handler so client and server can never disagree. Source: https://zod.dev/api (accessed 2026-10-20)

## 1. Define the schema once

```ts
import * as z from "zod"

export const signupSchema = z.object({
  email: z.email(),
  password: z.string().min(8, { error: "At least 8 characters" }),
  age: z.coerce.number().int().positive().optional(),
})

export type Signup = z.output<typeof signupSchema>
export type SignupInput = z.input<typeof signupSchema>
```

`z.input` is the pre-parse shape (`age` arrives as a string from a form); `z.output`/`z.infer` is the parsed shape.

## 2. Server handler — safeParse at the boundary

```ts
const result = signupSchema.safeParse(await request.json())
if (!result.success) {
  return Response.json({ issues: z.flattenError(result.error).fieldErrors }, { status: 422 })
}
const { email, password, age } = result.data
```

Use `parse` only when a thrown `ZodError` is the contract (CLI, internal job); HTTP boundaries use `safeParse` and map issues themselves.

## 3. Form — Standard Schema resolver

```ts
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema"

const form = useForm<SignupInput>({ resolver: standardSchemaResolver(signupSchema) })
```

TanStack Form takes the schema directly (`validators: { onChange: signupSchema }`). Zod v4 implements Standard Schema, so no Zod-specific adapter is needed.

## Pitfalls

- Validating only on the client → the server trusts unvalidated JSON; always parse again server-side.
- Typing form state with `z.infer` → coerced/optional fields get their parsed output type instead of the raw input.
- Returning `result.error` directly in JSON → map it with `z.flattenError`/`z.treeifyError`/`result.error.issues` first.
- Async `.refine` on a schema used with `safeParse` → promise-returning refinements need `safeParseAsync`.

## Related

- `references/apis.md`
- `usecases/api-boundary-validation.md`
- `usecases/env-config-parsing.md`
