---
name: watch-browser-and-fix
description: เปิด browser ด้วย agent-browser แล้ว capture แก้ไข และ confirm web server
argument-hint: "[url]"
related:
  - watch-browser-console
  - watch-browser-and-test-all-routes
  - watch-browser-and-improve-uxui
  - resolve-errors
  - run-dev
  - run-program
  - follow-tool-agent-browser
---

## Goal

เปิด browser ด้วย `agent-browser` แล้ว capture หน้าเว็บ แก้ไข errors ที่พบ ถ้าแก้ไม่ได้ให้ fallback ไป `/watch-browser-console` และ confirm ว่า web server ทำงานได้

## Scope
- สำหรับ skills ที่เกี่ยวข้อง: `watch-browser-and-test-all-routes`, `watch-browser-and-improve-uxui`, `run-program`, `follow-tool-agent-browser`

ใช้สำหรับ browser automation ทีต้องการ monitor หน้าเว็บ แก้ไข errors ทีเกิดขึ้น และ ensure ว่า web server ยังคงทำงานได้

## Execute

### 1. Verify Web Server

> Goal: ตรวจสอบว่า web server ทำงานได้ก่อนเริ่ม watch

1. ถ้ามี URL → ใช้ `agent-browser open <url> --headless` หรือ `curl` ตรวจสอบ response
2. ถ้าไม่มี URL → หา dev server จาก `package.json` `scripts.dev` หรือใช้ `/run-dev`
3. ถ้า server ไม่ทำงาน → แก้ไขก่อนดำเนินการต่อ
4. บันทึก health status

### 2. Install And Verify Agent Browser

> Goal: Install And Verify Agent Browser

1. ตรวจสอบการติดตั้งด้วย `agent-browser --help`
2. ถ้าไม่ได้ติดตั้ง ให้ติดตั้งด้วย `bun add -g agent-browser`
3. ดาวน์โหลด Chrome ด้วย `agent-browser install`
4. ถ้าติดตั้งไม่ได้ ให้ใช้ `browser-preview` tool แทน

### 3. Open Browser And Capture

> Goal: เปิด browser และ capture หน้าเว็บ

1. ใช้ `agent-browser open <url> --headed` เพื่อเปิด browser แบบมองเห็นหน้าต่าง
2. ถ้าเปิดไม่ได้ ให้ใช้ `browser-preview` tool แทน
3. ใช้ `agent-browser screenshot` หรือ `agent-browser screenshot --annotate` เพื่อ capture หน้าปัจจุบัน
4. บันทึกสิ่งที่แสดงในหน้าจอและ interactive elements

### 4. Detect And Fix Errors

> Goal: ตรวจหาและแก้ไข errors ทีพบ

1. ใช้ `agent-browser console` และ `agent-browser errors` เพื่อดู console/page errors
2. ใช้ `agent-browser snapshot -i` เพื่อดู interactive elements
3. ทำ `/resolve-errors` เมื่อพบ error ทีสามารถแก้ไขได้
4. ถ้า error มาจาก source code → แก้ไข root cause ไม่ใช่ suppress
5. ถ้า error มาจาก web server หยุดทำงาน → กลับไปขั้นตอน `Verify Web Server`

### 5. Fallback To Watch Browser Console

> Goal: จัดการกรณีแก้ไขไม่ได้ด้วย /watch-browser-console

1. ถ้าแก้ไข error ไม่ได้หลัง 3 รอบ → เรียก `/watch-browser-console`
2. ใช้ `/watch-browser-console` เพื่อ monitor console errors อย่างละเอียด
3. บันทึก logs และ stack traces ทียังคงเหลือ
4. ถ้า error ยังคงเกิดขึ้น → stop และ report พร้อม evidence

### 6. Confirm Web Server Works

> Goal: ยื่นยันว่า web server ยังทำงานได้หลัง fix

1. รีโหลดหน้าเว็บด้วย `agent-browser reload`
2. ตรวจสอบ response status และ console errors อีกครั้ง
3. ใช้ `agent-browser screenshot` เพื่อ capture หน้าหลัง fix
4. ถ้า server ไม่ทำงาน → ทำ `/resolve-errors` หรือ `/run-dev` อีกครั้ง

### 7. Cleanup

> Goal: ปิด browser session อย่างสะอาด

1. ปิด browser session ด้วย `agent-browser close`
2. สรุปผล: errors ที่พบ, fixes ที่แก้, สถานะ web server, fallback ที่ใช้
3. ใช้ `/report-table` เพื่อแสดงสรุป

## Rules

### 1. Capture Before Fix

- ต้อง capture หน้าเว็บก่อนแก้ไขเสมอด้วย `agent-browser screenshot` หรือ `agent-browser snapshot -i`
- บันทึก interactive elements และ state ก่อน fix
- ใช้ `agent-browser screenshot --annotate` เมื่อต้องการระบุ element ทีเกิดปัญหา

### 2. Error Handling

- เมื่อเจอ error ต้องเรียก `/resolve-errors` ทันที
- ถ้า `daemon` error ให้ใช้ `browser-preview` tool แทน
- ถ้า `agent-browser` ไม่ติดตั้ง ให้ใช้ `browser-preview` tool แทน
- ถ้า error เกิดจาก web server หยุดทำงาน → แก้ server ก่อน

### 3. Fallback To Console

- ถ้าแก้ error ไม่ได้หลัง `maxRetries` = 3 รอบ → เรียก `/watch-browser-console`
- ไม่ต้องพยายาม fix ซ้ำเกิน 3 รอบก่อน fallback
- `/watch-browser-console` ใช้สำหรับ monitor console errors โดยเฉพาะ

### 4. Verify Web Server

- ตรวจสอบ web server health ก่อนและหลัง fix
- ถ้า server ไม่ทำงาน → หยุด watch และแก้ไข server ก่อน
- ใช้ `agent-browser open` หรือ `curl` เพื่อ verify

### 5. Timeout And Retry Limits

- `timeout` = 600 วินาที (10 นาที) สำหรับการ watch ทั้งหมด
- `maxErrors` = 20 ก่อน stop และ report
- `maxRetries` = 3 สำหรับ fix แต่ละ error ก่อน fallback
- `crashRecovery` = 3 สำหรับ `agent-browser` crash

### 6. Graceful Shutdown

- หยุดทันทีเมื่อ user กด `Ctrl+C`
- ปิด browser session ด้วย `agent-browser close` ก่อนหยุด
- บันทึกสถานะสุดท้ายก่อน cleanup

### 7. Rollback Safety

- ก่อนแก้ไข code ด้วย `/resolve-errors` ให้สร้าง checkpoint ด้วย `git stash`
- ถ้า fix สร้าง error ใหม่ → `git stash pop` เพื่อคืนค่า
- ถ้า web server พังหลัง fix → revert และ `/ask-me`

## Expected Outcome

- Browser เปิดและ capture หน้าเว็บได้
- Errors ที่พบถูกแก้ไขหรือ fallback ไป `/watch-browser-console` อย่างถูกต้อง
- Web server ยื่นยันว่าทำงานได้หลัง fix
- การ watch ทำงานต่อเนื่องโดยไม่ขัดจังหวะ
- ไม่มี TODO/MOCK/placeholder
