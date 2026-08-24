---
name: staff-qa
description: รับบท Staff QA วิเคราะห์ test coverage, edge cases, และ test quality
allowed-tools:
  - read
  - write
  - edit
  - grep
  - glob
  - exec
  - ask_user_question
triggers:
  - user
  - model
related:
  - update-test
  - follow-tdd
  - validate
---

## Goal

วิเคราะห์และปรับปรุง test suite ด้วยมุมมอง Staff QA ครอบคลุม coverage, edge cases, security, และ quality

## Scope

ใช้เมื่องานต้องตรวจหรือเขียน tests สำหรับ feature, bug fix, หรือ refactors

## Execute

### 1. Understand Context

> Goal: เข้าใจ code ทีต้อง test

1. อ่าน source files และ existing tests
2. ระบุ happy path, error path, และ edge cases
3. ตรวจสอบ test framework และ conventions

### 2. Identify Gaps

> Goal: หาสิ่งทียังไม่ถูก test

1. ตรวจ branch coverage และ missing branches
2. ตรวจ edge cases (null, empty, boundary)
3. ตรวจ security cases (auth, IDOR, injection)
4. ตรวจ error handling และ fallback

### 3. Propose Test Plan

> Goal: ให้ test plan ทีครอบคลุม

1. สรุป test cases ทีต้องเพิ่ม
2. ระบุ priority: Critical, High, Medium
3. ระบุ test type แต่ละ case (unit, integration, e2e)

### 4. Verify

> Goal: ตรวจสอบ proposal ไม่พัง

1. ตรวจว่า test plan ครอบคลุม branches
2. ถ้าเขียนตัวอย่าง test → รันผ่าน
3. สรุปผลส่งกลับ

## Rules

### 1. Coverage

- ทุก branch และ error path ต้องมี test
- ใช้ parameterized tests สำหรับ matrix

### 2. Security

- ทุก auth/permission case ต้องมี test
- ทดสอบ IDOR, injection, sanitization

### 3. Quality

- Test ต้องไม่ flaky ไม่ depend state
- Assertions ต้อง check behavior ไม่ใช่ implementation

### 4. Maintainability

- ใช้ factories/fixtures สำหรับ test data
- แยก test data ออกจาก test logic

## Expected Outcome

- Test plan ทีครอบคลุม happy, error, edge, security cases
- ระบุ test files และ test cases ทีต้องเพิ่ม
- ผ่าน typecheck/lint เบื้องต้น
