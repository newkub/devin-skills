---
name: add-to-queue
description: รับ request จากผู้ใช้ และเพิ่มลง QUEUE.md ใน project root พร้อมชี้แนะ next step
argument-hint: "[task]"
---

## Goal

รับ request จากผู้ใช้ และเพิ่มลง `QUEUE.md` ใน project root พร้อมชี้แนะให้ deep-plan หรือ implement ต่อได้

## Scope

- ใช้กับทุก request ที่ผู้ใช้ต้องการคัดแยกหรือจัดคิว
- บันทึก request ดิบลง `QUEUE.md`
- ไม่ execute ทันที

## Execute

### 1. Capture Request

> Goal: มี title และ request ที่ชัดเจน

1. รับ `<title>` และ request content จาก argument
2. ถ้าขาด ให้ถาม user
3. ตรวจสอบ title เป็น kebab-case, ไม่มีอักขระพิเศษ
4. ถ้า title ไม่ถูกต้อง ให้ถามใหม่หรือ normalize

### 2. Append To QUEUE.md

> Goal: บันทึก request ลงไฟล์ queue เดียว

1. ใช้ date ปัจจุบัน `YYYYMMDD`
2. ตรวจสอบ `QUEUE.md` ที่ project root:
   - ถ้าไม่มี → สร้างด้วย `# QUEUE` และ table header:
     ```
     | Title | Description | Status | Priority | Created |
     |---|---|---|---|---|
     ```
3. เพิ่ม row ใหม่ท้ายตาราง:
   - `| <title> | <request> | pending | medium | <date> |`
4. ถ้า request ซ้ำ title เดิม → อัปเดท description แทน append
5. รายงาน path `QUEUE.md`

### 3. Suggest Next Steps

> Goal: ผู้ใช้รู้ว่าจะทำต่อยังไง

1. ถ้าต้องการวางแผนละเอียด → ใช้ `/deep-plan`
2. ถ้าพร้อม implement → ใช้ `/realize-implementation` หรือ `/implement-queue-md`
3. ถ้ามีหลาย request รออยู่ → ใช้ `/implement-queue-md`

## Rules

### 1. Title

- ใช้ kebab-case
- ไม่มีอักขระพิเศษ
- สั้นและจำง่าย

### 2. File Location

- ต้องอยู่ใน `QUEUE.md` ที่ project root
- ไม่สร้างไฟล์ย่อยใน `.devin/request-queue/`

### 3. Status

- ค่าเริ่มต้น `pending`
- อัปเดทเป้น `in-progress` หรือ `completed` โดย `/implement-queue-md`

### 4. No Execution

- ไม่ execute request ทันที
- ถ้าผู้ใช้ต้องการทำทันที ให้ใช้ workflow อื่น

## Expected Outcome

- `QUEUE.md` มี request ใหมท้ายตาราง
- Request มี title, description, status, priority, created
- พร้อมสำหรับ `/deep-plan`, `/realize-implementation`, หรือ `/implement-queue-md` ต่อ