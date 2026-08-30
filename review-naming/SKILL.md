---
name: review-naming
description: ตรวจชื่อ variables, functions, files, skills ให้ชัดเจน สม่ำเสมอ
related:
  - report
  - rename-to
  - report-table
  - suggest-next-action
---

## Goal

Review ชื่อใน code และ skill files ให้ชัดเจน ไม่กำกวม และสม่ำเสมอ

## Scope

ใช้กับ identifiers, file paths, skill names, references, directories ใน code และ skills repository

## Execute

### 1. Consider Reuse

> Goal: ตรวจสอบว่าชื่อ/skill สามารถใช้ซ้ำหรือขยายได้หรือไม่

1. ทำตาม [references/consider-reuse.md](references/consider-reuse.md)
2. บันทึก findings ที่อาจกระทบ skill อื่นหรือต้องปรับชื่อ

### 2. Scan Names

> Goal: รวบรวมชื่อทีต้อง review

1. ทำตาม [references/scan-names.md](references/scan-names.md)
2. บันทึก findings พร้อม severity และ evidence

### 3. Evaluate Naming

> Goal: ตรวจสอบคุณภาพของชื่อ

ทำตาม [references/naming-checklist.md](references/naming-checklist.md)

### 4. Check Conflicts

> Goal: ตรวจสอบความขัดแย้งของชื่อ

1. ทำตาม [references/check-conflicts.md](references/check-conflicts.md)
2. บันทึก findings พร้อม severity และ evidence

### 5. Report

> Goal: สรุป findings พร้อม recommendations

1. ทำตาม [references/report.md](references/report.md)
2. บันทึก findings พร้อม severity และ evidence

## Rules

### 1. Clarity

- ชื่อต้องบอก intent ของสิ่งทีเป็น
- ห้ามใช้คำกำกวม เช่น `data`, `info`, `temp`, `utils` โดยไม่มี context
- ชื่อ function ควรบอก action เช่น `validateUser`, `calculateTotal`

### 2. Consistency

- ใช้ casing สม่ำเสมอตาม project convention
- ใช้คำศัพท์สม่ำเสมอ เช่น `get` หรือ `fetch` ไม่ใช้ผสม
- ชื่อ skill ต้องตรงกับ directory name

### 3. Scope

- ไม่ review naming นอก scope ทีกำหนด
- ไม่ rename identifier โดยไม่ dry run
- ถ้า rename กระทบ public API → ทำ `/rename-to` ด้วย ast-grep

### 4. Formatting

- ห้ามใช้ `**` (bold markers) — ใช้ backticks สำหรับ emphasis
- ใช้ heading levels สำหรับ structure
- รายงานเป็นตารางด้วย `/report-table`

## Metrics

- ดู metrics สำหรับ review ใน [references/scoring.md](references/scoring.md)

## Expected Outcome

- รายงาน findings ชื่อทีไม่เหมาะสม พร้อม suggested names
- ตาราง severity และ location
- ไม่มี TODO, MOCK, placeholder ค้าง
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`
