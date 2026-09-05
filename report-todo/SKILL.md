---
name: report-todo
description: อ่าน TODO.md หรือ todo list จาก project แล้วรายงานเป้นตารางพร้อมสถานะ
argument-hint: "[path-or-scope]"
related:
  - report-table
  - update-todo-md
  - implement-todo-md
  - suggest-next-action
---

## Goal

อ่าน TODO.md หรือ todo list จาก project แล้วรายงานเป้นตารางพร้อมสถานะ progress, completed, pending

## Scope

ใช้กับไฟล์ `TODO.md`, `todo.md`, `.devin/TODO.md`, หรือข้อความ todo list ที่ user ให้มา แสดงผลเป้นตารางที่มีลำดับ สถานะ และหมายเหตุ

## Execute

### 1. Locate Task Source

> Goal: หาแหล่ง todo list

1. ตรวจ `TODO.md` ที root ของ project
2. ถ้าไม่มี → ตรวจ `.devin/TODO.md` หรือ `todo.md`
3. ถ้า user ให้ scope มา → ใช้ path ทีระบุ
4. ถ้าไม่มีไฟล์ → ใช้ todo list จาก context ปัจจุบัน

### 2. Parse Task Items

> Goal: แยก todo แต่ละข้อ

1. อ่านไฟล์ด้วย `/read`
2. แยก item ตามลำดับ โดยมักจะอยู่ในรูปแบบ:
   - `[ ]` = pending
   - `[x]` = completed
   - `[~]` = in progress
   - `1. [ ] text` หรือ `- [ ] text`
3. ดึงหมายเลข, ข้อความ, สถานะ
4. ถ้าไฟล์ไม่อยู่ในรูปแบบ checklist → แยกตาม section หรือ numbered list

### 3. Build Report Table

> Goal: สร้างตารางทีอ่านง่าย

1. ทำ `/report-table` ด้วยคอลัมน์:
   - `No.`
   - `Task`
   - `Status` (pending / in-progress / completed)
   - `Notes`
2. คำนวณ progress: `completed / total`
3. เรียงลำดับ: in-progress ก่อน pending แล้ว completed

### 4. Output Summary

> Goal: บอกสถานะรวมและ next action

1. แสดงจำนวน completed, in-progress, pending
2. ระบุ task ถัดไปทีควรทำ (in-progress ก่อน แล้ว pending แรกสุด)
3. ทำ `/suggest-next-action` ถ้ามี task ค้าง

## Rules

### 1. Status Mapping

- `[x]`, `completed`, `done` → completed
- `[~]`, `in progress`, `in-progress` → in-progress
- `[ ]`, `pending`, `todo` → pending

### 2. Format

- ตารางต้องมีคอลัมน์ `No.` เป้นคอลัมน์แรก
- ห้ามใช้ `**` bold markers
- ใช้ backticks สำหรับ paths และ commands

### 3. Scope

- ไม่แก้ไข todo ไฟล์ — แค่รายงาน
- ถ้าต้องการ update todo → ส่งต่อ `/update-todo-md`
- ถ้าต้องการ implement todo → ส่งต่อ `/implement-todo-md`

## Expected Outcome

- ตาราง todo พร้อมสถานะและ progress
- ระบุ next task ทีควรทำ
- ไม่แก้ไขไฟล์ todo
