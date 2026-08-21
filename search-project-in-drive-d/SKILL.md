---
name: search-project-in-drive-d
description: ค้นหา project ใน drive D ที่ตรงกับ keyword หรือ pattern ที่ระบุ
allowed-tools:
  - read
  - edit
  - write
  - grep
  - glob
  - exec
  - ask_user_question
triggers:
  - user
  - model
related:
  - list-project-in-drive-d
  - at-project-in-drive-d
  - report-format-table
  - ask-me
---

## Goal

ค้นหา projects ใน drive D ที่มี `.git` directory ตาม keyword หรือ pattern ที่ user ระบุ และแสดงผลในรูปแบบตาราง

## Scope

ใช้เมื่อ user ต้องการค้นหา project ที่มีชื่อหรือ path ตรงกับ keyword ใน drive D โดยไม่ต้อง list ทั้งหมด

## Execute

### 1. Get Search Criteria

ระบุ keyword หรือ pattern ที่ต้องการค้นหา

> Goal: ทราบสิ่งที่ต้องค้นหาอย่างชัดเจน

1. ถาม user สำหรับ keyword หรือ pattern ถ้ายังไม่ได้ระบุ
2. รองรับ wildcard patterns เช่น `*foo*`, `new*`, `*kub*`
3. ระบุ scope ของการค้นหา (drive D เท่านั้น)

### 2. Search Git Projects

ค้นหา projects ใน drive D ที่ตรงกับ criteria

> Goal: ได้รายการ projects ที่ตรงเงื่อนไข

1. ใช้ `Get-ChildItem -Path "D:\" -Directory -Recurse -Depth 3` เพื่อ scan directories
2. กรอง directories ที่มี `.git` ด้วย `Test-Path (Join-Path $_.FullName ".git")`
3. กรองชื่อ directory ตรงกับ pattern ด้วย `Where-Object { $_.Name -like "<pattern>" }` หรือ path matching
4. ถ้าไม่พบ ให้แจ้งว่าไม่มี project ที่ตรงกับ criteria

### 3. Format Output

จัดรูปแบบผลลัพธ์ให้อ่านง่าย

> Goal: แสดงผลในรูปแบบที่เข้าใจง่าย

1. ใช้ `report-format-table` เพื่อสร้างตาราง
2. จัดเรียง columns: No., Project Name, Path, Match Type
3. แสดง path ด้วย backticks
4. รวบรวมจำนวน matches และแสดง summary

### 4. Return Results

ส่งมอบผลการค้นหา

> Goal: user ได้รับข้อมูลครบถ้วน

1. แสดงตาราง projects ที่ตรงกับ keyword
2. แสดง summary (จำนวน projects, keyword ที่ใช้)
3. ถ้ามีหลาย matches ให้ group ตาม parent directory

## Rules

### 1. Search Criteria

- keyword เป็น `string` ที่ user ระบุ
- รองรับ wildcard `*` และ `?`
- ถ้า user ไม่ระบุ → ใช้ `ask-me` ก่อนดำเนินการ
- ค้นหาเฉพาะใน `D:\` หรือ `/mnt/d` สำหรับ WSL

### 2. Matching Logic

- เปรียบเทียบชื่อ directory กับ keyword โดยใช้ `-like` ใน PowerShell
- ถ้าต้องการ search ใน path ให้ใช้ `$_.FullName -like "*<keyword>*"`
- รองรับ case-insensitive matching โดย default
- ถ้า pattern ไม่ถูกต้อง ให้แจ้ง user และขอ criteria ใหม่

### 3. Output Format

- ใช้ numbered columns สำหรับลำดับ
- แสดง full path ด้วย backticks
- แสดง project name และ match type
- สร้าง summary table ท้ายผลลัพธ์

### 4. Safety

- ไม่เขียนหรือลบไฟล์ใดๆ ใน drive D
- ไม่เปลี่ยนแปลง state ของ project
- ใช้ read-only commands เท่านั้น (`Get-ChildItem`, `Test-Path`)

## Expected Outcome

- ได้รับรายการ projects ใน drive D ที่ตรงกับ keyword
- Output อยู่ในรูปแบบตารางที่อ่านง่าย
- ไม่มี project ขาดหรือเกินจาก criteria
- สรุปจำนวน matches และ keyword ที่ใช้
