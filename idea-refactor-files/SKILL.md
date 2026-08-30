---
name: idea-refactor-files
description: สร้างไอเดีย refactor สำหรับไฟล์ทีระบุ
argument-hint: "[@files...]"
related:
  - refactor
  - refactor-files
  - refactor-codebase
  - refactor-to-single-responsibility
  - relocation
  - review-restructure
  - review-quality
  - review-readability
  - check-code-structure
  - report-table
  - suggest-next-action
---

## Goal

วิเคราะห์ไฟล์ทีระบุแล้วสร้างไอเดียสำหรับ refactoring โดยไม่แก้ไขไฟล์

## Scope

- ใช้กับ `@files...` ที user ระบุ
- วิเคราะห์ SRP, naming, structure, readability, dependencies
- สร้างไอเดียพร้อม severity และ sub-skill ทีเหมาะสม
- ไม่ลงมือ refactor

## Execute

### 1. Read Files

> Goal: เข้าใจไฟล์ทีจะวิเคราะห์

1. อ่านแต่ละไฟล์ใน `@files...`
2. ทำ `/check-code-structure` เพื่อดู symbols, imports, exports
3. บันทึก responsibilities, dependencies, public API

### 2. Analyze

> Goal: หา opportunities สำหรับ refactoring

1. ทำ `/review-quality` สำหรับไฟล์ทีระบุ
2. ทำ `/review-readability` ถ้าไฟล์อ่านยาก
3. ทำ `/review-restructure` ถ้า structure ซับซ้อน
4. ระบุ issues:
   - ไฟล์ยาว >250 บรรทัด
   - หลาย responsibility ในไฟล์เดียว
   - ชื่อ/namespace ไม่ชัดเจน
   - imports/exports ซับซ้อน
   - dead code หรือ unused exports

### 3. Generate Ideas

> Goal: แปลง findings เป็น actionable ideas

1. สำหรับแต่ละ issue สร้างไอเดีย:
   - ชื่อไอเดีย
   - severity: Critical, High, Medium, Low
   - รายละเอียดสั้น ๆ
   - sub-skill ทีแนะนำ เช่น `/refactor-to-single-responsibility`, `/relocation`, `/refactor-files`
2. เรียงลำดับตาม severity แล้วตาม effort

### 4. Build Report

> Goal: สรุปไอเดียเป็นตาราง

1. ใช้ `/report-table` ด้วยคอลัมน์:
   - No.
   - File
   - Idea
   - Severity
   - Recommended Sub-skill
   - Notes
2. ทำ `/suggest-next-action`

## Rules

### 1. Read Only

- ไม่แก้ไขไฟล์
- ไม่สร้างไฟล์ใหม่
- ไม่ update references

### 2. Evidence-Based

- ทุกไอเดียต้องมาจากการอ่านไฟล์จริง
- ระบุ file path และ line number ถ้าได้
- ไม่เดา

### 3. Concise

- รายละเอียดไอเดียไม่เกิน 1-2 บรรทัด
- ถ้ายาว ให้ระบุใน Notes

### 4. Actionable

- ทุกไอเดียต้องบอก sub-skill ทีเหมาะสม
- ไม่ทิ้งไอเดียทีไม่มี next step

## Expected Outcome

- รายการไอเดีย refactor สำหรับไฟล์ทีระบุ
- ตารางพร้อม severity และ sub-skill ทีแนะนำ
- ไม่มีการแก้ไขไฟล์
- มี next action ผ่าน `/suggest-next-action`
