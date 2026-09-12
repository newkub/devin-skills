---
name: follow-tool-mise-config-tools
description: ตั้งค่า `mise.toml` — tools versions, tasks, env vars โดยไม่ clobber config เดิม
argument-hint: "[scope]"
related:
  - follow-secret-manager
  - use-scripts
  - run-verify
---

## Goal

ตั้งค่าและแก้ไข `mise.toml` ของ project — pin tool versions, define tasks, configure env vars — โดย merge กับ config เดิมไม่ overwrite

## Scope

ใช้เมื่อต้องเพิ่ม/แก้ tools, tasks หรือ env ใน mise config — install/activation อยู่ใน `subskills/setup-mise/SKILL.md`

## Execute

### 1. Read Current Config

> Goal: อ่าน config เดิมก่อนแก้

1. อ่าน `mise.toml` (project), `mise.local.toml` (local overrides, ไม่ commit), และ `~/.config/mise/config.toml` (global)
2. รัน `mise list` ดู installed tools — compare กับ config
3. ถ้าไม่มี `mise.toml` → สร้างที่ project root (commit เข้า repo)

### 2. Configure Tools

> Goal: pin tool versions ใน `[tools]`

1. ใช้ `mise use <tool>@<version>` เพื่อเพิ่ม tool ลง config อัตโนมัติ — prefer วิธีนี้กว่าแก้ไฟล์ด้วยมือ
2. หรือกำหนดใน `[tools]` โดยตรง เช่น `node = "24"`, `python = "3.13"`, `bun = "latest"`
3. รัน `mise install` เพื่อติดตั้งทุก tools ใน config
4. ใช้ `mise up` เพื่ออัปเดต tools ตาม version constraints; `mise prune` ลบ versions ที่ไม่ใช้

### 3. Configure Environment

> Goal: ตั้งค่า env vars ใน `[env]`

1. เพิ่ม `[env]` section — ใช้ `_ = { VAR = "value" }` ตั้งค่าโดยตรง
2. ใช้ `_.file = ".env.local"` เพื่อ load จาก env file (non-sensitive เท่านั้น)
3. ห้าม commit secrets ลง `mise.toml` — ใช้ `/follow-secret-manager` สำหรับ secrets
4. รัน `mise env` ตรวจ env vars ที่จะ export; ใช้ `mise exec -- <command>` รันใน mise env

### 4. Define Tasks

> Goal: สร้าง tasks ใน `[tasks.<name>]`

1. เพิ่ม `[tasks.<name>]` พร้อม `run = "<command>"` — ชื่อชัดเจน: `build`, `test`, `lint`, `dev`
2. ใช้ `depends = ["build"]` สำหรับ task dependencies
3. ใช้ `sources` และ `outputs` เมื่อต้องการ caching
4. ไม่กำหนด task ที่ซ้ำกับ package manager scripts โดยไม่จำเป็น
5. รัน `mise run <task>` หรือ `mise <task>`; ดูรายการด้วย `mise tasks`

### 5. Verify

> Goal: ตรวจว่า config ทำงาน

1. รัน `mise doctor` และ `mise list` — tools ติดตั้งตาม config
2. `cd` เข้า project → รัน `mise env` — env vars load ถูกต้อง
3. รัน `mise run <task>` smoke test — ถ้าพัง → revert keys ที่แก้แล้ว report diff
4. ผ่าน → report before/after สั้นๆ ด้วย `/report-before-after`

## Rules

### 1. Config Files

- `mise.toml` ที่ project root — commit เข้า repo
- `mise.local.toml` สำหรับ local overrides — ไม่ commit
- ใช้ `mise use` แทน manual edit เมื่อเป็นไปได้; merge ไม่ clobber

### 2. Versions

- pin versions เพื่อ consistency; `latest` เฉพาะเมื่อต้องการ auto-update
- ใช้ `mise use -g <tool>` สำหรับ global tools ตาม `global_rules` — ระวังชนกับ project version

### 3. Secrets

- ห้ามใส่ secrets ใน `mise.toml` — ใช้ `_.file` ชี้ไป untracked env file หรือ `/follow-secret-manager`
- ตรวจ `mise env` ก่อนรัน commands สำคัญ

## Expected Outcome

- `mise.toml` มี `[tools]`, `[env]`, `[tasks]` ตามที่ project ต้องการ
- Tools ติดตั้งตาม pinned versions; env load อัตโนมัติ
- `mise run <task>` ทำงาน; setup repeatable บนเครื่องอื่น
