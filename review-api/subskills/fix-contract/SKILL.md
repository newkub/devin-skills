---
name: review-api-fix-contract
description: Fix API contract drift — schema vs implementation, response shape, docs sync
argument-hint: "[scope-or-findings]"
related:
  - review-api
  - check-api-contract
  - check-backward-compatibility
  - check-reference
  - run-test

  - report
  - resolve-errors
---

## Goal

แก้ contract drift findings จาก `/review-api` — schema/spec กับ implementation ไม่ตรง, request/response shape drift, error format ไม่ consistent, docs ไม่ตรงกับ behavior จริง

## Scope

- ใช้กับ REST, GraphQL, RPC (oRPC/tRPC), Hono, Express
- ครอบคลุม: OpenAPI/spec vs handlers, schema validation coverage, response shape consistency, error format, docs/endpoint sync
- ไม่ครอบคลุม versioning strategy → ใช้ `subskills/fix-versioning/SKILL.md`

## Execute

### 1. Map Contract Drift

> Goal: รู้ว่า spec, schema และ implementation ต่างกันตรงไหน

1. ทำ `/check-api-contract` เพื่อ diff spec vs implementation — เก็บ drift list ต่อ endpoint
2. ตรวจ route files ใน `src/routes`, `src/server`, `src/api` เทียบกับ OpenAPI/schema definitions
3. จัดกลุ่ม drift: missing endpoint in spec, field mismatch, status code mismatch, error shape ต่าง
4. ตัดสินแต่ละ drift ว่า spec ถูกหรือ implementation ถูก — ยึด contract ที่ client ใช้อยู่จริง

### 2. Fix Implementation To Match Contract

> Goal: behavior ตรงกับ contract ที่ประกาศ

1. เพิ่ม schema validation ที่ boundary ทุก endpoint — 4xx พร้อม field-level errors เมื่อ input ไม่ผ่าน
2. แก้ response fields/status codes ที่ drift — preserve shape ที่ client พึ่งพาอยู่
3. รวม error response เป็น format เดียวทั้ง API — มี `requestId`/`traceId`, ไม่ leak stack traces/secrets

### 3. Fix Spec And Docs To Match Implementation

> Goal: contract สะท้อน reality เมื่อ implementation คือสิ่งที่ถูก

1. อัปเดต OpenAPI/spec/schema ให้ตรง implementation ที่ยืนยันแล้ว
2. ทำ `/check-reference` สำหรับ docs ที่อ้าง endpoints — แก้ docs ที่ล้าหลัง
3. ถ้าเป็น breaking change → ห้ามแก้ตรงๆ ให้ไปทาง `subskills/fix-versioning/SKILL.md`

### 4. Verify

> Goal: contract และ implementation ตรงกัน ไม่มี regression

1. ทำ `/check-api-contract` ซ้ำ — diff ต้องเหลือเฉพาะ intended changes
2. รัน `/run-test` (api) และ `/run-test` — tests ผ่านครบ
3. ทำ `/check-backward-compatibility` — client เดิมต้องไม่พัง

## Rules

- ประเมินจาก contract ที่ client เห็น ไม่ใช่แค่ implementation
- ทุก fix ต้องมี endpoint, method และ evidence — ห้ามเดา
- ไม่เปลี่ยน response format โดยไม่ versioning — breaking change ต้องผ่าน versioning flow
- ใช้ read-only calls (GET) เมื่อทดสอบ live endpoints — ห้ามเรียก mutating endpoints บน production
- ถ้า check ไม่ผ่าน → `/resolve-errors` สูงสุด 3 รอบแล้ว report

## Expected Outcome

- Spec, schema และ implementation ตรงกัน — contract diff เหลือเฉพาะ intended changes
- Error format เดียวทั้ง API พร้อม trace id — docs sync กับ behavior
- Tests ผ่านและ backward compatibility ไม่พัง — รายงานผ่าน `/report`

