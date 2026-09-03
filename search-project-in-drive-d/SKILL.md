---
name: search-project-in-drive-d
description: ค้นหา project ใน drive D ที่ตรงกับ keyword หรือ pattern
argument-hint: "[keyword]"
related:
  - ask-me
  - report-table
---

## Goal

ค้นหา git projects ใน `D:\` ที่ตรงกับ keyword หรือ pattern ที่ user ระบุ แล้วแสดงผลเป็นตาราง

## Scope

ใช้เมื่อ user ต้องการค้นหา project บน drive D โดยไม่ต้อง list ทั้งหมด

## Execute

### 1. รับ Search Criteria

> Goal: ค้นหา Criteria
1. ถ้า user ไม่ได้ระบุ keyword → ใช้ `/ask-me` ถาม
2. รองรับ wildcard `*` และ `?`
3. scope ค้นหาคือ `D:\` เท่านั้น

### 2. ค้นหา Git Projects

> Goal: ค้นหา Git Projects
รัน PowerShell command:

```powershell
Get-ChildItem -Path "D:\" -Directory -Recurse -Depth 3 |
  Where-Object { $_.Name -like "<keyword>" -and (Test-Path (Join-Path $_.FullName ".git")) }
```

- ถ้า keyword ต้องการ match ทั่ง path ให้ใช้ `$_.FullName -like "*<keyword>*"`
- matching แบบ case-insensitive โดย default
- ถ้า pattern ไม่ถูกต้อง → แจ้ง user และขอ keyword ใหม่

### 3. แสดงผล

> Goal: แสดงผล
1. ใช้ `/report-table` สร้างตาราง
2. columns: `No.`, `Project Name`, `Path`, `Match Type`
3. เรียง `No.` ลำดับ 1, 2, 3, ...
4. path ใส่ backticks
5. สรุปจำนวน matches และ keyword ที่ใช้

## Rules

- อ่านอย่างเดียว ไม่เขียน ไม่ลบ ไม่เปลี่ยน state project
- ค้นหาเฉพาะ `D:\` หรือ `/mnt/d` สำหรับ WSL
- ถ้าไม่พบ → แจ้งว่าไม่มี project ที่ตรงกับ criteria

## Expected Outcome

- ได้ตารางรายการ git projects ใน `D:\` ที่ตรงกับ keyword
- ไม่มี project ขาดหรือเกินจาก criteria
- สรุปจำนวน matches และ keyword ที่ใช้
