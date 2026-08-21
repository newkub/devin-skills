---
name: software-testing
description: วางกลยุทธ์การทดสอบ software ทีครอบคลุมและ maintainable
triggers:
  - user
  - model
related:
  - follow-test
  - follow-vitest
  - follow-playwright
---

## Goal

สร้าง testing strategy ทีครอบคลุม regression และส่งมอบคุณภาพ

## Scope

ใช้เมื่อต้องออกแบบ test suite สำหรับ project

## Execute

### 1. Define Test Levels

1. Unit tests สำหรับ business logic
2. Integration tests สำหรับ boundaries
3. E2E tests สำหรับ user flows
4. Contract tests สำหรับ APIs

### 2. Choose Tools

1. เลือก test runner ตาม stack (vitest, jest, pytest, go test)
2. เลือก E2E tool (playwright, cypress)
3. เลือก mock/stub approach
4. ตั้ง CI pipeline สำหรับ test

### 3. Write Maintainable Tests

1. 1 test ต่อ 1 behavior
2. ใช้ Arrange-Act-Assert
3. หลีกเลี่ยง brittle selectors
4. ใช้ factories/fixtures

### 4. Coverage And Quality

1. ตั้ง target coverage ที่ sensible
2. รัน mutation testing ถ้าจำเป็น
3. ตรวจ flaky tests
4. ทดสอบ error paths

## Rules

- Tests ต้อง fast, reliable, isolated
- ไม่ทดสอบ implementation details
- ใช้ realistic data
- รักษา test suite ให้สะอาด

## Expected Outcome

- Test suite ครอบคลุม critical paths
- CI green
- Regression ลดลง
