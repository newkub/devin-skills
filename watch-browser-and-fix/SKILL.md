---
name: watch-browser-and-fix
description: เปิด browser ด้วย agent-browser แล้ว capture แก้ไข และ confirm web server
argument-hint: "[url]"
related:
  - watch-browser-console
  - resolve-errors
  - run-dev
  - run-program
---

## Goal

เปิด browser ด้วย `agent-browser` แล้ว capture หน้าเว็บ แก้ไข errors ที่พบ ถ้าแก้ไม่ได้ให้ fallback ไป `/watch-browser-console` และ confirm ว่า web server ทำงานได้

## Scope

ใช้สำหรับ browser automation ทีต้องการ monitor หน้าเว็บ แก้ไข errors ทีเกิดขึ้น และ ensure ว่า web server ยังคงทำงานได้

## Execute

### 1. Install And Verify Agent Browser

> Goal: เตรียม browser automation tool

1. ตรวจสอบการติดตั้งด้วย `agent-browser --help`
2. ถ้าไม่ได้ติดตั้ง ให้ติดตั้งด้วย `bun add -g agent-browser`
3. ดาวน์โหลด Chrome ด้วย `agent-browser install`
4. ถ้าติดตั้งไม่ได้ ให้ใช้ `browser-preview` tool แทน

### 2. Open Browser And Capture

> Goal: เปิด browser และดูหน้าเว็บ

1. เปิด dev server ถ้าจำเป็น (`npm run dev`, `bun dev` ฯลฯ)
2. เปิด URL ด้วย `agent-browser open <url> --headed`
3. ใช้ `agent-browser screenshot` บันทึกหน้าเว็บ
4. ใช้ `agent-browser console --clear` และ `agent-browser errors --clear` ก่อน monitor

### 3. Monitor Console And Errors

> Goal: จับ errors ทีเกิดขึ้น

1. ใช้ `agent-browser console` ดู console messages
2. ใช้ `agent-browser errors` ดู page errors
3. ใช้ `agent-browser snapshot -i` ดู interactive elements
4. ทำ `/watch-browser-console` เพื่อตรวจหา errors อย่างต่อเนื่อง
5. บันทึก errors พร้อม stack trace และ screenshot

### 4. Identify Root Cause

> Goal: รู้ว่า error เกิดจากอะไร

1. แยกประเภท error: runtime, network, auth, build, environment
2. ตรวจ file/line จาก stack trace
3. ตรวจ network requests ด้วย `agent-browser network`
4. ตรวจ response status และ body ถ้า error มาจาก API
5. ทำ `/deep-debug` ถ้าต้อง tracing

### 5. Fix Errors

> Goal: แก้ไข errors ทีพบ

1. แก้ที่ root cause ไม่ใช่ suppress
2. ถ้าเป็น build issue → `/resolve-errors` แล้ว build ใหม่
3. ถ้าเป็น environment issue → `/ask-me`
4. ถ้าแก้ไม่ได้ทันที → บันทึก workaround แล้ว fallback ไป `/watch-browser-console`

### 6. Confirm And Re-capture

> Goal: ยืนยันว่า errors หาย

1. รีโหลดหน้าเว็บด้วย `agent-browser reload`
2. ใช้ `agent-browser console` และ `agent-browser errors` ดูอีกครั้ง
3. ใช้ `agent-browser screenshot` บันทึกหน้าหลังแก้ไข
4. ถ้า web server ไม่ทำงาน → `/run-dev` หรือ `/run-program`

### 7. Report

> Goal: สรุปผล

1. บันทึก errors ทีแก้ไขแล้ว และ errors ทียังคงอยู่
2. ใช้ `/report-table` แสดงสรุป
3. ปิด browser ด้วย `agent-browser close`

## Rules

### 1. Capture Before Fix

- ต้องมี screenshot ก่อนแก้ไข
- ต้องบันทึก console errors ก่อนแก้ไข
- ไม่แก้โดยไม่มี evidence

### 2. Root Cause Fix

- แก้ที่ต้นเหตุ ไม่ใช่ suppress
- ถ้า suppress จำเป็นจริงๆ ให้บันทึก TODO พร้อมเหตุผล
- ไม่ใช้ `// @ts-ignore` หรือ `eslint-disable` โดยไม่จำเป็น

### 3. Fallback

- ถ้าแก้ไม่ได้ทันที → fallback ไป `/watch-browser-console`
- ถ้า environment issue → `/ask-me`
- ถ้า build issue → `/resolve-errors`

### 4. Confirm Server

- หลังแก้ไขต้อง confirm web server ยังทำงานได้
- ใช้ `browser-preview` หรือ `agent-browser open` ทดสอบ
- ตรวจ `/` route และ critical routes อื่น

### 5. Timeout

- `timeout` = 600 วินาที (10 นาที) สำหรับ session ทั้งหมด
- `maxRetries` = 3 สำหรับ `agent-browser` crash recovery

### 6. Graceful Shutdown

- หยุดทันทีเมื่อ user กด `Ctrl+C`
- ปิด browser session ด้วย `agent-browser close`
- บันทึกสถานะสุดท้ายก่อนหยุด

## Expected Outcome

- Browser เปิดและ capture หน้าเว็บได้
- Errors ถูกจับและแก้ไขที่ root cause
- มี before/after screenshots
- Web server ยังทำงานได้หลังแก้ไข
- ไม่มี TODO/MOCK/placeholder
