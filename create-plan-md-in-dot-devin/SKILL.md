---
name: create-plan-md-in-dot-devin
description: สร้างแผนงานละเอียดใน .devin/plan/<title-time>.md ด้วย /deep-plan, /report-plan, /improve, /review-plan
argument-hint: "[title]"
related:
  - deep-plan
  - report-plan
  - review-plan
  - improve
  - update-references
  - ship
---

## Goal

สร้างแผนงานทีอ่านง่าย มีประโยชน์ และ implement ได้จริง จาก request ของผู้ใช้ แล้วบันทึกลง `.devin/plan/<title-time>.md`

## Scope

- รับ request หรือ title จาก argument
- วางแผนด้วย `/deep-plan`
- ทำให้แผนอ่านง่ายและมีประโยชน์ด้วย `/report-plan`, `/improve`, `/review-plan`
- บันทึกลง `.devin/plan/<title-time>.md`
- อัปเดต references ถ้ามี skill หรือ command อ้างอิง

## Execute

### 1. Capture Request

> Goal: เข้าใจ request และกำหนดชื่อแผน

1. รับ `<title>` และ request content จาก argument
2. ถ้า title ขาด → ถาม user หรือ derived จาก request
3. แปลง title เป็น kebab-case
4. ใช้ `YYYYMMDDHHMMSS` เป็น time
5. สร้าง path `.devin/plan/<title>-<time>.md`

### 2. Deep Plan

> Goal: วางแผนครบมิติ

1. ทำ `/deep-plan` โดยใช้ request เป็น context
2. บันทึก output ทั้งหมด
3. ถ้าแผนไม่ครบ → ทำ `/deep-plan` ซ้ำจนครบ

### 3. Improve Plan

> Goal: ทำให้แผนอ่านง่ายและกระชับ

1. ทำ `/improve` กับเนื้อหาแผน
2. เน้น:
   - ลำดับชัดเจน (dependency order)
   - แต่ละ task มี single responsibility
   - expected result วัดผลได้
   - ลดข้อความทีไม่จำเป็น
3. บันทึกแผนทีปรับปรุงแล้ว

### 4. Review Plan

> Goal: ตรวจคุณภาพแผน

1. ทำ `/review-plan` เพื่อตรวจ:
   - ความสอดคล้องกับ request
   - ลำดับทีถูกต้อง
   - risk ทีระบุครบ
   - ไม่มี gap
2. ถ้า review พบปัญหา → ทำ `/improve` ซ้ำ
3. วนจนกว่าจะผ่าน review

### 5. Report Plan

> Goal: สรุปแผนให้ user เห็นภาพรวม

1. ทำ `/report-plan` เพื่อสรุปแผนเป็น table
2. ระบุ title, time, number of tasks, dependencies, risks
3. รายงานช่วงสั้นก่อนเขียนไฟล์

### 6. Write Plan File

> Goal: บันทึกแผนลงไฟล์

1. สร้าง directory `.devin/plan/` ถ้ายังไม่มี
2. เขียนไฟล์ `.devin/plan/<title>-<time>.md` ด้วย frontmatter:
   - `title`, `description`, `status: pending`, `created`
   - sections: `## Goal`, `## Scope`, `## Tasks`, `## Execution Order`, `## Risks`, `## Notes`
3. ใช้ table สำหรับ tasks:
   - No, Task, Owner, Status, Depends On, Expected Outcome
4. ใช้ `write` tool สร้างไฟล์
5. รายงาน path ให้ผู้ใช้

### 7. Update References

> Goal: อัปเดต references ทีเกี่ยวข้อง

1. ทำ `/update-references` กับทุก skill ทีอ้างอิง `create-plan` เก่า
2. เปลี่ยนเป็น `create-plan-md-in-dot-devin` ทีจำเป็น
3. ถ้ามี `AGENTS.md` → อัปเดต slash command

### 8. Mark Complete And Cleanup

> Goal: จัดการแผนหลังใช้งาน

1. ถ้าผู้ใช้หรืองานอื่นแจ้งว่าทำตามแผนเสร็จแล้ว → อัปเดต `status` เป็น `completed`
2. ลบไฟล์ `.devin/plan/<title>-<time>.md`
3. รายงานว่าแผนถูกลบ

## Rules

### 1. File Location

- ไฟล์ต้องอยู่ใน `.devin/plan/`
- ชื่อไฟล์ format `<title>-<time>.md`
- title เป็น kebab-case
- time ใช้ `YYYYMMDDHHMMSS`

### 2. Content Quality

- ผ่าน `/improve` และ `/review-plan` ก่อนบันทึก
- ทุก task ต้องมี expected outcome วัดผลได้
- ไม่เกิน 250 บรรทัด

### 3. Readability

- ใช้ `/report-plan` เพื่อสรุปเป็น table
- เรียง task ตาม dependency
- เน้น action-oriented

### 4. Cleanup

- ลบแผนทันทีเมื่องานเสร็จ
- ไม่เก็บแผนค้าง

## Expected Outcome

- ไฟล์แผน `.devin/plan/<title>-<time>.md` ถูกสร้าง
- แผนผ่าน `/deep-plan`, `/improve`, `/review-plan`, `/report-plan`
- References อัปเดตครบ
- แผนถูกลบเมื่องานเสร็จ
