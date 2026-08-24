---
name: analyze-codebase-quality
description: วิเคราะห์คุณภาพของ codebase ด้วย analyze-codebase-quality CLI
allowed-tools:
  - read
  - exec
  - grep
  - glob
  - scan-codebase
  - report-table
  - suggest-next-action
  - validate
triggers:
  - user
  - model
related:
  - follow-write-devin-skills
  - report-table
  - scan-codebase
  - suggest-next-action
  - validate
---

## Goal

วิเคราะห์คุณภาพของ codebase ตาม `references/skill-me`

## Scope

ใช้กับ TypeScript/JavaScript projects ทีต้องการ report คุณภาพ 8 มิติ

## Execute

### 1. Load References

> Goal: เริ่มต้นด้วย instructions ทีครบถ้วน

1. อ่าน `references/skill-me`
2. อ่าน `references/file-structure` เพื่อเข้าใจ package structure

### 2. Analyze

> Goal: รัน analyzer บน target project

1. ระบุ target path จาก user
2. ทำตาม `references/skill-me` โดยเฉพาะขั้นตอนที 3
3. ถ้า CLI มีปัญหา → แจ้ง error ให้ user

### 3. Validate And Report

> Goal: สรุปผลและ validate

1. ทำ `/validate` เพื่อตรวจ output
2. ทำ `/report-table` ถ้ามีตาราง
3. ทำ `/suggest-next-action`

## Rules

### 1. References

- `references/skill-me` เป็น source of truth
- ไม่ข้าม reference โดยไม่มีเหตุผล
- ไม่เกิน 250 บรรทัด

### 2. Sub Skill

- ใช้ `cli/SKILL.md` สำหรับ build และ run CLI
- ถ้าไม่สามารถเรียก `/cli` ได้ → อ่าน `cli/SKILL.md` ด้วย `read` แล้วรันเอง

## Expected Outcome

- Report คุณภาพ codebase พร้อม evidence
- ตาราง summary
- Next action ทีชัดเจน
