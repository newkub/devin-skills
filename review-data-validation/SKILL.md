---
name: review-data-validation
description: Review Zod schemas, input validation, output validation, data contracts, transformation safety, type coercion, null handling
---

## Goal

Review data validation ครอบคลุม schema validation, input/output validation, data contracts, transformation safety พร้อม health score

## Scope

data validation review สำหรับ: Zod schemas, input validation gaps, output validation, data contracts, transformation safety, type coercion, null handling, schema consistency across layers, validation error messages, sanitization

## Execute

### 1. Prepare And Scan

> Goal: เข้าใจ validation patterns และ schema library ที่ใช้

1. ทำ `/scan-codebase` เพื่อเข้าใจ validation structure
2. ระบุ validation library (Zod, Valibot, Yup, Joi), schema patterns, sanitization strategy ที่ใช้

### 2. Deep Analyze

> Goal: ครอบคลุมทุก validation dimension พร้อม health score

1. ทำ `/deep-analyze` เพื่อวิเคราะห์ validation patterns
2. ทำ `/update-codebase-health-cli` — `/update-codebase-health-cli` เรียก `/update-rules` ภายในตัวเองเพื่ออัปเดต ast-grep rules
3. ถ้า `/update-codebase-health-cli` ข้าม `/update-rules` → ทำ `/update-rules` แยก
4. รัน `bunx ast-grep scan --inspect summary` เพื่อ verify rules ทำงานได้
5. ทำ `/run-health` เพื่อดึง metrics ล่าสุด

### 3. Schema And Input Validation Review

> Goal: ครอบคลุม schema design และ input validation

1. ตรวจสอบ schema coverage: ทุก API endpoint มี input schema, ทุก form มี validation schema, ทุก external data source มี schema
2. ตรวจสอบ schema quality: field rules completeness, type constraints, string constraints (min/max/pattern), number constraints (min/max/integer), date constraints, enum values, optional vs required fields, default values
3. ตรวจสอบ input validation: request body validation, query params validation, path params validation, header validation, file upload validation, nested object validation, array validation
4. ตรวจสอบ validation error messages: error message quality, error message localization, error code system, field-level errors, error response format consistency

### 4. Output Validation And Data Contract Review

> Goal: ครอบคลุม output validation และ data contracts

1. ตรวจสอบ output validation: response schema validation, serialization safety, output type contracts, API response shape consistency
2. ตรวจสอบ data contracts: API-to-database mapping contracts, API-to-client mapping contracts, schema consistency across layers, contract testing
3. ตรวจสอบ transformation safety: type coercion risks, null handling in transformations, data loss in transformations, schema mismatch causing runtime error
4. ตรวจสอบ sanitization: HTML sanitization, SQL injection prevention, command injection prevention, path traversal prevention, XSS prevention
5. Critical: missing input validation on critical endpoint, data loss in transformation, schema mismatch causing runtime error, no sanitization on user input, SQL injection risk
6. High: missing schema on endpoint, inconsistent error format, missing output validation, missing contract test, incomplete field rules, missing sanitization

### 5. Validate, Rate And Report

> Goal: Issues ถูก validate และรายงานเป็นตาราง

1. ทำ `/deep-validate` เพื่อ validate findings
2. ทำ `/validate` สำหรับ validate issues จากทุก section
3. จัดลำดับตาม severity: Critical → High → Medium → Low
4. คำนวณ health score: (Critical=0, High=25, Medium=50, Low=75, Info=100) → weighted average
5. ทำ `/report` พร้อม `/report-format-table`
6. ทำ `/suggest-next-action`

## Rules

### 1. Skip Conditions

- ถ้า project ไม่มี API → ข้าม Step 3 item 3
- ถ้า project ไม่มี forms → ข้าม Step 3 item 2 สำหรับ form schemas
- ถ้า project ไม่มี external data sources → ข้าม Step 3 item 1 สำหรับ external data

### 2. Severity Classification

- Critical: missing input validation on critical endpoint, data loss in transformation, schema mismatch causing runtime error, no sanitization, SQL injection risk
- High: missing schema on endpoint, inconsistent error format, missing output validation, missing contract test, incomplete field rules
- Medium: suboptimal schema design, missing optional field handling, inconsistent error messages, missing localization
- Low: cosmetic, minor schema improvement, documentation gap

### 3. Evidence-Based Findings

- ทุก finding ต้องมี file path และ line number
- ระบุ schema, endpoint, หรือ data flow ที่เกี่ยวข้อง

### 4. Review Independence

- ทำ review เท่านั้น ไม่แก้ไข code ระหว่าง review

### 5. Formatting

- ห้ามใช้ `**` (bold markers) — ใช้ backticks สำหรับ emphasis
- รายงานเป็นตารางด้วย `/report-format-table`

## Expected Outcome

- รายงานตาราง aggregate findings จากทุก validation section
- Health score ต่อ dimension และ overall
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`
