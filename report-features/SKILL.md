---
name: report-features
description: รายงาน features ทั้งหมดใน project เป็นตารางจาก generated TypeScript files
---

## Goal

รายงาน features ทั้งหมดใน project เป็นตารางในแชท โดยอ่านจาก `.devin/features/` TypeScript files

## Scope

อ่านและแสดงผล features จาก generated TypeScript files ใน `.devin/features/<workspace>/` เป็นตารางในแชทเท่านั้น

ไม่รวม: สแกนและสร้าง feature files (ใช้ `/update-features`), วิเคราะห์และ review features (ใช้ `/deep-review`), ตรวจสอบ coverage (ใช้ `/deep-review`)

## Execute

### 1. Ensure Features Generated

> Goal: Ensure Features Generated

ตรวจสอบว่า features files มีอยู่และเป็นปัจจุบัน

1. ตรวจสอบ `.devin/features/<workspace>/index.ts` มีอยู่หรือไม่
2. ถ้าไม่มีหรือ outdated ให้ทำ `/update-features` เพื่อสแกนและสร้าง feature files
3. ถ้ามีแล้ว ให้ข้ามไป Step 2

### 2. Read Feature Files

> Goal: Read Feature Files

อ่าน feature files จากทุก workspace

1. ทำ `/analyze-all-workspace` เพื่อระบุ workspaces ทั้งหมด
2. อ่าน `.devin/features/<workspace>/index.ts` เพื่อรับ manifest และ `allFeatures`
3. อ่าน `.devin/features/<workspace>/types.ts` เพื่อรับ Feature interface
4. รวบรวม features จากทุก workspace ไว้ใน list เดียว

### 3. Format Report Table

> Goal: Format Report Table

จัดรูปแบบ features เป็นตารางในแชท

1. ทำ `/report-table` เพื่อจัดรูปแบบตาราง
2. คอลัมน์: # | Workspace | Feature | Description | Why | Solutions | Module | Route | API | DB | Topics | Status
3. จัดกลุ่มตาม workspace แล้วตาม module
4. เรียงลำดับ features ตาม module และ status (`active` ก่อน, `partial` ทีหลัง, `deprecated` สุดท้าย)

### 4. Report Summary

> Goal: Report Summary

สรุปสถานะ features ทั้งหมด

1. ทำ `/report` เพื่อรายงานในแชท
2. สรุปจำนวน features ต่อ workspace และต่อ status
3. ระบุ features ที่ `partial` หรือ `deprecated` แยกกลุ่ม
4. แนะนำให้ทำ `/deep-review` หรือ `/deep-review` สำหรับ features ที่ `partial`

## Rules

### Report UX/UI

> Goal: report อ่านง่าย สรุป key findings ไว้ด้านบน และนำไปสู่ action

1. สรุป key findings ไว้ด้านบนก่อนรายละเอียด
2. ใช้ `/report-table` สำหรับตารางเปรียบเทียบหลาย columns
3. ใช้ `/report-ansi` สำหรับรายงานสถานะ/progress/logs
4. ใช้ numbered columns, headers ชัดเจน, จัดกลุ่ม/เรียงลำดับตามความสำคัญ
5. ใช้ symbols ✅ ❌ ⚠️ สำหรับ status indicators
6. ทำ `/suggest-next-action` ท้าย report เสมอ

### 1. Read-Only Action

- อ่าน feature files เท่านั้น ไม่แก้ไข code หรือ feature files
- ถ้า feature files ไม่มีอยู่ ให้ทำ `/update-features` แทนการสร้างเอง
- ถ้า feature files outdated ให้ทำ `/update-features` เพื่อ refresh

### 2. Table Format

- ใช้คอลัมน์ตาม `types.ts` Feature interface ของแต่ละ workspace
- ฟิลด์บังคับ: `id`, `name`, `description`, `why`, `solutions`, `module`, `status`
- ฟิลด์ optional: `route`, `api`, `db`, `topics` — แสดงถ้ามีค่า
- ใช้ symbols (✅, ⚠️, ❌) สำหรับ `status`: `active`, `partial`, `deprecated`
- จัดกลุ่มตาม workspace ก่อน แล้วตาม module

### 3. Data Source

- อ่านจาก `.devin/features/<workspace>/index.ts` เท่านั้น
- ไม่สแกน codebase โดยตรง — ใช้ `/update-features` สำหรับการสแกน
- ถ้า workspace ไม่มี feature files ให้ข้ามและ report ใน summary

### 4. Completeness

- รายงาน features จากทุก workspace ที่มี feature files
- ระบุ workspace ที่ไม่มี feature files ใน summary
- ถ้าไม่มี feature files เลย ให้ทำ `/update-features` ก่อน

## Expected Outcome

- ตาราง features ทั้งหมดในแชท จัดกลุ่มตาม workspace และ module
- Summary สถานะ features ต่อ workspace
- แนะนำ workflows ที่ควรใช้ต่อ (`/deep-review`, `/deep-review`)
- Report อ่านง่าย มี key findings ด้านบน
- มี next action ชัดเจน