---
name: explore-github-trending
description: สำรวจ repository ทีกำลัง trending บน GitHub ตามภาษาและช่วงเวลา
argument-hint: "[language] [daily|weekly|monthly]"
related:
  - search-in-github-star
  - open-github-repo
  - open-web
  - report-table
  - search-files-patterns
---

## Goal

สำรวจ repository ทีกำลัง trending บน GitHub ตามภาษา หมวดหมู่ และช่วงเวลา

## Scope

- ใช้ GitHub Trending page (`https://github.com/trending`)
- รองรับ filter ตาม programming language
- รองรับช่วงเวลา `daily`, `weekly`, `monthly`
- ดึงข้อมูลด้วย web scraping หรือ search
- ไม่จำเป็นต้อง login

## Execute

### 1. Parse Input

> Goal: ระบุ language และ time range

1. รับ `language` และ `time range` จาก argument
2. ถ้าไม่ระบุ language → ใช้ `all` (ไม่กรองภาษา)
3. ถ้าไม่ระบุ time range → ค่าเริ่มต้น `daily`
4. ถ้า language ไม่ชัด → ใช้ `/enhance-prompt` หรือ `/ask-me`

### 2. Build Trending URL

> Goal: สร้าง URL สำหรับ GitHub Trending

1. base URL: `https://github.com/trending`
2. ถ้ามี language → เพิ่ม `?l=<language>`
3. ถ้ามี time range → เพิ่ม `&since=<daily|weekly|monthly>`
4. ตัวอย่าง: `https://github.com/trending?l=typescript&since=weekly`

### 3. Fetch Trending Page

> Goal: ดึงข้อมูลจาก GitHub Trending

1. ใช้ `webfetch` หรือ `crw_scrape` ดึง HTML จาก URL
2. ถ้าไม่สามารถ scrape ได้ → ใช้ `web_search` ค้นหา `site:github.com/trending <language>`
3. ถ้า redirect → ตาม redirect ไปยังหน้าใหม่
4. ตรวจสอบ HTTP status 200

### 4. Parse Repositories

> Goal: แยกข้อมูล repo จาก HTML

1. หา list ของ repo cards (ปกติอยู่ใน `article` หรือ `h2 > a`)
2. ดึงข้อมูลแต่ละ repo:
   - `owner/repo` จาก `href`
   - `description` จาก paragraph ใต้ชื่อ repo
   - `language` จาก badge
   - `stars today` จากจำนวน stars ที่เพิ่มในช่วงเวลา
   - `total stars` ถ้าแสดง
   - `forks` ถ้าแสดง
3. จัดเรียงตามลำดับบนหน้า
4. ถ้า HTML เปลี่ยน ให้ใช้ `search-files-patterns` หรือ regex ช่วย

### 5. Format Output

> Goal: แสดงผลอ่านง่าย

1. ใช้ `/report-table` สร้างตาราง
2. คอลัมน์: `No.`, `Repository`, `Description`, `Language`, `Stars Today`, `Total Stars`, `Forks`
3. เรียงตาม `No.` ตามลำดับบน GitHub Trending
4. ถ้ามากกว่า 25 รายการ → แสดง top 25 พร้อมบอกว่าเหลืออีกกี่รายการ

### 6. Deep Dive Or Open

> Goal: ให้ user ดูรายละเอียด repo ทีสนใจ

1. ถ้า user ระบุ repo → เปิด `/open-github-repo <owner>/<repo>`
2. ถ้าต้องการ search ใน GitHub stars → ใช้ `/search-in-github-star <repo>`
3. ถ้าต้องการดู release → เปิด `https://github.com/<owner>/<repo>/releases`

## Rules

### 1. URL Construction

- base: `https://github.com/trending`
- language: `?l=<language>`
- time: `&since=daily|weekly|monthly`
- ถ้าไม่มี language → `?since=daily`

### 2. No Authentication

- ไม่ต้อง `gh auth`
- GitHub Trending เปิดให้ดูโดยไม่ login
- ถ้าเจอหน้า login ให้แจ้ง user

### 3. Parsing Resilience

- ถ้า selector ไม่เจอ ให้ลอง regex หรือ string match
- ถ้า GitHub เปลี่ยน layout ให้ใช้ `web_search` แทนหรือหยุด report
- ไม่ hardcode index ของ HTML node

### 4. Rate and Cache

- ไม่ fetch ถี่เกินไป (ไม่เกินครั้งละ task)
- ถ้า user ขอช่วงเวลาเดียวกันซ้ำ ให้ใช้ผลเดิมได้ถ้ายัง fresh (ภายใน 1 ชั่วโมง)

### 5. Output

- ใช้ `/report-table` หรือ markdown table
- แสดง URL ทีใช้ fetch
- ระบุเวลา (daily/weekly/monthly) และ language

## Expected Outcome

- รายการ trending repositories บน GitHub
- ข้อมูล language, stars today, description
- แสดงผลในรูปแบบตาราง
- สามารถเปิด repo ทีสนใจได้
