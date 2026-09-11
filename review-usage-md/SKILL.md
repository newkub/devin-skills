---
name: review-usage-md
description: Review USAGE.md quality, coverage, and consistency in workspace
argument-hint: "[scope]"
related:
  - update-usage-md
  - follow-tool-usage
  - report
  - suggest-next-action
  - review-docs
---

## Goal

Review `USAGE.md` ใน workspace ว่ามีคุณภาพ ครอบคลุม และ consistency กับ project หรือไม่ — รวม `usage.kdl` spec review ถ้า project มี (merged from: review-app-usage)

## Scope

- ตรวจสอบโครงสร้าง เนื้อหา และ formatting ของ `USAGE.md`
- ถ้า project มี `usage.kdl` → ตรวจ spec syntax, metadata, flags, args, commands, coverage และ `USAGE.md` freshness ด้วย
- เปรียบเทียบกับ `README.md`, `package.json`, examples, code
- ให้ findings พร้อม severity และ recommendation
- ใช้ก่อน `/update-usage-md` หรือ `/follow-tool-usage`

## Execute

### 1. Consider Existing Skills
> Goal: พิจารณา skills ที่มีอยู่
ทำตาม [references/consider-existing-skills.md](references/consider-existing-skills.md)

### 2. Prepare Context
> Goal: เตรียม context
ทำตาม [references/prepare-context.md](references/prepare-context.md) (usage md)

### 3. Check Structure
> Goal: ตรวจ structure
ทำตาม [references/check-structure.md](references/check-structure.md)

### 4. Check Content
> Goal: ตรวจ content
ทำตาม [references/check-content.md](references/check-content.md)

### 5. Check Consistency
> Goal: ตรวจ consistency
ทำตาม [references/check-consistency.md](references/check-consistency.md)

### 6. Check Formatting
> Goal: ตรวจ formatting
ทำตาม [references/check-formatting.md](references/check-formatting.md)

### 7. Check usage.kdl Spec (ถ้ามี)
> Goal: ตรวจ `usage.kdl` spec ครบถ้วน — ข้ามถ้า project ไม่มี `usage.kdl`
1. ทำตาม [references/usage-kdl-prepare-context.md](references/usage-kdl-prepare-context.md)
2. ตรวจ syntax/metadata/flags/args/commands ตาม [references/usage-kdl-syntax.md](references/usage-kdl-syntax.md), [references/usage-kdl-metadata.md](references/usage-kdl-metadata.md), [references/usage-kdl-flags-args.md](references/usage-kdl-flags-args.md), [references/usage-kdl-commands.md](references/usage-kdl-commands.md)
3. ตรวจ coverage ตาม [references/usage-kdl-coverage.md](references/usage-kdl-coverage.md) และ freshness ตาม [references/usage-kdl-usage-md-freshness.md](references/usage-kdl-usage-md-freshness.md)
4. คำนวณ spec score ตาม [references/usage-kdl-scoring.md](references/usage-kdl-scoring.md)

### 8. Score And Report
> Goal: รายงาน score และสรุปผล
คำนวณ score/grade ตาม [references/scoring.md](references/scoring.md) และ [references/score-and-report.md](references/score-and-report.md) แล้วทำ `/report` และ `/suggest-next-action`

## Rules

- ไม่แก้ไข `USAGE.md` หรือ `usage.kdl` ระหว่าง review
- ถ้าต้องแก้ → สรุป findings แล้วใช้ `/update-usage-md` (USAGE.md) หรือ `/follow-tool-usage` (usage.kdl spec)
- ทุก finding ต้องมี file path, line number, snippet
- อ้างอิง `package.json` หรือ `README.md` เป็นหลัก
- ห้ามใช้ bold markers — ใช้ backticks สำหรับ emphasis (usage md)

- ใช้ /review-docs ถ้าจำเป็น

## Expected Outcome

- รายงาน `USAGE.md` review พร้อม score และ grade
- ถ้ามี `usage.kdl` → รายงาน spec review พร้อม score และ grade ด้วย
- findings มี severity, evidence, action
- ยืนยัน consistency กับ project
- คำแนะนำถัดไปชัดเจน
