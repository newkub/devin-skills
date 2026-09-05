---
name: edit-relative
description: อัปเดท references ทั้งหมดเมื่อแก้ไข ย้าย หรือลบไฟล์ ครอบคลุมทุกตำแหน่ง
argument-hint: "[target]"
related:
  - update-references
  - use-in-another-skills
  - search-files-patterns
  - use-astgrep
  - deep-analyze-by-use-scripts
  - edit-manual
  - report-table
---

## Goal

อัปเดท references ทั้งหมดที่เกี่ยวข้องเมื่อมีการแก้ไข ย้าย เปลี่ยนชื่อ หรือลบไฟล์ ครอบคลุมทั้ง direct, relative, และ semantic references

## Scope

ใช้เมื่อ:
- แก้ไขไฟล์ที่ถูกอ้างอิงจากไฟล์อื่น
- ย้ายไฟล์ไปยังตำแหน่งใหม่
- เปลี่ยนชื่อไฟล์
- ลบไฟล์ที่ถูกอ้างอิง
- เปลี่ยนชื่อ workflow หรือ skill
- references เป็น relative path, partial names, semantic coupling, หรือ patterns ที่เกี่ยวข้อง

ครอบคลุมการค้นหาใน:
- Global workflows (`~/.codeium/windsurf/global_workflows/`)
- Global skills (`%APPDATA%\devin\skills\` หรือ `~/.codeium/windsurf/skills/`)
- Project codebase (source code, configs, docs)
- `.devin/rules/` ในแต่ละ workspace
- `AGENTS.md` ในแต่ละ workspace
- Workspace workflows (`.devin/workflows/`, `.windsurf/workflows/`)
- docs, comments, config, workflows, rules

## Execute

### 1. Identify Changed Files

> Goal: ระบุไฟล์ที่เปลี่ยนและ impact

1. ระบุไฟล์ที่ถูกแก้ไข ย้าย เปลี่ยนชื่อ หรือลบจาก task ปัจจุบัน
2. รัน `git status --porcelain` หรือ `git diff` เพื่อดู scope
3. ระบุประเภทการเปลี่ยนแปลง: ย้าย เปลี่ยนชื่อ ลบ หรือแก้ไขเนื้อหา
4. ระบุประเภท reference: path, name, pattern, concept

### 2. Search For References

> Goal: ค้นหา references ทั้งหมดที่เกี่ยวข้อง

1. ค้นหาใน global workflows ด้วย `findstr` หรือ `Grep`
2. ค้นหาใน global skills ด้วย `findstr` หรือ `Grep`
3. ค้นหาใน project codebase ด้วย `Grep` หรือ `ast-grep`
4. ค้นหาใน `.devin/rules/` ของทุก workspace
5. ค้นหาใน `AGENTS.md` ของทุก workspace
6. ค้นหาใน workspace workflows (`.devin/workflows/`, `.windsurf/workflows/`)
7. ค้นหาชื่อไฟล์เก่า เส้นทางเก่า import statements และ workflow references
8. ใช้ `/search-files-patterns` ค้นหาด้วย basename, partial path, หรือ keywords
9. ใช้ `/use-astgrep` หา import, call sites, string references ใน code
10. ใช้ `/deep-analyze-by-use-scripts` ถ้าต้องวิเคราะห์ pattern ซับซ้อน
11. ค้นหาใน docs, comments, config, workflows, rules

### 3. Classify References

> Goal: ตัดสินใจวิธี edit

1. `Direct path reference` → ใช้ `/update-references`
2. `Relative / partial path` → แก้ด้วย `edit` หรือ `use-astgrep`
3. `Semantic / concept` (ชื่อ function, concept, business term) → แก้ตาม context โดยใช้ `edit` ทีละไฟล์
4. `Pattern duplication` → ใช้ script batch replace ผ่าน `/use-scripts`

### 4. Update References

> Goal: อัปเดท references ตามประเภท

สำหรับ direct references:
1. อัปเดท import paths ทั้งหมดใน codebase
2. อัปเดท file path references ทั้งหมดใน global workflows และ skills
3. อัปเดท workflow references ทั้งหมด

สำหรับ relative / semantic references:
1. อ่านไฟล์เป้าหมาย
2. หา exact match หรือ nearest context
3. แก้ไขด้วย `edit` หรือ `write`
4. ถ้าไฟล์มากเกิน 10 → ใช้ script (`/use-scripts`)
5. ถ้า reference ไม่ชัดเจน → ใช้ `/edit-manual` และถาม user

### 5. Verify Updates

> Goal: ยืนยันว่าไม่มี reference เก่าเหลือ

1. ค้นหา references เก่า / ชื่อเก่า / path เก่าซ้ำอีกครั้ง
2. รัน `git diff` ตรวจทุกไฟล์
3. รัน linting, typecheck, test ถ้ามี
4. ใช้ `/report-table` สรุปไฟล์ที่แก้

## Rules

### 1. Search Strategy

ค้นหา references อย่างครอบคลุม:

- ค้นหาทั้ง absolute paths และ relative paths
- ค้นหาทั้งชื่อไฟล์และ extension
- ค้นหาทั้ง import statements และ string references
- ค้นหาในทุก file types (.ts, .js, .md, .json, .yml, .jsonc, etc.)
- ค้นหาใน global workflows, global skills, codebase, `.devin/rules/`, `AGENTS.md`, workspace workflows, docs, comments, config, rules

### 2. Update Strategy

อัปเดท references อย่างถูกต้อง:

- อัปเดททุก references ที่พบ ไม่เว้นแม้แต่ reference เดียว
- ค้นหาแบบ semantic ก่อน edit — ไม่ใช่แค่ literal replace
- ถ้า reference ไม่ตรงตัว ให้ classify ก่อน edit
- ห้าม batch replace ทั้งหมดโดยไม่ตรวจ context
- รักษาความสม่ำเสมอของ import style
- รักษาความสม่ำเสมอของ path format
- ตรวจสอบว่า updates ไม่ทำให้เกิด syntax errors
- ถ้าเปลี่ยนชื่อ workflow ให้อัปเดททั้ง `title` และ `related_workflows` ในไฟล์ที่อ้างถึง

### 3. Verification

ตรวจสอบความถูกต้อง:

- ตรวจสอบว่า references เก่าไม่มีเหลือในทุกตำแหน่ง
- ตรวจสอบว่า references ใหม่ถูกต้อง
- ตรวจสอบว่า code ยังทำงานได้
- ตรวจสอบว่าไม่มี broken imports
- เก็บ evidence ของทุกไฟล์ที่แก้

- ใช้ /use-in-another-skills ถ้าจำเป็น

## Expected Outcome

- References ทั้งหมดถูกอัปเดทครบถ้วนในทุกตำแหน่ง
- ไฟล์ที่มี relative / semantic references ถูกแก้ไข
- ไม่มี references เก่าเหลืออยู่
- Code ยังทำงานได้หลังจาก updates
- ไม่มี linting หรือ type errors
- มีรายงาน table ของไฟล์ที่เปลี่ยน
