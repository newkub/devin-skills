---
name: create-new-project-in-drive-d
description: สร้าง project ใหม่บน drive D ด้วย follow-create-* skill ตามประเภท
argument-hint: "<project-type> <project-name>"
related:
  - follow-create-cli
  - follow-create-web
  - follow-create-sdk
  - follow-my-tech-stack
  - follow-your-suggestion
  - follow-create-mobile-ios-android
  - follow-create-telegram-bot
---

## Goal

สร้าง project ใหม่บน drive D โดยเลือก `follow-create-*` skill ตามประเภท project

## Scope

ใช้เมื่อ user ต้องการเริ่ม project ใหมบน drive D ไมว่าจะเป็น CLI, website, mobile, library, plugin, bot, หรือ extension

## Execute

### 1. Gather Requirements

> Goal: Gather Requirements

1. ระบุ `project-type` จาก argument หรือ context เช่น `cli`, `website`, `mobile`, `library`, `mcp`, `bot`, `extension`
2. ระบุ `project-name` จาก argument หรือถาม user
3. กำหนด target path เริ่มต้นที `D:\newkub\<project-name>` หรือใช้ path ที user ระบุ
4. ถ้า `project-type` หรือ `project-name` ไม่ระบุ → ทำ `/follow-your-suggestion` เพื่อเลือกประเภทและชื่อ project ตาม context

### 2. Select Create Skill

> Goal: Select Create Skill

1. `cli` → `/follow-create-cli`
2. `website` หรือ `web` → `/follow-create-web`
3. `mobile` → `/follow-create-mobile-ios-android`
4. `telegram-bot` → `/follow-create-telegram-bot`
5. `discord-bot` → `/follow-create-discord-bot`
6. `line-bot` → `/follow-create-line-bot`
7. `browser-extension` → `/follow-create-browser-extensions`
8. `obsidian-plugin` → `/follow-create-obsidian-plugin`
9. `vscode-extension` → `/follow-create-vscode-extensions`
10. `zed-extension` → `/follow-create-zed-extensions`
11. `rust-crate` หรือ `rust-lib` → `/follow-create-rust-crate`
12. `mcp` → `/follow-create-mcp`
13. ถ้าไม่ตรงข้อใดหรือไม่แน่ใจ → ใช้ `/follow-create-sdk` เพื่อถามและเลือก stack

### 3. Prepare Target Path

> Goal: Prepare Target Path

1. ตรวจสอบว่า target path ยังไม่มี directory อยู่
2. ถ้ามีอยู่แล้ว → ถาม user ว่าจะ overwrite, rename หรือยกเลิก
3. ใช้ `mkdir` สร้าง parent directory ถ้าจำเป็น หรือให้ `follow-create-*` จัดการ

### 4. Run Create Skill

> Goal: Run Create Skill

1. ส่ง `project-name` และ `target-path` ให้ skill ทีเลือก
2. ถ้า skill ต้องการ stack ให้ใช้ `/follow-my-tech-stack` เพื่อยืนยัน
3. ติดตามให้ skill ทีเลือกสร้าง project จนเสร็จ

### 5. Validate And Ship

> Goal: Validate And Ship

1. ตรวจสอบว่า project files ถูกสร้างจริงที target path
2. รัน `/run-check` ตาม stack ถ้าจำเป็น
3. ทำ `/ship` เมื่องานเสร็จสมบูรณ์
4. รายงาน path และ next actions

## Rules

### 1. Target Path

- project ต้องอยู่บน `D:\` หรือ drive ที user ระบุ
- ไม่ overwrite existing directory โดยไม่ถาม
- ใช้ path เป้น absolute เสมอ

### 2. Skill Selection

- เลือก `follow-create-*` ตาม `project-type` ทีตรงทีสุด
- ถ้าไม่ตรง ให้ใช้ `/follow-create-sdk` เพื่อ route
- ไม่สร้าง project โดยตรงเอง ให้ delegate ไปยัง skill เฉพาะ

### 3. Safety

- ตรวจสอบ disk space ก่อนสร้าง
- ไม่ใส่ secrets หรือ API keys ใน template
- ถ้า target มี git repo อยู่แล้ว → ถามก่อน

## Expected Outcome

- Project ใหม่ถูกสร้างบน drive D ด้วยโครงสร้างทีถูกต้อง
- ใช้ `follow-create-*` skill ตามประเภท project
- ผ่าน validation และพร้อม ship
- รายงาน target path, stack, และ next actions

