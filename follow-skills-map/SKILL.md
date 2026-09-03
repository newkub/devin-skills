---
name: follow-skills-map
description: แสดง map ของ skills ตาม task type และ ecosystem ช่วยเลือก skill เร็วขึ้น
argument-hint: "[task-or-ecosystem]"
allowed-tools:
  - read
  - grep
  - find_file_by_name
  - exec
  - skill
  - ask_user_question
  - report
  - report-table
  - suggest-next-action
triggers:
  - user
  - model
related:
  - follow-devin-skills
  - update-devin-global-skills
  - search-skills
  - list-devin-global-skills
  - suggest-me
  - ask-me
  - idea-new-skills
  - check-skills-related
  - review-devin-global-skills
---

## Goal

แสดง map ของ Devin skills ตาม task type, ecosystem และ context เพื่อช่วย user และ model เลือก skill ทีเหมาะสมเร็วขึ้น

## Scope

ใช้เมื่อต้องหา skill สำหรับงานประเภทหนึ่ง หรือต้องการดู skills ทีเกี่ยวข้องกับ ecosystem เฉพาะ

ดูเพิ่มเติม: /follow-devin-skills, /update-devin-global-skills, /search-skills, /list-devin-global-skills, /suggest-me, /ask-me, /idea-new-skills, /check-skills-related, /review-devin-global-skills

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

### 4. Filter And Select

> Goal: แสดงเฉพาะ skills ทีตรงกับ query

1. ถ้ามี task → กรอง skills ทีเกี่ยวข้องกับ task นั้น
2. ถ้ามี ecosystem → กรอง skills ทีเกี่ยวข้องกับ ecosystem นั้น
3. เรียงตามความสำคัญ: core skills ก่อน แล้ว related

### 5. Report

> Goal: แสดง map ให้อ่านง่าย

1. ทำ `/report-table` ด้วยคอลัมน์: No, Category, Skill, Description, Related
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

## Expected Outcome

- ได้ map ของ skills ตาม task/ecosystem
- รู้ว่าควรใช้ skill ใดสำหรับงานประเภทนั้น
- แสดงในรูปแบบตารางทีอ่านง่าย
- ช่วยลดเวลาในการเลือก skill
