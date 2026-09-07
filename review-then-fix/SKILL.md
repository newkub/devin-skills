---
name: review-then-fix
description: Review แล้วค่อย fix ตาม context โดยขอ user confirm
argument-hint: "[scope]"
related:
  - watch-browser-and-fix
  - follow-best-practice
  - deep-review-codebase
  - suggest-next-action
  - resolve-errors
---

## Goal

Review แล้วแก้ไข issues ตาม context โดยขอ user confirm ก่อนแก้

## Scope

ใช้เมื่อต้องการทั้ง review และ fix โดยไม่เฉพาะจอดจง รองรับ code, docs, และ skills

ดูเพิ่มเติม: /deep-review-codebase

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

## Fix

> ทำ section นี้เฉพาะเมื่อ user confirm ให้แก้ findings หลังรายงาน — ข้ามถ้า scope เป็น review/report-only เช่นถูก dispatch จาก `/deep-review-codebase` หรือ `/follow-review`

Merged from: improve

1. จัดลำดับ findings ตาม severity — critical ก่อน แล้วแก้ทีละรายการพร้อม verify ทันทีหลังแก้
2. เลือก fix guide ที่ตรงกับ finding จากรายการด้านล่าง
3. ทุก fix ต้องรักษา behavior เดิม ผ่าน `/run-check` และ `/run-test` ถ้ามี แล้วสรุปผลด้วย `/report-before-after`

- `references/fix-improve.md` — ปรับปรุงสิ่งใดๆ ใน project ตาม context โดยหา gaps แล้วแก้ไข
## Expected Outcome

- รายงาน issues ก่อน fix
- issues ถูกแก้ไขตามที่ user ตกลง
- ผ่าน verify
- สรุป next action
