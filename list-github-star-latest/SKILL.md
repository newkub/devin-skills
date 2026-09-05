---
name: list-github-star-latest
description: แสดง 50 starred repositories ล่าสุดของ authenticated user หรือ user ทีระบุ
argument-hint: "[username]"
related:
  - list-github-repo
  - all-github-repo
  - report-table
---

## Goal

แสดง 50 starred repositories ล่าสุดของ authenticated user หรือ user ทีระบุบน GitHub

## Scope

ใช้สำหรับดู starred repositories ล่าสุดเพื่อติดตาม projects ที่สนใจ รองรับทังผู้ใช้ปัจจุบันและ user อื่น

ดูเพิ่มเติม: /all-github-repo, /list-github-repo

## Execute

### 1. Get Authenticated User

> Goal: Get Authenticated User

1. ทำ `mcp7_get_me` เพื่อรับ GitHub username ของผู้ใช้ปัจจุบัน
2. บันทึก username สำหรับใช้ใน step ถัดไป
3. ถ้า user ระบุ `[username]` → ใช้ username ทีระบุแทน

### 2. List Starred Repositories

> Goal: List Starred Repositories

1. ถ้าดูของ authenticated user ตัวเอง → รัน `gh api user/starred --paginate --jq 'sort_by(.pushed_at) | reverse | .[0:50]'`
2. ถ้าดูของ user อื่น → รัน `gh api users/<username>/starred --paginate --jq 'sort_by(.pushed_at) | reverse | .[0:50]'`
3. ถ้าไม่มี `gh` CLI ให้ใช้ `mcp7_search_repositories` ด้วย `user:{username} stars:>0 sort:updated` เป็น fallback

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
3. แสดงสรุป: จำนวน repo, top languages

## Rules

### 1. API Usage

- ใช้ `gh api user/starred` สำหรับ authenticated user
- ใช้ `gh api users/<username>/starred` สำหรับ user อื่น
- ใช้ `--paginate` สำหรับดูทั้งหมด
- ใช้ `--jq` สำหรับ sort และ limit 50 อันล่าสุด
- Fallback: ใช้ `mcp7_search_repositories` ด้วย `user:{username} stars:>0 sort:updated`
- ระวัง rate limit GitHub API

### 2. Output Format

- ทำ `/report-table` สำหรับจัดรูปแบบผลลัพธ์
- จำกัด 50 อันล่าสุด
- เรียงตามวันที่อัปเดตล่าสุด
- แสดงข้อมูลสำคัญ: owner, name, description, language, stars, updated
- แสดงสรุป top languages

### 3. Privacy

- ไม่แสดง token หรือ secrets
- ถ้า username private → ต้องมี scope `read:user`
- ถ้าไม่มีสิทธิ์ → แจ้ง user

- ใช้ /list-github-repo ถ้าจำเป็น

## Expected Outcome

- รายการ 50 starred repositories ล่าสุด
- จัดรูปแบบเป็นตารางที่อ่านง่าย
- ข้อมูลครบถ้วน: owner, name, description, language, stars, updated
- สรุปจำนวน repo และ top languages
