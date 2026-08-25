---
name: watch-browser-console
description: Watch browser console อย่างต่อเนื่อง จัดการ errors อัตโนมัติด้วย agent-browser
argument-hint: "[url]"
---

## Goal

Watch browser console อย่างต่อเนื่องเพื่อตรวจจับและแก้ไข errors อัตโนมัติ โดยใช้ `agent-browser` CLI

## Scope

ใช้สำหรับ monitor console messages และ page errors อย่างต่อเนื่อง พร้อมแก้ไข errors ที่พบโดยอัตโนมัติ

## Execute

### 1. Open Browser

> Goal: Open Browser

เปิด browser และ navigate ไปยัง URL ตาม `/follow-tool-agent-browser` ข้อ 2

1. ใช้ `agent-browser open <url> --headed` เพื่อเปิด browser แบบมองเห็นหน้าต่าง
2. ถ้าเปิดไม่ได้ ให้ใช้ `browser-preview` tool แทนตาม `/follow-tool-agent-browser` ข้อ 8

### 2. Clear Console

> Goal: Clear Console

เคลียร์ console ก่อนเริ่ม watch ตาม `/follow-tool-agent-browser` ข้อ 4

1. ใช้ `agent-browser console --clear` เพื่อ clear console messages
2. ใช้ `agent-browser errors --clear` เพื่อ clear page errors

### 3. Watch Console

> Goal: Watch Console

Monitor console อย่างต่อเนื่องตาม ## Rules ข้อ 1

1. ใช้ `agent-browser console` เพื่อดู console messages
2. ใช้ `agent-browser errors` เพื่อดู page errors
3. วนซ้ำทุก 5 วินาที เพื่อเช็ค console ใหม่
4. ถ้าเจอ error ใหม่ ให้ไปขั้นตอนที่ 4

### 4. Resolve Errors

> Goal: Resolve Errors

แก้ไข errors ที่พบตาม `/resolve-errors`

1. อ่าน error message และ stack trace ทั้งหมด
2. ทำ `/resolve-errors` เพื่อแก้ไข error ที่พบ
3. หลังแก้ไข ให้ reload หน้าเว็บด้วย `agent-browser reload`
4. กลับไปขั้นตอนที่ 2 เพื่อ clear console และ watch ต่อ

### 5. Cleanup

> Goal: Cleanup

ทำ cleanup หลังจากใช้งานเสร็จตาม `/follow-tool-agent-browser` ข้อ 7

1. ปิด browser session ด้วย `agent-browser close`
2. สรุปผลลัพธ์และ errors ที่พบและแก้ไขแล้ว

## Rules

### 1. Continuous Console Monitoring

Monitor console อย่างต่อเนื่อง ดูคำสั่งเต็มที่ `/follow-tool-agent-browser` ข้อ 4

- ใช้ `agent-browser console` สำหรับดู console messages
- ใช้ `agent-browser errors` สำหรับดู page errors
- ใช้ `agent-browser console --clear` สำหรับ clear console ก่อนเริ่ม watch ใหม่
- ใช้ `agent-browser errors --clear` สำหรับ clear errors ก่อนเริ่ม watch ใหม่
- วนซ้ำทุก 5 วินาที เพื่อเช็ค console และ errors ใหม่
- ถ้าเจอ error ใหม่ ให้ทำ `/resolve-errors` ทันที

### 2. Error Handling

จัดการ errors ตาม `/follow-tool-agent-browser` ข้อ 5

- เมื่อเจอ error ต้องเรียก `/resolve-errors` ทันที
- ถ้า `daemon` error ให้ใช้ `browser-preview` tool แทน
- ถ้า `agent-browser` ไม่ติดตั้ง ให้ใช้ `playwriter` skill แทน
- บันทึก error logs ด้วย `agent-browser console` และ `agent-browser errors`
- หลังแก้ไข error ให้ `agent-browser reload` แล้ว watch ต่อ

### 3. Integration With Watch Browser

- ใช้ `/watch-browser` สำหรับ monitoring ที่ครอบคลุมทั้ง snapshot และ console
- ใช้ `/watch-browser-console` เฉพาะเมื่อต้องการ focus ที่ console errors เท่านั้น
- ทั้งสอง workflow ใช้ `/follow-tool-agent-browser` เป็น base

## Expected Outcome

- Console messages ถูก monitor อย่างต่อเนื่อง
- Errors ที่เกิดขึ้นถูกแก้ไขอัตโนมัติด้วย `/resolve-errors`
- การ watch ทำงานต่อเนื่องโดยไม่ขัดจังหวะ
- มีสรุปผล errors ที่พบและแก้ไขแล้ว