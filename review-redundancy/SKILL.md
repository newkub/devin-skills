---
name: review-redundancy
description: ตรวจหา skills ที่ซ้ำซ้อนกันใน devin skills repo
argument-hint: "[scope]"
---

## Goal

ตรวจหา skills ที่ซ้ำซ้อนกันใน devin skills repo เพื่อรวม ลบ หรือแยก responsibilities ให้ชัดเจน

## Scope

ใช้เมื่อต้องการ audit redundancy ของ skills ใน `%APPDATA%\devin\skills` ครอบคลุม duplicate purpose, overlapping scope, redundant content และ unused skills ไม่ใช่ review quality ทั่วไป (ใช้ `/review-devin-global-skills`)

## Execute

### 1. Inventory And Group Skills

> Goal: รู้ทุก skill และจัดกลุ่มตาม purpose

1. ดูรายละเอียดใน [references/inventory-and-group-skills.md](references/inventory-and-group-skills.md)
2. บันทึก findings พร้อม severity และ evidence

### 2. Detect Duplicate Purpose

> Goal: หา skills ที่ทำหน้าที่เดียวกัน

1. ดูรายละเอียดใน [references/detect-duplicate-purpose.md](references/detect-duplicate-purpose.md)
2. บันทึก findings พร้อม severity และ evidence

### 3. Detect Overlapping Scope

> Goal: หา skills ที่ scope ซ้อนทับกัน

1. ดูรายละเอียดใน [references/detect-overlapping-scope.md](references/detect-overlapping-scope.md)
2. บันทึก findings พร้อม severity และ evidence

### 4. Detect Redundant Content

> Goal: หา content ที่ซ้ำกันในหลาย skills

1. ดูรายละเอียดใน [references/detect-redundant-content.md](references/detect-redundant-content.md)
2. บันทึก findings พร้อม severity และ evidence

### 5. Detect Unused Skills

> Goal: หา skills ที่ไม่ถูกอ้างถึงโดย skill อื่น

1. ดูรายละเอียดใน [references/detect-unused-skills.md](references/detect-unused-skills.md)
2. บันทึก findings พร้อม severity และ evidence

### 6. Recommend Actions

> Goal: แนะนำการจัดการกับ redundancy

1. ดูรายละเอียดใน [references/recommend-actions.md](references/recommend-actions.md)
2. บันทึก findings พร้อม severity และ evidence

### 7. Confirm And Execute

> Goal: ดำเนินการตาม recommendations หลัง user ยืนยัน

1. ดูรายละเอียดใน [references/confirm-and-execute.md](references/confirm-and-execute.md)
2. บันทึก findings พร้อม severity และ evidence

## Rules

### 1. Detection Criteria

- Duplicate purpose: `description` และ `## Goal` ซ้อนทับ >70%
- Overlapping scope: `## Scope` บอกขอบเขตที่ทับซ้อน
- Redundant content: text blocks ที่เหมือนกัน >50%
- Unused skill: ไม่ถูกอ้างถึงใน `related` ของ skill อื่นและไม่อยู่ใน `AGENTS.md`

### 2. Recommendations

- แนะนำ merge เมื่อ skills ทำหน้าที่เดียวกันจริงๆ
- แนะนำ split เมื่อ skill เดียวทำหลายหน้าที่ที่ไม่เกี่ยวกัน
- แนะนำ shared reference เมื่อ content ซ้ำแต่ purpose ต่างกัน
- ไม่บังคับ remove โดยไม่มี user confirmation

### 3. Safety

- ไม่ลบ ไม่ merge โดยไม่มี user confirmation
- ทำ dry run ก่อน destructive actions
- ทำ `/update-references` หลังทุกการเปลี่ยนแปลง
- ไม่ทำลาย `related` references โดยไม่ตรวจสอบ

### 4. Scope Boundary

- ไม่รวม review quality ทั่วไป — อยู่ใน `/review-devin-global-skills`
- ไม่รวม review consistency — อยู่ใน `/review-consistency`
- เน้นเฉพาะ redundancy: duplicate, overlap, unused

## Expected Outcome

- รายงาน duplicate purpose พร้อม overlap % และ recommendations
- รายงาน overlapping scope พร้อมการปรับขอบเขต
- รายงาน redundant content พร้อม line ranges
- รายงาน unused skills พร้อมประเภทและ recommendations
- ตารางสรุป recommendations พร้อม priority
- การดำเนินการผ่าน user confirmation เท่านั้น
- ทุกการเปลี่ยนแปลงผ่าน `/validate` และ `/update-references`
