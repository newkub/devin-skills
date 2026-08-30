---
name: review-consistency
description: ตรวจสอบและปรับปรุงความสอดคล้องของ skill files ทั้งภายในและข้าม skill
related:
  - deep-validate
  - report-table
  - suggest-next-action
  - scan-codebase
---

## Goal

ตรวจสอบและปรับปรุงความสอดคล้องของ skill files ในเรื่อง structure, ภาษา, format, terminology, และ references

## Scope

ใช้กับ `SKILL.md` และไฟล์ใน skill directories (`guide/`, `references/`, `workflows/` ฯลฯ) ทั้งใน global skills และ project workspace

ไม่รวมการแก้ไขเนื้อหาเชิงลึกหรือ best practices (ใช้ `/deep-validate`)

## Execute

### 1. Inventory And Baseline
ทำตาม [references/inventory-and-baseline.md](references/inventory-and-baseline.md)

### 2. Check Structure Consistency
ทำตาม [references/check-structure-consistency.md](references/check-structure-consistency.md)

### 3. Check Language And Terminology
ทำตาม [references/check-language-and-terminology.md](references/check-language-and-terminology.md)

### 4. Check Formatting And Style
ทำตาม [references/check-formatting-and-style.md](references/check-formatting-and-style.md)

### 5. Apply Fixes
ทำตาม [references/apply-fixes.md](references/apply-fixes.md)

### 6. Validate
ทำตาม [references/validate.md](references/validate.md)

### 7. Score And Report
คำนวณ score/grade ตาม [references/scoring.md](references/scoring.md) แล้วทำ `/report-table` และ `/suggest-next-action`

## Rules

- ใช้ `/scan-codebase`, `grep`, `glob` ก่อน manual review
- แก้ไขเฉพาะ inconsistencies ที่มีผลต่อการใช้งาน
- รักษา intent และ context ของแต่ละ skill
- แสดง dry run ก่อนแก้ไขหลายไฟล์พร้อมกัน
- ไม่แก้ไขเนื้อหาเชิงลึกหรือ best practices
- ห้ามใช้ bold markers — ใช้ backticks สำหรับ emphasis

## Expected Outcome

- ทุก skill มี structure, headings, frontmatter สม่ำเสมอ
- ภาษา, format, terminology สอดคล้องกันข้าม skill
- ไม่มี broken `related` references หรือ unused references
- ไฟล์ไม่เกิน 250 บรรทัดและใช้ kebab-case
- รายงานสรุป inconsistencies ที่พบและแก้ไข
