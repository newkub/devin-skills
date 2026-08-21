---
name: update-project
description: อัพเดท project documentation และ configuration ครบถ้วน
---

## Goal

อัพเดท project documentation และ configuration ครบถ้วนในครั้งเดียว

## Scope

ใช้สำหรับอัพเดท project ทั้งหมด รวม .devin structure, README, AGENTS.md, documentation, ast-grep rules, review CLI, และ .vscode configuration

## Execute

### 1. Update Dot Devin

อัพเดท .devin structure สำหรับ project

1. ทำ `/update-dot-devin` เพื่ออัพเดท .devin structure ครบถ้วน

### 2. Update README

อัพเดท README.md สำหรับ project

1. ทำ `/update-readme` เพื่ออัพเดท README.md ครบถ้วน

### 3. Update AGENTS.md

อัพเดท AGENTS.md สำหรับ project

1. ทำ `/update-agents-md` เพื่ออัพเดท AGENTS.md ครบถ้วน

### 4. Update Documentation

อัพเดท documentation สำหรับ project (ถ้ามี docs/)

1. ตรวจสอบว่ามี docs/ directory หรือไม่
2. ถ้ามี docs/ ให้ทำ `/update-docs` เพื่ออัพเดท documentation ครบถ้วน

### 5. Update Ast-Grep Rules

อัพเดท ast-grep rules สำหรับ project (ถ้ามี sgconfig.yml)

1. ตรวจสอบว่ามี `sgconfig.yml` และ `rules/` directory หรือไม่
2. ถ้ามี ให้ทำ `/update-ast-grep-rules` เพื่ออัพเดท ast-grep rules ให้สอดคล้องกับ `.devin/rules/`

### 6. Update Codebase Review CLI

อัปเดท codebase review CLI สำหรับ project (ถ้ามี `tools/review/`)

1. ตรวจสอบว่ามี `tools/review/` directory หรือไม่
2. ถ้ามี ให้ทำ `/update-review-cli` เพื่อสร้าง/อัปเดท review CLI ให้ครอบคลุม 60+ categories ตาม `/run-review`

### 7. Update Dot VSCode

อัปเดท `.vscode` configuration สำหรับ project

1. ทำ `/follow-dot-vscode` เพื่ออัปเดท `.vscode/` directory ให้ครบถ้วน ครอบคลุม settings.json, extensions.json, launch.json, tasks.json และ snippets

## Rules

### 1. Execution Order

ทำตามลำดับที่กำหนดเพื่อให้ได้ผลลัพธ์ที่ถูกต้อง

- ทำ `/update-dot-devin` ก่อนเสมอ เพื่อตั้งค่าพื้นฐาน
- ทำ `/update-readme` หลังจากตั้งค่าพื้นฐาน
- ทำ `/update-agents-md` หลังจากอัพเดท README
- ทำ `/update-docs` เป็นลำดับสุดท้าย (ถ้ามี docs/)
- ทำ `/update-ast-grep-rules` หลังจาก update docs (ถ้ามี `sgconfig.yml`)
- ทำ `/update-review-cli` หลังจาก update ast-grep rules (ถ้ามี `tools/review/`)
- ทำ `/follow-dot-vscode` หลังจาก `/update-review-cli`

### 2. Conditional Execution

ตรวจสอบความจำเป็นก่อน execute

- ทำ `/update-docs` เฉพาะเมื่อมี docs/ directory
- ถ้าไม่มี docs/ ให้ข้าม step นี้
- ทำ `/update-ast-grep-rules` เฉพาะเมื่อมี `sgconfig.yml` และ `rules/` directory
- ถ้าไม่มี ให้ข้าม step นี้
- ทำ `/update-review-cli` เฉพาะเมื่อมี `tools/review/` directory
- ถ้าไม่มี ให้ข้าม step นี้
- ทำ `/follow-dot-vscode` ทุกครั้ง เพราะทุก project ควรมี `.vscode/` configuration

### 3. Consistency

รักษาความสม่ำเสมอ

- ทำตาม `/follow-write-devin-skills` สำหรับ workflow structure
- ใช้ references แทนการ duplicate เนื้อหา
- ตรวจสอบว่า workflows ที่อ้างถึงมีอยู่จริง

## Expected Outcome

- .devin structure อัพเดทครบถ้วน
- README.md อัพเดทครบถ้วน
- AGENTS.md อัพเดทครบถ้วน
- Documentation อัพเดทครบถ้วน (ถ้ามี docs/)
- Ast-grep rules อัพเดทครบถ้วน (ถ้ามี `sgconfig.yml`)
- Review CLI อัพเดทครบถ้วน (ถ้ามี `tools/review/`)
- .vscode configuration อัพเดทครบถ้วน
- Project documentation และ configuration สอดคล้องกัน
