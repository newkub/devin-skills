---
name: convert-to-docs
description: แปลง code, comments, meeting notes หรือ outline เป็น documentation
---

## Goal

แปลง code, inline comments, meeting notes, หรือ outline เป็น documentation ที structure ชัดเจนและนำไปใช้ได้

## Scope

ใช้สำหรับสร้างหรืออัปเดต `README.md`, `USAGE.md`, `docs/`, หรือ wikis จาก sources ที่มีอยู่

## Execute

### 1. Collect Sources

> Goal: รวบรวมข้อมูลสำหรับ docs

1. ระบุ sources: `README.md`, `USAGE.md`, `src/`, comments, meeting notes, chat
2. อ่าน code และ comments สำคัญ
3. บันทึก key points, examples, constraints
4. ถ้ามี `USAGE.md` → ใช้ `/report-usage-md` ก่อน

### 2. Identify Gaps

> Goal: รู้ว่า docs ขาดอะไร

1. ตรวจ sections: Installation, Quick Start, Usage, Examples, API, Configuration, Troubleshooting
2. ระบุ sections ทีขาดหรือ stale
3. ระบุ code samples ทีควรเพิ่ม
4. ใช้ `/report-table` สรุป gaps

### 3. Write Docs

> Goal: สร้าง documentation ใหม่

1. เขียน `README.md` หรือ `USAGE.md` ให้ครบ sections
2. ใช้ examples จริงจาก code
3. ใช้ `convert-to-markdown` ถ้า input ไม่ใช่ markdown
4. อ้างอิง `update-usage-md` สำหรับ CLI usage

### 4. Review

> Goal: ตรวจสอบ docs

1. ทำ `/review-usage-md` หรือ `/review-readability`
2. ตรวจ links, code samples, formatting
3. ตรวจสอบว่า docs ตรงกับ code จริง
4. ถ้ามี project conventions → ทำ `/follow-principles`

## Rules

### 1. Accuracy

- docs ต้องตรงกับ code ปัจจุบัน
- ไม่เขียนสิ่งทียังไม่มีจริง
- examples ต้องรันได้จริง

### 2. Completeness

- ครบ sections ตาม project type
- ระบุ installation, setup, configuration
- ระบุ troubleshooting ถ้ามี

### 3. Readability

- ใช้ภาษากระชับ
- ใช้ headings ลำดับถูก
- ใช้ code blocks สำหรับ commands

## Expected Outcome

- documentation ทีครบถ้วนและตรงกับ code
- sections ตามมาตรฐาน
- examples จริงและรันได้
- docs ผ่าน review
