---
name: idea-refactor-files
description: สร้างไอเดียการ refactor files ตาม SRP และ code quality พร้อม continuous numbering
---

## Goal

สร้างไอเดียการ refactor files ให้มี single responsibility, ลด duplication, และ maintainability สูง พร้อม continuous numbering

## Scope

ใช้สำหรับวิเคราะห์ไฟล์ใน project ว่าควร split, merge, relocate หรือแก้ไขอย่างไร — ไม่รวมการ refactor modules/packages (ใช้ `/use-or-refactor-to-modules` หรือ `/use-or-refactor-to-packages` แทน)

## Execute

### 1. Gather Context

รวบรวม context ก่อนสร้างไอเดีย

> Goal: เข้าใจ project, files และ quality issues

1. ทำ `/scan-codebase` เพื่องค้นหา file structure, sizes และ import patterns
2. ทำ `/deep-analyze` เพื่องวิเคราะห์ cognitive complexity และ reasons to change
3. ทำ `/check-long-files` เพื่องระบุไฟล์ที่ยาวกว่า threshold
4. ทำ `/check-duplication` เพื่องระบุ code ซ้ำซ้อน
5. ทำ `/follow-code-quality` เพื่องประเมิน quality ของ files
6. ถ้าเข้าถึง project ไม่ได้ → stop และ report

### 2. Identify File Refactor Gaps

ระบุ gaps ใน file level

> Goal: รู้ว่าไฟล์ไหนควร refactor ทำไม และทำอย่างไร

1. ระบุไฟล์ที่เกิน 250 บรรทัด (long file)
2. ระบุไฟล์ที่มี multiple responsibilities หรือ mixed concerns
3. ระบุไฟล์ที่ซ้ำซ้อนหรือควร merge
4. ระบุไฟล์ที่อยู่ในตำแหน่งที่ไม่เหมาะสม (wrong location)
5. จัดกลุ่ม gaps ตาม category: split, merge, relocate, rewrite
6. จัดลำดับตาม impact และ feasibility

### 3. Generate Refactor Ideas

สร้างไอเดียพร้อม continuous numbering

> Goal: ไอเดีย actionable และ track ได้

1. สร้างไอเดียสำหรับแต่ละ gap หรือไฟล์
2. ใช้ continuous numbering (ไม่ต่อจากเดิมถ้ามีอยู่แล้ว)
3. ระบุ scope สำหรับแต่ละไอเดีย: quick win, short-term, long-term
4. ระบุ impact และ effort สำหรับแต่ละไอเดีย
5. ระบุ action ที่ชัดเจน: split, merge, relocate, rewrite, extract
6. ทำ `/dont-over-engineer` เพื่องกรองไอเดียที่ over-engineer

### 4. Report

รายงานไอเดียเป็นตาราง

> Goal: ผู้ใช้เห็นไอเดียทั้งหมดพร้อมลำดับความสำคัญ

1. ทำ `/report-format-table` สำหรับ summary
2. คอลัมน์: number, file(s), issue, idea, scope, impact, effort, action
3. จัดลำดับตาม impact/effort ratio
4. ทำ `/suggest-next-action`

## Rules

### 1. Actionable

- ทุกไอเดียต้อง actionable ไม่เป็นแค่ concept
- ระบุ scope และ effort ชัดเจน
- ถ้าไอเดียซับซ้อน → แบ่งเป็น sub-ideas

### 2. Continuous Numbering

- ใช้ continuous numbering ต่อจากไอเดียเดิมถ้ามี
- ไม่ reset numbering ระหว่าง runs
- เก็บไอเดียเดิมไว้ ไม่ลบ

### 3. Evidence-Based

- ทุกไอเดียต้องมีพื้นฐานจาก analysis
- ระบุ gap หรือ opportunity ที่ไอเดียตอบ
- ระบุ file path หรือ symbol ที่เกี่ยวข้อง

### 4. No Over-Engineering

- ไม่เสนอไอเดียที่ซับซ้อนเกินจำเป็น
- ถ้าไอเดียต้องการ refactor ใหญ่ → ระบุเป็น long-term
- ทำ `/dont-over-engineer`

## Expected Outcome

- รายการไอเดียการ refactor files พร้อม continuous numbering
- ทุกไอเดียมี impact, effort และ scope
- จัดลำดับตาม impact/effort ratio
- ผู้ใช้รู้ next action ที่ชัดเจน

## Example Template

```markdown
---
title: Idea Refactor Files
description: สร้างไอเดียการ refactor files ตาม SRP
auto_execution_mode: 3
related:
  - /scan-codebase
  - /report-format-table
---

## Goal
สร้างไอเดียการ refactor files ให้มี SRP

## Scope
ใช้กับ file-level refactoring

## Execute

### 1. Gather Context
> Goal: เข้าใจ project

1. ทำ `/scan-codebase`

### 2. Identify Gaps
> Goal: รู้ว่าไฟล์ไหนควร refactor

1. ระบุ long files

### 3. Generate Ideas
> Goal: ไอเดีย actionable

1. สร้างไอเดียพร้อม numbering

### 4. Report
> Goal: ผู้ใช้เห็นไอเดียทั้งหมด

1. ทำ `/report-format-table`
2. ทำ `/suggest-next-action`

## Rules

### 1. Actionable
- ทุกไอเดียต้อง actionable

## Expected Outcome
- ตารางไอเดียการ refactor files
```
