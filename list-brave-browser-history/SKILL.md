---
name: list-brave-browser-history
description: รายการประวัติการเข้าเว็บจาก Brave browser
related:
  - search-in-raindrop-io
  - list-raindrop-io
---

## Goal

ดึงประวัติการเข้าเว็บจาก Brave browser history database แล้วรายงานเป็น list หรือ table

## Scope

ใช้บน Windows เพื่ออ่าน SQLite database ของ Brave (`History`) และรายงาน URL, title, timestamp, visit count

## Execute

### 1. Locate Brave History Database

> Goal: หา path ของ SQLite database

1. ระบุ OS:
   - Windows: `%LOCALAPPDATA%\BraveSoftware\Brave-Browser\User Data\Default\History`
   - macOS: `~/Library/Application Support/BraveSoftware/Brave-Browser/Default/History`
   - Linux: `~/.config/BraveSoftware/Brave-Browser/Default/History`
2. ตรวจสอบว่าไฟล์มีอยู่จริง
3. ถ้าไม่เจอ profile อื่น → list profiles ใน `User Data/`

### 2. Copy Database Safely

> Goal: หลีกเลี่ยง lock ขณะ Brave กำลังทำงาน

1. สร้าง temp copy ด้วย `cp` หรือ `Copy-Item`
2. วางใน `%TEMP%\brave-history-<timestamp>.db`
3. ไม่แก้ไข database ต้นฉบับ

### 3. Query History

> Goal: ดึง history records

1. ใช้ `sqlite3` หรือ `bun sqlite` query copy
2. SQL:
   ```sql
   SELECT urls.url, urls.title, urls.visit_count, visits.visit_time
   FROM urls
   JOIN visits ON urls.id = visits.url
   ORDER BY visits.visit_time DESC
   LIMIT <limit>
   ```
3. แปลง `visit_time` จาก microseconds ไป ISO timestamp
4. ถ้าไม่มี `sqlite3` → ใช้ `bun add -g sqlite3` หรือ tool อื่น

### 4. Filter And Format

> Goal: รายงานเฉพาะข้อมูลทีต้องการ

1. กรองตาม keyword, domain, หรือ date range (ถ้า user ระบุ)
2. สร้าง table: Time, Title, URL, VisitCount
3. รองรับ output เป็น markdown หรือ JSON

### 5. Report

> Goal: สรุปผล

1. รายงานจำนวน records
2. แสดง top recent visits
3. ถ้ามี filter → ระบุเงื่ือนไข

## Rules

- ไม่แก้ไข database ต้นฉบับ
- copy database ก่อนอ่านเสมอ
- ไม่ expose sensitive URLs โดยไม่จำเป็น
- ห้ามลบ history
- ถ้า Brave กำลังทำงาน → ใช้ copy

- ใช้ /search-in-raindrop-io ถ้าจำเป็น
- ใช้ /list-raindrop-io ถ้าจำเป็น

## Expected Outcome

- ได้รายการ Brave browser history
- ข้อมูลครบ: time, title, URL, visit count
- Database ต้นฉบับไม่ถูกเปลี่ยนแปลง
