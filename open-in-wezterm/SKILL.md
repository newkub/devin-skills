---
name: open-in-wezterm
description: เปิด directory ใน WezTerm terminal ด้วย wezterm start --cwd
argument-hint: "[path]"
related:
  - open-in-devin
  - open-in-explorer
  - open-in-windows-terminal
---

## Goal

เปิด directory ใน WezTerm terminal ด้วย `wezterm start --cwd`

## Scope

ใช้เมื่อต้องการเปิด directory หรือ file ใน WezTerm terminal บน Windows, macOS, หรือ Linux

## Execute

### 1. Prepare Context

> Goal: ระบุ target path และตรวจสอบ WezTerm CLI

1. ระบุ target paths จาก user input, ไฟล์ที่เปิดอยู่, หรือ current working directory
2. ตรวจสอบ `wezterm` CLI ใน PATH ด้วย `where wezterm` หรือ `which wezterm`
3. ถ้าไม่พบ `wezterm` ให้แจ้ง user พร้อมคำแนะนำติดตั้ง แล้ว stop
4. ถ้า target path ไม่มีอยู่จริง ให้แจ้ง user และ stop

### 2. Open In WezTerm

> Goal: เปิด target ใน WezTerm อย่างปลอดภัย

1. ถ้า target เป็น directory: รัน `wezterm start --cwd "<path>"`
2. ถ้า target เป็น file: เปิด parent directory ด้วย `wezterm start --cwd "<parent>"`
3. ถ้ามีหลาย path ให้รันคำสั่งแยกครั้งละ path หรือใช้ `wezterm start` หลายครั้ง

### 3. Verify And Report

> Goal: ยืนยันว่า WezTerm ถูกเปิด

1. ตรวจสอบว่า process `wezterm` ถูก spawn
2. ถ้า fail ให้แสดง stderr และแนะนำให้ตรวจสอบ WezTerm CLI หรือ path
3. รายงาน paths ที่เปิดพร้อม command ที่ใช้

## Rules

### 1. Safety

- ไม่สร้างไฟล์หรือ directory ใหม่ถ้า target ไม่มีอยู่
- ไม่รันคำสั่งถ้า `wezterm` CLI ไม่พบใน PATH
- ถ้า user ไม่ระบุ path ให้ถามก่อน

### 2. Path Handling

- ใช้ absolute path ถ้าไม่แน่ใจเรื่อง working directory
- ใส่ quotes รอบ path เสมอเพื่อจัดการ spaces
- สำหรับ file ให้เปิด parent directory

### 3. Output

- รายงานผลเป็นรายการ path พร้อม `wezterm` command ที่ใช้
- ถ้า fail ให้ระบุสาเหตุและขั้นตอนต่อไป

## Expected Outcome

- Directory หรือ parent directory ของ file ถูกเปิดใน WezTerm window/tab ใหม่
- Output เป็นรายการ paths ที่เปิดพร้อม command ที่ใช้
