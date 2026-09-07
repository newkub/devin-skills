---
name: check-api-contract
description: เทียบ API implementation กับ OpenAPI spec หา endpoints, fields และ types ที่ drift
argument-hint: "[spec-file-or-url]"
related:
  - gen-openapi
  - review-api
  - report
---

## Goal

ตรวจว่า API implementation ตรงกับ OpenAPI spec — หา endpoints ที่ implement แต่ไม่มีใน spec, spec มีแต่ไม่ได้ implement, และ response/field types ที่ไม่ตรงกัน

## Scope

- ตรวจ repo ที่มี OpenAPI spec (`openapi.yaml`, `swagger.json`) หรือ generate ผ่าน `/gen-openapi` ก่อน
- เทียบ routes/handlers ใน code กับ paths ใน spec — ทั้ง method, path, params, request/response schema
- Read-only: รายงาน drift — ไม่แก้ spec หรือ code

## Execute

### 1. Locate Spec And Implementation

> Goal: หา spec file และ source of truth ของ routes

1. หา OpenAPI spec: `openapi.*`, `swagger.*`, `docs/*.yaml`
2. ถ้าไม่มี spec → ทำ `/gen-openapi` เพื่อ generate จาก code ก่อน หรือถาม user ว่า spec คือ source of truth ไหม
3. หา route definitions ใน code ตาม framework (Elysia, Express, Fastify, Hono, Next.js routes)

### 2. Compare Endpoints

> Goal: หา paths/methods ที่ต่างกัน

1. Extract paths + methods จาก spec
2. Extract routes + handlers จาก code (ใช้ `use-astgrep` หรือ framework-specific patterns)
3. flag:
   - `spec-only`: spec มีแต่ไม่ implement
   - `code-only`: implement แต่ไม่มีใน spec (undocumented endpoint)
   - `method-mismatch`: path เดียวกันแต่ methods ต่างกัน

### 3. Compare Schemas

> Goal: เทียบ request/response fields ต่อ endpoint

1. เทียบ request body schema กับ validation ใน code (zod, arktype, class-validator)
2. เทียบ response schema กับ return type หรือ serializer
3. flag: fields ขาด, type ต่าง, required ต่าง, enum values ไม่ตรง
4. ถ้าเป็น type-safe framework (tRPC, orpc) → flag ว่า spec อาจ generated และตรวจแค่ version drift

### 4. Report

> Goal: สรุป contract drift แยกตาม severity

1. ใช้ `/report` คอลัมน์: `No.`, `Endpoint`, `Drift Type`, `Spec`, `Code`, `Severity`
2. Severity: `critical` (spec-only, response shape ต่าง), `high` (code-only, required field ต่าง), `medium` (optional field ต่าง)
3. แนะนำ `/gen-openapi` regenerate หรือ `/review-api` สำหรับ fix

## Rules

### 1. Evidence-Based

- ทุก drift ต้องระบุ spec location และ code location
- ระบุว่า spec หรือ code เป็น source of truth ตามที่ project กำหนด

### 2. Read-Only

- ไม่แก้ spec หรือ code — รายงาน drift แล้วให้ `/gen-openapi` หรือ `/review-api` แก้

### 3. Context Aware

- Internal/admin endpoints อาจตั้งใจไม่ใส่ spec — flag เป็น info ไม่ใช่ violation
- Generated spec ให้ตรวจเฉพาะว่า spec ล่าสุดหรือไม่ ไม่ตรวจ field-level

## Expected Outcome

- รายการ endpoints ที่ spec กับ code ไม่ตรง พร้อมประเภท drift
- Field-level mismatches สำหรับ request/response schemas
- คำแนะนำว่าควร update spec หรือ fix code
