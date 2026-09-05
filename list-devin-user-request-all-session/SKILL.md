---
name: list-devin-user-request-all-session
description: รายการ requests จาก user ทังหมด sessions จาก history summaries
argument-hint: "[scope]"
related:
  - list-devin-user-request-this-repo
  - list-devin-user-request-in-this-session
  - report-table
  - summarize
  - search-files-patterns
---

## Goal

แสดงรายการ requests ที user ส่งในทุก session โดยอ่านจาก `history_*.md` ทั้งหมดใน `%APPDATA%\devin\cli\summaries`

## Scope

ใช้เมื่อต้องการดู requests จาก user ทังหมดใน sessions ทีเคยมี สำหรับ analytics หรือค้นหา patterns

## Execute

### 1. Discover Session Files

> Goal: หา history files ทังหมด

1. หา directory `%APPDATA%\devin\cli\summaries`
2. list `history_*.md` ทังหมด
3. บันทึกจำนวน sessions

### 2. Extract User Requests Per Session

> Goal: ดึง user requests จากทุก session

1. สำหรับแต่ละ file:
   - ค้นหา `=== MESSAGE N - User ===`
   - อ่านเนื้อหาหลังหัวข้อจนถึง `=== MESSAGE` ถัดไป
   - บันทึก session file, message number, เนื้อหา
2. ถ้า file ใหญ่มาก → อ่านเฉพาะ headings ก่อนแล้วค่อย read บริเวณ user messages
3. รวม requests จากทุก session

### 3. Format And Report

> Goal: สรุปเป็น table

1. ทำ `/report-table` คอลัมน์: No, Session, Request, Type, Length
2. ถ้า request ยาว > 80 ตัวอักษร ตัดเหลือ 80 ตัวแล้วเติม `...`
3. เรียงตาม session (ใหม่ไปเก่า) แล้ว message number
4. ระบุสถิติ: จำนวน sessions, จำนวน requests

## Rules

- ไม่โหลด file ทังหมดลง memory พร้อมกันถ้ามีมาก ใช้ streaming
- ไม่รวม system หรือ assistant messages
- ไม่แก้ไข history files
- ถ้าไม่พบ summaries → report

- ใช้ /list-devin-user-request-this-repo ถ้าจำเป็น
- ใช้ /list-devin-user-request-in-this-session ถ้าจำเป็น
- ใช้ /summarize ถ้าจำเป็น
- ใช้ /search-files-patterns ถ้าจำเป็น

## Expected Outcome

- ได้รายการ requests จาก user ทังหมด sessions
- Table รวมทุก session
- สถิติ sessions และ requests
