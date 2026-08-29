---
name: watch-browser-and-test
description: เปิด browser ควบคู่กับรันและแก้ไข tests จนกว่าจะผ่านทั้งหมด
argument-hint: "[url] [test-pattern]"
related:
  - watch-browser
  - watch-test
  - run-test-e2e
  - watch-browser-console
  - follow-tool-agent-browser
  - resolve-errors
  - loop-until-complete
  - run-install
---

## Goal

เปิด browser ด้วย `agent-browser` ควบคู่กับรัน tests แล้วแก้ไข failures จนกว่าจะผ่านทั้งหมด

## Scope

ใช้เมื่อต้องการ monitor หน้าเว็บขณะรัน tests (unit, integration, e2e) พร้อมแก้ไข errors/failures อัตโนมัติ ครอบคลุม Playwright, Cypress, Vitest, Jest, pytest, cargo test, go test ฯลฯ โดยไม่ซ้ำกับ `/watch-browser` หรือ `/watch-test`

## Execute

### 1. Detect Environment And Test Runner

> Goal: รู้ว่าจะเปิด browser ไปทีไหน และใช้ test runner ใด

1. ตรวจสอบ `package.json` field `scripts.test`, `scripts.e2e`, dependencies `vitest`, `jest`, `@playwright/test`, `cypress`
2. ถ้าเป็น Python → ตรวจ `pytest`, `unittest`
3. ถ้าเป็น Rust → `cargo test`
4. ถ้าเป็น Go → `go test ./...`
5. ถ้าไม่มี URL ให้หา dev server จาก `scripts.dev` หรือ `/run-dev` ก่อน
6. ถ้าไม่พบ test runner → `/ask-me`

### 2. Install And Verify Agent Browser

> Goal: เตรียม browser automation tool

1. ติดตั้ง `bun add -g agent-browser`
2. รัน `agent-browser install` เพื่อดาวน์โหลด Chrome
3. ตรวจสอบด้วย `agent-browser --help`
4. ถ้าติดตั้งไม่ได้ → ใช้ `browser-preview` tool แทน

### 3. Open Browser And Navigate

> Goal: เปิด browser พร้อมหน้าเว็บที่จะทดสอบ

1. ใช้ `agent-browser open <url> --headed` ถ้ามี URL
2. ถ้าไม่มี URL ให้รัน dev server แล้วเปิดด้วย `agent-browser open <dev-url> --headed`
3. ใช้ `agent-browser console --clear` และ `agent-browser errors --clear` เพื่อเริ่มต้นใหม่
4. ถ้าเปิดไม่ได้ → ใช้ `browser-preview` tool แทน

### 4. Run Tests While Watching Browser

> Goal: รัน tests ควบคู่กับ monitor browser

1. รัน test command ที่ตรวจพบ (เช่น `bunx playwright test`, `bun test`, `cargo test`)
2. ระหว่างรันให้ `agent-browser console` และ `agent-browser errors` ทุก 5 วินาที
3. ใช้ `agent-browser screenshot` หรือ `agent-browser snapshot -i` เมื่อ test failed เพื่อดู state
4. เก็บ output ทั้ง test และ browser errors ไว้วิเคราะห์

### 5. Resolve Failures And Errors

> Goal: แก้ไข test failures และ browser errors ทีละรายการ

1. จัดกลุ่ม failures ตาม file path และประเภท: assertion, setup, timeout, browser error
2. เรียง priority: setup/teardown ก่อน แล้ว assertion แล้ว timeout
3. ทำ `/resolve-errors` กับ browser errors
4. ทำ `/watch-test` สำหรับ test failures ที่ต้อง fix หลายรอบ
5. แก้ที่ root cause ไม่ใช่ suppress

### 6. Re-run Until Pass

> Goal: วนรัน tests จนกว่าจะผ่านทั้งหมด

1. รัน tests ใหม่หลังแก้ไข
2. ถ้ายังมี failure → กลับไปขั้นตอนที่ 5
3. ใช้ `/loop-until-complete` จนผ่าน
4. วนซ้ำสูงสุด 5 รอบ ถ้าเกิน → stop และ report
5. ถ้า failure เดิมเกิดซ้ำ ≥ 3 ครั้ง → circuit breaker → stop

### 7. Cleanup

> Goal: ปิด browser และสรุปผล

1. ปิด browser session ด้วย `agent-browser close`
2. สรุปผล: tests ผ่าน/ไม่ผ่าน, failures ที่แก้, browser errors ที่พบ, จำนวนรอบ
3. ใช้ `/report-table` เพื่อแสดงสรุป

## Rules

### 1. Scope Boundary

- ทำหน้าที่เปิด browser + รัน tests + แก้ไขจนผ่าน
- ห้ามรัน test watch mode ต่อเนื่อง — ใช้ `/run-watch-test` สำหรับสิ่งนั้น
- ห้าม monitor browser อย่างเดียว — ใช้ `/watch-browser` สำหรับสิ่งนั้น
- ห้าม fix test โดยใช้ `.skip`, `.only`, `xit`, `xtest`

### 2. Browser Monitoring

- ใช้ `agent-browser console` สำหรับ console messages
- ใช้ `agent-browser errors` สำหรับ page errors
- ใช้ `agent-browser screenshot` หรือ `agent-browser snapshot -i` เมื่อ test failed
- ใช้ `agent-browser reload` หลังแก้ไข browser error
- ใช้ `/watch-browser-console` เฉพาะเมื่อต้องการ focus ที่ console

### 3. Test Execution

- รองรับ Playwright, Cypress, Vitest, Jest, pytest, cargo test, go test
- ถ้าขาด dependencies ให้ทำ `/run-install`
- รัน tests แบบ headless เป็นค่าเริ่มต้น ยกเว้น debugging
- ใช้ retries สำหรับ flaky tests ตาม config ของ framework

### 4. Error Handling

- แก้ที่ root cause ไม่ใช่ suppress
- ถ้า failure มาจาก missing dependency → `/run-install`
- ถ้า failure มาจาก environment → `/ask-me`
- บันทึก error logs ด้วย `agent-browser console` และ `agent-browser errors`

### 5. Circuit Breaker

- ถ้า failure เดิมเกิดซ้ำ ≥ 3 ครั้งหลังแก้ไข → stop และ report
- ถ้า fix สร้าง failure ใหม่ → stop หลัง 3 รอบ
- ถ้า failures > 50 → report "too many failures, manual intervention needed" และ stop

### 6. Timeout And Retry Limits

- `timeout` = 600 วินาที (10 นาที) สำหรับการ watch ทั้งหมด
- `perRoundTimeout` = 120 วินาที สำหรับแต่ละรอบ test run
- `maxRetries` = 3 สำหรับ `agent-browser` crash recovery

### 7. Graceful Shutdown

- หยุดทันทีเมื่อ user กด `Ctrl+C`
- ปิด browser session ด้วย `agent-browser close` ก่อนหยุด
- บันทึกสถานะ failures ก่อนหยุด

### 8. Rollback Safety

- ก่อนแก้ไข code ให้สร้าง checkpoint ด้วย `git stash`
- ถ้า fix สร้าง failure ใหม่ → `git stash pop` เพื่อคืนค่า
- ถ้า failure count เพิ่มขึ้นหลังแก้ → พิจารณา revert และ `/ask-me`

## Expected Outcome

- Browser เปิดและ monitor หน้าเว็บต่อเนื่อง
- Tests รันจนผ่านทั้งหมด
- Test failures และ browser errors ถูกแก้ที่ root cause
- ไม่มี `.skip`, `.only` ที่หลีกเลี่ยง failure
- ไม่มี TODO/MOCK/placeholder
- `SKILL.md` ไม่เกิน 250 บรรทัด
