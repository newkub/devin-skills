---
name: review-redundancy
description: ตรวจหา skills ที่ซ้ำซ้อนหรือไม่จำเป็นใน devin skills repo
argument-hint: "[scope]"
related:
  - review-devin-global-skills
  - report
  - suggest-next-action
  - update-references
---

## Goal

ตรวจหา skills ที่ซ้ำซ้อนกันใน devin skills repo เพื่อรวม ลบ หรือแยก responsibilities ให้ชัดเจน

## Scope

ใช้เมื่อต้องการ audit redundancy และสิ่งที่ไม่จำเป็นของ skills ใน `%APPDATA%\devin\skills` ครอบคลุม duplicate purpose, overlapping scope, redundant content, unused skills และ unnecessary skills ไม่ใช่ review quality ทั่วไป (ใช้ `/review-devin-global-skills`)

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

### 5. Detect Unused Or Unnecessary Skills
> Goal: ตรวจจับ Unused Or Unnecessary Skills
ทำตาม [references/detect-unused-skills.md](references/detect-unused-skills.md) เพื่อหา skills ที่ไม่ถูกใช้หรือไม่จำเป็น

### 6. Recommend Actions
> Goal: Recommend Actions
ทำตาม [references/recommend-actions.md](references/recommend-actions.md)

### 7. Confirm And Execute
> Goal: ดำเนินการ Confirm And Execute
ทำตาม [references/confirm-and-execute.md](references/confirm-and-execute.md)

### 8. Score And Report
> Goal: รายงาน Score And Report
คำนวณ score/grade ตาม [references/scoring.md](references/scoring.md) แล้วทำ `/report` และ `/suggest-next-action`

## Rules

- Duplicate purpose: `description` และ `## Goal` ซ้อนทับ >70%
- Overlapping scope: `## Scope` บอกขอบเขตที่ทับซ้อน
- Redundant content: text blocks ที่เหมือนกัน >50%
- Unused skill: ไม่ถูกอ้างถึงใน `related` ของ skill อื่นและไม่อยู่ใน `AGENTS.md` หรือ `global_rules.md`
- Unnecessary skill: มี responsibility ทับซ้อนหรือไม่มี use case ที่ชัดเจนใน repo
- ไม่ลบ ไม่ merge โดยไม่มี user confirmation
- ทำ `/update-references` หลังทุกการเปลี่ยนแปลง
- ห้ามใช้ bold markers — ใช้ backticks สำหรับ emphasis

## Fix

> ทำ section นี้เฉพาะเมื่อ user confirm ให้แก้ findings หลังรายงาน — ข้ามถ้า scope เป็น review/report-only เช่นถูก dispatch จาก `/deep-review-codebase` หรือ `/review`

Merged from: improve-redundancy

1. จัดลำดับ findings ตาม severity — critical ก่อน แล้วแก้ทีละรายการพร้อม verify ทันทีหลังแก้
2. เลือก fix guide ที่ตรงกับ finding จากรายการด้านล่าง
3. ทุก fix ต้องรักษา behavior เดิม ผ่าน `/run-check` และ `/run-test-unit` ถ้ามี แล้วสรุปผลด้วย `/report-before-after`

- `references/fix-improve-redundancy.md` — ลด redundancy และ duplication ใน code, content และ config โดยรักษา canonical version เดียว
## Expected Outcome

- รายงาน duplicate purpose พร้อม overlap % และ recommendations
- รายงาน overlapping scope พร้อมการปรับขอบเขต
- รายงาน redundant content พร้อม line ranges
- รายงาน unused skills และ unnecessary skills พร้อมประเภทและ recommendations
- ตารางสรุป recommendations พร้อม priority
- การดำเนินการผ่าน user confirmation เท่านั้น
