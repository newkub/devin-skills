---
name: run-test-api
description: รัน API tests โดยเรียก endpoints และตรวจสอบ responses ด้วย scripts
argument-hint: "[scope]"
related:
  - run-test
  - review-api
  - follow-test
  - follow-tool-bruno
  - follow-tool-hurl
  - gen-openapi
  - follow-tool-scalar
  - use-scripts
  - use-astgrep
  - deep-validate
  - report
  - resolve-errors
  - suggest-next-action
---

## Goal

รัน API tests โดยเรียก endpoints จริงหรือ mocked แล้วตรวจสอบ responses เพื่อ verify contracts และ behavior

## Scope

ใช้สำหรับ REST, GraphQL, tRPC, WebSocket, หรือ API endpoints อื่นๆ ในโปรเจกต์

## Execute

> Pre-Run: ทำ `/review-api` ก่อนเสมอ — `run-*` ต้อง review/ประเมินก่อนลงมือหลัก ห้ามข้าม; ถ้า findings เป็น blocker ให้แก้หรือ report ก่อนรัน (test api)

### 1. Prepare API Test Context

> Goal: เตรียม context ก่อนรัน API tests

1. ตรวจสอบ `package.json` หรือ config เพื่อหา test framework และ scripts
2. ระบุ API endpoints จาก codebase, OpenAPI, หรือ tests ที่มีอยู่
3. ตรวจสอบ environment variables: `PORT`, `BASE_URL`, `API_KEY`
4. ถ้ามี OpenAPI / tRPC router → อ่าน schema เพื่อรู้ request/response shape
5. ถ้าไม่มี test framework → ทำ `/follow-test` เพื่อตั้งค่า

### 2. Select Test Runner

> Goal: เลือกเครื่องมือที่เหมาะกับงาน

| เครื่องมือ | เมื่อไหร่ |
|-----------|---------|
| ad-hoc script (Bun `fetch`/`ofetch`/`ky`) | default — logic ยืดหยุ่น, assertions ซับซ้อน, one-off checks |
| Hurl `.hurl` files (`hurl --test`) | test files ที่ diff ได้ใน Git, contract/smoke checks ใน CI — ทำ `/follow-tool-hurl` |
| Bruno collections (`bru run`) | มี `.bru`/OpenCollection อยู่แล้ว หรือต้องการ GUI + CLI เดียวกัน — ทำ `/follow-tool-bruno` |
| Schemathesis | มี OpenAPI spec และต้องการ property-based fuzzing หา edge cases |

ถ้าเลือก script → ทำ `/use-scripts` เพื่อเลือก shell และ location; ใช้ `/use-astgrep` ถ้าต้องสแกน call sites หรือ route definitions; script ต้องรองรับ base URL, headers, body, query params, expected status, expected response shape พร้อม `dryRun` option

### 3. Export OpenAPI → Bruno Flow

> Goal: แปลง spec เป็น runnable collection เมื่อทีมใช้ Bruno

1. Export spec จาก code — `/gen-openapi` หรือ framework generator (Elysia/Hono/Fastify route, oRPC `OpenAPIGenerator`)
2. ถ้า spec เป็น Postman collection → แปลงด้วย `bunx scalar document convert <collection.json>`
3. Import เข้า Bruno: `bru import openapi --source <spec> --output tests/api --collection-name "API"` (default `opencollection`; ใช้ `--collection-format=bru` ถ้าต้องการ classic `.bru`)
4. เพิ่ม assertions/`tests` blocks ใน requests ที่สร้าง — import ให้เฉพาะ request shape ไม่ใช่ assertions
5. รัน: `bru run tests/api --env <name> --reporter-junit junit.xml` หรือผ่าน `usebruno/bruno-cli-action@v1` ใน GitHub Actions — ดู `/follow-tool-bruno`
6. ถ้าไม่ต้องการ Bruno → ใช้ Hurl หรือ Schemathesis จากตารางข้างบนแทน

### 4. Run API Tests

> Goal: รัน script และบันทึกผล

1. รัน script ใน `dryRun` mode ก่อน
2. ถ้า dry run ผ่าน → รันจริง
3. บันทึก response status, headers, body, latency ของแต่ละ endpoint
4. ตรวจสอบ response ตาม schema หรือ contract
5. ถ้ามี fail → ไปขั้นตอน Validate/Report ทันที โดยไม่แก้ source โดยไม่มี evidence

### 5. Validate And Report

> Goal: ตรวจสอบผลและรายงาน

1. ทำ `/deep-validate` กับ source ที่เกี่ยวข้องเมื่อ API test fail
2. สรุปผลด้วย `/report`: endpoint, status, latency, pass/fail
3. ถ้า source ผิด → แนะนำ `/resolve-errors` หรือ `/edit`
4. ถ้า test ผิด → แนะนำ `/edit` กับ test script
5. ทำ `/suggest-next-action` เพื่อแนะนำ step ถัดไป

## Rules

### 1. Test Isolation

- ทุก API test ต้อง independent ไม่ขึ้นต่อกัน
- ใช้ test database หรือ mocks สำหรับ side effects
- ระบุ cleanup/rollback สำหรับ state ที่เปลี่ยน

### 2. Response Validation

- ตรวจ status code ที่เหมาะสม
- ตรวจ response body ตาม schema หรือ contract
- ตรวจ headers ที่จำเป็น เช่น `content-type`
- บันทึก latency สำหรับตรวจ performance

### 3. Safety

- ไม่รัน API tests กับ production ยกเว้น user ยืนยัน
- ไม่แก้ source code หรือ test assertions โดยไม่มี evidence
- ใช้ `dryRun` ก่อน execute จริง

### 4. Script Standards

- ใช้ Bun native APIs ถ้าใช้ `.ts`
- ใช้ CDN imports สำหรับ dependencies
- เก็บ permanent scripts ใน `.devin/scripts/` และ temp scripts ใน `$env:TEMP`

## Expected Outcome

- API tests ถูกรันและ responses ถูกบันทึก
- รายงาน pass/fail ของแต่ละ endpoint
- Failures ถูก classify ว่า source หรือ test ผิด
- แนะนำ action ถัดไป

