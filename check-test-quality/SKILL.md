---
name: check-test-quality
description: ตรวจ test quality — assertion-less tests, skip leftovers, smoke tests ที่ไม่ได้ทดสอบ logic
argument-hint: "[test-path]"
allowed-tools:
  - exec
  - grep
  - find_file_by_name
related:
  - review-test
  - check-test-isolation
  - use-astgrep
  - update-tests
  - run-test-coverage
  - report
---

## Goal

สแกน test files หา "dishonest tests" — tests ที่ผ่านแต่ไม่ได้ทดสอบ behavior — เช่น ไม่มี assertion, import-only smoke, `.skip`/`.only` ค้าง, tautological assertions — เพื่อป้องกัน coverage ที่สูงแต่ไร้ค่า

## Scope

- ครอบคลุม test files ทุก runner (Vitest, Jest, Bun, pytest, go test, cargo test)
- Read-only: หา violations + report — แก้ผ่าน `/update-tests` หรือ `/review-test`

## Execute

### 1. Scan For Missing Assertions

> Goal: หา tests ที่ไม่ assert อะไรเลย

1. ใช้ `/use-astgrep` หรือ grep หา `it(`/`test(`/`test_`/`func Test` blocks ที่ไม่มี `expect`/`assert`/`require`/snapshot call ข้างใน
2. หา try/catch ใน test ที่ swallow error โดยไม่ assert
3. หา test bodies ว่างเปล่าหรือ comment-only

### 2. Scan For Disabled Tests

> Goal: หา tests ที่ถูกปิดทิ้ง

1. หา `.skip`, `.only`, `xit`, `xtest`, `test.todo`, `#[ignore]`, `@pytest.mark.skip` ที่ค้างอยู่
2. `.only` ที่ commit ค้าง = suite ถูกลดขนาดเงียบๆ — severity Critical
3. `.skip` ที่มี comment เหตุผล + issue link → Info; ไม่มีเหตุผล → Warning

### 3. Scan For Weak Patterns

> Goal: หา assertions ที่ไม่ได้ทดสอบอะไรจริง

1. Tautological: `expect(true).toBe(true)`, `assertTrue(true)`, `expect(x).toBeDefined()` บน literal
2. Import-only smoke: file ที่แค่ `import` แล้ว assert defined — ไม่นับเป็น logic coverage
3. Snapshot-only tests ที่ snapshot ทั้งหน้าโดยไม่มี targeted assertion
4. Mock ที่ return ค่าที่ test assert — circular, ไม่ได้ทดสอบ source

### 4. Report

> Goal: รายงาน violations พร้อม severity

1. ทำ `/report` ตาราง: `No.`, `Test/File`, `Violation`, `Severity` (Critical/Warning/Info), `Fix`
2. Critical (`.only` ค้าง, tests ไม่มี assertion เลย) → แนะนำ `/update-tests` หรือ `/resolve-errors`
3. ถ้าไม่พบปัญหา → report "no issues found"

## Rules

- Read-only — ไม่แก้ test files ใน skill นี้
- ทุก finding ต้องมี file + line + recommendation
- กรอง false positives: test helpers, fixture files, `.skip` ที่มีเหตุผลชัดเจน
- ใช้ /check-test-isolation ถ้าจำเป็น · ใช้ /suggest-next-action ถ้าจำเป็น

## Expected Outcome

- Dishonest/disabled tests ถูกระบุพร้อม file:line + severity + fix recommendation
- ไม่มี false positives — ทุก finding audit ได้
