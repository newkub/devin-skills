---
name: watch-test
description: Watch test status และ fix test failures จนกว่าจะผ่านทั้งหมด
argument-hint: "[file-or-pattern]"
---

## Goal

Watch test status อย่างต่อเนื่อง ตรวจจับ test failures และ fix จนกว่าจะผ่านทั้งหมด โดยไม่รวมการรัน test watch mode เป็นเวลานาน (เป็นหน้าที่ของ `/run-watch-test`)

## Scope

ใช้เมื่อต้องการ monitor test ของ project ครั้งเดียวจนกว่าจะผ่าน ครอบคลุม Vitest, Jest, pytest, cargo test, go test และ test runner อื่นๆ

ไม่ครอบคลุม: การรัน test watch mode อย่างต่อเนื่องขณะพัฒนา — ใช้ `/run-watch-test` แทน

## Execute

### 1. Detect Test Runner

> Goal: รู้ว่า project ใช้ test runner ใด

1. ตรวจสอบ `package.json` field `scripts.test`
2. ถ้าไม่มี → ตรวจสอบ dependencies: `vitest`, `jest`, `@playwright/test`, `mocha`
3. ถ้าเป็น Python → ตรวจสอบ `pytest`, `unittest`
4. ถ้าเป็น Rust → ใช้ `cargo test`
5. ถ้าเป็น Go → ใช้ `go test ./...`
6. ถ้าไม่พบ test runner → ทำ `/ask-me`

### 2. Run Tests

> Goal: รัน tests ครั้งแรกเพื่อเก็บ failures

1. รัน test command ที่ตรวจพบ
2. เก็บ output ทั้งหมด: test name, file path, assertion error, expected vs actual
3. นับจำนวน failures ทั้งหมด
4. ถ้าไม่มี failure → tests ผ่าน → ไปขั้นตอน 5
5. แยก failures ออกเป็น categories: assertion error, timeout error, setup error, teardown error

### 3. Fix Test Failures

> Goal: แก้ test failures ทีละไฟล์จนหมด

1. จัดกลุ่ม failures ตาม file path
2. เรียงตาม priority: setup error ก่อน (ส่งผลต่อ tests อื่น), แล้ว assertion error, แล้ว timeout
3. ทำ `/resolve-errors` กับ failures ในแต่ละไฟล์
4. วิเคราะห์ root cause: logic error, missing mock, wrong assertion, race condition, missing dependency
5. แก้ไข code น้อยที่สุดตาม root cause — แก้ source code ไม่ใช่ test code (ยกเว้น test เขียนผิด)
6. ถ้า test เขียนผิด (assertion ไม่ตรง spec) → แก้ test code และระบุเหตุผล

### 4. Re-run Until Pass

> Goal: วนรัน tests จนกว่าจะผ่านทั้งหมด

1. รัน tests ใหม่หลังแก้ไข
2. ถ้ายังมี failure → กลับไปขั้นตอน 3
3. ใช้ `/loop-until-complete` จนกว่า tests ผ่านทั้งหมด
4. วนซ้ำสูงสุด `5` รอบ ถ้าเกิน → stop และ report
5. ถ้า failure เดิมเกิดซ้ำ ≥ `3` ครั้ง → circuit breaker → stop และ report

### 5. Report Result

> Goal: สรุปผลให้ user ทราบ

1. ถ้าผ่าน → report จำนวน failures ที่แก้, จำนวนรอบ, files ที่แก้, tests ทั้งหมดที่ผ่าน
2. ถ้ายังไม่ผ่าน → report remaining failures, สาเหตุ, และ next step
3. ใช้ table สำหรับสรุปผลลัพธ์

## Rules

### 1. Scope Boundary

- ทำเฉพาะ watch และ fix จนกว่าจะผ่าน
- ห้ามรัน test watch mode แบบต่อเนื่อง — ใช้ `/run-watch-test` สำหรับสิ่งนั้น
- ห้ามเปลี่ยน test config เพื่อหลีกเลี่ยง failures โดยไม่จำเป็น

### 2. Error Handling

- แก้ที่ root cause ไม่ใช่ suppress
- แก้ source code เป็นหลัก ไม่ใช่ test code (ยกเว้น test เขียนผิด)
- ถ้า failure มาจาก missing dependency → ทำ `/run-install`
- ถ้า failure มาจาก environment → ทำ `/ask-me`
- ห้ามใช้ `.skip`, `.only`, `xit`, `xtest` เพื่อหลีกเลี่ยง failure แก้ที่ source แทน

### 3. Circuit Breaker

- ถ้า failure เดิมเกิดซ้ำ ≥ `3` ครั้งหลังแก้ไข → stop และ report ว่า fix ไม่ได้ผล
- ถ้า fix สร้าง failure ใหม่ → stop หลัง `3` รอบ
- บันทึก failure fingerprint (test name + file + error message) เพื่อตรวจจับ recurring failures

### 4. Priority

- setup/teardown error ก่อน เพราะส่งผลต่อ tests อื่น
- assertion error ก่อน timeout error
- file ที่มี failure น้อยก่อน เพื่อลด rework

### 5. Rollback Safety

- ก่อนแก้ไข code ให้สร้าง checkpoint ด้วย `git stash`
- ถ้า fix สร้าง failure ใหม่ → `git stash pop` เพื่อคืนค่า
- ถ้า failure count เพิ่มขึ้นหลังแก้ → พิจารณา revert และทำ `/ask-me`

### 6. Per-Round Timeout

- `perRoundTimeout` = `120` วินาที สำหรับแต่ละรอบ test run
- ถ้า test run ใช้เวลา > `120` วินาที → stop และ report

### 7. Graceful Shutdown

- หยุดทันทีเมื่อ user กด `Ctrl+C`
- บันทึกสถานะ failures ก่อนหยุด

### 8. Max Errors Threshold

- ถ้า failures > `50` → report "too many failures, manual intervention needed" และ stop

## Expected Outcome

- Tests ผ่านทั้งหมดโดยไม่มี failure
- Test failures ถูกแก้ที่ root cause ไม่ใช่ suppress
- ผลลัพธ์ report ครบ: จำนวน failures ที่แก้, จำนวนรอบ, files ที่แก้, tests ที่ผ่าน
- ไม่มี `.skip`, `.only` ที่หลีกเลี่ยง failure
- ไม่มี TODO/MOCK/placeholder
- `SKILL.md` ไม่เกิน 250 บรรทัด
