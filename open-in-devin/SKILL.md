---
name: open-in-devin
description: เปิด directory หรือ file ใน Devin session ใหม่
argument-hint: "[path]"
related:
  - create-report-in-dot-devin
  - list-devin-user-request-in-this-session
  - open-in-explorer
---

## Goal

เปิด Devin session ด้วย target path เป็นจุดเริ่มต้น

## Scope

ใช้เมื่อต้องการเปิด directory หรือ file ใน Devin CLI จาก terminal หรือ context ปัจจุบัน

## Execute

### 1. Prepare Context

> Goal: ระบุ target path และตรวจสอบ Devin CLI

1. ระบุ target path จาก user input, ไฟล์ที่เปิดอยู่, หรือ current working directory
2. ตรวจสอบ `devin` CLI ใน PATH ด้วย `where devin` หรือ `Get-Command devin`
3. ถ้าไม่พบ `devin` ให้แจ้ง user พร้อมคำแนะนำติดตั้ง แล้ว stop
4. ถ้า target path ไม่มียู่จริง ให้แจ้ง user และ stop

### 2. Open In Devin

> Goal: เปิด Devin session ด้วย target context

1. ถ้า target เป็น directory: รัน `Set-Location "<path>"; devin` (PowerShell) หรือ `cd "<path>" && devin`
2. ถ้า target เป็น file: เปิด parent directory แล้วส่ง file เป็น initial prompt ด้วย `Set-Location "<parent>"; devin -- "edit <file>"` หรือ `cd "<parent>" && devin -- "edit <file>"`
3. ถ้าต้องการ non-interactive สามารถใช้ `devin -p "..." --prompt-file "<file>"` ตาม context
4. หลีกเลี่ยงการส่ง secrets หรือ paths ที่ sensitive เป็น prompt

### 3. Verify And Report

> Goal: ยืนยันว่า Devin เริ่ม session ได้

1. ตรวจสอบว่า process `devin` ถูก spawn และไม่ exit ทันที
2. ถ้า fail ให้แสดง stderr และแนะนำให้ตรวจสอบ Devin CLI หรือ workspace trust
3. รายงาน path และ command ที่ใช้

## Rules

### 1. Safety

- ไม่สร้างไฟล์หรือ directory ใหม่ถ้า target ไม่มีอยู่
- ไม่รันคำสั่งถ้า `devin` CLI ไม่พบใน PATH
- ถ้า user ไม่ระบุ path ให้ถามก่อน

### 2. Path Handling

- ใช้ absolute path ถ้าไม่แน่ใจเรื่อง working directory
- ใส่ quotes รอบ path เสมอเพื่อจัดการ spaces
- สำหรับ file ให้เปิด parent directory แล้วส่ง file เข้าไปเป็น context

### 3. Output

- รายงานผลเป็นรายการ path พร้อม `devin` command ที่ใช้
- ถ้า fail ให้ระบุสาเหตุและขั้นตอนต่อไป

- ใช้ /create-report-in-dot-devin ถ้าจำเป็น
- ใช้ /list-devin-user-request-in-this-session ถ้าจำเป็น
- ใช้ /open-in-explorer ถ้าจำเป็น

## Expected Outcome

- Devin session เริ่มต้นด้วย target path เป็น workspace หรือ context
- Output เป็นรายการ path ที่เปิดพร้อม command ที่ใช้
