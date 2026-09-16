---
name: review-dot-devin
description: Review .devin structure, hooks, rules content, AGENTS.md และ ast-grep config
argument-hint: "[scope]"
related:
  - deep-review-then-fix
  - scan-codebase
  - check-monorepo
  - deep-validate
  - check-reference
  - update-dot-devin
  - review-devin-global-harness
  - review-workspace
  - review-quality
  - report
  - suggest-next-action
  - run-review
---

## Goal

Review `.devin` ครบทั้ง structure และ content — directories, hooks, `hooks.json`, `.devin/rules/` content, `AGENTS.md`, `sgconfig.yml` และ ast-grep `rules/` — ก่อนเรียก `update-dot-devin` หรือ audit อิสระ (merged from: `review-rules`)

## Scope

ใช้กับ project ที่มี `.devin/`, `.devin/rules/`, `rules/`, `sgconfig.yml` หรือ `AGENTS.md` — ครอบคลุม structure (dirs, hooks, sgconfig) และ content (rules dedup, frontmatter, AGENTS.md format, skill references) — ทำ review เท่านั้น ไม่แก้ไข logic ของ source code

ไม่รวม: global skills harness (skills/subagents/MCP/global rules) → ใช้ `/review-devin-global-harness`; workspace manifest/scripts → ใช้ `/review-workspace`

แก้ findings → ใช้ `/deep-review-then-fix` (dedicated fix pass)

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

### 4. Check Rules Content And Alignment

> Goal: rules ไม่ซ้ำซ้อน frontmatter ถูก และ `.devin/rules` ↔ `rules/` sync

ทำตาม references/devin-rules.md และ references/ast-grep-rules.md

- ระบุ duplicate rules และ rules ที่ขาด frontmatter (`trigger`, `title` Title Case, `description` ≤100 chars)
- เปรียบเทียบ `.devin/rules` กับ ast-grep `rules/` และ `ruleDirs` ใน `sgconfig.yml`
- ตรวจ file names ใช้ kebab-case.md และเนื้อหาใน `.devin/` เป็นภาษาอังกฤษ

### 5. Validate AGENTS.md

> Goal: ตรวจโครงสร้าง, references และ coverage ของ AGENTS.md

ทำตาม references/agents-md.md

- ตรวจ frontmatter, section order, skills map — ยืนยันว่าไม่มี section Workflows
- ดึง references `skill-name` จาก `AGENTS.md` แล้วยืนยันว่า directory ของ skill มีอยู่จริง
- ตรวจ root `AGENTS.md` references workspace `AGENTS.md`; ถ้า monorepo แต่ละ workspace ต้องมี `AGENTS.md`

### 6. Check Sgconfig

> Goal: ตรวจ `sgconfig.yml` ที่ project root

ทำตาม references/sgconfig.md

### 7. Score And Report

> Goal: สรุป review score และ findings

ทำตาม references/scoring.md และ references/rules-scoring.md

- คำนวณ review score, grade และ supplementary metrics
- ทำ `/deep-validate`, `/check-reference`
- ทำ `/report` พร้อม severity, evidence, action
- ทำ `/suggest-next-action`

## Rules

1. Review Only
   - ทำ review เท่านั้น ไม่แก้ไข `.devin` ระหว่าง review
   - ทุก finding ต้องมี file path และ evidence
2. No Duplicates
   - ไม่เก็บ rules ซ้ำซ้อน — ถ้ามีหลาย rules คล้ายกันให้เสนอ merge หรือเลือก canonical
3. Severity Ratings
   - Critical: ขาด `.devin/` หรือมี `.devin/workflows/`
   - High: ขาด subdirectories, `hooks.json` invalid, `sgconfig.yml` ขาด fields, `ast-grep scan` fail
   - Medium: ขาด hook scripts, `show_output` ไม่เป็น `true`, naming ผิด, duplicate rules
   - Low: ขาด `AGENTS.md` ใน workspace, content ไม่ใช่ภาษาอังกฤษ, frontmatter ไม่ครบ
   - Info: ข้อเสนอแนะ
4. Scoring
   - review score = weighted average ของ findings
   - Grade A-F ตาม thresholds ใน references/scoring.md
5. Safety
   - ไม่ลบ rule หรือไฟล์โดยไม่มี user confirm
6. Formatting
   - ห้ามใช้ bold markers — ใช้ backticks
   - รายงานเป็นตารางด้วย `/report`

## Fix

> ทำ section นี้เฉพาะเมื่อ user confirm ให้แก้ findings — review/report-only โดย default; apply fixes → `/deep-review-then-fix`

### Fix Steps

1. structure: สร้าง subdirectories ที่ขาด, ลบ `.devin/workflows/` หลัง confirm
2. hooks: แก้ `hooks.json`, เพิ่ม hook scripts พร้อม try/catch และ exit codes
3. rules: merge/ลบ duplicates หลัง confirm, เพิ่ม missing rules ตาม `.devin/rules`, แก้ frontmatter
4. AGENTS.md: แก้ frontmatter, broken skill references และ workspace coverage
5. sgconfig: เติม `ruleDirs`, `languageAliases`, `devPaths`
6. verify: `ast-grep scan` ผ่าน, `/check-reference` ไม่มี broken refs

## References

- [Full-dimension checklist](references/checklist.md) และ [rules checklist](references/rules-checklist.md)
- ใช้ /run-review ถ้าจำเป็น
- ใช้ `/review-quality` ถ้าจำเป็น

## Expected Outcome

- รายงาน `.devin` Review พร้อม score และ grade
- `.devin/rules` และ `rules/` sync กัน ไม่มี duplicate หรือ broken references
- `AGENTS.md` เป็นไปตามมาตรฐานและ skill references มีอยู่จริง
- ยืนยันว่าไม่มี `.devin/workflows/` และไม่มี `.devin/` ใน sub-workspace
- ยืนยัน hooks ใช้ bun runtime พร้อม try/catch และ exit codes ที่ถูกต้อง
- ยืนยัน `sgconfig.yml` ครบ: `ruleDirs`, `languageAliases`, `devPaths`
- แนะนำ action ถัดไป
