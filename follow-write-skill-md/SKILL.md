---
name: follow-write-skill-md
description: เขียนหรือปรับปรุง SKILL.md หนึ่งไฟล์ตามมาตรฐาน skills
triggers: ['user', 'model']
allowed-tools: ['read', 'edit', 'write', 'grep', 'glob', 'exec', 'ask_user_question']
related:
  - follow-write-skills
  - check-reference
  - validate
  - follow-content-quality
  - ask-me
---

## Goal

สร้างหรือปรับปรุง `SKILL.md` หนึ่งไฟล์ให้ถูกต้อง ใช้งานได้ และสอดคล้องกับ conventions ของ workspace

## Scope

ใช้สำหรับ skill files ใน `.devin/skills/`, `.windsurf/skills/`, `~/.config/devin/skills/`, `~/.codeium/<channel>/skills/`, หรือ `%APPDATA%\devin\skills\` โดยไม่ซ้ำซ้อนกับ `follow-write-skills`

## Execute

### 1. Determine Skill Scope

ระบุขอบเขตและตำแหน่งของ skill

> Goal: skill ถูกต้องตาม scope และไม่ซ้ำซ้อน

1. ถ้า skill ใช้เฉพาะ project ให้สร้างใน `.devin/skills/<name>/` หรือ `.windsurf/skills/<name>/`
2. ถ้า skill ใช้ global ทุก project ให้สร้างใน `~/.config/devin/skills/<name>/` หรือ `~/.codeium/<channel>/skills/<name>/`
3. ถ้า Windows ให้ใช้ `%APPDATA%\devin\skills\<name>\`
4. ตรวจสอบว่า skill name ซ้ำกับ existing skills หรือไม่ ถ้าซ้้อให้ extend หรือ rename ก่อน

### 2. Read Skills Reference

อ่าน reference ก่อนเขียน

> Goal: ใช้ frontmatter และ format ทีกำหนด

1. ทำ `learn-from-web` จาก `https://docs.devin.ai/cli/extensibility/skills/overview` และ `https://docs.devin.ai/cli/extensibility/skills/creating-skills` เมื่อจำเป็น
2. บันทึก fields ที่ต้องใช้: `name`, `description`, `argument-hint`, `model`, `subagent`, `agent`, `allowed-tools`, `permissions`, `triggers`
3. ตรวจสอบ allowed tools: `read`, `edit`, `grep`, `glob`, `exec`, และ MCP tools
4. อ่าน `AGENTS.md` หรือ global rules ของ skill repo เพื่อดู conventions

### 3. Plan Skill Content

วางแผนเนื้อหาก่อนสร้างไฟล์

> Goal: skill มีเนื้อหาครบถ้วน ไม่กว้างเกินไป

1. กำหนด `name` ให้ตรงกับ directory name
2. เขียน `description` กระชับ ไม่เกิน 100 ตัวอักษร
3. ตัดสินใจว่าจะใช้ `subagent: true`, `agent: <profile>`, หรือ inline
4. กำหนด `allowed-tools` เฉพาะที่ skill ต้องใช้จริง
5. กำหนด `permissions` สำหรับ `allow` / `deny` / `ask` ตามความเสี่ยง

### 4. Create Directory And SKILL.md

สร้างโครงสร้าง skill

> Goal: ไฟล์อยู่ในตำแหน่งที่ถูกต้อง

1. สร้าง directory `<skill-name>/` ในตำแหน่งที่เลือก
2. สร้างไฟล์ `SKILL.md` ภายใน directory
3. ถ้า skill มีหลายเนื้อหา ให้สร้าง subdirectories หลังจาก `SKILL.md` หลักเสร็จ (ถ้าจำเป็นมาก)

### 5. Write Frontmatter

เขียน YAML frontmatter ตาม Devin CLI spec

> Goal: frontmatter valid และครบถ้วน

1. ใส่ `name` ให้ตรงกับ directory name
2. ใส่ `description` กระชับ
3. ใส่ `argument-hint` ถ้า skill รับ arguments
4. ใส่ `model` ถ้าต้องการ override model
5. ใส่ `subagent: true` หรือ `agent: <profile>` ถ้าต้องการรันเป็น subagent
6. ใส่ `allowed-tools` เฉพาะ tools ที่จำเป็น
7. ใส่ `permissions` สำหรับ `allow`, `deny`, `ask`
8. ใส่ `triggers` เป็น `['user']`, `['model']`, หรือ `['user', 'model']` ตามลักษณะการใช้งาน

### 6. Write Prompt Content

เขียน body ของ `SKILL.md`

> Goal: prompt ชัดเจน ทำตามได้จริง

1. เริ่มด้วย `## Goal` ตอบว่า skill ทำอะไร
2. เขียน `## Scope` ระบุขอบเขต
3. เขียน `## Execute` แบ่งเป็น numbered steps พร้อม `> Goal:` ก่อนรายการย่อย
4. เขียน `## Rules` แยกเป็นหมวดหมู่ตาม single concern
5. เขียน `## Expected Outcome` สอดคล้องกับ Goal
6. ถ้า skill มี output ชัดเจน ให้ระบุ output format

### 7. Validate SKILL.md

ตรวจสอบคุณภาพก่อนใช้งาน

> Goal: skill ผ่านเกณฑ์คุณภาพ

1. ทำ `validate` ตรวจสอบว่าไม่เกิน 250 บรรทัด
2. ทำ `follow-content-quality` เพื่อตรวจสอบความชัดเจน
3. ตรวจสอบว่า frontmatter fields ตรงกับ Devin CLI spec
4. ตรวจสอบว่า `related` references มีอยู่จริง
5. ถ้ามี subdirectories ตรวจสอบว่าไฟล์ทั้งหมดไม่เกิน 250 บรรทัด

### 8. Update References And Ask Next

อัปเดต references และถาม user

> Goal: skill พร้อมใช้งานและ references ครบถ้วน

1. ทำ `update-reference` ถ้ามีการอ้างอิงไฟล์อื่น
2. ทำ `ask-me` ถ้าต้องตัดสินใจเรื่องสำคัญ
3. รายงานชื่อ skill, ตำแหน่งไฟล์, และสถานะ validation

## Rules

### 1. File Location

- project skills: `.devin/skills/<name>/SKILL.md` หรือ `.windsurf/skills/<name>/SKILL.md`
- global skills: `~/.config/devin/skills/<name>/SKILL.md` หรือ `~/.codeium/<channel>/skills/<name>/SKILL.md`
- Windows global skills: `%APPDATA%\devin\skills\<name>\SKILL.md`
- directory name ต้องตรงกับ `name` ใน frontmatter

### 2. Frontmatter Standard

- `name` ตรงกับ directory name
- `description` กระชับ ไม่เกิน 100 ตัวอักษร
- `argument-hint` optional: ระบุเฉพาะเมื่อ skill รับ arguments
- `model` optional: ใช้ค่าเดียวกับ `--model` CLI flag
- `subagent` optional: `true` ถ้าต้องการรันเป็น subagent
- `agent` optional: profile name ถ้าต้องการรันด้วย custom subagent
- `allowed-tools` optional: แต่แนะนำให้จำกัดเฉพาะที่จำเป็น
- `permissions` optional: ใช้ syntax `allow`, `deny`, `ask`
- `triggers` optional: ค่าเริ่มต้น `['user', 'model']`

### 3. Content Structure

- เรียง `## Goal` → `## Scope` → `## Execute` → `## Rules` → `## Expected Outcome`
- ไฟล์ไม่เกิน 250 บรรทัด
- heading ภาษาอังกฤษ Title Case, รายการเนื้อหาภาษาไทย
- ใช้ backticks สำหรับ `tools`, `commands`, `file paths`, `skill-name`
- ไม่ใช้ TODO/MOCK/placeholder โดยไม่จำเป็น

### 4. Safety And Permissions

- `allowed-tools` จำกัดตาม minimum required
- `permissions` deny สำหรับ paths ที่เสี่ยง เช่น `/etc/`, รากระบบ
- `permissions` ask สำหรับ write ที่สำคัญถ้า skill ไม่ได้รับอนุญาต auto
- ไม่ใส่ secrets หรือ credentials ใน prompt content

### 5. Subagent And Model

- ใช้ `subagent: true` สำหรับงาน focused, self-contained
- ใช้ `agent: <profile>` เมื่อต้องการ profile เฉพาะ เช่น `subagent_explore` สำหรับ research
- `model` optional: ใช้เมื่อต้องการความสามารถเฉพาะ เช่น coding, reasoning

### 6. References And Non-Redundancy

- ลบข้อความที่ซ้ำซ้อนระหว่าง Execute และ Rules
- ใช้ references แทนการ duplicate เนื้อหา
- ทำ `check-reference` เพื่อตรวจสอบ references มีอยู่จริง
- เมื่อแก้ไข skill ให้ตรวจสอบ dependent skills
- ถ้ามีการเปลี่ยนชื่อ ย้าย หรือลบ skill ให้ทำ `edit-relative`
- อ่าน skills ที่เกี่ยวข้องก่อนเขียน
- ถ้าอ้างถึง skills อย่าพยายามเขียนซ้ำกับไฟล์ที่อ้างไป เขียนแค่ว่าให้ทำตามที่อ้างไป
- เมื่อใช้ reference ให้เขียนเป็น `ทำตาม `skill-name`` หรือ `ดูจาก `skill-name``

## Expected Outcome

- `SKILL.md` หนึ่งไฟล์ถูกสร้างหรือปรับปรุงตามมาตรฐาน
- frontmatter valid และครบถ้วน
- เนื้อหาไม่เกิน 250 บรรทัด
- `related` references มีอยู่จริง
- skill สามารถเรียกใช้ได้โดยไม่ error
