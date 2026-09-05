---
name: update-devin-project-skills
description: อัปเดต project-local skills ใน .devin/skills/ ตาม project conventions
argument-hint: "[skill-or-workspace]"
related:
  - follow-create-devin-project-skills
  - update-dot-devin
  - update-devin-global-skills
  - update-agents-md
  - deep-validate
  - report-table
---

## Goal

อัปเดต project-local skills ที่มีอยู่ใน `.devin/skills/` ให้ตรงกับ project conventions และ workspace requirements ที่เปลี่ยนไป

## Scope

ใช้สำหรับอัปเดต skills ใน `.devin/skills/` ของ project หรือ workspace — ถ้าต้องสร้าง skill ใหม่ให้ทำ `/follow-create-devin-project-skills` แทน ไม่ใช้กับ global skills ใน `%APPDATA%\devin\skills` (ใช้ `/update-devin-global-skills`)

ดูเพิ่มเติม: /follow-create-devin-project-skills, /update-devin-global-skills, /update-agents-md

## Execute

### 1. Detect Update Needs

> Goal: รู้ว่า skill ไหนต้องอัปเดต

1. อ่าน `AGENTS.md` root และ workspaces
2. อ่าน `package.json` และ scripts ทั้งหมดที่เปลี่ยน
3. ระบุ workflows หรือ patterns ที่เปลี่ยนไปจากตอนสร้าง skill
4. ตรวจ `.devin/skills/` ที่มีอยู่ว่า skill ไหน stale
5. ถ้า `.devin/skills/` ยังไม่มี → ส่งต่อ `/follow-create-devin-project-skills`

### 2. Apply Updates

> Goal: แก้ skills ให้ทันสมัย

1. ทำตามมาตรฐานจาก `/follow-create-devin-project-skills` — structure, naming, content rules
2. อัปเดต commands, paths และ conventions ให้ตรง `AGENTS.md` และ manifests ปัจจุบัน
3. ลบ commands/steps ที่ project ไม่มีแล้ว
4. ใช้ภาษาอังกฤษทั้งหมดสำหรับ project-local skills
5. แก้เฉพาะสิ่งที่เปลี่ยนจริง — ไม่ rewrite ทั้งไฟล์ถ้าไม่จำเป็น
6. ไม่เกิน 250 บรรทัด — แยกรายละเอียดไป `references/`

### 3. Sync With AGENTS.md

> Goal: ให้ AGENTS.md อ้างถึง skills ถูกต้อง

1. อัปเดต `AGENTS.md` ที่ root และ workspace ให้ตรงกับ skills ที่แก้
2. ตรวจ `related` ของ skill ไม่ broken
3. ทำ `/update-dot-devin` ถ้า `.devin/` manifest ต้องอัปเดต

### 4. Validate

> Goal: ยืนยันว่า skills ถูกต้อง

1. ทำ `/deep-validate`
2. ตรวจ `name` ตรง directory name
3. ตรวจไม่มี TODO/MOCK/placeholder
4. ถ้า fail → แก้ (max 3 รอบ)

### 5. Report

> Goal: สรุปผล

1. ทำ `/report-table` แสดง skill, status, location
2. ทำ `/suggest-next-action`

## Rules

### 1. Update Only

- skill นี้อัปเดตเท่านั้น — สร้างใหม่ให้ใช้ `/follow-create-devin-project-skills`
- ใช้เฉพาะ `.devin/skills/` — global skills ใช้ `/update-devin-global-skills`

### 2. English Content

- project-local skills เขียนด้วยภาษาอังกฤษ
- ยกเว้น project กำหนดให้ใช้ภาษาอื่น

### 3. Minimal Changes

- ไม่ซ้ำกับ global skills
- แก้เฉพาะสิ่งที่เปลี่ยนจริง รักษา existing conventions
- ไม่เกิน 250 บรรทัด แยกรายละเอียดไป `references/` ถ้าจำเป็น

### 4. Valid References

- `related` ต้องชี้ไปยัง skills ที่มีอยู่จริง
- ไม่ broken references

## Expected Outcome

- `.devin/skills/` มี skills ทันสมัยตาม project workflows ปัจจุบัน
- `AGENTS.md` อ้างถึง skills ถูกต้อง
- skills ผ่าน `/deep-validate`
- report table สรุปผล
