---
name: then-apply
description: Apply งานถัดไปให้สอดคล้องกับ context หรือผลลัพธ์ก่อนหน้า
argument-hint: "[action-or-skill]"
related:
  - follow-your-suggestion
  - continue
  - report
  - manage
  - suggest-next-action
  - deep-validate
  - run-check
  - ask-me
---

## Goal

Apply งานถัดไปตาม context หรือผลลัพธ์ก่อนหน้า เช่น ทำ `x` จากนั้นทำ `y` ให้เข้ากับ `x`

## Scope

ใช้เมื่อมี action หรือ skill ก่อนหน้า และต้องการ apply งานถัดไปโดยไม่ทิ้ง context รองรับการปรับ code, config, docs, skills ตามผลลัพธ์ทีผ่านมา

## Execute

### 1. Capture Previous Context

> Goal: รู้ว่าเคยทำอะไรมา

1. อ่าน todo list, รายงานล่าสุด, และ git status
2. อ่านข้อความ/คำสั่่งล่าสุดของ user
3. ระบุ output, findings, หรือ suggestion จาก action ก่อนหน้า
4. ถ้าไม่มี context → ทำ `/ask-me`

### 2. Determine Next Apply

> Goal: รู้ว่าต้อง apply อะไรต่อ

1. ถ้ามี suggestion เฉพาะจาก context ก่อนหน้า → ทำ `/follow-your-suggestion`
2. ถ้า user ระบุ action/skill ถัดไป → ทำ `/continue`
3. ถ้าไม่ชัด → ทำ `/suggest-next-action`

### 3. Align And Apply

> Goal: ให้งานถัดไปสอดคล้องกับงานก่อน

1. ตรวจสอบ dependencies ระหว่างงานก่อนกับงานถัดไป
2. ปรับ scope ให้ไม่ทับซ้อนหรือขัดแย้ง
3. แก้ไขหรือ apply ตาม context
4. ถ้าต้องแก้หลายที่ → ทำ `/manage`

### 4. Validate

> Goal: ยืนยันว่า apply ถูกต้อง

1. รัน `/run-check` ถ้าเป็น code
2. ทำ `/deep-validate` ถ้าต้องตรวจหลายมิติ
3. ตรวจว่าไม่ทำลายงานก่อนหน้า

### 5. Report

> Goal: สรุปลำดับงาน

1. ทำ `/report` คอลัมน์: `No.`, `Step`, `Action`, `Input From Previous`, `Output`, `Status`
2. ทำ `/suggest-next-action`

## Rules

- ไม่ apply โดยไม่มี context หรือ user intent ชัดเจน
- ทุก apply ต้องสอดคล้องกับผลลัพธ์ก่อนหน้า
- ถ้าขัดแย้งกับงานก่อนหน้า → stop และถาม user
- ไม่ลบหรือทับซ้อนผลงานทีเสร็จแล้ว

## Expected Outcome

- งานถัดไปถูก apply ตาม context ก่อนหน้า
- ไม่มี regression กับงานก่อนหน้า
- รายงานลำดับ action พร้อมสถานะ
- ทราบ next action
