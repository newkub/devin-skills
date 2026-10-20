# Use Case — Forms with Actions and Pending State

> Submit a form to a server function, show pending state, surface validation errors, and keep the UI responsive without a client data layer. Source: https://react.dev/reference/react/useActionState (accessed 2026-10-20)

## 1. Action plus `useActionState`

```tsx
"use client"
import { useActionState } from "react"
import { createTodo } from "./actions"

export function TodoForm() {
  const [state, formAction, pending] = useActionState(createTodo, { error: null })
  return (
    <form action={formAction}>
      <input name="title" required />
      {state.error && <p role="alert">{state.error}</p>}
      <button disabled={pending}>{pending ? "Saving…" : "Save"}</button>
    </form>
  )
}
```

```ts
"use server"
export async function createTodo(_prev: { error: string | null }, formData: FormData) {
  const parsed = todoSchema.safeParse({ title: formData.get("title") })
  if (!parsed.success) return { error: "Title is required" }
  await db.todo.create({ data: parsed.data })
  revalidatePath("/todos")
  return { error: null }
}
```

## 2. `useFormStatus` for a nested submit button

```tsx
"use client"
import { useFormStatus } from "react-dom"

export function SubmitButton() {
  const { pending } = useFormStatus()   // must be rendered inside the <form>
  return <button disabled={pending}>Save</button>
}
```

## 3. Progressive enhancement

`<form action={serverAction}>` submits without JavaScript when the host framework supports it — keep actions free of closures over client state and validate `FormData` again on the server.

## Pitfalls

- Calling `useActionState` in a Server Component → it is a client-only Hook.
- Calling `useFormStatus` in the component that renders `<form>` → it must be a descendant, otherwise `pending` stays false.
- Passing an inline closure as `action` → server actions must be exported `"use server"` functions.
- Trusting client-side validation → the action is a public endpoint; parse `FormData` server-side.

## Related

- `references/apis.md`
- `usecases/data-fetching-with-suspense.md`
- `usecases/concurrent-ui-transitions.md`
