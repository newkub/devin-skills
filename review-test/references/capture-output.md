# Capture Output And Classify Failures

## Goal

เก็บผลลัพธ์และจัดหมวดหมู่ failures หลัง run tests

## Checks

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

## Severity

- Critical: assertion/implementation failure ใน critical path หรือ runtime crash
- High: setup failure ที่ block test suite ทั้งหมด
- Medium: flaky test หรือ runtime failure ใน test เดี่ยว
- Low: assertion ที่ผลกระทบต่ำ หรือ output ที่ขาด metadata
