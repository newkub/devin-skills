---
name: follow-git-hooks
description: จัดการ git hooks อย่างเป็นระบบ ครอบคลุม pre-commit, pre-push, pre-merge-commit ผ่าน hk
triggers:
  - user
  - model
allowed-tools:
  - read
  - write
  - edit
  - exec
  - grep
related:
  - follow-hk
  - follow-biome
  - run-check
---

## Goal

จัดการ git hooks อย่างเป็นระบบ ครอบคลุม pre-commit, pre-push, pre-merge-commit ผ่าน hk

## Scope

ครอบคลุม git hooks management: configuration, validation และ troubleshooting โดยใช้ hk แทน Lefthook

## Execute

### 1. Check Hook Configuration

> Goal: ตรวจสอบ config พื้นฐาน

1. ทำ `/follow-hk` เพื่ออ่าน hk configuration
2. ตรวจสอบ `hk.pkl` ว่ามี hooks ครบ: `pre-commit`, `pre-push`, `pre-merge-commit`
3. ตรวจสอบ `hk install` หรือ `hk install --global` ทำงาน
4. รัน `hk --version` เพื่อตรวจสอบเวอร์ชัน

### 2. Pre-Commit Hooks

> Goal: ตรวจสอบ pre-commit steps

1. ตรวจสอบ `pre-commit` รัน Biome lint และ format บน staged files
2. ตรวจสอบ `fix = true` และ `stash = "git"` ใน `pre-commit`
3. ตรวจสอบ glob patterns: `*.{ts,tsx,js,jsx,vue}` สำหรับ lint
4. ตรวจสอบ `exclude` สำหรับ `.agents/**` และ `.devin/**`
5. ตรวจสอบ `gitleaks` step สำหรับ secret scanning

### 3. Pre-Push Hooks

> Goal: ตรวจสอบ pre-push steps

1. ตรวจสอบ `pre-push` รัน `scan`, `typecheck`, `test` แบบ parallel
2. ตรวจสอบว่า typecheck ใช้ `tsc` ผ่าน `bun run typecheck`
3. ตรวจสอบว่า test ใช้ `vitest` หรือ `bun test`
4. ตรวจสอบว่า steps มี `stomp = true` เพื่อไม่ lock files

### 4. Pre-Merge-Commit Hooks

> Goal: ตรวจสอบ pre-merge-commit steps

1. ตรวจสอบ `pre-merge-commit` รัน `typecheck`
2. ตรวจสอบว่าไม่ใช้ชื่อ `pre-merge` (ต้องเป็น `pre-merge-commit`)
3. ตรวจสอบว่า hooks รันผ่าน Bun runtime

### 5. Troubleshoot Hooks

> Goal: แก้ไขปัญหา hooks

1. รัน `hk run <hook-name>` เพื่อทดสอบ hook แบบ manual
2. ถ้า hook fail ให้อ่าน error และแก้ไข root cause
3. ห้าม bypass hooks ด้วย `HK=0 git commit` โดยไม่จำเป็น
4. รัน `hk install` ถ้า hooks ไม่ทำงาน
5. ทำ `/run-check` เพื่อตรวจ lint/typecheck/scan

## Rules

### 1. Hook Naming

- ใช้ชื่อ Git hooks ที่ถูกต้อง: `pre-commit`, `pre-push`, `pre-merge-commit`
- ห้ามใช้ `pre-merge` (ไม่ใช่ valid Git hook)
- ใช้ hk configuration เสมอ ไม่ใช่ native git hooks

### 2. Hook Safety

- ห้าม bypass hooks โดยไม่จำเป็น
- ถ้า hook fail ให้แก้ root cause ไม่ใช่ disable hook
- ตรวจสอบว่า hooks รันผ่าน Bun runtime
- ไม่ใช้ `npx` หรือ `node` โดยตรง ใช้ `bunx` หรือ `bun run`

### 3. Configuration Standards

- ใช้ `hk.pkl` สำหรับ config
- ใช้ `fix = true` สำหรับ pre-commit
- ใช้ `stash = "git"` สำหรับ pre-commit
- ใช้ `stomp = true` สำหรับ workspace-wide checks
- ใช้ `exclude` เป็น `List(...)`
- ใช้ `batch = true` สำหรับเครื่องมือที่รองรับ
- รัน hooks แบบ parallel เมื่อเป็นไปได้

### 4. Non-Redundancy

- รายละเอียด hk configuration อยู่ใน `/follow-hk` แล้ว
- รายละเอียด quality checks อยู่ใน `/run-check` แล้ว

## Expected Outcome

- Git hooks ทำงานอย่างถูกต้องผ่าน hk
- ไม่มีการ bypass hooks โดยไม่จำเป็น
- Pre-commit รัน lint/format/gitleaks อัตโนมัติ
- Pre-push รัน typecheck และ test ก่อน push
- Pre-merge-commit รัน typecheck ก่อน merge
