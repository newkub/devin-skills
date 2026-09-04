---
name: migration-by-astgrep
description: รัน codebase migrations ด้วย ast-grep rules สำหรับ refactor patterns, API renames และ deprecation cleanup
argument-hint: "[rule-file-or-pattern]"
related:
  - scan-codebase
  - resolve-errors
  - run-test
  - run-check
  - run-verify
  - report-table
  - suggest-next-action
---

## Goal

ใช้ ast-grep สำหรับรัน codebase migrations แบบ pattern-based ทีปลอดภัย ตรวจสอบได้ และ revert ได้

## Scope

ใช้สำหรับ refactor patterns เช่น API rename, function signature change, deprecation cleanup, import migration, framework upgrade โดยรัน ast-grep scan และ apply ทีละ batch

## Execute

### 1. Detect Migration Scope

> Goal: รู้ว่าต้อง migration อะไร

1. ทำ `/scan-codebase` เพื่อหา patterns เก่า
2. ตรวจ `package.json` versions และ breaking changes
3. ระบุ patterns ทีต้องเปลี่ยน: function names, imports, APIs, decorators
4. สร้าง list ของ target files และ patterns

### 2. Install Or Verify Ast-Grep

> Goal: มี ast-grep CLI ใช้งาน

1. ตรวจสอบ `ast-grep` ด้วย `ast-grep --version`
2. ถ้าไม่มี → ติดตั้งด้วย `mise use -g ast-grep` หรือ package manager ทีเหมาะสม
3. ใช้ `bunx @ast-grep/cli --version` ถ้าไม่ต้องการ global install

### 3. Write Ast-Grep Rules

> Goal: มี rules สำหรับ migration

1. สร้าง `ast-grep-rules/<migration-name>.yml`
2. ระบุ `language`, `rule.id`, `pattern` หรือ `regex`
3. ระบุ `fix` หรือ `rewrite` สำหรับ auto-fix
4. ทดสอบ rule ด้วย `ast-grep scan --rule ast-grep-rules/<rule>.yml`
5. ใช้ `utils.isDefinition`, `utils.isExpression`, `utils.isStatement` เมื่อจำเป็น

### 4. Dry Run Scan

> Goal: ดู matches ก่อนแก้

1. รัน `ast-grep scan --rule ast-grep-rules/<rule>.yml` โดยไม่ใช้ `--apply`
2. บันทึกจำนวน matches, files, severity
3. ตรวจ false positives
4. ปรับ rule ถ้าจับ patterns เกินหรือขาด

### 5. Apply Fixes

> Goal: แก้ code ตาม rules

1. สำรอง `git diff` หรือ commit ก่อน apply
2. รัน `ast-grep scan --rule ast-grep-rules/<rule>.yml --apply`
3. ตรวจ diff ทีเกิดขึ้น
4. ถ้ามี false positive ที่ apply ไปแล้ว → revert ด้วย `git checkout -- <file>` แล้วปรับ rule

### 6. Validate

> Goal: ยืนยันว่า migration ไม่พัง

1. รัน `git diff --stat`
2. รัน `bun run typecheck` หรือ typecheck ของ project
3. รัน `bun run lint` หรือ lint ของ project
4. รัน `bun run test` หรือ `bun run test:unit`
5. ถ้ามี fail → แก้ไขหรือ revert แล้ว refine rule

### 7. Repeat And Report

> Goal: ทำ migration ครบทุก patterns

1. ทำซ้ำสำหรับแต่ละ migration rule
2. ใช้ `/report-table` สรุปจำนวน matches, files changed, tests status
3. ทำ `/suggest-next-action`

## Rules

### 1. Start With Dry Run

- ไม่ apply โดยไม่มี dry run
- ไม่ apply ทั้งหมดในครั้งเดียว
- ทำ batch เล็กๆ ก่อน

### 2. Backup

- ต้อง commit หรือ diff ก่อน apply
- ใช้ `git diff` ตรวจทุกครั้ง
- ต้อง revert ได้

### 3. Rule Quality

- rule ต้องจำกัด scope ชัดเจน
- ระบุ `language` ถูกต้อง
- ใช้ `pattern` มากกว่า `regex` เมื่อเป็นไปได้
- ทดสอบ rule กับ 1-2 files ก่อน

### 4. Validation Gate

- ทุก apply ต้องผ่าน typecheck
- ทุก apply ต้องผ่าน lint
- ทุก apply ต้องผ่าน tests หรือมี test plan

### 5. No Unintended Changes

- ไม่แก้ไฟล์นอก scope
- ไม่ apply กับ generated files ยกเว้นมีเหตุผล
- ไม่ apply กับ third-party code

## Expected Outcome

- ast-grep rules สร้างและทดสอบแล้ว
- Patterns เก่าถูก replace ตาม rule
- Typecheck, lint, tests ผ่าน
- Diff ชัดเจนและ review ได้
- Report table สรุป migration แต่ละ rule
