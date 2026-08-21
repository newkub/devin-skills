---
name: use-raindrop-cli
description: ใช้ raindrop CLI สำหรับจัดการ Raindrop.io bookmarks, collections, tags
---

## Goal

ใช้ raindrop CLI สำหรับจัดการ Raindrop.io bookmarks, collections, tags, highlights, และ exports อย่างมีประสิทธิภาพ

## Scope

ครอบคลุมการใช้ raindrop CLI (jvm/raindrop-cli) สำหรับ Raindrop.io API — แตกต่างจาก `/use-my-global-cli` ที่เป็นการเลือก CLI tool ทั่วไป

## Execute

### 1. Setup And Authentication

ตั้งค่าและตรวจสอบ authentication ก่อนใช้งาน

> Goal: raindrop CLI พร้อมใช้งานและ authenticated

1. ตรวจสอบการติดตั้ง: รัน `raindrop --version` — ถ้าไม่มี → ทำ `/use-my-global-cli` เพื่อติดตั้ง
2. ตรวจสอบ auth: รัน `raindrop auth status`
3. ถ้ายังไม่ authenticated → รัน `printf '%s' "$RAINDROP_ACCESS_TOKEN" | raindrop auth login --token-stdin`
4. รัน `raindrop doctor` เพื่อตรวจสอบ config, auth, และ API connectivity
5. ถ้า doctor พบ issue → แก้ไขตาม error message ก่อนดำเนินการต่อ

### 2. Explore CLI Structure

ทำความเข้าใจ command structure ของ raindrop CLI

> Goal: ทราบ command list, options, และ output formats ที่พร้อมใช้

1. ทำ `/learn-from-cli` สำหรับ raindrop CLI
2. รัน `raindrop agent-context` เพื่อดู machine-readable command metadata
3. รัน `raindrop agent-context --command <subcommand>` สำหรับ detailed command info
4. บันทึก: command groups (auth, bookmark, collection, tag, highlight, export, backup, profile, api)

### 3. Bookmark Operations

จัดการ bookmarks ด้วย raindrop CLI

> Goal: สามารถ add, list, search, update, delete bookmarks ได้ถูกต้อง

1. Add: `raindrop bookmark add <url> --tag <tag> --tag <tag> --collection <id>`
2. List: `raindrop bookmark list --collection <id> --limit <n>`
3. Search: `raindrop bookmark search "<query>" --collection <id>` — รองรับ Raindrop search syntax เช่น `tag:api type:article`
4. Update: `raindrop bookmark update <id> --title "<title>" --tag <tag>`
5. Delete: `raindrop bookmark delete <id> --force` — destructive ต้องมี `--force`
6. Output เป็น JSON by default — ใช้ `jq` สำหรับ parsing เช่น `| jq -r '.items[].title'`

### 4. Collection And Tag Management

จัดการ collections และ tags

> Goal: สามารถ organize bookmarks ด้วย collections และ tags ได้

1. List collections: `raindrop collection list --human` หรือ `raindrop collection tree --human`
2. Create collection: `raindrop collection create --title "<title>" --view list`
3. Update collection: `raindrop collection update <id> --title "<new title>"`
4. Delete collection: `raindrop collection delete <id> --force`
5. List tags: `raindrop tag list --collection <id>`
6. Rename tag: `raindrop tag rename <old> <new>`
7. Merge tags: `raindrop tag merge <tag1> <tag2> --to <target>`
8. Delete tag: `raindrop tag delete <tag> --force`

### 5. Export And Backup

ส่งออกและสำรองข้อมูล bookmarks

> Goal: สามารถ export และ backup bookmarks ได้

1. Export to CSV: `raindrop export bookmarks <collection-id> csv --output bookmarks.csv`
2. Export to HTML: `raindrop export bookmarks <collection-id> html --output bookmarks.html`
3. Generate backup: `raindrop backup generate --wait`
4. List backups: `raindrop backup list`
5. Download backup: `raindrop backup download <backup-id> --output raindrop-backup.zip`

### 6. Profiles And Raw API

ใช้ profiles สำหรับ multi-account และ raw API escape hatch

> Goal: รองรับ advanced usage ผ่าน profiles และ raw API

1. Save profile: `raindrop profile save <name> --default-collection <id> --output json`
2. Use profile: `raindrop profile use <name>`
3. Run with profile: `raindrop --profile <name> bookmark list --collection 0 --limit 10`
4. Raw API: `raindrop api request GET /user` หรือ `raindrop api request POST /raindrop -d '{"link":"<url>"}'`
5. ใช้ raw API เฉพาะ endpoints ที่ไม่มี first-class command

### 7. Scripting And Automation

สร้าง scripts สำหรับ automate raindrop operations

> Goal: สามารถ automate recurring tasks ด้วย scripts

1. ใช้ JSON output สำหรับ scripting: `raindrop bookmark list --collection 0 --limit 50 | jq -r '.items[].title'`
2. ใช้ `raindrop agent-context` สำหรับ dynamic command discovery ใน scripts
3. ทำ `/use-scripts` สำหรับ batch operations ที่ซับซ้อน
4. ใช้ exit codes สำหรับ error handling: 0 = success, non-zero = error
5. ตรวจสอบ stderr สำหรับ structured JSON errors

## Rules

### Output Format

- JSON เป็น default output — เหมาะสำหรับ scripting และ `jq` parsing
- ใช้ `--human` สำหรับ human-readable output เช่น `collection list --human`
- Errors เป็น structured JSON บน stderr พร้อม stable exit codes
- ใช้ `--output json` สำหรับ explicit JSON output

### Safety

- Destructive operations ต้องมี `--force` เสมอ (delete bookmark, delete collection, delete tag)
- ตรวจสอบด้วย read-only commands ก่อน destructive operations เสมอ
- ใช้ `raindrop doctor` เพื่อ diagnose config และ connectivity issues
- Credentials และ authorization headers ถูก redact จาก debug paths

### Search Syntax

- รองรับ Raindrop search syntax: `tag:<tag>`, `type:<type>`, `domain:<domain>`
- ใช้ `raindrop bookmark search "<query>"` สำหรับ full-text search
- รวม filters: `raindrop bookmark search "tag:api type:article" --collection 0`

### High Impact Content

- เก็บเฉพาะ commands ที่ใช้จริง — ถ้าไม่ใช้ → ไม่ต้องบันทึก
- ทุก bullet ต้องตอบได้ว่า "ถ้าไม่มีแล้วผลลัพธ์เปลี่ยนไหม" — ถ้าไม่เปลี่ยน → ลบ
- อ้างอิง official docs ที่ https://github.com/jvm/raindrop-cli สำหรับ full command reference

## Expected Outcome

- raindrop CLI authenticated และพร้อมใช้งาน
- Bookmarks, collections, tags จัดการได้ผ่าน CLI
- Export และ backup ทำได้ครบถ้วน
- Scripts สำหรับ automation ใช้ JSON output และ `jq` parsing ได้
- Destructive operations มี `--force` guardrail
