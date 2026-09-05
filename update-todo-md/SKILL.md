---
name: update-todo-md
description: เพิ่ม อ่าน และ enhance prompt จาก TODO.md ใน project root
argument-hint: "[add|read] [title/content]"
related:
  - deep-plan
  - productionize-implementation
  - continue
  - enhance-prompt
  - report-table
  - ask-me
---

## Goal

จัดการ `TODO.md` ใน project root — เพิ่ม task ใหม่ อ่านเนื้อหา และสร้าง enhanced prompt แบบ numbered + nested โดยไม่ทำงานเอง

## Scope

- ใช้กับ `TODO.md` ใน project root
- รองรับ 2 โหมด: `add` (เพิ่ม task) และ `read` (อ่าน + enhance prompt)
- ไม่ implement งานเอง

## Execute

### 1. Identify Action

> Goal: รู้ว่าจะ add หรือ read

1. รับ argument จาก prompt หรือ context
2. ถ้ามี `<title>` หรือ task content → โหมด `add`
3. ถ้าไม่มี title/content → โหมด `read`
4. ถ้าไม่ชัดเจน → ทำ `/ask-me`

### 2. Add New Task

> Goal: บันทึก request ลง TODO.md

1. รับ `<title>` และ request content จาก argument
2. ถ้าขาด → ถาม user
3. ตรวจสอบ title เป็น kebab-case, ไม่มีอักขระพิเศษ
4. ถ้า title ไม่ถูกต้อง → ถามใหม่หรือ normalize
5. ใช้ date ปัจจุบัน `YYYYMMDD`
6. ตรวจสอบ `TODO.md` ที่ project root:
   - ถ้าไม่มี → สร้างด้วย `# TODO` และ table header:
     ```
     | Title | Description | Status | Priority | Created |
     |---|---|---|---|---|
     ```
7. เพิ่ม row ใหม่ท้ายตาราง:
   - `| <title> | <request> | pending | medium | <date> |`
8. ถ้า request ซ้ำ title เดิม → อัปเดต description แทน append
9. ถ้าเป็น monorepo → ใส่ task ลง `TODO.md` ที่ project root เท่านั้น
10. รายงาน path `TODO.md`

### 3. Read TODO.md

> Goal: อ่าน TODO.md ปัจจุบัน

1. ใช้ `find_file_by_name` หรือ `read` เพื่อหา `TODO.md` ใน project root
2. ถ้าไม่มี → รายงานและหยุด
3. บันทึกเนื้อหาเดิมเพื่อใช้กับ `/enhance-prompt`

### 4. Enhance Prompt

> Goal: สร้าง prompt ที่อ่านง่ายและเป็นระเบียบ

1. ทำ `/enhance-prompt` โดยใช้เนื้อหาจาก `TODO.md` เป็น input
2. กำหนดรูปแบบ output:
   - numbered list หลัก `(1., 2., 3., ...)`
   - nested numbered list `(1.1, 1.2, ...)` สำหรับ sub-items
   - แต่ละข้อมี single responsibility
   - ระบุ action, expected result, condition ที่ชัดเจน
3. เก็บเนื้อหา enhanced prompt

### 5. Suggest Next Steps

> Goal: ผู้ใช้รู้ว่าจะทำต่อยังไง

1. ถ้าต้องการวางแผนละเอียด → ใช้ `/deep-plan`
2. ถ้าพร้อม implement → ใช้ `/productionize-implementation`
3. ถ้ามีหลาย task รออยู่ → ใช้ `/continue` เพื่อทำตามลำดับ

### 6. Validate And Report

> Goal: ตรวจสอบความถูกต้องและสรุปผล

1. ตรวจว่าทุก item มีเลขกำกับ
2. ตรวจว่า nested items มีเลขย่อย
3. ตรวจว่าไม่มี `` (bold markers)
4. ตรวจว่าใช้ backticks สำหรับ `tools`, `commands`, paths
5. ทำ `/report-table` สรุป action, title, status, next step

## Rules

### 1. Add Mode

- ใช้ kebab-case สำหรับ title
- ไม่มีอักขระพิเศษ
- ไม่ execute request ทันที
- ถ้าผู้ใช้ต้องการทำทันที → ใช้ workflow อื่น

### 2. Read Mode

- ไม่แก้ไข `TODO.md`
- ไม่ overwrite ไฟล์
- user เป็นผู้ตัดสินใจแก้ไข

### 3. Format

- ใช้ numbered list สำหรับ items หลัก
- ใช้ nested numbered list สำหรับ sub-items
- แต่ละ item ต้องกระชับและมี single responsibility
- ใช้ backticks สำหรับ emphasis แทน ``

### 4. Scope

- รับผิดชอบเฉพาะ `TODO.md` ที่ project root
- ถ้าต้อง implement → ใช้ `/productionize-implementation`
- ถ้าต้อง queue ใน `QUEUE.md` → ใช้ `edit` โดยตรงหรือสร้างด้วย `write`

## Expected Outcome

- `TODO.md` มี task ใหม่ถูกต้อง (add mode)
- `TODO.md` ถูกอ่านและเข้าใจ (read mode)
- Enhanced prompt เป็น numbered + nested format
- ไม่มีการแก้ไข `TODO.md` โดยไม่ได้รับอนุญาต
- รายงานพร้อม action ถัดไป
