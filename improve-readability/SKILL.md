---
name: improve-readability
description: ปรับ code และ text ให้อ่านง่ายขึ้น ลด cognitive load ด้วย naming, structure, comments และ formatting
argument-hint: "[path-or-scope]"
related:
  - review-readability
  - improve-naming
  - improve-consistency
  - improve-simplicity
  - update-references
  - report-table
---

## Goal

ทำให้ code, documentation, skill files หรือ content อ่านง่ายขึ้น ลด cognitive load และเข้าใจ intent ชัดเจนขึ้น

## Scope

- ใช้กับ code, docs, `SKILL.md`, และ text ใดๆ ที่ user ระบุ
- Naming ลงลึกข้าม codebase → ส่งต่อ `/improve-naming`
- โครงสร้าง/section ซับซ้อนเกิน → ส่งต่อ `/improve-simplicity`

## Execute

### 1. Scan Targets

> Goal: รู้ว่าต้องแก้อะไร

1. รับ `[path-or-scope]` จาก argument หรือ context
2. ทำ `/review-readability` เพื่อหาจุดอ่านยาก
3. บันทึก findings พร้อม file path, line, severity

### 2. Prioritize Fixes

> Goal: เรียงลำดับตาม impact

1. แก้ high-severity ก่อน: function/section ยาว, nesting ลึก, naming คลุมเครือ
2. แก่ medium: comments ซ้ำ code, magic values, ประโยคยืด
3. ทิ้ง low หรือจัดเป็น follow-up ถ้าจำเป็น

### 3. Apply Readability Improvements

> Goal: แก้ให้กระชับและชัดเจน

#### Code

1. แบ่ง function/section ยาว (>250 บรรทัด) → ย่อยหน้าที่เดียว
2. ลด nesting โดยใช้ early returns, guard clauses
3. ตั้งชื่อให้บอก intent (variables, functions, classes)
4. ลบ comments ที่ซ้ำ code, แก้ comments ให้อธิบาย `why`
5. แทนที่ magic numbers/strings ด้วย named constants

#### Text / SKILL.md / Docs

1. ลดประโยคซ้อนและ passive voice
2. ใช้ bullet/numbered list แทนย่อหน้ายาว
3. ใช้ backticks สำหรับ code, tools, paths, skill references
4. จัด heading levels ให้เป็นลำดับ
5. ลบ filler, adjectives เกิน, คำอธิบายซ้ำซ้อน

### 4. Validate

> Goal: ยืนยันว่าอ่านง่ายขึ้นจริง

1. รัน `/run-check` หรือ `/run-lint` ถ้าเป็น code
2. ทำ `/check-broken-skills-references` ถ้าแก้ skill files
3. ตรวจว่าไม่สูญเสียเนื้อหาหลัก
4. ถ้ามี rename identifier → `/update-references`

### 5. Report

> Goal: สรุปสิ่งที่เปลี่ยน

1. ใช้ `/report-table` คอลัมน์: No., File, Issue, Fix, Status
2. ระบุ next action ถ้ายังมี low-severity findings เหลือ

## Rules

- ไม่แก้ public API หรือ expected behavior
- ถ้าไม่แน่ใจว่าควรตัดทอนหรือไม่ → ถาม user ก่อน
- ทุก rename/move ต้อง `/update-references`
- เก็บเนื้อหาหลักและ intent เดิมไว้

## Expected Outcome

- Code และ text อ่านง่ายขึ้น ลด cognitive load
- ไม่มี TODO, MOCK, placeholder ค้าง
- ผ่าน validation ที่เกี่ยวข้อง
- รายงาน findings และ fixes ครบถ้วน
