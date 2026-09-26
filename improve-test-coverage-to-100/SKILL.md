---
name: improve-test-coverage-to-100
description: ปิด coverage gaps จนถึง 100% — วิเคราะห์ uncovered, เพิ่ม tests ตาม priority, verify จริง
argument-hint: "[scope] [target%]"
related:
  - run-test-coverage
  - update-tests
  - review-test
  - deep-test
  - check-test-isolation
  - check-error-coverage
  - follow-test
  - follow-tool-vitest
  - follow-tool-stryker-mutator
  - loop-until-complete
  - resolve-errors
  - report
  - ask-me
---

## Goal

เพิ่ม test coverage ของ codebase ให้ถึง `100%` ทุก category (Lines, Statements, Functions, Branches) — หรือเป้าจาก argument — โดยวิเคราะห์ uncovered code, เขียน tests ที่ assert behavior จริง และ verify ตัวเลขจาก raw coverage output

## Scope

- เจ้าของเฉพาะส่วน gap-closing — baseline run, scope/threshold config และ final report อยู่ที่ `/run-test-coverage` (ซึ่ง dispatch มาที่ skill นี้ใน Step 3); ใช้ standalone ได้เมื่อมี baseline อยู่แล้ว
- การเขียน tests จำนวนมาก delegate ไป `/update-tests` — skill นี้เลือกเป้าหมายและยืนยันผล
- ถ้า coverage เผย bug ใน source → แก้ผ่าน `/resolve-errors` ไม่ใช่ปรับ test ให้เข้ากับพฤติกรรมที่ผิด

## Execute

### 1. Load Coverage Baseline

> Goal: มี uncovered list ที่เชื่อถือได้ก่อนเขียน test

1. ถ้ามี raw output จาก `/run-test-coverage` → ใช้ต่อ (`coverage-final.json`, lcov)
2. ถ้าไม่มี → รัน coverage command ของ project แล้วเก็บ raw output
3. Parse uncovered lines / functions / branches ต่อไฟล์ — ตรวจ raw JSON ไม่ใช่แค่ตารางสรุป (ระวังไฟล์ที่หลุดจาก report เพราะไม่ถูก include)

### 2. Prioritize Gaps

> Goal: เขียน test ที่ให้ผลมากสุดก่อน

1. เรียงไฟล์ตาม uncovered statements + uncovered branches มากสุดก่อน
2. จัดกลุ่มตาม test strategy:
   - pure logic → unit test ตรง
   - store/state mutations → seed state → call → assert
   - async/timers → fake timers / controllable clock
   - error paths → กระตุ้น error branch จริง
   - dead code suspect → เก็บไว้ report, ห้ามลบเอง
3. ถ้า uncovered คือ branch ของ ternary/optional-chain/short-circuit → ต้อง execute ทุกฝั่ง

### 3. Write Tests

> Goal: tests ครอบ behavior จริง ไม่ใช่ตัวเลขเทียม

1. เขียน tests ตาม conventions ของ project — ถ้าไฟล์/จำนวนเยอะ → delegate ไป `/update-tests`
2. Behavioral assertions เท่านั้น — ห้าม import smoke ล้วน, ห้าม `.skip`/`.only`, ห้าม stub ทุกอย่างจน test ไม่ได้ทดสอบอะไร
3. ถ้า test เผย source bug → แก้ source ผ่าน `/resolve-errors` แล้วกลับมา verify

### 4. Re-Measure Loop

> Goal: วนจนถึงเป้าหรือ report blocker ที่มี evidence

1. รัน suite → ทุก test ต้องผ่าน → รัน coverage ใหม่ → เทียบ delta กับ baseline
2. วน Step 2–4 จนทุก category ถึงเป้า — failure เดิมซ้ำ ≥3 รอบโดยไม่คืบหน้า → stop และ report blocker พร้อมสาเหตุ
3. เมื่อถึงเป้า: รัน suite ซ้ำ 2 ครั้ง ยืนยัน deterministic ไม่ flaky

### 5. Report

> Goal: ผลลัพธ์ audit ได้

1. ทำ `/report` — baseline → final per category, tests ที่เพิ่ม, source bugs ที่พบ/แก้, exclusions ที่เหลือพร้อมเหตุผล
2. ถ้ารันจาก `/run-test-coverage` → คืนผลให้มัน persist report ตาม pipeline ของมัน

## Rules

### 1. Target Is The Target

- Default 100% ทุก category — ห้ามลดเป้า, ห้ามเพิ่ม exclude เพื่อให้ผ่าน, ห้ามแก้ thresholds ให้หละหลวม
- "เกือบถึง" ไม่ใช่ผ่าน — ทำต่อหรือ report blocker พร้อม evidence

### 2. Honest Coverage

- เช็ค uncovered = 0 จาก raw JSON เสมอ — ตัวเลขใน UI/summary อาจขาดไฟล์ที่ไม่ถูก include
- ไม่นับเคสที่ test ผ่านแต่ไม่ assert อะไร

### 3. Minimal Diff

- เพิ่ม test files อย่างเดียว — ห้ามแตะ source เว้นเป็น bug fix ผ่าน `/resolve-errors`
- ลบ debug/helper test ชั่วคราวหลังจบ; coverage helper ที่ reuse ได้เก็บไว้

## Expected Outcome

- Coverage ทุก category ถึงเป้า (default 100%) ใน scope ที่นิยาม และ suite ผ่าน deterministic
- ไม่มี uncovered ค้างใน raw report, ไม่มี placeholder/skip tests
- Report แสดง baseline→final delta และ exclusions ที่เหลือชัดเจน
