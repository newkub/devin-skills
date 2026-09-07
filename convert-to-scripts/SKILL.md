---
name: convert-to-scripts
description: สร้างโฟลเดอร `scripts/` และแปลงคำสั่่งหรือ workflow ทีระบุเป็น script files
argument-hint: "<commands-or-workflow>"
allowed-tools:
  - read
  - write
  - edit
  - exec
  - find_file_by_name
  - ask_user_question
  - todo_write
  - skill
triggers:
  - user
  - model
related:
  - use-scripts
  - use-bun-shell
  - use-pwsh-shell
  - use-nu-shell
---

## Goal

สร้างโฟลเดอร `scripts/` ใน project แล้วแปลงคำสั่่ง ขั้นตอน workflow หรือ context ที user ให้มาเป็น script files ทีใช้งานได้จริง

## Scope

ใช้เมื่อ project ต้องการรวม scripts ไว้ใน `scripts/` เช่น build scripts, deployment scripts, test helpers, automation tasks หรือ utility scripts

## Execute

### 1. Discover Project

> Goal: รู้ environment ของ project

1. ตรวจสอบ project root และหา `package.json`, `Cargo.toml`, `pyproject.toml`, `go.mod` หรือ manifest อื่น
2. ตรวจสอบว่ามี `scripts/` อยู่แล้วหรือไม่
3. ระบุ runtime ที่ใช้: Bun, Node.js, Python, PowerShell, Nushell, Bash, Rust, Go
4. ถ้าต้องเลือก shell หรือ runtime ให้ใช้ `/use-bun-shell`, `/use-pwsh-shell`, `/use-nu-shell` หรือ `/use-scripts`
5. ดู convention ทีมีอยู่ของ project

### 2. Create `scripts/` Directory

> Goal: สร้างโฟลเดอร scripts

1. ถ้ายังไม่มี `scripts/` ให้สร้างที่ project root ด้วย `exec` หรือเครื่องมือทีเหมาะสม
2. ถ้ามี `scripts/` แล้ว ให้ list ไฟล์ทีมีอยู่
3. สร้าง `README.md` หรือ `index.md` ใน `scripts/` ถ้ายังไม่มี เพื่ออธิบายวิธีใช้

### 3. Convert Input To Scripts

> Goal: แปลง input เป็น script

1. รับ input จาก user เช่น คำสั่่ง, ขั้นตอน workflow, หรือ context ทีต้องการ automate
2. ถ้า input ไม่ชัด ให้ถามเพิ่มเติม
3. เลือก language ของ script ตาม project runtime และ use case
4. ตั้งชื่อไฟล์ให้สื่อความหมาย เช่น `build.ts`, `deploy.ps1`, `test-all.nu`, `lint.sh`
5. เขียน script ให้ชัดเจน มี error handling และ comments เมื่อจำเป็น

### 4. Verify

> Goal: ตรวจสอบว่า script ใช้งานได้

1. อ่าน script ทีสร้าง
2. รัน script หรือทำ dry-run ถ้าเป็นไปได้
3. ตรวจสอบ permissions (chmod +x ถ้าเป็น shell script)
4. ถ้ามี error → แก้ไขและรันใหม
5. อัปเดต `package.json` `scripts` หรือ docs ถ้าเหมาะสม

## Rules

- สร้าง `scripts/` ที project root เสมอถ้ายังไม่มี
- เลือกภาษาของ script ตาม project runtime และ skill ที user มี
- ใช้ Bun/TypeScript เป็น default ถ้า project ใช้ Bun/Node
- ใช้ PowerShell ถ้า project หรือ user อยู่บน Windows และเป็น tooling/admin script
- ใช้ Nushell ถ้าต้องการ structured data pipeline
- อย่า hardcode secrets ใน script
- ใช้ relative paths ภายใน project
- ใส่ shebang เมื่อจำเป็น
- ทำ dry-run ก่อนรัน script ทีมี side effects

## Expected Outcome

- มีโฟลเดอร `scripts/` ใน project
- มี script file(s) ทีทำงานได้จริง
- Script มี error handling และใช้ convention ของ project
- User ทราบวิธีเรียกใช้และตำแหน่งไฟล์
