---
name: list-chezmoi-files
description: รายการไฟล์ทีถูก chezmoi จัดการ (chezmoi managed)
related:
  - follow-my-global-cli
  - report-table
  - suggest-next-action
  - update-chezmoi
---

## Goal

แสดงรายการไฟล์และ directory ที chezmoi จัดการอยู่ ทั้ง destination path และ source path พร้อมสถานะ

## Scope

ใช้เมื่อต้องการรู้ว่าไฟล์ใดถูก `chezmoi add` แล้ว หรือต้องการตรวจสอบ dotfiles ที sync ด้วย chezmoi

## Execute

### 1. Verify Chezmoi

> Goal: ตรวจสอบ chezmoi

1. รัน `chezmoi --version`
2. ถ้าไม่มี → ทำ `/follow-my-global-cli` เพื่อติดตั้ง
3. รัน `chezmoi source-path` เพื่อหา source directory
4. รัน `chezmoi dest-dir` หรือ `chezmoi data` เพื่อหา destination directory

### 2. List Managed Files

> Goal: รายการไฟล์ที chezmoi จัดการ

1. รัน `chezmoi managed` เพื่อดูทุกไฟล์/ directory ทีถูกจัดการ
2. ถ้าต้องการเฉพาะ files → ใช้ `chezmoi managed --include=files`
3. ถ้าต้องการทั้งหมด → ใช้ `chezmoi managed --include=all`
4. บันทึกรายการเป็น list

### 3. Map Source And Destination

> Goal: หา source path สำหรับแต่ละ destination

1. สำหรับแต่ละ managed file รัน `chezmoi source-path <dest-path>`
2. หรือรัน `chezmoi target-path <source-path>` หากต้องการทางกลับ
3. บันทึกคู่: `destination-path` และ `source-path`
4. ถ้ามี `apply` status ต่างกัน → บันทึก `out-of-sync`

### 4. Check Status

> Goal: ตรวจสอบสถานะของ managed files

1. รัน `chezmoi status` เพื่อดูไฟล์ทีมีการเปลี่ยนแปลง
2. ระบุไฟล์ที `Modified`, `Added`, `Deleted`
3. รัน `chezmoi diff` สำหรับไฟล์ทีต้องการดูรายละเอียด
4. บันทึก status ของแต่ละไฟล์

### 5. Report

> Goal: นำเสนอรายการไฟล์

1. ใช้ `/report-table` คอลัมน์:
   - No
   - Managed File (destination path)
   - Source Path
   - Type (`file`, `dir`, `symlink`)
   - Status (`sync`, `modified`, `unstaged`)
   - LastUpdate (ถ้าหาได้จาก `chezmoi state`)
2. เรียงตาม destination path
3. ทำ `/suggest-next-action`

## Rules

### 1. Read Only

- ไม่แก้ไข source หรือ destination
- ไม่รัน `chezmoi apply` หรือ `chezmoi readd` โดยไม่มี instruction
- ใช้ `chezmoi managed`, `chezmoi source-path`, `chezmoi status` เท่านั้น

### 2. Path Accuracy

- แสดงทั้ง destination path และ source path
- ใช้ absolute paths
- ระบุ type ของ entry

### 3. Status

- ใช้ `chezmoi status` เพื่อระบุความต่าง
- ไม่สรุป status เองถ้าไม่มีข้อมูล
- ถ้าไฟล์ out of sync → แนะนำ `/update-chezmoi`

## Expected Outcome

- รายการไฟล์ที chezmoi จัดการทั้งหมด
- คู่ destination path และ source path
- สถานะของแต่ละไฟล์
- ตารางพร้อม next action
