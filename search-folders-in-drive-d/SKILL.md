---
name: search-folders-in-drive-d
description: ค้นหาโฟลเดอร์ใน drive D ด้วย fd ตาม keyword หรือ pattern ที่ระบุ
argument-hint: "[keyword]"
allowed-tools: exec
related:
  - search-project-in-drive-d
  - follow-tool-my-global-cli
---

## Goal

ค้นหา directories ใน `D:\` ตาม keyword หรือ pattern ด้วย `fd` และแสดงผลในรูปแบบตาราง

## Scope

ใช้เมื่อต้องการค้นหา folder path ใน drive D โดยใช้ `fd` เป็น default tool ถ้าไม่มีจึง fallback ไป PowerShell

## Execute

### 1. Get Search Criteria

> Goal: ระบุ keyword และ scope การค้นหา

1. ถ้ายังไม่มี keyword ให้ถาม user ด้วย `ask-me`
2. รองรับ regex patterns ของ `fd` เช่น `foo`, `.*bar.*`, `^new`
3. ระบุ scope เป็น `D:\` เท่านั้น

### 2. Verify fd Tool

> Goal: ตรวจสอบว่า `fd` พร้อมใช้งาน

1. รัน `Get-Command fd` หรือ `where fd` เพื่อตรวจสอบ
2. ถ้าไม่มี `fd` ให้ fallback ไป `Get-ChildItem -Path "D:\" -Directory -Recurse`
3. ถ้าติดตั้ง `mise` หรือ `scoop` อยู่ แนะนำให้ติดตั้ง `fd` ด้วย `mise use -g fd` หรือ `scoop install fd`

### 3. Search Folders

> Goal: ค้นหา directories ใน drive D

1. รัน `fd --type directory <keyword> "D:\"` หรือ `fd -t d <keyword> "D:\"`
2. ถ้า keyword มี space ให้ใส่ quotes
3. ถ้าต้องการ match ทั้ง path ให้เติม `--full-path` หรือ `-p`
4. รับผลลัพธ์เป็น list ของ full paths

### 4. Format Output

> Goal: จัดรูปแบบผลลัพธ์ให้อ่านง่าย

1. ใช้ `report-table` สร้างตาราง
2. Columns: No., Folder Name, Full Path
3. แสดง full path ด้วย backticks
4. รวบรวมจำนวน matches

### 5. Return Results

> Goal: ส่งมอบผลการค้นหา

1. แสดงตาราง folders ที่ตรงกับ keyword
2. แสดง summary (จำนวน matches, keyword, tool ที่ใช้)
3. ถ้าไม่พบ ให้แจ้ง user

## Rules

### 1. Search Criteria

- keyword เป็น `string` ที่ user ระบุ
- รองรับ regex patterns ตาม syntax ของ `fd` โดย default
- ถ้าต้องการ glob ให้เติม `--glob`
- ถ้า user ไม่ระบุ → ใช้ `ask-me`
- ค้นหาเฉพาะใน `D:\` เท่านั้น

### 2. Tool Usage

- ใช้ `fd --type directory` เป็น default
- ถ้าไม่มี `fd` ให้ fallback ไป `Get-ChildItem`
- ใช้ `fd --full-path` เมื่อต้องการ match ทั้ง path

### 3. Output Format

- ใช้ numbered columns
- แสดง full path ด้วย backticks
- สรุปจำนวน matches และ keyword

### 4. Safety

- ไม่เขียนหรือลบไฟล์/โฟลเดอร์ใดๆ
- ใช้ read-only commands เท่านั้น

## Expected Outcome

- ได้รายการ directories ใน drive D ที่ตรงกับ keyword
- Output อยู่ในรูปแบบตารางที่อ่านง่าย
- ไม่มี folder ขาดหรือเกินจาก criteria
- สรุปจำนวน matches และ keyword
