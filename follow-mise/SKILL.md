---
name: follow-mise
description: ตั้งค่าและใช้งาน mise สำหรับจัดการ dev tools, env vars, และ tasks
allowed-tools:
  - read
  - write
  - edit
  - grep
  - glob
  - exec
triggers:
  - user
  - model
related:
  - shell
---

## Goal

ตั้งค่าและใช้งาน mise สำหรับจัดการ dev tools, env vars, และ tasks ตาม best practices

## Scope

ใช้สำหรับ project ที่ต้องการ pin tool versions, load environment variables, และ define tasks ในไฟล์เดียว (`mise.toml`)

## Execute

### 1. Check And Install Mise

> Goal: ตรวจสอบและติดตั้ง mise
> Goal: ยื่นยันว่า mise พร้อมใช้

1. รัน `mise --version` เพื่อตรวจสอบ installation
2. ถ้าไม่มา ให้ติดตั้ง:
   - Unix: `curl https://mise.run | sh`
   - Windows: `winget install mise` หรือ `scoop install mise`
   - Cargo: `cargo install mise`
3. เพิ่ม mise ใน shell activation ตาม OS/shell
4. รัน `mise doctor` เพื่อตรวจสอบสุขภาพ

### 2. Initialize Mise Configuration

> Goal: สร้าง `mise.toml` สำหรับ project
> Goal: project มี mise config ที่ถูกต้อง

1. สร้าง `mise.toml` ที่ project root
2. กำหนด tools ใน ` [tools]`: `node = "24"`, `python = "3.13"`, `bun = "latest"` เป็นต้น
3. ใช้ `mise use <tool>@<version>` เพื่อเพิ่ม tool ลง config อัตโนมัติ
4. ใช้ `mise install` เพื่อติดตั้งทุก tools ใน config
5. ใช้ `mise list` เพื่อตรวจสอบ installed tools

### 3. Manage Tool Versions

> Goal: จัดการ versions ของ tools
> Goal: tool versions ตรงกับ config

1. รัน `mise use <tool>@<version>` เพื่อเปลี่ยน version
2. รัน `mise install` เพื่อติดตั้ง version ใหม่
3. รัน `mise list` เพื่อดู installed versions
4. รัน `mise prune` เพื่อลบ versions ที่ไม่ได้ใช้
5. ใช้ `mise up` เพื่ออัปเดตทุก tools เป็น latest matching version

### 4. Configure Environment Variables

> Goal: ตั้งค่า env vars ใน mise
> Goal: env vars ถูกต้องและ load อัตโนมัติ

1. เพิ่ม `[env]` section ใน `mise.toml`
2. ใช้ `_.file = ".env.local"` เพื่อ load จาก .env file
3. ใช้ `_ = { VAR = "value" }` เพื่อตั้งค่าโดยตรง
4. รัน `mise env` เพื่อดู env vars ทีจะ export
5. รัน `mise exec -- <command>` เพื่อรัน command ภายใต้ mise env

### 5. Define Tasks

> Goal: สร้าง tasks ใน mise
> Goal: tasks อยู่ใน config และรันได้

1. เพิ่ม `[tasks.<name>]` ใน `mise.toml`
2. กำหนด `run = "<command>"` สำหรับแต่ละ task
3. ใช้ dependencies: `depends = ["build"]`
4. ใช้ `sources` และ `outputs` สำหรับ caching
5. รัน `mise run <task>` หรือ `mise <task>`
6. รัน `mise run` เพื่อดูรายการ tasks

### 6. Integrate With Project Scripts

> Goal: เชื่อม mise เข้ากับ scripts
> Goal: scripts ใช้ tools จาก mise ได้

1. ใช้ `mise exec -- <script>` เพื่อรัน scripts ใน mise env
2. ใช้ `mise run` สำหรับ task automation
3. ผสมกับ `/use-scripts` เมื่อต้องการ custom scripts
4. ใช้ `mise run <task> -- <args>` เพื่อส่ง arguments ไปยัง task

## Rules

### 1. Configuration File

- `mise.toml` อยู่ที่ project root สำหรับ project config
- `~/.config/mise/config.toml` สำหรับ global user config
- ใช้ `mise use <tool>@<version>` แทนการแก้ไฟล์ด้วยมือเมื่อเป็นไปได้
- commit `mise.toml` เข้า repo

### 2. Tool Versions

- pin versions ใน `mise.toml` เพื่อ consistency
- ใช้ `latest` เฉพาะเมื่อต้องการ auto-update
- ตรวจสอบ `mise list` ก่อน push
- ใช้ `mise up` เพื่ออัปเดต dependencies ตาม version constraints

### 3. Environment

- ไม่ commit secrets ลง `mise.toml`
- ใช้ `_.file = ".env.local"` หรือ `_.path = ".env"`
- ตรวจสอบ `mise env` ก่อนรัน commands สำคัญ

### 4. Tasks

- ตั้งชื่อ task ชัดเจน: `build`, `test`, `lint`, `dev`
- ใช้ `depends` สำหรับ task dependencies
- ใช้ `sources`/`outputs` เมื่อต้องการ caching
- ไม่กำหนด task ที่ซ้ำกับ package manager scripts โดยไม่จำเป็น

### 5. Global Tools

- ใช้ `mise use -g <tool>@<version>` สำหรับ global tools ตาม `global_rules`
- ระวังการใช้ global version ให้ไม่ชนกับ project version
- ตรวจสอบ `mise list` สำหรับ global tools

### 6. Safety

- รัน `mise doctor` ก่อนแก้ปัญหาที่ซับซ้อน
- ไม่ลบ `.mise` cache โดยไม่รู้ผล
- ตรวจสอบ exit code ของ `mise run`

## Expected Outcome

- `mise.toml` สร้างและถูกต้อง
- Tools ติดตั้งตาม version ที่กำหนด
- Env vars load อัตโนมัติเมื่อเข้า project directory
- Tasks รันได้ด้วย `mise run <task>`
- Project setup repeatable บนเครื่องอื่น
