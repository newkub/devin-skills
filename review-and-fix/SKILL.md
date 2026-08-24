---
name: review-and-fix
description: Review แล้วแก้ไขตาม context โดยขอ user confirm
---

## Goal

Review แล้วแก้ไข issues ตาม context โดยขอ user confirm ก่อนแก้

## Scope

ใช้เมื่อต้องการทั้ง review และ fix โดยไม่เฉพาะจอดจง รองรับ code, docs, และ skills

## Execute

### 1. Identify Scope
> Goal: รู้ว่าจะ review และ fix อะไร

1. ระบุ target files หรือ area
2. ทำ `/review` เพื่อหา issues
3. บันทึก findings พร้อม severity

### 2. Plan Fixes
> Goal: วางแผนการแก้ไข

1. จัดลำดับ fixes ตาม severity ก่อน effort
2. ระบุ files ที่ต้องแก้
3. ทำ `/report-only` สรุปแผนก่อนลงมือ

### 3. Confirm
> Goal: ขอ approval ก่อน fix

1. ใช้ `ask_user_question` ถาม user ว่าตกลงแก้ไขหรือไม่
2. ถ้า user ปฏิเสธ → stop และ report
3. ถ้า user ตกลง → ทำต่อ

### 4. Apply Fixes
> Goal: แก้ไข issues ตามแผน

1. ใช้ `edit` หรือ `write` แก้ไฟล์ทีละ step
2. ถ้า issue ซับซ้อน → ทำ `/fixer`
3. ถ้าเกิด error → ทำ `/resolve-errors`

### 5. Verify
> Goal: ตรวจสอบผลหลัง fix

1. รัน tests/build/typecheck ตาม ecosystem
2. ทำ `/validate`
3. ทำ `/suggest-next-action`

## Rules

### 1. Review Before Fix
- ต้อง review และ report ก่อนแก้ไข
- ไม่แก้ไขโดยไม่ได้รับ confirmation

### 2. Incremental Fix
- แก้ทีละไฟล์หรือ small batch
- ตรวจ verify หลังแก้

### 3. Evidence
- ทุก fix ต้องมีเหตุผลจาก review
- ระบุ file path และ line number

## Expected Outcome

- รายงาน issues ก่อน fix
- issues ถูกแก้ไขตามที่ user ตกลง
- ผ่าน verify
- สรุป next action
