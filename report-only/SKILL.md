---
name: report-only
description: Report current state without making any changes
allowed-tools:
  - read
  - grep
  - glob
  - exec
  - ask_user_question
triggers:
  - user
  - model
related:
  - deep-report
  - report-plan
  - analyze-project
  - scan-codebase
  - report-table
  - report-file-structure
  - report-ansi
  - suggest-next-action
  - ask-me
---

## Goal

รายงานสถานะปัจจุบันของ workspace โดยไม่แก้ไขไฟล์ใดๆ

## Scope

ใช้เมื่อต้องการข้อมูลก่อนตัดสินใจ หรือเมื่อ user ขอ report โดยไม่ต้องการ fix

## Execute

### 1. Gather Context

รวบรวมข้อมูลสถานะปัจจุบัน

> Goal: มีข้อมูลพร้อมสร้าง report

1. ทำ `/analyze-project` เพื่อวิเคราะห์ structure
2. ทำ `/scan-codebase` เพื่อหา patterns หลัก
3. อ่าน `README.md`, `AGENTS.md`, `package.json` ถ้ามี
4. ระบุ scope ที user ต้องการ report

### 2. Build Report

สร้าง report ทีอ่านง่าย

> Goal: สรุปข้อมูลสำคัญให้ user

1. ทำ `/deep-report` ถ้าต้องการ report ละเอียด
2. ใช้ `/report-table` สำหรับตารางหลาย columns
3. ใช้ `/report-file-structure` สำหรับ tree/structure
4. ใช้ `/report-ansi` สำหรับ status/progress logs

### 3. Suggest Next Action

เสนอทิศทางถัดไปโดยไม่ดำเนินการเอง

> Goal: user ตัดสินใจเอง

1. สรุป findings พร้อม evidence
2. ทำ `/suggest-next-action`
3. ถ้าต้องการ fix ให้แนะนำ `/report-and-fix`
4. ถ้ามีเรื่องเสี่ยงสูง ให้ถาม user ด้วย `/ask-me`

## Rules

### 1. No Changes

- ห้ามแก้ไข ลบ สร้าง หรือ overwrite ไฟล์
- ห้ามรัน command ทีมี side effects เช่น install, build, deploy
- ใช้ read-only commands เท่านั้น

### 2. Clear Scope

- ถาม user ว่าต้องการ report หัวข้อไหน
- ไม่ต้อง report ทุกมิติถ้าไม่จำเป็น
- ระบุว่าเป็น report-only ใน summary

### 3. Evidence Based

- ทุก finding ต้องมี file path หรือ line number
- ไม่กล่าวอ้างผลทียังไม่ตรวจสอบ
- ใช้ symbols ✅ ❌ ⚠️ สำหรับ status

### 4. Actionable Summary

- แยก findings ตาม severity
- แนะนำ next action ชัดเจน
- แยกระหว่าง report-only กับ report-and-fix

## Expected Outcome

- report สถานะปัจจุบันชัดเจน ไม่มีการแก้ไขไฟล์
- findings พร้อม evidence
- suggested next actions
- user พร้อมตัดสินใจว่าจะ fix ต่อหรือไม่
