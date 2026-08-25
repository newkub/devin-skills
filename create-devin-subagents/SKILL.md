---
name: create-devin-subagents
description: สร้าง subagent ใหม่ใน devin agents repo ตามมาตรฐาน AGENT.md
argument-hint: "[agent-name]"
---

## Goal

สร้าง subagent ใหม่ใน `%APPDATA%\devin\agents` ตามมาตรฐาน `AGENT.md` โดยไม่ซ้ำซ้อนกับ agents ที่มีอยู่

## Scope

ใช้เมื่อต้องสร้าง subagent ใหม่จาก scratch ใน devin agents repo เพื่อรันเป็น background หรือ foreground subagent ด้วย profile เฉพาะ

## Execute

### 1. Identify New Subagent

> Goal: ระบุชื่อและวัตถุประสงค์ของ subagent

1. รับชื่อ subagent และสิ่งที่ต้องการทำจาก user
2. ตรวจสอบว่า subagent name ใช้ lowercase, คั่นด้วย `-` และไม่มีอักขระพิเศษ
3. ระบุ target directory: `%APPDATA%\devin\agents\<subagent-name>\`
4. ถ้าชื่อไม่ชัด → ทำ `/ask-me` ก่อนดำเนินการ

### 2. Check Existing Subagents

> Goal: ตรวจสอบว่าไม่ซ้ำซ้อน

1. ทำ `/list-devin-subagents` เพื่อดู subagents ที่มีอยู่
2. ตรวจสอบว่า subagent name ซ้ำกับ existing subagents หรือไม่
3. ถ้าซ้ำ → เสนอ extend หรือ rename ก่อน
4. อ่าน `AGENTS.md` และ `global_rules.md` เพื่อดู conventions

### 3. Create Directory And AGENT.md

> Goal: สร้าง directory และ `AGENT.md`

1. สร้าง `%APPDATA%\devin\agents\<subagent-name>\`
2. สร้าง `AGENT.md` ภายใน directory ด้วยโครงสร้าง:
   - YAML frontmatter: `name`, `description`, `model` (`sonnet`, `swe`, `opus`, `codex`), `allowed-tools` (list), `permissions` (optional)
   - Prompt body: `## Goal` → `## Scope` → `## Execute` → `## Rules` → `## Expected Outcome`
3. กำหนด `name` ให้ตรงกับ directory name
4. ใส่ `description` กระชับไม่เกิน 100 ตัวอักษร
5. เลือก `allowed-tools` ให้เหมาะกับ scope ของ subagent
6. ใช้ `permissions` เฉพาะเมื่อต้องจำกัดหรืออนุญาต commands เฉพาะ

### 4. Validate Subagent

> Goal: ตรวจสอบคุณภาพ

1. ตรวจสอบว่า `AGENT.md` ไม่เกิน 250 บรรทัด
2. ตรวจสอบว่า frontmatter มี `name`, `description`, `model`, `allowed-tools` ครบ
3. ตรวจสอบว่า prompt body มี 5 sections ครบ
4. ตรวจสอบว่าไม่มี TODO/MOCK/placeholder
5. ทำ `/validate` ถ้ามี

### 5. Ship

> Goal: ส่งมอบงาน

1. ทำ `/ship-workspace`
2. ถ้า `ship` ไม่ผ่าน → report สถานะ

## Rules

### 1. Target Location

- สร้าง subagent ใน `%APPDATA%\devin\agents`
- directory name ต้องตรงกับ `name` ใน frontmatter
- ห้ามสร้างทับ subagent ที่มีอยู่ ถ้าซ้ำให้ extend หรือ rename

### 2. AGENT.md Structure

- Frontmatter: `name`, `description`, `model`, `allowed-tools`, `permissions` (optional)
- Prompt body: `## Goal` → `## Scope` → `## Execute` → `## Rules` → `## Expected Outcome`
- `description` ไม่เกิน 100 ตัวอักษร
- ใช้ backticks สำหรับ `tools`, `commands`, `file paths`
- ไม่เกิน 250 บรรทัด

### 3. Model Selection

- `sonnet` สำหรับงานทั่วไปที่ต้องการความเร็ว
- `swe` สำหรับงาน software engineering ที่ซับซ้อน
- `opus` สำหรับงานที่ต้องการความแม่นยำสูง
- `codex` สำหรับงาน code generation

### 4. Safety

- ถ้ามีการ overwrite ไฟล์เดิม ต้องมี dry run และ user confirmation ก่อน
- ไม่ทำลาย existing subagents

## Expected Outcome

- subagent ใหม่ถูกสร้างที่ `%APPDATA%\devin\agents\<subagent-name>\` พร้อม `AGENT.md` ถูกต้อง
- directory name ตรงกับ `name` ใน frontmatter
- `AGENT.md` ไม่เกิน 250 บรรทัด ไม่มี TODO/MOCK/placeholder
- frontmatter ครบ: `name`, `description`, `model`, `allowed-tools`
- prompt body มี 5 sections ครบ
- ไม่ซ้ำกับ subagents ที่มีอยู่ หรือได้รับการยืนยันให้ extend หรือ rename
