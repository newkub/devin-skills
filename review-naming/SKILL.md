---
name: review-naming
description: ตรวจชื่อ variables, functions, files, skills ให้ชัดเจน สม่ำเสมอ
---

## Goal

Review ชื่อใน code และ skill files ให้ชัดเจน ไม่กำกวม และสม่ำเสมอ

## Scope

ใช้กับ identifiers, file paths, skill names, references, directories ใน code และ skills repository

## Execute

### 1. Consider Reuse

> Goal: ตรวจสอบว่าชื่อ/skill สามารถใช้ซ้ำหรือขยายได้หรือไม่

1. ทำ `/consider-use-in-another-skills` เพื่อดูทิศทางการใช้ซ้ำ/ขยาย
2. บันทึก findings ที่อาจกระทบ skill อื่นหรือต้องปรับชื่อ

### 2. Scan Names

> Goal: รวบรวมชื่อทีต้อง review

1. ทำ `/scan-codebase` หา identifiers, file paths, skill names
2. รวบรวม skill names จาก `AGENTS.md` และ directory names
3. ระบุ public API, class names, function names, variable names, constants
4. หา duplicate names, shadowing, หรือชื่อทีตีความได้หลายทาง

### 3. Evaluate Naming

> Goal: ตรวจสอบคุณภาพของชื่อ

1. ชื่อบอก intent ชัดเจน: อ่านแล้วรู้ว่าทำอะไร
2. ลำดับคำสม่ำเสมอ เช่น `verbNoun` หรือ `nounDescriptor`
3. ใช้ casing สม่ำเสมอ: `camelCase`, `PascalCase`, `kebab-case`, `UPPER_SNAKE_CASE`
4. หลีกเลี่ยง abbreviation ทีไม่เข้าใจ ชื่อหลอก หรือคำทั่วไปเกินไป
5. ความยาวของชื่อพอดี: ไม่สั้นจนไม่บอก intent ไม่ยาวจนอ่านยาก
6. ชื่อ skill ต้องเป็น lowercase คั่นด้วย `-` ไม่มีอักขระพิเศษ

### 4. Check Conflicts

> Goal: ตรวจสอบความขัดแย้งของชื่อ

1. ตรวจสอบว่าไม่ซ้ำกับ existing skills หรือ reserved words
2. ตรวจสอบว่าไม่มี shadowing ระหว่าง nested scopes
3. ตรวจสอบว่า file name ตรงกับ content หรือ main export
4. ตรวจสอบว่า directory name ตรงกับ skill `name` ใน frontmatter

### 5. Report

> Goal: สรุป findings พร้อม recommendations

1. ทำ `/report` พร้อม `/report-table`
2. สร้างตาราง: Name, Type, Issue, Severity, Suggested Name
3. จัดลำดับตาม severity: Critical → High → Medium → Low
4. ทำ `/suggest-next-action` เพื่อแนะนำ action ถัดไป

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
- ถ้า rename กระทบ public API → ทำ `/rename-files-to` ด้วย ast-grep

### 4. Formatting

- ห้ามใช้ `**` (bold markers) — ใช้ backticks สำหรับ emphasis
- ใช้ heading levels สำหรับ structure
- รายงานเป็นตารางด้วย `/report-table`

## Expected Outcome

- รายงาน findings ชื่อทีไม่เหมาะสม พร้อม suggested names
- ตาราง severity และ location
- ไม่มี TODO, MOCK, placeholder ค้าง
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`
