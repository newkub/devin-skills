---
name: save-to-todo-in-root-drive-d
description: บันทึกงานค้าง/idea จาก session ลง TODO.md ที่ root ของ drive D
argument-hint: "[todo-title]"
related:
  - enhance-prompt
  - list-todo-md-in-drive-d
  - update-todo-md
  - continue
---

## Goal

บันทึก todo item ลง `D:\TODO.md` โดย enhance prompt เป็น numbered list ตาม single responsibility ก่อนบันทึก

## Scope

- ใช้เมื่องานค้างจาก session จะจบ ต้องการเก็บลง drive-level TODO
- รับ input จาก argument หรือถาม user
- ใช้ `/enhance-prompt` เพื่อสรุป prompt ก่อนบันทึก

## Execute

### 1. Receive Todo

> Goal: รับ todo/idea จาก user

1. รับ input จาก argument หรือถาม user
2. ถ้า input เป้น file path ให้อ่านเนื้อหา
3. ระบุ title สำหรับ todo จาก argument หรือสรุปจากเนื้อหา

### 2. Enhance Prompt

> Goal: แยก todo ออกเป้น numbered list ตาม single responsibility

1. เรียก `/enhance-prompt` กับเนื้อหาท่ีได้รับ
2. ได้รับ numbered list ท่ีแต่ละข้อมี single responsibility
3. บันทึกเนื้อหาท่ี enhance แล้ว

### 3. Check And Prepare Root TODO

> Goal: ไม่สร้างซ้ำถ้ามี title เดียวกัน

1. ตรวจ `D:\TODO.md`
2. ถ้าไม่มี → สร้างด้วย header `# TODO` และ table:
   ```
   | No. | Title | Description | Status | Priority | Created |
   |---|---|---|---|---|---|
   ```
3. ถ้ามี → ค้นหา title ซ้ำ ถ้าพบ → แจ้ง user และ stop

### 4. Create Todo Entry

> Goal: บันทึก todo ลง root TODO file

1. กำหนด priority เป็น `medium` ถ้าไม่ระบุ
2. เพิ่ม row ใหม่ท้ายตาราง:
   - `| <no> | <title> | <enhanced description> | pending | <priority> | <YYYYMMDD> |`
3. บันทึกไฟล์ `D:\TODO.md`

### 5. Report

> Goal: แสดงผล path และ summary

1. ทำ `/report-table` สรุป items ท่ีเพิ่ม
2. รายงาน path `D:\TODO.md`

## Rules

### 1. Title

- title ต้องกระชับและ unique ใน `D:\TODO.md`
- ถ้าไม่ระบุให้ถามหรือสรุปจากเนื้อหา
- ใช้เป้น filename/identifier เช่น `<title>`

### 2. Duplicate Check

- ตรวจ todo ท่ีมีอยู่ก่อนบันทึก
- ถ้าพบ title ซ้ำ → แจ้ง user แทนการ append ซ้ำ

### 3. Safety

- ไม่บันทึกไฟล์ท่ีมี secrets หรือ credentials
- ถ้าไฟล์ใหญ่เกิน 1 MB ให้แจ้ง user

### 4. Related Skills

- ใช้ `/list-todo-md-in-drive-d` ถ้าจำเป็นตรวจสอบ TODO.md ทั้งหมดใน drive D
- ใช้ `/update-todo-md` ถ้าต้องการอัปเดต status
- ใช้ `/continue` ถ้าพร้อม implement

## Expected Outcome

- Todo item ถูกบันทึกใน `D:\TODO.md`
- เนื้อหาเป้น numbered list ท่ีผ่าน `/enhance-prompt`
- ไม่สร้างซ้ำถ้ามี title เดียวกันอยู่แล้ว
