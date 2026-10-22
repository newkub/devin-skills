# Use Case — Multi-Step Wizard With Per-Step Gates

> Advance only when the current step's fields pass, keep one form state across steps, and stop later steps from showing errors before they open. Source: https://tanstack.com/form/latest/docs/framework/react/guides/validation (accessed 2026-10-20)

## 1. Declare steps as field names

```tsx
const STEPS = [
  { id: "account", fields: ["email", "password"] },
  { id: "profile", fields: ["name", "bio"] },
  { id: "plan", fields: ["plan", "seats"] },
] as const

type StepId = (typeof STEPS)[number]["id"]
```

Deriving the step list from `defaultValues` keys keeps the wizard honest: adding a field without listing it is caught by the type below.

```tsx
type FieldName = keyof typeof defaultValues
const STEPS: { id: StepId; fields: FieldName[] }[] = STEPS_RAW
```

## 2. Seed all values up front

```tsx
const form = useAppForm({
  defaultValues: { email: "", password: "", name: "", bio: "", plan: "free", seats: 1 },
  validators: { onSubmit: wizardSchema },
  onSubmit: async ({ value }) => { await api.createAccount(value) },
})
```

The form spans every step, so going back never loses input and `form.state.values` is complete at submit.

## 3. Gate the "Next" button on the current step

```tsx
async function goNext() {
  const invalid = await Promise.all(
    STEPS[step].fields.map((name) => form.validateField(name, "submit")),
  )
  if (invalid.some((errors) => errors?.length)) return   // errors already on the fields
  setStep((s) => Math.min(s + 1, STEPS.length - 1))
}
```

`validateField` writes into the field's own meta, so the inputs show their errors without extra state.

## 4. Validate on mount so a reopened step is honest

```tsx
<form.AppField
  name={STEPS[step].fields[0]}
  validators={{ onMount: schema.shape[STEPS[step].fields[0]] }}
>
  {(field) => <field.TextField label="Email" />}
</form.AppField>
```

Mount-time validation is what makes a step that was skipped and then opened show the errors immediately, instead of only after another keystroke.

## 5. Render one step at a time

```tsx
{step === 0 && (
  <>
    <form.AppField name="email">{(f) => <f.TextField label="Email" />}</form.AppField>
    <form.AppField name="password">{(f) => <f.TextField label="Password" type="password" />}</form.AppField>
  </>
)}
{step === 1 && (
  <>
    <form.AppField name="name">{(f) => <f.TextField label="Name" />}</form.AppField>
    <form.AppField name="bio">{(f) => <f.TextArea label="Bio" />}</form.AppField>
  </>
)}

<button type="button" onClick={() => setStep((s) => Math.max(s - 1, 0))} disabled={step === 0}>Back</button>
<form.Subscribe
  selector={(s) => s.isSubmitting}
  children={(isSubmitting) =>
    step < STEPS.length - 1
      ? <button type="button" onClick={goNext}>Next</button>
      : <button type="submit" disabled={isSubmitting}>Create account</button>
  }
/>
```

Unmounted fields keep their values (the form owns them) — that is why the step components can be conditional instead of CSS-hidden.

## 6. Verify

1. `/run-test` — submit step 1 empty: it does not advance and shows two field errors
2. Fill step 1, advance, go back — values are still there
3. Open step 2 with an invalid value, mount validation fires without typing
4. Submit at the last step — one payload with every step's values
5. `/run-typecheck` — a field added to `defaultValues` but missing from `STEPS` is a type error
6. On failure → `/resolve-errors` max 3 rounds

## Pitfalls

- One `useForm` per step → the final submit has to merge three states and loses earlier steps when the user navigates back.
- Validating only the whole form on "Next" → the user is blocked by an error on a step they cannot see.
- Keeping `step` inside the form's `defaultValues` → the step count becomes part of the submitted payload; keep UI state in React.
- Hiding inactive steps with CSS instead of unmounting → every field's validation runs on each step and the page jumps to off-screen errors.
- Using `onChange` schema validation on a wizard that submits many fields → users cannot reach step 2 without fixing step 3's optional rules.

## Related

- `references/apis.md`
- `best-practices/tanstack-form.md`
- `usecases/schema-validated-form.md`
- `usecases/array-fields-and-async-validation.md`
