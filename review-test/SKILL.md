---
name: review-test
description: Review test strategy, quality, และผลลัพธ์หลัง run tests พร้อมสรุป action ถัดไป
related:
  - run-test
  - run-test-coverage
  - write-test
  - update-test
  - follow-test
  - follow-tdd
  - update-config
  - update-devin-global-skills
  - report-table
  - suggest-next-action
  - deep-validate
  - check-reference
  - deep-debug
  - resolve-errors
---

## Goal

Review test strategy และ quality ก่อนเริ่ม run หรือ write tests พร้อม review ผลลัพธ์หลัง run (pass/fail, coverage, flaky) เพื่อสรุป action ถัดไป และอัปเดต skill ผ่าน `/update-devin-global-skills` เมื่อพบ gap

## Scope

ใช้ได้ทั้งก่อนและหลังการรัน tests:

- ก่อน: ใช้ก่อน `run-test`, `write-test`, `follow-test`, `follow-tdd`, `update-test`, `run-test-coverage` — ตรวจ test strategy ครอบคลุม coverage, edge cases, isolation, pyramid balance, regression
- หลัง: ใช้หลัง `run-test`, `run-test-coverage`, `write-test`, `follow-tdd`, `update-test`, หรือ `follow-test` — วิเคราะห์ผลลัพธ์, coverage delta, flaky, สรุป action

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
5. ถ้า regression ล้มเหลวใน CI/CD หรือต้อง monitor จนผ่าน → ส่งต่อ `/watch-ci-cd`

### 7. Pre-Run Score And Report

> Goal: สรุป test quality score และ coverage gap report ก่อน run

1. คำนวณ test quality score จาก [references/test-quality-score.md](references/test-quality-score.md)
2. ทำ `/report` พร้อม `/report-table`
3. สร้างตาราง Test Quality Summary: No., Category, Status, Findings, Score
4. สร้างตาราง Coverage Gap Report: No., File, Missing Tests, Coverage Type, Priority
5. สร้างตาราง Edge Case Gaps: No., Function, Missing Category, Severity, Action
6. ทำ `/suggest-next-action` เพื่อแนะนำ action ถัดไป

### 8. Capture Output And Classify Failures

> Goal: เก็บผลลัพธ์และจัดหมวดหมู่ failures หลัง run tests

1. อ่าน stdout/stderr จาก `run-test` หรือ `run-test-coverage`
2. บันทึกไฟล์ผลลัพธ์: `vitest` → `vitest-output.jsonl`, `cargo test` → `cargo-test-output.txt`
3. ตรวจสอบ exit code: `0` = pass, `non-zero` = fail
4. แยก failures เป็น:
   - `assertion`: test logic ผิดหรือ implementation ผิด
   - `runtime`: exception, timeout, unhandled rejection
   - `flaky`: ผ่านบางครั้ง ไม่ผ่านบางครั้ง โดยไม่มีการเปลี่ยน code
   - `setup`: fixture, mock, database, หรือ environment ผิด
5. ระบุ file path และ test name สำหรับทุก failure
6. ตรวจสอบ stack trace แล้วหา root cause
7. ถ้ามี coverage report → เก็บไฟล์ `coverage/index.html` หรือ `coverage/coverage-summary.json`

### 9. Analyze Coverage Delta And Detect Flakiness

> Goal: ตรวจ coverage หลัง run และหา tests ทีไม่เสถียร

1. เปรียบเทียบ coverage กับ target: Minimal 70%, Standard 85%, Complete 100%
2. ระบุไฟล์ที coverage ลดลง หรือ source files ทีไม่ถูก test
3. ใช้ `jq` อ่าน `coverage/coverage-summary.json` เพื่อดูเปอร์เซ็นต์
4. ระบุ branches/functions/statements ที missing
5. รัน test ซ้ำ 3 รอบ ถ้า result ไม่ consistent
6. ตรวจสอบ race condition, shared state, async timing, random data
7. ตรวจ `beforeEach`/`afterEach` cleanup
8. ถ้า flaky → คั่นด้วย `tag` และแนะนำให้แก้ก่อน merge

### 10. Decide Actions, Update Skills And Report

> Goal: สรุป action ถัดไป อัปเดต skill ถ้าพบ systemic gap และ report

1. ถ้ามี assertion/implementation failure → แนะนำ `update-test` หรือ `deep-debug`
2. ถ้ามี runtime/setup failure → แนะนำ `resolve-errors` หรือ `update-config`
3. ถ้ามี coverage gap → แนะนำ `write-test` หรือ `update-test`
4. ถ้ามี flaky → แนะนำ refactor test หรือ `follow-test`
5. ถ้าผลลัพธ์ทำให้รู้ว่า skill/flow ใดควรปรับปรุง → ใช้ `/update-devin-global-skills`
6. ถ้าพบว่า skill ทีใช้ (เช่น `write-test`, `update-test`, `follow-test`) ยังไม่ครอบคลุมกรณีทีเจอ → บันทึก gap
7. รัน `/update-devin-global-skills <skill-name>` เพื่อ update skill นั้น
8. ทำ `/deep-validate` และ `/check-reference` หลัง update
9. ไม่ update skill โดยไม่มี evidence จาก test result
10. ทำ `/report-table` ด้วยคอลัมน์: No., Test, Status, Category, Root Cause, Action
11. ทำ Coverage Delta Report: File, Before, After, Gap, Priority
12. ทำ Flaky Report: Test, Run 1, Run 2, Run 3, Suspected Cause
13. ทำ `/suggest-next-action` ตาม priority

## Rules

### 1. Review Only

- ทำ review strategy และผลลัพธ์เท่านั้น ไม่แก้ไข source/test code ระหว่าง review
- ถ้าต้องเขียน/แก้ tests → ใช้ `write-test` หรือ `update-test` หลัง review
- ถ้าต้องแก้ไข source code จาก failure → ส่งต่อให้ `deep-debug` หรือ `resolve-errors`
- ถ้าต้องแก้ไข config → ส่งต่อให้ `update-config`

### 2. Evidence-Based Findings

- ทุก finding ต้องมี evidence จาก test output หรือ coverage report
- ระบุ file path, test name, line number (ถ้ามี)
- ใช้ `Grep`, `scan-codebase`, `jq`, หรือ `grep` ดึงข้อมูลจาก output ไฟล์
- ตรวจ source files และ test files แบบ cross-reference
- จัดลำดับตาม severity: Critical → High → Medium → Low

### 3. Scoring

- คะแนนต่อ category: ผ่าน = 1, เตือน = 0.5, ไม่ผ่าน = 0
- Test quality score = (total score / total categories) × 100%
- Grade: A (90+), B (80+), C (70+), D (60+), F (<60)
- Score < 70 → แนะนำให้เขียน tests เพิ่มก่อน run

### 4. Skill Update Discipline

- ใช้ `/update-devin-global-skills` เฉพาะเมื่อ test result พบ gap ใน skill ทีมีอยู่จริง
- ไม่อัปเดต skill เพียงเพราะ project test fail ปกติ
- ต้องสร้าง issue/หมายเหตุก่อน update skill

### 5. Safety

- ไม่ expose secrets จาก test output หรือ coverage report
- ไม่รัน destructive commands ระหว่าง review
- ทำ dry run ถ้าต้อง re-run tests เพื่อ verify flakiness

### 6. Formatting

- ห้ามใช้ `**` (bold markers) — ใช้ backticks สำหรับ emphasis
- ใช้ heading levels สำหรับ structure
- รายงานเป็นตารางด้วย `/report-table`

## Expected Outcome

- รายงาน Test Quality Summary พร้อม score, grade และ progress bar
- รายงาน Coverage Gap Report พร้อม priority
- รายงาน Edge Case Gaps พร้อม action required
- หลัง run tests ได้ผลลัพธ์ทีสมบูรณ์: failures, coverage, flaky
- รายการ action ถัดไปเรียงตาม priority
- Coverage delta report เปรียบเทียบกับ target
- Flaky test report ถ้ามี
- Skill ทีเกี่ยวข้องถูกอัปเดตผ่าน `/update-devin-global-skills` เมื่อจำเป็น
- `/suggest-next-action` แนะนำขั้นตอนถัดไปชัดเจน
