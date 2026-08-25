---
name: review-skills
description: ตรวจสอบ skill package แต่ละตัวก่อน update-skills แก้ไข ครอบคลุม validation
related:
  - update-skills
  - follow-write-devin-skills
  - review-all-skills
  - validate
  - check-reference
  - report-table
  - suggest-next-action
---

## Goal

Review skill package แต่ละตัวใน devin skills repo ก่อนเรียก `update-skills` เพื่อยืนยันว่าทุก skill ผ่านเกณฑ์มาตรฐาน: frontmatter, sections, line count, references, template selection

## Scope

ใช้ก่อนเรียก `update-skills` — ตรวจ skill package แต่ละตัวตามมาตรฐาน `follow-write-devin-skills` ทำ review เท่านั้น ไม่แก้ไข skills ระหว่าง review ไม่ตรวจ cross-skill consistency (scope ของ `review-all-skills`)

## Execute

### 1. Prepare Context

> Goal: เข้าใจ skills repo และ conventions

1. ทำ `/scan-codebase` ใน skills directory
2. อ่าน `follow-write-devin-skills` เพื่อทราบมาตรฐาน
3. จัดทำรายการ skills ทั้งหมด
4. จัดกลุ่มตาม prefix (`run-*`, `follow-*`, `check-*`, `review-*`, `update-*`, `gen-*`, `report-*`, `idea-*`, `lib-*`)

### 2. Check Frontmatter

> Goal: ตรวจ frontmatter ครบถ้วน

ดู `references/frontmatter.md` สำหรับ validation rules และ scoring

1. ตรวจว่าทุก skill มี `name` และ `description` ใน frontmatter
2. ตรวจว่า `name` ตรงกับ directory name
3. ตรวจว่า `description` ไม่เกิน 100 ตัวอักษร
4. ตรวจ `related` หากมี: ไม่มี missing, ไม่มี unused, ไม่มี circular dependencies
5. บันทึก findings พร้อม evidence

### 3. Check Sections

> Goal: ตรวจ sections ตามมาตรฐาน

ดู `references/sections.md` สำหรับ section order และ Execute step format

1. ตรวจ sections ตามลำดับ: `## Goal` → `## Scope` → `## Execute` → `## Rules` → `## Expected Outcome`
2. ตรวจว่า `## Execute` มีไม่เกิน 10 steps
3. ตรวจว่าใช้ `### N. Step Name` พร้อม `> Goal:` และ numbered list
4. บันทึก findings พร้อม evidence

### 4. Check Line Count And Files

> Goal: ตรวจ line count และ file structure

ดู `references/line-count.md` สำหรับ line count rules และ references directory check

1. ตรวจว่า `SKILL.md` ไม่เกิน 250 บรรทัด
2. ตรวจว่าทุกไฟล์ใน skill package ไม่เกิน 250 บรรทัด
3. ตรวจว่าไม่มี TODO/MOCK/placeholder
4. ตรวจว่า skills ที่มี dependencies มี `references/` directory
5. บันทึก findings พร้อม evidence

### 5. Check Template Selection

> Goal: ตรวจ template selection ตรงกับ prefix

ดู `references/template-selection.md` สำหรับ prefix mapping และ mismatch handling

1. ตรวจว่า template selection ตรงกับ prefix ตาม `templates/index.md`
2. ตรวจว่า `follow-*-architecture` ใช้ architecture template
3. ตรวจว่า skills ที่ไม่ตรง template ระบุเหตุผลใน `## Scope`
4. บันทึก findings พร้อม evidence

### 6. Check Style

> Goal: ตรวจ style conventions

ดู `references/style.md` สำหรับ backticks, bold และ heading conventions

1. ตรวจว่าใช้ backticks สำหรับ `tools`, `commands`, `paths`, `skill-name`
2. ตรวจว่าไม่ใช้ `**` bold markers
3. ตรวจว่า heading ภาษาอังกฤษ Title Case
4. บันทึก findings พร้อม evidence

### 7. Check References

> Goal: ตรวจ references ครบถ้วน

1. ทำ `/check-reference` เพื่อยืนยัน `related` references มีอยู่จริง
2. ตรวจ markdown links ใน SKILL.md ชี้ไปยังไฟล์ที่มีอยู่จริง
3. บันทึก findings พร้อม evidence

### 8. Score And Report

> Goal: สรุป review score และ findings

ดู `references/scoring.md` สำหรับ severity weights และ grade mapping

1. คำนวณ review score = weighted average (Critical=0, High=25, Medium=50, Low=75, Info=100)
2. กำหนด grade: A (90+), B (80+), C (70+), D (60+), F (<60)
3. ทำ `/report-table` พร้อม findings: Skill, Category, Severity, Finding, Evidence, Action
4. ทำ `/suggest-next-action` เพื่อแนะนำ action ถัดไป

## Rules

### 1. Review Only

- ทำ review เท่านั้น ไม่แก้ไข skills ระหว่าง review
- ถ้าต้องแก้ไข ให้เรียก `update-skills` หลัง review
- ทุก finding ต้องมี skill name, file path และ evidence

### 2. Scope Coordination

- ตรวจ skill package แต่ละตัวตามมาตรฐาน
- ไม่ตรวจ cross-skill consistency — ใช้ `review-all-skills` แทน
- ถ้า findings ซ้อนทับกับ `review-all-skills` → อ้างอิงแทน ไม่ทำซ้ำ

### 3. Severity Ratings

- `Critical`: ไม่มี frontmatter, ขาด sections จำเป็น, เกิน 250 บรรทัดมาก
- `High`: `related` missing/unused/circular, TODO/MOCK/placeholder, template ผิด
- `Medium`: style ผิด, `references/` ขาด, line count เกิน
- `Low`: description เกิน 100, heading ไม่ Title Case
- `Info`: ข้อเสนอแนะ ไม่กระทบการทำงาน

### 4. Scoring

- review score = weighted average ของ findings ทั้งหมด
- Grade: A (90+), B (80+), C (70+), D (60+), F (<60)
- Score < 70 → แนะนำให้เรียก `update-skills` ก่อนดำเนินการ

### 5. Formatting

- ห้ามใช้ `**` (bold markers) — ใช้ backticks สำหรับ emphasis
- ใช้ heading levels สำหรับ structure
- รายงานเป็นตารางด้วย `/report-table`

## Expected Outcome

- รายงาน Skills Review พร้อม score และ grade
- รายงาน findings พร้อม skill, severity, evidence และ action required
- ยืนยันทุก skill ผ่าน frontmatter, sections, line count, references, template
- ยืนยัน style conventions ครบถ้วน
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`
