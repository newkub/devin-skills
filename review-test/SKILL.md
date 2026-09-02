---
name: review-test
description: Review test strategy, quality, และผลลัพธ์หลัง run tests พร้อมสรุป action ถัดไป
related:
  - run-test
  - run-test-coverage
  - update-test-and-fix
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

- ก่อน: ใช้ก่อน `run-test`, `follow-test`, `follow-tdd`, `update-test-and-fix`, `run-test-coverage` — ตรวจ test strategy ครอบคลุม coverage, edge cases, isolation, pyramid balance, regression
- หลัง: ใช้หลัง `run-test`, `run-test-coverage`, `follow-tdd`, `update-test-and-fix`, หรือ `follow-test` — วิเคราะห์ผลลัพธ์, coverage delta, flaky, สรุป action

## Execute

### 1. Prepare

ทำตาม `references/prepare.md` เพื่อเข้าใจ project structure, test framework, test config และ directory structure ก่อน review

### 2. Coverage

ทำตาม `references/coverage-gaps.md` เพื่อระบุ source files, functions, branches และ coverage categories ที่ยังไม่ถูก test

### 3. Edge Cases

ทำตาม `references/edge-cases.md` เพื่อตรวจ happy path, error path, boundary values, validation และ security tests

### 4. Isolation

ทำตาม `references/test-isolation.md` เพื่อตรวจ test isolation, cleanup, fixtures/factories, mock strategy และ flakiness

### 5. Pyramid

ทำตาม `references/test-pyramid.md` เพื่อตรวจ distribution unit/integration/e2e, performance targets, test types และ CI integration

### 6. Regression

ทำตาม `references/regression-coverage.md` เพื่อตรวจ regression tests สำหรับ bug fixes, critical paths, mutation testing และ CI pipeline

### 7. Pre-Run Score

ทำตาม `references/test-quality-score.md` เพื่อคำนวณ test quality score, grade และ go/no-go ก่อน run

### 8. Capture Output

ทำตาม `references/capture-output.md` เพื่ออ่าน stdout/stderr, บันทึกไฟล์ output, ตรวจ exit code และจัดหมวดหมู่ failure

### 9. Analyze Coverage/Flaky

ทำตาม `references/analyze-coverage-flaky.md` เพื่อเปรียบเทียบ coverage target, หา missing branches, รัน test ซ้ำ และตรวจ root cause ของ flaky

### 10. Decide Actions

ทำตาม `references/decide-actions.md` เพื่อสรุป action ถัดไป, อัปเดต skill เมื่อพบ systemic gap และสร้างรายงาน

## Rules

1. Review Only: ทำ review strategy และผลลัพธ์เท่านั้น ไม่แก้ไข source/test code ระหว่าง review — ถ้าต้องเขียน/แก้ tests ใช้ `update-test-and-fix`, ถ้าต้องแก้ source ใช้ `deep-debug` หรือ `resolve-errors`, ถ้าต้องแก้ config ใช้ `update-config`
2. Evidence-Based Findings: ทุก finding ต้องมี evidence จาก test output หรือ coverage report — ระบุ file path, test name, line number (ถ้ามี), ใช้ `Grep`, `scan-codebase`, `jq` หรือ `grep` ดึงข้อมูลจาก output ไฟล์, จัดลำดับตาม severity: Critical → High → Medium → Low
3. Scoring: คะแนนต่อ category ผ่าน = 1, เตือน = 0.5, ไม่ผ่าน = 0 — test quality score = (total score / total categories) × 100% — Grade A (90+), B (80+), C (70+), D (60+), F (<60) — Score < 70 → แนะนำให้เขียน tests เพิ่มก่อน run
4. Skill Update Discipline: ใช้ `/update-devin-global-skills` เฉพาะเมื่อ test result พบ gap ใน skill ที่มีอยู่จริง — ไม่อัปเดต skill เพียงเพราะ project test fail ปกติ — บันทึกหมายเหตุ/เหตุผลก่อน update skill
5. Safety: ไม่ expose secrets จาก test output หรือ coverage report — ไม่รัน destructive commands ระหว่าง review — ทำ dry run ถ้าต้อง re-run tests เพื่อ verify flakiness
6. Formatting: ห้ามใช้ `**` (bold markers) — ใช้ backticks สำหรับ emphasis — ใช้ heading levels สำหรับ structure — รายงานเป็นตารางด้วย `/report-table`

- ใช้ /deep-validate ถ้าจำเป็น
- ใช้ /check-reference ถ้าจำเป็น

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
