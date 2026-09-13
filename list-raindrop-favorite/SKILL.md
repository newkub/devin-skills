---
name: list-raindrop-favorite
description: รายการ bookmarks ที่ favorite (important) จาก Raindrop.io
argument-hint: "[collection]"
related:
  - list-recent-bookmark-raindrop
  - search
  - report
---

## Goal

ดึง bookmarks ที่ mark เป็น favorite (`important:true`) จาก Raindrop.io ด้วยคำสั่งเดียว

## Scope

ใช้กับ `raindrop` CLI v0.1.x — `raindrop list --favorites` (server-side filter) หรือ `raindrop search "important:true"` เมื่อต้อง combine search operators

## Execute

### 1. List Favorites

> Goal: ดึง favorite bookmarks ด้วยคำสั่งเดียว

1. รันคำสั่งนี้เลย:
   ```sh
   raindrop list --favorites --json --all --sort="-created" | jq -r '.[] | [.title, .link, (.tags | join(", ")), .created] | @tsv'
   ```
2. เฉพาะ collection → `raindrop list <collection> --favorites --json --all | jq ...`
3. filter เพิ่มใน favorites: `--type article`, `--tag <tag>`, `-s "<query>"`
4. นับจำนวน: `raindrop list --favorites --json --all | jq 'length'`
5. ถ้า error auth → `raindrop auth status` แล้ว login ด้วย `raindrop auth token "$RAINDROP_ACCESS_TOKEN"` หรือ `raindrop auth login` (OAuth)

### 2. Alternative — Search

> Goal: ค้นหา favorites เมื่อ list ไม่พอ

1. `raindrop search "tag:rust" --type link --collection <id> --json` เมื่อต้อง combine operators เช่น `tag:rust` + `--collection` (หมายเหตุ: `raindrop search` ไม่มี `--favorites`/`important:` operator — favorites ใช้ `raindrop list --favorites` เท่านั้น)

### 3. Report

> Goal: แสดงผลเป็นตาราง

1. ใช้ `/report` สร้างตาราง: No, Title, Link, Tags, Created

## Rules

### 1. Server-Side Filter Only

- ใช้ `--favorites` (`-f`) หรือ `important:true` เท่านั้น — ห้าม filter `important` ฝั่ง `jq` เพราะ pagination ทำให้ miss ได้

### 2. Pagination

- `list`/`search` default คืนแค่ 50 รายการแรก — ใส่ `--all` เสมอถ้าต้องการครบ

### 3. Read Only

- read-only — ห้ามใช้ `--force`
- ห้าม expose `RAINDROP_ACCESS_TOKEN` ใน command history

### 4. Output

- `--json` + `jq -r` เป็น default

- ใช้ /search raindrop ถ้าจำเป็น
- ใช้ /list-recent-bookmark-raindrop ถ้าจำเป็น

## Expected Outcome

- รายการ favorite bookmarks ครบทุก page เรียงใหม่ → เก่า
- ไม่มี token หรือ secret รั่วไหล
