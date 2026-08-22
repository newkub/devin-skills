---
name: cli
description: รัน analyze-codebase-quality CLI บน project ทีระบุ
argument-hint: [path] [options]
allowed-tools:
  - read
  - exec
  - glob
  - ask_user_question
triggers:
  - user
  - model
related:
  - analyze-codebase-quality
  - validate
  - run-check
---

## Goal

รัน `analyze-codebase-quality` CLI เพื่อ analyze project

## Scope

ใช้กับ project ทีต้องการวิเคราะห์คุณภาพด้วย CLI ใน `analyze-codebase-quality/cli`

## Execute

### 1. Check Prerequisites

> Goal: ตรวจสอบ CLI พร้อมใช้

1. ตรวจสอบว่าอยู่ใน `analyze-codebase-quality/cli` workspace
2. ถ้าไม่ใช่ → ถาม user ว่า `cli-path` อยู่ทีไหน
3. ทำ `/run-check` เพื่อตรวจ bun และ dependencies

### 2. Build CLI

> Goal: มี `dist/cli.js` พร้อมรัน

1. รัน `bun run build` ที root cli monorepo
2. ถ้า build ไม่ผ่าน → ทำ `/resolve-errors`

### 3. Run Analyzer

> Goal: รัน analyzer กับ target path

1. รับ `path` และ `options` จาก user
2. รัน `bun run --cwd apps/cli start -- [path] [options]`
3. จับ output หรือ error

### 4. Report

> Goal: สรุปผล

1. ถ้าสำเร็จ → แสดง output ทีได้
2. ถ้ามี `--output` → ยืนยัน path ที save
3. ถ้า error → ทำ `/resolve-errors`

## Rules

### 1. Safety

- ไม่ overwrite ไฟล์โดยไม่ได้ user confirm
- ไม่รัน analyzer บนระบบไฟล์สำคัญโดยไม่ได้อนุญาต
- ถ้า `path` ไม่ระบุ → ใช้ `.`

### 2. Output

- default output คือ stdout
- รองรับทุก flags ของ CLI
- ไม่ dump ทั้งหมดถ้า output ยาวเกิน

### 3. Build

- build ก่อนรันเสมอ
- ถ้า build ผ่านแล้ว ไม่ต้อง build ซ้ำถ้า code ไม่เปลี่ยน

## Expected Outcome

- CLI รันสำเร็จ
- Output แสดงหรือ save ตาม flags
- Error ถูก report ถ้ามี
