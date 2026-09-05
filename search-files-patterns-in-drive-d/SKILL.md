---
name: search-files-patterns-in-drive-d
description: Search file and folder patterns in drive D using fd with parallel pattern types
argument-hint: "[pattern]"
allowed-tools: exec
related:
  - search-project-in-drive-d
  - search-files-patterns
  - follow-my-global-cli
  - consider-use-subagents
  - update-agents-md
  - report-table
  - ask-me
---

## Goal

Search files, directories, and projects in `D:\` by name pattern, path pattern, or content pattern

## Scope

- ใช้เมื่อต้องการค้นหา files/folders ใน drive D ตาม pattern
- รองรับ glob, regex, wildcard
- อาจค้นหาเนื้อหาไฟล์ด้วยใน scope ทีจำกัด
- ใช้ `fd` เป็น default, fallback ไป PowerShell

## Execute

### 1. Get Search Criteria

> Goal: ระบุ pattern และ scope การค้นหา

1. ถาม user สำหรับ pattern ถ้ายังไม่ระบุ
2. ระบุ pattern type:
   - `filename` — glob/regex ของชื่อไฟล์ เช่น `*.config.*`, `*.test.ts`
   - `folder` — directory name pattern
   - `path` — full path pattern
   - `content` — เนื้อหาไฟล์ (จำกัด scope ก่อน)
3. ระบุ base path เป็น `D:\`

### 2. Use Subagents For Parallel Search

> Goal: ค้นหาหลาย pattern type ขนานกัน

1. ถ้ามีหลาย pattern types หรือหลาย patterns → ทำ `/consider-use-subagents`
2. Spawn subagents:
   - `search-folders`: ค้นหา directories ด้วย `fd --type directory <pattern> "D:\"`
   - `search-files`: ค้นหา files ด้วย `fd --type file <pattern> "D:\"`
   - `search-content`: ค้นหาเนื้อหาไฟล์ด้วย `grep` ใน scope ทีเลือก
3. รวบรวมผลจากทุก subagent
4. ถ้า scope เล็ก หรือ pattern เดียว → ทำตามด้วยตรงโดยไม่ต้องใช้ subagents

### 3. Verify fd Tool

> Goal: ตรวจสอบ `fd` พร้อมใช้

1. รัน `Get-Command fd` หรือ `where fd`
2. ถ้าไม่มี `fd` → fallback ไป `Get-ChildItem -Path "D:\" -Recurse`
3. ถ้ามี `mise` หรือ `scoop` แนะนำ `mise use -g fd` หรือ `scoop install fd`

### 4. Search Files And Folders

> Goal: ค้นหา files และ directories

1. สำหรับ folder pattern:
   - รัน `fd --type directory <pattern> "D:\"` หรือ `fd -t d <pattern> "D:\"`
   - เติม `--full-path` หรือ `-p` ถ้าต้องการ match path
   - เติม `--glob` ถ้าต้องการ glob mode
2. สำหรับ file pattern:
   - รัน `fd --type file <pattern> "D:\"` หรือ `fd -t f <pattern> "D:\"`
   - ใช้ `--extension <ext>` กรอง extension
3. รับผลลัพธ์เป็น list ของ full paths

### 5. Search Content (Optional)

> Goal: ค้นหาเนื้อหาไฟล์

1. จำกัด scope ด้วย file pattern ก่อน
2. ใช้ `grep` หรือ `rg` ค้นหาเนื้อหา
3. แสดง file path, line number, snippet
4. ห้าม search ทั้ง drive D โดยไม่จำกัด scope

### 6. Format Output

> Goal: จัดรูปแบบผลลัพธ์

1. ทำ `/report-table` ด้วย columns: No., Type, Name, Path
2. แสดง full path ด้วย backticks
3. รวบรวมจำนวน matches แยกตาม type

### 7. Update AGENTS.md If Needed

> Goal: sync AGENTS.md ถ้าพบ project/skill ใหม่ทีต้อง index

1. ถ้า search พบ projects หรือ workspaces ใหม่ทีควรอยู่ใน `AGENTS.md` → ทำ `/update-agents-md`
2. ถ้าไม่มี project ใหม่ทีเกี่ยวข้อง → ข้ามขั้นตอนนี้

## Rules

### 1. Pattern Types

- รองรับ regex, glob, wildcard
- ถ้า user ไม่ระบุ pattern type → ถาม
- ค้นหาใน `D:\` เท่านั้น

### 2. Tool Usage

- ใช้ `fd` เป็น default
- fallback ไป PowerShell ถ้าไม่มี `fd`
- ใช้ `grep`/`rg` สำหรับ content search ด้วย scope จำกัด

### 3. Scope And Safety

- ไม่เขียนหรือลบไฟล์/โฟลเดอร์ใดๆ
- content search ต้องจำกัด directory หรือ extension
- ไม่ expose secrets ใน snippet

### 4. Subagents

- ใช้ `/consider-use-subagents` เมื่องานมีหลาย pattern types
- แต่ละ subagent ทำงานคนละชุด pattern
- รวมผลก่อน report

### 5. AGENTS.md

- ถ้าพบ project/skill ใหม่ → ทำ `/update-agents-md`
- ไม่กระทำ AGENTS.md โดยตรง

- ใช้ /search-project-in-drive-d ถ้าจำเป็น
- ใช้ /search-files-patterns ถ้าจำเป็น
- ใช้ /follow-my-global-cli ถ้าจำเป็น
- ใช้ /ask-me ถ้าจำเป็น

## Expected Outcome

- รายการ files/folders ทีตรงกับ pattern
- แยก type: folder, file, content match
- Output อยู่ในรูปแบบตาราง
- `AGENTS.md` อัปเดตถ้าพบ project ใหม่
