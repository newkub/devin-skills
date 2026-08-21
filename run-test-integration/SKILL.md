---
name: run-test-integration
description: รัน integration tests สำหรับ module interactions และ data flow
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

รัน integration tests สำหรับทดสอบการทำงานร่วมกันของ modules, data flow, และ integration points

## Scope

ใช้สำหรับรัน integration tests ที่ทดสอบ interactions ระหว่าง modules, APIs, databases, และ external services ไม่รวม unit tests หรือ E2E tests

## Execute

### 1. Detect Test Framework

ตรวจสอบ integration test framework ที่ project ใช้

> Goal: รู้ framework, config, และ test file patterns

1. ตรวจสอบ `package.json` สำหรับ test dependencies
2. ตรวจสอบ config files (`vitest.config.ts`, `jest.config.js`)
3. ตรวจสอบ integration test file patterns (`*.integration.test.ts`, `test/integration/`)
4. ตรวจสอบ test setup files สำหรับ integration environment

### 2. Setup Integration Environment

เตรียม environment สำหรับ integration tests

> Goal: Environment พร้อมสำหรับ integration tests

1. ตรวจสอบ test database setup (SQLite, PostgreSQL test instance)
2. ตรวจสอบ mock servers หรือ test containers
3. ตรวจสอบ environment variables สำหรับ test environment
4. ตรวจสอบ test fixtures และ seed data

### 3. Run Integration Tests

รัน integration tests ตาม framework

> Goal: Tests รันเสร็จพร้อมผลลัพธ์

1. รัน `bun run test:integration` ถ้ามี script
2. ถ้าไม่มี script รัน `bunx vitest run --config vitest.config.ts test/integration/`
3. รัน `pytest tests/integration/` สำหรับ Python
4. บันทึกผลลัพธ์, duration, และรายการ tests ที่ fail

### 4. Review Test Results

ตรวจสอบผลลัพธ์

> Goal: รู้ pass/fail และสาเหตุของ failures

1. ดู test report จาก framework
2. ตรวจสอบ failed tests และ error messages
3. ระบุ integration points ที่ fail
4. ตรวจสอบ database state หลัง tests

## Rules

### 1. Test Scope

- Integration tests ทดสอบ interactions ระหว่าง modules
- ใช้ real database หรือ test database (ไม่ใช่ mocks)
- ทดสอบ data flow จาก input ถึง output
- ทดสอบ error handling ที่ integration points

### 2. Environment Isolation

- ใช้ separate test database ไม่ใช่ production
- Cleanup data หลังแต่ละ test suite
- ใช้ transactions และ rollback ถ้าเป็นไปได้
- ไม่ share state ระหว่าง tests

### 3. Performance

- Integration tests อาจช้ากว่า unit tests (< 100ms per test)
- ใช้ parallel execution ด้วยความระมัดระวัง
- ถ้า tests แชร์ database ให้รันแบบ sequential

## Expected Outcome

- Integration tests รันผ่านทั้งหมด
- Test report แสดงผลลัพธ์ชัดเจน
- Integration points ที่ fail ถูกระบุ
- Database state ถูกต้องหลัง tests
