---
name: test-coverage
description: รัน coverage แล้วเพิ่ม tests วนจนถึง target (default 100%) ทุก category — Lines, Statements, Functions, Branches
argument-hint: "[scope] [target%]"
related:
  - run-test
  - test-all
  - test-unit
  - deep-review
  - deep-test
  - update-tests
  - resolve-errors
  - run-verify
  - create-report-in-dot-devin
  - report
---

## Goal

รัน coverage แล้วเพิ่ม tests วนจนถึง `100%` ทุก category — Lines, Statements, Functions, Branches — หรือเป้าจาก argument (`[target%]`); ห้ามลดเป้าเพื่อให้ผ่าน; ห้ามยิง production/external services

## Scope

ใช้เมื่อต้องวัดและปิด coverage gaps — run+loop; analysis ลึก → `/deep-test coverage`; signals: coverage config หรือ target กำหนดไว้ (default target 100%)

## Execute

> Pre-Run: ทำ `/deep-review` ก่อนเสมอ — `test-*` ต้อง review/ประเมินก่อนลงมือหลัก ห้ามข้าม; ถ้า findings เป็น blocker ให้แก้หรือ report ก่อนรัน (test)

### 1. Define Scope

audit coverage config ที่มี (`vitest.config`, `jest.config`, `nyc`, `c8`, `cargo-llvm-cov`) ด้วย `/deep-review` ก่อนวัด; กำหนด include/exclude จาก argument+signals — "logic-only" → ตัด UI/runtime-bound modules ที่ test ไม่ได้จริง บันทึกเหตุผลไว้; exclude tests/generated/type-only เสมอ; ตั้ง `thresholds` = เป้าให้ fail ชัดเจน

### 2. Baseline

รัน coverage เก็บ summary ทุก category + per-file uncovered; persist raw (`coverage-final.json`, lcov); ถึงเป้าทุก category → ข้ามไป step 5

### 3. Close Gaps (Loop)

ส่ง uncovered analysis เข้า `/deep-review coverage` เจ้าของ loop (prioritize → เขียน tests ผ่าน `/update-tests` → re-measure); test เผย source bug → `/resolve-errors` ไม่ปรับ assertion; วนจนถึงเป้า; ซ้ำ ≥3 ไม่คืบหน้า → stop+report blocker

### 4. Validate

ตรวจ uncovered = 0 จาก raw JSON (ระวัง files หายเพราะไม่ถูก include); branches ครบทุกฝั่ง (ternary/optional-chain/short-circuit); รัน suite ซ้ำ 2 ครั้ง deterministic

### 5. Report

persist → `.devin/temp/report/<workspace>/test-coverage-<time>.md` — baseline→final delta, files เพิ่ม, source bugs, exclusions+เหตุผล

## Rules

- default 100% ทุก category
- ห้ามลดเป้า/ยกเลิก thresholds/exclude เพิ่มเพื่อผ่าน
- tests ต้อง assert behavior — import smoke ไม่นับ
- gap เผย dead code → report ไม่ลบเอง
- ลบ debug artifacts ชั่วคราวหลังจบ

## Expected Outcome

- Coverage ถึงเป้าทุก category (default 100%) พร้อม baseline→final delta
- Source bugs ที่ test เผยถูก report แยก
- Report persist ใน `.devin/temp/report/`
