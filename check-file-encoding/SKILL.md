---
name: check-file-encoding
description: ตรวจ file encodings ทั้ง repo — BOM ปน, mixed line endings และ non-UTF8 files
argument-hint: "[path]"
related:
  - search-files-patterns
  - report
---

## Goal

ตรวจ encoding hygiene ของไฟล์ทั้ง repo — mixed line endings (CRLF/LF), BOM ที่ไม่ consistency, non-UTF8 files และ binary files ที่ถูก commit ผิดประเภท

## Scope

- ตรวจ text files ทั้งหมด: source, config, docs, scripts
- ครอบคลุม: encoding (UTF-8 vs others), BOM presence, line endings (CRLF/LF/mixed ในไฟล์เดียว), trailing whitespace ที่เป็น pattern
- Read-only: รายงาน — แก้ไขผ่าน formatter หรือ `.gitattributes`/`editorconfig`

## Execute

### 1. Inventory File Encodings

> Goal: สแกน encoding ของ text files ทั้งหมด

1. ใช้ `search-files-patterns` หรือ script ตรวจ byte patterns แต่ละไฟล์
2. จัดกลุ่ม: UTF-8 no BOM, UTF-8 BOM, UTF-16, ASCII, other/undetectable
3. ข้าม binary files และ generated/vendored dirs

### 2. Detect Issues

> Goal: flag anomalies ตาม project convention

1. Mixed line endings: ไฟล์เดียวที่มี CRLF+LF ปนกัน
2. Inconsistent BOM: บางไฟล์ BOM บางไฟล์ไม่มีใน filetype เดียวกัน
3. Non-UTF8: UTF-16/Latin-1 files ที่ tools อ่านผิดได้
4. Missing `.gitattributes`: repo ไม่มี `* text=auto` หรือ per-type rules → line endings ขึ้นกับเครื่อง dev
5. `.editorconfig` drift: editorconfig บอกอย่างหนึ่ง ไฟล์จริงเป็นอีกอย่าง

### 3. Check Git-Level Consistency

> Goal: ตรวจว่า git จัดการ line endings ถูก

1. `git ls-files --eol` ดู eol attributes จริงใน index
2. flag ไฟล์ที่ index eol ไม่ตรง working tree — จะเกิด phantom diffs
3. ตรวจ `.gitattributes` ครอบคลุม file types หลักไหม (`*.sh` → lf, `*.ps1`/`*.bat` → crlf)

### 4. Report

> Goal: สรุป encoding health พร้อม fixes

1. ใช้ `/report` คอลัมน์: `No.`, `File/Pattern`, `Issue`, `Current`, `Expected`, `Fix`
2. แนะนำ: เพิ่ม/แก้ `.gitattributes` และ `.editorconfig`, `git add --renormalize` ถ้าจำเป็น
3. ระบุไฟล์ที่ต้อง manual fix (non-UTF8)

## Rules

### 1. Evidence-Based

- ทุก finding ต้องมี byte-level evidence (BOM present, eol counts)
- แยก "ผิด convention" ออกจาก "อาจตั้งใจ" (เช่น fixtures ที่ต้อง CRLF)

### 2. Read-Only

- ไม่ renormalize หรือแก้ไฟล์ — รายงานแล้วให้ formatter/`git add --renormalize` ทำตาม confirm
- renormalize = mass diff — ต้องบอก impact ก่อน

### 3. Context Aware

- Windows-first repos อาจตั้งใจ CRLF — convention มาจาก `.gitattributes`/`.editorconfig` ไม่ใช่เดา
- ข้าม binary, minified และ generated files

## Expected Outcome

- รายงาน encoding anomalies แยกตามประเภทพร้อม severity
- `.gitattributes`/`.editorconfig` gaps ที่ทำให้ปัญหากลับมา
- Fix plan ที่ระบุ mass-diff impact ชัดเจน
