---
name: save-to-gist-idea
description: สร้าง gist idea note จาก prompt โดย enhance เป็น numbered list ก่อนบันทึก
argument-hint: "[idea-title]"
related:
  - enhance-prompt
  - save-to-new-gist
  - list-gist-notes
  - implement-from-gist-idea
  - idea
  - list-gist
  - open-web
---

## Goal

สร้าง gist idea note จาก prompt ของผู้ใช้ โดย enhance เป็น numbered list ตาม single responsibility ก่อนบันทึกลง gist

## Scope

- ใช้กับ user ที่ยังไม่มี่ idea note หรือต้องการสร้างใหม่
- รองรับ public และ secret gists
- ใช้ `/enhance-prompt` เพื่อสรุป prompt ก่อนบันทึก
- ใช้ `gh gist create` ผ่าน `/save-to-new-gist` หรือ `gh gist create` โดยตรง

## Execute

### 1. Receive Idea

> Goal: รับ prompt/idea จาก user

1. รับ input จาก argument หรือถาม user
2. ถ้า input เป็น file path ที่มี่อยู่ ให้อ่านเนื้อหา
3. ระบุ title สำหรับ gist idea จาก argument หรือสรุปจากเนื้อหา

### 2. Enhance Prompt

> Goal: แยก idea ออกเป็น numbered list ตาม single responsibility

1. เรียก `/enhance-prompt` กับเนื้อหาที่ได้รับ
2. ได้รับ numbered list ที่แต่ละข้อมี่ single responsibility
3. บันทึกเนื้อหาที่ enhance แล้ว

### 3. Check Existing Gist Idea

> Goal: ไม่สร้างซ้ำถ้ามี่ gist idea อยู่แล้ว

1. รัน `gh gist list --limit 100` หรือใช้ `/list-gist-notes`
2. ค้นหา gist ที่ description หรือ filename มี่คำว่า `idea` และตรงกับ title
3. ถ้ามี่อยู่แล้ว → แจ้ง user URL และหยุด
4. ถ้าไม่มี่ → ไปขั้นตอนถัดไป

### 4. Create Gist Idea Note

> Goal: บันทึก idea note ลง gist

1. กำหนด visibility (public/secret, ค่าเริ่มต้น secret)
2. ใช้ `gh gist create - --filename "<title>.md" --desc "<description>"` ส่งเนื้อหาผ่าน stdin
3. หรือใช้ `/save-to-new-gist` ตาม convention
4. รับ URL จาก output

### 5. Open And Report

> Goal: แสดงผล gist URL

1. ทำ `/open-web` หรือ `start <url>`
2. รายงาน URL, visibility, title

## Rules

### 1. Visibility

- ค่าเริ่มต้นเป็น secret ไม่ต้องใส่ flag ของ `gh`
- รับ `--public` จาก argument ถ้าต้องการ gist public
- ถ้าไม่ระบุให้ถาม user

### 2. Title

- title ต้องกระชับ
- ถ้าไม่ระบุให้ถามหรือสรุปจากเนื้อหา
- ใช้เป็น `filename` ของ gist เช่น `<title>.md`

### 3. Duplicate Check

- ตรวจ gist ที่มี่อยู่ก่อนสร้าง
- ถ้าพบ title/description ซ้ำ → แจ้ง URL เดิมแทนการสร้างใหม่

### 4. Safety

- ไม่บันทึกไฟล์ที่มี่ secrets หรือ credentials
- ถ้าไฟล์ใหญ่เกิน 10 MB ให้แจ้ง user
- ตรวจสอบเนื้อหาก่อน gist

## Expected Outcome

- Gist idea note ถูกสร้างบน GitHub
- ได้รับ URL ที่ถูกต้อง
- เนื้อหาใน gist เป็น numbered list ที่ผ่าน `/enhance-prompt`
- ไม่สร้างซ้ำถ้ามี่ gist idea อยู่แล้ว
