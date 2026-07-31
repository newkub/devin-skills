---
name: open-files-in-zed
description: เปิดไฟล์หรือ directory ใน Zed editor ผ่าน CLI ที่ถูกต้องตาม OS
---

## Goal

เปิดไฟล์หรือ directory ที่ระบุใน Zed editor ด้วย CLI ที่ถูกต้อง โดยตรวจสอบ binary, target path และ OS ก่อนดำเนินการ

## Scope

ใช้เมื่อผู้ใช้ต้องการเปิดไฟล์หรือ directory ใน Zed จาก context ปัจจุบัน เช่น path ที่ระบุ ไฟล์ที่เลือก หรือ current working directory รองรับ Windows, macOS และ Linux ไม่รองรับการเปิดไฟล์จาก URL

## Execute

### 1. Prepare Context

> Goal: ระบุ target paths และ Zed CLI ที่ถูกต้อง

1. ระบุ target paths จากลำดับความสำคัญ: path ที่ user ระบุไว้ ไฟล์ที่เปิดอยู่ใน IDE หรือ current working directory
2. parallel: ตรวจสอบ OS ∥ ตรวจสอบ Zed binary ใน PATH
3. ถ้าไม่พบ Zed CLI ให้แจ้ง user พร้อมคำแนะนำติดตั้ง แล้ว stop
4. ถ้า target path ไม่มีอยู่จริง ให้แจ้ง user และ stop

### 2. Open Files

> Goal: เปิด target ใน Zed อย่างปลอดภัย

1. เลือก Zed CLI ตาม OS:
   - macOS: `zed <path...>`
   - Linux: `zed <path...>`
   - Windows: `zeditor <path...>` หรือ `zed <path...>` ถ้า `zeditor` ไม่พบ
   - WSL บน Windows: ใช้ `zed.exe` หรือ `zeditor.exe` ผ่าน path ที่เข้าถึงได้
2. รันคำสั่งเปิดไฟล์ทีเดียวสำหรับหลาย path ไม่เรียกซ้ำ
3. ถ้าเป็น directory ให้เปิดเป็น workspace โดยส่ง path เดียว

### 3. Verify And Report

> Goal: ยืนยันว่าไฟล์ถูกเปิดและรายงานผล

1. ตรวจสอบ exit code หรือสถานะ process ที่ spawn
2. ถ้า fail ให้แสดง stderr และแนะนำให้ตรวจสอบ Zed CLI หรือ path
3. รายงาน paths ที่เปิดไปพร้อม CLI command ที่ใช้

## Rules

### 1. Safety

- ไม่สร้างไฟล์ใหม่อัตโนมัติถ้า target ไม่มีอยู่
- ไม่รันคำสั่งถ้า Zed CLI ไม่พบใน PATH
- ถ้า user ไม่ระบุ path ให้ถามก่อน ไม่เดา

### 2. OS Specific

- macOS และ Linux ใช้ `zed`
- Windows ใช้ `zeditor` ก่อน ถ้าไม่เจอให้ลอง `zed`
- WSL ตรวจสอบ Windows PATH หรือ `*.exe` ก่อนใช้ Linux binary

### 3. Determinism

- ค้นหา Zed binary จาก `PATH` ก่อน ไม่ hardcode absolute path
- ถ้ามีหลาย target เรียงตาม input order
- รันคำสั่งเดียวสำหรับหลายไฟล์

### 4. Output

- รายงานผลเป็นรายการ path พร้อม command ที่ใช้
- ถ้า fail ให้ระบุสาเหตุและขั้นตอนต่อไป

## Expected Outcome

- ไฟล์หรือ directory ถูกเปิดใน Zed หรือรายงานสาเหตุที่ไม่สำเร็จ
- Output เป็นรายการ paths ที่เปิดไปพร้อม Zed CLI command ที่ใช้
