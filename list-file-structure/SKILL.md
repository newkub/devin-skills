---
name: list-file-structure
description: แสดงโครงสร้างไฟล์และโฟลเดอร์ของ project ในรูปแบบ tree โดยยกเว้นไฟล์ระบบและ build artifacts
argument-hint: "<path> [--depth=N] [--include=pattern] [--exclude=pattern]"
allowed-tools:
  - exec
  - read
  - find_file_by_name
  - ask_user_question
  - todo_write
triggers:
  - user
  - model
related:
  - view-files
  - report-file-structure
  - scan-codebase
  - search-files-patterns
---

## Goal

แสดงโครงสร้างไฟล์และโฟลเดอร์ของ project หรือ directory ทีระบุ ในรูปแบบ tree อ่านง่าย โดยกรองไฟล์ระบบและ build artifacts ออก

## Scope

ใช้เมื่อต้องการดูภาพรวม directory structure ของ project หรือโฟลเดอร์ย่อย รองรับการกำหนด depth, include/exclude pattern

ดูเพิ่มเติม: /view-files, /report-file-structure, /scan-codebase, /search-files-patterns

## Execute

### 1. Parse Input

> Goal: Parse Input
1. รับ `path` จาก argument
2. ถ้าไม่ระบุ path ให้ถาม user
3. รับ optional flags:
   - `--depth=N` จำกัดความลึกของ tree
   - `--include=pattern` แสดงเฉพาะ path ทีตรง pattern
   - `--exclude=pattern` ยกเว้น path ทีตรง pattern
4. ถ้า path ไม่อยู่ใน workspace ให้ถามก่อน

### 2. Resolve Path

> Goal: แก้ไข Path
1. ตรวจสอบว่า `path` มีอยู่จริง
2. ถ้าเป้น relative path ให้ resolve จาก current working directory
3. ถ้าเป้น project ชื่อเดียว เช่น `solid-ui` ให้ลองหาที่ `D:\newkub\solid-ui` ก่อน
4. ถ้าไม่พบ ให้ค้นหาใน `D:\`

### 3. Build Tree

> Goal: สร้าง Tree
1. ใช้ PowerShell `Get-ChildItem` หรือ `tree` สร้าง tree
2. ยกเว้นโฟลเดอร์เริ่มต้น:
   - `node_modules`
   - `dist`
   - `.wrangler`
   - `.bun`
   - `.cache`
   - `.vite`
   - `.vite-temp`
   - `.git`
   - `coverage`
   - `.next`
   - `.nuxt`
   - `.output`
   - `tmp`
   - `temp`
3. ยกเว้นตาม `--exclude` ที user ระบุเพิ่ม
4. ถ้ามี `--depth` ให้จำกัดความลึก
5. ถ้ามี `--include` ให้แสดงเฉพาะไฟล์/โฟลเดอร์ทีตรง pattern

### 4. Format Output

> Goal: Format Output
1. แสดงผลเป็น tree ด้วย indentation `  ` สองช่อง
2. แยกไฟล์และโฟลเดอร์ให้ดูง่าย
3. ถ้า output ยาวมาก ให้ summary โครงสร้างหลักก่อน แล้วถาม user ว่าต้องการ expand ส่วนไหน
4. ถ้า tree มีมากกว่า 100 รายการ ให้หั่นเป็นหมวดหมู่หรือใช้ depth น้อยลง

### 5. Report

> Goal: รายงาน Report
1. ระบุ root path ทีใช้
2. ระบุจำนวน directories และ files (ถ้าตรวจนับได้)
3. ระบุ patterns ทีถูก exclude
4. ถ้ามีบางส่วนถูกตัด ให้บอก user

## Rules

- ไม่แกะ `node_modules`, `dist`, build artifacts, cache โดย default
- ถ้า user ระบุ `--include` ให้นำมาก่อน `--exclude`
- ถ้า path ไม่อยู่ใน workspace ให้ถามก่อนลงมือ
- ไม่แก้ไขไฟล์ใด ๆ ทั้งสิ้น
- ถ้า output ยาวเกิน ให้ย่อหรือแบ่งส่วน
- ถ้า directory ใหญ่มาก ให้ใช้ depth หรือ pattern จำกัด

## Expected Outcome

- User เห็นโครงสร้างไฟล์/โฟลเดอร์ของ project แบบ tree
- ไฟล์ระบบและ build artifacts ถูกกรองออก
- User ทราบ root path, depth, และ patterns ทีใช้
- พร้อมสำหรับการเลือกดูส่วนลึกเพิ่มเติม
