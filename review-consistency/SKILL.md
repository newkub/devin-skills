---
name: review-consistency
description: ตรวจสอบและปรับปรุงความสอดคล้องของ skill files ทั้งภายในและข้าม skill
---

## Goal

ตรวจสอบและปรับปรุงความสอดคล้องของ skill files ในเรื่อง structure, ภาษา, format, terminology, และ references

## Scope

ใช้กับ `SKILL.md` และไฟล์ใน skill directories (`guide/`, `references/`, `workflows/` ฯลฯ) ทั้งใน global skills และ project workspace

ไม่รวมการแก้ไขเนื้อหาเชิงลึกหรือ best practices (ใช้ `/validate`)

## Execute

### 1. Inventory And Baseline

> Goal: รวบรวม skill files และบันทึก baseline

1. ดูรายละเอียดใน [references/inventory-and-baseline.md](references/inventory-and-baseline.md)
2. บันทึก findings พร้อม severity และ evidence

### 2. Check Structure Consistency

> Goal: ตรวจสอบโครงสร้าง skill files

1. ดูรายละเอียดใน [references/check-structure-consistency.md](references/check-structure-consistency.md)
2. บันทึก findings พร้อม severity และ evidence

### 3. Check Language And Terminology

> Goal: ตรวจสอบภาษาและคำศัพท์

1. ดูรายละเอียดใน [references/check-language-and-terminology.md](references/check-language-and-terminology.md)
2. บันทึก findings พร้อม severity และ evidence

### 4. Check Formatting And Style

> Goal: ตรวจสอบรูปแบบและ style

1. ดูรายละเอียดใน [references/check-formatting-and-style.md](references/check-formatting-and-style.md)
2. บันทึก findings พร้อม severity และ evidence

### 5. Apply Fixes

> Goal: แก้ไข inconsistency ตามลำดับ priority

1. ดูรายละเอียดใน [references/apply-fixes.md](references/apply-fixes.md)
2. บันทึก findings พร้อม severity และ evidence

### 6. Validate

> Goal: ตรวจสอบผลลัพธ์

1. ดูรายละเอียดใน [references/validate.md](references/validate.md)
2. บันทึก findings พร้อม severity และ evidence

## Rules

### 1. Tools First

- ใช้ `/scan-codebase`, `grep`, `glob` ก่อน manual review
- รวบรวม patterns ด้วย `/use-scripts` ถ้าจำนวน skill มาก
- ไม่เดาว่ามี inconsistency โดยไม่มี evidence

### 2. Minimal Changes

- แก้ไขเฉพาะ inconsistencies ที่มีผลต่อการใช้งาน
- ใช้ `/dont-over-engineer` เพื่อไม่ over-fix
- รักษา intent และ context ของแต่ละ skill

### 3. Cross-Skill Consistency

- กำหนด conventions ร่วมจาก skill ที่ถูกต้องที่สุด
- ปรับ skill อื่นให้เข้าหา conventions นั้น
- ไม่เปลี่ยน conventions หลักเพื่อให้เข้ากับ skill ที่ผิด

### 4. Safety

- แสดง dry run ก่อนแก้ไขหลายไฟล์พร้อมกัน
- ผู้ใช้ confirm ก่อน destructive action
- ตรวจสอบว่าแก้ไขแล้วไม่ทำให้ references เสีย

### 5. Scope Boundary

- ไม่แก้ไขเนื้อหาเชิงลึกหรือ best practices
- ไม่แก้ไข source code ของ project
- โฟกัสที่ structure, language, format, terminology, references

## Expected Outcome

- ทุก skill มี structure, headings, frontmatter สม่ำเสมอ
- ภาษา, format, terminology สอดคล้องกันข้าม skill
- ไม่มี broken `related` references หรือ unused references
- ไฟล์ไม่เกิน 250 บรรทัดและใช้ kebab-case
- รายงานสรุป inconsistencies ที่พบและแก้ไข
