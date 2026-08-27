---
name: review-test
description: Review test strategy และ quality ก่อน run/write test
related:
  - review-test-result
  - update-devin-global-skills
  - run-test
  - run-test-coverage
  - write-test
  - update-test
  - follow-test
---

## Goal

Review test strategy และ quality ก่อนเริ่ม run หรือ write tests เพื่อยืนยันว่า coverage gaps, edge cases, boundary conditions, test isolation, fixtures, flakiness, test pyramid balance และ regression coverage ครบถ้วน

## Scope

ใช้ก่อนเรียก `run-test`, `write-test`, `follow-test`, `follow-tdd`, `update-test`, `run-test-coverage`, หรือ `follow-test` — ตรวจ test strategy ครอบคลุม coverage, edge cases, isolation, pyramid balance, regression แล้วสรุป test quality score พร้อม coverage gap report

## Execute

### 1. Prepare Context

> Goal: เข้าใจ test structure และ project context

1. ทำ `/scan-codebase` เพื่อเข้าใจ project structure และ test setup
2. ตรวจสอบ test framework จาก `package.json`, `Cargo.toml`, `pyproject.toml`, `go.mod`
3. ตรวจ test config files: `vitest.config.ts`, `jest.config.js`, `pytest.ini`
4. ตรวจ test directory structure: `tests/unit/`, `tests/integration/`, `tests/e2e/`, `tests/fixtures/`
5. ถ้าไม่พบ test setup → flag เป็น critical gap

### 2. Detect Coverage Gaps

> Goal: ระบุ coverage gaps ก่อน `run-test-coverage`

1. ตรวจ source files ที่ไม่มี corresponding test files
2. ตรวจ functions และ branches ที่ไม่ถูก test
3. ตรวจ coverage categories: lines, branches, functions, statements
4. ตรวจ coverage targets ตาม level: Minimal (70%), Standard (85%), Complete (100%)
5. ดูรายละเอียดใน [references/coverage-gaps.md](references/coverage-gaps.md)

### 3. Check Edge Cases And Boundaries

> Goal: ตรวจ edge cases และ boundary conditions ครบถ้วน

1. ตรวจ happy path, error path, edge cases ครบทุก handler/function
2. ตรวจ boundary values: min, max, min-1, max+1, empty, null, undefined
3. ตรวจ input validation tests สำหรับ invalid input
4. ตรวจ security tests: auth bypass, IDOR, sanitization, userId injection
5. ดูรายละเอียดใน [references/edge-cases.md](references/edge-cases.md)

### 4. Check Test Isolation And Fixtures

> Goal: ตรวจ test isolation และ fixture quality

1. ตรวจ tests ไม่แชร์ state ระหว่างกัน
2. ตรวจ cleanup หลังแต่ละ test: `afterEach`, `teardown`
3. ตรวจ fixtures และ factories ใช้งานได้และไม่ hardcode sensitive data
4. ตรวจ mock strategy: mock external dependencies เท่านั้น
5. ดูรายละเอียดใน [references/test-isolation.md](references/test-isolation.md)

### 5. Check Test Pyramid Balance

> Goal: ตรวจ test pyramid balance เหมาะสม

1. ตรวจ unit tests ประมาณ 70% ของทั้งหมด
2. ตรวจ integration tests ประมาณ 20%
3. ตรวจ e2e tests ประมาณ 10%
4. ตรวจ performance: unit < 10ms, integration < 100ms
5. ดูรายละเอียดใน [references/test-pyramid.md](references/test-pyramid.md)

### 6. Check Regression Coverage

> Goal: ตรวจ regression coverage ครบถ้วน

1. ตรวจ bug fixes มี regression tests
2. ตรวจ critical paths มี regression coverage
3. ตรวจ mutation testing สำหรับ critical code (score > 80%)
4. ตรวจ CI/CD pipeline รัน regression tests อัตโนมัติ

### 7. Score And Report

> Goal: สรุป test quality score และ coverage gap report

1. คำนวณ test quality score จาก [references/test-quality-score.md](references/test-quality-score.md)
2. ทำ `/report` พร้อม `/report-table`
3. สร้างตาราง Test Quality Summary: No., Category, Status, Findings, Score
4. สร้างตาราง Coverage Gap Report: No., File, Missing Tests, Coverage Type, Priority
5. สร้างตาราง Edge Case Gaps: No., Function, Missing Category, Severity, Action
6. ทำ `/suggest-next-action` เพื่อแนะนำ action ถัดไป

## Rules

### 1. Review Independence

- ทำ review เท่านั้น ไม่แก้ไข tests ระหว่าง review
- ถ้าต้องเขียน tests ให้ใช้ `write-test` หรือ `update-test` หลัง review
- ทุก finding ต้องมี file path และ evidence

### 2. Evidence-Based Findings

- ใช้ `Grep` และ `scan-codebase` สำหรับ verification
- ตรวจ source files และ test files แบบ cross-reference
- จัดลำดับตาม severity: Critical → High → Medium → Low

### 3. Scoring

- คะแนนต่อ category: ผ่าน = 1, เตือน = 0.5, ไม่ผ่าน = 0
- Test quality score = (total score / total categories) × 100%
- Grade: A (90+), B (80+), C (70+), D (60+), F (<60)
- Score < 70 → แนะนำให้เขียน tests เพิ่มก่อน run

### 4. Formatting

- ห้ามใช้ `**` (bold markers) — ใช้ backticks สำหรับ emphasis
- ใช้ heading levels สำหรับ structure
- รายงานเป็นตารางด้วย `/report-table`

## Expected Outcome

- รายงาน Test Quality Summary พร้อม score และ grade
- รายงาน Coverage Gap Report พร้อม priority
- รายงาน Edge Case Gaps พร้อม action required
- Test quality score พร้อม progress bar
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`
- หลัง run tests แล้วให้ใช้ `/review-test-result` เพื่อวิเคราะห์ผลลัพธ์ และ `/update-devin-global-skills` ถ้าพบ skill gap
