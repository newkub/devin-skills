---
name: edit-relative-files
description: แก้ไขไฟล์ที่อ้างอิงกันแบบไม่ตรงตัว โดยค้นหา semantic และ relative references
related:
  - update-references
  - consider-use-in-another-skills
  - search-files-patterns
  - use-ast-grep
  - deep-analyze-by-use-scripts
  - edit-manual
  - report-markdown-table
---

## Goal

แก้ไข files ที่อ้างอิงถึงกันในกรณี references ไม่ตรงตัว เช่น relative paths, partial names, semantic coupling, หรือ patterns ที่เกี่ยวข้อง

## Scope

ใช้เมื่อ:
- ไฟล์ย้ายหรือเปลี่ยนชื่อ แล้ว references เป็น relative path ไม่ใช่ import ตรง
- มีการ copy-paste เนื้อหา หรือ pattern ซ้ำที่ต้องอัปเดตพร้อมกัน
- references เป็น semantic เช่น ชื่อ function, concept, business term มากกว่า file path
- ต้องค้นหาและ edit หลายไฟล์พร้อมกันโดยอ้างอิง context

## Execute

### 1. Identify Source And Target

> Goal: เข้าใจไฟล์ที่เปลี่ยนและ impact

1. ระบุไฟล์ที่ถูกแก้ไข ย้าย เปลี่ยนชื่อ หรือลบ
2. รัน `git diff` / `git status` เพื่อดู scope
3. ระบุประเภท reference: path, name, pattern, concept

### 2. Semantic Search

> Goal: หา references ทีไม่ตรงตัว

1. ใช้ `/search-files-patterns` ค้นหาด้วย basename, partial path, หรือ keywords
2. ใช้ `/use-ast-grep` หา import, call sites, string references ใน code
3. ใช้ `/deep-analyze-by-use-scripts` ถ้าต้องวิเคราะห์ pattern ซับซ้อน
4. ค้นหาใน docs, comments, config, workflows, rules

### 3. Classify References

> Goal: ตัดสินใจวิธี edit

1. **Direct path reference** → ใช้ `/update-references`
2. **Relative / partial path** → แก้ด้วย `edit` หรือ `use-ast-grep`
3. **Semantic / concept** → แก้ตาม context โดยใช้ `edit` ทีละไฟล์
4. **Pattern duplication** → ใช้ script batch replace

### 4. Edit

> Goal: แก้ไขทีละไฟล์หรือ batch

1. สำหรับแต่ละ reference:
   - อ่านไฟล์เป้าหมาย
   - หา exact match หรือ nearest context
   - แก้ไขด้วย `edit` หรือ `write`
2. ถ้าไฟล์มากเกิน 10 → ใช้ script (`use-scripts`)
3. ถ้า reference ไม่ชัดเจน → ใช้ `/edit-manual` และถาม user

### 5. Verify

> Goal: ยืนยันว่าไม่มี reference เก่าเหลือ

1. ค้นหาชื่อเก่า / path เก่าซ้ำอีกครั้ง
2. รัน `git diff` ตรวจทุกไฟล์
3. ถ้ามี lint/typecheck/test → รัน
4. ใช้ `/report-markdown-table` สรุปไฟล์ที่แก้

## Rules

- ค้นหาแบบ semantic ก่อน edit — ไม่ใช่แค่ literal replace
- ถ้า reference ไม่ตรงตัว ให้ classify ก่อน edit
- ห้าม batch replace ทั้งหมดโดยไม่ตรวจ context
- ถ้าไม่ชัดเจน → ใช้ `/ask-me`
- เก็บ evidence ของทุกไฟล์ที่แก้

## Expected Outcome

- ไฟล์ที่มี relative / semantic references ถูกแก้ไข
- ไม่มี references เก่าเหลือ
- รายงาน table ของไฟล์ที่เปลี่ยน
