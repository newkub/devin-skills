---
name: follow-lib-tanstack-form
description: ใช้ TanStack Form ครบวงจร — fields, Standard Schema validation, arrays, async validators, granular reactivity
argument-hint: "[framework] [schema-lib]"
related:
  - follow-lib-tanstack-ecosystem
  - run-typecheck
  - resolve-errors
---

## Goal

ใช้ TanStack Form (v1) ครบ — headless type-safe forms: fields, Standard Schema validation (Zod/Valibot/ArkType), array fields, async validation, granular subscriptions, composable field components

## Scope

ใช้กับ forms ทุกขนาด — headless = state/validation เท่านั้น, UI เอง; adapters: `react-form`, `solid-form`, `vue-form`, `angular-form`, `svelte-form`; libraries เช่น shadcn มี wrappers อยู่แล้ว (re-export patterns ตาม docs)

- part of TanStack ecosystem — selection/dispatch อยู่ที่ `/follow-lib-tanstack-ecosystem`

## Execute

### 1. Install

```bash
bun add @tanstack/react-form zod   # adapter ตาม framework + schema lib ที่ใช้
```

### 2. Form Instance

```tsx
const form = useForm({
  defaultValues: { email: '', tags: [] as string[] },  // source of truth ของ types
  validators: { onSubmit: userSchema },                 // form-level schema
  onSubmit: async ({ value, formApi }) => {
    await api.createUser(value)          // value typed ตาม defaultValues
    formApi.reset()
  },
})
```

### 3. Fields And Validation

> Goal: field render-prop + trigger control

```tsx
<form.Field
  name="email"
  validators={{
    onChange: schema.shape.email,                    // Standard Schema → per-field
    onChangeAsync: async ({ value }) =>
      await isEmailTaken(value) ? 'Email taken' : undefined,
    onChangeAsyncDebounceMs: 300,
  }}
>
  {(field) => (
    <>
      <input value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
        onBlur={field.handleBlur} />
      {field.state.meta.errors.map((err) => <em key={String(err)}>{String(err)}</em>)}
    </>
  )}
</form.Field>
```

- Triggers: `onMount`/`onChange`/`onBlur`/`onSubmit`/`onChangeAsync`/`onBlurAsync`/`onSubmitAsync` + `*AsyncDebounceMs` + `onDynamic`
- `field.state.meta`: `errors`, `isTouched`, `isDirty`, `isValidating`, `errorMap`

### 4. Patterns

> Goal: ครอบ forms จริง

1. **Array fields**: `mode="array"` + `field.pushValue(v)`/`removeValue(i)`/`swapValues` — dynamic lists (skills, line items)
2. **Granular subscribe**: `<form.Subscribe selector={(s) => s.canSubmit}>` — re-render เฉพาะ derived slice
3. **Composable fields**: wrap `form.Field` เป็น shared input components ผ่าน `createFormHook` + `fieldComponents`/`formComponents`
4. **Linked fields**: `listeners` บน field → recompute field อื่นเมื่อค่าเปลี่ยน
5. **Server submit errors**: `onSubmit` catch → map เข้า field errors หรือ form-level error display
6. **Reset/persist**: `formApi.reset()`, draft autosave ผ่าน subscribe + storage

### 5. Verify

1. `/run-typecheck` — field names typed จาก defaultValues (typo ติด compile error)
2. ทดสอบ validation triggers, async debounce, array ops, submit/reset flow
3. ถ้า fail → `/resolve-errors` max 3 รอบ

## Rules

- `defaultValues` = type source — ครบทุก field ห้ามขาด
- Standard Schema validators — ห้ามเขียน regex/manual validator ถ้า schema มี
- Async validators ต้องมี debounce — ไม่งั้น spam server ทุก keystroke
- Headless = a11y เป็นของ app: `label htmlFor`, `aria-invalid`, `aria-describedby`, error text link
- `form.Subscribe` สำหรับ derived UI — ห้าม subscribe ทั้ง store

## Expected Outcome

- Form type-safe ตั้งแต่ field ถึง submit
- Validation (sync/async/schema) + array fields + granular reactivity ทำงาน
- Composable field components reuse ได้ข้าม forms
