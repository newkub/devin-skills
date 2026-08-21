---
name: run-check
description: รัน lint, typecheck และ scan เพื่อตรวจสอบคุณภาพ
allowed-tools:
- read
- edit
- grep
- glob
- exec
triggers:
- user
- model
---
## Goal

## Goal

รัน lint, typecheck และ scan เพื่อตรวจสอบคุณภาพ

## Scope

Use `run-check` for the specific tasks and workflows it covers

## Execute

## Execute

### 1. Run Lint

1. ทำ `/run-lint` เพื่อตรวจสอบ code style
2. แก้ไข lint errors ถ้ามี
3. ยืนยันว่า lint ผ่าน

### 2. Run Typecheck

1. ทำ `/run-typecheck` เพื่อตรวจสอบ types
2. แก้ไข type errors ถ้ามี
3. ยืนยันว่า typecheck ผ่าน

### 3. Run Scan

1. ทำ `/run-scan` เพื่อตรวจสอบ code patterns
2. แก้ไข scan issues ถ้ามี
3. ยืนยันว่า scan ผ่าน

## Rules

## Rules

### 1. Check Order

- Lint: ตรวจสอบ code style ก่อน
- Typecheck: ตรวจสอบ types
- Scan: ตรวจสอบ code patterns

### 2. Failure Handling

- Lint ล้มเหลว: แก้ไข lint errors
- Typecheck ล้มเหลว: แก้ไข type errors
- Scan ล้มเหลว: แก้ไข scan issues

### 3. Parallel Execution

- รัน lint, typecheck และ scan แบบ parallel เมื่อเป็นไปได้
- ใช้ cache เพื่อเพิ่มความเร็ว
- รัน checks ใน CI environment

## Expected Outcome

## Expected Outcome

- Lint ผ่านทั้งหมด
- Typecheck ผ่านทั้งหมด
- Scan ผ่านทั้งหมด
- Code พร้อมสำหรับ commit/deploy
