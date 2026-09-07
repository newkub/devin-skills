---
name: review-data-validation
description: ตรวจสอบ data validation ใน API, forms, schemas ว่าครอบคลุม, ปลอดภัย และ type-safe หรือไม่
argument-hint: "[schema-or-api-pattern]"
related:  - scan-codebase
  - report-table
  - review-security
---

## Goal

ตรวจสอบ data validation ใน API, forms, schemas ว่าครอบคลุม, ปลอดภัย และ type-safe หรือไม่ ก่อนส่งต่อไปยัง section `## Fix`

## Scope

ใช้กับ backend, API routes, forms, database operations โดย audit validation logic โดยไม่แก้ไข code

## Execute

### 1. Discover Validation Stack

> Goal: รู้ว่าใช้ validation library อะไร

1. ทำ `/scan-codebase` หา schemas, validation files และ `package.json` สำหรับ `zod`, `valibot`, `arktype`, `joi`, `class-validator`
2. ตรวจ schemas ใน `src/schemas`, `src/validations`
3. ตรวจ API routes สำหรับ input validation
4. ตรวจ forms สำหรับ client-side validation

### 2. Review Validation Coverage

> Goal: หาช่องโหว่และ gaps

1. ตรวจ API endpoints ทีรับ input จาก client
2. ตรวจ database queries ทีใช้ user input
3. ตรวจ file uploads, date, email, URL validation
4. ตรวจ numeric ranges, string lengths, enum values
5. ระบุ endpoints ทีขาด validation

### 3. Review Security And Type Safety

> Goal: ประเมินความปลอดภัย

1. ตรวจ strict/passthrough modes (`strict()`, `strip()`)
2. ระบุ SQL injection, XSS, NoSQL injection risks
3. ตรวจ type coercion และ unsafe defaults
4. ตรวจ error messages ที leak sensitive data

### 4. Rate And Report

> Goal: สรุป findings พร้อม fix direction

1. ทำ `/report-table` ด้วย columns: No., Endpoint/Form, Issue, Severity, Fix
2. ชี้ไป section `## Fix` สำหรับการแก้ไข
3. ถ้ามี security risk สูง → เชื่อม `/review-security`

## Rules

### 1. Read Only

- ห้ามแก้ไข schemas หรือ validation rules ระหว่าง review
- ห้ามรัน queries หรือ submit ข้อมูลจริง

### 2. Evidence Required

- ทุก finding ต้องอ้างอิง schema file/line หรือ API route
- ระบุ severity ตาม impact (data leak, injection, crash)

## Fix

> ทำ section นี้เฉพาะเมื่อ user confirm ให้แก้ findings หลังรายงาน — ข้ามถ้า scope เป็น review/report-only เช่นถูก dispatch จาก `/deep-review-codebase` หรือ `/follow-review`

Merged from: improve-data-validation

1. จัดลำดับ findings ตาม severity — critical ก่อน แล้วแก้ทีละรายการพร้อม verify ทันทีหลังแก้
2. เลือก fix guide ที่ตรงกับ finding จากรายการด้านล่าง
3. ทุก fix ต้องรักษา behavior เดิม ผ่าน `/run-check` และ `/run-test` ถ้ามี แล้วสรุปผลด้วย `/report-before-after`

- `references/fix-improve-data-validation.md` — ปรับปรุง data validation ใน API, forms, schemas ให้ครอบคลุม ปลอดภัย และ type-safe
## Expected Outcome

- รายงาน findings ครอบคลุม coverage, security, type safety
- ทุก finding มี evidence และ severity
- next action ชัดเจนผ่าน section `## Fix`
