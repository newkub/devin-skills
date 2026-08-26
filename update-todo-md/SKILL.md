---
name: update-todo-md
description: Read TODO.md and produce an enhanced numbered + nested prompt without editing the file
---

## Goal

อ่าน `TODO.md` และสร้าง prompt ทีมี structure แบบ numbered + nested ผ่าน `/enhance-prompt` โดยไม่แก้ไขไฟล์

## Scope

- ใช้ `update-todo-md` สำหรับอ่าน `TODO.md` ใน project root
- ไม่แก้ไข `TODO.md` (user เป็นคนแก้ไขเอง)
- แปลงเนื้อหาเป็น prompt ทีอ่านง่าย ลำดับชัดเจน
- รองรับ nested items ถ้ามี

## Execute

### 1. Read TODO.md

> Goal: อ่าน `TODO.md` ปัจจุบัน

1. ใช้ `find_file_by_name` หรือ `read` เพื่อหา `TODO.md` ใน project root
2. ถ้าไม่มี → รายงานและหยุด
3. บันทึกเนื้อหาเดิมเพื่อใช้กับ `/enhance-prompt`

### 2. Enhance Prompt

> Goal: สร้าง prompt ทีอ่านง่ายและเป็นระเบียบ

1. ทำ `/enhance-prompt` โดยใช้เนื้อหาจาก `TODO.md` เป็น input
2. กำหนดรูปแบบ output:
   - numbered list หลัก `(1., 2., 3., ...)`
   - nested numbered list `(1.1, 1.2, ...)` สำหรับ sub-items
   - แต่ละข้อมี single responsibility
   - ระบุ action, expected result, condition ทีชัดเจน
3. เก็บเนื้อหา enhanced prompt

### 3. Validate Structure

> Goal: ตรวจสอบความถูกต้องของ prompt

1. ตรวจว่าทุก item มีเลขกำกับ
2. ตรวจว่า nested items มีเลขย่อย
3. ตรวจว่าไม่มี `**` (bold markers)
4. ตรวจว่าใช้ backticks สำหรับ `tools`, `commands`, paths

### 4. Report

> Goal: สรุปผลให้ user

1. ทำ `/report` พร้อม enhanced prompt
2. ทำ `/suggest-next-action` เพื่อแนะนำให้ user แก้ไข `TODO.md` เอง หรือใช้ `/realize-implementation` สำหรับ implement

## Rules

### 1. Read-Only

- ไม่แก้ไข `TODO.md`
- ไม่ overwrite ไฟล์
- user เป็นผู้ตัดสินใจแก้ไข

### 2. Format

- ใช้ numbered list สำหรับ items หลัก
- ใช้ nested numbered list สำหรับ sub-items
- แต่ละ item ต้องกระชับและมี single responsibility

### 3. No Bold Markers

- ห้ามใช้ `**` (bold markers)
- ใช้ backticks สำหรับ emphasis

### 4. Scope

- รับผิดชอบเฉพาะการ enhance prompt จาก `TODO.md`
- ไม่ implement งานเอง
- ถ้าต้อง implement → ใช้ `/realize-implementation`

## Expected Outcome

- `TODO.md` ถูกอ่านและเข้าใจ
- Enhanced prompt เป็น numbered + nested format
- ไม่มีการแก้ไข `TODO.md`
- รายงานพร้อม action ถัดไป
