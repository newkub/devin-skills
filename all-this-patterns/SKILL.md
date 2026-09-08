---
name: all-this-patterns
description: ค้นหา patterns ทั่งหมดใน scope แล้ว apply การเปลี่ยนแปลงตาม patterns ให้ครบ
argument-hint: "[patterns...]"
related:
  - search-files-patterns
  - batch-rename-files
  - update-references
  - use-scripts
  - then-apply
  - follow-parallel
  - report-in-table
  - report
  - suggest-next-action
  - ask-me
---

## Goal

ค้นหา patterns หลายรายการใน scope แล้ว apply การเปลี่ยนแปลง การแก้ไข หรือการอัปเดตตามแต่ละ pattern ให้ครบถ้วน

## Scope

ใช้เมื่อ user ต้องการให้แก้ไขทุกจุดที match หลาย patterns เช่น เปลี่ยนชื่อ function ทุกไฟล์ แก้ wording ทุก skill หรืออัปเดต format ทุก repo

## Execute

### 1. Define Patterns

> Goal: รู้ว่าจะค้นหาและแก้อะไรทั้งหมด

1. รับ list ของ patterns และ actions จาก argument
2. ถ้าไม่ชัด → ทำ `/ask-me`
3. ระบุ scope: files, skills, directories หรือ repo

### 2. Find All Matches

> Goal: หาทุกตำแหน่งที match

1. ใช้ `/search-files-patterns` หาทุก match
2. ใช้ `grep` หรือ `ast-grep` ถ้าต้องการ precision
3. บันทึก list พร้อม file path, line number, context

### 3. Plan Changes

> Goal: วางแผนการเปลี่ยนแปลงทั้งหมด

1. จัดกลุ่ม matches ตาม pattern
2. เลือก strategy: bulk edit, script, หรือ manual
3. ถ้ามีหลาย file ให้ใช้ `/use-scripts`
4. ถ้า rename ให้ใช้ `/batch-rename-files`
5. ถ้าต้องสลับ skill ต่อเนื่อง ใช้ `/then-apply`

### 4. Apply Patterns

> Goal: แก้ไขทุก match ตาม patterns

1. ทำ dry run ก่อนถ้าเป้น destructive
2. แก้ไขทีละ batch หรือทั่งหมดพร้อมกันด้วย `/follow-parallel`
3. ตรวจสอบว่าไม่ทำลายไฟล์อื่นนอก scope
4. ถ้า high-risk → ขอ user confirm ก่อน

### 5. Update References

> Goal: อัปเดต cross-references

1. ทำ `/update-references` ถ้ามี rename หรือ move
2. ตรวจ broken references

### 6. Validate

> Goal: ยืนยันว่า apply ครบและถูกต้อง

1. รัน `grep` หรือ `review` เพื่อตรวจว่าไม่มี match เก่าเหลือ
2. รัน `/run-check` ถ้าเป็น code
3. ทำ `/deep-validate` ถ้าจำเป็น

### 7. Report

> Goal: สรุปผล

1. ทำ `/report-in-table` คอลัมน์: `No.`, `Pattern`, `File`, `Match`, `Action`, `Status`
2. ทำ `/suggest-next-action`

## Rules

- ทำ dry run ก่อนการเปลี่ยนแปลงครั้งใหญ่
- ไม่ apply โดยไม่มี user confirm ถ้าเป้น high-risk
- ทุกการแก้ไขต้องมี pattern ชัดเจน
- ถ้ามี rename ให้ update references ทันที
- ไม่ทำลายไฟล์นอก scope

## Expected Outcome

- รายการทุก match แยกตาม pattern พร้อม action ที apply
- ไม่มี match เก่าเหลือ
- references อัปเดตครบ
- รายงาน status ชัดเจน
