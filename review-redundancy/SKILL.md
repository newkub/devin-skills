---
name: review-redundancy
description: ตรวจหา skills ที่ซ้ำซ้อนกันใน devin skills repo
argument-hint: "[scope]"
related:
  - review-devin-global-skills
  - report-table
  - suggest-next-action
  - update-references
---

## Goal

ตรวจหา skills ที่ซ้ำซ้อนกันใน devin skills repo เพื่อรวม ลบ หรือแยก responsibilities ให้ชัดเจน

## Scope

ใช้เมื่อต้องการ audit redundancy ของ skills ใน `%APPDATA%\devin\skills` ครอบคลุม duplicate purpose, overlapping scope, redundant content และ unused skills ไม่ใช่ review quality ทั่วไป (ใช้ `/review-devin-global-skills`)

## Execute

### 1. Inventory And Group Skills
> Goal: Inventory And Group Skills
ทำตาม [references/inventory-and-group-skills.md](references/inventory-and-group-skills.md)

### 2. Detect Duplicate Purpose
> Goal: ตรวจจับ Duplicate Purpose
ทำตาม [references/detect-duplicate-purpose.md](references/detect-duplicate-purpose.md)

### 3. Detect Overlapping Scope
> Goal: ตรวจจับ Overlapping Scope
ทำตาม [references/detect-overlapping-scope.md](references/detect-overlapping-scope.md)

### 4. Detect Redundant Content
> Goal: ตรวจจับ Redundant Content
ทำตาม [references/detect-redundant-content.md](references/detect-redundant-content.md)

### 5. Detect Unused Skills
> Goal: ตรวจจับ Unused Skills
ทำตาม [references/detect-unused-skills.md](references/detect-unused-skills.md)

### 6. Recommend Actions
> Goal: Recommend Actions
ทำตาม [references/recommend-actions.md](references/recommend-actions.md)

### 7. Confirm And Execute
> Goal: ดำเนินการ Confirm And Execute
ทำตาม [references/confirm-and-execute.md](references/confirm-and-execute.md)

### 8. Score And Report
> Goal: รายงาน Score And Report
คำนวณ score/grade ตาม [references/scoring.md](references/scoring.md) แล้วทำ `/report-table` และ `/suggest-next-action`

## Rules

- Duplicate purpose: `description` และ `## Goal` ซ้อนทับ >70%
- Overlapping scope: `## Scope` บอกขอบเขตที่ทับซ้อน
- Redundant content: text blocks ที่เหมือนกัน >50%
- Unused skill: ไม่ถูกอ้างถึงใน `related` ของ skill อื่นและไม่อยู่ใน `AGENTS.md`
- ไม่ลบ ไม่ merge โดยไม่มี user confirmation
- ทำ `/update-references` หลังทุกการเปลี่ยนแปลง
- ห้ามใช้ bold markers — ใช้ backticks สำหรับ emphasis

## Expected Outcome

- รายงาน duplicate purpose พร้อม overlap % และ recommendations
- รายงาน overlapping scope พร้อมการปรับขอบเขต
- รายงาน redundant content พร้อม line ranges
- รายงาน unused skills พร้อมประเภทและ recommendations
- ตารางสรุป recommendations พร้อม priority
- การดำเนินการผ่าน user confirmation เท่านั้น
