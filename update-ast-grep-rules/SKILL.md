---
name: update-ast-grep-rules
description: สร้างหรืออัปเดต ast-grep rules ใน rules/ และ sgconfig.yml ให้ตรงกับ conventions ของ project
argument-hint: "[scope-or-pattern]"
related:
  - use-astgrep
  - use-astgrep-programmatic
  - update-project-rules
  - new-skills
  - scan-codebase
  - run-scan
  - report-in-table
  - suggest-next-action
---

## Goal

สร้างหรืออัปเดต ast-grep rules ใน `rules/` directory และ `sgconfig.yml` ให้ตรงกับ conventions และ patterns ที่ project ต้องการบังคับใช้

## Scope

- ใช้เมื่อต้องการ lint rules แบบ AST-based ที่ enforce conventions เฉพาะ project
- ครอบคลุม `rules/*.yml`, `sgconfig.yml`, และ custom rule directories
- ไม่รวม `.devin/rules` (Markdown rules) — ใช้ `/update-project-rules` แทน
- ไม่รวมการสร้าง skills จาก manifest — ใช้ `/new-skills` แทน

## Execute

### 1. Detect Existing Rules Setup

> Goal: รู้ว่า project มี ast-grep rules อยู่แล้วหรือไม่

1. หา `sgconfig.yml` ที่ project root
2. สแกน `rules/` directory หา `*.yml` rule files ที่มีอยู่
3. อ่าน `package.json` หา `ast-grep` scripts หรือ devDependencies
4. ถ้าไม่มี setup → สร้าง `sgconfig.yml` พร้อม `ruleDirs: [rules]` และ `rules/` directory

### 2. Define Or Update Rules

> Goal: rules ตรงกับ pattern ที่ต้องการบังคับ

1. รับ pattern/convention ที่ต้องการจาก user หรือ context
2. ทำ `/use-astgrep` หรือ `/use-astgrep-programmatic` เพื่อสร้าง rule
3. เขียน rule ด้วย YAML format: `id`, `language`, `rule.pattern`, `message`, `severity`, `fix`
4. ใช้ meta-variables `$VAR`, `$$$ARGS` ตาม ast-grep rule syntax
5. เพิ่ม `constraints` หรือ `utils` ถ้า rule ซับซ้อน
6. ทดสอบ rule ด้วย `ast-grep scan --rule rules/<name>.yml <path>` ก่อน commit

### 3. Wire Into Workflow

> Goal: rules ถูกใช้งานจริง

1. ทำ `/scan-codebase` เพื่อหา project files ที่ควร scan
2. เพิ่ม script ใน `package.json` เช่น `"scan": "ast-grep scan"` ถ้ายังไม่มี
3. ถ้า project มี CI → เพิ่ม `ast-grep scan` step
4. ทำ `/run-scan` เพื่อยืนยันว่า rules ทำงานและไม่มี false positives มากเกิน

### 4. Report

> Goal: สรุป rules ที่สร้าง/อัปเดต

1. ใช้ `/report-in-table` คอลัมน์: `No.`, `Rule`, `Pattern`, `Severity`, `Fix`, `Status`
2. ระบุ rules ที่เพิ่ม แก้ไข หรือลบ
3. ทำ `/suggest-next-action`

## Rules

- ทดสอบ rule ก่อน commit เสมอ — rule ที่ match ผิดทำให้ scan พัง
- ใช้ `severity: warning` สำหรับ rules ใหม่ ก่อนเลื่อนเป้น `error`
- ห้ามแก้ `sgconfig.yml` โดยไม่ตรวจ `ruleDirs` ที่มีอยู่
- ast-grep rules เท่านั้น — `.devin/rules` (markdown) ไปที่ `/update-project-rules`

## Expected Outcome

- `rules/` และ `sgconfig.yml` ถูกต้องและทดสอบผ่าน
- Rules ถูก wire เข้า `package.json` scripts หรือ CI
- ตารางสรุป rules พร้อม status
