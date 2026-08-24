---
name: review-form
description: Review form validation, field rules, error messages, state, submit, loading, accessibility, UX
---

## Goal

Review forms ครอบคลุม validation, state management, submit handling, accessibility, UX พร้อม review score

## Scope

form review สำหรับ: validation schemas, field rules, error message quality, form state management, submit handling, loading states, field accessibility, label association, keyboard navigation, form UX (inline validation, error display, success feedback), form library usage, multi-step forms, file upload forms, dynamic forms

## Execute

### 1. Prepare And Scan

> Goal: เข้าใจ form structure และ validation library

1. ทำ `/scan-codebase` เพื่อเข้าใจ form structure
2. ระบุ form library (TanStack Form, VeeValidate, React Hook Form, Formik), validation library (Zod, Valibot, Yup), form patterns ที่ใช้
3. ถ้า project ไม่มี forms → stop และ report

### 2. Deep Analyze

> Goal: ครอบคลุมทุก form dimension พร้อม review score

1. ทำ `/deep-analyze` เพื่อวิเคราะห์ form patterns
2. ทำ `/update-create-review-cli` — เรียก `/update-rules` ภายในตัวเองเพื่ออัปเดต `ast-grep` rules
3. ถ้า `/update-create-review-cli` ข้าม `/update-rules` → ทำ `/update-rules` แยก
4. รัน `bunx ast-grep scan --inspect summary` เพื่อ verify rules ทำงานได้
5. ทำ `/run-review` เพื่อดึง metrics ล่าสุด

### 3. Validation And Field Rules Review

> Goal: ครอบคลุม validation schemas, field rules, error messages

1. ตรวจสอบ validation schemas: schema completeness, field rule coverage, required vs optional, min/max length, pattern validation, email validation, phone validation, URL validation, date validation, custom validation rules
2. ตรวจสอบ field rules: real-time validation, blur validation, submit validation, debounce validation, conditional validation, cross-field validation (password confirm), dependent field validation
3. ตรวจสอบ error message quality: error message clarity, error message localization, error message specificity, field-level vs form-level errors, error display timing, error display position
4. ตรวจสอบ validation UX: inline validation timing, error display on blur vs on change, success feedback, error clearing on input, error focus management

### 4. Form State, Submit And Accessibility Review

> Goal: ครอบคลุม form state, submit, loading, accessibility

1. ตรวจสอบ form state management: form state initialization, form state reset, dirty state tracking, pristine vs dirty, form values vs touched, form submission state (idle, submitting, success, error)
2. ตรวจสอบ submit handling: submit handler error handling, submit loading state, submit success feedback, submit error feedback, duplicate submit prevention, submit on enter, submit button state
3. ตรวจสอบ loading states: submit button loading indicator, field-level loading, form-level loading, disabled state during submit, skeleton for async data
4. ตรวจสอบ form accessibility: label association (for/id), aria-invalid, aria-describedby, error message association, keyboard navigation, tab order, focus management on error, screen reader announcements
5. ตรวจสอบ multi-step forms: step validation, step navigation, step state preservation, progress indicator, back button handling, step completion feedback
6. ตรวจสอบ dynamic forms: dynamic field add/remove, field array validation, dynamic field naming, dynamic field rendering, conditional field display

### 5. Validate, Rate And Report

> Goal: Issues ถูก validate และรายงานเป็นตาราง

1. ทำ `/deep-validate` เพื่อ validate findings
2. ทำ `/validate` สำหรับ validate issues จากทุก section
3. จัดลำดับตาม severity: Critical → High → Medium → Low
4. คำนวณ review score: (Critical=0, High=25, Medium=50, Low=75, Info=100) → weighted average
5. ทำ `/report` พร้อม `/report-table`
6. ทำ `/suggest-next-action`

## Rules

### 1. Skip Conditions

- ถ้า project ไม่มี forms → ข้ามทั้งหมด
- ถ้า project ไม่มี multi-step forms → ข้าม Step 4 item 5
- ถ้า project ไม่มี dynamic forms → ข้าม Step 4 item 6
- ถ้า project ไม่มี file upload forms → ข้าม file upload form checks

### 2. Severity Classification

- Critical: missing validation on critical field, no submit error handling, validation bypass ที่ก่อให้เกิด error, inaccessible form, keyboard trap, no screen reader support, missing label association, submit error ที่ไม่ handle ทำให้ UI พัง
- High: missing validation schema, incomplete field rules, poor error messages, missing inline validation, missing loading state, missing keyboard navigation, missing ARIA, broken focus management, missing duplicate submit prevention
- Medium: suboptimal validation timing, minor accessibility gap, missing success feedback, inconsistent error display, missing form reset
- Low: cosmetic, minor form improvement, documentation gap

### 3. Evidence-Based Findings

- ทุก finding ต้องมี file path และ line number
- ระบุ form, field, validation rule, หรือ handler ที่เกี่ยวข้อง

### 4. Review Independence

- ทำ review เท่านั้น ไม่แก้ไข code ระหว่าง review

### 5. Formatting

- ห้ามใช้ `**` (bold markers) — ใช้ backticks สำหรับ emphasis
- รายงานเป็นตารางด้วย `/report-table`

## Expected Outcome

- รายงานตาราง aggregate findings จากทุก form section
- Review score ต่อ dimension และ overall
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`
