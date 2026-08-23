---
name: review-api
description: Review API design, versioning, docs, errors, and rate limiting
related:
  - scan-codebase
  - deep-analyze
  - update-create-review-cli
  - update-rules
  - run-review
  - deep-validate
  - validate
  - report
  - report-table
  - suggest-next-action

---


## Goal

Review API layer ครอบคลุม design, versioning, documentation, errors, rate limiting, and endpoint consistency พร้อม review score

## Scope

API review สำหรับ: API design, endpoint patterns, HTTP methods, RESTful conventions, versioning, documentation, error handling, rate limiting, input validation, response format consistency

## Execute

### 1. Analyze

> Goal: เข้าใจ API structure และ framework

1. ทำ `/scan-codebase` เพื่อเข้าใจ API structure
2. ระบุ API framework, routing patterns, middleware system ที่ใช้
3. ถ้าเป็น web project → เพิ่ม `/run-dev` เพื่อ verify dev server
4. ทำ `/deep-analyze` เพื่อวิเคราะห์ API patterns
5. ทำ `/update-create-review-cli` — `/update-create-review-cli` เรียก `/update-rules` ภายในตัวเองเพื่ออัปเดต ast-grep rules
6. ถ้า `/update-create-review-cli` ข้าม `/update-rules` → ทำ `/update-rules` แยก
7. รัน `bunx ast-grep scan --inspect summary` เพื่อ verify rules ทำงานได้
8. ทำ `/run-review` เพื่อดึง metrics ล่าสุด

### 2. Review

> Goal: ตรวจสอบ API checklist ครอบคลุม API design, versioning, docs, errors, rate limiting

1. ตรวจสอบ API design:
   - ตรวจสอบ API handlers: handler patterns, request/response typing, response format consistency, status code usage
   - ตรวจสอบ endpoint patterns: RESTful conventions, route naming, HTTP method usage, route grouping, nested routes
   - ตรวจสอบ middleware: middleware chains, order of execution, auth middleware, CORS config, logging middleware, error middleware
   - ตรวจสอบ input validation และ idempotency: input validation coverage, Zod schema coverage, idempotency key support, duplicate request handling, safe retries, idempotent write patterns
   - ตรวจสอบ pagination: pagination strategy (offset, cursor, keyset), page size limits, pagination metadata, total count accuracy
2. ตรวจสอบ versioning:
   - API versioning strategy, backward compatibility, deprecation headers, sunset headers
3. ตรวจสอบ docs:
   - OpenAPI/Swagger spec, endpoint documentation, request/response examples, error code documentation
4. ตรวจสอบ errors:
   - error middleware, error response format, status code usage, safe error messages
5. ตรวจสอบ rate limiting:
   - rate limit configuration, per-endpoint limits, IP-based vs user-based, rate limit headers, 429 handling

### 3. Validate and Report

> Goal: Issues ถูก validate และรายงานเป็นตาราง

1. ทำ `/deep-validate` เพื่อ validate findings
2. ทำ `/validate` สำหรับ validate issues จากทุก section
3. จัดลำดับตาม severity: Critical → High → Medium → Low
4. คำนวณ review score: (Critical=0, High=25, Medium=50, Low=75, Info=100) → weighted average
5. ทำ `/report` พร้อม `/report-table`
6. ทำ `/suggest-next-action`

## Rules

### 1. Skip Conditions

- ถ้า project ไม่มี API layer → ข้ามทั้งหมด
- ถ้า project ไม่มี dimension ใดใน Review step → ข้าม dimension นั้น
- ถ้า project ไม่มี middleware → ข้าม Review step 1 ส่วน middleware
- ถ้า project ไม่มี rate limiting → ข้าม Review step 5
- ถ้า project ไม่มี pagination → ข้าม Review step 1 ส่วน pagination
- ถ้า project ไม่มี API versioning → ข้าม Review step 2

### 2. Severity Classification

- Critical: unauthenticated endpoint, missing input validation, data corruption risk, no error handling on critical path, broken endpoint
- High: missing rate limiting, inconsistent response format, missing idempotency, missing pagination, no API documentation
- Medium: inconsistent endpoint naming, missing middleware, suboptimal pagination, missing versioning
- Low: cosmetic, documentation gap, minor naming

### 3. Evidence-Based Findings

- ทุก finding ต้องมี file path และ line number
- ระบุ endpoint, HTTP method, และ handler ที่เกี่ยวข้อง

### 4. Review Independence

- ทำ review เท่านั้น ไม่แก้ไข code ระหว่าง review

### 5. Formatting

- ห้ามใช้ `**` (bold markers) — ใช้ backticks สำหรับ emphasis
- รายงานเป็นตารางด้วย `/report-table`

## Expected Outcome

- รายงานตาราง aggregate findings จากทุก API section
- Review score ต่อ dimension และ overall
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`
