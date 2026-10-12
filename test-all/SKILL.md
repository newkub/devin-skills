---
name: test-all
description: Orchestrate test suite ทั้งหมด — เลือก test-* domains จาก signals จริง รัน fail-fast ไม่รันทุก type โดยไม่มี signal
argument-hint: "[scope] [target%]"
related:
  - run-test
  - test-unit
  - test-integration
  - test-api
  - test-cli
  - test-contract
  - test-e2e
  - test-visual
  - test-coverage
  - test-mutation
  - test-load
  - test-smoke
  - test-component
  - test-a11y
  - test-property
  - test-database
  - test-mobile
  - deep-review
  - deep-validate
  - update-tests
  - resolve-errors
  - run-lint
  - run-typecheck
  - run-verify
  - create-report-in-dot-devin
  - report
  - ask-me
---

## Goal

Orchestrate test suite ทั้งหมด — เลือก `test-*` domains ที่เกี่ยวข้องจาก signals จริง (ตารางใน `## Scope` ของ `run-test`) แล้วรันตามลำดับ fail-fast — ไม่รัน test เอง ไม่รันทุก type โดยไม่มี signal

## Scope

ใช้เมื่อต้องรันหลาย test domains พร้อมกัน (`/run-test all`) — delegate การรันจริงไป `test-*` skills ตาม signals

## Execute

> Pre-Run: ทำ `/deep-review` ก่อนเสมอ — `test-*` ต้อง review/ประเมินก่อนลงมือหลัก ห้ามข้าม; ถ้า findings เป็น blocker ให้แก้หรือ report ก่อนรัน (test)

### 1. Lint+Typecheck ก่อน

`/run-lint` + `/run-typecheck` ทุก case; แก้ errors ก่อน (ไม่ใช่ test failure)

### 2. Detect Applicable Types

scan `package.json`, configs, test dirs, routes เทียบ signals table (ใน `run-test/SKILL.md` `## Scope`); ถ้าไม่มี tests หรือ coverage ไม่ครบ → `/update-tests` ก่อน; บันทึกรายการ + เหตุผล

### 3. Run Fail-Fast Order

`/test-unit` → `/test-property` → `/test-component` → `/test-database`/`/test-integration` → `/test-api`/`/test-cli`/`/test-contract` (ตาม signals) → `/test-e2e` → `/test-mobile` → `/test-visual` → `/test-a11y`; `/test-load` เมื่อมี perf signal; `/test-smoke` ใช้เป็น post-deploy gate ไม่ใช่ใน suite run; บันทึกผล/duration/failures ต่อ type

### 4. Validate+Classify

`/deep-validate` source + review tests; source ผิด → `/resolve-errors`, test ผิด → `/update-tests`, ไม่ชัด → report; ห้ามแก้โดยไม่มี evidence

### 5. Fix+Rerun

แก้ตาม classification แล้วรันซ้ำ; failure เดิมซ้ำ ≥3 → stop+report

### 6. Coverage

ถ้ามี target → `/test-coverage` วัด+report; gap-closing loop ที่ `/deep-review coverage` (เขียน tests ผ่าน `/update-tests`) จนถึงเป้า (default 100%)

### 7. Report

persist → `.devin/temp/report/<workspace>/test-all-<time>.md`; ผ่านหมด → `/run-verify` (fail → `/resolve-errors` retry ≤3)

## Rules

- เลือก domain จาก signals จริงเท่านั้น; ไม่แน่ใจ → ถาม user
- ห้าม `.skip`/`.only`; ห้ามแก้ assertion ให้อ่อนลง ห้ามแก้ source ให้เข้ากับ test ที่ผิด
- coverage ไม่ถึงเป้า → เพิ่ม tests ไม่ลด target
- report แยก source/test issue พร้อม priority

## Expected Outcome

- Test suite รันครบทุก domain ที่มี signal — fail-fast order
- Report รวม persist ใน `.devin/temp/report/`
- ผ่านหมด → `/run-verify`; fail → `/resolve-errors`
