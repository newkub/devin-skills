---
name: improve-form
description: หา form improvements ใน scope — validation UX, states, errors, a11y — แก้ทันที
argument-hint: "[scope]"
related:
  - improve
  - improve-uxui
  - improve-data-validation
  - improve-web
  - deep-review
  - deep-review-then-fix
  - follow-tool-data-validation
  - report
  - suggest-next-action
  - ask-me
---

## Goal

ตอบคำถาม "form improve อะไรได้บ้าง" สำหรับ scope ที่ user ระบุ — รวม findings จาก `/deep-review` domains `review-frontend` + `review-data-validation` + `review-accessibility` เฉพาะ form surface เป็น prioritized list แล้วส่งต่อไปแก้ทันที

## Scope

ใช้เมื่อ user ถามว่า scope นี้ "forms ควร improve อะไร" — thin entry point ที่ delegate การ review ไป `/deep-review` ไม่ทำ review เองและไม่แก้ไขโดยตรง

- `review-frontend` — form state management, submission flow, pending/success/error states, dirty tracking, reset behavior
- `review-data-validation` — field validation rules, schema alignment กับ API payload, client/server parity, sanitization
- `review-accessibility` — labels, error announcements, focus management, keyboard flow, `aria-invalid`/`aria-describedby`
- validation ทั้งระบบ (ไม่ใช่แค่ form) → `/improve-data-validation`; form visual/UX design ทั่วไป → `/improve-uxui`

## Execute

### 1. Review

> Goal: ได้ prioritized findings

1. รับ `scope` จาก argument — ถ้าไม่มี → ใช้ project ปัจจุบัน ถ้าไม่ชัด → `/ask-me`
2. ทำ `/deep-review` กับ scope นั้น domains `review-frontend` + `review-data-validation` + `review-accessibility` — form states, validation UX, error messages, client/server validation parity, a11y
3. รวบรวม prioritized list พร้อม severity และ evidence

### 2. Present Findings

> Goal: แสดงผล findings ก่อนแก้

1. ทำ `/report` แสดง improvements: No., Finding, Severity, Fix Skill
2. ดำเนินการแก้ต่อทันที — ไม่รอ user confirm

### 3. Fix All Findings

> Goal: แก้ทุก finding ที่พบ

1. ส่งแต่ละ finding ไป `/deep-review-then-fix` (domain ที่ตรง)
2. Validation fixes ต้อง sync กับ server schema — ใช้ validator ของ project ผ่าน `/follow-tool-data-validation`
3. ทำ `/suggest-next-action` หลังแก้ครบ

## Rules

- ไม่ทำ review เอง — delegate ไป `/deep-review` domains `review-frontend` + `review-data-validation` + `review-accessibility`
- แก้ทุก finding ทันทีโดยไม่รอ confirm
- Client-side validation ไม่ใช่ security boundary — ทุก fix ต้องมี server-side validation เทียบกัน
- ทุก improvement ต้อง map ไปยัง skill ที่ทำได้จริง

## Expected Outcome

- Prioritized form improvement list จาก `/deep-review`
- ไม่มี confirm gate — แก้ทุก finding ทันที
- Findings ทั้งหมดถูกแก้ผ่าน `/deep-review-then-fix` พร้อม client/server validation parity
