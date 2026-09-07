---
name: list-github-star
description: รายการ starred repositories บน GitHub รองรับ latest, filter ตาม language และค้นหา
argument-hint: "[username] [--lang <language>] [--limit <n>]"
related:
  - list-github-repo
  - all-github-repo
  - search-in-github-star
  - report-table
  - --


## Goal

แสดง starred repositories ของ authenticated user หรือ user ที่ระบุ รองรับดูล่าสุด, filter ตามภาษา และ pagination

## Scope

- ใช้สำหรับดู starred repositories เพื่อติดตาม projects ที่สนใจ
- รองรับผู้ใช้ปัจจุบันและ user อื่น (`[username]`)
- รองรับ filter ตามภาษา เช่น `--lang bun`, `--lang rust`
- default limit 50 repos

ดูเพิ่มเติม: /all-github-repo, /list-github-repo, /search-in-github-star

## Execute

### 1. Resolve User And Filters

> Goal: ได้ username และเงื่อนไข filter ที่ถูกต้อง

1. ทำ `mcp7_get_me` เพื่อรับ GitHub username ของผู้ใช้ปัจจุบัน
2. ถ้าระบุ `[username]` → ใช้ username ที่ระบุแทน
3. อ่าน `--lang <language>` และ `--limit <n>` (default 50) จาก arguments

### 2. List Starred Repositories

> Goal: ดึง starred repos ตาม filter

1. ถ้าดูของ authenticated user → `gh api user/starred --paginate --jq 'sort_by(.pushed_at) | reverse'`
2. ถ้าดูของ user อื่น → `gh api users/<username>/starred --paginate --jq 'sort_by(.pushed_at) | reverse'`
3. ถ้ามี `--lang` → filter ด้วย `map(select(.language | ascii_downcase == "<lang>"))`
   - สำหรับ `--lang bun` ให้ match ทั้ง `TypeScript`/`JavaScript` ที่เกี่ยวกับ Bun จาก description ด้วย
4. ตัดผลลัพธ์ตาม `--limit`
5. ถ้าไม่มี `gh` CLI → fallback เป็น `mcp7_search_repositories` ด้วย `user:{username} stars:>0`

### 3. Format Output

> Goal: แสดงผลเป็นตาราง

1. ทำ `/report-table` คอลัมน์: No., Owner, Name, Description, Language, Stars, Updated
2. แสดงสรุป: จำนวน repo, top languages, filter ที่ใช้

## Rules

- ใช้ `/report-table` เสมอ ห้าม plain list
- ระบุ filter ที่ใช้ใน report header
- ถ้าไม่พบ repo ตาม filter → รายงานจำนวน 0 พร้อมคำแนะนำ
- ไม่แก้ไข starred state ใด ๆ

## Expected Outcome

- ตาราง starred repositories ตาม scope/filter ที่ระบุ
- สรุปจำนวนและภาษาหลัก

- รวม capability จาก skills เดิมที่ถูก merge เข้าตัวนี้ (merged from: list-github-star-latest, list-repo-in-github-star, list-github-star-filter-bun, list-github-star-filter-rust)
