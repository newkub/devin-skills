---
name: run-test-unit
description: รัน unit tests สำหรับ pure functions และ business logic
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

รัน unit tests สำหรับ pure functions, business logic, และ utility functions เพื่อตรวจสอบความถูกต้องของ logic ระดับฟังก์ชัน

## Scope

ใช้สำหรับรัน unit tests ที่ทดสอบ pure functions, edge cases, parameterized tests ไม่รวม integration, E2E, หรือ component tests

## Execute

### 1. Detect Test Framework

ตรวจสอบ unit test framework ที่ project ใช้

> Goal: รู้ framework, config, และ test file patterns

1. ตรวจสอบ `package.json` สำหรับ test dependencies (`vitest`, `jest`, `mocha`, `pytest`, `go test`)
2. ตรวจสอบ config files (`vitest.config.ts`, `jest.config.js`, `pytest.ini`)
3. ตรวจสอบ unit test file patterns (`*.test.ts`, `*.spec.ts`, `test_*.py`)
4. ตรวจสอบ test directories (`test/unit/`, `tests/unit/`, `__tests__/`)

### 2. Run Unit Tests

รัน unit tests ตาม framework

> Goal: Tests รันเสร็จพร้อมผลลัพธ์

1. รัน `bun run test:unit` หรือ `bun test` ถ้ามี script
2. ถ้าไม่มี script รัน `bunx vitest run` สำหรับ Vitest
3. รัน `pytest tests/unit/` สำหรับ Python
4. รัน `go test ./...` สำหรับ Go
5. บันทึกผลลัพธ์, duration, และรายการ tests ที่ fail

### 3. Review Test Results

ตรวจสอบผลลัพธ์

> Goal: รู้ pass/fail และสาเหตุของ failures

1. ดู test report จาก framework
2. ตรวจสอบ failed tests และ error messages
3. ระบุ tests ที่ fail ว่าเป็น logic error หรือ assertion error
4. บันทึก coverage ถ้า framework รองรับ

## Rules

### 1. Test Scope

- Unit tests ทดสอบ pure functions เท่านั้น
- ไม่ใช้ real database, network, หรือ file I/O
- ใช้ mocks หรือ stubs สำหรับ dependencies
- แต่ละ test ต้อง independent และรันได้แยก

### 2. Performance

- Unit tests ต้องเร็ว (< 10ms per test)
- ไม่มี setTimeout หรือ sleep ที่ไม่จำเป็น
- ใช้ parallel execution ถ้า framework รองรับ

### 3. Edge Cases

- ทดสอบ happy path, edge cases, และ error cases
- ทดสอบ boundary values
- ทดสอบ null/undefined/empty inputs
- ทดสอบ parameterized cases

## Expected Outcome

- Unit tests รันผ่านทั้งหมด
- Test report แสดงผลลัพธ์ชัดเจน
- Failed tests ระบุสาเหตุได้
- Tests รันเร็วและ independent
