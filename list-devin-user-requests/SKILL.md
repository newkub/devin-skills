---
name: list-devin-user-requests
description: รายการ requests จาก user ตาม scope — ทุก session, session นี้ หรือ repo นี้
argument-hint: "[--scope all|session|repo]"
related:
  - list-devin-session
  - idea-from-session
  - report-table
  - summarize
  - search-files-patterns
  - use-bun-shell

---

## Goal

แสดงรายการ requests ที่ user ส่ง โดยอ่านจาก `history_*.md` ใน `%APPDATA%\devin\cli\summaries` ตาม scope ที่เลือก

## Scope

- `--scope all` (default): requests ทุก session สำหรับ analytics หรือค้นหา patterns
- `--scope session`: เฉพาะ session ปัจจุบัน
- `--scope repo`: เฉพาะ sessions ที่ทำงานใน repo ปัจจุบัน
- อ่านอย่างเดียว ไม่แก้ไข history files

## Execute

### 1. Discover Session Files

> Goal: หา history files ตาม scope

1. หา directory `%APPDATA%\devin\cli\summaries`
2. `--scope all` → list `history_*.md` ทั้งหมด
3. `--scope session` → ใช้ history file ของ session ปัจจุบัน
4. `--scope repo` → กรอง sessions ที่ระบุ workspace เดียวกับ repo ปัจจุบัน
5. บันทึกจำนวน sessions ที่พบ

### 2. Extract User Requests

> Goal: ดึง user messages จากแต่ละ file

1. ค้นหา `=== MESSAGE N - User ===` ในแต่ละ file
2. อ่านเนื้อหาจนถึง `=== MESSAGE` ถัดไป
3. บันทึก session file, message number, เนื้อหา
4. ไฟล์ใหญ่ → อ่านเฉพาะ headings ก่อนแล้วค่อย read บริเวณ user messages

### 3. Format And Report

> Goal: สรุปเป็น table

1. ทำ `/report-table` คอลัมน์: No., Session, Request, Type, Length
2. ตัด request ยาว > 80 ตัวอักษร แล้วเติม `...`
3. เรียงตาม session (ใหม่ไปเก่า) แล้ว message number
4. ระบุสถิติ: จำนวน sessions, จำนวน requests

## Rules

- ไม่โหลดทุก file พร้อมกัน ใช้ streaming
- ไม่รวม system หรือ assistant messages
- ไม่แก้ไข history files
- ใช้ `/report-table` เสมอ

## Expected Outcome

- ตาราง requests ตาม scope พร้อมสถิติ

- รวม capability จาก skills เดิมที่ถูก merge เข้าตัวนี้ (merged from: list-devin-user-request-all-session, list-devin-user-request-in-this-session, list-devin-user-request-this-repo)
