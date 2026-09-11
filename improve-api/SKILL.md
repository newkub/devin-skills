---
name: improve-api
description: Apply API fixes จาก review-api findings — validation, errors, versioning, pagination, rate limits
argument-hint: "[scope]"
related:
  - review-api
  - check-api-contract
  - check-api-versioning
  - deep-thinking
  - use-subagents
  - run-check
  - run-test
  - report
  - suggest-next-action
---

## Goal

แก้ API issues ที่ `/review-api` พบ — input validation, error format, versioning, pagination, rate limiting, response consistency — โดยไม่ break existing consumers

## Scope

ใช้หลัง `/review-api` มี findings หรือเมื่อต้องการ API hardening pass — apply fixes ไม่ใช่ report-only

- ถ้า contract เปลี่ยน → ตรวจ `/check-api-contract` ก่อนและหลัง
- ถ้า versioning เกี่ยวข้อง → `/check-api-versioning`
- ถ้า scope ใหญ่หลาย endpoints → dispatch ผ่าน `/use-subagents`

## Execute

### 1. Collect Findings

> Goal: รู้ว่าต้องแก้อะไร

1. ทำ `/review-api` หรืออ่าน findings เดิม
2. จัดกลุ่ม: validation, errors, consistency, versioning, pagination, security, docs
3. map findings → endpoints/handlers ที่ต้องแก้

### 2. Fix Input Validation

> Goal: ทุก input ผ่าน schema validation

1. ทุก endpoint validate body/params/query ด้วย schema (zod/valibot/pydantic ตาม stack)
2. validation errors คืน 4xx พร้อม field-level messages
3. ห้าม trust client input — sanitize ก่อนเข้า business logic

### 3. Fix Error Format

> Goal: errors consistent และ debug ได้

1. error response format เดียวทั้ง API — `{ error: { code, message, details? } }` หรือตาม convention ที่มี
2. status codes ถูกต้อง — 400 validation, 401 auth, 403 forbidden, 404 not found, 409 conflict, 5xx server
3. ห้าม leak stack traces/internal details ใน production errors

### 4. Fix Consistency And Versioning

> Goal: API surface สม่ำเสมอ

1. naming conventions เดียวกัน — casing, plurals, resource paths
2. breaking changes → version strategy ตาม `/check-api-versioning` — ไม่ break consumers โดยไม่บอก
3. deprecated fields/endpoints → ระบุ deprecation + sunset ไม่ลบทิ้งทันที

### 5. Fix Pagination And Limits

> Goal: list endpoints scale ได้

1. list endpoints ต้องมี pagination — cursor สำหรับ data ใหญ่, offset สำหรับเล็ก
2. page size limits + defaults ที่สมเหตุสมผล
3. rate limiting บน public/auth endpoints ตาม findings

### 6. Verify

> Goal: ไม่ break consumers

1. `/check-api-contract` — contract diff ต้องมีแค่ intended changes
2. `/run-test` — API tests ผ่าน, เพิ่ม tests สำหรับ fixes ใหม่
3. `/run-check` lint/typecheck ผ่าน

### 7. Report

> Goal: ส่งมอบ

1. ทำ `/report` — fixes per category, endpoints touched, contract changes
2. ทำ `/suggest-next-action`

## Rules

### 1. Backward Compatibility

- ห้าม break existing consumers โดยไม่มี versioning/deprecation plan
- additive changes ก่อน — remove/rename ต้องผ่าน deprecation cycle

### 2. Validate At Boundary

- validation อยู่ที่ API boundary เท่านั้น — ห้าม scatter checks ใน business logic
- error format เดียวทั้ง API — ห้าม per-endpoint error shapes

### 3. No Secret Leakage

- error responses ห้ามมี stack traces, internal paths, secrets
- review fixes ผ่าน `/deep-thinking` ถ้ามี trade-off กับ consumers เดิม

## Expected Outcome

- validation ครบทุก endpoint พร้อม 4xx errors ที่ถูกต้อง
- error format consistent, no internal leakage
- pagination/limits ครบ, contract diff มีแค่ intended changes
- tests ผ่านพร้อม coverage ของ fixes ใหม่
