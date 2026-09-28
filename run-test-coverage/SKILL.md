---
name: run-test-coverage
description: รัน test coverage แล้วเพิ่ม tests จน coverage ถึง 100% ทุก category — ไม่ลด target ไม่ยอมต่ำกว่าเป้า
argument-hint: "[scope] [target%]"
related:
  - check-test-quality
  - check-coverage-config
  - review-test
  - update-tests
  - resolve-errors
  - report
  - create-report-in-dot-devin
---

## Goal

รัน coverage ของ test suite แล้วเพิ่ม tests วนจนกว่า coverage จะถึง `100%` ทุก category — Lines, Statements, Functions, Branches — หรือถึงเป้าที่ user กำหนดใน argument โดยห้ามลดเป้าหมายเพื่อให้ผ่าน

## Scope

- Default target: `100%` ทุก category — ยกเว้น argument ระบุเป้าอื่นชัดเจน (เช่น `logic-only → 100%` = scope เฉพาะ logic modules)
- ถ้ามี scope (path/workspace/feature) → กำหนด include/exclude ที่ deterministic ใน coverage config ก่อนวัด
- ถ้าต้องเขียน tests จำนวนมาก → delegate การเขียนไป `/update-tests` แต่ยังเป็นเจ้าของการวัดและยืนยันผล 100%
- ห้ามยิง production/external services

## Execute

> Pre-Run: ทำ `/review-test` ก่อนเสมอ — `run-*` ต้อง review/ประเมินก่อนลงมือหลัก ห้ามข้าม; ถ้า findings เป็น blocker ให้แก้หรือ report ก่อนรัน (test coverage)

### 1. Define Coverage Scope

> Goal: วัดสิ่งที่ตั้งใจจะวัด — deterministic และซ้ำได้

1. ตรวจ coverage config ที่มีอยู่ (`vitest.config`, `jest.config`, `nyc`, `c8`, `cargo-llvm-cov` ฯลฯ) และ script ที่รัน coverage — audit ความครบของ config ด้วย `/check-coverage-config` ก่อนวัด
2. กำหนด include/exclude จาก argument + signals:
   - ระบุ scope → include เฉพาะ scope นั้น
   - "logic-only" → ตัด UI components, runtime-bound modules (native glue, DOM-only side effects) ที่ทดสอบไม่ได้จริงในสภาพแวดล้อม test ออก แล้วบันทึกเหตุผลของ exclusion ไว้ใน config/comment
   - exclude tests, generated files, type-only/declarative files เสมอ
3. ยืนยัน thresholds ใน config ตรงเป้า — ตั้ง `thresholds` = 100 (หรือเป้าจาก argument) เพื่อให้ fail ชัดเจนเมื่อไม่ถึง

### 2. Run Baseline

> Goal: ได้ baseline ที่เชื่อถือได้

1. รัน coverage — เก็บ summary: lines, statements, functions, branches + per-file uncovered
2. Persist raw output (`coverage-final.json`, lcov) เพื่อวิเคราะห์ gap
3. ถ้าทุก category ถึงเป้า → ข้ามไป Step 5

### 3. Close The Gaps (Loop)

> Goal: เพิ่ม tests จนครบ — วนจนถึงเป้า

1. ส่ง uncovered analysis เข้า `/review-test coverage` — เจ้าของ gap-closing loop (prioritize → เขียน tests ผ่าน `/update-tests` → re-measure)
2. ถ้า test เผย `source bug` → แก้ source แยก (`/resolve-errors`) ไม่ใช่ปรับ assertion ให้อ่อนลง
3. วนจนทุก category ถึงเป้า — failure เดิมซ้ำ ≥3 รอบโดยไม่คืบหน้า → stop และ report blocker

### 4. Validate The Result

> Goal: ตัวเลขจริง ไม่ใช่ illusion

1. ตรวจว่า uncovered = 0 จาก raw JSON ไม่ใช่แค่ตารางสรุป — ระวัง files ที่หายไปจาก report เพราะไม่ถูก include
2. ตรวจ branches: ternary/optional-chain/short-circuit ทุกฝั่งต้องถูก execute
3. รัน suite ซ้ำ 2 ครั้ง — deterministic ไม่มี flaky

### 5. Report And Persist

> Goal: ส่งมอบผลที่ audit ได้

1. ทำ `/report` สรุป: baseline → final, per-category delta, files ที่เพิ่ม, source bugs ที่พบ/แก้
2. persist → `.devin/reports/<workspace>/test-coverage-<time>.md` ตาม format `/create-report-in-dot-devin`
3. ถ้าเหลือ exclusions → ระบุชัดว่าอะไรอยู่นอก scope และทำไม

## Rules

### 1. Target Is The Target

- Default 100% ทุก category — ถ้า argument ไม่ระบุ
- ห้ามลดเป้า, ห้ามยกเลิก thresholds, ห้าม exclude เพิ่มเพื่อให้ผ่าน — exclusion ต้องมีเหตุผลจริงและบันทึกไว้
- "เกือบถึง" ไม่ใช่ผ่าน — ทำต่อจนครบหรือ report blocker พร้อม evidence

### 2. Real Coverage

- tests ต้อง assert behavior — import smoke test อย่างเดียวไม่นับว่าครอบคลุม logic
- ห้าม `.skip`/`.only`/mock ทุกอย่างจน test ไม่ได้ทดสอบอะไร
- branches ต้องครอบทุกทาง — ไม่ใช่แค่ happy path

### 3. Source vs Test

- coverage gap เผย dead code → report, ไม่ลบเองโดยไม่ได้รับอนุญาต
- test เผย bug ใน source → แก้ source — ห้ามเขียน test ให้เข้ากับพฤติกรรมที่ผิด

### 4. No Lingering Artifacts

- ลบ debug test files ชั่วคราวหลังจบ — coverage config + helper ที่ reuse ได้เก็บไว้
- ไม่ทิ้ง coverage artifacts เก่าปนกับผลลัพธ์ใหม่

## Expected Outcome

- Coverage = เป้า (default 100%) ทุก category ใน scope ที่นิยามไว้ และ suite ผ่านทั้งหมด
- Source bugs ที่ tests เผยถูกแก้และบันทึกไว้
- Report persisted ใน `.devin/reports/` พร้อม scope/exclusions ที่ audit ได้
