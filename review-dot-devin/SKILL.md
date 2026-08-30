---
name: review-dot-devin
description: ตรวจสอบโครงสร้าง .devin ก่อน update-dot-devin แก้ไข ครอบคลุม hooks และ workspace
---

## Goal

Review โครงสร้าง `.devin` โดยรวมก่อนเรียก `update-dot-devin` เพื่อยืนยันความถูกต้องของ directories, hooks, workspace rules, `sgconfig.yml` และ ast-grep rules

## Scope

ใช้ก่อนเรียก `update-dot-devin` — ตรวจเฉพาะ structure ของ `.devin/`, `.devin/hooks/`, `hooks.json`, `AGENTS.md` references, `sgconfig.yml` และ ast-grep `rules/` ที่ project root ไม่ตรวจเนื้อหา rules ใน `.devin/rules/` (scope ของ `review-rules`) ทำ review เท่านั้น ไม่แก้ไข `.devin`

## Execute

### 1. Prepare Context

> Goal: เข้าใจ project type และ `.devin` structure

- ทำ `/scan-codebase` เพื่อดู project structure
- ทำ `/check-monorepo` เพื่อยืนยันว่าเป็น monorepo หรือไม่
- ตรวจว่า `.devin/` directory มีอยู่ที่ root หรือไม่
- บันทึก workspace list ถ้าเป็น monorepo

### 2. Check Directories

> Goal: ตรวจสอบ `.devin/rules/` subdirectories และ absence ของ `workflows/`

ทำตาม references/directories.md

### 3. Check Hooks

> Goal: ตรวจสอบ `.devin/hooks/` scripts และ `hooks.json`

ทำตาม references/hooks.md

### 4. Check Content Language And Naming

> Goal: ตรวจภาษาและ naming convention

- ตรวจว่าเนื้อหาใน `.devin/` เป็นภาษาอังกฤษทั้งหมด
- ตรวจว่า file names ใช้ kebab-case.md
- บันทึก findings

### 5. Check Workspace AGENTS.md

> Goal: ตรวจ `AGENTS.md` ใน root และ workspace

- ตรวจ root `AGENTS.md` มีอยู่และ references workspace `AGENTS.md`
- ถ้า monorepo ตรวจว่าแต่ละ workspace มี `AGENTS.md`
- บันทึก findings

### 6. Check Sgconfig And Ast-Grep Rules

> Goal: ตรวจ `sgconfig.yml` และ ast-grep rules ที่ project root

ทำตาม references/sgconfig.md

### 7. Score And Report

> Goal: สรุป review score และ findings

ทำตาม references/scoring.md

- คำนวณ review score, grade และ supplementary metrics
- ทำ `/report-table` พร้อม findings
- ทำ `/suggest-next-action`

## Rules

1. Review Only
   - ทำ review เท่านั้น ไม่แก้ไข `.devin` ระหว่าง review
   - ทุก finding ต้องมี file path และ evidence
2. Scope Coordination
   - ตรวจเฉพาะ structure ของ `.devin/`, hooks, `sgconfig.yml`, ast-grep rules location
   - ไม่ตรวจเนื้อหา rules ใน `.devin/rules/` — ใช้ `review-rules` แทน
3. Severity Ratings
   - Critical: ขาด `.devin/` หรือมี `.devin/workflows/`
   - High: ขาด subdirectories, `hooks.json` invalid, `sgconfig.yml` ขาด fields
   - Medium: ขาด hook scripts, `show_output` ไม่เป็น `true`, naming ผิด
   - Low: ขาด `AGENTS.md` ใน workspace, content ไม่ใช่ภาษาอังกฤษ
   - Info: ข้อเสนอแนะ
4. Scoring
   - review score = weighted average ของ findings
   - Grade A-F ตาม thresholds ใน references/scoring.md
5. Formatting
   - ห้ามใช้ bold markers — ใช้ backticks
   - รายงานเป็นตารางด้วย `/report-table`

## Expected Outcome

- รายงาน `.devin` Structure Review พร้อม score และ grade
- รายงาน findings พร้อม severity, evidence และ action required
- ยืนยันว่าไม่มี `.devin/workflows/` และไม่มี `.devin/` ใน sub-workspace
- ยืนยัน hooks ใช้ bun runtime พร้อม try/catch และ exit codes ที่ถูกต้อง
- ยืนยัน `sgconfig.yml` ครบ: `ruleDirs`, `languageAliases`, `devPaths`
- แนะนำ action ถัดไป
