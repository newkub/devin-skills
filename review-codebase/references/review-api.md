---
name: review-api
description: Review API handlers, middleware, rate limiting, validation, idempotency, documentation, endpoints
---

## Goal

Review API layer ครอบคลุม handlers, middleware, rate limiting, input validation, idempotency, documentation พร้อม review score

## Scope

API review สำหรับ: API handlers, endpoint patterns, middleware chains, rate limiting, input validation, Zod schema coverage, idempotency, API documentation, response format consistency, error handling, pagination, versioning

## Execute

### 1. Prepare And Scan

> Goal: เข้าใจ API structure และ framework

1. ทำ `/scan-codebase` เพื่อเข้าใจ API structure
2. ระบุ API framework, routing patterns, middleware system ที่ใช้
3. ถ้าเป็น web project → เพิ่ม `/run-dev` เพื่อ verify dev server

### 2. Deep Analyze

> Goal: ครอบคลุมทุก API dimension พร้อม review score

1. ทำ `/deep-analyze` เพื่อวิเคราะห์ API patterns
2. ทำ `/update-review-cli` — `/update-review-cli` เรียก `/update-rules` ภายในตัวเองเพื่ออัปเดต ast-grep rules
3. ถ้า `/update-review-cli` ข้าม `/update-rules` → ทำ `/update-rules` แยก
4. รัน `bunx ast-grep scan --inspect summary` เพื่อ verify rules ทำงานได้
5. ทำ `/run-review` เพื่อดึง metrics ล่าสุด

### 3. API Handlers And Endpoint Review

> Goal: ครอบคลุม handlers, endpoints, middleware

1. ตรวจสอบ API handlers: handler patterns, request/response typing, error handling, response format consistency, status code usage
2. ตรวจสอบ endpoint patterns: RESTful conventions, route naming, HTTP method usage, route grouping, nested routes
3. ตรวจสอบ middleware: middleware chains, order of execution, auth middleware, CORS config, logging middleware, error middleware
4. ตรวจสอบ rate limiting: rate limit configuration, per-endpoint limits, IP-based vs user-based, rate limit headers, 429 handling
5. ตรวจสอบ idempotency: idempotency key support, duplicate request handling, safe retries, idempotent write patterns
6. ตรวจสอบ API documentation: OpenAPI/Swagger spec, endpoint documentation, request/response examples, error code documentation
7. ตรวจสอบ pagination: pagination strategy (offset, cursor, keyset), page size limits, pagination metadata, total count accuracy
8. ตรวจสอบ versioning: API versioning strategy, backward compatibility, deprecation headers, sunset headers

### 4. Validate, Rate And Report

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
- ถ้า project ไม่มี middleware → ข้าม Step 3 item 3
- ถ้า project ไม่มี rate limiting → ข้าม Step 3 item 4
- ถ้า project ไม่มี pagination → ข้าม Step 3 item 7
- ถ้า project ไม่มี API versioning → ข้าม Step 3 item 8

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
