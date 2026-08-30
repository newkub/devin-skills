---
name: list-program-in-computer
description: แสดงรายการ program ที่ติดตั้งในเครื่องจาก package manager ทั้งหมด
argument-hint: "[filter]"
related:
  - follow-my-package-manager
  - use-pwsh-shell
  - report-table
  - download-program
  - uninstall-program-in-computer
  - enhance-prompt
  - ask-me
---

## Goal

แสดงรายการ program ที่ติดตั้งในเครื่อง โดยรวมข้อมูลจาก package manager ต่างๆ

## Scope

- ใช้บน Windows เป็นหลัก
- query จาก `mise`, `scoop`, `winget`
- รองรับ filter ด้วยชื่อ program
- แสดงผลด้วย `/report-table`
- ไม่แก้ไข/ลบ program

## Execute

### 1. Identify Filter

> Goal: ระบุ program ที่ต้องการ filter

1. รับ `filter` จาก argument (ถ้าไม่ระบุ → list ทั้งหมด)
2. ถ้า `filter` กำกวม → ใช้ `/enhance-prompt` หรือ `/ask-me`

### 2. Detect Package Managers

> Goal: หา package manager ที่พร้อมใช้

1. ทำ `/follow-my-package-manager` หรือเช็คโดยตรงว่า `mise`, `scoop`, `winget` มีไหม
2. บันทึก package manager ที่พร้อมใช้

### 3. Query Mise

> Goal: เอารายการ program จาก mise

1. รัน `mise list` หรือ `mise ls`
2. ถ้ามี `filter` → ให้ `mise list | Select-String -Pattern <filter>`
3. บันทึกผล

### 4. Query Scoop

> Goal: เอารายการ program จาก scoop

1. รัน `scoop list` หรือ `scoop list <filter>`
2. ถ้าไม่มี `filter` ให้เก็บรายการทั้งหมด
3. บันทึกผล

### 5. Query Winget

> Goal: เอารายการ program จาก winget

1. รัน `winget list` หรือ `winget list <filter>`
2. กรองเฉพาะ program ที่ user ติดตั้ง (ไม่ใช่ system components ถ้าไม่จำเป็น)
3. บันทึกผล

### 6. Query PowerShell Get-Command

> Goal: หา program ทีอยู่ใน PATH แต่อาจไม่อยู่ใน package manager

1. รัน `Get-Command <filter>` (ถ้ามี filter)
2. หรือ `Get-Command -All` แล้วเลือก common tools
3. บันทึก path และ version (ถ้า `--version` ใช้ได)

### 7. Merge And Deduplicate

> Goal: รวมผลจากทุกแหล่งเป็นรายการเดียว

1. รวมรายการจาก `mise`, `scoop`, `winget`, `Get-Command`
2. deduplicate โดยใช้ชื่อ program หลัก
3. ถ้าชื่อซ้ำ → บันทึก package manager ทั้งหมดทีติดตั้ง

### 8. Format Output

> Goal: แสดงผลอ่านง่าย

1. ใช้ `/report-table` เพื่อสร้างตาราง
2. คอลัมน์: `Name`, `Version`, `Package Manager`, `Source/Path`
3. เรียงตามชื่อ

## Rules

### 1. No Modify

- ไม่ติดตั้ง ไม่อัปเดต ไม่ลบ program
- แค่แสดงรายการ

### 2. Respect Filter

- ถ้า user ระบุ filter ให้แสดงเฉพาะที match
- ถ้าไม่ระบุ ให้แสดงทั้งหมด แต่จำกัดจำนวนไม่ให้ยาวเกินไป

### 3. Combine Sources

- แสดง package manager ของแต่ละ program
- ถ้าติดตั้งผ่านหลาย package manager ให้ระบุทุกอัน

### 4. Performance

- รัน command แบบ parallel ถ้าเป็นไปได้
- ถ้า command ช้าเกิน 30 วินาที ให้ข้ามไปหรือ timeout

### 5. Output

- ใช้ `/report-table` หรือ markdown table
- ถ้าไม่พบ program → รายงานว่าไม่พบ

- ใช้ /use-pwsh-shell ถ้าจำเป็น
- ใช้ /download-program ถ้าจำเป็น
- ใช้ /uninstall-program-in-computer ถ้าจำเป็น

## Expected Outcome

- รายการ program ที่ติดตั้งครบถ้วน
- ระบุ version, package manager, path
- ผลลัพธ์ไม่ซ้ำซ้อน
- ไม่มีการแก้ไขใดๆ ในระบบ
