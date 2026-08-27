---
name: check-file-relations
description: วิเคราะห์ความสัมพันธ์ระหว่างไฟล์ หา imports, consumers และ references
related:
  - update-references
  - check-broken-refs
  - check-code-structure
  - report-table
  - follow-tool-ast-grep
  - search-files-patterns
---

## Goal

วิเคราะห์ความสัมพันธ์ระหว่างไฟล์ใน project หรือ skills repo เพื่อเข้าใจ dependencies, imports, exports, consumers, และ external references ก่อน update-references หรือ refactor

## Scope

ใช้เมื่อ:
- จะย้าย เปลี่ยนชื่อ หรือลบไฟล์
- จะ update references
- ต้องการทราบ impact ของการเปลี่ยนแปลง
- ตรวจสอบว่ามีไฟล์ใดอ้างถึงเป้าหมายบ้าง

รองรับหลาย ecosystem: Bun/Node, Rust, Python, Go, และ `SKILL.md`/`AGENTS.md`/`global_rules.md`

## Execute

### 1. Identify Target Files

> Goal: ระบุไฟล์ที่ต้องการตรวจสอบ

1. รับ target files จาก arguments หรือ `git status --porcelain`
2. ยืนยันว่าไฟล์มีอยู่จริง
3. ระบุประเภท: source code, config, docs, skill, workflow

### 2. Detect Ecosystem

> Goal: เลือกวิธีค้นหา relation ตาม tech stack

1. ตรวจสอบ `package.json` → Bun/Node
2. ตรวจสอบ `Cargo.toml` → Rust
3. ตรวจสอบ `go.mod` → Go
4. ตรวจสอบ `pyproject.toml`/`requirements.txt` → Python
5. ถ้าไฟล์เป็น `SKILL.md` → ใช้ skill reference patterns
6. ถ้าไฟล์เป็น `AGENTS.md` หรือ `global_rules.md` → ใช้ workflow reference patterns

### 3. Find Local Imports And Exports

> Goal: หา import/export ภายใน project

1. ใช้ `grep` หรือ `ast-grep` หา patterns ตาม ecosystem:
   - Bun/Node: `from '...'`, `import ... from '...'`, `require('...')`, `export ... from '...'`
   - Rust: `use ...`, `mod ...`, `pub mod ...`, `extern crate ...`
   - Python: `from ... import`, `import ...`
   - Go: `import "..."`
2. สร้าง map ของแต่ละ target file → files ที่ import มัน
3. สร้าง map ของแต่ละ target file → files ที่มัน import

### 4. Find Global References

> Goal: หา references นอก project (skills, rules, workflows)

1. ถ้ามี `workspace` หรือ `skills` directory ที่ต้องการตรวจ ให้ค้นหา references ทั้งหมด
2. ใช้ `grep` หา `/<target-skill>` หรือชื่อเป้าหมายใน `SKILL.md`/`AGENTS.md`/`global_rules.md`
3. ใช้ `grep` หา `target file name`, `target directory name`, `target skill name` ใน docs และ rules
4. บันทึก global references แยกจาก local imports

### 5. Build Relation Map

> Goal: สร้างภาพรวมความสัมพันธ์

1. รวม local imports + global references
2. ระบุ direction: import (target อ้างอิงอื่น) / consumer (อื่นอ้างอิง target)
3. จัดกลุ่มตาม severity:
   - Critical: target ถูก import/export โดยไฟล์อื่น
   - Warning: target ถูกกล่าวถึงใน docs/rules/skills
   - Info: target ไม่มี relation

### 6. Report

> Goal: รายงาน relation map

1. ทำ `/report-table`: target, relation type, related file, direction, severity
2. ระบุ files ที่ต้อง update references ถ้าย้าย/ลบ/เปลี่ยนชื่อ target
3. ทำ `/suggest-next-action` แนะนำ `/update-references` หรือ `/refactor`

## Rules

### 1. Read Only

- ไม่แก้ไขไฟล์ใดๆ
- ใช้ `read`, `grep`, `ast-grep`, `glob` เท่านั้น
- ถ้าจำเป็นต้องสร้าง script ชั่วคราว ให้เก็บใน `$env:TEMP`

### 2. Filter False Positives

- ไม่นับ URL, file paths ที่ไม่ใช่ module imports
- ไม่นับ comments, strings ที่ไม่ใช่จริง (ถ้า detect ได้)
- ไม่นับ npm package names เมื่อค้นหาใน skill repo
- ไม่นับ markdown headings หรือ anchors

### 3. Multi Ecosystem

- รองรับ Bun/Node `.ts`, `.js`, `.tsx`, `.jsx`
- รองรับ Rust `.rs`
- รองรับ Python `.py`
- รองรับ Go `.go`
- รองรับ skills `.md` references

### 4. No Auto Fix

- `check-file-relations` วิเคราะห์และรายงานเท่านั้น
- ถ้าต้องการแก้ → ทำ `/update-references` หลังจากนี้

## Expected Outcome

- Relation map ครอบคลุม local imports และ global references
- ระบุ consumers ของ target files ชัดเจน
- ระบุ severity ของแต่ละ relation
- รายงานพร้อม action items สำหรับ `/update-references`
