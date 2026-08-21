---
name: edit-only
description: แก้ไขโค้ดโดยไม่ต้องรัน task หรือ terminal
allowed-tools:
  - read
  - edit
  - grep
  - glob
  - exec
triggers:
  - user
  - model
---

## Goal

กำหนดกฎสำหรับการแก้ไขโค้ดโดยไม่ต้องรัน task หรือ terminal ใดๆ

## Scope

ใช้ workflow นี้เมื่อ task เป็นการแก้ไขโค้ดเท่านั้น โดยไม่ต้องการ verify ผลลัพธ์ด้วยการรัน

## Execute

### 1. Task Identification

ทำ `/follow-import-export` เพื่อตรวจสอบการใช้ import และ export strategy และยืนยันว่า task เป็นการแก้ไขโค้ดเท่านั้น

### 2. Code Modification

ใช้ `edit` หรือ `multi_edit` สำหรับการแก้ไขไฟล์ และ `write_to_file` สำหรับการสร้างไฟล์ใหม่ จากนั้นทำ `/update-reference` เพื่ออัพเดท references ทั้งหมม

### 3. Validation

ตรวจสอบว่าไม่มี `run_command` ถูกเรียก ไม่มี background process ถูกรัน และไม่มี browser preview ถูกเปิด

## Rules

### 1. Execution Restrictions

ห้ามใช้ execution tools ทั้งหมม ทำเฉพาะ file editing operations

- ห้ามรัน `run_command` ใดๆ
- ห้ามรัน background process
- ห้ามเปิด `browser_preview`

### 2. File Operations

ใช้เฉพาะ file modification tools

- `edit` - แก้ไขไฟล์ที่มีอยู่
- `multi_edit` - แก้ไขหลายจุดในไฟล์เดียว
- `write_to_file` - สร้างไฟล์ใหม่
- `read_file` - อ่านไฟล์เพื่อตรวจสอบ

### 3. Quality Assurance

รักษาคุณภาพโค้ดตามมาตรฐาน

- ทำ `/follow-code-quality` สำหรับการแก้ไข
- รักษา consistency กับ codebase
- เพิ่ม comments เมื่อจำเป็น

## Expected Outcome

- โค้ดถูกแก้ไขโดยไม่รัน command ใดๆ
- การเปลี่ยนแปลงถูกบันทึกลงไฟล์อย่างถูกต้อง
- ไม่มี process หรือ terminal ถูกรัน
- Code quality ยังคงอยู่ตามมาตรฐาน
