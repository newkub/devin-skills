---
name: watch-browser
description: เปิดเบราว์เซอร์ด้วย agent-browser และ watch หน้าเว็บต่อเนื่อง
argument-hint: "[url]"
related:
  - watch-browser-and-test
---

## Goal

เปิดเบราว์เซอร์ด้วย `agent-browser` และ watch หน้าเว็บต่อเนื่อง พร้อมจัดการ errors อัตโนมัติ

## Scope

ใช้สำหรับ browser automation และ continuous monitoring ด้วย `agent-browser` CLI

## Execute

### 1. Run Typecheck

> Goal: ตรวจสอบ type safety ก่อนเริ่ม watch browser

ถ้า project ใช้ TypeScript ให้ทำ `/run-typecheck` ก่อนเริ่ม watch browser เพื่อให้แน่ใจว่าโค้ดผ่าน type check

### 2. Install And Verify Agent Browser

> Goal: Install And Verify Agent Browser

ติดตั้งด้วย `bun add -g agent-browser` แล้วรัน `agent-browser install` (ดูรายละเอียดที่ `/follow-tool-agent-browser`)

1. ตรวจสอบการติดตั้งด้วย `agent-browser --help`
2. ถ้าไม่ได้ติดตั้ง ให้ติดตั้งด้วย `bun add -g agent-browser`
3. ดาวน์โหลด Chrome ด้วย `agent-browser install`
4. ถ้าติดตั้งไม่ได้ ให้ใช้ `browser-preview` tool แทน

### 3. Open Browser

> Goal: Open Browser

เปิด browser และ navigate ไปยัง URL ที่ต้องการ watch ด้วย `agent-browser open <url> --headed` (ดูรายละเอียดที่ `/follow-tool-agent-browser`)

1. ใช้ `agent-browser open <url> --headed` เพื่อเปิด browser แบบมองเห็นหน้าต่าง
2. ถ้าเปิดไม่ได้ ให้ใช้ `browser-preview` tool แทน

### 4. Watch And Monitor

> Goal: Watch And Monitor

Monitor อย่างต่อเนื่องด้วย `agent-browser snapshot -i` และจัดการ errors ด้วย `/resolve-errors` (ดูคำสั่งเต็มที่ `/follow-tool-agent-browser`)

1. ใช้ `agent-browser screenshot` หรือ `agent-browser screenshot --annotate` เพื่อ capture หน้าจอก่อนว่าแสดงอะไร
2. ถ้าอยากดูเพิ่มหรือต้องการ focus ที่ console errors → ใช้ `/watch-browser-console`
3. ใช้ `agent-browser snapshot -i` สำหรับ interactive elements และ `agent-browser console` สำหรับ console messages

### 5. Cleanup

> Goal: ปิด browser session อย่างสะอาด

1. ปิด browser session ด้วย `agent-browser close`
2. สรุปผลลัพธ์และ errors ที่พบ

## Rules

### 1. Continuous Monitoring

Monitor อย่างต่อเนื่องและมีประสิทธิภาพ ใช้ `agent-browser snapshot -i` เพื่อดู interactive elements และ refs อย่างต่อเนื่อง (ดูคำสั่งเต็มที่ `/follow-tool-agent-browser`)

- ใช้ `agent-browser snapshot -i` เพื่อดู interactive elements และ refs อย่างต่อเนื่อง
- ใช้ `agent-browser snapshot` เพื่อดู full accessibility tree
- ใช้ `agent-browser screenshot` เมื่อจำเป็นสำหรับ debugging
- ใช้ `agent-browser screenshot --annotate` สำหรับ annotated screenshot พร้อม element labels
- ใช้ `agent-browser console` สำหรับดู console messages
- ใช้ `agent-browser errors` สำหรับดู page errors
- ใช้ `/watch-browser-console` สำหรับ continuous console monitoring โดยเฉพาะ

### 2. Error Handling

จัดการ errors ด้วย `/resolve-errors` เมื่อเจอ error และใช้ `browser-preview` tool เป็น fallback (ดูรายละเอียดที่ `/follow-tool-agent-browser`)

- เมื่อเจอ error ต้องเรียก `/resolve-errors` ทันที
- ถ้า `daemon` error ให้ใช้ `browser-preview` tool แทน
- ถ้า `agent-browser` ไม่ติดตั้ง ให้ใช้ `browser-preview` tool แทน
- บันทึก error logs ด้วย `agent-browser console` และ `agent-browser errors`
- ตรวจสอบ element availability ก่อน interact ด้วย `agent-browser wait @e1`

### 3. Timeout And Retry Limits

- `timeout` = `600` วินาที (10 นาที) สำหรับการ watch ทั้งหมด
- `maxErrors` = `20` ก่อน stop และ report
- `maxRetries` = `3` สำหรับ `agent-browser` crash recovery
- ถ้าเกิน timeout หรือ maxErrors → stop และ report สรุป errors ที่พบ

### 4. Graceful Shutdown

- หยุดทันทีเมื่อ user กด `Ctrl+C`
- ปิด browser session ด้วย `agent-browser close` ก่อนหยุด

### 5. Rollback Safety

- ก่อนแก้ไข code ด้วย `/resolve-errors` ให้สร้าง checkpoint ด้วย `git stash`
- ถ้า fix สร้าง error ใหม่ → `git stash pop` เพื่อคืนค่า

## Expected Outcome

- Browser เปิดและ watch URL อย่างต่อเนื่อง
- Console และ network requests ถูก monitor อย่างต่อเนื่อง
- Errors ที่เกิดขึ้นถูกแก้ไขอัตโนมัติ
- การ watch ทำงานต่อเนื่องโดยไม่ขัดจังหวะ