---
name: list-recent-bookmark-raindrop
description: รายการ bookmarks ล่าสุดจาก Raindrop.io เรียงตาม created
argument-hint: "[collection]"
related:
  - search
  - review-dependencies
  - report
---

## Goal

ดึง bookmarks ล่าสุดจาก Raindrop.io เรียงตาม `created` จากใหม่ไปเก่า ด้วยคำสั่งเดียว

## Scope

ใช้กับ `raindrop` CLI (`raindrop list`) — all collections หรือ collection ที่ระบุ

## Execute

### 1. List Bookmarks

> Goal: ดึง bookmarks ล่าสุดด้วยคำสั่งเดียว

1. รันคำสั่งนี้เลย:
   ```sh
   raindrop list --json --all --sort="-created" | jq -r '.[0:30] | .[] | [.title, .link, (.tags | join(", ")), .created] | @tsv'
   ```
2. เฉพาะ collection → `raindrop list <collection> --json --all --sort="-created" | jq ...`
3. sort ตามอัปเดตล่าสุด → `--sort="-lastUpdate"` หรือ `.[0:30]` เปลี่ยนจำนวนแถวตามต้องการ
4. ถ้า error auth → `raindrop auth status` แล้ว login ด้วย `RAINDROP_ACCESS_TOKEN` ผ่าน `--token-stdin`

### 2. Report

> Goal: แสดงผลเป็นตาราง

1. ใช้ `/report` สร้างตาราง: No, Title, Link, Tags, Created

## Rules

### 1. Sorting

- default: `--sort="-created"` (ใหม่ → เก่า)
- ระบุ sort field ใน report เสมอ

### 2. Read Only

- read-only — ห้ามใช้ `--force`
- ห้าม expose `RAINDROP_ACCESS_TOKEN` ใน command history

### 3. Output

- `--json` + `jq -r` เป็น default
- full JSON: `raindrop list --json --all --sort="-created"`

- ใช้ /search-raindrop ถ้าจำเป็น
- ใช้ /review-dependencies ถ้าจำเป็น

## Expected Outcome

- รายการ bookmarks ล่าสุดเรียงใหม่ → เก่า parse ด้วย `jq` หรือแสดงเป็นตาราง
- ไม่มี token หรือ secret รั่วไหล
