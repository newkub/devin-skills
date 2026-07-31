---
name: validate-workflow
description: ตรวจสอบ workflow file ตาม criteria เฉพาะ ก่อนใช้จริง
---

## Goal

ตรวจสอบ workflow ว่า valid ตาม criteria เฉพาะ: ไม่เกิน 250 บรรทัด, steps ไม่เกิน 10, sections ครบ, `related` ไม่มี missing/unused, ไม่มี TODO/MOCK/placeholder, ไม่ใช้ `∥` นอก `Execute` numbered list

## Scope

ใช้กับ workflow files ที่เขียนหรือปรับปรุงเสร็จแล้ว — เรียกจาก `/follow-write-devin-skills` หรือ `/improve-workflows` ก่อน finalize

## Execute

### 1. Check Structure

ตรวจสอบโครงสร้างพื้นฐาน

> Goal: ทุก workflow มี frontmatter และ sections ครบ

1. ตรวจ frontmatter ว่ามี `title` Title Case ตรง filename, `description` กระชับไม่เกิน 100 ตัวอักษร, `auto_execution_mode: 3`, `related` เฉพาะ direct calls
2. ตรวจสอบ `title` Title Case ตรง filename
3. ตรวจสอบ sections ครบ: `## Goal`, `## Scope`, `## Execute`, `## Rules`, `## Expected Outcome`
4. ตรวจสอบ Execute headings เป็น English Title Case
5. ตรวจสอบ Rules เป็นภาษาไทย

### 2. Check Size And Steps

ตรวจสอบขนาดและจำนวน steps

> Goal: ไฟล์ไม่เกิน threshold และทำตามได้จริง

1. ไฟล์ไม่เกิน 250 บรรทัด
2. steps ใน Execute ไม่เกิน 10
3. แต่ละ step มี 2-10 รายการย่อย
4. ถ้าเกิน → ทำ `/refactor-workflow` แล้ว recheck

### 3. Check References

ตรวจสอบ references

> Goal: `related` ถูกต้องและไม่มี broken references

1. ทำ `/check-reference` เพื่องตรวจ broken references
2. ตรวจ `related` ไม่มี missing/unused ตาม Execute และ Rules
3. ถ้าพบ broken หรือ unused → fix แล้ว recheck

### 4. Check Markers And Placeholders

ตรวจสอบสัญลักษณ์และ placeholders

> Goal: ไม่มีสิ่งที่ทำให้ workflow ใช้ไม่ได้

1. ไม่มี TODO, MOCK, placeholder, generic filler
2. ไม่ใช้ `∥` นอก `Execute` numbered list
3. ไม่ใช้ `**` (bold markers) ใน workflow
4. ใช้ backticks สำหรับ `tools`, `commands`, `/workflow-name`, `parallel:`, `∥`

### 5. Revalidate If Failed

จัดการ issues ที่พบ

> Goal: ผ่าน validation ก่อน finalize

1. ถ้าพบ issue → กลับไปแก้ที่ source workflow แล้ว revalidate
2. ทำ recheck สูงสุด 3 ครั้ง — ถ้ายังไม่ผ่าน → stop/report
3. ถ้าผ่าน → ทำ `/suggest-next-action`

## Rules

### 1. Validation Criteria

- criteria ต้อง measurable: ระบุ threshold, expected format, pass/fail condition, retry limit
- ตรวจทั้ง structure, references, content markers, และ size
- fail fast — ถ้า frontmatter หรือ sections หลักไม่ครบ → ไม่ต้องตรวจลึก

### 2. No Placeholders

- ห้าม TODO, MOCK, placeholder ใน workflow ที่จะใช้จริง
- ห้าม generic filler
- ถ้าพบ → บังคับแก้ก่อน pass

### 3. Marker Restrictions

- `∥` ใช้เฉพาะใน `Execute` numbered list
- `**` ห้ามใช้ใน workflow
- ใช้ backticks สำหรับ emphasis แทน bold

## Expected Outcome

- workflow ผ่าน criteria ทั้งหมด: structure, size, steps, references, markers, placeholders
- ไม่มี broken references
- ไม่มี TODO/MOCK/placeholder
- `∥` อยู่ใน `Execute` numbered list เท่านั้น
- พร้อม finalize
