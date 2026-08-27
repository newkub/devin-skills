---
name: review-devin-global-skills
description: Review, refactor และตรวจ cross-skill consistency ของ devin skills repo
---

## Goal

Review, refactor และตรวจ cross-skill consistency ของ devin skills repo ก่อนเรียก `update-all-devin-global-skills` เพื่อยืนยันทุก skill ผ่านเกณฑ์มาตรฐาน มี SRP ชัดเจน ไม่ซ้ำซ้อน และสอดคล้องกัน

## Scope

ใช้ก่อนเรียก `update-all-devin-global-skills` — ครอบคลุม 3 งาน:

- `review` — ตรวจ skill package แต่ละตัวตามมาตรฐาน `update-devin-global-skills` (frontmatter, sections, line count, references, template, style, content quality)
- `refactor` — split, merge, restructure, deduplicate, relocate skills ที่มีปัญหาโครงสร้าง
- `cross-skill consistency` — ตรวจภาษา, format, terminology, frontmatter ข้าม skill และลด redundancy

ไม่รวมการสร้าง skill ใหม่ (ใช้ `/update-devin-global-skills`) หรือปรับปรุงเนื้อหาคุณภาพเชิง code (ใช้ `/deep-validate`)

## Execute

### 1. Prepare Context

> Goal: เข้าใจ skills repo และ conventions

1. ทำ `/scan-codebase` ใน skills directory
2. อ่าน `update-devin-global-skills` เพื่อทราบมาตรฐาน
3. จัดทำรายการ skills ทั้งหมด จัดกลุ่มตาม prefix
4. อ่าน `AGENTS.md` และ `global_rules.md` เพื่อดู conventions ปัจจุบัน

### 2. Check Frontmatter

> Goal: ตรวจ frontmatter ครบถ้วน

ดู `references/frontmatter.md` สำหรับ validation rules และ scoring

1. ตรวจว่าทุก skill มี `name` และ `description` ใน frontmatter
2. ตรวจว่า `name` ตรงกับ directory name
3. ตรวจว่า `description` ไม่เกิน 100 ตัวอักษร
4. ตรวจ `related` หากมี: ไม่มี missing, ไม่มี unused, ไม่มี circular dependencies
5. บันทึก findings พร้อม evidence

### 3. Check Sections And Style

> Goal: ตรวจ sections และ style ตามมาตรฐาน

ดู `references/sections.md` และ `references/style.md` สำหรับ section order และ style rules

1. ตรวจ sections ตามลำดับ: `## Goal` → `## Scope` → `## Execute` → `## Rules` → `## Expected Outcome`
2. ตรวจว่า `## Execute` มีไม่เกิน 10 steps พร้อม `### N. Step Name` และ `> Goal:`
3. ตรวจว่าใช้ backticks สำหรับ `tools`, `commands`, `paths`, `skill-name`
4. ตรวจว่าไม่ใช้ `**` bold markers และ heading ภาษาอังกฤษ Title Case
5. บันทึก findings พร้อม evidence

### 4. Check Line Count, Files And Template

> Goal: ตรวจ line count, file structure และ template selection

ดู `references/line-count.md` และ `references/template-selection.md`

1. ตรวจว่า `SKILL.md` และทุกไฟล์ใน skill package ไม่เกิน 250 บรรทัด
2. ตรวจว่าไม่มี TODO/MOCK/placeholder
3. ตรวจว่า skills ที่มี dependencies มี `references/` directory
4. ตรวจว่า template selection ตรงกับ prefix ตาม `templates/index.md`
5. บันทึก findings พร้อม evidence

### 5. Check References And Content Quality

> Goal: ตรวจ references ครบถ้วนและเนื้อหากระชับ

ดู `references/content-quality.md` สำหรับ simplify, high-impact content และ clarity rules

1. ทำ `/check-reference` เพื่อยืนยัน `related` references มีอยู่จริง
2. ตรวจ markdown links ใน SKILL.md ชี้ไปยังไฟล์ที่มีอยู่จริง
3. ทำ `/review-writing` ∥ `/simplify` เพื่อกระชับเนื้อหา
4. ตรวจเนื้อหาซ้ำซ้อนระหว่าง `Execute` และ `Rules`
5. ตรวจทุก bullet ว่ามี impact จริง — ถ้าไม่มี → ลบ
6. บันทึก findings พร้อม evidence

### 6. Check Parallel And Script Usage

> Goal: ลด tool calls โดยรักษา safety

ดู `references/parallel-usage.md` สำหรับ parallel markers และ script usage rules

1. ตรวจ `parallel:` และ `∥` ใช้เฉพาะใน `Execute` numbered list
2. ตรวจว่าไม่ใช้ `∥` ใน validation checklist, Rules bullets หรือ Expected Outcome
3. ถ้า operations > 10 ไฟล์ → แนะนำ `/use-scripts`
4. บันทึก findings พร้อม evidence

### 7. Plan Refactor

> Goal: วางแผนการ refactor ตาม findings

1. จัดกลุ่ม issues เป็น categories: Split, Merge, Restructure, Deduplicate, Relocate
2. กำหนด action สำหรับแต่ละ category
3. จัดลำดับตาม impact: High redundancy ก่อน, Large files ก่อน, Broken structure ก่อน
4. พิจารณา change frequency และ usage patterns ก่อนตัดสินใจ — ไม่ over-refactor

### 8. Execute Refactor

> Goal: ทำ split, merge, restructure, deduplicate, relocate ตาม plan

1. Split: ถ้า skill เกิน 250 บรรทัดหรือหลาย responsibilities → แยกเป็น sub-skills แต่ละ skill มี SRP ชัดเจน
2. Merge: ถ้า skill คู่มี scope ซ้อนทับหรือเนื้อหาซ้ำ → รวมเป็น skill เดียว รักษา intent เดิม ลบ skill ที่ถูกรวม
3. Restructure: ตรวจลำดับ sections รวม steps ที่เกี่ยวข้อง ลด steps ไม่เกิน 10
4. Deduplicate: แทนที่เนื้อหาซ้ำด้วย references ไปยัง skill ต้นทาง ใช้ `related` สำหรับ dependencies
5. Relocate: ทำ `/relocation` เพื่อย้าย skills ไปยังตำแน่งที่สอดคล้องกับ prefix
6. ถ้าสร้าง sub-skills ใหม่ → ทำ `/update-devin-global-skills` สำหรับแต่ละ sub-skill

### 9. Cross-Skill Consistency

> Goal: ตรวจสอบความสอดคล้องและลด redundancy ข้าม skill

1. ทำ `/review-consistency` เพื่อตรวจภาษา, format, terminology, frontmatter ข้าม skill
2. ทำ `/review-redundancy` เพื่อลบเนื้อหาซ้ำซ้อนข้าม skill
3. ทำ `/update-references` หลังการรวม/แยก/ย้าย skill หรือ sections
4. ตรวไม่มี broken references และ bidirectional references ครบ

### 10. Score And Report

> Goal: สรุป review score, refactor results และ findings

ดู `references/scoring.md` สำหรับ severity weights และ grade mapping

1. คำนวณ review score = weighted average (Critical=0, High=25, Medium=50, Low=75, Info=100)
2. กำหนด grade: A (90+), B (80+), C (70+), D (60+), F (<60)
3. ทำ `/report-table` พร้อม findings: Skill, Category, Severity, Finding, Evidence, Action
4. สรุป refactor actions: skill, action (split/merge/restructure/deduplicate/relocate), status, ไฟล์ที่เปลี่ยน
5. ทำ `/suggest-next-action` เพื่อแนะนำ action ถัดไป

## Rules

### 1. Review Before Refactor

- ทำ review (Steps 2-6) ก่อน refactor (Steps 7-8) เสมอ
- ทุก finding ต้องมี skill name, file path และ evidence
- ไม่แก้ไข skills ระหว่าง review — แก้ใน refactor step

### 2. Structural Focus

- เน้น refactor โครงสร้าง: split, merge, restructure, deduplicate, relocate
- ไม่แก้ไขเนื้อหาเชิงคุณภาพ (ใช้ `/deep-validate`)
- ไม่สร้าง skill ใหม่ (ใช้ `/update-devin-global-skills`)
- รักษา skill intent เดิม

### 3. Non-Redundancy

- ใช้ references แทนการ duplicate เนื้อหา
- Orchestrator skill อ้างอึง sub-skills โดยไม่ระบุรายละเอียดภายใน
- ไม่ซ้ำซ้อนระหว่าง Execute และ Rules
- แต่ละ skill มี SRP ชัดเจน

### 4. Safety Measures

- สร้าง commit checkpoint ก่อน refactor เพื่อ rollback ได้
- อัปเดต `related` หลังทุกการ split, merge, หรือ restructure
- ยืนยันไม่มี broken references หลัง refactor
- destructive actions ต้องมี dry run และ user confirmation

### 5. Avoid Over-Refactoring

- ไม่แยก skill เล็กเกินไป (micro-skills)
- ไม่รวม skill ที่มี responsibilities ต่างกัน
- พิจารณา change frequency และ usage patterns ก่อนตัดสินใจ

### 6. Severity Ratings

- `Critical`: ไม่มี frontmatter, ขาด sections จำเป็น, เกิน 250 บรรทัดมาก
- `High`: `related` missing/unused/circular, TODO/MOCK/placeholder, template ผิด
- `Medium`: style ผิด, `references/` ขาด, line count เกิน
- `Low`: description เกิน 100, heading ไม่ Title Case
- `Info`: ข้อเสนอแนะ ไม่กระทบการทำงาน

### 7. Scoring

- review score = weighted average ของ findings ทั้งหมด
- Grade: A (90+), B (80+), C (70+), D (60+), F (<60)
- Score < 70 → แนะนำให้เรียก `update-all-devin-global-skills` ก่อนดำเนินการ

### 8. Formatting

- ห้ามใช้ `**` (bold markers) — ใช้ backticks สำหรับ emphasis
- ใช้ heading levels สำหรับ structure
- รายงานเป็นตารางด้วย `/report-table`

## Expected Outcome

- รายงาน Skills Review พร้อม score และ grade
- รายงาน findings พร้อม skill, severity, evidence และ action required
- ยืนยันทุก skill ผ่าน frontmatter, sections, line count, references, template
- ยืนยัน style conventions ครบถ้วน
- ทุก skill มี SRP ชัดเจน ไม่มีเนื้อหาซ้ำซ้อน
- ไม่มี broken references และ bidirectional references ครบ
- Skills จัดเรียงตาม prefix และ alphabetical
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`
