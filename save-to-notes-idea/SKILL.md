---
name: save-to-notes-idea
description: สร้าง note idea ใน repo D:\newkub\notes โดย enhance เป็น numbered list ก่อนบันทึก
argument-hint: "[idea-title]"
related:
  - enhance-prompt
  - save-to-new-notes
  - list-notes
  - implement-from-notes-idea
  - open-web
---

## Goal

สร้าง note idea ใน `D:\newkub\notes` โดย enhance prompt เป็น numbered list ตาม single responsibility ก่อนบันทึก

## Scope

- ใช้กับ user ท่ียังไม่มี่ idea note หรือต้องการสร้างใหม่
- รับ public/secret เป้น file naming ไม่ใช่ visibility (repo private)
- ใช้ `/enhance-prompt` เพื่อสรุป prompt ก่อนบันทึก

## Execute

### 1. Receive Idea

> Goal: รับ prompt/idea จาก user

1. รับ input จาก argument หรือถาม user
2. ถ้า input เป้น file path ให้อ่านเนื้อหา
3. ระบุ title สำหรับ note จาก argument หรือสรุปจากเนื้อหา

### 2. Enhance Prompt

> Goal: แยก idea ออกเป้น numbered list ตาม single responsibility

1. เรียก `/enhance-prompt` กับเนื้อหาท่ีได้รับ
2. ได้รับ numbered list ท่ีแต่ละข้อมี single responsibility
3. บันทึกเนื้อหาท่ี enhance แล้ว

### 3. Check Existing Note

> Goal: ไม่สร้างซ้ำถ้ามี note อยู่แล้ว

1. ค้นหาไฟล์ `.md` ใน `D:\newkub\notes` ท่ีชื่อตรงกับ title
2. ถ้ามีอยู่แล้ว → แจ้ง path และหยุด

### 4. Create Note Idea

> Goal: บันทึก idea note ลง repo

1. กำหนด filename `<title>.md` ใน `D:\newkub\notes`
2. เขียนเนื้อหาลงไฟล์
3. `git add . && git commit -m "add: <title> note" && git push`

### 5. Open And Report

> Goal: แสดงผล note URL

1. ทำ `/open-web` หรือเปิด `https://github.com/newkub/notes/blob/main/<title>.md`
2. รายงาน path, title, URL

## Rules

### 1. Title

- title ต้องกระชับ
- ถ้าไม่ระบุให้ถามหรือสรุปจากเนื้อหา
- ใช้เป้น filename ของ note เช่น `<title>.md`

### 2. Duplicate Check

- ตรวจ note ท่ีมีอยู่ก่อนสร้าง
- ถ้าพบ title ซ้ำ → แจ้ง URL เดิมแทนการสร้างใหม่

### 3. Safety

- ไม่บันทึกไฟล์ท่ีมี secrets หรือ credentials
- ถ้าไฟล์ใหญ่เกิน 10 MB ให้แจ้ง user

## Expected Outcome

- Note idea ถูกสร้างใน `D:\newkub\notes`
- ได้รับ URL ท่ีถูกต้อง
- เนื้อหาใน note เป้น numbered list ท่ีผ่าน `/enhance-prompt`
- ไม่สร้างซ้ำถ้ามี note อยู่แล้ว
