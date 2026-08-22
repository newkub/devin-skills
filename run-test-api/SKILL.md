---
name: run-test-api
description: รัน API tests โดยเรียก endpoints และตรวจสอบ responses ด้วย scripts
allowed-tools:
  - read
  - edit
  - grep
  - glob
  - exec
  - write
  - ask_user_question
triggers:
  - user
  - model
related:
  - Node
  - Report
  - fail
  - response
  - rollback
---

## Goal

รัน API tests โดยเรียก endpoints จริงหรือ mocked แล้วตรวจสอบ responses เพื่อ verify contracts และ behavior

## Scope

ใช้สำหรับ REST, GraphQL, tRPC, WebSocket, หรือ API endpoints อื่นๆ ในโปรเจกต์

## Execute

### 1. Prepare API Test Context

> Goal: เตรียม context ก่อนรัน API tests
> Goal: รู้ endpoints, schemas, auth, และ environment ที่ต้องทดสอบ

1. ตรวจสอบ `package.json` หรือ config เพื่อหา test framework และ scripts
2. ระบุ API endpoints จาก codebase, OpenAPI, หรือ tests ที่มีอยู่
3. ตรวจสอบ environment variables: `PORT`, `BASE_URL`, `API_KEY`
4. ถ้ามี OpenAPI / tRPC router → อ่าน schema เพื่อรู้ request/response shape
5. ถ้าไม่มี test framework → ทำ `/follow-test` เพื่อตั้งค่า

### 2. Create API Test Script

> Goal: สร้าง script สำหรับรัน API tests
> Goal: มี script ที่รัน requests และตรวจ responses ได้

1. ทำ `/use-scripts` เพื่อเลือก shell และ location
2. เลือกภาษา/เครื่องมือ: Bun/Node สำหรับ `fetch`, `ofetch`, `ky`
3. ใช้ `/use-ast-grep-programatic` ถ้าต้องสแกน call sites หรือ route definitions
4. script ต้องรองรับ: base URL, headers, body, query params, expected status, expected response shape
5. เพิ่ม `dryRun` option สำหรับดู requests โดยไม่ส่งจริง

### 3. Run API Tests

> Goal: รัน script และบันทึกผล
> Goal: ทราบว่า API endpoints ตอบสนองตาม expectations

1. รัน script ใน `dryRun` mode ก่อน
2. ถ้า dry run ผ่าน → รันจริง
3. บันทึก response status, headers, body, latency ของแต่ละ endpoint
4. ตรวจสอบ response ตาม schema หรือ contract
5. ถ้ามี fail → ไปขั้นตอน Validate/Report ทันที โดยไม่แก้ source โดยไม่มี evidence

### 4. Validate And Report

> Goal: ตรวจสอบผลและรายงาน
> Goal: ระบุสาเหตุของ failures และ action items

1. ทำ `/validate` กับ source ที่เกี่ยวข้องเมื่อ API test fail
2. สรุปผลด้วย `/report-table`: endpoint, status, latency, pass/fail
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
- เก็บ permanent scripts ใน `.devin/scripts/` และ temp scripts ใน `temp/`

## Expected Outcome

- API tests ถูกรันและ responses ถูกบันทึก
- รายงาน pass/fail ของแต่ละ endpoint
- Failures ถูก classify ว่า source หรือ test ผิด
- แนะนำ action ถัดไป
