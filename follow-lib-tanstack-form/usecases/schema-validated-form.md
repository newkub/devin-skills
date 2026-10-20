# Use Case — Schema-Validated Sign-Up Form

> One Standard Schema drives field errors and the submit guard, with no mirrored React state. Source: https://tanstack.com/form/latest/docs/framework/react/guides/validation (accessed 2026-10-20)

## 1. Schema + form

```tsx
import { useForm } from "@tanstack/react-form"
import { z } from "zod"

const signUpSchema = z.object({
  email: z.email(),
  password: z.string().min(12, "Use at least 12 characters"),
})

export function SignUp() {
  const form = useForm({
    defaultValues: { email: "", password: "" },
    validators: { onChange: signUpSchema, onSubmit: signUpSchema },
    onSubmit: async ({ value }) => {
      await api.signUp(value)
    },
  })
  // ...
}
```

A Standard Schema (Zod, Valibot, ArkType) is used directly — no resolver adapter, and `form.state.values` is typed from it.

## 2. Field rendering and errors

```tsx
<form onSubmit={(e) => { e.preventDefault(); form.handleSubmit() }}>
  <form.Field
    name="email"
    children={(field) => (
      <>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          value={field.state.value}
          onBlur={field.handleBlur}
          onChange={(e) => field.handleChange(e.target.value)}
          aria-invalid={field.state.meta.errors.length > 0}
        />
        {field.state.meta.errors.map((err) => (
          <p key={String(err.message)} role="alert">{err.message}</p>
        ))}
      </>
    )}
  />
  <SubmitButton form={form} />
</form>
```

Field errors are objects, not strings — render `err.message` (a bare `{err}` throws "objects are not valid as a React child").

## 3. Submit guard without extra state

```tsx
function SubmitButton({ form }: { form: ReturnType<typeof useForm<z.infer<typeof signUpSchema>>> }) {
  return (
    <form.Subscribe
      selector={(s) => [s.canSubmit, s.isSubmitting, s.isDirty] as const}
      children={([canSubmit, isSubmitting]) => (
        <button type="submit" disabled={!canSubmit}>{isSubmitting ? "Creating…" : "Create account"}</button>
      )}
    />
  )
}
```

`canSubmit` already accounts for validation state and submission in flight.

## 4. Server-side errors back into the field

```ts
onSubmit: async ({ value }) => {
  const res = await api.signUp(value)
  if (res.error?.field === "email") {
    form.setFieldMeta("email", (m) => ({ ...m, errorMap: { onServer: res.error.message } }))
  }
}
```

## Pitfalls

- `defaultValues` missing a key → uncontrolled input, React warning, and the value never reaches the schema.
- Validating only on submit → users learn about a typo after the whole form is filled; use `onChange` + `onBlur`.
- Copying field values into `useState` → two sources of truth; read `field.state.value`.
- Calling `form.handleSubmit()` without `e.preventDefault()` → the browser navigates and the submit never completes.

## Related

- `references/apis.md`
- `usecases/array-fields-and-async-validation.md`
