---
name: run-test-contract
description: รัน contract testing ข้าม services — consumer-driven contracts ยืนยันทั้งสองฝั่งตรงกัน
argument-hint: "[consumer-or-provider]"
related:
  - check-api-contract
  - gen-openapi
  - report
---

## Goal

ทดสอบว่า service contracts ตรงกันทั้งสองฝั่ง — consumer expectations vs provider implementation — โดยไม่ต้อง deploy ทั้งคู่พร้อมกัน (contract testing / Pact-style)

## Scope

- ใช้เมื่อมีหลาย services ที่คุยกัน: microservices, frontend-backend, provider-consumer APIs
- ครอบคลุม: contract definition, consumer tests, provider verification, contract drift detection
- ใช้ tools ตาม stack: Pact, OpenAPI-based validation, หรือ schema comparison

## Execute

### 1. Identify Contracts

> Goal: map คู่ consumer-provider ที่ต้อง test

1. หา service boundaries: API calls ข้าม service, event schemas, shared types
2. ระบุ contract artifacts ที่มี: OpenAPI specs, shared types, Pact files
3. ถ้าไม่มี contract → ทำ `/gen-openapi` หรือ extract expectations จาก consumer code ก่อน

### 2. Capture Consumer Expectations

> Goal: บันทึกว่า consumer คาดหวังอะไร

1. Extract request/response expectations จาก consumer code — fields ที่ใช้จริง, required fields
2. หรือเขียน contract tests: กำหนด interaction (request → expected response shape)
3. เก็บเป็น contract artifact (Pact JSON, schema file, test fixtures)

### 3. Verify Provider

> Goal: ทดสอบ provider ตอบตรง contract

1. Replay contract expectations กับ provider — mock state setup ตามที่ test ต้องการ
2. ตรวจ: status codes, field presence, types, formats — provider ต้อง satisfy ทุก interaction
3. flag: extra fields ที่ consumer ไม่ expect (tolerance ok), missing/wrong-typed fields (violation)

### 4. Detect Drift

> Goal: หา contract drift ระหว่างฝั่ง

1. เทียบ consumer expectations vs provider actual — fields ที่ต่างกัน
2. flag: consumer ใช้ fields ที่ provider ไม่ส่ง, provider ลบ fields ที่ consumer ใช้
3. ทำ `/check-api-contract` ร่วมสำหรับ spec-level drift

### 5. Report

> Goal: สรุป contract verification

1. ใช้ `/report`: `No.`, `Interaction`, `Consumer`, `Provider`, `Status`, `Mismatch`
2. Verdict ต่อ contract: `verified`, `drift`, `broken`
3. แนะนำ: fix provider, update contract, หรือ version API (`/check-api-versioning`)

## Rules

### 1. Real Contracts

- contract ต้องมาจาก code/spec จริง — ไม่เขียน expectations ที่ไม่มีใน consumer
- verify กับ provider จริงหรือ provider stub ที่ generated จาก code จริง

### 2. Bidirectional

- ตรวจทั้งสองทิศ: consumer ใช้ของที่ provider มี + provider ไม่ลบของที่ consumer ใช้
- fields ที่ consumer ไม่ใช้สามารถเปลี่ยนได้ — flag info ไม่ใช่ violation

### 3. CI Friendly

- contract tests ควรรันใน CI ได้ — ไม่พึ่ง live services
- artifacts (Pact files, schemas) ต้อง versioned กับ code

## Expected Outcome

- Contract verification results ต่อ consumer-provider pair
- Drift/mismatch findings พร้อม field-level detail
- Contract artifacts ที่ reuse ใน CI ได้
