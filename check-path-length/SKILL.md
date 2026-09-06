---
name: check-path-length
description: หา file paths ที่เกิน Windows MAX_PATH (260) — สาเหตุ build/copy/extract พัง
argument-hint: "[path]"
related:
  - check-long-files
  - check-size
  - list-file-structure
  - fix
  - report-table
---

## Goal

ตรวจหา paths ที่ยาวเกิน Windows limits (MAX_PATH = 260 chars, หรือ component >255) — สาเหตุที่ build, copy, extract, git clone พังบน Windows

## Scope

- ตรวจ full path lengths ของ files/dirs ทั้งหมดภายใต้ path ที่ระบุ
- ครอบคลุม: paths >260 chars, path components >255 chars, deep nesting, node_modules depth
- Read-only: รายงาน — แก้ผ่าน rename/restructure แยก

## Execute

### 1. Scan Path Lengths

> Goal: วัดความยาวทุก path

1. Enumerate ทุก file/dir ใต้ path — คำนวณ full path length
2. จัดกลุ่ม: `safe` (<200), `warning` (200-260), `exceeds` (>260), `component-too-long` (>255 per segment)
3. รวม drive letter + separators ในการนับ

### 2. Identify Patterns

> Goal: หาสาเหตุของ paths ยาว

1. Deep nesting: monorepo `packages/*/src/features/...`, generated paths
2. `node_modules` depth — nested deps ที่ยาวที่สุดเสมอ
3. Long filenames: test snapshots, hashed names, generated assets
4. Long base path: project อยู่ลึกใน `D:\Users\...\Documents\Projects\...`

### 3. Assess Impact

> Goal: ระบุว่า paths ยาวทำอะไรพัง

1. Tools ที่จะ fail: robocopy, older .NET APIs, some zip tools, git on Windows (longpaths off)
2. `git config core.longpaths` — เช็คว่าเปิดไว้ไหม
3. Windows long-path support: registry `LongPathsEnabled` + manifest — ตรวจ system state

### 4. Report

> Goal: สรุป at-risk paths พร้อม fixes

1. ใช้ `/report-table`: `No.`, `Path` (truncated), `Length`, `Risk`, `Cause`, `Fix`
2. Top offenders เรียงตามความยาว
3. แนะนำ: enable long paths, shorten base path, flatten structure (`/flatten-directory`), `.gitignore` deep generated paths

## Rules

### 1. Evidence-Based

- วัด length จริงต่อ path — ไม่เดาจาก structure
- แยก "เกิน limit ตอนนี้" ออกจาก "จะเกินเมื่อ clone ลง path ลึกขึ้น"

### 2. Windows Aware

- `\\?\` prefix bypass ได้แต่ไม่ใช่ทุก tool รองรับ — ระบุ context
- component limit (255) ต่างจาก full-path limit (260) — ตรวจทั้งคู่

### 3. Read-Only

- ไม่ rename/ย้าย — รายงานให้ `/flatten-directory` หรือ user จัดการ
- ไม่แก้ registry/git config เอง — เสนอพร้อมขั้นตอน

## Expected Outcome

- รายการ paths ที่เสี่ยง/เกิน limit พร้อมความยาวจริง
- Root causes: nesting, long names, deep base
- Fix options: long-path enable, restructure, relocate
