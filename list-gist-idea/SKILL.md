---
name: list-gist-idea
description: แสดงรายการ gist idea notes ของผู้ใช้
argument-hint: "[--limit N]"
related:
  - save-to-gist-idea
  - implement-from-gist-idea
  - list-gist
  - report-table
---

## Goal

แสดงรายการ gist idea notes ที่มี่อยู่และสรุปเนื้อหา

## Scope

- ใช้ `gh gist list` เท่านั้น
- กรองเฉพาะ gist ที่เป็น idea note (description/filename มี่คำว่า idea)
- รองรับ limit
- ไม่แก้ไข gist

## Execute

### 1. Verify Authentication

> Goal: ยืนยัน `gh` login

1. รัน `gh auth status`
2. ถ้าไม่ login ให้หยุดและแจ้งให้ทำ `gh auth login`

### 2. List Gist Ideas

> Goal: ดึงรายการ gist ideas

1. รับ `--limit` จาก argument (ค่าเริ่มต้น 30)
2. รัน `gh gist list --limit <limit>`
3. กรอง gist ที่ description หรือ filename มี่ `idea` (case-insensitive)

### 3. Fetch Summaries

> Goal: สรุปเนื้อหาภายในแต่ละ gist idea

1. สำหรับแต่ละ gist idea → ใช้ `gh gist view <id> --files` หรือ `gh gist view <id>`
2. สรุปจำนวน items / หัวข้อหลัก
3. เก็บ URL แต่ละ gist

### 4. Format Output

> Goal: แสดงผลรูปแบบอ่านง่าย

1. ทำ `/report-table`
2. คอลัมน์: ID, Title, Description, Visibility, Items, Updated, URL
3. เรียงตาม updated ล่าสุด

## Rules

### 1. Output

- ใช้ `/report-table` ถ้ามี่ข้อมูลมาก
- หรือแสดงเป็น markdown table ก็ได้
- เรียงตาม updated ล่าสุด

### 2. Pagination

- ถ้ามี่มากกว่า limit ให้แจ้ง user ให้เพิ่ม limit

### 3. Safety

- ไม่ลบหรือแก้ไข gist จาก list
- ถ้าต้องการแก้ไขให้ใช้ `gh gist edit`

### 4. Empty State

- ถ้าไม่พบ gist idea → แจ้ง user
- เสนอให้ใช้ `/save-to-gist-idea` เพื่อสร้างใหม่

## Expected Outcome

- รายการ gist idea notes
- สรุปเนื้อหาภายในแต่ละ gist
- URL สำหรับเปิดแต่ละ gist