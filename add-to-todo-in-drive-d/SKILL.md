---
name: add-to-todo-in-drive-d
description: รับ request จากผู้ใช้ และเพิ่มลง TODO.md บน drive D พร้อมชี้แนะ next step
argument-hint: "[task]"
related:
  - add-to-todo-md
  - list-todo-in-drive-d
  - update-todo-md
  - deep-plan
  - realize-implementation
  - continue
---

## Goal

รับ request จากผู้ใช้ และเพิ่มลง `d:/TODO.md` พร้อมชี้แนะ next step โดยไม่ execute ทันที

## Scope

- ใช้เมื่อ user ต้องการคัดแยก request ลง `d:/TODO.md`
- บันทึก request ดิบลงไฟล์ทีเดียวบน drive D
- ไม่ execute ทันที

## Execute

### 1. Capture Request

> Goal: มี title และ request ทีชัดเจน

1. รับ `<title>` และ request content จาก argument
2. ระบุ `<path>` ที่ task หมายถึงจาก request, context, หรือ workspace ปัจจุบัน
3. ถ้า path ไม่ชัด → ถาม user ว่าหมายถึง path ไหนก่อน append
4. ถ้าขาด `<title>`, `<path>`, หรือ request content ให้ถาม user
5. ตรวจสอบ title เป็น kebab-case, ไม่มีอักขระพิเศษ
6. ถ้า title ไม่ถูกต้อง ให้ถามใหม่หรือ normalize

### 2. Append To d:/TODO.md

> Goal: บันทึก request ลงไฟล์

1. ใช้ date ปัจจุบัน `YYYYMMDD`
2. ตรวจสอบ `d:/TODO.md`:
   - ถ้าไม่มี → สร้างด้วย `# TODO` และ table header:
     ```
     | Title | Description | Path | Status | Priority | Created |
     |---|---|---|---|---|---|
     ```
3. เพิ่ม row ใหม่ท้ายตาราง:
   - `| <title> | <request> | <path> | pending | medium | <date> |`
4. ถ้าไม่มี `<path>` → หยุดและถาม user ก่อน append
5. ถ้า request ซ้ำ title เดิม → อัปเดท description แทน append
6. รายงาน path `d:/TODO.md`

### 3. Suggest Next Steps

> Goal: ผู้ใช้รู้ว่าจะทำต่อยังไง

1. ถ้าต้องการวางแผนละเอียด → ใช้ `/deep-plan`
2. ถ้าพร้อม implement → ใช้ `/realize-implementation`
3. ถ้าต้องการอ่าน TODO แบบ enhanced prompt → ใช้ `/update-todo-md`
4. ถ้ามีหลาย task รออยู่ → ใช้ `/continue` เพื่อทำตามลำดับ

## Rules

### 1. Title

- ใช้ kebab-case
- ไม่มีอักขระพิเศษ
- สั้นและจำง่าย

### 2. File Location

- ต้องอยู่ใน `d:/TODO.md`
- ไม่สร้างไฟล์ย่อยใน `.devin/todo/`

### 3. Path

- ทุก row ต้องมี `Path` ที่ชี้ target ของ task
- ถ้า path ไม่ชัดให้ถาม user ก่อน append
- ถ้า user ไม่ระบุ path ให้ใช้ current workspace หรือ `d:/` เป็น fallback แล้วรายงาน

### 4. Status

- ค่าเริ่มต้น `pending`
- อัปเดทเป็น `in-progress` หรือ `completed` โดย `/continue`

### 4. No Execution

- ไม่ execute request ทันที
- ถ้าผู้ใช้ต้องการทำทันที ให้ใช้ workflow อื่น

## Expected Outcome

- `d:/TODO.md` มี task ใหมท้ายตาราง
- Task มี title, description, path, status, priority, created
- ทุก task มี path ที่ชัดเจน
- พร้อมสำหรับ `/deep-plan`, `/realize-implementation`, `/update-todo-md` หรือ `/continue` ต่อ
