---
name: follow-uxui-form
description: สร้าง form UX ที validation, inline errors, floating labels, steppers ดี
triggers:
  - user
  - model
allowed-tools:
  - read
  - edit
  - write
  - grep
  - glob
  - exec
  - ask_user_question
  - skill
related:
  - follow-tanstack-form
  - follow-zod
  - follow-uxui-interaction
  - follow-uxui-feedback
  - follow-react
  - follow-vue
  - follow-solidjs
  - follow-best-practice
  - review-accessibility
  - validate
  - validate-workflow
  - check-reference
  - update-reference
---

## Goal

สร้าง form UX ที validation, inline errors, floating labels, steppers, และ autosave ใช้งานง่ายและ accessible

## Scope

ใช้สำหรับ forms ใน web app เช่น signup, checkout, settings, surveys

## Execute

### 1. Detect Form Need

ระบุลักษณะ form

> Goal: เลือก pattern ถูกต้อง

1. ระบุขนาด: single field, multi-step, wizard
2. ระบุ schema/validator: Zod, Valibot, Yup, Joi
3. ระบุ target framework: React, Vue, Solid, Svelte
4. ถ้าไม่ชัด → ทำ `/ask-me`

### 2. Choose Library

เลือก form library

> Goal: ใช้ type-safe form management

1. ถ้าใช้ TanStack ecosystem → `/follow-tanstack-form`
2. ถ้าใช้ React → `React Hook Form` + `Zod`
3. ถ้าใช้ Vue → `VeeValidate` หรือ `@vueuse/form`
4. ถ้าใช้ Solid → `modular-forms`

### 3. Implement UX Patterns

เขียน form patterns

> Goal: ลด friction และ error

1. ใช้ floating labels หรือ clear labels
2. แสดง inline validation หลัง blur/change ไม่ใช่ทุก keystroke
3. ใช้ error messages ทีบอกสิ่งผิด, ทำไม, แก้ยังไง
4. ใช้ loading state บน submit button
5. ใช้ success/error feedback หลัง submit
6. รองรับ keyboard navigation และ focus management

### 4. Validate

ตรวจสอบ form UX

> Goal: ไม่มี a11y หรือ conversion issues

1. ทดสอบ keyboard-only flow
2. ตรวจสอบ screen reader อ่าน labels, errors
3. ตรวจสอบ error message clarity
4. ทำ `/validate` และ `/validate-workflow`
5. ถ้ามี issues → ทำ `/resolve-errors` แล้ว recheck

## Rules

### 1. Labels And Errors

- ทุก input มี label ชัดเจน
- error อยู่ใกล้ input ที่เกี่ยวข้อง
- error message บอกวิธีแก้

### 2. Validation Timing

- ไม่ validate ทุก keystroke
- validate on blur หรือ on submit
- แสดง inline feedback ทันทีเมื่อผิด

### 3. Accessibility

- ใช้ `aria-describedby` สำหรับ error messages
- ใช้ `aria-invalid` สำหรับ invalid input
- รองรับ keyboard navigation

## Expected Outcome

- Form UX ทีลด error และเพิ่ม completion rate
- ผ่าน lint, typecheck, a11y validation
- `SKILL.md` ไม่เกิน 250 บรรทัด
