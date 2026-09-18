---
name: review-test-improve-coverage
description: Raise test coverage on critical paths — gaps, edge cases, security tests
argument-hint: "[scope-or-threshold]"
related:
  - review-test
  - run-test

  - update-tests
  - update-specs
  - follow-test
  - follow-tdd
  - report
  - suggest-next-action
  - resolve-errors
---

## Goal

รัน coverage หา gaps จาก findings ของ `/review-test` แล้วเติม tests บน critical paths ก่อนจนถึง threshold ที่กำหนด — พร้อม verify coverage delta

## Scope

- ใช้กับ project ที่มี test infrastructure อยู่แล้ว — วิเคราะห์ coverage gaps แล้วเขียนหรืออัปเดต tests ให้ครอบคลุม
- ไม่ครอบคลุม flaky tests → ใช้ `subskills/fix-flaky/SKILL.md`
- รายละเอียด fix guide ต้นฉบับ: `references/fix-improve-test-coverage.md`

## Execute

### 1. Run Coverage

> Goal: หาจุดที่ test ยังไม่ครอบคลุม

1. ทำ `/run-test` เพื่อดู coverage report
2. บันทึก files, functions, branches, statements ที่ไม่ผ่าน threshold
3. ทำ `/review-test` ถ้ายังไม่มี findings — วิเคราะห์ code paths ที่ไม่มี test
4. กำหนด target coverage threshold (default 100% หรือตาม project กำหนด)

### 2. Identify Priorities

> Goal: เรียง gaps ตาม impact — critical paths ก่อน

1. ระบุ critical paths: auth, permissions, payment, booking, checkout
2. ระบุ security-critical logic: IDOR, userId injection, sanitization, rate limiting
3. ระบุ pure functions, handlers, utilities ที่ไม่มี unit tests
4. ระบุ integration gaps: DB queries, external API calls, service interactions
5. เรียง priority: Critical → High → Medium → Low

### 3. Inspect Test Conventions

> Goal: เขียน test ให้สอดคล้อง project

1. ตรวจ `package.json` test scripts และ framework (`vitest`, `jest`, `playwright` หรือตาม ecosystem)
2. อ่าน test config และตัวอย่าง test files ที่มีอยู่ใน repo
3. ระบุ location และ conventions: `__tests__/`, `tests/unit|integration|e2e/`, naming, mocking, fixtures, factories

### 4. Write Tests By Layer

> Goal: เติม gaps ครบทุก layer เรียง priority

1. Unit: ครอบ happy path, error path, edge cases, boundary values — ใช้ factories/fixtures, mock external dependencies, parameterized tests สำหรับ boundary/permission matrices
2. Integration: test DB หรือ in-memory DB, request/response mapping, error fallback, side effects (DB mutations, cache, queue), cleanup หลังแต่ละ test
3. Security: auth missing/invalid → reject, IDOR deny, userId จาก auth ไม่ใช่ input, sanitization, permission matrix ด้วย `it.each` หรือ equivalent
4. ใช้ `/update-tests` หรือ `/follow-test`/`/follow-tdd` ตาม flow ของ project

### 5. Run And Verify Coverage

> Goal: tests ผ่านและ gaps ลดลงจริง

1. ทำ `/run-test` — แก้ failing tests จนผ่าน (max 3 retry)
2. ทำ `/run-test` (coverage) อีกครั้ง — เปรียบเทียบ before/after
3. ถ้ายังมี gaps ใน critical paths → วน Step 4-5 สูงสุด 5 รอบ ถ้าเกิน → stop และ report

### 6. Update Specs

> Goal: เอกสารสอดคล้อง tests ใหม่

1. ทำ `/update-specs` เพื่อ sync `specs/SPEC.md` กับ test cases ใหม่
2. ทำ `/suggest-next-action` สรุป action ถัดไป

## Rules

- ตั้งชื่อ test: `should [expected behavior] when [condition]` — follow Arrange/Act/Assert, test สิ่งเดียวต่อ case
- Tests isolated ไม่แชร์ state — mock external dependencies และ cleanup mocks หลังแต่ละ test
- ใช้ test database แยก — ไม่ hardcode secrets/tokens/passwords ใน test files
- Coverage ทุก category: lines, branches, functions, statements — บันทึก coverage delta ทุกครั้ง
- Assert output ไม่ใช่ implementation — หลีกเลี่ยง fragile assertions กับ non-deterministic values
- ใช้ conventions ของภาษา/ecosystem ที่ตรวจพบ — ถ้า check ไม่ผ่าน → `/resolve-errors` สูงสุด 3 รอบ

## Expected Outcome

- Coverage gaps ใน critical paths ถูกเติม — coverage report ดีขึ้นพร้อม delta
- Tests รันผ่านทั้งหมดไม่มี false positive — test code มีคุณภาพ
- `specs/SPEC.md` sync กับ tests ใหม่ — next action ชัดเจน

