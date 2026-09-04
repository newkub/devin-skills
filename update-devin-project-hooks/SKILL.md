---
name: update-devin-project-hooks
description: สร้างและอัปเดต .devin/hooks TypeScript scripts และ hooks.json ตาม project
argument-hint: "[hook-event]"
related:
  - update-dot-devin
  - run-lint
  - update-devin-global-skills
  - resolve-errors
---

## Goal

สร้างและอัปเดต `.devin/hooks/` directory พร้อม TypeScript scripts และ `hooks.json` ตาม project events

## Scope

ใช้สำหรับ project-level hooks เช่น `post_write_code` สำหรับ lint, typecheck, format หลังจาก agent เขียน code

## Execute

### 1. Analyze Project

> Goal: รู้ events และ commands ทีต้องใช้

1. อ่าน root `package.json` scripts
2. อ่าน `AGENTS.md` ถ้ามี
3. ระบุ lint, typecheck, format, test commands
4. ตรวจ `.devin/hooks/` ทีมีอยู่

### 2. Create Or Update Hooks

> Goal: สร้าง hooks directory และ scripts

1. สร้าง `.devin/hooks/` ถ้ายังไม่มี
2. สร้าง `run-lint.ts`, `run-typecheck.ts` ถ้าจำเป็น
3. ใช้ shebang `#!/usr/bin/env bun`
4. Parse JSON input จาก stdin
5. ใช้ `try/catch` สำหรับ error handling
6. ใช้ `process.exit(0)` สำหรับ success, `process.exit(1)` สำหรับ failure

### 3. Configure hooks.json

> Goal: register hooks กับ events

1. สร้าง `.devin/hooks/hooks.json`
2. ระบุ `post_write_code` สำหรับ `run-lint.ts`
3. ใช้ `show_output: true`
4. ตัวอย่าง:

```json
{
  "hooks": [
    { "event": "post_write_code", "command": ["bun", ".devin/hooks/run-lint.ts"], "show_output": true }
  ]
}
```

### 4. Validate

> Goal: ยื่นยันว่า hooks ทำงาน

1. รัน `bun .devin/hooks/run-lint.ts` ด้วย sample input
2. ตรวจ exit code
3. ตรวจ JSON syntax
4. ถ้า fail → `/resolve-errors`

### 5. Report

> Goal: สรุปผล

1. ทำ `/report-table` แสดง hook event, script, status
2. ทำ `/suggest-next-action`

## Rules

### 1. TypeScript And Bun

- ใช้ `bun` runtime เท่านั้น
- ใช้ TypeScript สำหรับ scripts
- มี shebang

### 2. Parse stdin

- Hooks ต้อง parse JSON จาก stdin
- จัดการ malformed JSON ด้วย try/catch

### 3. Idempotent

- Hooks ต้องรันได้ซ้ำโดยไม่เกิด side effects
- ไม่ overwrite โดยไม่ dry run

### 4. Safe Exit

- `process.exit(0)` สำหรับ success
- `process.exit(1)` สำหรับ failure
- ไม่ throw uncaught exceptions

### 5. No Workflows

- อย่าสร้าง `.devin/workflows/`
- Hooks ต้องอยู่ใน `.devin/hooks/`

## Expected Outcome

- `.devin/hooks/` มี scripts และ `hooks.json`
- Hooks ทำงานกับ events ทีกำหนด
- exit code ถูกต้อง
- ไม่มี `.devin/workflows/`
