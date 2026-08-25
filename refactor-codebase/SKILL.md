---
name: refactor-codebase
description: Thin wrapper ของ /refactor พร้อม consistency check เพิ่มเติม
---

## Goal

Refactor codebase ครบวงจรเหมือน `/refactor` พร้อมเพิ่ม consistency check สำหรับ naming, patterns, structure, และ style

## Scope

- เป็น thin wrapper ของ `/refactor` — เรียก `/refactor` สำหรับ SRP, long files, import/export, architecture, packages, code styles
- เพิ่ม consistency check ผ่าน `/review-quality` หลัง refactor ทำสำเร็จ
- ใช้เมื่อต้องการ refactor แบบครบวงจรพร้อม consistency verification

## Execute

### 1. Delegate To Refactor

> Goal: ทำ refactor ครบวงจรผ่าน `/refactor`

1. ทำ `/refactor` สำหรับ deep review, baseline, plan, refactor by concern, update references, verify, report
2. ถ้า `/refactor` ไม่ผ่าน → หยุดและ report ตามผลของ `/refactor`

### 2. Check Consistency

> Goal: ตรวจสอบ consistency หลัง refactor

1. ทำ `/review-quality` เพื่อตรวจ inconsistencies ใน naming, patterns, structure, หรือ style
2. ถ้าพบ inconsistencies → แก้ตาม findings
3. ทำ `/run-verify`, `/run-test` อีกครั้งหลังแก้ consistency

### 3. Report

> Goal: สื่อสารผล refactor และ consistency

1. ทำ `/report` สรุป before/after จาก `/refactor` และ consistency check
2. ระบุ TODO ถ้ามี

## Rules

### 1. Delegate First

- ทำ `/refactor` ก่อนเสมอ — ไม่ duplicate logic ของ `/refactor`
- เพิ่มเฉพาะ consistency check ที่ `/refactor` ไม่ครอบคลุม

### 2. Consistency

- ทำ `/review-quality` เมื่อพบ inconsistencies ใน naming, patterns, structure, หรือ style
- รักษา conventions เดียวกันทั้ง codebase
- อัปเดต skills/configs ที่เกี่ยวข้องให้สอดคล้อง

### 3. Verification

- ต้องผ่าน `/run-verify` และ `/run-test` หลัง consistency fix
- ไฟล์ไม่เกิน 250 บรรทัด
- ไม่มี broken references

## Expected Outcome

- Codebase ผ่าน refactor ครบวงจรจาก `/refactor`
- naming, patterns, structure มี consistency ผ่าน `/review-quality`
- ผ่าน lint/typecheck/test
- รายงาน before/after รวม refactor และ consistency
