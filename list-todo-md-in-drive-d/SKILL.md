---
name: list-todo-md-in-drive-d
description: สแกนหา TODO.md ทั้งหมดใน drive D และรายงาน summary/รายละเอียดในรูปแบบตาราง
argument-hint: "[scope]"
related:
  - update-todo-md
  - report-table
---

## Goal

สแกนหาไฟล์ `TODO.md` ทั้งหมดใน drive `D:\` และรายงานสรุปพร้อมรายการ tasks ในรูปแบบตาราง

## Scope

- ใช้กับ drive `D:\` เท่านั้น
- หาไฟล์ชื่อ `TODO.md` ทั้งหมดด้วย recursive search
- ไม่แก้ไข ไม่เพิ่ม ไม่ลบไฟล์ใด ๆ
- รองรับ checkbox รูปแบบ `- [ ]`, `- [x]`, `* [ ]`, `* [x]`, และ table รูปแบบ `| Title | Description | Status | Priority | Created |`

## Execute

### 1. Discover TODO.md Files

> Goal: หาไฟล์ `TODO.md` ทั้งหมดใน drive D

1. ใช้ `find_file_by_name` ด้วย pattern `TODO.md` ใน `D:\`
2. เก็บ absolute path ของแต่ละไฟล์
3. เรียงลำดับตาม path ก่อนอ่าน
4. ถ้า permission denied บาง directory → ข้ามและ report เป็นข้อความ warning

### 2. Read And Parse Each File

> Goal: ดึงรายการ tasks จากแต่ละ TODO.md

1. อ่านแต่ละไฟล์ `TODO.md`
2. แยกแต่ละ task:
   - รูปแบบ checkbox: `^- \[([ xX])\]\s*(.+)$` หรือ `^\* \[([ xX])\]\s*(.+)$`
     - `[ ]` → `pending`
     - `[x]`, `[X]` → `done`
   - รูปแบบ table: แถวทีมี `| Title | Description | Status | Priority | Created |` — ใช้ column `Status`
     - `pending`, `in_progress`, `done`, `completed`, `blocked` (เก็บตามตัวอักษร)
3. นับจำนวน `total`, `pending`, `done`, `blocked`

### 3. Build Summary Table

> Goal: สรุปภาพรวมของ TODO.md แต่ละไฟล์

ตารางต้องมี columns:

| No. | File | Path | Total | Pending | Done | Blocked | Summary |
|---|---|---|---|---|---|---|---|

- `Summary` แสดงชื่อ task แรก 3 รายการ (หรือน้อยกว่า) คั่นด้วย `; `
- ถ้าไฟล์ไม่มี task ให้แสดง `0` และ `Summary` เป็น `-`
- `Path` แสดง absolute path แบบย่อ `D:\...\TODO.md`

### 4. Build Detail Table

> Goal: รายละเอียด tasks ทั้งหมด

ตารางต้องมี columns:

| No. | File | Line | Status | Task |
|---|---|---|---|---|

- เรียงตาม `File` แล้วตาม `Line`
- ถ้า task มากกว่า 50 รายการ ให้แสดงเฉพาะ 50 รายการแรกและบอกว่ามีทั้งหมดกี่รายการ

### 5. Report

> Goal: แสดงผลใน chat

1. แสดง summary table ก่อน
2. แสดง detail table ต่อ
3. ถ้าไม่พบไฟล์ `TODO.md` เลย ให้รายงานว่า "ไม่พบไฟล์ TODO.md ใน drive D:\"
4. ใช้ภาษาไทยสำหรับคำอธิบาย แต่เก็บ text ของ task ต้นฉบับ

## Rules

### 1. Read Only

- ไม่แก้ไข ไม่ลบ ไม่เพิ่มไฟล์ `TODO.md`
- ถ้าต้องการ update → ใช้ `/update-todo-md`

### 2. Path Format

- ใช้ absolute path ใน drive D (เช่น `D:\project\TODO.md`)
- ไม่แปลงเป็น relative path

### 3. Status Mapping

- `- [ ]` หรือ `* [ ]` → `pending`
- `- [x]`, `- [X]`, `* [x]`, `* [X]` → `done`
- table status ใช้ค่าจาก column `Status` โดยตรง
- ไม่เดา status ถ้าไม่ชัดเจน

### 4. Output Limit

- Summary table แสดงทุกไฟล์
- Detail table แสดงสูงสุด 50 รายการแรก ถ้าเกินให้บอก total
- ใช้ `/report-table` ถ้าจำเป็นต้องสรุป

## Expected Outcome

- ตารางสรุปจำนวน `TODO.md` ใน drive D พร้อม counts
- ตารางรายละเอียด tasks ทั้งหมด
- ไม่มีการแก้ไขไฟล์ใด ๆ
