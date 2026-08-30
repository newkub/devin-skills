---
name: save-to-new-notes
description: สร้าง note ใหม่ใน repo D:\newkub\notes จากไฟล์หรือข้อความท่ีระบุ
related:
  - save-to-notes-idea
  - implement-from-notes-idea
  - list-notes
  - open-web
---

## Goal

สร้าง note ใหม่ใน `D:\newkub\notes` จากไฟล์หรือข้อความ

## Scope

- รับ input จาก argument (file path หรือ content)
- รองรับทั้งไฟล์และ content
- commit และ push อัตโนมัติ

## Execute

### 1. Prepare Note Content

> Goal: มีเนื้อหาท่ีจะบันทึกลง repo

1. รับ input จาก argument
2. ถ้า input เป้น file path ให้อ่านเนื้อหา
3. ถ้าไม่มี่ input ให้ถาม user
4. รับ `--name` หรือ `--title` จาก argument หรือถาม user
5. กำหนด filename `<title>.md` ใน `D:\newkub\notes`

### 2. Create Note

> Goal: note ถูกสร้างใน repo

1. เขียนเนื้อหาลง `D:\newkub\notes\<title>.md`
2. `git add . && git commit -m "add: <title> note" && git push`

### 3. Open And Report

> Goal: แสดงผล note URL

1. เปิด `https://github.com/newkub/notes/blob/main/<title>.md`
2. รายงาน URL และ path

## Rules

### 1. Input Handling

- ถ้า argument ตรงกับ file path ท่ีมีอยู่ ให้อ่านไฟล์
- ถ้าไม่ตรง file path ให้ถือเป้นข้อความ

### 2. Title

- ถ้าไม่ระบุให้สรุปจากเนื้อหา
- ใช้เป้น filename

### 3. Safety

- ไม่บันทึกไฟล์ท่ีมี secrets หรือ credentials
- ตรวจสอบเนื้อหาก่อน commit
- ถ้าไฟล์ใหญ่เกิน 10 MB ให้แจ้ง user

## Expected Outcome

- Note ถูกสร้างใน `D:\newkub\notes`
- ได้รับ URL ท่ีถูกต้อง
- บันทึกและ push เรียบร้อย
