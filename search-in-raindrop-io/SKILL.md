---
name: search-in-raindrop-io
description: Search Raindrop.io bookmarks via raindrop CLI with filters, output formats, and result parsing
argument-hint: "[query]"
---

## Goal

ค้นหาและดึง bookmarks จาก Raindrop.io อย่างรวดเร็วและแม่นยำโดยใช้ raindrop CLI

## Scope

ใช้กับ `jvm/raindrop-cli` สำหรับค้นหา Raindrop.io เท่านั้น ครอบคลุม authentication, query syntax, filters, output formats และ result parsing

## Execute

### 1. Ensure CLI Is Ready

> Goal: Set up raindrop CLI and confirm authentication before searching

1. รัน `raindrop --version` — ถ้าไม่มี → ทำ `/follow-tool-my-global-cli` เพื่อติดตั้ง
2. รัน `raindrop auth status`
3. ถ้ายังไม่ authenticated → รัน `printf '%s' "$RAINDROP_ACCESS_TOKEN" | raindrop auth login --token-stdin`
4. รัน `raindrop doctor` เพื่อ verify config, auth, และ API connectivity
5. ถ้า doctor พบ issue → แก้ไขตาม error message ก่อนค้นหา

### 2. Search Bookmarks

> Goal: Run search queries against Raindrop.io

1. รัน `raindrop bookmark search "<query>"` สำหรับ full-text search
2. ใช้ `raindrop bookmark search "<query>" --collection <id>` เพื่อจำกัด collection
3. ใช้ `raindrop bookmark search "<query>" --limit <n>` เพื่อจำกัดจำนวน
4. ใช้ `raindrop bookmark search "<query>" --sort score|created|updated` เพื่อเรียงผล
5. ใช้ `raindrop bookmark search "<query>" --page <n>` สำหรับ pagination
6. Output เริ่มต้นเป็น JSON — ใช้ `jq` สำหรับ extract ฟิลด์ เช่น `raindrop bookmark search "api" | jq -r '.items[].title'`

### 3. Use Search Filters

> Goal: Apply Raindrop search operators

1. tag filter: `tag:<tag>` เช่น `tag:typescript`
2. type filter: `type:article|image|video|document|audio`
3. domain filter: `domain:<domain>` เช่น `domain:github.com`
4. collection filter: ใช้ `--collection <id>` หรือ `collection:<id>` ถ้า CLI รองรับ
5. important filter: `important:true` สำหรับ favorites
6. broken filter: `broken:true` สำหรับ broken links
7. combine filters: `raindrop bookmark search "tag:api type:article domain:docs.rs" --collection 0`

### 4. Format And Parse Results

> Goal: Present search results in a useful format

1. default JSON: `raindrop bookmark search "<query>"`
2. human-readable table: `raindrop bookmark search "<query>" --human` ถ้า CLI รองรับ
3. extract with `jq`:
   - title: `| jq -r '.items[].title'`
   - url: `| jq -r '.items[].link'`
   - tags: `| jq -r '.items[].tags[]'`
   - id: `| jq -r '.items[]._id'`
4. บันทึกผลลงไฟล์: `raindrop bookmark search "<query>" > results.json`
5. นับจำนวนผล: `raindrop bookmark search "<query>" | jq '.items | length'`

### 5. Handle Empty Or Unexpected Results

> Goal: Verify search outcomes and troubleshoot

1. ถ้า results ว่าง → ตรวจสอบว่า query ถูกต้อง, collection id ถูกต้อง, auth ยัง valid
2. รัน `raindrop bookmark search "<query>" --verbose` เพื่อ debug query
3. ใช้ `raindrop collection list` เพื่อ verify collection ids
4. ถ้า API error → อ่าน stderr JSON error และ retry ตาม rate limit

## Rules

### Query Syntax

- ใช้ double quotes รอบ query ทีมี space เสมอ
- ระวึง operators `:` `|` ต้องไม่มี space ระหว่าง key:value
- ใช้ `--collection` หรือ `collection:<id>` ตามที CLI รองรับ

### Output

- JSON เป็น default — เหมาะกับ `jq` และ scripting
- `--human` ใช้เมื่อต้องการอ่านทันที ไม่ต้อง parse
- ใช้ `jq -r` เพื่อ raw string output โดยไม่มี quotes

### Safety

- search เป็น read-only — ไม่ต้องใช้ `--force`
- อย่า expose `RAINDROP_ACCESS_TOKEN` ใน command history
- ใช้ `raindrop doctor` ก่อนถ้าค้นหาไม่ได้

### High Impact Content

- เก็บเฉพาะ search commands ทีใช้จริง
- ลด filters ทีไม่ได้ใช้ประจำ
- ทุก example ต้องมี query จริงทีสามารถรันได้

## Expected Outcome

- raindrop CLI authenticated และพร้อม search
- ผลการค้นหาได้ถูกต้องตาม query และ filters
- สามารถ format output เป็น JSON หรือ human-readable
- สามารถ parse ผลด้วย `jq` เพื่อนำไปใช้ต่อ
