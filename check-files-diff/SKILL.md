---
name: check-files-diff
description: เปรียบเทียบความแตกต่างระหว่างไฟล์สองไฟล์โดยตรง ไม่ผ่าน git
allowed-tools:
  - read
  - exec
  - ask_user_question
triggers:
  - user
  - model
related:
  - check-git-diff
  - check-should-update
  - report-format-table
  - suggest-next-action
---

## Goal

เปรียบเทียบเนื้อหาระหว่างไฟล์สองไฟล์โดยตรง โดยไม่ขึ้นกับ git repository

## Scope

ใช้เมื่อต้องเทียบเนื้อหาสองไฟล์ สองเวอร์ชั่น หรือสอง path ที่ไม่อยู่ใน git history

## Execute

### 1. Identify Files

ระบุสองไฟล์ที่ต้องเปรียบเทียบ

> Goal: รู้ path ทังสองและ encoding

1. รับ `file-a` และ `file-b` จาก user เป็น absolute หรือ relative path
2. ตรวจสอบว่าไฟล์ทังสองมีอยู่จริง
3. ถ้าไม่มาหรือขาดบางตัว → `/ask-me`

### 2. Read And Compare

อ่านและเปรียบเทียบเนื้อหา

> Goal: หาความแตกต่าง

1. อ่าน `file-a` และ `file-b` ด้วย `read` หรือ `exec`
2. แยกแต่ละไฟล์เป็น array ของบรรทัด
3. เปรียบเทียบแบบ line-by-line:
   - บรรทัดที่มีใน `file-a` แต่ไม่อยู่ `file-b` → removed
   - บรรทัดที่มีใน `file-b` แต่ไม่อยู่ `file-a` → added
   - บรรทัดที่มีอยู่ทังสองแต่เนื้อหาต่าง → modified
4. ถ้า `diff` หรือ `git diff --no-index` พร้อมใช้ ให้ใช้เป็น output หลักได้

### 3. Analyze

วิเคราะห์ differences

> Goal: ระบุลักษณะของการเปลี่ยนแปลง

1. นับจำนวนบรรทัด: added, removed, modified, total
2. ระบุ sections หรือ patterns ที่เปลี่ยน เช่น imports, config, scripts
3. ถ้ามี config files เช่น `package.json`, `tsconfig.json` → ระบุ keys ที่เปลี่ยน

### 4. Report

สรุปผล

> Goal: ผู้ใช้เข้าใจความต่าง

1. สรุปสถิติ: added, removed, modified
2. รายการบรรทัดที่เปลี่ยนแปลง ระบุ line number
3. ถ้ามี significant changes → แนะนำ `check-should-update`, `rewrite-files`, หรือ `resolve-errors`
4. ทำ `/suggest-next-action`

## Rules

### 1. No Repository Required

- ไม่ต้องใช้ git repo
- ถ้าไฟล์อยู่ใน git repo ให้ใช้ `/check-git-diff` แทน

### 2. Scope

- สามารถเปรียบเทียบได้ทังไฟล์ text ทั่วไป
- ถ้าเป็น binary → report ว่า binary files differ

### 3. Output

- ใช้ `/report-format-table` สำหรับสถิติ
- แสดง context รอบบรรทัดที่เปลี่ยน
- ระบุ line numbers ทั้งสองฝ่าย

## Expected Outcome

- รายการความแตกต่างระหว่างสองไฟล์ พร้อมบรรทัดและ context
- สถิติ added/removed/modified
- มี next action
