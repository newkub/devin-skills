---
name: update-devin-project-skills
description: สร้างและอัปเดต project-local skills ใน .devin/skills/ ตาม project conventions
argument-hint: "[skill-or-workspace]"
related:
  - update-dot-devin
  - update-devin-global-skills
  - follow-create-devin-skills
  - deep-validate
  - report-table
---

## Goal

สร้างหรืออัปเดต project-local skills ใน `.devin/skills/` ให้ตรงกับ project conventions และ workspace requirements

## Scope

ใช้สำหรับ project-level `.devin/skills/` directory ไม่ใช่ global skills ใน `%APPDATA%\devin\skills`

## Execute

### 1. Detect Skills Needs

> Goal: รู้ว่าต้องสร้าง skill อะไร

1. อ่าน `AGENTS.md` root และ workspaces
2. อ่าน `package.json` ทั้งหมด
3. ระบุ workflows หรือ patterns เฉพาะ project ทีต้อง skill เฉพาะ
4. ตรวจ `.devin/skills/` ทีมีอยู่

### 2. Create Or Update Skills

> Goal: สร้าง/แก้ skills

1. สร้าง `.devin/skills/<skill-name>/SKILL.md` ถ้ายังไม่มี
2. ใช้ภาษาอังกฤษทั้งหมดสำหรับ project-local skills
3. ทำตามมาตรฐาน: frontmatter `name`, `description`, `related`
4. ใช้ `## Goal` → `## Scope` → `## Execute` → `## Rules` → `## Expected Outcome`
5. ไม่เกิน 250 บรรทัด

### 3. Sync With AGENTS.md

> Goal: ให้ AGENTS.md อ้างถึง skills

1. อัปเดต `AGENTS.md` ที root และ workspace ให้ reference skills ใหม่
2. ตรวจ `related` ของ skill ไม่ broken

### 4. Validate

> Goal: ยื่นยันว่า skills ถูกต้อง

1. ทำ `/deep-validate`
2. ตรวจ `name` ตรง directory name
3. ตรวจไม่มี TODO/MOCK/placeholder
4. ถ้า fail → แก้ (max 3)

### 5. Report

> Goal: สรุปผล

1. ทำ `/report-table` แสดง skill, status, location
2. ทำ `/suggest-next-action`

## Rules

### 1. Project-Local Only

- สร้างเฉพาะ skills ทีใช้เฉพาะ project
- ถ้า skill ทั่วไป → ใช้ `/update-devin-global-skills` แทน

### 2. English Content

- project-local skills เขียนด้วยภาษาอังกฤษ
- ยกเว้น project กำหนดให้ใช้ภาษาอื่น

### 3. Minimal

- ไม่ซ้ำกับ global skills
- ไม่เกิน 250 บรรทัด
- แยกรายละเอียดไป `references/` ถ้าจำเป็น

### 4. Valid References

- `related` ต้องชี้ไปยัง skills ทีมีอยู่จริง
- ไม่ broken references

## Expected Outcome

- `.devin/skills/` มี skills ครบตาม project workflows
- `AGENTS.md` อ้างถึง skills ถูกต้อง
- skills ผ่าน `/deep-validate`
- report table สรุปผล
