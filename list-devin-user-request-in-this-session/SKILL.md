---
name: list-devin-user-request-in-this-session
description: รายการ requests จาก user ใน session ปัจจุบันจาก history summary
related:
  - list-devin-user-request-this-repo
  - list-devin-user-request-all-session
  - report-table
  - summarize
  - search-files-patterns
---

## Goal

แสดงรายการ requests ที user ส่งใน session ปัจจุบัน โดยอ่านจาก `history_*.md` ล่าสุดใน `%APPDATA%\devin\cli\summaries`

## Scope

ใช้เมื่อต้องการดู requests ทังหมดที user ส่งใน session ปัจจุบัน โดยไม่รวม system หรือ assistant messages

## Execute

### 1. Locate Current Session

> Goal: หา history file ของ session ปัจจุบัน

1. หา directory `%APPDATA%\devin\cli\summaries`
2. เรียง `history_*.md` ตาม `LastWriteTime` จากใหม่ไปเก่า
3. เลือก file ล่าสุดเป็น session ปัจจุบัน
4. ถ้า user ระบุ path มา → ใช้ path นั้นแทน

### 2. Extract User Requests

> Goal: ดึงข้อความจาก user messages

1. ค้นหา sections ทีขึ้นต้นด้วย `=== MESSAGE N - User ===`
2. อ่านเนื้อหาหลังหัวข้อจนถึง `=== MESSAGE` ถัดไป
3. กรองเอาเฉพาะข้อความที user ส่งจริง ไม่รวม system metadata
4. บันทึกลำดับ message number เนื้อหาสั้นๆ และ timestamp (ถ้ามี)

### 3. Format And Report

> Goal: สรุปเป็น table

1. ทำ `/report-table` คอลัมน์: No, Request, Type, Length
2. ถ้า request ยาว > 100 ตัวอักษร ตัดเหลือ 100 ตัวแล้วเติม `...`
3. เรียงตามลำดับใน session
4. ระบุจำนวน requests ทังหมด

## Rules

- ไม่รวม `=== MESSAGE - System ===` หรือ `=== MESSAGE - Assistant ===`
- ถ้า history file ไม่อยู่ → stop และ report
- ถ้าไม่มี user request → report ว่าไม่พบ
- ไม่สร้างหรือแก้ไข history file

## Expected Outcome

- ได้รายการ requests ของ user ใน session ปัจจุบัน
- รูปแบบ table ชัดเจน
- รายงานจำนวน requests
