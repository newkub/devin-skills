---
name: improve-naming
description: ปรับ naming consistency ข้าม codebase ตัวแปร, functions, files และ exports
argument-hint: "[path-or-convention]"
related:
  - review-writing
  - rename
  - check-file-relations
  - search-files-patterns
  - update-references
  - follow-simplicity
  - report-table
---

## Goal

ปรับ naming ทั้ง codebase ให้ consistent — ตัวแปร, functions, types, files, directories และ exports ตาม convention ของ project

## Scope

- ตรวจ naming conventions: casing (camelCase, snake_case, kebab-case), prefixes/suffixes, abbreviations, boolean naming (`is*`, `has*`), async naming, file naming
- เทียบกับ convention ที่ project ใช้จริง (infer จาก codebase) หรือที่ user กำหนด
- Action-oriented: rename จริง — ต้อง `/update-references` ทุกครั้ง

## Execute

### 1. Infer Convention

> Goal: หา naming convention ที่ project ใช้จริง

1. sample code หลายไฟล์ — ดู casing, verb patterns, suffixes (`*Service`, `*Repository`, `*Dto`)
2. ดู linter/formatter config ที่บังคับ naming (eslint naming rules, clippy)
3. ถ้า user ระบุ convention → ใช้ของ user แทน inferred
4. สรุป convention เป็น rules ที่ตรวจได้

### 2. Detect Inconsistencies

> Goal: หา names ที่ขัด convention

1. ใช้ `search-files-patterns`/`use-astgrep` หา:
   - mixed casing (`getData` vs `get_data` ใน codebase เดียว)
   - abbreviations ที่ไม่ consistent (`usr`, `user`, `account` ปนกัน)
   - boolean ที่ไม่ขึ้นต้นด้วย is/has/can/should
   - file names ที่ขัด kebab-case/snake_case convention
   - misleading names (function `get*` ที่ mutate, `*List` ที่ไม่ใช่ list)
2. flag names ที่กำกวม: `data`, `info`, `temp`, `misc`, `util` ใน public APIs

### 3. Rename Systematically

> Goal: rename ทีละกลุ่มพร้อม update references

1. เรียง: internal/private ก่อน → public API ทีหลัง (เสี่ยงน้อยกว่า)
2. ใช้ `/rename` หรือ IDE/ast-grep rename — ห้าม rename ด้วย string replace ดิบ
3. ทุก rename ต้อง `/update-references` — imports, exports, docs, tests, config keys
4. สำหรับ file renames: ใช้ `git mv` เพื่อรักษา history
5. รัน `/run-typecheck` + `/run-lint` หลังแต่ละ batch

### 4. Verify And Report

> Goal: ยืนยันไม่มี broken references

1. `/run-check` ต้องผ่านทั้งหมด
2. ค้นชื่อเก่าอีกครั้ง — ต้องไม่เหลือ references
3. ใช้ `/report-table` สรุป: `No.`, `Old`, `New`, `Type`, `Files Touched`

## Rules

### 1. Update All References

- rename symbol/file ต้อง update ทุก reference — ห้ามเหลือ stale names
- public API renames ต้องระบุ breaking change ชัดเจน

### 2. Convention First

- ใช้ convention ที่ project มีจริง — ไม่บังคับ convention ใหม่โดยไม่บอก user
- ถ้า codebase ไม่มี convention ชัด → เสนอ convention ก่อน rename ผ่าน `/ask-me`

### 3. Minimal Churn

- rename เฉพาะที่ขัด convention ชัดเจน — ไม่ rename เพื่อความชอบส่วนตัว
- batch renames ที่เกี่ยวข้องกันเพื่อลด diff noise

## Expected Outcome

- Naming consistent ตาม convention เดียวทั้ง project
- ไม่มี stale references หรือ broken imports
- รายงาน rename map ทั้งหมดพร้อมไฟล์ที่แตะ
