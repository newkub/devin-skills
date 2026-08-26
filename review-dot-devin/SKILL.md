---
name: review-dot-devin
description: ตรวจสอบโครงสร้าง .devin ก่อน update-dot-devin แก้ไข ครอบคลุม hooks และ workspace
---

## Goal

Review โครงสร้าง `.devin` โดยรวมก่อนเรียก `update-dot-devin` เพื่อยืนยันว่า directories, hooks, `hooks.json`, workspace rules, `sgconfig.yml` และ ast-grep `rules/` ครบถ้วนและถูกต้อง ไม่ตรวจเนื้อหา rules (ใช้ `review-rules` แทน)

## Scope

ใช้ก่อนเรียก `update-dot-devin` — ตรวจเฉพาะ structure ของ `.devin/`, `.devin/hooks/`, `hooks.json`, `AGENTS.md` references, `sgconfig.yml` และ ast-grep `rules/` ที่ project root ไม่ตรวจเนื้อหา rules ใน `.devin/rules/` (scope ของ `review-rules`) ทำ review เท่านั้น ไม่แก้ไข `.devin`

## Execute

### 1. Prepare Context

> Goal: เข้าใจ project type และ `.devin` structure

1. ทำ `/scan-codebase` เพื่อดู project structure
2. ทำ `/check-monorepo` เพื่อยืนยันว่าเป็น monorepo หรือไม่
3. ตรวจว่า `.devin/` directory มีอยู่ที่ root หรือไม่ ถ้าไม่มี → flag เป็น critical
4. บันทึก workspace list ถ้าเป็น monorepo

### 2. Check Directories

> Goal: ตรวจสอบ `.devin/rules/` subdirectories และ absence ของ `workflows/`

ดู `references/directories.md` สำหรับ required/forbidden directories และ scoring

1. ตรวจว่า `.devin/rules/` มีอยู่พร้อม subdirectories: `always-on/`, `model_decision/`, `glob/`
2. ตรวจว่า `.devin/workflows/` ไม่มีอยู่ — ถ้ามี → flag เป็น critical
3. ตรวจว่าไม่มี `.devin/` ใน sub-workspace ใดๆ (monorepo)
4. บันทึก findings พร้อม evidence (path)

### 3. Check Hooks

> Goal: ตรวจสอบ `.devin/hooks/` scripts และ `hooks.json`

ดู `references/hooks.md` สำหรับ required files, validation rules และ scoring

1. ตรวจว่า `.devin/hooks/` มีอยู่พร้อม `run-lint.ts` และ `run-typecheck.ts`
2. ตรวจว่า `.devin/hooks/hooks.json` มีอยู่และเป็น valid JSON
3. ตรวจว่า `hooks.json` มี `show_output: true`
4. ตรวจ shebang `#!/usr/bin/env bun` ในทุก hook script
5. ตรวจว่า scripts parse JSON จาก stdin มี `try/catch` และ `process.exit(0)`/`process.exit(1)`
6. บันทึก findings พร้อม file path และ line number

### 4. Check Content Language And Naming

> Goal: ตรวจภาษาและ naming convention

1. ตรวจว่าเนื้อหาใน `.devin/` เป็นภาษาอังกฤษทั้งหมด
2. ตรวจว่า file names ใช้ `kebab-case.md`
3. บันทึก findings พร้อม evidence

### 5. Check Workspace AGENTS.md

> Goal: ตรวจ `AGENTS.md` ใน root และ workspace (monorepo)

1. ตรวจว่า root `AGENTS.md` มีอยู่และ references workspace `AGENTS.md`
2. ถ้าเป็น monorepo ตรวจว่าแต่ละ workspace มี `AGENTS.md` ของตัวเอง
3. ตรวจว่า root `AGENTS.md` บอกให้ทำตาม workspace `AGENTS.md`
4. บันทึก findings พร้อม evidence

### 6. Check Sgconfig And Ast-Grep Rules

> Goal: ตรวจ `sgconfig.yml` และ ast-grep `rules/` ที่ project root

ดู `references/sgconfig.md` สำหรับ field validation และ scope boundary

1. ตรวจว่า `sgconfig.yml` มีอยู่ที่ project root
2. ตรวจว่า `sgconfig.yml` มี `ruleDirs`, `languageAliases`, `devPaths`
3. ตรวจว่า ast-grep rules อยู่ใน `rules/` ที่ project root (แยกจาก `.devin/rules/`)
4. ตรวจว่า `ruleDirs` ชี้ไปที่ `rules/always-on`, `rules/model_decision`, `rules/glob`
5. บันทึก findings พร้อม evidence

### 7. Score And Report

> Goal: สรุป review score และ findings

ดู `references/scoring.md` สำหรับ severity weights และ grade mapping

1. คำนวณ review score = weighted average (Critical=0, High=25, Medium=50, Low=75, Info=100)
2. กำหนด grade: A (90+), B (80+), C (70+), D (60+), F (<60)
3. ทำ `/validate` เพื่อ verify structure
4. ทำ `/report-table` พร้อม findings: Category, Severity, Finding, Evidence, Action
5. ทำ `/suggest-next-action` เพื่อแนะนำ action ถัดไป

## Rules

### 1. Review Only

- ทำ review เท่านั้น ไม่แก้ไข `.devin` ระหว่าง review
- ถ้าต้องแก้ไข ให้เรียก `update-dot-devin` หลัง review
- ทุก finding ต้องมี file path และ evidence

### 2. Scope Coordination

- ตรวจเฉพาะ structure ของ `.devin/`, hooks, `sgconfig.yml`, ast-grep `rules/` location
- ไม่ตรวจเนื้อหา rules ใน `.devin/rules/` — ใช้ `review-rules` แทน
- ไม่ตรวจ `AGENTS.md` format detail — ใช้ `review-rules` แทน
- ถ้า findings ซ้อนทับกับ `review-rules` → อ้างอิงแทน ไม่ทำซ้ำ

### 3. Severity Ratings

- `Critical`: ขาด `.devin/` หรือมี `.devin/workflows/` หรือ hooks ไม่ทำงาน
- `High`: ขาด subdirectories, `hooks.json` invalid, `sgconfig.yml` ขาด fields สำคัญ
- `Medium`: ขาด hook scripts บางตัว, `show_output` ไม่เป็น `true`, naming ผิด
- `Low`: ขาด `AGENTS.md` ใน workspace, content ไม่ใช่ภาษาอังกฤษบางส่วน
- `Info`: ข้อเสนอแนะ ไม่กระทบการทำงาน

### 4. Scoring

- review score = weighted average ของ findings ทั้งหมด
- Grade: A (90+), B (80+), C (70+), D (60+), F (<60)
- Score < 70 → แนะนำให้เรียก `update-dot-devin` ก่อนดำเนินการ

### 5. Formatting

- ห้ามใช้ `**` (bold markers) — ใช้ backticks สำหรับ emphasis
- ใช้ heading levels สำหรับ structure
- รายงานเป็นตารางด้วย `/report-table`

## Expected Outcome

- รายงาน `.devin` Structure Review พร้อม score และ grade
- รายงาน findings พร้อม severity, evidence และ action required
- ยืนยันว่าไม่มี `.devin/workflows/` และไม่มี `.devin/` ใน sub-workspace
- ยืนยัน hooks ใช้ `bun` runtime พร้อม `try/catch` และ exit codes ที่ถูกต้อง
- ยืนยัน `sgconfig.yml` ครบ: `ruleDirs`, `languageAliases`, `devPaths`
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`
