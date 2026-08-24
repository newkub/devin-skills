---
name: refactor-skills
description: Refactor โครงสร้าง skill files และ directories เพื่อ SRP และลด redundancy
---

## Goal

Refactor โครงสร้าง skill files และ directories เพื่อให้มี SRP ชัดเจน ลด redundancy และเพิ่ม maintainability

## Scope

ใช้สำหรับ refactor โครงสร้าง skill files ทั้งใน `%APPDATA%\devin\skills\`, `.devin/skills/`, และ `.windsurf/skills/`

ครอบคลุมการแยก รวม ย้าย และลดเนื้อหาซ้ำซ้อน ไม่รวมการสร้าง skill ใหม่ (ใช้ `/create-devin-global-skills`) หรือปรับปรุงเนื้อหาคุณภาพ (ใช้ `/validate`)

## Execute

### 1. Analyze Skills

> Goal: วิเคราะห์ skill ปัจจุบันเพื่อระบุปัญหาโครงสร้าง

1. ทำตาม `/scan-codebase`
   - ทำตาม `/read-related-skills`
2. ระบุ skill ที่มีหลาย responsibility หรือไฟล์เกิน 250 บรรทัด
3. ระบุ skill ที่มี scope ซ้อนทับกันหรือเนื้อหาซ้ำซ้อน
4. บันทึก issues พร้อม priority

### 2. Plan Refactor

> Goal: วางแผนการ refactor ตาม findings

1. จัดกลุ่ม issues เป็น categories: Split, Merge, Restructure, Deduplicate
2. กำหนด action สำหรับแต่ละ category
3. จัดลำดับตาม impact: High redundancy ก่อน, Large files ก่อน, Broken structure ก่อน
4. ทำ `/dont-over-engineer` เพื่อให้ไม่ over-refactor

### 3. Split Large Skills

> Goal: แยก skill ที่ใหญ่เกินไปหรือมีหลาย responsibilities

1. ระบุ skill ที่เกิน 250 บรรทัดหรือมีหลาย responsibilities
2. ใช้ `/refactor-to-srp` เพื่อแยก responsibilities ออกมา
3. สร้าง orchestrator skill ที่อ้างอึง sub-skills ผ่าน `related`
4. ทำ `/follow-write-devin-skills` สำหรับ sub-skills ใหม่
5. ทำ `/update-reference` อัปเดต references

### 4. Merge Redundant Skills

> Goal: รวม skill ที่ซ้ำซ้อนกัน

1. ระบุ skill คู่ที่มี scope ซ้อนทับหรือเนื้อหาซ้ำกัน
2. ทำ `/merge` เพื่อรวมเนื้อหาเป็น skill เดียว
3. รักษา skill intent เดิม ไม่สูญเสียข้อมูล
4. ลบ skill ที่ถูกรวมแล้ว
5. ทำ `/update-reference` อัปเดต references

### 5. Restructure Content

> Goal: จัดระเบียบ sections ใน `SKILL.md`

1. ตรวจสอบลำดับ: Foundation → Dependencies → High impact → High risk
2. รวม steps ที่เกี่ยวข้องและแยก steps ที่ไม่เกี่ยวข้อง
3. ตรวจสอบว่าแต่ละ step มีเงื่อนไขการเสร็จชัดเจน
4. ลดจำนวน steps ไม่เกิน 10

### 6. Deduplicate Content

> Goal: ลดเนื้อหาซ้ำซ้อนภายในและระหว่าง skill

1. ระบุเนื้อหาที่ซ้ำกันระหว่าง skill หรือระหว่าง Execute และ Rules
2. แทนที่เนื้อหาซ้ำด้วย references ไปยัง skill ต้นทาง
3. ทำ `/review-quality` เพื่อ verify
4. ใช้ `related` สำหรับ dependencies

### 7. Update References And Sort

> Goal: อัปเดต references และจัดเรียง skill

1. ทำ `/update-reference` เพื่ออัปเดต references ทั้งหมด
2. ทำ `/check-reference` เพื่อยืนยัน
3. ทำ `/follow-ordering` เพื่อจัดเรียง skills ตาม prefix และ alphabetical
4. ตรวจสอบ bidirectional references

### 8. Verify Quality

> Goal: ตรวจสอบคุณภาพหลัง refactor

1. ตรวจสอบไฟล์ไม่เกิน 250 บรรทัด
   - ตรวจสอบ sections ครบ
2. ทำตาม `/refactor-to-srp`
   - ทำตาม `/deep-review`
3. ทำ `/report` เพื่อสรุป

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

- ทำ `/deep-review` ก่อนเริ่ม refactor เสมอ
- สร้าง commit checkpoint ก่อน refactor เพื่อ rollback ได้
- ทำ `/update-reference` หลังทุกการ split, merge, หรือ restructure
- ทำ `/check-reference` เพื่อยืนยันไม่มี broken references

### 4. Avoid Over-Refactoring

- ทำ `/dont-over-engineer` เพื่อให้ไม่ over-refactor
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
- Skills จัดเรียงตาม `/follow-ordering`
- ผ่าน `/deep-review` หลัง refactor
