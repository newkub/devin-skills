---
name: list-devin-session
description: แสดงรายการ Devin sessions ทั้งหมดพร้อม title, mode, model, และเวลาใช้งานล่าสุด
argument-hint: "[limit] [keyword]"
related:
  - list-devin-user-request-in-this-session
  - list-devin-user-request-all-session
  - list-devin-user-request-this-repo
  - list-devin-global-skills
  - report-table
  - search-files-patterns
  - use-bun-shell
---

## Goal

แสดงรายการ Devin sessions ทั้งหมดจาก `%APPDATA%\devin\cli\sessions.db` พร้อม `id`, `title`, `working_directory`, `agent_mode`, `model`, `created_at`, และ `last_activity_at`

## Scope

ใช้เมื่อต้องการค้นหา กรอง หรือดูประวัติ sessions ทีเคยสร้าง รองรับการระบุจำนวนสูงสุด และ keyword สำหรับกรอง `title` หรือ `working_directory`

## Execute

### 1. Locate Sessions Database

> Goal: หาข้อมูล sessions ทีถูกต้อง

1. กำหนด path ของ sessions database เป็น `%APPDATA%\devin\cli\sessions.db`
2. ตรวจสอบว่าไฟล์มีอยู่จริงด้วย `find_file_by_name` หรือ `exec`
3. ถ้าไฟล์มีอยู่ → เปิดแบบ `readonly` ด้วย `bun:sqlite` หรือ `sqlite3` CLI
4. ถ้าไฟล์ไม่อยู่ หรืออ่านไม่ออก → fallback โดย list ไฟล์ `history_*.md` ใน `%APPDATA%\devin\cli\summaries`

### 2. Parse Arguments

> Goal: รับค่า limit และ keyword

1. รับ optional arguments จาก user:
   - `limit`: จำนวน sessions สูงสุด (default `50`)
   - `keyword`: คำค้นหาใน `title` หรือ `working_directory`
2. ถ้าไม่ระบุ `limit` ใช้ `50`
3. ถ้าไม่ระบุ `keyword` ไม่ต้องกรอง

### 3. Query Sessions

> Goal: ดึงรายการ sessions จาก database

1. สร้าง SQL query:
   ```sql
   SELECT id,
          title,
          working_directory,
          agent_mode,
          model,
          datetime(created_at, 'unixepoch', 'localtime') AS created,
          datetime(last_activity_at, 'unixepoch', 'localtime') AS last_activity
   FROM sessions
   WHERE hidden = 0
   ORDER BY last_activity_at DESC
   LIMIT ?
   ```
2. ถ้ามี `keyword` เพิ่ม `AND (title LIKE ? OR working_directory LIKE ?)` ก่อน `ORDER BY`
3. ใช้ `bun:sqlite` หรือ `sqlite3` CLI รันคำสั่งและรับผลลัพธ์เป็น JSON

### 4. Fallback From History Summaries

> Goal: แสดง sessions ถ้า database ไม่พร้อมใช้

1. ใช้ `search-files-patterns` หรือ `exec` หา `%APPDATA%\devin\cli\summaries\history_*.md`
2. เรียงตาม `LastWriteTime` จากใหม่ไปเก่า
3. สำหรับแต่ละไฟล์:
   - ใช้ส่วนชื่อไฟล์หลัง `history_` เป็น `id`
   - อ่านบรรทัดแรกของเนื้อหาทีขึ้นต้นด้วย `=== MESSAGE` หรือ `Summary:`
   - ใช้ `LastWriteTime` เป็น `last_activity`
4. จำกัดจำนวนตาม `limit`

### 5. Format And Report

> Goal: นำเสนอผลลัพธ์ให้อ่านง่าย

1. ทำ `/report-table` คอลัมน์: No, Session ID, Title, Working Directory, Mode, Model, Created, Last Activity
2. ถ้า `title` หรือ `working_directory` ยาว > 60 ตัวอักษร ตัดเหลือ 60 แล้วเติม `...`
3. เรียงตาม `last_activity` จากใหม่ไปเก่า
4. ระบุสถิติ: จำนวน sessions ทั้งหมดทีแสดง

### 6. Handle Empty Or Error

> Goal: รายงานสถานะทีถูกต้อง

1. ถ้าไม่พบ sessions → รายงานว่าไม่พบ
2. ถ้า database ถูก lock หรืออ่านไม่ออก → รายงาน error และลอง fallback
3. ถ้า query ไม่สำเร็จ → แสดง SQL error และ stop

## Rules

- เปิด database แบบ `readonly` เสมอ
- ไม่แก้ไข ลบ หรือซ่อน sessions
- ใช้ `bun:sqlite` เป็น primary tool สำหรับอ่าน `sessions.db`
- fallback ใช้ `search-files-patterns` หรือ `use-pwsh-shell` สำหรับ list `history_*.md`
- ถ้า user ไม่ระบุ `limit` ใช้ `50` เป็นค่า default
- ใช้ `/report-table` สำหรับ output

## Expected Outcome

- รายการ Devin sessions ในตารางพร้อม metadata สำคัญ
- รองรับ `limit` และ `keyword` filtering
- รายงานสถิติและสถานะ error ชัดเจน
