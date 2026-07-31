---
name: all-folders
description: ทำงานกับแต่ละ folder ใน project จนครบถ้วน
---

## Goal

ทำงานกับแต่ละ folder ใน project จนครบทั้งหมดตาม workflow ที่กำหนด

## Execute

### 1. Discover Folders

1. ทำ `/analyze-project` เพื่อดูโครงสร้าง
2. ใช้ `find_by_name` หรือ `list_dir` เพื่อค้นหา folders ตาม pattern

### 2. Process Each Folder

1. อ่าน folder contents ด้วย `list_dir`
2. ประมวลผล folder ตาม workflow ที่เกี่ยวข้อง

### 3. Verify

1. ตรวจสอบว่าทุก folder ได้รับการประมวลผลแล้ว
2. ทำ `/validate` เพื่อตรวจสอบความถูกต้อง

## Rules

### 1. Processing Order

- ทำ folders ที่เป็น foundation ก่อน (root, config, types)
- ทำ folders ที่มี dependencies ซับซ้อนทีหลัง

### 2. Batch Operations

- อ่าน folders แบบ parallel
- ประมวลผล folders แบบ sequential เพื่อหลีกเลี่ยง conflicts

### 3. Error Handling

- บันทึก folders ที่มีปัญหา
- ทำ `/resolve-errors` สำหรับ folders ที่มี issues

## Expected Outcome

- ทุก folder ใน scope ได้รับการประมวลผลครบถ้วน
