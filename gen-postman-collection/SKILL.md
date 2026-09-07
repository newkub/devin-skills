---
name: gen-postman-collection
description: สร้าง Postman/Bruno collection จาก API routes หรือ OpenAPI spec พร้อม environments
argument-hint: "[spec-or-framework]"
related:
  - gen-openapi
  - check-api-contract
  - scan-codebase
  - report-table
---

## Goal

Generate API collection (Postman หรือ Bruno) จาก OpenAPI spec หรือ route definitions จริง — พร้อม folders, example requests, auth setup และ environments

## Scope

- Input: OpenAPI spec (`openapi.yaml`) หรือ route definitions ใน code
- Output: Postman collection v2.1 (`*.postman_collection.json`) หรือ Bruno collection (`*.bru` files)
- ครอบคลุม: endpoints, methods, params, example bodies, auth config, environment variables

## Execute

### 1. Get API Surface

> Goal: รวบรวม endpoints ทั้งหมด

1. ถ้ามี OpenAPI spec → ใช้เป็น source of truth
2. ถ้าไม่มี → ทำ `/gen-openapi` ก่อน หรือ extract routes จาก code ด้วย `scan-codebase`/`use-astgrep`
3. จัดกลุ่ม endpoints ตาม resource/tag

### 2. Generate Collection Structure

> Goal: สร้าง collection พร้อม folders ตาม resources

1. Postman: สร้าง JSON v2.1 schema — `info`, `item[]` (nested folders ตาม tags)
2. Bruno: สร้าง `*.bru` files + `bruno.json` + `environments/`
3. แต่ละ request: method, URL (ใช้ `{{baseUrl}}` variable), headers, params, body example

### 3. Add Request Details

> Goal: ทำให้ requests ใช้ได้จริงทันที

1. Base URL: environment variable `{{baseUrl}}` — สร้าง environments: `local`, `staging`, `prod`
2. Auth: collection-level auth (Bearer/API key) ถ้า API ใช้ — ใช้ variables ไม่ hardcode
3. Examples: request body จาก schema examples หรือ generate จาก types
4. Descriptions: จาก spec descriptions หรือ docstrings
5. Path params และ query params จาก spec ครบ

### 4. Add Test Scripts (ถ้าเหมาะ)

> Goal: เพิ่ม basic assertions ต่อ request

1. Postman test scripts: `pm.response.to.have.status(200)` ตาม expected status
2. Schema validation script ถ้า response schema ชัดเจน
3. Bruno: `assert`/`tests` blocks เทียบเท่า

### 5. Verify And Report

> Goal: ยืนยัน collection import ได้และครบ

1. Validate JSON schema (Postman collection schema) หรือเปิดใน Bruno
2. เทียบ endpoint count กับ spec — ไม่มีที่ขาด
3. ใช้ `/report-table` สรุป: `No.`, `Folder`, `Endpoints`, `Auth`, `Examples`
4. บอกวิธี import/run

## Rules

### 1. From Spec Or Real Code

- Generate จาก spec/code จริงเท่านั้น — ห้ามเดา endpoints
- ถ้า spec กับ code drift → ทำ `/check-api-contract` ก่อน แล้ว generate จาก source of truth

### 2. No Secrets

- ห้ามใส่ tokens/keys จริงใน collection — ใช้ variables เสมอ
- environment files ใส่ placeholder เท่านั้น

### 3. Usable Immediately

- import แล้วต้องยิงได้จริง (หลังใส่ baseUrl/auth) — ไม่ใช่ skeleton เปล่า
- example bodies ต้อง valid ตาม schema

## Expected Outcome

- Collection file พร้อม import ใช้ได้ทันที
- Environments (local/staging/prod) พร้อม variables
- Endpoint coverage ครบตาม spec พร้อม basic test scripts
