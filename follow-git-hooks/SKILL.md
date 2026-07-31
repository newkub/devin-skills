---
name: follow-git-hooks
description: จัดการ git hooks ผ่าน Lefthook สำหรับ pre-commit, pre-push และ pre-merge-commit
---

## Goal

จัดการ git hooks อย่างเป็นระบบ ครอบคลุม pre-commit, pre-push, pre-merge-commit ผ่าน Lefthook

## Scope

ครอบคลุม git hooks management: configuration, validation และ troubleshooting

## Execute

### 1. Check Hook Configuration

1. ทำ `/follow-lefthook` เพื่ออ่าน Lefthook configuration
2. ตรวจสอบ `lefthook.yml` ว่ามี hooks ครบ: `pre-commit`, `pre-push`, `pre-merge-commit`
3. ตรวจสอบว่า `assert_lefthook_installed: true` ตั้งค่าไว้
4. รัน `bunx lefthook version` เพื่อตรวจสอบเวอร์ชัน

### 2. Pre-Commit Hooks

1. ตรวจสอบว่า pre-commit รัน Biome lint และ format บน staged files
2. ตรวจสอบว่ามี `stage_fixed: true` เพื่อ auto-stage fixed files
3. ตรวจสอบ glob patterns: `*.{ts,tsx,js,jsx,vue}` สำหรับ lint
4. ตรวจสอบว่ามี `--no-errors-on-unmatched` สำหรับ lint

### 3. Pre-Push Hooks

1. ตรวจสอบว่า pre-push รัน typecheck และ test แบบ parallel
2. ตรวจสอบว่า typecheck ใช้ `tsc`
3. ตรวจสอบว่า test ใช้ `vitest` หรือ `bun test`
4. ตรวจสอบ fail_text messages มี actionable guidance

### 4. Pre-Merge-Commit Hooks

1. ตรวจสอบว่า pre-merge-commit รัน typecheck
2. ตรวจสอบว่าไม่ใช้ชื่อ `pre-merge` (ต้องเป็น `pre-merge-commit`)
3. ตรวจสอบว่า hooks รันผ่าน Bun runtime

### 5. Troubleshoot Hooks

1. รัน `bunx lefthook run <hook-name>` เพื่อทดสอบ hook แบบ manual
2. ถ้า hook fail ให้อ่าน fail_text และแก้ไข root cause
3. ห้าม bypass hooks ด้วย `--no-verify` โดยไม่จำเป็น
4. รัน `bunx lefthook install` ถ้า hooks ไม่ทำงาน

## Rules

### 1. Hook Naming

- ใช้ชื่อ Git hooks ที่ถูกต้อง: `pre-commit`, `pre-push`, `pre-merge-commit`
- ห้ามใช้ `pre-merge` (ไม่ใช่ valid Git hook)
- ใช้ Lefthook configuration เสมอ ไม่ใช่ native git hooks

### 2. Hook Safety

- ห้าม bypass hooks ด้วย `--no-verify` โดยไม่จำเป็น
- ถ้า hook fail ให้แก้ root cause ไม่ใช่ disable hook
- ตรวจสอบว่า hooks รันผ่าน Bun runtime
- ไม่ใช้ `npx` หรือ `node` โดยตรง

### 3. Configuration Standards

- ใช้ `stage_fixed: true` สำหรับ lint และ format
- ใช้ `exclude` เป็น YAML list format ไม่ใช่ space-separated string
- ตั้ง `fail_text` ที่ actionable ทุก hook
- รัน hooks แบบ parallel เมื่อเป็นไปได้

### 4. Non-Redundancy

- รายละเอียด Lefthook configuration อยู่ใน `/follow-lefthook` แล้ว
- รายละเอียด quality checks อยู่ใน `/run-check` แล้ว

## Expected Outcome

- Git hooks ทำงานอย่างถูกต้องผ่าน Lefthook
- ไม่มีการ bypass hooks โดยไม่จำเป็น
- Pre-commit รัน lint และ format อัตโนมัติ
- Pre-push รัน typecheck และ test ก่อน push
