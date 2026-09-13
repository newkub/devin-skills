---
name: search-raindrop
description: Search Raindrop.io bookmarks via raindrop CLI v0.1.1 with filters and jq parsing
argument-hint: "[query]"
related:
  - list-recent-bookmark-raindrop
  - list-raindrop-favorite
  - review-dependencies
  - download-program
  - use-scripts
---

## Goal

ค้นหาและดึง bookmarks จาก Raindrop.io อย่างรวดเร็วและแม่นยำโดยใช้ raindrop CLI (`jvm/raindrop-cli` v0.1.1)

## Scope

ใช้กับ `raindrop` CLI เท่านั้น — ครอบคลุม authentication, `search`, `list` filters, output formats และ result parsing — verified กับ CLI v0.1.1

## Execute

### 1. Ensure CLI Is Ready

> Goal: CLI พร้อมและ authenticated ก่อนค้นหา

1. รัน `raindrop --version` — ถ้าไม่มี → ทำ `/download-program` เพื่อติดตั้ง
2. รัน `raindrop auth status` — ยืนยัน authenticated
3. ถ้ายังไม่ authenticated → `raindrop auth login` (OAuth flow) หรือ `raindrop auth token <token>` สำหรับ test token — ใช้ `RAINDROP_ACCESS_TOKEN` ผ่าน env/stdin ห้ามพิมพ์ตรงๆ ใน command
4. ถ้า auth พัง → แก้ตาม error message ก่อนค้นหา (ไม่มี `doctor` command ใน v0.1.1)

### 2. Search Bookmarks

> Goal: รัน search กับ Raindrop.io

1. รัน `raindrop search "<query>"` สำหรับ full-text search — default แสดงหน้าแรก
2. ใช้ `--collection <id>` (`-c`) เพื่อจำกัด collection — default `"0"` = ทั้งหมด
3. ใช้ `--all` (`-a`) เพื่อดึงผลทุกหน้า — ไม่มี `--limit`/`--page` ใน v0.1.1
4. ใช้ `--json` เพื่อ output JSON สำหรับ scripting — ใช้ `jq` extract ฟิลด์
5. ใช้ `--verbose` เพื่อ debug query

### 3. Use Filters

> Goal: apply filters ที่ CLI รองรับจริง

1. `search` flags: `--tag <tag>` (`-t`), `--type link|article|image|video|document|audio` (`-T`), `--after`/`--before YYYY-MM-DD`, `--collection`, `--all`
2. `list [<collection>]` flags: `--favorites` (`-f`), `--broken`, `--type`, `--tag`, `--search <query>`, `--sort` (default `-created`), `--all` (default first 50)
3. favorites → `raindrop list --favorites --json --all` (ดู `/list-raindrop-favorite`) — ไม่มี `important:true` operator
4. broken links → `raindrop list --broken`
5. combine: `raindrop search "api" --tag typescript --type article --collection 0 --all`

### 4. Format And Parse Results

> Goal: present ผลในรูปแบบที่ใช้ได้

1. default output เป็น table — ใช้ `--json` สำหรับ machine-readable (ไม่มี `--human` flag)
2. extract with `jq`:
   - title: `| jq -r '.[].title'` (หรือ `.items[].title` ตาม JSON shape จริง — ตรวจด้วย `jq 'keys'` ก่อน)
   - url: `| jq -r '.[].link'`
   - tags: `| jq -r '.[].tags[]?'`
   - id: `| jq -r '.[]._id'`
3. บันทึกผลลงไฟล์: `raindrop search "<query>" --json --all > results.json`
4. นับจำนวนผล: `raindrop search "<query>" --json --all | jq 'length'`
5. เปิด bookmark ใน browser: `raindrop open <id>`; copy URL: `raindrop copy <id>`; รายละเอียด: `raindrop get <id>`

### 5. Handle Empty Or Error Results

> Goal: verify ผลและ troubleshoot

1. ถ้า results ว่าง → ตรวจ query, collection id, auth validity
2. verify collection ids ด้วย `raindrop collections list`
3. ดู tags ที่มีด้วย `raindrop tags list`
4. ถ้า API error → อ่าน stderr และ retry ตาม rate limit
5. export สำรอง: `raindrop export --format csv --all`

## Rules

### Query Syntax

- ใช้ double quotes รอบ query ที่มี space เสมอ
- filters เป็น CLI flags (`--tag`, `--type`, `--after`, `--before`) — ไม่ใช่ `key:value` operators ใน query
- `--collection 0` = search ทั้งหมด (default)

### Output

- `--json` สำหรับ scripting/`jq`; default table สำหรับอ่านทันที
- `--all` เพื่อดึงครบทุกหน้า — list default แค่ 50 รายการแรก
- ใช้ `jq -r` เพื่อ raw string output โดยไม่มี quotes

### Safety

- `search`/`list`/`get` เป็น read-only — `--force`/`--no-input` ใช้กับ mutating commands (`add`, `update`, `delete`, `import`)
- อย่า expose `RAINDROP_ACCESS_TOKEN` ใน command history

### High Impact Content

- เก็บเฉพาะ commands/flags ที่ verify กับ v0.1.1 — ห้ามเดา syntax
- ทุก example ต้องมี query จริงที่รันได้

- ใช้ /list-recent-bookmark-raindrop ถ้าจำเป็น
- ใช้ /list-raindrop-favorite ถ้าจำเป็น
- ใช้ /use-scripts ถ้าจำเป็น

## Expected Outcome

- raindrop CLI v0.1.1 authenticated และพร้อม search
- ผลการค้นหาได้ถูกต้องตาม query และ filters ที่ CLI รองรับจริง
- สามารถ format output เป็น JSON และ parse ด้วย `jq` เพื่อนำไปใช้ต่อ
