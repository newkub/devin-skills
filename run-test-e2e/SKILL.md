---
name: run-test-e2e
description: รัน E2E tests ด้วย Playwright หรือ Cypress
related:
  - run-test
  - run-test-all
  - run-test-api
  - run-check
  - run-verify
  - suggest-next-action
  - watch-browser-and-test-all-routes
---

## Goal

รัน E2E tests สำหรับ browser testing ด้วย Playwright หรือ Cypress

## Scope
- สำหรับ skills ที่เกี่ยวข้อง: `watch-browser-and-test-all-routes`

ใช้สำหรับรัน browser-based E2E tests ครอบคลุม user flows, critical paths, และ cross-browser compatibility

## Execute

### 1. Check Test Framework

> Goal: ตรวจสอบ E2E test framework ที่ใช้

1. ตรวจสอบ `playwright.config.ts` สำหรับ Playwright
2. ตรวจสอบ `cypress.config.ts` สำหรับ Cypress
3. ตรวจสอบ test files ใน `tests/` หรือ `e2e/`
4. ตรวจสอบ scripts ใน `package.json`

### 2. Install Browser Dependencies

> Goal: ติดตั้ง browser dependencies ถ้าจำเป็น

1. รัน `bunx playwright install` สำหรับ Playwright
2. รัน `bunx playwright install-deps` สำหรับ system dependencies
3. ตรวจสอบ browser binaries ถูกติดตั้งแล้ว

### 3. Run E2E Tests

> Goal: รัน E2E tests ตาม framework

1. ถ้าใช้ Playwright: รัน `bunx playwright test`
2. ถ้าใช้ Cypress: รัน `bunx cypress run`
3. ใช้ script จาก `package.json` ถ้ามี
4. รัน specific tests ด้วย file patterns

### 4. Review Test Results

> Goal: ตรวจสอบผลลัพธ์จากการทดสอบ

1. ดู test report จาก framework
2. ตรวจสอบ failed tests
3. ดู screenshots สำหรับ failed tests
4. ดู videos สำหรับ test runs

## Rules

### 1. Test Framework Setup

- ใช้ Playwright สำหรับ modern E2E testing
- ใช้ Cypress ถ้า project ใช้อยู่แล้ว
- ตั้งค่า browsers ที่ต้องการ test
- ตั้งค่า viewport และ device emulation

### 2. Test Execution

- รัน tests ใน headless mode สำหรับ CI
- รัน tests ใน headed mode สำหรับ debugging
- ใช้ parallel execution สำหรับ speed
- ใช้ retries สำหรับ flaky tests

### 3. Test Isolation

- แต่ละ test ต้อง independent
- ใช้ `beforeEach` และ `afterEach` สำหรับ setup/teardown
- ลบ cookies/localStorage ระหว่าง tests
- ใช้ test data ที่ isolated

### 4. Error Handling

- ดู error messages จาก test framework
- ดู screenshots สำหรับ visual debugging
- ดู videos สำหรับ replay test failures
- ใช้ debug mode สำหรับ troubleshooting

## Expected Outcome

- E2E tests รันผ่านทั้งหมด
- Test report แสดงผลลัพธ์ชัดเจน
- Screenshots และ videos สำหรับ failed tests
- Tests ทำงานได้ใน browsers ที่ตั้งค่าไว้
