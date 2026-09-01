---
name: create-plan-in-dot-devin
description: สร้าง plan file ใน .devin/plan/ พร้อม Goal, Scope, TODO, Acceptance Criteria และ Notes
argument-hint: "[title]"
related:
  - create-report-in-dot-devin
  - create-plan-as-github-issue
  - deep-plan
  - report-plan
  - report-table
  - report-what-you-do
  - deep-idea-features
  - bench-competitors
  - follow-git-flow
  - ship
---

## Goal

สร้าง plan file มาตรฐานใน `.devin/plan/<title>-<date>-<time>-<session>.md` เพื่อใช้เป็นแผนก่อนลงมือ implement และลบหลังงานเสร็จ

## Scope

- รับ `<title>` และ context จาก argument หรือ current task
- สร้าง/อัปเดต `.devin/plan/<title>-<date>-<time>-<session>.md`
- รวม sections: Goal, Scope, TODO, Acceptance Criteria, Notes
- ใช้ `/report-table` สำหรับทุก table
- ไฟล์ถูกลบตาม context หลัง implementation เสร็จ

## Execute

### 1. Capture Context

> Goal: เข้าใจ task ก่อนสร้าง plan

1. รับ `<title>` จาก argument
2. ถ้า title ขาด → derive จาก context หรือถาม user
3. แปลง title เป้น kebab-case
4. ใช้ `YYYYMMDD` เป้น date, `HHMMSS` เป้น time
5. ใช้ session slug จาก context ถ้ามี เช่น ชื่องาน/หัวข้อสั้นๆ หรือ timestamp
6. สร้าง path `.devin/plan/<title>-<date>-<time>-<session>.md`
7. ถ้าไฟล์ซ้ำ → เพิ่ม counter เช่น `-2`, `-3`

### 2. Analyze And Build Plan

> Goal: รวบรวมข้อมูลสำหรับ plan

1. ทำ `/analyze-project` ถ้าต้องการ context
2. ทำ `/report-what-you-do` เพื่อสรุปสิ่งที่ต้องทำ
3. ระบุ TODOs แบบมีลำดับและ dependency
4. ระบุ Acceptance Criteria ทีวัดผลได้

### 3. Build Tables

> Goal: สร้าง table สำหรับ plan

1. Table 1: TODOs
   - columns: No., Task, Status, Depends On, Expected Outcome
2. Table 2: Acceptance Criteria
   - columns: No., Criteria, How to Verify
3. Table 3: Risks / Notes (ถ้ามี)
   - columns: No., Risk, Mitigation

### 4. Write Plan File

> Goal: บันทึก plan ลงไฟล์

1. สร้าง directory `.devin/plan/` ถ้ายังไม่มี
2. เขียนไฟล์ `.devin/plan/<title>-<date>-<time>-<session>.md` ด้วย frontmatter:
   - `title`, `description`, `status: pending`, `created`
   - sections: `## Goal`, `## Scope`, `## TODOs`, `## Acceptance Criteria`, `## Notes`
3. ใช้ `/report-table` สำหรับทุก table
4. ใช้ `write` tool สร้างไฟล์
5. รายงาน path ให้ผู้ใช้

### 5. Cleanup If Asked

> Goal: ลบ plan หลังใช้งาน

1. ถ้า context ระบุให้ลบหลัง implement → ลบไฟล์ plan
2. ถ้า user บอกเสร็จแล้ว → ตรวจสอบและลบไฟล์ plan ทีค้าง
3. ถ้าต้องการเก็บ plan ไว้ trace ให้ย้ายไป `docs/plans/` แทน

## Rules

### 1. File Location

- ไฟล์ต้องอยู่ใน `.devin/plan/`
- ชื่อไฟล์ format `<title>-<date>-<time>-<session>.md`
- title เป้น kebab-case
- date ใช้ `YYYYMMDD`, time ใช้ `HHMMSS`
- session เป้น slug สั้นๆ เช่น ชื่องาน/หัวข้อ หรือ `001` ถ้าไม่มี

### 2. Plan Tables

- ต้องมี table TODOs และ Acceptance Criteria
- ทุก table ต้องมีคอลัมน์ `No.` เป้นคอลัมน์แรก
- เรียงลำดับ 1, 2, 3, ...
- ใช้ `/report-table` เพื่อจัดรูปแบบ

### 3. Status And Tracking

- frontmatter ระบุ `status: pending` เมื่องสร้าง
- อัปเดตเป็น `status: in-progress` เมื่องเริ่ม implement
- อัปเดตเป็น `status: done` ก่อนลบ หรือลบทันทีตาม context

### 4. Cleanup

- ลบ plan ทันทีเมื่องานเสร็จถ้า context ระบุ
- ไม่เก็บ plan ค้างถ้าไม่จำเป็น
- ถ้า implement ผ่าน `/ship` → ให้ `/ship` จัดการ cleanup ตาม context

- ใช้ `/deep-plan` ถ้าต้องการวิเคราะห์ลึกก่อนสร้าง plan
- ใช้ `/report-plan` เพื่อรายงานแผนในแชท

## Expected Outcome

- ไฟล์ plan `.devin/plan/<title>-<date>-<time>-<session>.md` ถูกสร้าง
- Plan มี TODOs table และ Acceptance Criteria ครบ
- Plan ถูกลบหลัง implementation เสร็จตาม context

