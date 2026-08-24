---
name: list-github-gist
description: แสดงรายการ GitHub gists ของผู้ใช้
allowed-tools:
  - exec
  - ask_user_question
triggers:
  - user
related:
argument-hint: [--limit <n>] [--public|--secret]
---

## Goal

แสดงรายการ gists ของผู้ใช้บน GitHub

## Scope

- ใช้ `gh gist list` เท่านั้น
- รองรับ limit
- ไม่แก้ไข gist

## Execute

### 1. Verify Authentication
> Goal: ยืนยันว่า `gh` login แล้ว

1. รัน `gh auth status`
2. ถ้าไม่ login ให้หยุดและแจ้งให้ทำ `gh auth login`

### 2. List Gists
> Goal: ได้รายการ gists

1. รับ `--limit` จาก argument (ค่าเริ่มต้น 30)
2. รัน `gh gist list --limit <limit>`
3. บันทึก output สำหรับ format

### 3. Format Output
> Goal: แสดงผลในรูปแบบอ่านง่าย

1. ทำ `/report-table` เพื่อจัดรูปแบบ
2. แสดง columns: ID, Description, Visibility, Updated, URL

## Rules

### 1. Output

- ใช้ `/report-table` ถ้ามีข้อมูลมาก
- หรือแสดงเป็น markdown table ก็ได้
- เรียงตาม updated ล่าสุด (default จาก `gh gist list`)

### 2. Pagination

- ถ้ามีมากกว่า limit ให้แจ้ง user ให้เพิ่ม limit

### 3. Safety

- ไม่ลบหรือแก้ไข gist จาก list
- ถ้าต้องการแก้ไขให้ใช้ `gh gist edit`

## Expected Outcome

- รายการ gists ของผู้ใช้
- จัดรูปแบบอ่านง่าย
- URL สำหรับเปิดแต่ละ gist
