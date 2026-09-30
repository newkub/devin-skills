---
name: run-test-mutation
description: รัน mutation tests — วัด assertion strength ด้วย mutants ไม่ใช่แค่ line coverage
argument-hint: "[scope]"
related:
  - run-test-all
  - run-test
  - run-test-coverage
  - deep-test
  - deep-review
  - update-tests
  - resolve-errors
  - follow-tool-stryker-mutator
  - create-report-in-dot-devin
  - report
---

## Goal

รัน mutation tests — วัดว่า tests จับ defects ได้จริงโดย inject mutants เข้า source แล้ววัด kill rate — complement coverage ที่วัดแค่ execution

## Scope

Runner ของ mutation domain เท่านั้น — mutation analysis ลึกไป `/deep-test mutation` (`deep-test/references/mutation.md`); ปรับ assertions/เขียน tests → `/update-tests`; เลือกโดย `/run-test-all` เมื่อพบ signals: critical logic, `stryker.conf`, mutation config ใน project

- Tools: `stryker` (JS/TS — ดู `/follow-tool-stryker-mutator`), `cargo-mutants` (Rust), `mutmut` (Python)
- ถ้าต้องการเขียน tests ใหม่ → `/update-tests` (run-only skill นี้ไม่เขียน tests)

## Execute

> Pre-Run: ทำ `/deep-review` ก่อนเสมอ — `run-*` ต้อง review/ประเมินก่อนลงมือหลัก ห้ามข้าม; ถ้า findings เป็น blocker ให้แก้หรือ report ก่อนรัน (test mutation)

### 1. Detect Mutation Tooling

> Goal: เลือก mutator ตาม ecosystem

1. ตรวจ config — `stryker.conf.*`, `mutmut` config, Cargo.toml workspace + `cargo-mutants`
2. JS/TS → `bunx stryker run`; Rust → `cargo mutants`; Python → `mutmut run`
3. กำหนด scope — mutation test ช้า, เลือก critical modules จาก argument หรือ highest-risk paths (payment, auth, domain logic)
4. ถ้า baseline unit suite ยัง fail → แก้ก่อน — mutation บน suite ที่แดงไม่มีความหมาย

### 2. Run Mutation Tests

> Goal: ได้ mutation score ที่เชื่อถือได้

1. รัน mutator บน scope ที่กำหนด — capture score (killed/survived/timeout/no-coverage)
2. mutation run นาน → รัน blocking พร้อม timeout สูง หรือ incremental mode ถ้ามี
3. บันทึก survived mutants พร้อม file:line และ mutation type

### 3. Classify Survived Mutants

> Goal: แยก assertion gap กับ equivalent mutant กับ source issue

1. survived + behavior เปลี่ยนจริง → assertion ขาด → `/update-tests` เพิ่ม assertion
2. survived + equivalent mutant (behavior เดิม) → บันทึกเป็น noise, ไม่เขียน test เพิ่ม
3. mutant เผย dead code/source bug → report หรือ `/resolve-errors`
4. วน: เขียน assertions → รัน mutation ใหม่ → คะแนนต้องขึ้นจริง

### 4. Report

> Goal: รายงาน audit ได้

1. สรุป mutation score (before→after), survived mutants ที่เหลือ + เหตุผล, equivalent/noise count
2. persist → `.devin/temp/report/<workspace>/mutation-test-<time>.md` ตาม format `/create-report-in-dot-devin`
3. ผ่านหมดและต้องการ verify ครบวงจร → `/run-verify`

## Rules

### 1. Run Only

- ไม่เขียน tests ใน skill นี้ → `/update-tests`
- วิเคราะห์ mutator configuration ลึก → `/deep-test mutation`

### 2. Honest Scoring

- ไม่นับ equivalent mutants เป็น failures — แยกหมวด noise ชัดเจน
- ห้ามปรับ mutator thresholds ลงเพื่อให้ผ่าน — score ต่ำ = ข้อมูลจริง ให้ report
- mutation ไม่แทน coverage — complement กับ `/run-test-coverage` เท่านั้น

### 3. Scope Discipline

- จำกัด scope ต่อรอบ — mutation test เต็ม codebase ช้ามาก; เลือก high-risk modules ก่อน
- ใช้ /run-test-all ถ้าจำเป็น · ใช้ /run-check ถ้าจำเป็น · ใช้ /suggest-next-action ถ้าจำเป็น

## Expected Outcome

- Mutation score จริงพร้อม survived/killed/noise breakdown
- Survived mutants classify พร้อม file:line — assertion gaps ถูกส่งต่อ `/update-tests`
- Report persisted พร้อม before→after delta
