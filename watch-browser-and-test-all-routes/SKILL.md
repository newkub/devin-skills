---
name: watch-browser-and-test-all-routes
description: เปิด browser แล้ว list ทุกหน้า ทดสอบ actions ทุกอย่าง ทุกหน้า และใช้ /review-by-stakeholder
argument-hint: "[url]"
related:
  - list-website-all-routes
  - review-by-stakeholder
  - watch-browser-and-fix
  - watch-browser-console
  - run-test-e2e
  - follow-tool-agent-browser
  - resolve-errors
  - loop-until-complete
  - run-install
  - capture-component
---

## Goal

เปิด browser ด้วย `agent-browser` แล้ว list ทุก route/หน้า ทดสอบ actions ทุกอย่าง (เช่น button, toggle, dropdown, click, autofill, drag and drop) ทุกหน้า และใช้ `/review-by-stakeholder`

## Scope
- สำหรับ skills ที่เกี่ยวข้อง: `watch-browser-and-fix`, `watch-browser-console`, `run-test-e2e`, `follow-tool-agent-browser`

ใช้สำหรับ E2E testing ทุก route ของ website รวมถึงการระบุ actions ทีมีในแต่ละหน้า และทดสอบ interactions อย่างครบถ้วน

## Execute

### 1. Detect Environment

> Goal: รู้ว่าจะเปิด browser ไปทีไหน

1. ตรวจสอบ `package.json` field `scripts.dev`, `scripts.e2e`, dependencies `vitest`, `jest`, `@playwright/test`, `cypress`
2. ถ้าไม่มี URL ให้หา dev server จาก `scripts.dev` หรือ `/run-dev` ก่อน
3. ถ้าไม่พบ → `/ask-me`

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

### 4. List All Routes

> Goal: รวบรวมทุกหน้าที่ต้องทดสอบ

1. ทำ `/list-website-all-routes` เพื่อ list ทุก route
2. ถ้าไม่มี skill `/list-website-all-routes` ให้ใช้ `agent-browser snapshot -i` และ `agent-browser links` เพื่อค้นหา links
3. บันทึกรายการ routes พร้อม priority

### 5. Identify Actions Per Route

> Goal: ระบุ actions ทีมีในแต่ละหน้า

1. เปิดแต่ละ route ด้วย `agent-browser open <route-url> --headed`
2. ใช้ `agent-browser snapshot -i` เพื่อ list interactive elements
3. ระบุ actions เช่น:
   - `button` → click
   - `toggle`, `checkbox`, `radio` → change state
   - `dropdown`, `select` → change selection
   - `input`, `textarea` → autofill/typing
   - `form` → submit
   - `drag` / `drop` zone → drag and drop
   - `link` → navigate
   - `modal`, `dialog` → open/close
4. บันทึก actions เป็น checklist ต่อ route

### 6. Test Actions

> Goal: ทดสอบ actions ทุกอย่างในแต่ละหน้า

1. ทดสอบ `click` บน buttons, links, tabs, cards
2. ทดสอบ `autofill` บน forms ด้วย `agent-browser type @e1 "value"`
3. ทดสอบ `dropdown` ด้วย `agent-browser select @e1 "option"`
4. ทดสอบ `toggle`/`checkbox` ด้วย `agent-browser click @e1`
5. ทดสอบ `drag and drop` ด้วย `agent-browser drag @e1 --to @e2`
6. ทดสอบ `form submit` ด้วย `agent-browser submit @e1`
7. ทดสอบ `modal` เปิด/ปิด
8. ใช้ `agent-browser screenshot` หรือ `agent-browser screenshot --annotate` เมื่อ action ล้มเหลว
9. ถ้าต้องการ capture ภาพ component แยกตัว ใช้ `/capture-component`

### 7. Resolve Failures And Errors

> Goal: แก้ไข failures และ browser errors ทีละรายการ

1. จัดกลุ่ม failures ตาม route และประเภท: assertion, setup, timeout, browser error
2. เรียง priority: setup/teardown ก่อน แล้ว assertion แล้ว timeout
3. ทำ `/resolve-errors` กับ browser errors
4. แก้ที่ root cause ไม่ใช่ suppress

### 8. Review By Stakeholder

> Goal: ใช้ /review-by-stakeholder ประเมินผลการทดสอบ

1. รวบรวมผลการทดสอบทุก route: จำนวน actions, failures, screenshots
2. ทำ `/review-by-stakeholder` เพื่อประเมินว่าการทดสอบครอบคลุมความต้องการของ stakeholder
3. บันทึก feedback และ action items
4. ถ้ามี gaps → ทดสอบเพิ่มเติม

### 9. Re-run Until Pass

> Goal: วนรัน tests ทุก route จนกว่าจะผ่าน

1. ทดสอบ route ใหม่หลังแก้ไข
2. ถ้ายังมี failure → กลับไปขั้นตอนที่ 7
3. ใช้ `/loop-until-complete` จนผ่าน
4. วนซ้ำสูงสุด 5 รอบ ถ้าเกิน → stop และ report
5. ถ้า failure เดิมเกิดซ้ำ ≥ 3 ครั้ง → circuit breaker → stop

### 10. Cleanup

> Goal: ปิด browser และสรุปผล

1. ปิด browser session ด้วย `agent-browser close`
2. สรุปผล: routes ทีทดสอบ, actions ทีผ่าน/ไม่ผ่าน, failures, stakeholder feedback
3. ใช้ `/report-table` เพื่อแสดงสรุป

## Rules

### 1. Scope Boundary

- ทำหน้าที่เปิด browser + list ทุก route + ทดสอบ actions ทุกหน้า + review-by-stakeholder
- ห้ามรัน test watch mode ต่อเนื่อง — ใช้ `/run-watch-test` สำหรับสิ่งนั้น
- ห้าม fix โดยใช้ `.skip`, `.only`, `xit`, `xtest`

### 2. Route Coverage

- ทดสอบทุก route ที list ได้
- ถ้ามี authentication ให้ test ทั้ง logged-in และ logged-out states
- ถ้ามี dynamic routes ให้ test กรณีทั่วไปและ edge cases

### 3. Action Testing

- ทดสอบทุก action ทีระบุ: click, toggle, dropdown, autofill, drag and drop, submit
- ใช้ `agent-browser wait @e1` ก่อน interact
- ใช้ `agent-browser screenshot` เมื่อ action ล้มเหลว

### 4. Browser Monitoring

- ใช้ `agent-browser console` สำหรับ console messages
- ใช้ `agent-browser errors` สำหรับ page errors
- ใช้ `agent-browser snapshot -i` เมื่อต้องการดู interactive elements

### 5. Error Handling

- แก้ที่ root cause ไม่ใช่ suppress
- ถ้า failure มาจาก missing dependency → `/run-install`
- ถ้า failure มาจาก environment → `/ask-me`
- บันทึก error logs ด้วย `agent-browser console` และ `agent-browser errors`

### 6. Stakeholder Review

- ทำ `/review-by-stakeholder` หลังทดสอบครบทุก route
- บันทึก feedback ทีได้รับ
- ถ้ามี critical gaps ต้องทดสอบซ้ำก่อน ship

### 7. Circuit Breaker

- ถ้า failure เดิมเกิดซ้ำ ≥ 3 ครั้งหลังแก้ไข → stop และ report
- ถ้า fix สร้าง failure ใหม่ → stop หลัง 3 รอบ
- ถ้า failures > 50 → report "too many failures, manual intervention needed" และ stop

### 8. Timeout And Retry Limits

- `timeout` = 600 วินาที (10 นาที) สำหรับการ watch ทั้งหมด
- `perRouteTimeout` = 120 วินาที สำหรับแต่ละ route
- `maxRetries` = 3 สำหรับ `agent-browser` crash recovery

### 9. Graceful Shutdown

- หยุดทันทีเมื่อ user กด `Ctrl+C`
- ปิด browser session ด้วย `agent-browser close` ก่อนหยุด
- บันทึกสถานะ failures ก่อนหยุด

### 10. Rollback Safety

- ก่อนแก้ไข code ให้สร้าง checkpoint ด้วย `git stash`
- ถ้า fix สร้าง failure ใหม่ → `git stash pop` เพื่อคืนค่า
- ถ้า failure count เพิ่มขึ้นหลังแก้ → พิจารณา revert และ `/ask-me`

## Expected Outcome

- เปิด browser และ list ทุก route ของ website ได้
- ทดสอบ actions (button, toggle, dropdown, click, autofill, drag and drop, etc.) ทุกหน้า
- Failures และ browser errors ถูกแก้ที่ root cause
- `/review-by-stakeholder` ถูกใช้เพื่อประเมินผล
- ไม่มี `.skip`, `.only` ที่หลีกเลี่ยง failure
- ไม่มี TODO/MOCK/placeholder
