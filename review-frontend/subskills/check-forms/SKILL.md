---
name: review-frontend-check-forms
description: Check forms + error handling — validation, submit states, accessibility, UX
argument-hint: "[scope]"
related:
  - review-frontend
  - review-accessibility
  - report
---

## Goal

Run the forms + error handling dimension of `/review-frontend` แบบ focused — forms ปลอดภัย validate ถูกที่ และ UX states ครบ

## Scope

- ใช้เมื่อ `/review-frontend` dispatch มาที่ `forms`/`errors` หรือเรียก standalone
- ครอบคลุม: validation (client+server boundary), submit states (loading/error/success), error boundaries, form accessibility

## Execute

### 1. Form Checks

> Goal: forms ทำงานถูกและปลอดภัย

ทำตาม `../../subagents/frontend-reviewer/forms.md`

1. validation — schema at boundary, client validation ไม่ใช่ source of truth (server validates ซ้ำ)
2. submit states — loading disable, error display, success feedback, double-submit prevention
3. accessibility — labels ผูก inputs, error announced (`aria-invalid`/`aria-describedby`), focus ไป error แรก
4. controlled vs uncontrolled consistency, defaultValues/dirty tracking

### 2. Error Handling Checks

> Goal: errors ถูกจับและแสดงถูกต้อง

1. error boundaries ครบ critical sections — ไม่ white-screen ทั้ง app
2. async errors — rejected promises handled, retry affordances
3. error messages — บอกสาเหตุ + ทำอะไรต่อ ไม่ leak internals

### 3. Report

> Goal: findings พร้อม severity

ทำ `/report` ตาราง: `No.`, `Form/Component`, `Severity`, `Finding`, `Evidence`, `Fix`

## Rules

- Review เท่านั้น — fix ใน parent `## Fix`
- ทุก finding มี file path + line
- missing server-side validation บน mutation = High; UX-only issues = Medium-Low

## Expected Outcome

- Form findings แยก validation/submit-states/a11y
- Error-handling gaps พร้อม affected flows
