---
name: list-github-latest-star
description: แสดง 50 starred repositories ล่าสุดของ authenticated user
allowed-tools:
  - read
  - edit
  - grep
  - glob
  - exec
triggers:
  - user
  - model
related: []
---
## Goal

แสดง 50 starred repositories ล่าสุดของ authenticated user บน GitHub

## Scope

ใช้สำหรับดู starred repositories ล่าสุดเพื่อติดตาม projects ที่สนใจ

## Execute

### 1. Get Authenticated User
> Goal: Get Authenticated User

1. ทำ `mcp7_get_me` เพื่อรับ GitHub username
2. บันทึก username สำหรับใช้ใน step ถัดไป

### 2. List Starred Repositories
> Goal: List Starred Repositories

1. รัน `gh api user/starred --paginate --jq '.[0:50] | sort_by(.pushed_at) | reverse'` สำหรับดู 50 อันล่าสุด
2. ถ้าไม่มี `gh` CLI ให้ใช้ `mcp7_search_repositories` ด้วย `user:{username} stars:>0 sort:updated` เป็น fallback

### 3. Format Output
> Goal: Format Output

1. ทำ `/report-table` เพื่อจัดรูปแบบเป็นตาราง
2. กำหนด columns:
   - No. ลำดับ
   - Owner เจ้าของ repo
   - Name ชื่อ repository
   - Description คำอธิบาย
   - Language ภาษาหลัก
   - Stars จำนวน stars ทั้งหมด
   - Updated วันที่อัปเดตล่าสุด

## Rules

### 1. API Usage

- ใช้ `gh api user/starred` สำหรับ list starred repos (ไม่มี MCP tool โดยตรง)
- ใช้ `--paginate` สำหรับดูทั้งหมด
- ใช้ `--jq` สำหรับ filter และ sort 50 อันล่าสุด
- Fallback: ใช้ `mcp7_search_repositories` ด้วย `user:{username} stars:>0`

### 2. Output Format

- ทำ `/report-table` สำหรับจัดรูปแบบผลลัพธ์
- จำกัด 50 อันล่าสุด
- เรียงตามวันที่อัปเดตล่าสุด
- แสดงข้อมูลสำคัญ: owner, name, description, language, stars, updated

## Expected Outcome

- รายการ 50 starred repositories ล่าสุด
- จัดรูปแบบเป็นตารางที่อ่านง่าย
- ข้อมูลครบถ้วน: owner, name, description, language, stars, updated
