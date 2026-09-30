---
name: search-request-in-devin-session
description: ค้นหา keyword/pattern ใน user requests ข้าม Devin sessions — เจอ request ไหน session ไหน เมื่อไร
argument-hint: "[keyword-or-pattern] [--scope all|session|repo]"
related:
  - list-devin-session
  - list-request-devin-session
  - report
  - search
  - follow-context-engineering
---

## Goal

ค้นหา requests ที่ user เคยส่ง โดย match `keyword` หรือ regex pattern กับเนื้อหา user messages ใน `history_*.md` ที่ `%APPDATA%\devin\cli\summaries` — ตอบว่า request นั้นอยู่ใน session ไหน message ไหน เมื่อไร

## Scope

- `keyword-or-pattern` (required): ข้อความหรือ regex ที่ต้องการค้น — ต้องระบุเสมอ
- `--scope all` (default): ค้นทุก session
- `--scope session`: เฉพาะ session ปัจจุบัน
- `--scope repo`: เฉพาะ sessions ที่ทำงานใน repo ปัจจุบัน
- ค้นเฉพาะ user messages (`=== MESSAGE N - User ===`) — ไม่ค้น assistant/system messages
- อ่านอย่างเดียว ไม่แก้ไข history files
- ต้องการ list requests ทั้งหมดโดยไม่ filter → ใช้ `/list-request-devin-session` แทน

## Execute

### 1. Parse Arguments

> Goal: ได้ pattern และ scope ที่ชัดเจน

1. รับ `keyword-or-pattern` — ถ้าไม่ระบุ → ถาม user ด้วย `/ask-me`
2. ตัดสินใจ match mode:
   - มี regex metachars (`.*`, `^`, `$`, `[`, `]`, `\d` ฯลฯ) → regex search
   - อื่นๆ → literal/case-insensitive keyword search
3. Parse `--scope` (default `all`)

### 2. Discover Session Files

> Goal: หา history files ตาม scope — เหมือน `/list-request-devin-session` `### 1`

1. หา directory `%APPDATA%\devin\cli\summaries`
2. `--scope all` → `history_*.md` ทั้งหมด
3. `--scope session` → history file ของ session ปัจจุบัน
4. `--scope repo` → กรอง sessions ที่ workspace ตรง repo ปัจจุบัน
5. เรียงตาม `LastWriteTime` ใหม่ไปเก่า

### 3. Search User Messages

> Goal: match เฉพาะ user message sections

1. ใช้ `grep` (ripgrep) pattern กับ `history_*.md` — จำกัด hits ด้วย context ของ `=== MESSAGE N - User ===` sections
2. สำหรับไฟล์ใหญ่ → ใช้ `grep` หา line numbers ของ `=== MESSAGE` markers ก่อน แล้ว `read` เฉพาะช่วง user messages ที่มี match
3. บันทึก: session file (id จากชื่อไฟล์), message number, matched line, surrounding context (±1 บรรทัด), file `LastWriteTime`
4. เก็บเฉพาะ matches ที่อยู่ใน `=== MESSAGE N - User ===` section — ตัด hits จาก assistant/system sections ทิ้ง

### 4. Format And Report

> Goal: นำเสนอผลที่ drill-down ต่อได้

1. ทำ `/report` คอลัมน์: No., Session, Msg #, Matched Text, Context, Date
2. ตัด matched text ยาว > 80 ตัวอักษร แล้วเติม `...`
3. เรียงตาม date ใหม่ไปเก่า แล้ว message number
4. ระบุสถิติ: จำนวน sessions ที่ค้น, จำนวน matches, pattern ที่ใช้
5. ชี้ session id + msg # ให้ user เปิดอ่านต่อได้ — หรือทำ `/list-devin-session` เพื่อดู session metadata

### 5. Handle No Match

> Goal: รายงานอย่างตรงไปตรงมา

1. ถ้าไม่พบ match → รายงานว่าไม่พบ พร้อม pattern และ scope ที่ใช้
2. เสนอทางเลือก: ลอง keyword สั้นลง, regex กว้างขึ้น, หรือขยาย `--scope`
3. ไม่เดา request ที่ user อาจหมายถึง

## Rules

- ค้นเฉพาะ `=== MESSAGE N - User ===` sections — ห้ามนับ assistant/system messages เป็น match
- ไม่โหลดทุก file พร้อมกัน — ใช้ grep ก่อน แล้ว read เฉพาะช่วงที่ match
- ไม่แก้ไข history files
- ใช้ `/report` เสมอ
- ใช้ `/list-devin-session` ถ้าต้องการ session metadata ของ match
- ใช้ `/use-bun-shell` หรือ ripgrep สำหรับ search

## Expected Outcome

- ตาราง matches พร้อม session id, message number, context และ date
- รองรับ literal keyword และ regex pattern + scope filtering
- รายงานสถิติและ no-match อย่างชัดเจน พร้อมทางเลือกถัดไป
