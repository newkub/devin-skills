---
name: list-todo-md
description: สแกนหา TODO.md ทั้งหมดใน workspace หรือ path/drive ทีระบุ แล้วรายงาน summary/รายละเอียดเป็นตาราง
argument-hint: "[path | --drive]"
related:
  - update-todo-md
  - report-table
---

## Goal

สแกนหาไฟล์ `TODO.md` ทั้งหมดใน current workspace และรายงานสรุปพร้อมรายการ tasks ในรูปแบบตาราง

## Scope

- default: current workspace — ถ้าระบุ `path` หรือ `--drive` → สแกน path/drive นั้น (เช่น `D:\`)
- หาไฟล์ชื่อ `TODO.md` ทั้งหมดแบบ recursive
- ไม่แก้ไข ไม่เพิ่ม ไม่ลบไฟล์ใด ๆ
- รองรับ checkbox รูปแบบ `- [ ]`, `- [x]`, `* [ ]`, `* [x]` และ table รูปแบบ `| Title | Description | Status | Priority | Created |`

## Execute

### 1. Discover TODO.md Files

> Goal: หาไฟล์ `TODO.md` ทั้งหมดใน scope ทีเลือก

1. ถ้าระบุ `--drive` → scope คือ `D:\`; ถ้าระบุ `path` → scope คือ path นั้น; ไม่ระบุ → current workspace
2. ใช้ `find_file_by_name` ด้วย pattern `TODO.md` ใน scope ทีเลือก
3. เก็บ relative path (ใน workspace) หรือ absolute path (นอก workspace) ของแต่ละไฟล์
4. เรียงลำดับตาม path ก่อนอ่าน
5. ถ้า permission denied บาง directory → ข้ามและ report เป็น warning

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

| No. | File | Total | Pending | Done | Summary |
|-----|------|-------|---------|------|---------|

- `Summary` แสดงชื่อ task แรก 3 รายการ (หรือน้อยกว่า) คั่นด้วย `; `
- ถ้าไฟล์ไม่มี checkbox ให้แสดง `0` และ `Summary` เป็น `-`

### 4. Build Detail Table

> Goal: รายละเอียด tasks ทั้งหมด

ตารางต้องมี columns:

| No. | File | Line | Status | Task |
|-----|------|------|--------|------|

- เรียงตาม `File` แล้วตาม `Line`
- ถ้า task มากกว่า 50 รายการ ให้แสดงเฉพาะ 50 รายการแรกและบอกว่ามีทั้งหมดกี่รายการ

### 5. Report

> Goal: แสดงผลใน chat

1. แสดง summary table ก่อน
2. แสดง detail table ต่อ
3. ถ้าไม่พบไฟล์ `TODO.md` เลย ให้รายงานว่า "ไม่พบไฟล์ TODO.md ใน <scope> นี้"
4. ใช้ภาษาไทยสำหรับคำอธิบาย แต่เก็บ text ของ task ต้นฉบับ

## Rules

### 1. Read Only

- ไม่แก้ไข ไม่ลบ ไม่เพิ่มไฟล์ `TODO.md`
- ถ้าต้องการ update → ใช้ `/update-todo-md`

### 2. Path Format

- ใช้ relative path จาก current workspace root
- ใช้ absolute path สำหรับ scope นอก workspace (เช่น `D:\project\TODO.md`)

### 3. Status Mapping

- `- [ ]` หรือ `* [ ]` → `pending`
- `- [x]`, `- [X]`, `* [x]`, `* [X]` → `done`
- ไม่เดา status ถ้า checkbox ไม่ชัดเจน

### 4. Output Limit

- Summary table แสดงทุกไฟล์
- Detail table แสดงสูงสุด 50 รายการแรก ถ้าเกินให้บอก total

- ใช้ /report-table ถ้าจำเป็น

## Expected Outcome

- ตารางสรุปจำนวน `TODO.md` ใน scope พร้อม counts
- ตารางรายละเอียด tasks ทั้งหมด
- ไม่มีการแก้ไขไฟล์ใด ๆ

- รวม capability จาก skills เดิมที่ถูก merge เข้าตัวนี้ (merged from: list-todo-md-in-drive-d)
