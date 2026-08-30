---
name: check-size
description: ตรวจสอบขนาดไฟล์, directory หรือ disk บนเครื่อง
argument-hint: "[path|disk]"
related:
  - use-pwsh-shell
  - report-table
  - search-files-patterns
  - run-profiler
---

## Goal

ตรวจสอบขนาดของไฟล์, directory หรือ disk บนเครื่อง และแสดงผลแบบ human-readable

## Scope

- ใช้บน Windows เป็นหลัก (รองรับ macOS/Linux ด้วย command equivalent)
- ตรวจไฟล์, directory, หรือ disk drive
- แสดงผลเป็น bytes, KB, MB, GB, TB
- ไม่แก้ไข ลบ หรือย้ายไฟล์

## Execute

### 1. Identify Target

> Goal: ระบุสิ่งทีต้องตรวจขนาด

1. รับ `path` หรือ `disk` จาก argument
2. ถ้าไม่ระบุ → ใช้ current working directory
3. ถ้าเป็น `disk` หรือ drive letter → ใช้ disk check
4. ถ้าเป็น path ปกติ → ใช้ file/folder check

### 2. Check File Size

> Goal: ตรวจขนาดไฟล์

1. ตรวจสอบว่า path ชี้ไปยังไฟล์ (`Test-Path -PathType Leaf`)
2. ใช้ `(Get-Item <path>).Length`
3. แปลงเป้น human-readable (B, KB, MB, GB, TB)
4. แสดงชื่อไฟล์, ขนาด, path

### 3. Check Directory Size

> Goal: ตรวจขนาด directory

1. ตรวจสอบว่า path ชี้ไปยัง directory (`Test-Path -PathType Container`)
2. ใช้ `Get-ChildItem -Recurse -File <path> -ErrorAction SilentlyContinue`
3. รวมขนาดด้วย `Measure-Object -Property Length -Sum`
4. นับจำนวนไฟล์, directory, และขนาดรวม
5. แปลงเป้น human-readable
6. ถ้า directory ใหญ่มาก → จำกัดเวลา หรือใช้ `/run-profiler` ถ้าจำเป็น

### 4. Check Disk Size

> Goal: ตรวจขนาด disk

1. บน Windows: ใช้ `Get-Volume <drive-letter>` หรือ `Get-PSDrive <drive-letter>`
2. ดึง `Size`, `SizeRemaining`, `SizeUsed`
3. แปลงเป้น human-readable
4. แสดง total, used, free, usage percent
5. บน macOS/Linux: ใช้ `df -h <mount>`

### 5. Format Output

> Goal: แสดงผลอ่านง่าย

1. ใช้ `/report-table` สร้างตาราง
2. คอลัมน์: `Item`, `Type`, `Size`, `Files`, `Note`
3. แสดง human-readable (เช่น `1.23 GB`)
4. ถ้าหลาย target → แสดงทีละแถว

## Rules

### 1. Human-Readable

- แสดงขนาดเป้น B, KB, MB, GB, TB เสมอ
- ใช้ 2 ตำแหน่งทศนิยมสำหรับ KB ขึ้นไป
- ระบุ unit ชัดเจน

### 2. Respect Scope

- ไม่ลบ ไม่ย้าย ไม่แก้ไขไฟล์
- ไม่ติดตั้ง program
- แค่ตรวจสอบและรายงาน

### 3. Performance

- ถ้า directory ใหญ่ ใช้ `-File` เพื่อไม่ต้องนับ sub-directories ทีละ node
- ถ้าใช้เวลานานเกิน 30 วินาที → หยุดและรายงาน partial result
- ระบุเวลาทีใช้ถ้าจำเป็น

### 4. Error Handling

- ถ้า path ไม่มีอยู่ → รายงาน `not found`
- ถ้าไม่มีสิทธิ์เข้าถึง → รายงาน `access denied`
- ถ้า disk ไม่มี → รายงาน `drive not found`

### 5. Output

- ใช้ `/report-table`
- แสดง size ก่อนและหลัง (ถ้าเปรียบเทียบ)
- ถ้าเปรียบเทียบหลาย path → เรียงตาม size

## Expected Outcome

- ทราบขนาดของไฟล์, directory หรือ disk ทีต้องการ
- ผลลัพธ์ human-readable
- ไม่มีการเปลี่ยนแปลงใดๆ ในระบบไฟล์
