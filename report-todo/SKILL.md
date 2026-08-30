---
name: report-todo
description: รายงานสิ่งที AI จะทำต่อไปในรูปแบบตาราง ไม่ใช่สำหรับอ่าน TODO.md
related:
  - report-plan
  - report-progress
  - report-task-progress
  - report-table
  - continue
  - suggest-next-action
  - update-todo-md
---

## Goal

รายงานสิ่งที AI จะทำต่อไป ในรูปแบบตาราง ก่อนลงมือทำจริง

## Scope

ใช้เมื่อ:
- user บอกให้ทำงานบางอย่าง และต้องการเห็นแผนก่อน
- งานมีหลาย step และต้องการเห็นทีทะลัว
- ต้องการ report state ก่อน `/continue`

ไม่ใช้สำหรับ:
- อ่านหรือ update ไฟล์ `TODO.md` (ใช้ `/update-todo-md` หรือ `/report-scan-todo`)
- รายงาน progress หลังทำงาน (ใช้ `/report-progress` หรือ `/report-task-progress`)
- วางแผนละเอียดไฟล์/โครงสร้าง (ใช้ `/report-plan`)

## Execute

### 1. Parse Current State

> Goal: รู้วาอยู่ทีขั้นตอนใด

1. อ่าน context และ todo list ปัจจุบัน
2. ระบุงานทีเสร็จแล้ว, งานทีกำลังทำ, งานที pending
3. ถ้าไม่ชัด → ทำ `/ask-me` หรือ `/suggest-next-action`

### 2. Build Action Table

> Goal: สร้างตารางสิ่งจะทำ

ตารางต้องมีคอลัมน์:

| No. | Action | Skill/Command | Why | Status |
|-----|--------|---------------|-----|--------|
| 1 | ... | `...` | ... | pending |
| 2 | ... | `...` | ... | pending |

หรือถ้าง่ายกวานั้น:

| No. | ทำอะไร | ด้วย skill ไหน | Output ทีคาดหวัง |
|-----|--------|----------------|------------------|
| 1 | ... | `...` | ... |

### 3. Report

> Goal: ส่งมอบตารางให้ user

1. ใช้ `/report-table` หรือ format table ในแชท
2. ระบุงานแรกทีจะเริ่มทันที
3. ถ้ามี dependency ระบุลำดับทีต้องทำ
4. ถาม user วาต้องการให้เริ่มทำเลยหรือปรับแผน

## Rules

### 1. Table Only

- ตอบเป้นตารางเท่านั้น
- ไม่เขียนย่อหน้ายาว นอกจากข้อความสั้นก่อนหรือหลังตาราง

### 2. Always Numbered

- คอลัมน์แรกต้องเป้น `No.` เริ่มจาก 1
- เรียงลำดับตาม execution order

### 3. No. and Skill

- แต่ละ row ต้องบอกวาจะใช้ skill/command อะไร
- ถ้าไม่ใช่ skill ให้บอก action ชัดเจน

### 4. Status Column

- `pending` สำหรับงานทียังไม่ทำ
- `in_progress` สำหรับงานทีกำลังทำ
- `completed` สำหรับงานทีเสร็จแล้ว

### 5. Not For File TODO

- `report-todo` ไม่อ่าน `TODO.md`
- ไม่อัปเดต `TODO.md`
- ไม่ scan TODO markers ใน code

## Expected Outcome

- ตารางสิ่ง AI จะทำต่อไป
- มีลำดับ มี skill/command มีเหตุผล มี status
- user เห็นภาพก่อนลงมือ
- ไม่เกิดความสับสนกับ `/update-todo-md` หรือ `/report-scan-todo`
