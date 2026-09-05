---
name: list-raindrop-io
description: รายการ bookmarks จาก Raindrop.io เรียงตามล่าสุด
argument-hint: "[scope]"
related:
  - search-in-raindrop-io
  - follow-my-tech-stack
  - follow-my-global-cli
  - use-scripts
  - report-table
---

## Goal

ดึงรายการ bookmarks ทั้งหมดหรือจาก collection ที่ระบุจาก Raindrop.io เรียงตามวันทีเพิ่มหรืออัปเดตล่าสุด

## Scope

ใช้กับ `jvm/raindrop-cli` สำหรับแสดง bookmarks ล่าสุด รองรับทั้ง all collections และ collection เฉพาะ

## Execute

### 1. Ensure CLI Is Ready

> Goal: ตรวจสอบ raindrop CLI และ authentication

1. รัน `raindrop --version` — ถ้าไม่มี → ทำ `/follow-my-global-cli`
2. รัน `raindrop auth status`
3. ถ้ายังไม่ authenticated → รัน `printf '%s' "$RAINDROP_ACCESS_TOKEN" | raindrop auth login --token-stdin`
4. รัน `raindrop doctor` เพื่อ verify config, auth, และ API connectivity

### 2. List Bookmarks

> Goal: ดึง bookmarks จาก Raindrop.io

1. รัน `raindrop bookmark search "" --sort created` เพื่อ list ทั้งหมดเรียงตาม created ล่าสุด
2. ถ้า CLI รองรับ → ใช้ `raindrop bookmark list --sort lastUpdate` หรือ `raindrop bookmark list --sort created`
3. ถ้าต้องการเฉพาะ collection → ใช้ `raindrop bookmark search "" --collection <id> --sort created`
4. จำกัดจำนวนด้วย `--limit <n>` ถ้าจำเป็น

### 3. Sort By Latest

> Goal: เรียงผลลัพธ์ตามล่าสุด

1. ถ้า CLI sort ไม่ทำงานตามคาด → ใช้ `jq` sort ด้วย field `.created` หรือ `.lastUpdate`
   ```sh
   raindrop bookmark search "" | jq '.items | sort_by(.created) | reverse'
   ```
2. ถ้าต้องการ sort ตามวันทีอัปเดต → ใช้ `.lastUpdate` แทน `.created`
3. ถ้าต้องการเฉพาะฟิลด์สำคัญ → pipe ผ่าน `jq` เพื่อเลือก `title`, `link`, `tags`, `created`, `lastUpdate`

### 4. Format Output

> Goal: แสดงผลในรูปแบบทีอ่านง่าย

1. JSON full: `raindrop bookmark search "" --sort created`
2. Extract ฟิลด์ด้วย `jq`:
   - title: `| jq -r '.items[].title'`
   - url: `| jq -r '.items[].link'`
   - created: `| jq -r '.items[].created'`
   - tags: `| jq -r '.items[].tags[]'`
3. ใช้ `/report-table` เพื่อสร้างตาราง: No, Title, Link, Tags, Created
4. บันทึกลงไฟล์: `raindrop bookmark search "" --sort created > raindrop-latest.json`

### 5. Handle Pagination And Empty Results

> Goal: รองรับข้อมูลมากและกรณีทีไม่มีข้อมูล

1. ถ้ามี pagination → ใช้ `--page <n>` หรือ `--offset <n>` ตามที CLI รองรับ
2. ถ้าผลว่าง → ตรวจสอบ auth, collection id, และ query
3. ถ้า API error → อ่าน stderr แล้ว retry ตาม rate limit

## Rules

### 1. Sorting

- ค่า default คือ sort ตาม `created` จากใหม่ไปเก่า (descending)
- ถ้า CLI ไม่รองรับ descending ให้ sort ด้วย `jq` แล้ว reverse
- ระบุ field ทีใช้ sort ใน report เสมอ

### 2. Read Only

- list เป็น read-only — ไม่ใช้ `--force`
- อย่า expose `RAINDROP_ACCESS_TOKEN` ใน command history
- ใช้ `raindrop doctor` ก่อนถ้าทำงานไม่ได้

### 3. Output

- JSON เป็น default เหมาะกับ `jq`
- `--human` ถ้า CLI รองรับและต้องการอ่านทันที
- ใช้ `jq -r` เพื่อ raw string output

- ใช้ /search-in-raindrop-io ถ้าจำเป็น
- ใช้ /follow-my-tech-stack ถ้าจำเป็น
- ใช้ /use-scripts ถ้าจำเป็น

## Expected Outcome

- รายการ bookmarks จาก Raindrop.io ทั้งหมดหรือจาก collection ที่ระบุ
- เรียงลำดับจากล่าสุดไปยังเก่า
- ผลลัพธ์สามารถ parse ด้วย `jq` หรือแสดงเป็นตาราง
- ไม่มี token หรือ secret รั่วไหล
