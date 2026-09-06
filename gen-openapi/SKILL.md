---
name: gen-openapi
description: Generate OpenAPI spec จาก code หรือ endpoints จริง พร้อม validate และ preview docs
argument-hint: "[path]"
related:
  - follow-tool-scalar
  - review-api
  - update-docs
  - run-test-api
  - follow-lib-elysia
  - follow-lib-orpc
  - search-files-patterns
  - list-website-all-routes
  - report-table
  - check-api-contract
---

## Goal

Generate OpenAPI 3.x spec (`openapi.json`/`openapi.yaml`) จาก API code จริง — routes, schemas, responses, auth — พร้อม validate และ preview เป็น docs

## Scope

- ใช้เมื่อต้องการ OpenAPI spec จาก codebase ที่มีอยู่ (Elysia, Hono, Express, Fastify, tRPC/oRPC)
- ครอบคลุม static analysis จาก route definitions และ schema annotations (Zod, ArkType, TypeBox)
- Read-only ต่อ source: สร้าง spec file เท่านั้น ไม่แก้ API code

## Execute

### 1. Detect API Framework

> Goal: รู้ว่า API เขียนด้วย framework อะไร

1. ตรวจ `package.json` หา `elysia`, `hono`, `express`, `fastify`, `@orpc/*`, `next`
2. ทำ `/search-files-patterns` หา route definitions และ handler files
3. ระบุ validation library: `zod`, `arktype`, `typebox`, `valibot`

### 2. Extract Endpoints

> Goal: รวบรวม routes ทั้งหมด

1. ใช้ `/list-website-all-routes` หรือ grep patterns ของ framework:
   - Elysia/Hono: `.get()`, `.post()`, `.put()`, `.delete()`, `.patch()`
   - Express/Fastify: `app.<method>()`, `router.<method>()`
   - oRPC: `os.router({...})` procedures
2. รวม method, path, params, request/response types ต่อ endpoint
3. แปลง path params เป็น OpenAPI format (`/users/:id` → `/users/{id}`)

### 3. Map Schemas

> Goal: แปลง validation schemas เป็น JSON Schema

1. Zod → ใช้ `zod-to-json-schema` หรืออ่าน type structure
2. TypeBox → ใช้โดยตรง (เป็น JSON Schema อยู่แล้ว)
3. ArkType → ใช้ `.toJsonSchema()` ถ้ารองรับ
4. ถ้าไม่มี schema → infer จาก handler signature หรือ mark `any`

### 4. Generate Spec

> Goal: สร้าง openapi.yaml/json ที่ valid

1. สร้าง spec structure: `openapi`, `info`, `servers`, `paths`, `components`
2. เพิ่ม `components/schemas` จาก validation schemas ที่ dedupe แล้ว
3. เพิ่ม `securitySchemes` จาก auth middleware ที่ตรวจพบ
4. บันทึก `openapi.yaml` ที่ project root หรือ `docs/`
5. Validate ด้วย `bunx @redocly/cli lint openapi.yaml` หรือ Scalar validator

### 5. Preview And Report

> Goal: spec ใช้งานได้จริง

1. เปิด preview ด้วย `/follow-tool-scalar` หรือ `bunx @scalar/cli`
2. ทำ `/report-table` สรุป: `No.`, `Method`, `Path`, `OperationId`, `Schemas`, `Auth`
3. ระบุ endpoints ที่ขาด schema หรือ docs
4. แนะนำ `/review-api` หรือ `/update-docs` เป็น next action

## Rules

### 1. Code-First Accuracy

- spec ต้องสะท้อน code จริง — ไม่เดา endpoints
- ถ้า route ไม่มี schema → ระบุ `undocumented` ไม่แต่งขึ้นมา
- ถ้า framework generate spec เองได้ (Elysia swagger plugin) → ใช้ของ framework ก่อนเขียนเอง

### 2. No Source Mutation

- ไม่แก้ API code เพื่อให้ generate ง่ายขึ้น
- spec output แยกไฟล์ ไม่ inline ใน source

### 3. Valid Output

- spec ต้องผ่าน OpenAPI validator ก่อน ship
- ทุก `$ref` ต้อง resolve ได้

- ใช้ /follow-tool-scalar ถ้าจำเป็น
- ใช้ /review-api ถ้าจำเป็น
- ใช้ /update-docs ถ้าจำเป็น

## Expected Outcome

- `openapi.yaml`/`openapi.json` valid และครอบคลุม endpoints จริง
- Preview เป็น interactive docs ได้
- รายการ endpoints ที่ขาด schema/docs ชัดเจน
