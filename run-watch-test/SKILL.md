---
name: run-watch-test
description: รัน tests แบบ watch mode เพื่อตรวจสอบ test failures อย่างต่อเนื่อง
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
  - resolve-errors
  - deep-debug
---

## Goal

รัน tests แบบ watch mode เพื่อตรวจสอบ test failures อย่างต่อเนื่อง

## Scope

ใช้สำหรับ project ที่ต้องการรัน tests แบบ watch mode ขณะพัฒนา

## Prompt

ใช้ workflow นี้เมื่อต้องการรัน tests แบบ watch mode เพื่อตรวจสอบ test failures และ coverage อย่างต่อเนื่องขณะพัฒนา

## Execute

1. ตรวจสอบ Test Setup

- ตรวจสอบว่าโปรเจกต์มี test framework ที่เหมาะสม (Vitest, Jest, ฯลฯ)
- ตรวจสอบ test configuration files
- ยืนยันว่า test script ถูกกำหนดใน main config
- ตรวจสอบว่า test dependencies ถูกติดตั้งแล้ว

2. รัน Test Watch Mode

- รัน tests ด้วย watch mode (vitest --watch, jest --watch, ฯลฯ)
- กำหนด test patterns ที่จะ monitor
- ตั้งค่า ignore patterns สำหรับ files ที่ไม่ใช่ tests
- ติดตาม test results และ failures

3. ติดตามและแก้ไข Test Failures

- ตรวจสอบ test failures ที่เกิดขึ้นทันที
- แก้ไข failing tests ตาม priority
- Debug test issues อย่างเป็นระบบ
- รัน `/resolve-errors` สำหรับ errors ที่ซับซ้อน หรือ `/deep-debug` สำหรับ errors ที่ต้องวางแผนแก้

4. ตรวจสอบ Test Coverage

- ตรวจสอบ coverage reports
- ระบุ code ที่ไม่มี tests
- เพิ่ม tests สำหรับ uncovered code
- Target high coverage สำหรับ critical paths

5. ปรับปรุง Test Performance

- ตรวจสอบ test execution time
- ใช้ parallel execution เมื่อเป็นไปได้
- Optimize test setup
- Minimize wait time

6. รักษา Test Suite

- เพิ่ม tests สำหรับ new code
- Update outdated tests
- Remove obsolete tests
- Refactor tests ถ้าจำเป็น

## Rules

1. Test Reliability

- ไม่ merge code ที่ break tests
- Fix flaky tests ทันที
- Maintain stable test suite
- Investigate failures อย่างเป็นระบบ

2. Real-time Monitoring

- ตรวจสอบ test failures ทันทีที่เกิด
- แก้ไข failures ก่อนทำงานต่อ
- ไม่ commit code ที่ break tests
- รัน tests ก่อน merge

3. Coverage

- Target high coverage
- Focus บน critical paths
- Test edge cases
- Cover error scenarios

4. Performance

- Tests ต้องรันเร็ว
- ใช้ parallel execution
- Optimize test setup
- Minimize wait time

5. Continuous

- รัน tests อย่างต่อเนื่อง
- Integrate กับ CI/CD
- Monitor trends
- Report status

## Expected Outcome

- Tests ทำงานแบบ watch mode อย่างต่อเนื่อง
- Test failures ถูกตรวจสอบและแก้ไขทันที
- Test coverage สูงและครบถ้วน
- Test execution เร็วและเสถียร
- Reliable test suite
