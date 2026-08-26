---
name: review-readability
description: ตรวจอ่านง่ายของ code และ text พร้อม actionable feedback
---

## Goal

Review code และ text ให้อ่านง่าย ลด cognitive load และเข้าใจง่าย

## Scope

ใช้กับ code, documentation, skill files สำหรับตรวจสอบ readability, structure, formatting, naming และ comments

## Execute

### 1. Consider Reuse

> Goal: ตรวจสอบว่า skill/feedback สามารถใช้ซ้ำหรือขยายได้หรือไม่

1. ทำ `/consider-use-in-another-skills` เพื่อดูทิศทางการใช้ซ้ำ/ขยาย
2. บันทึก findings ที่อาจกระทบ skill อื่นหรือต้องปรับทั่วโปรเจกต์

### 2. Scan

> Goal: หาส่วนทีอ่านยากใน code และ text

1. ทำ `/scan-codebase` หา long functions, deep nesting, complex expressions
2. หาไฟล์ skill ทีเกิน 250 บรรทัด
3. ระบุ comment ทีพูดเรื่อง what แทน why
4. หา complex conditionals, magic numbers, nested callbacks

### 3. Evaluate

> Goal: ตรวจสอบปัจจัยทีมีผลต่อ readability

1. Function/section ไม่เกิน 250 บรรทัด
2. Nesting ไม่เกิน 3 ระดับ
3. Line length ไม่เกิน 120 ตัวอักษร
4. ใช้ backticks สำหรับ `tools`, `commands`, `paths`, `skill names`
5. ไม่ใช้ `**` (bold markers) — ใช้ backticks แทน
6. ชื่อ variables, functions, classes บอก intent ชัดเจน
7. จัดเรียง code ตามลำดับทีอ่านง่าย

### 4. Score

> Goal: ให้คะแนน readability ต่อ file หรือ section

1. ให้คะแนน 0-100 ต่อ file/section
2. ระบุ grade: A (90+), B (80+), C (70+), D (60+), F (<60)
3. ระบุจุดทีทำให้คะแนนลด
4. เปรียบเทียบ before/after ถ้ามี

### 5. Report

> Goal: สรุป findings พร้อม recommendations

1. ทำ `/report` พร้อม `/report-table`
2. สร้างตาราง: File, Section, Issue, Severity, Recommendation
3. จัดลำดับตาม severity: Critical → High → Medium → Low
4. ทำ `/suggest-next-action` เพื่อแนะนำ action ถัดไป

## Rules

### 1. Structure

- function/section ไม่เกิน 250 บรรทัด
- ลด nesting ไม่เกิน 3 ระดับ
- แยก large function เป็นฟังก์ชันย่อย
- ใช้ early returns และ guard clauses

### 2. Naming And Comments

- ชื่อบอก intent ชัดเจน
- หลีกเลี่ยง magic numbers และ string literals
- comments อธิบาย why ไม่ใช่ what
- ลบ comments ทีซ้ำกับ code

### 3. Formatting

- ใช้ backticks สำหรับ code, tools, paths, skill references
- ห้ามใช้ `**` (bold markers)
- ใช้ heading levels สำหรับ structure
- รายงานเป็นตารางด้วย `/report-table`

### 4. Review Independence

- ทำ review เท่านั้น ไม่แก้ไข code ระหว่าง review
- ถ้าต้องแก้ไขให้สรุป recommendations และใช้ `/edit-only`
- ทุก finding ต้องมี file path, line number และ evidence

## Expected Outcome

- รายงาน findings ส่วนทีอ่านยาก พร้อม recommendations
- Readability score ต่อ file/section
- ไม่มี TODO, MOCK, placeholder ค้าง
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`
