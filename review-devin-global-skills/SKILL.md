---
name: review-devin-global-skills
description: Review, refactor และตรวจ cross-skill consistency ของ devin skills repo
related:
  - update-all-devin-global-skills
  - update-devin-global-skills
  - idea-refactor-devin-global-skills
  - review-codebase-everything
  - report-table
  - suggest-next-action
  - check-reference
  - check-broken-skills-references
---

## Goal

Review, refactor และตรวจ cross-skill consistency ของ devin skills repo ก่อนเรียก `update-all-devin-global-skills`

## Scope

ใช้ก่อนเรียก `update-all-devin-global-skills` — ครอบคลุม:
- `review` — ตรวจ skill package แต่ละตัวตามมาตรฐาน `update-devin-global-skills`
- `refactor` — split, merge, restructure, deduplicate, relocate ปัญหาโครงสร้าง
- `cross-skill consistency` — ตรวจภาษา, format, terminology, frontmatter, redundancy

ไม่สร้าง skill ใหม่ (ใช้ `/update-devin-global-skills`) ไม่ปรับเนื้อหาเชิง code (ใช้ `/deep-validate`)

## Execute
### 1. Prepare Context

> Goal: เข้าใจ skills repo และ conventions

1. ทำตาม `references/prepare.md`

### 2. Check Frontmatter

> Goal: ตรวจ frontmatter ครบถ้วน

1. ทำตาม `references/frontmatter.md`

### 3. Check Sections And Style

> Goal: ตรวจ sections และ style ตามมาตรฐาน

1. ทำตาม `references/sections.md`
2. ทำตาม `references/style.md`

### 4. Check Line Count, Files And Template

> Goal: ตรวจ line count, file structure และ template

1. ทำตาม `references/line-count.md`
2. ทำตาม `references/template-selection.md`

### 5. Check References And Content Quality

> Goal: ตรวจ references ครบถ้วนและเนื้อหากระชับ

1. ทำ `/check-reference` เพื่อยืนยัน `related` references
2. ทำ `/check-broken-skills-references` เพื่อ scan หา broken `/skill-name` references ทั้งหมด
3. ทำตาม `references/content-quality.md`

### 6. Check Parallel And Script Usage

> Goal: ลด tool calls โดยรักษา safety

1. ทำตาม `references/parallel-usage.md`

### 7. Plan Refactor

> Goal: วางแผนการ refactor ตาม findings

1. ทำตาม `references/refactor-guide.md#plan-refactor`

### 8. Execute Refactor

> Goal: ทำ split, merge, restructure, deduplicate, relocate ตาม plan

1. ทำตาม `references/refactor-guide.md#execute-refactor`

### 9. Cross-Skill Consistency

> Goal: ตรวจสอบความสอดคล้องและลด redundancy ข้าม skill

1. ทำตาม `references/refactor-guide.md#cross-skill-consistency`

### 10. Score And Report

> Goal: สรุป review score, refactor results และ findings

1. ทำตาม `references/scoring.md` สำหรับ severity weights, grade, report format
2. ทำ `/report-table` พร้อม findings: Skill, Category, Severity, Finding, Evidence, Action
3. สรุป refactor actions: skill, action, status, ไฟล์ที่เปลี่ยน
4. ทำ `/suggest-next-action`

## Rules

### 1. Review Before Refactor

- ทำ review (Steps 2-6) ก่อน refactor (Steps 7-9) เสมอ
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

## Expected Outcome

- รายงาน Skills Review พร้อม score และ grade
- รายงาน findings พร้อม skill, severity, evidence, action
- ยืนยัน frontmatter, sections, line count, references, template
- ยืนยัน style conventions ครบถ้วน
- ทุก skill มี SRP ชัดเจน ไม่มีเนื้อหาซ้ำซ้อน
- ไม่มี broken references
- `related` skills ถูกอ้างถึงใน `SKILL.md`
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`
