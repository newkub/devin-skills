---
name: list-repo-in-github-star
description: รายการ repositories ที starred บน GitHub เรียงตามล่าสุด
argument-hint: "[username]"
related:
  - search-in-github-star
  - follow-tool-gh
---

## Goal

รายการ repositories ที user (หรือ username ทีระบุ) ได้ star ไว้บน GitHub เรียงลำดับตามวันที star ล่าสุด

## Scope

- ใช้ `gh api` เพื่อดึงรายการ starred repositories
- รองรับทั้ง current authenticated user และ public user
- เรียงตาม `starred_at` หรือ `created` ล่าสุด
- รองรับ pagination

## Execute

### 1. Verify gh CLI

> Goal: ตรวจสอบสภาพแวดล้อม

1. รัน `gh --version`
2. รัน `gh auth status` เพื่อตรวจสอบ login
3. ถ้าไม่ login → แจ้ง user ให้ `gh auth login`

### 2. Identify User

> Goal: ระบุ user ทีต้องการดู starred

1. ถ้า user ระบุ username → ใช้ `users/<username>/starred`
2. ถ้าไม่ระบุ → ใช้ `user/starred` (current auth)
3. ถ้าต้องการ private starred ของตัวเอง → ต้องใช้ `user/starred` พร้อม auth

### 3. Fetch Starred Repos

> Goal: ดึงรายการ repo ที star

1. ใช้ `gh api --paginate <endpoint>?sort=created&direction=desc&per_page=100`
   - current user: `gh api --paginate user/starred?sort=created&direction=desc&per_page=100`
   - public user: `gh api --paginate users/<username>/starred?sort=created&direction=desc&per_page=100`
2. ถ้า `gh` ไม่รองรับ `sort=created` บาง endpoint → sort ด้วย `--jq` หลังได้ JSON
3. บันทึก JSON output

### 4. Parse And Sort

> Goal: จัดรูปแบบและเรียงลำดับ

1. ดึง fields:
   - `full_name`
   - `html_url`
   - `description`
   - `stargazers_count`
   - `language`
   - `pushed_at`
   - `starred_at` (ถ้ามี)
2. เรียงตาม `starred_at` หรือ `created_at` จากใหม่ไปเก่า
3. กรองตาม keyword หรือ language ถ้า user ต้องการ

### 5. Report

> Goal: แสดงผลให้อ่านง่าย

1. สร้างตาราง: #, Full Name, Stars, Language, Pushed, Starred At
2. แสดง summary: จำนวน repo, top languages
3. ระบุ user ทีตรวจสอบ

## Rules

### 1. Sorting

- เรียงตาม latest starred เสมอ
- ถ้า API ไม่ sort ให้ → sort ด้วย `jq` หรือ script
- default direction คือ descending

### 2. Pagination

- ใช้ `--paginate` สำหรับ repo มากกว่า 100
- ถ้า user ต้องการจำกัด → ใช้ `--method GET` พร้อม `per_page` และ `page`
- ระวัง rate limit (GitHub API limit 5,000 requests/ชม)

### 3. Privacy

- ไม่แสดง token หรือ secrets
- ถ้า username private → ต้องมี scope `read:user`
- ถ้าไม่มีสิทธิ์ → แจ้ง user

## Expected Outcome

- ตาราง repositories ที starred เรียงตาม latest
- ระบุจำนวน repo, top languages, user
- ถ้า fail แสดงสาเหตุและแนวทางแก้ไข
