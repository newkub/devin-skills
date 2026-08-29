---
name: follow-report-in-dot-devin
description: สร้าง report ละเอียดใน .devin/reports/ พร้อม 3 tables, file structure และ what-you-do
argument-hint: "[title]"
related:
  - create-plan-in-dot-devin
  - report-file-structure
  - report-what-you-do
  - report-table
  - idea-features
---

## Goal

สร้าง report ละเอียดใน `.devin/reports/<title>-<time>.md` คล้ายกับ `/create-plan-in-dot-devin` แต่ focus ที่ features, file structure และ progress แบ่ง phase

## Scope

- รับ request, title หรือ context จาก argument
- สร้าง report ที่มี 3 tables:
  1. New features
  2. Extended features
  3. What-you-do แบ่งเป็น phase
- รวม `/report-file-structure` ของ project
- บันทึกลง `.devin/reports/<title>-<time>.md`
- ไม่ลบไฟล์หลังสร้าง (ลบตาม context หรืองานเสร็จ)

## Execute

### 1. Capture Context

> Goal: เข้าใจ context ก่อนสร้าง report

1. รับ `<title>` และ context จาก argument
2. ถ้า title ขาด → derived จาก context หรือถาม user
3. แปลง title เป็น kebab-case
4. ใช้ `YYYYMMDDHHMMSS` เป็น time
5. สร้าง path `.devin/reports/<title>-<time>.md`

### 2. Analyze And Gather Data

> Goal: รวบรวมข้อมูลสำหรับ report

1. ทำ `/analyze-project` เพื่อดู features ที่มี
2. ทำ `/scan-codebase` เพื่อดู structure
3. ถ้าเกี่ยวข้องกับ features → ทำ `/idea-features` แบบไม่เปิด web app เพื่อดู new/extended features
4. ถ้ามี plan อยู่ → อ่าน `.devin/plan/<title>-<time>.md`

### 3. Report File Structure

> Goal: รวมโครงสร้างไฟล์ใน report

1. ทำ `/report-file-structure`
2. สรุป tree view และสถิติสำคัญ
3. ใส่ไว้ใน report ส่วน `## File Structure`

### 4. Build Feature Tables

> Goal: สร้าง 2 tables สำหรับ features

1. Table 1: New features
   - columns: No., Feature, Description, Phase, Effort, MVP Score, Risk
2. Table 2: Extended features
   - columns: No., Feature, Description, Phase, Effort, MVP Score, Risk
3. จัดลำดับตาม MVP Score สูง → ต่ำ
4. ระบุ Phase: MVP, v2, v3
5. ระบุ Effort: S, M, L, XL

### 5. Build What-You-Do Table

> Goal: สร้าง table แบ่ง phase สำหรับสิ่งที agent ทำหรือต้องทำ

1. แบ่งเป็น phase: Prepare, Analyze, Write, Validate, Report
2. แต่ละ phase ระบุสิ่งทีทำ, สถานะ, หมายเหตุ
3. columns: No., Phase, Action, Status, Note
4. ใช้ `/report-what-you-do` เพื่อช่วยสร้างเนื้อหา

### 6. Write Report File

> Goal: บันทึก report ลงไฟล์

1. สร้าง directory `.devin/reports/` ถ้ายังไม่มี
2. เขียนไฟล์ `.devin/reports/<title>-<time>.md` ด้วย frontmatter:
   - `title`, `description`, `status: pending`, `created`
   - sections: `## Goal`, `## Scope`, `## New Features`, `## Extended Features`, `## What You Do`, `## File Structure`, `## Notes`
3. ใช้ `/report-table` สำหรับทุก table
4. ใช้ `write` tool สร้างไฟล์
5. รายงาน path ให้ผู้ใช้

### 7. Update References

> Goal: อัปเดต references ที่เกี่ยวข้อง

1. ทำ `/update-references` กับทุก skill ที่อ้างอิง `follow-report-in-dot-devin`
2. ถ้ามี `AGENTS.md` → อัปเดต slash command

## Rules

### 1. File Location

- ไฟล์ต้องอยู่ใน `.devin/reports/`
- ชื่อไฟล์ format `<title>-<time>.md`
- title เป็น kebab-case
- time ใช้ `YYYYMMDDHHMMSS`

### 2. Report Tables

- ต้องมี 3 tables: New Features, Extended Features, What You Do
- ทุก table ต้องมีคอลัมน์ "No." เป็นคอลัมน์แรก
- เรียงลำดับ 1, 2, 3, ...
- ใช้ `/report-table` เพื่อจัดรูปแบบ

### 3. File Structure

- รวม `/report-file-structure` ใน report
- ไม่เกิน 3 levels สำหรับ project ใหญ่
- กรอง `node_modules`, `.git`, `dist`, `build`

### 4. Cleanup

- ลบ report ทันทีเมื่องานเสร็จถ้า context ระบุ
- ไม่เก็บ report ค้างถ้าไม่จำเป็น

## Expected Outcome

- ไฟล์ report `.devin/reports/<title>-<time>.md` ถูกสร้าง
- Report มี 3 tables ครบถ้วน
- รวม `/report-file-structure`
- ใช้ `/report-what-you-do` แบ่ง phase
- References อัปเดตครบ
