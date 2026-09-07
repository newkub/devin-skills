---
name: deep-review-codebase-then-fix
description: Review ลึกทั้ม codebase แล้วแก้ไขตาม suggestion หรือ fix all
argument-hint: "[scope]"
related:
  - deep-review-codebase
  - review-then-fix
  - fix
  - follow-your-suggestion
  - report
  - deep-validate
  - suggest-next-action
---

## Goal

Review ลึกทั้ม codebase แล้วแก้ไข issues ตาม `/follow-your-suggestion` หรือ fix all ตาม context

## Scope

ใช้เมื่อต้องการ review ทั้ง codebase และ fix ต่อเนื่องในทีเดียว รองรับ code, docs, และ skills

## Execute

### 1. Deep Review

> Goal: หา issues ครบถ้วน

1. ทำ `/deep-review-codebase` เพื่อรวบรวม findings
2. จัดลำดับ findings ตาม severity
3. สรุป evidence พร้อม file path และ line number

### 2. Decide Fix Mode

> Goal: เลือกวิธี fix

1. ถ้า user ต้องการ fix ตาม suggestion ทีเคยวิเคราะห์ไว้ → ทำ `/follow-your-suggestion`
2. ถ้า user ต้องการ fix all → ทำ `/fix all`
3. ถ้าไม่ชัด → ทำ `/ask-me`

### 3. Apply Fixes

> Goal: แก้ไขตาม plan

1. ถ้า fix ตาม suggestion → ทำตามขั้นตอนที `/follow-your-suggestion` แนะนำ
2. ถ้า fix all → ทำ `/review-then-fix` หรือ `/fix` ตามลำดับ findings
3. แก้ทีละ batch พร้อม verify

### 4. Verify

> Goal: ยืนยันผลหลัง fix

1. รัน `/run-check`
2. รัน `/run-test-unit` ถ้ามี
3. ทำ `/deep-validate`
4. ถ้าไม่ผ่าน → กลับไป step 3

### 5. Report

> Goal: สรุปผล

1. ทำ `/report-before-after` เปรียบเทียบก่อน/หลัง
2. ทำ `/suggest-next-action`

## Rules

- ไม่แก้ไขโดยไม่ได้รับ confirmation ยกเว้น user ระบุ `fix all` หรือ `/follow-your-suggestion` ชัดเจน
- ทำ `/deep-review-codebase` ก่อน fix เสมอ
- แก้ทีละ batch แล้ว verify
- รักษา behavior เดิม

- ใช้ /deep-review ถ้าจำเป็น
- ใช้ /resolve-errors ถ้าจำเป็น

## Expected Outcome

- Codebase ถูก review ครบ
- Issues ถูก fix ตาม suggestion หรือทั้งหมด
- ผ่าน verify
- รายงาน before/after ชัดเจน
