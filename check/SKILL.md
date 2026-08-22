---
name: check
description: รัน workspace-level checks เช่น lint, format, typecheck, test ด้วย bun filter หรือเครื่องมืออื่น
allowed-tools:
  - exec
  - read
  - edit
  - write
triggers:
  - user
  - model
related:
  - validate
  - run-lint
  - run-format
---

## Goal

รัน checks ตาม workspace เพื่อตรวจสอบคุณภาพของ code ก่อน commit หรือ merge

## Scope

ใช้สำหรับรัน `bun --filter <workspace> check` หรือ workspace-level checks อื่น เช่น lint, format, typecheck, test

## Execute

### 1. Detect Workspaces

> Goal: หา workspaces ที่ต้องการ check

1. อ่าน root `package.json`
2. ระบุ workspace names จาก `workspaces` หรือ `packageManager`
3. ถ้าเป็น monorepo ทำ `/follow-monorepo` เพื่อเรียงลำดับ workspace ก่อน

### 2. Run Check

> Goal: รัน check ตาม workspace

1. ถ้ามี `check` script ใน workspace: รัน `bun --filter <workspace> check`
2. ถ้าไม่มี `check` script: รัน `bun --filter <workspace> lint`, `bun --filter <workspace> format --check`, `bun --filter <workspace> typecheck` ตามความเหมาะสม
3. ถ้าไม่ได้ใช้ bun ให้ใช้คำสั่ง check ของ package manager นั้น (เช่น `npm run`, `pnpm run`, `yarn workspace <workspace> check`)

### 3. Report

> Goal: รายงานผล check

1. รายงาน pass/fail ของแต่ละ workspace
2. รายงาน errors ถ้ามี
3. แนะนำ next actions เช่น `/validate` หรือ `/run-lint`

## Rules

- รัน check ตาม workspace ไม่ใช่รวมทุกอย่างเป็นก้อนเดียว
- ถ้ามี error หยุดและ report ก่อนดำเนินการต่อ
- ใช้ `bun --filter <workspace>` เป็นค่าเริ่มต้นถ้า project ใช้ bun

## Expected Outcome

- รู้ว่า workspaces ใดผ่าน check หรือไม่
- ได้รายงาน errors สำหรับ workspace ที่ fail
- ทราบ next actions ที่ควรทำต่อ

## Addendum

- สามารถใช้ `/check` ร่วมกับ `/validate` เพื่อ verify ก่อน commit หรือ merge
