---
name: improve-frontend
description: แก้ไข frontend findings ด้าน components, state, rendering, type safety, CSS, forms
argument-hint: "[target-or-scope]"
related:
  - review-frontend
  - review-uxui
  - review-accessibility
  - review-performance
  - improve-uxui
  - improve-accessibility
  - optimize-rendering
  - resolve-errors
  - run-test
  - run-verify
  - report-table
  - suggest-next-action
---

## Goal

แก้ไข frontend findings จาก `/review-frontend` ครอบคลุม components, state management, rendering, type safety, CSS, forms, และ client-side logic

## Scope

ใช้กับ frontend code (React, Vue, Solid, Svelte, Angular, vanilla JS) — ไม่รวม UX/UI design ลึกหรือ backend (ใช้ `/improve-uxui`, `/improve-backend` แทน)

## Execute

### 1. Review Findings

> Goal: เข้าใจ frontend findings

1. อ่าน report จาก `/review-frontend`
2. แบ่ง findings ตาม area: components, state, rendering, types, CSS, forms
3. จัดลำดับตาม impact และ effort
4. ระบุ browser/responsive context ถ้ามี

### 2. Fix Components

> Goal: components ถูกต้องและ maintainable

1. แยก concerns ตาม SRP
2. ลด props drilling ถ้ามี
3. แก้ lifecycle issues
4. รัน component tests ถ้ามี

### 3. Fix State Management

> Goal: state ถูกต้องและ predictable

1. แก้ derived state ผิด
2. ปรับ state location ให้เหมาะสม
3. แก้ race conditions ใน async state
4. รัน state-related tests

### 4. Fix Rendering And Performance

> Goal: render ถูกต้องและ smooth

1. ทำ `/optimize-rendering` สำหรับ performance findings
2. แก้ unnecessary re-renders
3. ใช้ `key` ถูกต้อง
4. ตรวจจอภาพด้วย manual check หรือ screenshots

### 5. Fix Type Safety

> Goal: types บน frontend ปลอดภัย

1. แก้ unsafe type assertions
2. เพิ่ม narrowing/guards
3. ตรวจ `tsc` หรือ typecheck
4. รัน `run-verify`

### 6. Fix CSS And Forms

> Goal: UI แสดงถูกต้องและ forms ใช้งานได้

1. แก้ responsive/layout issues
2. แก้ CSS specificity ผิด
3. แก้ form validation, labels, error states
4. ตรวจ accessibility ด้วย `/improve-accessibility` ถ้ามี findings

### 7. Validate Frontend

> Goal: ยืนยัน frontend ทำงานได้

1. รัน `run-test`
2. รัน `run-verify`
3. ตรวจด้วย `agent-browser` หรือ `browser-preview` ถ้าเหมาะสม
4. รัน visual checks ถ้ามี

### 8. Report

> Goal: สรุปผล

1. ทำ `/report-table` สรุป fixes
2. ทำ `/review-frontend` อีกครั้งเพื่อ verify
3. ทำ `/suggest-next-action`

## Rules

### 1. Preserve UX

- ไม่เปลี่ยน user-facing behavior โดยไม่เจตนา
- ตรวจ responsive และ a11y หลังแก้

### 2. Minimal Refactor

- แก้เฉพาะ findings
- ไม่ rewrite components ทั้งหมดถ้าไม่จำเป็น

### 3. Test Evidence

- ทุก fix ควรมี test หรือ manual verification
- ใช้ screenshots ถ้าเป็น visual fix

### 4. Tooling

- รัน lint, typecheck, build ก่อน report ผ่าน

## Expected Outcome

- Components, state, rendering, types, CSS, forms ถูกต้อง
- `run-test` และ `run-verify` ผ่าน
- `/review-frontend` ไม่พบ issues เดิม
- รายงาน fixes พร้อม next action
