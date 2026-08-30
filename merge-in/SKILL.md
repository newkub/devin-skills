---
name: merge-in
description: merge ไฟล์หรือ folder เข้าด้วยกันและลบ source เดิม
argument-hint: "@files [destination]"
related:
  - update-references
  - deep-validate
  - ask-me
  - deep-analyze
---

## Goal

merge ไฟล์หรือโฟลเดอร์ต้นทางเข้าด้วยกันเป็นไฟล์หรือโฟลเดอร์ปลายทางเดียว แล้วลบ source เดิม

## Scope

ใช้เมื่อต้องรวมเนื้อหาจากหลายไฟล์หรือหลายโฟลเดอร์เข้าด้วยกัน และลบ source หลัง merge

## Execute

### 1. Identify Sources And Destination

> Goal: รู้ว่าอะไรคือ source และ destination

1. รับ `@files` เป็นรายการ source (ไฟล์หรือ folder) จาก argument หรือ context
2. รับ `destination` จาก prompt หรือ context
3. source อาจเป็นไฟล์หรือ folder หลายรายการ
4. destination อาจเป็นไฟล์ใหม่ ไฟล์เดิม หรือ folder เป้าหมาย
5. ถ้าไม่มี `@files` → ทำ `/ask-me` เพื่อขอรายการ source
6. ถ้าไม่ชัดเจน → ทำ `/ask-me` ก่อนดำเนินการ

### 2. Analyze Sources

> Goal: เข้าใจเนื้อหาก่อน merge

1. ทำ `/deep-analyze` กับแต่ละ source
2. ถ้า source เป็นโฟลเดอร์ → อ่านทุก `SKILL.md` หรือไฟล์หลักในโฟลเดอร์
3. บันทึกโครงสร้าง ความสัมพันธ์ และสิ่งทีซ้ำซ้อน

### 3. Merge Content

> Goal: รวม source เข้าด้วยกันอย่างถูกต้อง

1. ถ้า source เป็นไฟล์ → อ่าน content ทั้งหมดแล้ว merge เข้า destination
2. ถ้า source เป็นโฟลเดอร์ → รวบรวมไฟล์สำคัญ ลบ redundancy แล้ว merge เนื้อหา
3. ใช้ `git mv` หรือ `git rm` ถ้าอยู่ใน git repo
4. ตรวจสอบว่า merge ถูกต้องและไม่มี data loss

### 4. Delete Old Sources

> Goal: ลบ source เดิมหลัง merge

1. ลบไฟล์หรือโฟลเดอร์ source เดิมหลัง merge สำเร็จ
2. ใช้ `git rm -r` สำหรับโฟลเดอร์ หรือ `git rm` สำหรับไฟล์
3. ตรวจสอบว่าไม่มี references เก่าเหลือถ้า source ถูก reference

### 5. Validate

> Goal: ตรวจสอบความถูกต้อง

1. ทำ `/deep-validate` เพื่อตรวจ merge
2. ตรวจหา broken references
3. ตรวจ data loss

## Rules

- ตรวจสอบ merge ถูกต้องก่อนลบ source
- รองรับทั้งไฟล์และโฟลเดอร์เป็น source
- ใช้ git สำหรับ file operations ถ้าเป็นไปได้
- ถ้ามี references ชี้ไปยัง source → ทำ `/update-references` ก่อนลบ
- ถ้าต้องตัดสินใจระหว่างหลายตัวเลือก → ทำ `/deep-validate` แล้วเลือกสิ่งทีดีทีสุด

## Expected Outcome

- ไฟล์หรือโฟลเดอร์ถูก merge เข้าด้วยกัน
- source เดิมถูกลบ
- ไม่มี data loss
- ไม่มี broken references
