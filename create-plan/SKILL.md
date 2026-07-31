---
name: create-plan
description: สร้างแผนงานละเอียดใน .devin/plan/<title-date>.md ด้วย /deep-plan และ /report-plan
argument-hint: "<title>"
triggers: ['user']
allowed-tools: ['read', 'edit', 'write', 'exec']
related:
  - deep-plan
  - report-plan
  - implement-plan
---

## Goal

สร้างแผนงานละเอียดจาก request ของผู้ใช้ บันทึกลง `.devin/plan/<title-date>.md` และลบออกเมื่องานเสร็จ

## Scope

- ใช้ `/deep-plan` เพื่อวางแผนครบมิติ
- ใช้ `/report-plan` เพื่อรายงานแผน
- บันทึกแผนลง `.devin/plan/<title-date>.md`
- เมื่องานทั้งหมดเสร็จ ให้ลบไฟล์แผน

## Execute

### 1. Prepare Plan Title And Date

> Goal: มีชื่อไฟล์แผนที่ไม่ซ้ำ

1. รับ `<title>` จาก argument หรือ derived จาก request
2. ใช้ date ปัจจุบัน `YYYYMMDD`
3. แปลง title เป็น kebab-case
4. สร้าง path `.devin/plan/<title>-<date>.md`

### 2. Deep Plan

> Goal: มีแผนละเอียดครบมิติ

1. ทำ `/deep-plan` เพื่อวางแผนงาน
2. บันทึกผลลัพธ์จาก `/report-plan`

### 3. Write Plan File

> Goal: บันทึกแผนลงไฟล์

1. เขียนไฟล์ `.devin/plan/<title>-<date>.md` ด้วย frontmatter:
   - `title`, `description`, `status: pending`, `created`
   - sections: `## Goal`, `## Scope`, `## Tasks`, `## Execution Order`, `## Risks`, `## Notes`
2. ใช้ `write` tool สร้างไฟล์
3. รายงาน path ให้ผู้ใช้

### 4. Mark Complete And Delete

> Goal: ลบแผนเมื่องานเสร็จ

1. ถ้าผู้ใช้หรืองานอื่นแจ้งว่าทำตามแผนเสร็จแล้ว → อัปเดต `status` เป้น `completed`
2. ลบไฟล์ `.devin/plan/<title>-<date>.md`
3. รายงานว่าแผนถูกลบ

## Rules

### 1. File Location

- ไฟล์ต้องอยู่ใน `.devin/plan/`
- ชื่อไฟล์ format `<title>-<date>.md` โดย title เป้น kebab-case
- สร้าง directory ถ้ายังไม่มี

### 2. Content

- มี frontmatter ครบ
- มี task table พร้อม status
- อ้างอิง `/deep-plan` และ `/report-plan`
- ไม่เกิน 250 บรรทัด

### 3. Cleanup

- ลบแผนทันทีเมื่องานเสร็จ
- ไม่เก็บแผนค้าง

## Expected Outcome

- มีแผนงานละเอียดใน `.devin/plan/<title>-<date>.md`
- ผู้ใช้เห็นแผนและสามารถ implement ต่อได้
- แผนถูกลบเมื่องานเสร็จ