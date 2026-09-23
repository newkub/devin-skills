# Form Validation And UX Checks

## Validation Schemas

- schema completeness: ครอบคลุมทุก field
- field rule coverage: required vs optional, min/max length, pattern, email, phone, URL, date, custom rules
- validation library usage: Zod, Valibot, Yup — ใช้ schema แทน manual validation

## Field Rules

- real-time validation: validate ขณะพิมพ์ สำหรับ instant feedback
- blur validation: validate ตอน blur สำหรับ less disruptive
- submit validation: validate ทุก field ตอน submit
- debounce validation: debounce สำหรับ async validation
- conditional validation: validate ตามเงื่อนไข field อื่น
- cross-field validation: password confirm, date range, dependent fields

## Error Message Quality

- error message clarity: ชัดเจน อ่านเข้าใจ
- error message localization: รองรับหลายภาษา
- error message specificity: ระบุ field และเหตุผล
- field-level vs form-level errors: แยก error ระดับ field และ form
- error display timing: แสดงตอนที่เหมาะสม (blur, change, submit)
- error display position: ใกล้ field ที่เกี่ยวข้อง

## Validation UX

- inline validation timing: ไม่ validate เร็วเกินไป ก่อน user พิมพ์เสร็จ
- error display on blur vs on change: blur สำหรับ first error, change สำหรับ clear error
- success feedback: แสดงเมื่อ field valid
- error clearing on input: clear error เมื่อ user เริ่มแก้ไข
- error focus management: focus ไปยัง first error field ตอน submit

## Form State Management

- form state initialization: initial values ถูกต้อง
- form state reset: reset ได้สะอาด
- dirty state tracking: pristine vs dirty
- form values vs touched: แยก values และ touched state
- form submission state: idle, submitting, success, error

## Submit Handling

- submit handler error handling: catch errors, ไม่ปล่อย unhandled
- submit loading state: disable button, show indicator
- submit success feedback: toast, redirect, message
- submit error feedback: แสดง error ชัดเจน
- duplicate submit prevention: disable ระหว่าง submitting
- submit on enter: รองรับ enter key
- submit button state: disabled เมื่อ invalid

## Loading States

- submit button loading indicator: spinner หรือ text change
- field-level loading: สำหรับ async field validation
- form-level loading: overlay หรือ skeleton
- disabled state during submit: ป้องกัน interaction
- skeleton for async data: สำหรับ form ที่โหลด data

## Form Accessibility

- label association: `for`/`id` pairing
- `aria-invalid`: ระบุ field ที่ invalid
- `aria-describedby`: เชื่อม error message
- error message association: `role="alert"` สำหรับ error
- keyboard navigation: tab order logical
- focus management on error: focus first error field
- screen reader announcements: announce validation errors

## Multi-step Forms

- step validation: validate ก่อนไป step ถัดไป
- step navigation: next/back, ไม่ข้าม step
- step state preservation: preserve state ระหว่าง steps
- progress indicator: แสดง progress ชัดเจน
- back button handling: กลับได้โดยไม่สูญเสีย data

## Dynamic Forms

- dynamic field add/remove: add/remove field runtime
- field array validation: validate dynamic fields
- dynamic field naming: unique naming
- dynamic field rendering: render ตาม condition
- conditional field display: show/hide ตามเงื่อนไข

## Severity Reference

- Critical: missing validation on critical field, no submit error handling, validation bypass ที่ก่อให้เกิด error, inaccessible form, keyboard trap, no screen reader support, missing label association, submit error ที่ไม่ handle ทำให้ UI พัง
- High: missing validation schema, incomplete field rules, poor error messages, missing inline validation, missing loading state, missing keyboard navigation, missing ARIA, broken focus management, missing duplicate submit prevention
- Medium: suboptimal validation timing, minor accessibility gap, missing success feedback, inconsistent error display, missing form reset
- Low: cosmetic, minor form improvement, documentation gap
