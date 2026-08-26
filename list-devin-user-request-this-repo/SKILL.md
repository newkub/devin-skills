---
name: list-devin-user-request-this-repo
description: รวมและแสดง user requests ทีเกิดใน repository ปัจจุบัน แบบไม่ซ้ำ
argument-hint: "[limit]"
related:
  - list-devin-session
  - list-devin-user-request-in-this-session
  - list-devin-user-request-all-session
  - report-table
  - use-bun-shell
  - search-files-patterns
---

## Goal

แสดงรายการ user requests ทั้งหมดทีเกิดขึ้นใน repository ปัจจุบัน โดยรวมจาก history summaries ของ Devin sessions แล้วกรองข้อความซ้ำ

## Scope

ใช้เมื่อต้องการดู request history ของ repo ปัจจุบัน เพื่อวิเคราะห์ features หรือ tasks ทีเคยสั่ง รองรับ limit และแสดงสถิติ

## Execute

### 1. Detect Current Repo

> Goal: หา root path ของ repository ปัจจุบัน

1. รัน `git rev-parse --show-toplevel` หรือ `Get-Location`
2. ถ้าไม่อยู่ใน git repo ใช้ current working directory
3. Normalize path เป้น absolute path (แปลง `/` เป้น `\` บน Windows)
4. ถ้า user ระบุ repo path มา ใช้ค่านั้นแทน

### 2. Scan Summaries

> Goal: หา history summaries ของ sessions ใน repo นี้

1. หา `%APPDATA%\devin\cli\summaries\history_*.md`
2. สำหรับแต่ละไฟล์ อ่าน 2000 ตัวอักษรแรก
3. ถ้า head มี repo path → อ่านเนื้อหาทั้งหมด
4. ข้ามไฟล์ทีไม่เกี่ยวข้อง

### 3. Extract User Requests

> Goal: ดึงเฉพาะข้อความที user ส่ง

1. ค้นหา `=== MESSAGE N - User ===`
2. อ่านเนื้อหาจนถึง `=== MESSAGE` ถัดไป
3. ลบ metadata tags: `<available_skills>`, `<additional_metadata>`, `<system_guidance>`, `<system_info>`, `<rules>`
4. ข้ามเนื้อหาทีสั้นกว่า 2 ตัวอักษร

### 4. Deduplicate

> Goal: กรอง request ทีซ้ำกัน

1. Normalize ข้อความ: trim, lowercase, collapse whitespace
2. ใช้ Map/Set เก็บ unique ตาม normalized key
3. เก็บตัวอย่างล่าสุดของแต่ละ unique request
4. นับจำนวน raw requests และ unique requests

### 5. Sort And Limit

> Goal: จัดเรียงและจำกัดผลลัพธ์

1. เรียงตาม `LastWriteTime` ของ history file จากใหม่ไปเก่า
2. ถ้า user ระบุ `limit` ใช้ค่านั้น ถ้าไม่ระบุใช้ `50`
3. ตัดข้อความยาวเกิน `120` ตัวอักษร แล้วเติม `...`

### 6. Report

> Goal: แสดงผลลัพธ์

1. ทำ `/report-table` คอลัมน์: `No`, `Request`, `Session`, `Msg`
2. แสดงสถิติ: จำนวน files ที match, total requests, unique requests
3. ถ้าไม่พบ → report ว่าไม่มี requests ใน repo นี้

## Rules

- ไม่แก้ไข history summaries
- เปิดอ่านไฟล์เท่านั้น
- ใช้ `limit` default ถ้า user ไม่ระบุ
- ลบ metadata ก่อน deduplicate
- ใช้ path เป้น absolute เสมอ
- ใช้ `/report-table` สำหรับ output

## Expected Outcome

- ได้ตาราง user requests ใน repo ปัจจุบัน ไม่ซ้ำ
- รู้จำนวน files ที match, total requests, unique requests
- สามารถนำรายการไปสร้าง TODO หรือ queue ต่อได้
