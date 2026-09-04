---
name: improve-test-coverage
description: ปรับปรุง test coverage โดยรัน coverage, หา gaps, เติม tests, และ verify จนถึง threshold
related:
  - run-test-coverage
  - run-test
  - run-test-unit
  - run-test-all
  - improve-test
  - deep-review
  - review-quality
  - resolve-errors
  - deep-debug
  - update-specs
---

## Goal

รัน coverage หา coverage gaps แล้วเติม tests ตาม gaps จนถึง threshold ที่กำหนด

## Scope

ใช้กับ project ที่มี test infrastructure อยู่แล้ว โดยรัน coverage วิเคราะห์ gaps แล้วเขียนหรืออัปเดต tests ให้ครอบคลุม code ปัจจุบัน

## Execute

### 1. Run Coverage

> Goal: หาจุดที test ยังไม่ครอบคลุม

1. ทำ `/run-test-coverage` เพื่อดู coverage report
2. บันทึก files, functions, branches, statements ทีไม่ผ่าน threshold
3. รัน `/deep-review` หรือ `/review-quality` เพื่อวิเคราะห์ code paths ทีไม่มี test
4. กำหนด target coverage threshold (default 100% หรือตาม project กำหนด)

### 2. Identify Priorities

> Goal: เรียงลำดับ gaps ตาม impact

1. ระบุ critical paths: auth, permissions, payment, booking, checkout
2. ระบุ security-critical logic: IDOR, userId injection, sanitization, rate limiting
3. ระบุ pure functions, handlers, utilities ทีไม่มี unit tests
4. ระบุ integration gaps: DB queries, external API calls, service interactions
5. เรียง priority: Critical → High → Medium → Low

### 3. Inspect Test Conventions

> Goal: เขียน test ให้สอดคล้อง project

1. ตรวจ `package.json` test scripts และ framework (`vitest`, `jest`, `playwright`)
2. อ่าน `vitest.config.*` หรือ config ทีเกี่ยวข้อง
3. ดูตัวอย่าง test files ทีมีอยู่ใน repo
4. ระบุ location ของ tests: `__tests__/`, `tests/unit/`, `tests/integration/`, `tests/e2e/`
5. ระบุ conventions: naming, mocking, fixtures, factories

### 4. Write Unit Tests

> Goal: ครอบคลุม pure functions และ handlers

1. อ่าน source file ทีขาด coverage
2. ระบุ happy path, error path, edge cases, boundary values
3. ใช้ `factories` หรือ `fixtures` สร้าง test data
4. Mock external dependencies (DB, API, email, payment)
5. ใช้ parameterized tests สำหรับ boundary/permission matrices
6. ตรวจ auth bypass และ userId injection ใน handlers

### 5. Write Integration Tests

> Goal: ครอบคลุม service interactions และ DB queries

1. เลือก test DB หรือ in-memory DB สำหรับ integration tests
2. ทดสอบ API endpoints ด้วย request/response mapping
3. ตรวจ error fallback เมื่อ dependency throw
4. ตรวจ side effects เช่น DB mutations, cache updates, queue jobs
5. ทำ cleanup หลังแต่ละ test

### 6. Write Security Tests

> Goal: ครอบคลุม security-critical paths

1. Auth missing/invalid → reject
2. IDOR: user A เข้าถึง resource ของ user B → deny
3. userId จาก auth ไม่ใช่ input
4. Sanitization: XSS/malicious input → sanitized
5. Permission matrix ด้วย `it.each`

### 7. Run And Fix Tests

> Goal: ทุก test ผ่าน

1. ทำ `/run-test` หรือ test script ทีเหมาะสม
2. แก้ failing tests จนผ่าน (max 3 retry)
3. ตรวจ false positives
4. ตรวจ error tests จริงๆ ทดสอบ error path

### 8. Verify Coverage Again

> Goal: ยืนยันว่า gaps ลดลง

1. ทำ `/run-test-coverage` อีกครั้ง
2. เปรียบเทียบ before/after coverage
3. ถ้ายังมี gaps ใน critical paths → ทำ Step 4-6 เพิ่ม
4. วนซ้ำสูงสุด 5 รอบ ถ้าเกิน → stop และ report

### 9. Update Specs

> Goal: เอกสารสอดคล้อง tests

1. ทำ `/update-specs` เพื่อ sync `specs/SPEC.md` กับ test cases ใหม่
2. ระบุ test cases ทีเพิ่มใน spec

## Rules

### 1. Test Principles

- ตั้งชื่อ test: `should [expected behavior] when [condition]`
- Follow `Arrange`, `Act`, `Assert`
- Test สิ่งเดียวต่อ case
- Tests isolated ไม่แชร์ state
- ครอบ happy path, error path, edge cases, boundary values
- ใช้ parameterized tests สำหรับค่าซ้ำ

### 2. Language Conventions

- TypeScript: `vitest` หรือ `jest`
- Go: `*_test.go` table-driven
- Python: `pytest`
- Rust: `#[test]`
- Java: `JUnit`
- C#: `xUnit`
- Ruby: `rspec`
- PHP: `PHPUnit`

### 3. File Organization

- Unit tests: `__tests__/` ข้าง source หรือ `tests/unit/`
- Integration tests: `tests/integration/`
- E2E tests: `tests/e2e/`
- Test utilities: `tests/utils/`
- Test data: `tests/fixtures/`
- อย่า mix colocated และ separate สำหรับ unit tests

### 4. Data And Mocks

- ใช้ `factories`, `fixtures`, `builders` สร้าง test data
- ไม่ hardcode secrets
- Mock external dependencies
- Restore/cleanup mocks หลังแต่ละ test
- ใช้ test database แยก

### 5. Security Tests

- Test auth bypass, IDOR, userId injection, sanitization
- Test permission matrix ด้วย parameterized tests
- ไม่ hardcode tokens หรือ passwords

### 6. Coverage Focus

- Coverage ทุก category: lines, branches, functions, statements
- ไล่ gaps ตาม severity ก่อน
- ใช้ `/run-test-coverage` ยืนยันทุกครั้งหลังแก้ไข
- บันทึก coverage delta

### 7. Quality

- DRY ด้วย typed helper functions
- หลีกเลี่ยง `as unknown as` ซ้ำๆ
- ใช้ `expect.objectContaining` สำหรับ assertions ทียืดหยุ่น
- Assert output ไม่ใช่ implementation
- Avoid fragile assertions กับ non-deterministic values

### 8. Sync

- อัปเดต tests เมื่องานหรือ code เปลี่ยน
- ไม่ ship ถ้า tests เก่ากว่า code
- ใช้ `/run-test-coverage` หลัง code เปลี่ยน

## Expected Outcome

- Coverage gaps ใน critical paths ถูกเติม
- Tests รันผ่านทั่งหมด ไม่มี false positive
- Coverage report ดีขึ้น
- Test code มีคุณภาพ อ่านง่าย
- `specs/SPEC.md` sync กับ tests ใหม่
