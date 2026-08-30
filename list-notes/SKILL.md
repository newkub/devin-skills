---
name: list-notes
description: แสดงรายการ notes ใน repo D:\newkub\notes
argument-hint: "[--limit N]"
related:
  - save-to-notes-idea
  - save-to-new-notes
  - implement-from-notes-idea
  - report-table
---

## Goal

แสดงรายการ notes ท่ีมีอยู่ใน `D:\newkub\notes` พร้อมสรุปเนื้อหา

## Scope

- อ่านไฟล์ `.md` จาก `D:\newkub\notes`
- รองรับ limit
- ไม่แก้ไข note

## Execute

### 1. Verify Notes Repo

> Goal: ตรวจสอบ repo เป้นไปตามทีกำหนด

1. ตรวจ `D:\newkub\notes` ต้องมี `README.md`
2. ถ้าไม่มี ให้แจ้งให้สร้าง repo ก่อน

### 2. List Notes

> Goal: ดึงรายการ notes

1. รับ `--limit` จาก argument (ค่าเริ่มต้น 30)
2. หาไฟล์ `*.md` ใน `D:\newkub\notes` เรียงตาม `LastWriteTime` ล่าสุด
3. อ่านบรรทัดแรกเป็น title

### 3. Fetch Summaries

> Goal: สรุปเนื้อหาแต่ละ note

1. นับจำนวนหัวข้อ / บรรทัดสำคัญ
2. เก็บ path ใน repo

### 4. Format Output

> Goal: แสดงผลรูปแบบอ่านง่าย

1. ทำ `/report-table`
2. คอลัมน์: File, Title, Updated, URL
3. URL ใช้ `https://github.com/newkub/notes/blob/main/<file>`

## Rules

### 1. Output

- ใช้ `/report-table` ถ้ามีข้อมูลมาก
- เรียงตาม updated ล่าสุด

### 2. Pagination

- ถ้ามากกว่า limit ให้แจ้ง user ให้เพิ่ม limit

### 3. Safety

- ไม่ลบหรือแก้ไข note จาก list

### 4. Empty State

- ถ้าไม่พบ note ให้เสนอใช้ `/save-to-notes-idea`

## Expected Outcome

- รายการ notes
- สรุปเนื้อหาแต่ละ note
- URL สำหรับเปิดแต่ละ note
