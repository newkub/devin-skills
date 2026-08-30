---
name: open-in-explorer
description: เปิดไฟล์หรือ directory ใน Windows Explorer ด้วย explorer <path>
argument-hint: "[path]"
related:
  - open-in-devin
  - open-in-wezterm
  - open-in-windows-terminal
---

## Goal

เปิดไฟล์หรือ directory ใน Windows Explorer ด้วย `explorer <path>`

## Scope

ใช้บน Windows เพื่อเปิด target path ใน File Explorer รองรับทั้งไฟล์และโฟลเดอร

## Execute

### 1. Prepare Context

> Goal: ระบุ target path และตรวจสอบ environment

1. ระบุ target paths จาก user input, ไฟล์ที่เปิดอยู่, หรือ current working directory
2. ตรวจสอบว่าเป็น Windows OS
3. ถ้า target path ไม่มีอยู่จริง ให้แจ้ง user และ stop
4. ไม่รองรับ macOS/Linux สำหรับ `explorer`

### 2. Open In Explorer

> Goal: เปิด target ใน Windows Explorer อย่างปลอดภัย

1. ใช้คำสั่ง `explorer "<path>"`
2. ถ้าเป็น directory จะเปิด File Explorer ใน directory นั้น
3. ถ้าเป็น file จะเลื่อกหรือเปิด file นั้น (ขึ้นกับ file association)
4. ถ้ามีหลาย path ให้รันคำสั่งแยกครั้งละ path เพื่อความชัดเจน

### 3. Verify And Report

> Goal: ยืนยันว่าเปิดสำเร็จ

1. ตรวจสอบ exit code ของ process ที่ spawn
2. ถ้า fail ให้แสดง stderr และแนะนำให้ตรวจสอบ path
3. รายงาน paths ที่สั่งเปิดพร้อม command ที่ใช้

## Rules

### 1. Safety

- ไม่สร้างไฟล์หรือ directory ใหม่อัตโนมัติถ้า target ไม่มีอยู่
- ไม่รันคำสั่งถ้าไม่อยู่บน Windows
- ถ้า user ไม่ระบุ path ให้ถามก่อน

### 2. Path Handling

- ใช้ absolute path ถ้าไม่แน่ใจเรื่อง working directory
- ใส่ quotes รอบ path เสมอเพื่อจัดการ spaces
- ถ้า path ไม่อยู่ใน local drive ให้ระบุ full UNC/absolute path

### 3. Output

- รายงานผลเป็นรายการ path พร้อม `explorer` command ที่ใช้
- ถ้า fail ให้ระบุสาเหตุและขั้นตอนต่อไป

## Expected Outcome

- ไฟล์หรือ directory ถูกเปิดหรือเลื่อกใน Windows Explorer
- Output เป็นรายการ paths ที่สั่งเปิดพร้อม command ที่ใช้
