---
name: analyze-codebase-quality
description: วิเคราะห์คุณภาพของ codebase ด้วย analyze-codebase-quality CLI
---

## Goal

วิเคราะห์คุณภาพของ codebase ด้วย `analyze-codebase-quality` CLI

## Scope

ใช้กับ TypeScript/JavaScript projects ทีต้องการ report คุณภาพ 8 มิติ

## Execute

### 1. Install

> Goal: ติดตั้ง CLI

1. `bun add -g analyze-codebase-quality`
2. หรือ clone `https://github.com/newkub/analyze-codebase-quality.git` แล้ว `bun install && bun run build`

### 2. Analyze

> Goal: รัน analyzer บน target project

1. ระบุ target path จาก user
2. รันคำสั่ง `analyze-codebase-quality <path>`
3. ถ้า CLI มีปัญหา → แจ้ง error ให้ user

### 3. Validate And Report

> Goal: สรุปผลและ validate

1. ทำ `/deep-validate` เพื่อตรวจ output
2. ทำ `/report-table` ถ้ามีตาราง
3. ทำ `/suggest-next-action`

## Rules

### 1. CLI

- `analyze-codebase-quality` เป็น source of truth
- ถ้าไม่สามารถเรียก CLI ได้ → ติดตั้งหรือ build ก่อน
- ไม่เกิน 250 บรรทัด

## Expected Outcome

- Report คุณภาพ codebase พร้อม evidence
- ตาราง summary
- Next action ทีชัดเจน
