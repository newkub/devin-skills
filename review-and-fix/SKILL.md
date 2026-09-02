---
name: review-and-fix
description: Review แล้วแก้ไขตาม context โดยขอ user confirm
related:
  - watch-browser-and-fix
  - follow-best-practice
  - review-codebase-everything
  - suggest-next-action
  - resolve-errors
---

## Goal

Review แล้วแก้ไข issues ตาม context โดยขอ user confirm ก่อนแก้

## Scope

ใช้เมื่อต้องการทั้ง review และ fix โดยไม่เฉพาะจอดจง รองรับ code, docs, และ skills

## Execute

### 1. Identify Scope

> Goal: รู้ว่าจะ review และ fix อะไร

1. ดูรายละเอียดใน [references/identify-scope.md](references/identify-scope.md)
2. บันทึก findings พร้อม severity และ evidence

### 2. Plan Fixes

> Goal: วางแผนการแก้ไข

1. ดูรายละเอียดใน [references/plan-fixes.md](references/plan-fixes.md)
2. บันทึก findings พร้อม severity และ evidence

### 3. Confirm

> Goal: ขอ approval ก่อน fix

1. ดูรายละเอียดใน [references/confirm.md](references/confirm.md)
2. บันทึก findings พร้อม severity และ evidence

### 4. Apply Fixes

> Goal: แก้ไข issues ตามแผน

1. ดูรายละเอียดใน [references/apply-fixes.md](references/apply-fixes.md)
2. บันทึก findings พร้อม severity และ evidence

### 5. Verify

> Goal: ตรวจสอบผลหลัง fix

1. ดูรายละเอียดใน [references/verify.md](references/verify.md)
2. บันทึก findings พร้อม severity และ evidence

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

- ใช้ /watch-browser-and-fix ถ้าจำเป็น
- ใช้ /follow-best-practice ถ้าจำเป็น
- ใช้ /deep-review ถ้าจำเป็น
- ใช้ /suggest-next-action ถ้าจำเป็น
- ใช้ /resolve-errors ถ้าจำเป็น

## Metrics

- ดู metrics สำหรับ review ใน [references/scoring.md](references/scoring.md)

## Expected Outcome

- รายงาน issues ก่อน fix
- issues ถูกแก้ไขตามที่ user ตกลง
- ผ่าน verify
- สรุป next action
