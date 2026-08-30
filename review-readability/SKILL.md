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

1. ทำตาม [references/consider-reuse.md](references/consider-reuse.md)
2. บันทึก findings ที่อาจกระทบ skill อื่นหรือต้องปรับทั่วโปรเจกต์

### 2. Scan

> Goal: หาส่วนทีอ่านยากใน code และ text

1. ทำตาม [references/scan.md](references/scan.md)
2. บันทึก findings พร้อม severity และ evidence

### 3. Evaluate

> Goal: ตรวจสอบปัจจัยทีมีผลต่อ readability

ทำตาม [references/readability-checklist.md](references/readability-checklist.md)

### 4. Score

> Goal: ให้คะแนน readability ต่อ file หรือ section

1. ทำตาม [references/score.md](references/score.md)
2. บันทึก findings พร้อม severity และ evidence

### 5. Report

> Goal: สรุป findings พร้อม recommendations

1. ทำตาม [references/report.md](references/report.md)
2. บันทึก findings พร้อม severity และ evidence

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

## Metrics

- ดู metrics สำหรับ review ใน [references/scoring.md](references/scoring.md)

## Expected Outcome

- รายงาน findings ส่วนทีอ่านยาก พร้อม recommendations
- Readability score ต่อ file/section
- ไม่มี TODO, MOCK, placeholder ค้าง
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`
