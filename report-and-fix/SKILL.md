---
name: report-and-fix
description: Report findings and apply fixes with user confirmation
allowed-tools:
  - read
  - write
  - edit
  - grep
  - glob
  - exec
  - ask_user_question
triggers:
  - user
  - model
related:
  - report-only
  - deep-report
  - report-plan
  - analyze-project
  - scan-codebase
  - report-table
  - report-file-structure
  - report-ansi
  - resolve-errors
  - suggest-next-action
  - ask-me
---

## Goal

รายงานปัญหาและแก้ไขไฟล์ตามที่ user ตกลง

## Scope

ใช้เมื่อต้องการทั้ง report และ fix โดยมี user confirm ก่อนแก้ไขขั้นตอนเสี่ยง

## Execute

### 1. Report Current State

สร้าง report ก่อน fix

> Goal: user เห็นภาพรวมก่อนแก้ไข

1. ทำ `/report-only` เพื่อสร้าง report เริ่มต้น
2. ทำ `/analyze-project` และ `/scan-codebase`
3. ระบุ issues พร้อม severity

### 2. Plan Fixes

วางแผนการแก้ไข

> Goal: มีแผนชัดเจนก่อนลงมือ

1. ทำ `/deep-report` หรือ `/report-plan`
2. จัดลำดับ fixes ตาม impact ก่อน effort
3. ระบุ files ทีต้องแก้และผลกระทบ

### 3. Confirm With User

ขอ user confirm ก่อน fix

> Goal: ไม่แก้ไขโดยไม่ได้รับอนุญาต

1. ทำ `/report-table` สรุป issues, severity, suggested fix
2. ใช้ `/ask-me` หรือ `ask_user_question` ขอ approval
3. ถ้า user ปฏิเสธ → หยุดและ report สถานะ

### 4. Apply Fixes

แก้ไขตามแผน

> Goal: issues ถูกแก้ไข

1. ใช้ `edit` หรือ `write` แก้ไขไฟล์
2. ทำซ้ำตามลำดับทีวางไว้
3. ถ้ามี error → ทำ `/resolve-errors`

### 5. Verify

ตรวจสอบผลหลัง fix

> Goal: ไม่มี regression

1. รัน tests/build/typecheck ตาม ecosystem
2. ทำ `/report-before-after` เพื่อแสดง before/after
3. ทำ `/suggest-next-action`

## Rules

### 1. Report Before Fix

- ต้อง report ก่อนแก้ไขเสมอ
- ไม่แก้ไขก่อนได้รับ confirmation

### 2. Confirm Changes

- ทุก fix ที่เสี่ยงต้องได้รับ approval
- ถ้า user ข้าม/ปฏิเสธ → หยุดทันที

### 3. Safe Fix

- แก้ทีละไฟล์หรือทีละ small batch
- รัน verify หลังแก้ไข
- ถ้า fail → stop และ report

### 4. Evidence

- ทุก fix ต้องมีเหตุผลจาก report
- ระบุ file path และ line number
- ใช้ symbols แสดง status

## Expected Outcome

- report ก่อนแก้ไขชัดเจน
- issues ถูกแก้ไขตามที่ user ตกลง
- ผ่าน verify
- before/after report
- next action ชัดเจน
