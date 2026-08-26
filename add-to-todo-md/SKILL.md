---
name: add-to-todo-md
description: รับ request จาก user และเพิ่มลง TODO.md ใน project root พร้อมชี้แนะ next step
related:
  - update-todo-md
  - deep-plan
  - realize-implementation
  - continue
  - report-table
  - ask-me
---

## Goal

รับ request จากผู้ใช้ และเพิ่มลง `TODO.md` ใน project root พร้อมชี้แนะ next step โดยไม่ execute ทันที

## Scope

- ใช้กับทุก request ที่ผู้ใช้ต้องการคัดแยกหรือจัดคิวใน `TODO.md`
- บันทึก request ดิบลง `TODO.md`
- ไม่ execute ทันที

## Execute

### 1. Capture Request

> Goal: มี title และ request ที่ชัดเจน

1. รับ `<title>` และ request content จาก argument
2. ถ้าขาด ให้ถาม user
3. ตรวจสอบ title เป็น kebab-case, ไม่มีอักขระพิเศษ
4. ถ้า title ไม่ถูกต้อง ให้ถามใหม่หรือ normalize

### 2. Append To TODO.md

> Goal: บันทึก request ลงไฟล์ TODO.md

1. ใช้ date ปัจจุบัน `YYYYMMDD`
2. ตรวจสอบ `TODO.md` ที่ project root:
   - ถ้าไม่มี → สร้างด้วย `# TODO` และ table header:
     ```
     | Title | Description | Status | Priority | Created |
     |---|---|---|---|---|
     ```
3. เพิ่ม row ใหม่ท้ายตาราง:
   - `| <title> | <request> | pending | medium | <date> |`
4. ถ้า request ซ้ำ title เดิม → อัปเดท description แทน append
5. รายงาน path `TODO.md`

### 3. Suggest Next Steps

> Goal: ผู้ใช้รู้ว่าจะทำต่อยังไง

1. ถ้าต้องการวางแผนละเอียด → ใช้ `/deep-plan`
2. ถ้าพร้อม implement → ใช้ `/realize-implementation`
3. ถ้าต้องการอ่าน TODO.md แบบ enhanced prompt → ใช้ `/update-todo-md`
4. ถ้ามีหลาย task รออยู่ → ใช้ `/continue` เพื่อทำตามลำดับ

## Rules

### 1. Title

- ใช้ kebab-case
- ไม่มีอักขระพิเศษ
- สั้นและจำง่าย

### 2. File Location

- ต้องอยู่ใน `TODO.md` ที่ project root
- ไม่สร้างไฟล์ย่อยใน `.devin/todo/`

### 3. Status

- ค่าเริ่มต้น `pending`
- อัปเดทเป็น `in-progress` หรือ `completed` โดย `/continue`

### 4. No Execution

- ไม่ execute request ทันที
- ถ้าผู้ใช้ต้องการทำทันที ให้ใช้ workflow อื่น

## Expected Outcome

- `TODO.md` มี task ใหมท้ายตาราง
- Task มี title, description, status, priority, created
- พร้อมสำหรับ `/deep-plan`, `/realize-implementation`, `/update-todo-md` หรือ `/continue` ต่อ
- ถ้าเป็น monorepo ให้ใส่ task ลง `TODO.md` แค่ project root ไม่ใช่ของแต่ละ workspace
