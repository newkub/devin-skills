---
name: open-windows-terminal
description: เปิด directory ใน Windows Terminal ด้วย wt -d <path>
argument-hint: "[path]"
related:
  - report-file-structure
  - capture
  - from-screenshots-dir
---

## Goal

เปิด directory ใน Windows Terminal ด้วย `wt -d <path>`

## Scope

ใช้บน Windows เพื่อเปิด target directory หรือ parent directory ของ file ใน Windows Terminal

## Execute

### 1. Prepare Context

> Goal: ระบุ target path และตรวจสอบ Windows Terminal

1. ระบุ target paths จาก user input, ไฟล์ที่เปิดอยู่, หรือ current working directory
2. ตรวจสอบ `wt` ใน PATH ด้วย `where wt` หรือ `Get-Command wt` — ต้องยืนยันว่า resolve ไปที่ `%LOCALAPPDATA%\Microsoft\WindowsApps\wt.exe` (Windows Terminal) ไม่ใช่ tool อื่นที่ชื่อซ้ำ (เช่น shim ของ git-worktree tool จาก `mise` ที่พบจริงบนเครื่องนี้, verified 2026-09-12)
3. ถ้า `wt` ถูก shadow ให้ใช้ full path `"$env:LOCALAPPDATA\Microsoft\WindowsApps\wt.exe" -d "<path>"` แทน
4. ถ้าไม่พบ `wt` ให้แจ้ง user พร้อมคำแนะนำติดตั้ง แล้ว stop
5. ถ้า target path ไม่มีอยู่จริง ให้แจ้ง user และ stop
6. ใช้บน Windows เท่านั้น

### 2. Open In Windows Terminal

> Goal: เปิด target ใน Windows Terminal อย่างปลอดภัย

1. ถ้า target เป็น directory: รัน `wt -d "<path>"`
2. ถ้า target เป็น file: เปิด parent directory ด้วย `wt -d "<parent>"`
3. ถ้ามีหลาย path ให้รันคำสั่งแยกครั้งละ path เพื่อเปิด tab/window หลายอัน
4. ถ้าต้องการ profile เฉพาะให้เพิ่ม `-p "<profile>"` เช่น `wt -p "PowerShell" -d "<path>"`

### 3. Verify And Report

> Goal: ยืนยันว่า Windows Terminal ถูกเปิด

1. ตรวจสอบว่า process `wt` ถูก spawn
2. ถ้า fail ให้แสดง stderr และแนะนำให้ตรวจสอบ `wt` หรือ path
3. รายงาน paths ที่เปิดพร้อม command ที่ใช้

## Rules

### 1. Safety

- ไม่สร้างไฟล์หรือ directory ใหม่ถ้า target ไม่มีอยู่
- ไม่รันคำสั่งถ้า `wt` ไม่พบใน PATH
- ถ้า user ไม่ระบุ path ให้ถามก่อน
- ใช้บน Windows เท่านั้น

### 2. Path Handling

- ใช้ absolute path ถ้าไม่แน่ใจเรื่อง working directory
- ใส่ quotes รอบ path เสมอเพื่อจัดการ spaces
- สำหรับ file ให้เปิด parent directory

### 3. Output

- รายงานผลเป็นรายการ path พร้อม `wt` command ที่ใช้ (in windows terminal)
- ถ้า fail ให้ระบุสาเหตุและขั้นตอนต่อไป

- ใช้ /report-file-structure ถ้าจำเป็น
- ใช้ /capture ถ้าจำเป็น
- ใช้ /from-screenshots-dir ถ้าจำเป็น

## Expected Outcome

- Directory หรือ parent directory ของ file ถูกเปิดใน Windows Terminal tab/window ใหม่
- Output เป็นรายการ paths ที่เปิดพร้อม command ที่ใช้

