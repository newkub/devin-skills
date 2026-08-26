---
name: implement-todo-md
description: อ่าน TODO.md แล้ว implement tasks ทั้งหมดตามลำดับ พร้อม update status
related:
  - update-todo-md
  - realize-implementation
  - continue
  - report-markdown-table
  - validate
  - ship
---

## Goal

อ่าน `TODO.md` แล้ว implement ทุก task ตามลำดับ dependencies พร้อม update status

## Scope

- อ่าน `TODO.md` ใน project root
- เรียง task ตาม priority, dependency, created
- implement ทีละ task ด้วย `/realize-implementation` หรือ `/continue`
- update status เป็น `in-progress`, `completed`, หรือ `blocked`

## Execute

### 1. Read TODO.md

> Goal: รู้ tasks ทั้งหมด

1. หา `TODO.md` ใน project root
2. ถ้าไม่มี → stop และ report
3. แยก table rows: Title, Description, Status, Priority, Created
4. บันทึก tasks

### 2. Sort And Select

> Goal: เรียงลำดับทีถูกต้อง

1. กรองเฉพาะ `pending` และ `in-progress`
2. เรียงตาม:
   - priority: high → medium → low
   - dependency: ทีไม่มี blocker ก่อน
   - created: เก่าไปใหม่
3. เลือก task แรก

### 3. Implement Task

> Goal: ทำ task จนเสร็จ

1. ทำ `/realize-implementation` สำหรับ task ปัจจุบัน
2. ถ้า task ง่ายและมี state อยู่แล้ว → ใช้ `/continue`
3. ถ้า task ซับซ้อน → ใช้ `/deep-plan` ก่อน
4. ถ้า fail → ทำ `/resolve-errors` แล้ว retry (max 3)
5. update status เป็น `completed` ถ้าผ่าน

### 4. Update TODO.md

> Goal: บันทึก progress

1. อัปเดต `Status` ของ task ทีทำเสร็จ
2. ถ้าต้องเพิ่ม sub-tasks → เพิ่ม row ใหม่
3. ถ้า task blocked → อัปเดต status เป็น `blocked` พร้อมเหตุผล
4. ใช้ `edit` tool แก้ไข `TODO.md`

### 5. Loop

> Goal: ทำจนครบ

1. กลับไป step 2
2. ทำซ้ำจนกว่าไม่มี `pending` task
3. ถ้ามี `blocked` → report และถาม user

### 6. Finalize

> Goal: ส่งมอบ

1. ทำ `/validate` เพื่อตรวจ references และ structure
2. ทำ `/run-verify` ถ้ามี
3. ทำ `/ship`
4. ใช้ `/report-markdown-table` สรุป tasks ทั้งหมด

## Rules

- ทำ task ทีละอัน
- update status ทันทีหลังทำ
- ถ้า task ไม่ชัดเจน → ถาม user ก่อน
- ถ้ามี dependency → รอ task ก่อนหน้าเสร็จ
- ไม่เพิ่ม task ใหม่โดยไม่มีเหตุผล

## Expected Outcome

- ทุก `pending` task ใน `TODO.md` ถูก implement
- `TODO.md` แสดง status ล่าสุด
- ผลงานผ่าน validation/verify
- รายงาน table สรุป
