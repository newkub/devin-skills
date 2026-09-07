---
name: follow-tool-madge
description: ใช้ madge หา circular dependencies และ orphan files ใน JS/TS codebase
argument-hint: "[target-or-scope]"
related:
  - run-verify
  - run-test-unit
---

## Goal

ใช้ madge หา circular dependencies และ orphan files ใน JS/TS codebase

## Scope

ใช้เมื่อ task เกี่ยวข้องกับ library/tool นี้ — setup, usage, debugging, หรือ best practices

## Execute

### 1. Setup And Usage

> Goal: ใช้งานถูกต้องตาม official docs

1. รัน `madge --circular --extensions ts,tsx src/` หา circular imports
1. ใช้ `--orphans` หาไฟล์ที่ไม่มีใคร import (dead code candidates)
1. ใช้ `--depends <file>` หา dependents ของ module เฉพาะ
1. integrate เข้า CI ด้วย exit code — circular = fail

### 2. Verify

> Goal: ตรวจสอบว่าใช้งานถูกต้อง

1. ทำ `/run-verify` สำหรับ lint, typecheck
2. ทำ `/run-test-unit` ถ้ามี test ที่เกี่ยวข้อง
3. ตรวจ official docs ล่าสุดก่อนใช้ API ที่ไม่แน่ใจ

## Rules

- circular deps แก้ด้วย extract shared module หรือ dependency inversion
- orphans ≠ dead เสมอ — เช็ค entry points (routes, workers) ก่อนลบ
- ใช้ `--ts-config` ให้ madge เห็น path aliases

## Expected Outcome

- ใช้งาน library ถูกต้องตาม best practices
- ไม่มี security/performance pitfalls ที่รู้จัก
- Lint, typecheck, tests ผ่าน