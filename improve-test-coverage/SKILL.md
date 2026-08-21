---
name: improve-test-coverage
description: วิเคราะห์และเพิ่ม test coverage ให้ครอบคลุมทุก critical paths, edge cases, และ error paths
allowed-tools:
  - read
  - edit
  - grep
  - glob
  - exec
triggers:
  - user
  - model
---

## Goal

วิเคราะห์ test coverage gaps และเพิ่ม tests ที่ขาดให้ครอบคลุมทุก critical paths, edge cases, และ error paths

## Scope

ใช้สำหรับแก้ไข test coverage issues ที่ตรวจพบ: unit tests, integration tests, E2E tests — ไม่รวมการ review เท่านั้น (ใช้ `/review-codebase`) หรือรัน coverage เท่านั้น (ใช้ `/run-test-coverage`)

## Execute

### 1. Analyze Coverage Gaps

วิเคราะห์ test coverage gaps ใน codebase

> Goal: รู้ว่ามี untested paths อะไรบ้าง จัดลำดับตาม severity

1. ทำ `/scan-codebase`, ทำ `/review-codebase`, ทำ `/run-test-coverage` — ระบุ untested files, functions, branches
2. จำแนก gaps ตามประเภท:
   - Critical paths: business logic ที่ไม่มี test, API endpoints ที่ไม่มี integration test
   - Edge cases: boundary conditions, empty inputs, null/undefined handling
   - Error paths: error handling, exception flows, failure scenarios
   - Untested modules: files ที่ไม่มี test file เลย
3. จัดลำดับตาม severity: critical paths > error paths > edge cases > untested modules — ถ้าไม่มี gaps → stop และ report

### 2. Write Missing Critical Path Tests

เขียน tests สำหรับ critical paths ที่ไม่มี test

> Goal: ทุก critical path มี test ครอบคลุม

1. เขียน unit tests สำหรับ business logic ที่ขาด — ใช้ `/write-test`
2. เขียน integration tests สำหรับ API endpoints ที่ขาด
3. เขียน E2E tests สำหรับ user flows ที่สำคัญ
4. ถ้า test fail → ทำ `/resolve-errors` ก่อนดำเนินต่อ
5. รัน `bun run test` เพื่อยืนยัน tests ใหม่ผ่าน

### 3. Write Missing Error Path Tests

เขียน tests สำหรับ error paths และ failure scenarios

> Goal: ทุก error path มี test ครอบคลุม

1. เขียน tests สำหรับ error handling: try/catch, error boundaries, fallback behavior
2. เขียน tests สำหรับ failure scenarios: network errors, timeout, invalid input, permission denied
3. เขียน tests สำหรับ validation errors: schema validation, type errors, constraint violations
4. ใช้ `/write-test` สำหรับทุก test ใหม่ — ถ้า test fail → ทำ `/resolve-errors`

### 4. Write Missing Edge Case Tests

เขียน tests สำหรับ edge cases และ boundary conditions

> Goal: ทุก edge case มี test ครอบคลุม

1. เขียน tests สำหรับ boundary conditions: empty array, single item, max capacity
2. เขียน tests สำหรับ null/undefined/empty string handling
3. เขียน tests สำหรับ concurrent operations และ race conditions
4. เขียน tests สำหรับ type coercion และ unexpected input types
5. ใช้ `/write-test` สำหรับทุก test ใหม่

### 5. Validate And Report

ตรวจสอบผลลัพธ์และรายงาน

> Goal: Test coverage ดีขึ้น ผ่าน validation และมี report ชัดเจน

1. รัน `bun run test:coverage`, ทำ `/run-test`, ทำ `/run-check`
2. เทียบ before/after: coverage % (lines, branches, functions, statements), test count, pass rate
3. ถ้า coverage ไม่ถึง target → กลับไป Step 2-4 เพิ่ม tests ที่ขาด (max 3 iterations → stop/report)
4. ถ้า validation fail → ทำ `/resolve-errors` แล้ว retry (max 3 → stop/report)
5. รายงานเป็นตาราง: category | before | after | status — ทำ `/suggest-next-action`

## Rules

### 1. Coverage Priority

- แก้ critical paths ก่อนเสมอ — untested business logic มี risk สูงสุด
- error paths ก่อน edge cases — error handling ส่งผลต่อ user experience
- ใช้ `/write-test` สำหรับทุก test ใหม่ — ไม่เขียน test แบบ manual

### 2. Test Quality

- ทุก test ต้องมี clear assertion — ไม่เขียน test ที่ไม่ verify อะไร
- ทุก test ต้อง isolated — ไม่ depend on ลำดับการรันหรือ shared state
- ใช้ descriptive test names: `should <expected behavior> when <condition>`
- ไม่เขียน test เพื่อให้ coverage สูงอย่างเดียว — test ต้องมี value จริง

### 3. High Impact Content

- ทุก bullet ต้องตอบได้ว่า "ถ้าไม่มีแล้วผลลัพธ์เปลี่ยนไหม" — ถ้าไม่เปลี่ยน → ลบ
- ห้าม TODO, MOCK, placeholder — ไม่เขียน test ที่ skip หรือ todo โดยไม่จำเป็น
- เขียน test เฉพาะที่ขาด — ไม่ rewrite tests ที่มีอยู่แล้ว (ใช้ `/refactor` ถ้าต้องปรับปรุง)

## Expected Outcome

- Test coverage ดีขึ้น ครอบคลุม critical paths, error paths, และ edge cases
- ไม่มี untested critical paths เหลือ
- ทุก test ใหม่ผ่านและ isolated
- Typecheck, lint, และ tests ผ่าน
- ตาราง report: category | before | after | status
