---
name: review-rules
description: ตรวจสอบ .devin/rules, ast-grep rules และ AGENTS.md ให้ถูกต้อง ครบถ้วน ไม่ซ้ำซ้อน
argument-hint: "[scope]"
related:
  - scan-codebase
  - deep-validate
  - check-reference
  - report-table
  - suggest-next-action
---

## Goal

ปรับปรุง rules ทั้งใน `.devin/rules/`, ast-grep `rules/` และไฟล์ `AGENTS.md` ให้ถูกต้อง ไม่ซ้ำซ้อน และครอบคลุมทุก workspace

## Scope

ใช้สำหรับ project ที่มี `.devin/rules/`, `rules/`, `sgconfig.yml` หรือ `AGENTS.md` ไม่แก้ไข logic ของ source code

## Execute

### 1. Scan And Identify

> Goal: ค้นหา rules และ AGENTS.md ทั้งหมด

ทำตาม references/devin-rules.md

- ใช้ `/scan-codebase` และ glob pattern หา `AGENTS.md`
- ระบุ duplicate rules และ rules ที่ขาด frontmatter
- บันทึก findings

### 2. Check Rules Alignment

> Goal: ตรวจสอบความสอดคล้องของ rules

ทำตาม references/ast-grep-rules.md และ references/devin-rules.md

- เปรียบเทียบ `.devin/rules` กับ ast-grep `rules/`
- ตรวจ frontmatter, filenames และ `ruleDirs`

### 3. Validate AGENTS.md

> Goal: ตรวจสอบโครงสร้างและ references ของ AGENTS.md

ทำตาม references/agents-md.md

- ตรวจ frontmatter, section order, skills map, workspaces
- ยืนยันว่าไม่มี section Workflows

### 4. Check References And Coverage

> Goal: ตรวจสอบ skill references และ workspace coverage

ทำตาม references/agents-md.md

- ดึง references `skill-name` จาก `AGENTS.md`
- ยืนยันว่า directory ของ skill เป้าหมายมีอยู่
- เปรียบเทียบ workspaces กับ `AGENTS.md`

### 5. Fix Issues

> Goal: แก้ไขปัญหาที่พบ

- ลบ duplicate rules หลัง user confirm
- เพิ่ม missing rules ตาม `.devin/rules`
- แก้ frontmatter และ broken references ใน `AGENTS.md`

### 6. Score And Report

> Goal: ตรวจสอบผลลัพธ์และให้คะแนน

ทำตาม references/scoring.md

- คำนวณ score ตามสูตรและ supplementary metrics
- ทำ `/deep-validate`, `/check-reference`
- ทำ `/report-table` พร้อม severity, evidence, action
- ทำ `/suggest-next-action`

## Rules

### 1. No Duplicates

- ไม่เก็บ rules ซ้ำซ้อน
- ถ้ามีหลาย rules คล้ายกัน ให้ merge หรือเลือก canonical

### 2. Frontmatter Standard

- `trigger` ถูกต้อง
- `title` ใช้ Title Case
- `description` ไม่เกิน 100 ตัวอักษร

### 3. AGENTS.md Format

- frontmatter ครบ
- sections ตามลำดับที่ถูกต้อง
- ห้ามมี section Workflows

### 4. Reference Validity

- skill references ทั้งหมดถูกต้อง
- tech maps ถูกต้อง

### 5. Safety

- ไม่ลบ rule โดยไม่ user confirm
- ระบุ evidence พร้อม file path และ line number

## Expected Outcome

- `.devin/rules` และ `rules/` sync กัน
- ไม่มี duplicate rules
- ไม่มี broken references
- `ast-grep scan` ผ่าน
- `AGENTS.md` เป็นไปตามมาตรฐาน
- รายงานพร้อมผลการตรวจและ next actions
