---
name: at-project-in-drive-d
description: List projects ใน drive D ที่มี .git directory และจัดรูปแบบเป็นตาราง
allowed-tools:
  - read
  - edit
  - grep
  - glob
  - exec
triggers:
  - user
  - model
---

## Goal

## Goal

List projects ทั้งหมดใน drive D ที่มี `.git` directory และจัดรูปแบบเป็นตารางตามมาตรฐาน

## Scope

Use `at-project-in-drive-d` for the specific tasks and workflows it covers

## Execute

## Execute

### 1. Run PowerShell Command

1. Run PowerShell command เพื่อ list projects
2. Filter เฉพาะ directories ที่มี `.git`
3. รวบรวมข้อมูล projects ทั้งหมด

### 2. Group and Sort Projects

1. จัดกลุ่ม projects ตาม directory (forked, newkub, saas)
2. เรียงลำดับ projects ภายในกลุ่มตามชื่อ
3. กำหนด category สำหรับแต่ละ project

### 3. Format Table

1. สร้างตารางตามมาตรฐาน `/report-format-table`
2. ใช้ numbered columns สำหรับลำดับ
3. ใช้ bold headers และ backticks สำหรับ paths
4. จัดเรียง columns: No., Project Name, Path, Category

### 4. Create Summary Table

1. สร้าง summary table สำหรับ category counts
2. คำนวณ percentage สำหรับแต่ละ category
3. แสดง total projects และ total categories

## Rules

## Rules

### 1. Git Detection

ตรวจสอบว่า directory เป็น git repository:

- ตรวจสอบ `.git` directory
- ใช้ `Test-Path` สำหรับ `.git`
- Filter เฉพาน directories ที่มี `.git`

### 2. Path Filtering

Filter เฉพาน projects ใน drive D:

- Search เฉพาะใน `d:\` หรือ `D:\`
- ใช้ `Get-ChildItem` กับ `-Recurse -Depth 3`
- Exclude hidden directories

### 3. Table Structure

โครงสร้างตารางที่ต้องใช้:

- ใช้ numbered columns สำหรับลำดับที่ชัดเจน
- ใช้ bold headers สำหรับแต่ละ column
- จัดเรียง columns: No., Project Name, Path, Category
- ใช้ backticks สำหรับ paths

### 4. Grouping and Sorting

การจัดกลุ่มและเรียงลำดับข้อมูล:

- จัดกลุ่ม projects ตาม directory หลัก
- ใช้ headers สำหรับ grouping
- เรียงลำดับภายในกลุ่มตามชื่อ
- ใช้ separators สำหรับแยกกลุ่มที่ชัดเจน

### 5. Summary Table

ตารางสรุป:

- แสดง category counts
- คำนวณ percentage
- แสดง total projects และ categories
- ใช้ symbols (✅) สำหรับ summary

## Expected Outcome

## Expected Outcome

- ตาราง projects ที่มีโครงสร้างสอดคล้อง
- Content ที่จัดรูปแบบอย่างชัดเจน
- ตารางที่อ่านง่ายบนทุก device
- Grouping และ sorting ที่เป็นระบบ
- Summary table พร้อม counts และ percentages
