---
name: all-folders
description: ทำงานกับทุก folder ใน project ตาม workflow จนครบ scope
allowed-tools:
  - read
  - edit
  - write
  - grep
  - glob
  - find_file_by_name
  - exec
  - ask_user_question
triggers:
  - user
  - model
related:
  - analyze-project
  - scan-codebase
  - validate
  - resolve-errors
  - report
---

## Goal

ทำงานกับทุก folder ใน project จนครบทั้งหมดตาม workflow ที่กำหนด

## Scope

ใช้เมื่องานต้องประมวลผลหลายๆ folders ใน project ตาม workflow หรือ pattern ที่ระบุ

## Execute

### 1. Discover Folders

> Goal: รู้ว่า project มี folders อะไรบ้างและเรียงลำดับยังไง

1. ทำ `/analyze-project` เพื่อดูโครงสร้างหลัก
2. ทำ `/scan-codebase` เพื่อหา directories ที่เกี่ยวข้อง
3. ใช้ `glob` หรือ `find_file_by_name` เพื่อค้นหา folders ตาม pattern
4. บันทึกรายการ folders พร้อมลำดับ processing

### 2. Process Each Folder

> Goal: ประมวลผลแต่ละ folder ตาม workflow โดยไม่ทิ้ง conflicts

1. อ่าน folder contents ด้วย `exec` `ls` หรือ `Get-ChildItem`
2. เลือก workflow ที่เหมาะสมสำหรับ folder นั้น
3. ประมวลผลแบบ sequential ตามลำดับ foundation → dependent folders
4. บันทึก status ของแต่ละ folder

### 3. Verify

> Goal: ตรวจสอบว่าทุก folder ประมวลผลครบและถูกต้อง

1. ตรวจสอบว่าทุก folder ใน scope ได้รับการประมวลผลแล้ว
2. ทำ `/validate`
3. ถ้าไม่มี่ errors ให้ทำ `/resolve-errors`
4. ทำ `/report` สรุปผล

## Rules

### 1. Processing Order

- ทำ folders ที่เป็น foundation ก่อน (root, config, types)
- ทำ folders ที่มี่ dependencies ซับซ้อนทีหลัง

### 2. Batch Operations

- อ่าน folders แบบ parallel
- ประมวลผล folders แบบ sequential เพื่อหลีกเลี่ยง conflicts

### 3. Error Handling

- บันทึก folders ที่มี่ปัญหา
- ทำ `/resolve-errors` สำหรับ folders ที่มี่ issues
- ถ้า error สูง → หยุดและ report ก่อนทำต่อ

## Expected Outcome

- ทุก folder ใน scope ได้รับการประมวลผลครบถ้วน
- ไม่มี่ broken references หรือ missing folders
- ผ่าน `/validate`
- มี่รายงานสรุปผล
