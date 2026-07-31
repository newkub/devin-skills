---
name: follow-tanstack-form
description: ตั้งค่าและใช้งาน TanStack Form v1 สำหรับ type-safe form management
---

## Goal

ตั้งค่า TanStack Form v1 สำหรับ type-safe form management พร้อม Standard Schema validation

## Scope

ใช้สำหรับ TanStack Form v1 ใน React, Solid, Vue, Svelte, Angular, Lit projects

## Execute

### 1. Setup And Form Instance

1. ติดตั้งด้วย `bun add @tanstack/[framework]-form`
2. ใช้ `useForm` สำหรับ form instance
3. ใช้ `form.Field` สำหรับ individual fields พร้อม `validators`

### 2. Validation

1. ใช้ Standard Schema (Zod, Valibot, ArkType) โดยตรงใน `validators` (ไม่ต้อง adapter)
2. ใช้ `onChange`, `onBlur`, `onSubmit` validators สำหรับ sync validation
3. ใช้ `onChangeAsync`, `onBlurAsync` สำหรับ async validation พร้อม `asyncDebounceMs`
4. อ่าน `field.state.meta.errors` สำหรับ error rendering
5. ใช้ `error.message` จาก Standard Schema errors (ไม่ใช่ raw value)

### 3. Form State And Submission

1. ใช้ `form.Subscribe` พร้อม `selector` สำหรับ form-level state
2. ใช้ `canSubmit` สำหรับ submit button disabled state
3. ใช้ `createServerValidate` สำหรับ SSR validation

### 4. Array Fields

1. รองรับ array fields ด้วย `pushValue`, `insertValue`, `removeValue`, `swapValues`
2. ใช้ dynamic field validation สำหรับ array items

### 5. DevTools

1. ติดตั้ง `@tanstack/[framework]-form-devtools`
2. ใช้ `<TanStackFormDevtools />` เฉพาะใน development

## Rules

### 1. Form Best Practices

- ใช้ Standard Schema (Zod, Valibot, ArkType) โดยตรง (ไม่ต้อง adapter)
- ใช้ `asyncDebounceMs` สำหรับ async validation
- ใช้ `canSubmit` สำหรับ submit button state
- ใช้ `createServerValidate` สำหรับ SSR validation
- อ่าน `error.message` จาก Standard Schema errors
- ใช้ array field methods สำหรับ dynamic fields

### 2. Type Safety

- ใช้ TypeScript types อย่างเต็มรูปแบบ
- ใช้ type inference จาก form APIs
- ใช้ Standard Schema สำหรับ runtime validation

## Expected Outcome

- TanStack Form v1 ใช้ Standard Schema validation โดยตรง
- Type-safe form fields พร้อม sync และ async validation
- Array fields รองรับ dynamic forms
- SSR validation ทำงานได้
- DevTools ติดตั้งสำหรับ development
