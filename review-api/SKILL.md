---
name: review-api
description: ตรวจ API design — REST conventions, versioning, errors, auth, validation, docs
argument-hint: "[endpoint-or-scope]"
related:
  - improve-api
  - review-backend
  - review-security
  - run-test-api
  - deep-review
  - report-table
  - check-reference
---

## Goal

ตรวจสอบ API design — REST/resource conventions, versioning, error handling, authn/authz, input validation, response formats และ documentation ก่อนแก้ไขด้วย `/improve-api`

## Scope

ใช้เมื่อต้อง review API surface ของ project: REST, GraphQL, RPC (เช่น oRPC/tRPC) — ครอบคลุม contract, consistency และ security posture — ไม่แก้ไข implementation (ใช้ `/improve-api`)

## Execute

### 1. Discover API Surface

> Goal: รวบรวม endpoints และ API style ทั้งหมด

1. ทำ `/scan-codebase` หา routes, handlers, resolvers และ API schemas
2. ระบุ style: REST, GraphQL, RPC และ versioning approach
3. แสดงรายการ endpoints พร้อม method, path และ auth requirement

### 2. Review Conventions

> Goal: API เป็นไปตาม conventions อย่างสม่ำเสมอ

1. ตรวจ resource naming, HTTP methods และ status codes
2. ตรวจ consistency: pagination, filtering, sorting, error format
3. ตรวจ versioning strategy และ backward compatibility

### 3. Review Validation And Errors

> Goal: input validation และ error responses ครบถ้วน

1. ตรวจ input validation ทุก endpoint (schema validation)
2. ตรวจ error responses: consistent shape, ไม่รั่ว stack traces/secrets
3. ตรวจ rate limiting และ request size limits

### 4. Review Auth And Docs

> Goal: authn/authz และ documentation ครบ

1. ตรวจ authn/authz ครอบคลุมทุก endpoint ที่ต้องการ
2. ตรวจ API docs (OpenAPI/Swagger/schema introspection) ตรงกับ implementation
3. ทำ `/check-reference` สำหรับ docs ที่อ้าง endpoints

### 5. Rate And Report

> Goal: สรุป findings พร้อม severity และ fix direction

1. ทำ `/report-table` พร้อม columns: No., Endpoint, Severity, Finding, Evidence, Fix
2. ชี้ไป `/improve-api` สำหรับการแก้ไข
3. ถ้า security findings เสี่ยงสูง → เชื่อม `/review-security` และ `/improve-security`

## Rules

### 1. Contract First

- ประเมินจาก contract ที่ client เห็น ไม่ใช่แค่ implementation
- ทุก finding ต้องมี endpoint, method และ evidence

### 2. Non-Destructive

- ใช้ read-only calls (GET) เมื่อทดสอบ live endpoints
- ห้ามเรียก mutating endpoints บน production

### 3. Consistency Over Preference

- ตัดสินตาม existing conventions ของ project ไม่บังคับ style ใหม่
- ถ้า project ไม่มี convention → อ้างอิง standard ที่กำหนดใน findings

- ใช้ /review-backend ถ้าจำเป็น
- ใช้ /run-test-api ถ้าจำเป็น
- ใช้ /deep-review ถ้าจำเป็น

## Expected Outcome

- รายงาน API findings ครอบคลุม conventions, validation, errors, auth, docs
- ทุก finding มี endpoint evidence และ severity
- next action ชัดเจนผ่าน `/improve-api`
