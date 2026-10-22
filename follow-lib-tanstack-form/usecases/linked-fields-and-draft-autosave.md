# Use Case — Linked Fields and a Persisted Draft

> Derive one field from another through listeners, and keep an unfinished form across reloads without turning it into an extra state store. Source: https://tanstack.com/form/latest/docs/framework/react/guides/listeners (accessed 2026-10-20)

## 1. Derive a field with a listener

```tsx
<form.AppField
  name="shippingAddress"
  listeners={{
    onChange: ({ fieldApi }) => {
      // Same address for billing unless the user opted out.
      fieldApi.form.setFieldValue("billingSameAsShipping", true)
    },
  }}
>
  {(field) => <field.TextField label="Shipping address" />}
</form.AppField>
```

The listener runs in the field's own update cycle, so dependent fields settle in the same render pass — no `useEffect` watching values.

## 2. Copy values conditionally, not unconditionally

```tsx
<form.AppField name="billingSameAsShipping">
  {(field) => <field.Checkbox label="Billing same as shipping" />}
</form.AppField>

<form.Subscribe
  selector={(s) => [s.values.shippingAddress, s.values.billingSameAsShipping] as const}
  children={([shippingAddress, same]) =>
    same ? <input readOnly value={shippingAddress} aria-label="Billing address" /> : null
  }
/>
```

When `same` is true, billing is rendered from shipping rather than copied into a second field — one value, one source.

## 3. Save a debounced draft

```tsx
function DraftSaver({ formKey }: { formKey: string }) {
  const form = useFormContext()
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)

  return (
    <form.Subscribe
      selector={(s) => s.values}
      children={(values) => {
        clearTimeout(timer.current)
        timer.current = setTimeout(() => {
          localStorage.setItem(formKey, JSON.stringify({ v: 1, values }))
        }, 500)
        return null
      }}
    />
  )
}
```

`form.Subscribe` re-renders only this child; the form itself does not re-render on every keystroke.

## 4. Restore with validation, not blind trust

```tsx
const DRAFT_KEY = "profile-draft"

function loadDraft<T>(schema: StandardSchemaV1<T>, empty: T): T {
  const raw = localStorage.getItem(DRAFT_KEY)
  if (!raw) return empty
  try {
    const parsed = schema["~standard"].validate(JSON.parse(raw).values)
    return "value" in parsed ? (parsed.value as T) : empty
  } catch {
    return empty
  }
}

const form = useAppForm({
  defaultValues: loadDraft(profileSchema, { name: "", bio: "" }),
  onSubmit: async ({ value }) => {
    await api.save(value)
    localStorage.removeItem(DRAFT_KEY)   // clear only after the server accepted it
  },
})
```

A draft written by an older release can violate the current schema; parse it before seeding `defaultValues`, otherwise the first render throws inside the form.

## 5. Verify

1. `/run-test` — change shipping, assert the dependent field follows; untick the opt-out, assert it stops following
2. Type, wait past the debounce, reload — the draft is restored with the same types
3. Submit successfully — the draft key is gone, and a reload starts empty
4. `/run-typecheck` — `values` in the selector stays typed
5. On failure → `/resolve-errors` max 3 rounds

## Pitfalls

- Restoring a draft into `useState` instead of `defaultValues` → the form's own state ignores it.
- Autosaving on every keystroke without debounce → a `localStorage` write per character blocks the main thread on long forms.
- Treating a restored draft as valid input → users see a crash or silent data loss when the schema moved on; validate first.
- Clearing the draft inside `onSubmit` before `await` → a failed request wipes unsent input.
- Syncing two fields with two listeners that write each other → an update loop; derive one direction only.

## Related

- `references/apis.md`
- `best-practices/tanstack-form.md`
- `usecases/schema-validated-form.md`
- `usecases/multi-step-wizard.md`
