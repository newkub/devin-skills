---
name: test-mutation
description: รัน mutation tests — วัด assertion strength ด้วย mutants (kill rate) complement coverage
argument-hint: "[scope]"
related:
  - run-test
  - test-all
  - test-coverage
  - deep-review
  - deep-test
  - update-tests
  - resolve-errors
  - run-verify
  - follow-tool-stryker-mutator
  - create-report-in-dot-devin
  - report
---

## Goal

รัน mutation tests — วัด assertion strength ด้วย mutants (kill rate) complement coverage — signals: critical logic, `stryker.conf`, mutation config; tools: `stryker` (JS/TS — `/follow-tool-stryker-mutator`), `cargo-mutants` (Rust), `mutmut` (Python)

## Scope

ใช้เมื่อต้องรัน mutation tests — run-only ไม่แก้ tests (analysis ลึก → `/deep-test mutation`)

## Execute

> Pre-Run: ทำ `/deep-review` ก่อนเสมอ — `test-*` ต้อง review/ประเมินก่อนลงมือหลัก ห้ามข้าม; ถ้า findings เป็น blocker ให้แก้หรือ report ก่อนรัน (test)

### 1. Detect

`stryker.conf.*`, `mutmut` config, `cargo-mutants`; JS/TS → `bunx stryker run`, Rust → `cargo mutants`, Python → `mutmut run`; กำหนด scope — mutation ช้า เลือก critical/highest-risk modules (payment, auth, domain logic); baseline unit suite fail → แก้ก่อน

### 2. Run

capture score (killed/survived/timeout/no-coverage); run นาน → blocking+timeout สูง หรือ incremental; บันทึก survived mutants พร้อม file:line + type

### 3. Classify

survived + behavior เปลี่ยนจริง → assertion ขาด → `/update-tests`; survived + equivalent mutant → noise ไม่เขียน test เพิ่ม; mutant เผย dead code/bug → report หรือ `/resolve-errors`; วน assertions → รันใหม่ → score ต้องขึ้นจริง

### 4. Report

persist → `.devin/temp/report/<workspace>/mutation-test-<time>.md` — score before→after, survived เหลือ+เหตุผล, noise count; ผ่านหมด → `/run-verify`

## Rules

- run-only (analysis ลึก → `/deep-test mutation`)
- ไม่นับ equivalent mutants เป็น failures
- ห้ามปรับ thresholds ลง — score ต่ำ = ข้อมูลจริง report
- complement `/test-coverage` ไม่แทน
- จำกัด scope ต่อรอบ

## Expected Outcome

- Mutation score วัดได้ พร้อม survived mutants + file:line
- Score before→after หลังเสริม assertions
- Report persist ใน `.devin/temp/report/`
