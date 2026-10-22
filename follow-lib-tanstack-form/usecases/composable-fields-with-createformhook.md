# Use Case — Composable Field Components With createFormHook

> Build one typed `<TextField>` and reuse it in every form, so no form re-declares value/onBlur/error wiring. Source: https://tanstack.com/form/latest/docs/framework/react/guides/form-composition (accessed 2026-10-20)

## 1. Create the contexts and the app hook once

```tsx
// src/form.ts
import { createFormHook, createFormHookContexts } from "@tanstack/react-form"

export const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts()

export const { useAppForm, withForm } = createFormHook({
  fieldComponents: { TextField, SelectField },
  formComponents: { SubmitButton },
  fieldContext,
  formContext,
})
```

Call `createFormHookContexts()` exactly once per app — it creates the React contexts the field components read.

## 2. One field component that owns its own wiring

```tsx
// src/components/TextField.tsx
import { useFieldContext } from "../form"

export function TextField({ label, type = "text" }: { label: string; type?: string }) {
  const field = useFieldContext<string>()
  const invalid = field.state.meta.isTouched && field.state.meta.errors.length > 0

  return (
    <div>
      <label htmlFor={field.name}>{label}</label>
      <input
        id={field.name}
        type={type}
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
        onBlur={field.handleBlur}
        aria-invalid={invalid}
        aria-describedby={invalid ? `${field.name}-error` : undefined}
      />
      {invalid && (
        <p id={`${field.name}-error`} role="alert">
          {field.state.meta.errors.map((err) => err.message).join(", ")}
        </p>
      )}
    </div>
  )
}
```

`useFieldContext` reads the nearest field, so the component takes no `value`/`onChange` props — there is no way for a caller to wire it to the wrong field.

## 3. Use it from a form

```tsx
export function ProfileForm() {
  const form = useAppForm({
    defaultValues: { email: "", plan: "free" },
    onSubmit: async ({ value }) => { await api.save(value) },
  })

  return (
    <form onSubmit={(e) => { e.preventDefault(); form.handleSubmit() }}>
      <form.AppField name="email">
        {(field) => <field.TextField label="Email" />}
      </form.AppField>

      <form.AppField name="plan">
        {(field) => <field.SelectField label="Plan" options={plans} />}
      </form.AppField>

      <form.AppForm>
        <form.SubmitButton label="Save" />
      </form.AppForm>
    </form>
  )
}
```

- `form.AppField` only accepts registered component names — an unregistered one is a compile error.
- Field names are typed from `defaultValues`, so rendering `<field.TextField>` for a numeric field fails at typecheck.

## 4. Reuse a whole form with withForm

```tsx
// src/forms/ContactForm.tsx
export const ContactForm = withForm({
  defaultValues: { name: "", message: "" },
  props: {} as { onSent?: () => void },
  render: ({ form, onSent }) => (
    <form onSubmit={(e) => { e.preventDefault(); form.handleSubmit() }}>
      <form.AppField name="name">{(f) => <f.TextField label="Name" />}</form.AppField>
      <form.AppField name="message">{(f) => <f.TextField label="Message" />}</form.AppField>
      <form.Subscribe
        selector={(s) => s.isSubmitting}
        children={(isSubmitting) => <button type="submit" disabled={isSubmitting}>Send</button>}
      />
    </form>
  ),
})
```

`withForm` is how the same form lands on two pages without copy-paste; compose it into another form by passing its `form` prop when you need a shared submit button.

## 5. Verify

1. `/run-typecheck` — the component-name closed list and the field-type match both fail at compile time
2. `/run-test` — render one form, type into `<field.TextField>`, assert the error text after blur
3. Add a second form that reuses the components — the diff should contain no wiring code
4. On failure → `/resolve-errors` max 3 rounds

## Pitfalls

- Calling `createFormHookContexts()` again in a component file → its `useFieldContext` reads a different context and returns `undefined`; import the single instance from `src/form.ts`.
- Reading `useFormContext` inside a field component that only needs the field → the component re-renders on every form change; use the field context.
- Copying the value into `useState` for convenience → the copy survives `form.reset()` and the input shows stale text.
- Registering a field component under `formComponents` → it renders outside a field and the hook throws.
- One giant `<TextField>` with a `variant` prop for every case → type-specific components (`NumberField`, `DateField`) keep `useFieldContext<number>()` honest.

## Related

- `references/apis.md`
- `best-practices/tanstack-form.md`
- `usecases/schema-validated-form.md`
- `usecases/linked-fields-and-draft-autosave.md`
