---
name: improve-data-validation
description: ปรับปรุง data validation ใน API, forms, schemas ให้ครอบคลุม ปลอดภัย และ type-safe
argument-hint: "[schema-or-api-pattern]"
related:
  - deep-review
  - run-test
---

## Goal

ปรับปรุง data validation ใน API, forms, schemas ให้ครอบคลุม ปลอดภัย และ type-safe

## Scope

ใช้กับ backend, API routes, forms, database operations โดย audit validation logic และ implement ตาม standards

## Execute

### 1. Detect Validation Stack

> Goal: รู้ว่าใช้ validation library อะไร

1. ตรวจ `package.json` สำหรับ `zod`, `valibot`, `arktype`, `joi`, `class-validator`
2. ตรวจ schemas ใน `src/schemas`, `src/validations`
3. ตรวจ API routes สำหรับ input validation
4. ตรวจ forms สำหรับ client-side validation

### 2. Audit Validation Coverage

> Goal: หาช่องโหว่และ gaps

1. ตรวจ API endpoints ทีรับ input จาก client
2. ตรวจ database queries ทีใช้ user input
3. ตรวจ file uploads, date, email, URL validation
4. ตรวจ numeric ranges, string lengths, enum values
5. ระบุ endpoints ทีขาด validation

### 3. Implement Stronger Validation

> Goal: ปรับปรุง validation rules

1. ใช้ schema validation สำหรับทุก API input
2. Sanitize user input ก่อนใช้
3. Validate file type, size, mime type สำหรับ uploads
4. Validate IDs ว่าเป้น UUID/ulid ทีถูกต้อง
5. Validate date ranges และ timezone
6. Reject unexpected fields ด้วย `.strict()` หรือ `.passthrough()` ทีเหมาะสม

### 4. Add Security Validation

> Goal: ป้องกัน injection และ bypass

1. Validate auth tokens, session IDs
2. Validate permission scopes
3. Validate userId ไม่มาจาก client input
4. Sanitize HTML/JS สำหรับ rich text
5. Validate rate limit payload size

### 5. Validate And Test

> Goal: ยืนยันว่า validation ทำงาน

1. รัน `/run-test`
2. รัน `/run-test-coverage`
3. เพิ่ม test cases สำหรับ invalid inputs
4. ทำ `/deep-review` ถ้ามี security findings

## Rules

### 1. Schema First

- ทุก API input ต้องมี schema
- ใช้ type inference จาก schema
- ไม่ใช้ `any` สำหรับ external input

### 2. Fail Closed

- ถ้า validation ไม่ชัดเจน → reject
- ไม่ coerce โดยไม่ตั้งใจ
- ใช้ `.strict()` ถ้าไม่ต้องการ extra fields

### 3. Sanitize Early

- Sanitize ก่อน validation หรือหลังตาม framework
- ไม่ trust client input
- Trim whitespace สำหรับ strings

### 4. Error Messages

- ใช้ error messages ที user-friendly แต่ไม่ leak ข้อมูล
- ไม่ expose internal paths หรือ DB details
- ระบุ field ทีผิด

### 5. Test Edge Cases

- Test empty input, null, undefined
- Test oversized payloads
- Test invalid characters
- Test boundary values

## Expected Outcome

- ทุก API endpoint มี schema validation
- Input sanitization ครอบคลุม
- Test cases สำหรับ invalid inputs
- ลดความเสี่ยง injection และ bypass
- Build/test ผ่าน
