---
name: search-files-patterns
description: Search file name and content patterns across codebases with glob, grep, and ast-grep
argument-hint: "[scope]"
related:
  - report-table
  - suggest-next-action
  - run-review
  - refactor
  - fix
  - search-by-astgrep
  - use-astgrep
---

## Goal

ค้นหา patterns ในไฟล์ทั้งชื่อไฟล์และเนื้อหา โดยใช้ glob, regex, และ ast-grep

## Scope

- ค้นหาไฟล์ตามชื่อ pattern เช่น `*.test.ts`, `/{mock,fixture}.*`
- ค้นหาเนื้อหาไฟล์ตาม regex หรือ AST pattern
- รองรับหลาย ecosystems: TypeScript, JavaScript, Rust, Python, Go
- ใช้ผลลัพธ์สำหรับ review, refactor, debug, หรือ audit

- ดูเพิ่มเติม: /search-by-astgrep

## Execute

### 1. Define Search Target

> Goal: ระบุ pattern ที่ต้องการค้นหา

1. ถาม user หรืออ่าน context เพื่อรู้ว่าค้นหาไฟล์ เนื้อหา หรือทั้งสอง
2. เลือก pattern type:
   - `filename`: ใช้ glob pattern
   - `content`: ใช้ regex หรือ ast-grep
   - `mixed`: ใช้ glob จำกัด scope แล้ว search เนื้อหา
3. อ่าน `?search-files-patterns/templates/common-patterns.md` สำหรับ pattern examples

### 2. Search File Names

> Goal: หาไฟล์ตามชื่อ pattern

1. ใช้ `find_file_by_name` พร้อม glob pattern
2. หรือใช้ `exec` `ls`/`Get-ChildItem` สำหรับ file system search
3. กรองผลลัพธ์ตาม extension, directory depth, หรือ exclude patterns
4. บันทึก file paths พร้อม line count ถ้าจำเป็น

### 3. Search File Contents

> Goal: หาเนื้อหาตาม pattern

1. ใช้ `grep` สำหรับ regex search ในไฟล์ขนาดเล็กถึงกลาง
2. ใช้ `ast-grep` สำหรับ AST-based patterns ถ้าเป็น code pattern
3. ใช้ `code_search` เมื่อต้องหา symbols, call sites, หรือ definitions
4. บันทึก file path, line number, และ code snippet สำหรับทุก match

### 4. Filter And Rank Results

> Goal: ลด noise และ highlight matches ที่สำคัญ

1. กรองตาม file path (เช่น `node_modules`, `dist`, `.git`, `target`)
2. กรองตาม line count หรือ file size ถ้าจำเป็น
3. ระบุ severity หรือ impact ของแต่ละ match
4. เรียงลำดับตาม directory, priority, หรือ frequency

### 5. Report

> Goal: สรุปผลการค้นหา

1. ทำ `/report-table` แสดง matches: File, Line, Pattern, Snippet, Severity
2. ทำ `/suggest-next-action` หรือ `/run-review` ถ้าต้องการดำเนินการต่อ
3. ถ้า matches มากเกิน 100 ให้สรุปเป็น top 20 พร้อม count

## Rules

### 1. Tool Selection

- ใช้ `find_file_by_name` สำหรับ glob-based file search
- ใช้ `grep` สำหรับ regex search ทั้ง codebase
- ใช้ `ast-grep` หรือ `use-astgrep` สำหรับ AST-based patterns
- ใช้ `code_search` สำหรับ complex codebase exploration

### 2. Scope Control

- ระบุ base directory ก่อน search
- ใช้ glob excludes เพื่องด `node_modules`, `dist`, `coverage`, `.git`, `target`
- ถ้า repo ใหญ่ → จำกัด depth หรือ file extension ก่อน

### 3. Evidence

- ทุก match ต้องมี file path และ line number
- ใช้ code snippet สั้นๆ ไม่เกิน 5 บรรทัด
- ถ้าใช้ `ast-grep` ให้บันทึก pattern ที่ใช้

### 4. Safety

- search เป็น read-only — ไม่แก้ไขไฟล์
- ถ้าต้องการแก้ไข → ทำ `/refactor` หรือ `/fix` หลัง search
- ไม่ expose secrets หรือ credentials ในรายงาน

### 5. Formatting

- ห้ามใช้ `` (bold markers) — ใช้ backticks สำหรับ emphasis
- ใช้ heading levels สำหรับ structure
- รายงานเป็นตารางด้วย `/report-table`

## Expected Outcome

- รายการ matches ครบถ้วนพร้อม file path, line number, snippet
- ไฟล์ที่ไม่เกี่ยวข้องถูก exclude
- รายงานในรูปแบบตารางพร้อม action ถัดไป
- ผู้ใช้ทราบว่า pattern ใช้ tool ใดและทำไม
