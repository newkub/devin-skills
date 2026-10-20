# Use Case — Dynamic Field Arrays with Async Validation

> Let users add/remove rows and check uniqueness against the server without blocking typing. Source: https://tanstack.com/form/latest/docs/framework/react/guides/arrays (accessed 2026-10-20)

## 1. Array field

```tsx
const form = useForm({
  defaultValues: { members: [{ id: crypto.randomUUID(), email: "" }] },
  validators: { onChange: z.object({ members: z.array(z.object({ id: z.string(), email: z.email() })).min(1) }) },
  onSubmit: async ({ value }) => api.invite(value.members.map(({ email }) => email)),
})

<form.Field
  name="members"
  mode="array"
  children={(field) => (
    <>
      {field.state.value.map((member, i) => (
        <form.Field key={member.id} name={`members[${i}].email`} children={(sub) => (
          <>
            <input value={sub.state.value} onChange={(e) => sub.handleChange(e.target.value)} />
            <button type="button" onClick={() => field.removeValue(i)}>Remove</button>
          </>
        )} />
      ))}
      <button type="button" onClick={() => field.pushValue({ id: crypto.randomUUID(), email: "" })}>
        Add member
      </button>
    </>
  )}
/>
```

`mode="array"` exposes `pushValue`/`removeValue`/`swapValues`; child names use the bracket path `members[0].email`.

## 2. Async uniqueness check

```tsx
<form.Field
  name={`members[${i}].email`}
  validators={{
    onChangeAsyncDebounceMs: 400,
    onChangeAsync: async ({ value }) => {
      if (!value.includes("@")) return undefined          // let the sync schema handle format
      const res = await fetch(`/api/email-taken?email=${encodeURIComponent(value)}`)
      return (await res.json()).taken ? "This email is already invited" : undefined
    },
  }}
  children={(sub) => (
    <>
      <input value={sub.state.value} onChange={(e) => sub.handleChange(e.target.value)} />
      {sub.state.meta.isValidating && <span>Checking…</span>}
    </>
  )}
/>
```

The async validator returns a message or `undefined` and never throws; `isValidating` drives the inline hint.

## 3. Stable keys

Use a generated `id` per row (as above), not the index — removing row 0 with index keys makes React reuse the wrong input and validation state.

## Pitfalls

- `key={i}` on removable rows → wrong row keeps focus and errors; key by a stable id.
- Async validator without debounce → a request per keystroke and out-of-order results.
- `pushValue({ email: "" })` when the schema requires `id` → the new row fails immediately; push the full shape.
- Validating array length only on submit → the user can remove the last row and submit an empty list.

## Related

- `references/apis.md`
- `usecases/schema-validated-form.md`
