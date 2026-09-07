---
name: review-restructure
description: Review file/folder structure before restructure to plan relocation and dry-run
argument-hint: "[scope]"
related:
  - scan-codebase
  - check-long-files
  - follow-flat-folders
  - follow-architecture
  - report
  - report-table
  - suggest-next-action
---

## Goal

Review file/folder structure BEFORE restructure เพื่อประเมิน structure health, ระบุปัญหา naming, grouping, barrel exports, import alias complexity, และจัดทำ relocation plan พร้อม dry-run preview

## Scope

ใช้ก่อนเรียก `restructure` หรือ `relocation` เพื่อวางแผนการย้าย ครอบคลุม file naming, folder domain grouping, long files, barrel exports, import alias complexity, flat vs nested ไม่รวมการย้ายไฟล์จริง — เป็น review เท่านั้น

## Execute

### 1. Prepare Context

> Goal: เข้าใจ project structure และ conventions ก่อน review

1. ทำ `/scan-codebase`
2. อ่าน `AGENTS.md`
3. ระบุ source directories ที่ต้อง review
4. ถ้าสแกนไม่ได้ → stop และ report

### 2. Analyze File Naming

> Goal: ตรวจสอบ file naming conventions

1. ทำตาม `references/file-naming.md`

### 3. Analyze Folder Grouping

> Goal: ตรวจสอบ folder domain grouping

1. ทำตาม `references/folder-grouping.md`

### 4. Analyze Long Files

> Goal: ระบุไฟล์ที่ยาวเกิน threshold ใน context ของ restructure

1. ทำ `/check-long-files`
2. ระบุไฟล์ที่ต้อง split ก่อนหรือหลัง relocation
3. บันทึก: file, line count, split needed, affects relocation

### 5. Analyze Barrel Exports And Import Aliases

> Goal: ตรวจสอบ barrel exports และ import alias complexity

1. ทำตาม `references/barrel-exports.md`

### 6. Analyze Flat Vs Nested Structure

> Goal: ประเมินว่า structure ควรเป็น flat หรือ nested

1. ตรวจสอบ nesting depth ของ directory tree
2. ประเมินตาม `/follow-flat-folders`
3. ประเมินตาม `/follow-architecture`
4. บันทึก: directory, current depth, recommended depth, flatten/keep

### 7. Calculate Structure Health Score

> Goal: คำนวณ structure health score

1. ทำตาม `references/structure-health.md#scoring`

### 8. Build Relocation Plan

> Goal: สร้าง relocation plan พร้อม dry-run preview

1. ทำตาม `references/structure-health.md#relocation-plan-table-format`

### 9. Report

> Goal: รายงาน structure health และ relocation plan

1. ทำตาม `references/scoring.md`
2. ทำ `/report` พร้อม `/report-table`
3. สร้างตาราง Structure Health Metrics และ Relocation Plan
4. แสดง dry-run preview before/after
5. ทำ `/suggest-next-action`

## Rules

### 1. Review Only

- ทำ review เท่านั้น ไม่ย้ายไฟล์หรือแก้ไข structure
- แยก review process จาก restructure process
- ถ้าต้อง restructure ให้ทำ `restructure` หรือ `relocation` หลัง review

### 2. Evidence-Based Findings

- ทุก finding ต้องมี file path หรือ folder path
- ใช้ tools สำหรับ verification ไม่เดา
- ระบุ false positives ที่พบ

### 3. Dry-Run Preview

- แสดง dry-run preview ก่อนทุกครั้ง
- ระบุ old path → new path mapping ชัดเจน
- ระบุ files ที่ต้อง update imports

### 4. Structure Health Scoring

- 5 metrics หลัก: file naming, folder grouping, barrel exports, import complexity, nesting depth
- คะแนนต่อ metric: pass = 1, warning = 0.5, fail = 0
- Structure health score = (total score / 5) × 100%
- Grade: A (90+), B (80+), C (70+), D (60+), F (<60)

### 5. Relocation Safety

- ตรวจสอบ dependency direction ก่อนวางแผนย้าย
- จัดลำดับการย้ายตาม dependency direction
- ระบุ files ที่ต้อง update imports หลังย้าย
- ไม่วางแผนย้ายที่สร้าง circular dependencies

### 6. Formatting

- ห้ามใช้ `**` (bold markers)
- ใช้ backticks สำหรับ emphasis
- รายงานเป็นตารางด้วย `/report-table`

## Expected Outcome

- รายงาน Structure Health Metrics
- รายงาน Relocation Plan
- Dry-run preview before/after
- Structure health score
- ไม่มีการย้ายไฟล์จริง
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`
