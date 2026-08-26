---
name: list-todo-in-drive-d
description: รายการ tasks ทั้งหมดจาก TODO.md บน drive D พร้อม filter ตาม status/keyword
argument-hint: "[filter]"
related:
  - add-to-todo-in-drive-d
  - list-project-task
  - update-todo-md
---

## Goal

รายการ tasks ทั้งหมดจาก `d:/TODO.md` บน drive D ในรูปแบบตาราง พร้อม filter ตาม status หรือ keyword

## Scope

- ใช้เมื่อ user ต้องการดู task ค้างหรือ filter งานใน `d:/TODO.md`
- อ่านอย่างเดียว ไม่แก้ไขไฟล์
- รองรับ filter ตาม `status` และ `keyword`

## Execute

### 1. Check Source

> Goal: ตรวจสอบว่าไฟล์มีอยู่

1. ตรวจสอบ `d:/TODO.md`
2. ถ้าไม่มี → แจ้ง user และ stop
3. ถ้ามี → อ่านเนื้อหาทั้งหมด

### 2. Parse Tasks

> Goal: แยกรายการจากตาราง

1. จับคู่ rows ที่อยู่ในตาราง (บรรทัดที่ขึ้นต้นด้วย `|`)
2. ข้าม header rows
3. แยกคอลัมน์: Title, Description, Status, Priority, Created
4. ถ้า row ไม่ครบ ให้ระบุ `invalid` เป็น note

### 3. Apply Filter

> Goal: แสดงเฉพาะ tasks ที่ตรงกับ filter

1. ถ้า filter คือ status (เช่น `pending`, `in-progress`, `completed`) → กรองตามคอลัมน์ Status
2. ถ้า filter เป็น keyword → กรอง Title หรือ Description ที่มี keyword
3. ถ้าไม่มี filter → แสดงทั้งหมด
4. ถ้าไม่พบ → แสดงรายงานว่าง

### 4. Report

> Goal: แสดงผลให้อ่านง่าย

1. สร้างตาราง: No., Title, Description, Status, Priority, Created
2. เรียงตาม Created (ใหม่สุดไว้ล่าง) หรือตาม Status
3. สรุปจำนวน tasks ทั้งหมด แยกตาม status
4. ระบุ source path `d:/TODO.md`

## Rules

### 1. Read Only

- ไม่แก้ไข, เพิ่ม หรือลบ tasks
- ถ้าต้องการ update → ใช้ `/update-todo-md` หรือ `/add-to-todo-in-drive-d`

### 2. Filter Logic

- filter เป็น optional
- ค้นหา case-insensitive
- ถ้า filter ไม่ชัด → ถาม user ว่าเป็น status หรือ keyword

### 3. Output

- แสดงผลเป็นตาราง
- ระบุจำนวน tasks แต่ละ status
- ไม่เดา status ถ้าไม่ชัด

## Expected Outcome

- ตาราง tasks จาก `d:/TODO.md` พร้อม status
- กรองตาม filter ถ้ามี
- ไม่มีการเปลี่ยนแปลงไฟล์
