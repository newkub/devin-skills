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

1. ทำ `/scan-codebase` ใน `%APPDATA%\devin\skills`
2. จัดทำรายการ skills ทั้งหมด: `name`, `description`, จำนวนไฟล์, ขนาด
3. จัดกลุ่มตาม prefix (`run-*`, `follow-*`, `check-*`, `review-*`, `report-*`, `idea-*`, `deep-*`)
4. สำหรับแต่ละกลุ่ม → อ่าน `description` และ `## Goal` เพื่อสรุป purpose สั้นๆ

### 2. Detect Duplicate Purpose

> Goal: หา skills ที่ทำหน้าที่เดียวกัน

1. เปรียบเทียบ `description` และ `## Goal` ของ skills ในกลุ่มเดียวกัน
2. หา skills ที่มี purpose ซ้อนทับ >70% → ระบุเป็น duplicate candidates
3. หา skills ที่ prefix ต่างกันแต่ purpose ใกล้กัน (เช่น `check-*` กับ `review-*`)
4. บันทึก duplicate candidates เป็นตาราง: skill A, skill B, overlap %, recommendation

### 3. Detect Overlapping Scope

> Goal: หา skills ที่ scope ซ้อนทับกัน

1. อ่าน `## Scope` ของ duplicate candidates จาก step 2
2. หา skills ที่ scope บอกว่า "ไม่ใช่" แต่จริงๆ ทำเหมือนกัน
3. หา skills ที่มี `related` อ้างถึงกันและกัน → อาจเป็น overlap แทน
4. ตรวจ `## Execute` ว่ามี steps ที่เหมือนกันมาก

### 4. Detect Redundant Content

> Goal: หา content ที่ซ้ำกันในหลาย skills

1. ใช้ `/use-scripts` สร้าง script ใน `$env:TEMP` เพื่อ hash content ของแต่ละ skill
2. เปรียบเทียบ `## Rules` และ `## Expected Outcome` ระหว่าง skills
3. หา blocks ของ text ที่เหมือนกัน >50% ระหว่าง skills
4. บันทึก redundant content เป็นตาราง: skill A, skill B, duplicated section, line range

### 5. Detect Unused Skills

> Goal: หา skills ที่ไม่ถูกอ้างถึงโดย skill อื่น

1. ทำ `/check-reference` เพื่อหา skills ที่ไม่มีใครอ้างถึงใน `related`
2. ตรวจ `AGENTS.md` ว่ามีอ้างถึง skill นั้นไหม
3. แยก unused skills ออกเป็น: standalone (ใช้เองได้) กับ orphan (ไม่มี context)
4. บันทึก unused skills เป็นตาราง: skill, type, recommendation

### 6. Recommend Actions

> Goal: แนะนำการจัดการกับ redundancy

1. สำหรับ duplicate purpose → แนะนำ: merge, rename, หรือ split
2. สำหรับ overlapping scope → แนะนำ: ปรับ `## Scope` ให้ชัดเจน
3. สำหรับ redundant content → แนะนำ: ย้ายไป `references/` หรือสร้าง shared reference
4. สำหรับ unused skills → แนะนำ: keep, document, หรือ remove
5. ทำ `/report-table` สรุป recommendations: skill, issue, action, priority
6. ทำ `/suggest-next-action` เพื่อแนะนำขั้นตอนถัดไป

### 7. Confirm And Execute

> Goal: ดำเนินการตาม recommendations หลัง user ยืนยัน

1. ทำ `/ask-me` เพื่อยืนยัน actions ก่อนดำเนินการ
2. สำหรับ merge → ทำ `/review-devin-global-skills`
3. สำหรับ rename → ทำ `/rename` แล้ว `/update-references`
4. สำหรับ remove → ใช้ `git rm` แล้ว `/update-references`
5. ทำ `/validate` หลังจบทุก action

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
