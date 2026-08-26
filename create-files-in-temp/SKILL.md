---
name: create-files-in-temp
description: สร้างไฟล์หรือ directory ชั่วคราวใน OS temp directory
---

## Goal

สร้างไฟล์หรือ directory ชั่วคราวใน OS temp directory (`%TEMP%` บน Windows, `/tmp` บน Unix) โดยไม่กระทบ project

## Scope

ใช้เมื่อต้องการสร้างไฟล์ทดสอบ, scratch files, หรือ temporary output ที่ไม่จำเป็นต้องอยู่ใน workspace ถาวร

## Execute

### 1. Determine Temp Path

> Goal: ระบุ OS temp directory

1. บน Windows: ใช้ `$env:TEMP` หรือ `%TEMP%`
2. บน macOS/Linux: ใช้ `$TMPDIR` หรือ `/tmp`
3. สร้าง sub-directory สำหรับ task ถ้าจำเป็น เช่น `temp-<project>-<timestamp>/`
4. ระบุ path สมบูรณ์สำหรับ output

### 2. Create Temp Files

> Goal: สร้างไฟล์หรือ directory ตามต้องการ

1. สร้าง directory ด้วย `New-Item -ItemType Directory -Path <path>` หรือ `mkdir -p <path>`
2. สร้างไฟล์ด้วย `write` หรือ `New-Item -ItemType File -Path <path>`
3. ใช้ชื่อไฟล์ที่สื่อความหมาย พร้อม prefix หรือ suffix ที่บ่งบอกว่าเป็น temp
4. ถ้าต้องการหลายไฟล์ → สร้างใน temp directory เดียวกัน

### 3. Use Temp Files

> Goal: ใช้งานไฟล์ชั่วคราว

1. ใช้ absolute path อ้างอิง temp file
2. ถ้าใช้กับ external tools → ส่ง path เป็น argument
3. ถ้าต้องการเก็บไฟล์ไว้ก่อน cleanup → คัดลอกไปยัง workspace ก่อน
4. ไม่สร้าง sensitive data ใน temp โดยไม่มีการป้องกัน

### 4. Cleanup

> Goal: ลบ temp files เมื่องานเสร็จ

1. ถ้าไฟล์ไม่จำเป็นแล้ว → ลบด้วย `Remove-Item -Recurse <path>` หรือ `rm -rf <path>`
2. ถ้า user ต้องการเก็บ → คัดลอกไปยัง workspace ก่อนลบ
3. ตรวจสอบว่า temp directory ไม่มี leftovers ที่ไม่ได้ใช้

## Rules

### 1. Temp Only

- สร้างใน OS temp directory เท่านั้น
- ไม่สร้างใน project root โดยไม่จำเป็น
- ไม่เขียนทับไฟล์ของ user ใน temp โดยไม่แจ้ง

### 2. Naming

- ใช้ prefix หรือ suffix เช่น `devin-temp-`, `-tmp`
- ระบุ timestamp ถ้ามีหลายรอบ
- ชื่อไฟล์ไม่มี space หรือ special characters ทีทำให้ command ผิดพลาด

### 3. Security

- ไม่ expose secrets ใน temp files
- ถ้ามี sensitive data → ลบทันทีหลังใช้งาน
- ไม่สร้าง temp files ใน shared temp ทีอ่านได้โดยทั้วไปถ้าเป็นเรื่อง sensitive

## Expected Outcome

- ไฟล์หรือ directory ชั่วคราวถูกสร้างใน OS temp
- Absolute path ของ temp files ถูกต้อง
- ใช้งานไฟล์ได้ตามต้องการ
- ไฟล์ถูก cleanup หรือเก็บกลับ workspace ตามที่ตกลง
