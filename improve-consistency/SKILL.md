---
name: improve-consistency
description: ตรวจสอบและปรับปรุงความสอดคล้องของ skill files ทั้งภายในและข้าม skill
allowed-tools:
  - read
  - edit
  - grep
  - glob
  - exec
  - write
  - ask_user_question
triggers:
  - user
  - model
related:
---

## Goal

ตรวจสอบและปรับปรุงความสอดคล้องของ skill files ในเรื่อง structure, ภาษา, format, terminology, และ references

## Scope

ใช้กับ `SKILL.md` และไฟล์ใน skill directories (`guide/`, `references/`, `workflows/` ฯลฯ) ทั้งใน global skills และ project workspace

ไม่รวมการแก้ไขเนื้อหาเชิงลึกหรือ best practices (ใช้ `/improve-devin-skills`)

## Execute

### 1. Inventory And Baseline

> Goal: รวบรวม skill files และบันทึก baseline
> Goal: รู้ scope ของการตรวจสอบและ patterns ที่มีอยู่

1. ทำตาม `/scan-codebase` รวบรวม skill files ทั้งหมด
2. อ่าน frontmatter ของแต่ละ `SKILL.md`
   - ตรวจสอบ directory structure ของแต่ละ skill
3. ระบุ conventions ที่ใช้ร่วมกัน เช่น heading style, bullet language, backtick usage

### 2. Check Structure Consistency

> Goal: ตรวจสอบโครงสร้าง skill files
> Goal: ทุก skill มีโครงสร้างเดียวกัน

1. ตรวจสอบลำดับ sections (`## Goal` → `## Scope` → `## Execute` → `## Rules` → `## Expected Outcome`)
2. ตรวจสอบ frontmatter มี `name`, `description`, และ `description` ไม่เกิน 100 ตัวอักษร
3. ตรวจสอบ Execute headings เป็น English Title Case และรายการภาษาไทย
4. ตรวจสอบไฟล์ไม่เกิน 250 บรรทัด

### 3. Check Language And Terminology

> Goal: ตรวจสอบภาษาและคำศัพท์
> Goal: ภาษาและ terminology สม่ำเสมอข้าม skill

1. ตรวจสอบคำศัพท์สำคัญ (เช่น `skill`, `workflow`, `Execute`, `Rules`) ใช้สม่ำเสมอ
2. ตรวจสอบภาษาไทย/อังกฤษใน bullet points และ headings ตาม conventions
3. ตรวจสอบ backticks สำหรับ `tools`, `commands`, `file paths`, `skill-name`
4. ตรวจสอบการใช้ parallel markers `∥` อยู่ใน Execute numbered list เท่านั้น

### 4. Check Formatting And Style

> Goal: ตรวจสอบรูปแบบและ style
> Goal: รูปแบบ skill files สม่ำเสมอ

1. ตรวจสอบ spacing, indentation, การเว้นบรรทัด
2. ตรวจสอบ file naming เป็น kebab-case
3. ตรวจสอบความยาว `description` ไม่เกิน 100 ตัวอักษร
4. ตรวจสอบ `related` references มีอยู่จริงและไม่มี unused

### 5. Apply Fixes

> Goal: แก้ไข inconsistency ตามลำดับ priority
> Goal: ทุก skill สอดคล้องกันโดยไม่ทำลาย context

1. แก้ไข Critical inconsistencies ก่อน (frontmatter, broken `related`, section order)
2. ใช้ `/edit-only` ถ้าเป็นไปได้
3. ใช้ `/update-reference` ถ้ามีการเปลี่ยนชื่อหรือย้ายไฟล์
4. ทำ `/follow-content-quality` เพื่อตรวจคุณภาพหลังแก้ไข

### 6. Validate

> Goal: ตรวจสอบผลลัพธ์
> Goal: ไม่มี inconsistency เหลือและไม่มี broken references

1. ทำตาม `/check-reference`
   - ทำตาม `/validate`
2. ทำ `/report` สรุปรายการที่แก้ไข

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
