---
name: list-github-star-filter-bun
description: แสดง 50 starred repositories ล่าสุดทีเกี่ยวข้องกับ Bun
argument-hint: "[username]"
related:
  - list-github-star-latest
  - list-github-repo
  - report-table
---

## Goal

แสดง 50 starred repositories ล่าสุดทีเกี่ยวข้องกับ Bun ของ authenticated user หรือ user ทีระบุ

## Scope

ใช้สำหรับค้นหา starred repositories ทีเกี่ยวข้องกับ Bun runtime/package จาก projects ทีสนใจ รองรับทังผู้ใช้ปัจจุบันและ user อื่น

## Execute

### 1. Get Authenticated User

> Goal: Get Authenticated User

1. ทำ `mcp7_get_me` เพื่อรับ GitHub username ของผู้ใช้ปัจจุบัน
2. บันทึก username สำหรับใช้ใน step ถัดไป
3. ถ้า user ระบุ `[username]` → ใช้ username ทีระบุแทน

### 2. List And Filter Starred Repositories

> Goal: List And Filter Starred Repositories

1. ถ้าดูของ authenticated user ตัวเอง → รัน `gh api user/starred --paginate --jq '[.[] | select(((.topics // []) | map(ascii_downcase) | index("bun")) or ((.name // "") | ascii_downcase | contains("bun")) or ((.description // "") | ascii_downcase | contains("bun")))] | sort_by(.pushed_at) | reverse | .[0:50]'`
2. ถ้าดูของ user อื่น → รัน `gh api users/<username>/starred --paginate --jq '[.[] | select(((.topics // []) | map(ascii_downcase) | index("bun")) or ((.name // "") | ascii_downcase | contains("bun")) or ((.description // "") | ascii_downcase | contains("bun")))] | sort_by(.pushed_at) | reverse | .[0:50]'`
3. ถ้าไม่มี `gh` CLI ให้ใช้ `mcp7_search_repositories` ด้วย `topic:bun sort:updated` เป็น fallback

### 3. Format Output

> Goal: Format Output

1. ทำ `/report-table` เพื่อจัดรูปแบบเป็นตาราง
2. กำหนด columns:
   - No. ลำดับ
   - Owner เจ้าของ repo
   - Name ชื่อ repository
   - Description คำอธิบาย
   - Topics หัวข้อที่เกี่ยวข้อง
   - Stars จำนวน stars ทั้งหมด
   - Updated วันที่อัปเดตล่าสุด
3. แสดงสรุป: จำนวน Bun-related repos ทีเจอ

## Rules

### 1. API Usage

- ใช้ `gh api user/starred` สำหรับ authenticated user
- ใช้ `gh api users/<username>/starred` สำหรับ user อื่น
- ใช้ `--paginate` สำหรับดูทั้งหมด
- ใช้ `--jq` สำหรับ filter, sort และ limit 50 อันล่าสุด
- กรองจาก `topics`, `name`, หรือ `description` ทีมีคำว่า `bun` แบบ case-insensitive
- Fallback: ใช้ `mcp7_search_repositories` ด้วย `topic:bun sort:updated`
- ระวัง rate limit GitHub API

### 2. Output Format

- ทำ `/report-table` สำหรับจัดรูปแบบผลลัพธ์
- จำกัด 50 อันล่าสุด
- เรียงตามวันที่อัปเดตล่าสุด
- แสดงข้อมูลสำคัญ: owner, name, description, topics, stars, updated

### 3. Privacy

- ไม่แสดง token หรือ secrets
- ถ้า username private → ต้องมี scope `read:user`
- ถ้าไม่มีสิทธิ์ → แจ้ง user

- ใช้ /list-github-star-latest ถ้าจำเป็น
- ใช้ /list-github-repo ถ้าจำเป็น

## Expected Outcome

- รายการ 50 starred repositories ล่าสุดทีเกี่ยวข้องกับ Bun
- จัดรูปแบบเป็นตารางที่อ่านง่าย
- ข้อมูลครบถ้วน: owner, name, description, topics, stars, updated
