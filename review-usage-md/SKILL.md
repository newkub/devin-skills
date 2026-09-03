---
name: review-usage-md
description: Review USAGE.md quality, coverage, and consistency in workspace
related:
  - update-usage-md
  - report-table
  - suggest-next-action
---

## Goal

Review `USAGE.md` ใน workspace ว่ามีคุณภาพ ครอบคลุม และ consistency กับ project หรือไม่

## Scope

- ตรวจสอบโครงสร้าง เนื้อหา และ formatting ของ `USAGE.md`
- เปรียบเทียบกับ `README.md`, `package.json`, examples, code
- ให้ findings พร้อม severity และ recommendation
- ใช้ก่อน `/update-usage-md`

## Execute

### 1. Consider Existing Skills
> Goal: Consider Existing Skills
ทำตาม [references/consider-existing-skills.md](references/consider-existing-skills.md)

### 2. Prepare Context
> Goal: เตรียม Context
ทำตาม [references/prepare-context.md](references/prepare-context.md)

### 3. Check Structure
> Goal: ตรวจสอบ Structure
ทำตาม [references/check-structure.md](references/check-structure.md)

### 4. Check Content
> Goal: ตรวจสอบ Content
ทำตาม [references/check-content.md](references/check-content.md)

### 5. Check Consistency
> Goal: ตรวจสอบ Consistency
ทำตาม [references/check-consistency.md](references/check-consistency.md)

### 6. Check Formatting
> Goal: ตรวจสอบ Formatting
ทำตาม [references/check-formatting.md](references/check-formatting.md)

### 7. Score And Report
> Goal: รายงาน Score And Report
คำนวณ score/grade ตาม [references/scoring.md](references/scoring.md) และ [references/score-and-report.md](references/score-and-report.md) แล้วทำ `/report-table` และ `/suggest-next-action`

## Rules

- ไม่แก้ไข `USAGE.md` ระหว่าง review
- ถ้าต้องแก้ → สรุป findings แล้วใช้ `/update-usage-md`
- ทุก finding ต้องมี file path, line number, snippet
- อ้างอิง `package.json` หรือ `README.md` เป็นหลัก
- ห้ามใช้ bold markers — ใช้ backticks สำหรับ emphasis

## Expected Outcome

- รายงาน `USAGE.md` review พร้อม score และ grade
- findings มี severity, evidence, action
- ยืนยัน consistency กับ project
- คำแนะนำถัดไปชัดเจน
