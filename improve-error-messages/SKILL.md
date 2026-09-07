---
name: improve-error-messages
description: ปรับคุณภาพ error messages ที่ user เห็นให้บอกสาเหตุและวิธีแก้ชัดเจน
argument-hint: "[path-or-layer]"
related:
  - improve-error-handling
  - report-table
---

## Goal

ปรับ error messages ทั้งระบบให้ user เข้าใจ — บอกว่าเกิดอะไร, ทำไม, และแก้อย่างไร แทน generic errors หรือ stack traces ดิบ

## Scope

- ตรวจ user-facing errors: API error responses, CLI errors, UI error states, validation messages, thrown errors ที่ propagate ถึง user
- ครอบคลุม: message clarity, actionable guidance, error codes, consistent format, localization readiness
- Action-oriented: แก้ messages จริง — แยกจาก error handling mechanics (`/improve-error-handling`)

## Execute

### 1. Inventory Error Surfaces

> Goal: รวบรวมจุดที่ errors ถึง user

1. ใช้ `search-files-patterns`/`use-astgrep` หา error constructions: `throw new Error('...')`, API error responses, `catch` ที่ return user-facing messages
2. จัดกลุ่มตาม surface: API responses, CLI stderr, UI toasts/pages, validation
3. เก็บตัวอย่าง messages ปัจจุบันเพื่อเป็น baseline

### 2. Evaluate Message Quality

> Goal: flag messages ที่ไม่ช่วย user

1. flag generic: `'Error'`, `'Something went wrong'`, `'Invalid input'`, `'Failed'`
2. flag internal leaks: stack traces, SQL errors, internal paths ที่ user เห็น
3. flag messages ที่บอกแค่ปัญหาแต่ไม่บอกวิธีแก้
4. flag inconsistency: format ต่างกัน, casing ต่างกัน, บางอันมี code บางอันไม่มี
5. flag technical jargon ที่ user ปลายทางไม่เข้าใจ

### 3. Rewrite Messages

> Goal: แก้ให้ทุก message ตอบ 3 คำถาม

1. ทุก message ต้องบอก: what (เกิดอะไร), why (ถ้าทราบ), how (แก้อย่างไร/next step)
   - แย่: `Invalid token` → ดี: `Token expired — run 'auth login' to refresh`
2. เพิ่ม error codes สำหรับ API errors ที่ต้อง programmatic handling
3. ทำ format ให้ consistent — define error shape เดียว (`{ code, message, details? }` สำหรับ API)
4. ข้อมูล internal (stack, SQL) ให้ไปอยู่ใน logs ไม่ใช่ user-facing message
5. เตรียม messages สำหรับ i18n ถ้า project มี localization (ใช้ message keys)

### 4. Verify And Report

> Goal: ทดสอบ error paths จริง

1. trigger error conditions จริง — ดูว่า user เห็นอะไร
2. ใช้ `/report-table` สรุป: `No.`, `Location`, `Before`, `After`, `Type`
3. `/run-test` ต้องผ่าน — ระวัง tests ที่ assert exact message strings (อัปเดตตาม)

## Rules

### 1. User-First

- เขียนสำหรับ user ปลายทางไม่ใช่ developer — หลีกเลี่ยง jargon
- ห้าม leak internal details (paths, queries, stack) ใน user-facing messages

### 2. Actionable

- ทุก message ควรมี next step — ถ้าไม่มีทางแก้ให้บอกว่าติดต่อ/ดูที่ไหน
- CLI errors ให้บอก flag/command ที่เกี่ยวข้องถ้ามี

### 3. Consistent

- format และ tone เดียวกันทั้งระบบ
- อย่าเปลี่ยน error codes/structure ที่ external consumers พึ่งพาโดยไม่ flag เป็น breaking

## Expected Outcome

- Error messages ทุกจุดบอก what/why/how ชัดเจน
- Format consistent พร้อม error codes ที่เหมาะสม
- ไม่มี internal details leak ถึง user
