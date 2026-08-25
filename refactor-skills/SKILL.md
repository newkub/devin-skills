---
name: refactor-skills
description: Refactor โครงสร้าง skill files และ directories เพื่อ SRP และลด redundancy
auto_execution_mode: 3
related:
  - scan-codebase
  - refactor-to-srp
  - update-reference
  - check-reference
  - follow-ordering
  - follow-write-devin-skills
---

## Goal

Refactor โครงสร้าง skill files และ directories เพื่อให้มี SRP ชัดเจน ลด redundancy และเพิ่ม maintainability

## Scope

ใช้สำหรับ refactor โครงสร้าง skill files ทั้งใน `%APPDATA%\devin\skills\`, `.devin/skills/`, และ `.windsurf/skills/`

ครอบคลุมการแยก รวม ย้าย และลดเนื้อหาซ้ำซ้อน ไม่รวมการสร้าง skill ใหม่ (ใช้ `/create-devin-global-skills`) หรือปรับปรุงเนื้อหาคุณภาพ (ใช้ `/validate`)

## Execute

### 1. Analyze Skills

> Goal: วิเคราะห์ skill ปัจจุบันเพื่อระบุปัญหาโครงสร้าง

1. สแกน skills directory หา: ไฟล์เกิน 250 บรรทัด, หลาย responsibility, scope ซ้อนทับ, เนื้อหาซ้ำซ้อน
2. อ่าน `SKILL.md` ของ skills ที่น่าสงสัยเพื่อยืนยันปัญหา
3. บันทึก issues พร้อม priority: High (redundancy มาก, ไฟล์ใหญ่, broken structure), Medium, Low

### 2. Plan Refactor

> Goal: วางแผนการ refactor ตาม findings

1. จัดกลุ่ม issues เป็น categories: Split, Merge, Restructure, Deduplicate
2. กำหนด action สำหรับแต่ละ category
3. จัดลำดับตาม impact: High redundancy ก่อน, Large files ก่อน, Broken structure ก่อน
4. พิจารณา change frequency และ usage patterns ก่อนตัดสินใจ — ไม่ over-refactor

### 3. Execute Refactor

> Goal: ทำ split, merge, restructure, deduplicate ตาม plan

1. **Split**: ถ้า skill เกิน 250 บรรทัดหรือหลาย responsibilities → แยกเป็น sub-skills แต่ละ skill มี SRP ชัดเจน สร้าง orchestrator skill ที่อ้างอึง sub-skills ผ่าน `related`
2. **Merge**: ถ้า skill คู่มี scope ซ้อนทับหรือเนื้อหาซ้ำ → รวมเป็น skill เดียว รักษา intent เดิม ลบ skill ที่ถูกรวม
3. **Restructure**: ตรวจลำดับ sections (Foundation → Dependencies → High impact → High risk) รวม steps ที่เกี่ยวข้อง ลด steps ไม่เกิน 10
4. **Deduplicate**: แทนที่เนื้อหาซ้ำด้วย references ไปยัง skill ต้นทาง ใช้ `related` สำหรับ dependencies
5. ถ้าสร้าง sub-skills ใหม่ → ทำ `/follow-write-devin-skills` สำหรับแต่ละ sub-skill

### 4. Update References And Sort

> Goal: อัปเดต references และจัดเรียง skills หลัง refactor

1. อัปเดต `related` ในทุก skill ที่ได้รับผลกระทบ
2. ตรวจ bidirectional references — ถ้า A `related` B → B ต้อง `related` A
3. ตรวไม่มี broken references โดยยืนยันทุก skill ที่อ้างถึงมีอยู่จริง
4. จัดเรียง skills ตาม prefix และ alphabetical

### 5. Verify And Report

> Goal: ตรวจสอบคุณภาพหลัง refactor

1. ตรวจทุกไฟล์ไม่เกิน 250 บรรทัด
2. ตรวจ sections ครบ: `Goal`, `Scope`, `Execute`, `Rules`, `Expected Outcome`
3. ตรวไม่มี broken references และ bidirectional references ครบ
4. สรุปด้วยตาราง: skill, action (split/merge/restructure/deduplicate), status, ไฟล์ที่เปลี่ยน

## Rules

### 1. Structural Focus

- เน้น refactor โครงสร้าง: split, merge, restructure, deduplicate
- ไม่แก้ไขเนื้อหาเชิงคุณภาพ (ใช้ `/validate`)
- ไม่สร้าง skill ใหม่ (ใช้ `/create-devin-global-skills`)
- รักษา skill intent เดิม

### 2. Non-Redundancy

- ใช้ references แทนการ duplicate เนื้อหา
- Orchestrator skill อ้างอึง sub-skills โดยไม่ระบุรายละเอียดภายใน
- ไม่ซ้ำซ้อนระหว่าง Execute และ Rules
- แต่ละ skill มี SRP ชัดเจน

### 3. Safety Measures

- สร้าง commit checkpoint ก่อน refactor เพื่อ rollback ได้
- อัปเดต `related` หลังทุกการ split, merge, หรือ restructure
- ยืนยันไม่มี broken references หลัง refactor

### 4. Avoid Over-Refactoring

- ไม่แยก skill เล็กเกินไป (micro-skills)
- ไม่รวม skill ที่มี responsibilities ต่างกัน
- พิจารณา change frequency และ usage patterns ก่อนตัดสินใจ

### 5. Size Limits

- ไฟล์ไม่เกิน 250 บรรทัด
- Execute steps ไม่เกิน 10
- ถ้าเกิน ให้ split ออกเป็น sub-skills

## Expected Outcome

- ทุก skill มี SRP ชัดเจน
- ไม่มีเนื้อหาซ้ำซ้อนระหว่าง skill
- ไฟล์ไม่เกิน 250 บรรทัด
- Execute steps ไม่เกิน 10 และเป็นระบบ
- ไม่มี broken references
- Skills จัดเรียงตาม prefix และ alphabetical
