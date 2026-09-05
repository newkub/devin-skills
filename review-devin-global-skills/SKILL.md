---
name: review-devin-global-skills
description: Review, refactor และตรวจ cross-skill consistency ของ devin skills repo
argument-hint: "[scope]"
related:
  - update-all-devin-global-skills
  - update-devin-global-skills
  - idea-refactor-devin-global-skills
  - deep-review-codebase
  - report-table
  - suggest-next-action
  - check-reference
  - follow-skills-map
---

## Goal

Review, refactor และตรวจ cross-skill consistency ของ devin skills repo ก่อนเรียก `update-all-devin-global-skills`

## Scope

ใช้ก่อนเรียก `update-all-devin-global-skills` — ครอบคลุม:
- `review` — ตรวจ skill package แต่ละตัวตามมาตรฐาน `update-devin-global-skills`
- `refactor` — split, merge, restructure, deduplicate, relocate ปัญหาโครงสร้าง
- `cross-skill consistency` — ตรวจภาษา, format, terminology, frontmatter, redundancy

ไม่สร้าง skill ใหม่ (ใช้ `/update-devin-global-skills`) ไม่ปรับเนื้อหาเชิง code (ใช้ `/deep-validate`)

- ดูเพิ่มเติม: /deep-review-codebase

## Execute
### 1. Prepare Context

> Goal: เข้าใจ skills repo และ conventions

1. ทำตาม `references/prepare.md`

### 2. Run Review Script

> Goal: ได้ findings จาก automated checks ทั้งหมด

1. รัน `bun run review` ใน skill directory — script ใน `src/` ตรวจ: frontmatter (name, description, `argument-hint`, `related` ≤15, missing/orphan), sections (order, `> Goal:`, step count), line count, style (bold, TODO/MOCK, Title Case, Thai language), references (`/skill-name` refs, markdown links, `references/index.md`), parallel markers, template compliance ตาม prefix และ cross-skill checks (duplicates, naming, prefix distribution)
2. ใช้ `bun run review:fix` เพื่อ auto-fix findings ที่ `fixable` (เช่น generate `references/index.md`)
3. ใช้ `bun run review:ci` เพื่อ exit code 1 เมื่อมี Critical/High — สำหรับ pre-check ก่อน `update-all-devin-global-skills`
4. อ่าน `review-skills-report.json` ที่ skill directory เพื่อดู findings ทั้งหมด

### 3. Interpret Findings

> Goal: แยก false positives และจัดกลุ่ม findings

1. ตรวจ findings จาก report — เช็ค evidence แต่ละข้อ
2. ทำตาม `references/frontmatter.md`, `references/sections.md`, `references/style.md`, `references/line-count.md`, `references/template-selection.md` เพื่อตีความ findings
3. ทำ `/check-reference` ถ้า finding เกี่ยวกับ references ที่ต้องตรวจเพิ่ม
4. ทำ `/follow-skills-map` เพื่อตรวจว่า skills map sync กับ skills ทีมีอยู่

### 4. Check Content Quality

> Goal: ตรวจเนื้อหาเชิงคุณภาพที่ script ตรวจไม่ได้

1. ทำตาม `references/content-quality.md`
2. ทำตาม `references/parallel-usage.md` สำหรับ parallel markers ใน Execute
3. ประเมินความกระชับและ high-impact content ของ skills ที่มี findings สูง

### 5. Plan Refactor

> Goal: วางแผนการ refactor ตาม findings

1. ทำตาม `references/refactor-guide.md#plan-refactor`

### 6. Execute Refactor

> Goal: ทำ split, merge, restructure, deduplicate, relocate ตาม plan

1. ทำตาม `references/refactor-guide.md#execute-refactor`

### 7. Cross-Skill Consistency

> Goal: ตรวจสอบความสอดคล้องและลด redundancy ข้าม skill

1. ทำตาม `references/refactor-guide.md#cross-skill-consistency`

### 8. Score And Report

> Goal: สรุป review score, refactor results และ findings

1. ทำตาม `references/scoring.md` สำหรับ severity weights, grade, report format
2. ทำ `/report-table` พร้อม findings: Skill, Category, Severity, Finding, Evidence, Action
3. สรุป refactor actions: skill, action, status, ไฟล์ที่เปลี่ยน
4. ทำ `/suggest-next-action`

## Rules

### 1. Review Before Refactor

- ทำ review (Steps 2-4) ก่อน refactor (Steps 5-7) เสมอ
- ทุก finding ต้องมี skill name, file path, evidence
- ไม่แก้ไข skills ระหว่าง review — แก้ใน refactor step

### 2. Structural Focus

- เน้น refactor โครงสร้าง: split, merge, restructure, deduplicate, relocate
- ไม่แก้ไขเนื้อหาเชิงคุณภาพ
- ไม่สร้าง skill ใหม่
- รักษา skill intent เดิม

### 3. Non-Redundancy

- ใช้ references แทน duplicate เนื้อหา
- แต่ละ skill มี SRP ชัดเจน
- ไม่ซ้ำซ้อนระหว่าง Execute และ Rules

### 4. Safety Measures

- สร้าง commit checkpoint ก่อน refactor
- อัปเดต `related` หลังทุกการ split, merge, restructure
- ยืนยันไม่มี broken references หลัง refactor
- destructive actions ต้องมี dry run และ user confirmation

### 5. Scoring And Formatting

- คำนวณ review score ตาม `references/scoring.md`
- ห้ามใช้ `**` (bold markers)
- ใช้ backticks สำหรับ `tools`, `commands`, `paths`, skill references
- รายงานเป็นตารางด้วย `/report-table`

- ใช้ /idea-refactor-devin-global-skills ถ้าจำเป็น
- ใช้ /deep-review ถ้าจำเป็น

## Expected Outcome

- รายงาน Skills Review พร้อม score และ grade
- รายงาน findings พร้อม skill, severity, evidence, action
- ยืนยัน frontmatter, sections, line count, references, template
- ยืนยัน style conventions ครบถ้วน
- ทุก skill มี SRP ชัดเจน ไม่มีเนื้อหาซ้ำซ้อน
- ไม่มี broken references
- `related` skills ถูกอ้างถึงใน `SKILL.md`
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`
