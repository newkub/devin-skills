---
name: follow-skills-map
description: Map task → skill → CLI tool พร้อมเช็คว่า tool ติดตั้งแล้วหรือยัง
argument-hint: "[task-or-ecosystem]"
allowed-tools:
  - read
  - grep
  - find_file_by_name
  - exec
  - skill
  - ask_user_question
  - report

  - suggest-next-action
triggers:
  - user
  - model
related:
  - follow-devin-global-skills
  - update-devin-global-skills
  - check-my-global-cli
  - search
  - list-devin
  - suggest-me
  - ask-me
  - idea
  - check-skills-related
  - review-devin-global-harness
---

## Goal

แสดง map ของ Devin skills ตาม task type, ecosystem และ context พร้อม CLI tool ที่ skill นั้นใช้ — เพื่อช่วย user และ model เลือก skill ทีเหมาะสมเร็วขึ้นและรู้ว่า tool ติดตั้งแล้วหรือยัง

## Scope

ใช้เมื่อต้องหา skill สำหรับงานประเภทหนึ่ง หรือต้องการดู skills ทีเกี่ยวข้องกับ ecosystem เฉพาะ หรืออยากรู้ว่า action นั้นควรใช้ tool ไหนและติดตั้งในเครื่องหรือยัง

ดูเพิ่มเติม: /follow-devin-global-skills, /update-devin-global-skills, /search-skills, /list-devin-global-skills, /suggest-me, /ask-me, /idea, /check-skills-related, /review-devin-global-harness, /check-my-global-cli

## Execute

### 1. Identify Query

> Goal: รู้ว่าต้องหา skill สำหรับอะไร

1. ถ้า user ระบุ task → ใช้ค่านั้น
2. ถ้า user ระบุ ecosystem → ใช้ค่านั้น
3. ถ้าไม่ระบุ → แสดง map ทั่งหมด

### 2. Scan Skills

> Goal: รวบรวม skills ทีเกี่ยวข้อง

1. ใช้ `/find_file_by_name` หา `*/SKILL.md` ใน `%APPDATA%\devin\skills`
2. ใช้ `/grep` ค้นหา task/ecosystem ใน `description` และ `related`
3. อ่าน `AGENTS.md` เพื่อดู skill families

### 3. Build Map

> Goal: จัดกลุ่ม skills ตาม category

1. จัดกลุ่มตาม prefix: `follow-*`, `review-*`, `run-*`, `report-*`, `check-*`, `list-*`, `view-*`, `ask-*`
2. จัดกลุ่มตาม ecosystem: `bun`, `node`, `cloudflare`, `vercel`, `github`, `nextjs`, `svelte`, `solid`
3. จัดกลุ่มตาม task type: `ship`, `review`, `test`, `deploy`, `setup`, `create`, `refactor`, `debug`

### 4. Map Tools And Check Installed

> Goal: รู้ว่า action ใช้ tool ไหนและติดตั้งในเครื่องหรือยัง

1. เปิด [references/tool-map.md](references/tool-map.md) — map action → preferred CLI tool → install command → skill
2. ถ้า action ของ user อยู่ใน map → ดึง tool ที่ตรงกันมา pair กับ skill ที่เลือก
3. เช็คว่า tool ติดตั้งแล้วด้วย `Get-Command <tool>` หรือ `mise list` (quick check เฉพาะ tools ที่จะใช้)
4. ถ้า action ไม่มีใน map หรือต้องการ inventory ทั้งเครื่อง → ทำ `/check-my-global-cli`
5. ถ้า tool ยังไม่ติดตั้ง → เสนอ install command จาก map (prefer `mise use -g` สำหรับ global tools) ก่อน run

### 5. Filter And Select

> Goal: แสดงเฉพาะ skills ทีตรงกับ query

1. ถ้ามี task → กรอง skills ทีเกี่ยวข้องกับ task นั้น
2. ถ้ามี ecosystem → กรอง skills ทีเกี่ยวข้องกับ ecosystem นั้น
3. เรียงตามความสำคัญ: core skills ก่อน แล้ว related

### 6. Report

> Goal: แสดง map ให้อ่านง่าย

1. ทำ `/report` ด้วยคอลัมน์: No, Category, Skill, Description, Tool, Installed, Related
2. ทำ `/report` สรุป map
3. ทำ `/suggest-next-action`

## Rules

### 1. Map Categories

- จัดกลุ่มตาม prefix ของ skill name เสมอ
- แยก core กับ utility อย่างชัดเจน
- ระบุ skill ทีเป็น entry point ของแต่ละ workflow

### 2. Query Handling

- ถ้าไม่ระบุ query → แสดง map ทั่งหมด
- ถ้า query ไม่พบ skills → แนะนำ closest match
- ถ้า query ซ้ำกับ skill หลายตัว → ถาม user เพื่อ clarify

### 3. Maintenance

- map ต้อง sync กับ `AGENTS.md`
- ถ้ามี skill ใหม่ → อัปเดต map
- ถ้ามี skill ถูกลบ → เอาออกจาก map
- `references/tool-map.md` sync กับ tools ที่ติดตั้งจริง — อัปเดตผ่าน `/check-my-global-cli`

### 4. Tool Selection

- ตอนเลือก skill ให้ระบุ CLI tool ที่ skill ใช้ด้วยเสมอ (ดู `references/tool-map.md`)
- quick check installed เฉพาะ tools ที่เกี่ยว — ไม่ต้อง inventory ทั้งเครื่องทุกครั้ง
- ถ้า tool หลักไม่ได้ติดตั้ง → เสนอทางเลือกใน map หรือ install command ก่อนเรียก skill

## Expected Outcome

- ได้ map ของ skills ตาม task/ecosystem พร้อม CLI tool ที่ใช้
- รู้ว่าควรใช้ skill ใดสำหรับงานประเภทนั้น และ tool ติดตั้งหรือยัง
- แสดงในรูปแบบตารางทีอ่านง่าย
- ช่วยลดเวลาในการเลือก skill และลด `command not found` ตอนรันจริง
