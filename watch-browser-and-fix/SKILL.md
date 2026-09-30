---
name: watch-browser-and-fix
description: เปิด browser ด้วย agent-browser watch console/errors อย่างต่อเนื่อง แก้ไข และ confirm web server
argument-hint: "[url|report]"
related:
  - watch-browser
  - watch-browser-test
  - resolve-errors
  - run-dev
  - run-program

---

## Goal

เปิด browser ด้วย `agent-browser` watch console messages และ page errors อย่างต่อเนื่อง แก้ไข errors ที่พบที่ root cause แล้ว confirm ว่า web server ทำงานได้ — merged จาก `/watch-browser-fix` + `/watch-browser-console`

## Scope

ใช้สำหรับ browser automation ที่ต้อง monitor หน้าเว็บ จับและแก้ console/page errors และ ensure web server ทำงานได้

- ถ้า focus เฉพาะ console watching โดยไม่ต้องแก้ → ทำ Steps 1-3 + watch loop เท่านั้น
- ถ้าต้องการ roleplay user ทดสอบ actions/flows ทุก route → `/watch-browser-test`
- ถ้าต้องการ analyze UX/UI จาก screenshots → `/deep-review`

## Execute

### 1. Install And Verify Agent Browser

> Goal: เตรียม browser automation tool

1. ตรวจสอบการติดตั้งด้วย `agent-browser --help`
2. ถ้าไม่ได้ติดตั้ง ให้ติดตั้งด้วย `bun add -g agent-browser`
3. ดาวน์โหลด Chrome ด้วย `agent-browser install`
4. ถ้าติดตั้งไม่ได้หรือ `daemon` error → ใช้ `browser-preview` tool แทน

### 2. Open Browser And Clear State

> Goal: เปิด browser พร้อมสถานะสะอาดก่อน watch

1. เปิด dev server ถ้าจำเป็น (`npm run dev`, `bun dev` ฯลฯ)
2. เปิด URL ด้วย `agent-browser open <url> --headed` — เปิดไม่ได้ → `browser-preview`
3. ใช้ `agent-browser console --clear` และ `agent-browser errors --clear`
4. ใช้ `agent-browser screenshot` บันทึก baseline

### 3. Watch Console And Errors

> Goal: monitor อย่างต่อเนื่องและจับ errors ที่เกิดขึ้น

1. ใช้ `agent-browser console` ดู console messages
2. ใช้ `agent-browser errors` ดู page errors
3. ใช้ `agent-browser snapshot -i` ดู interactive elements
4. วนซ้ำทุก `5` วินาที เช็ค console/errors ใหม่ — บันทึกเฉพาะ delta ที่เปลี่ยน
5. error ใหม่ → บันทึก stack trace + screenshot ก่อน action

### 4. Identify Root Cause

> Goal: รู้ว่า error เกิดจากอะไร

1. แยกประเภท error: runtime, network, auth, build, environment
2. ตรวจ file/line จาก stack trace
3. ตรวจ network requests ด้วย `agent-browser network` — response status/body ถ้า error มาจาก API
4. ทำ `/deep-debug` ถ้าต้อง tracing

### 5. Fix Errors

> Goal: แก้ไข errors ที่พบที่ root cause

1. ก่อนแก้ → checkpoint ด้วย `git stash` (rollback safety)
2. แก้ที่ root cause ไม่ใช่ suppress — ทำ `/resolve-errors`
3. ถ้า fix สร้าง error ใหม่ → `git stash pop` คืนค่า แล้ววิเคราะห์ใหม่
4. ถ้าเป็น environment issue → `/ask-me`; build issue → `/resolve-errors` แล้ว build ใหม่
5. ถ้าแก้ไม่ได้ทันที → บันทึก workaround แล้ว watch ต่อ

### 6. Confirm And Re-capture

> Goal: ยืนยันว่า errors หายและ server ทำงาน

1. รีโหลดด้วย `agent-browser reload` แล้วตรวจ `console`/`errors` อีกครั้ง
2. ใช้ `agent-browser screenshot` บันทึกหลังแก้ไข
3. ถ้า web server ไม่ทำงาน → `/run-dev` หรือ `/run-program`
4. ตรวจ `/` route และ critical routes อื่น — กลับไป Step 3 watch ต่อจนครบ timeout

### 7. Report

> Goal: สรุปผล

1. ทำตาม `### report-status` — console messages grouped, issues found vs fixed, before/after evidence
2. persist raw results → `.devin/temp/report/<workspace>/browser-fix-<time>.md` ตาม format `/create-report-in-dot-devin`
3. ปิด browser ด้วย `agent-browser close`

### Subskills

| Argument | Subskill |
|----------|----------|
| `report`, `status` | `### report-status` — watch/fix report (grouped errors, found vs fixed, verdict) |

1. ถ้า argument เป็น `report`/`status` → ทำตาม `### report-status` — ใช้ session data ที่มีอยู่
2. ถ้าไม่ระบุ → ทำ Steps 1-7 ตามปกติ

## Rules

### 1. Continuous Monitoring

- poll interval = `5` วินาที — ห้ามถี่กว่านี้
- บันทึกเฉพาะ delta — ไม่ report state ที่ซ้ำกับ poll ก่อนหน้า
- `agent-browser console --clear` / `errors --clear` ก่อนเริ่ม watch ใหม่เสมอ

### 2. Capture Before Fix

- screenshots save ไป OS temp dir (`$env:TEMP`/`os.tmpdir()`) — ห้าม commit เข้า repo
- ต้องมี screenshot + console/errors log ก่อนแจ้งหรือแก้ไข — ไม่แก้โดยไม่มี evidence

### 3. Root Cause Fix

- แก้ที่ต้นเหตุ ไม่ใช่ suppress — ถ้า suppress จำเป็นจริงๆ ให้บันทึก TODO พร้อมเหตุผล
- ไม่ใช้ `// @ts-ignore` หรือ `eslint-disable` โดยไม่จำเป็น
- ก่อนแก้ด้วย `/resolve-errors` → `git stash` checkpoint; fix สร้าง error ใหม่ → `git stash pop`

### 4. Circuit Breaker

- error เดิมเกิดซ้ำ ≥ `3` ครั้งหลังแก้ไข → stop และ report ว่า fix ไม่ได้ผล — บันทึก error fingerprint (file + line + message)
- error ใหม่เพิ่มขึ้นหลังแก้ไข → stop หลัง `3` รอบ
- `maxErrors` = `20` ก่อน stop และ report

### 5. Timeout And Retry Limits

- `timeout` = `600` วินาที (10 นาที) สำหรับ session ทั้งหมด
- `maxRetries` = `3` สำหรับ `agent-browser` crash recovery

### 6. Graceful Shutdown

- หยุดทันทีเมื่อ user กด `Ctrl+C` — ปิดด้วย `agent-browser close` ก่อนจบ ไม่ทิ้ง daemon ค้าง
- บันทึกสถานะสุดท้ายก่อนหยุด

### 7. Fallback Order

- `agent-browser` ไม่ติดตั้ง/daemon error → `browser-preview` tool
- environment issue → `/ask-me`; build issue → `/resolve-errors`

## Merged Details

### report-status

#### Goal

รายงาน watch/fix session — console messages grouped, errors found vs fixed, verdict พร้อม evidence

#### Execute

1. group console messages ตาม type (error, warning, info) และ source (file/component)
2. ตาราง `No.`, `Error`, `Type`, `Status` (new/recurring/fixed), `Evidence` (screenshot/stack)
3. verdict: `clean` (ไม่มี errors), `fixed` (พบและแก้ครบ), `partial` (เหลือค้าง + เหตุ)
4. persist → `.devin/temp/report/<workspace>/browser-fix-<time>.md` ตาม `/create-report-in-dot-devin`

## Expected Outcome

- Console/errors ถูก watch อย่างต่อเนื่องพร้อม delta tracking
- Errors ถูกจับและแก้ที่ root cause มี before/after screenshots
- Web server ยังทำงานได้หลังแก้ไข — critical routes ผ่าน
- recurring fixes ถูก rollback ผ่าน `git stash` mechanism
- ไม่มี TODO/MOCK/placeholder
