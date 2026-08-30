---
name: follow-devin-skills
description: อ่านและใช้ skills ทีมีใน global และ project (.devin/skills) ตามทีเหมาะสม
argument-hint: "[skill-name]"
related:
  - list-devin-global-skills
  - update-project-skills
  - check-reference
  - update-devin-global-skills
  - deep-validate
  - update-references
  - report
---

## Goal

อ่านและใช้ skills ทีมีอยู่ทั้งใน global (`%APPDATA%\devin\skills`) และ project (`.devin/skills`) ตามทีเหมาะสมกับ task ปัจจุบัน

## Scope

- ค้นหา skills ทั้งหมดทีใช้ได้ใน session
- รองรับทั้ง global skills และ project-level skills
- อ่าน skill ทีเลือกและใช้ตาม instructions
- ตรวจสอบ references ว่ามีอยู่จริง

## Execute

### 1. List Available Skills

> Goal: รู้ว่ามี skills อะไรบ้าง

1. ทำ `/list-devin-global-skills` เพื่อดู global skills
2. ถ้า project มี `.devin/skills/` ให้ list ไฟล์ `.devin/skills/*` ด้วย
3. ถ้ามี project `AGENTS.md` ให้อ่าน `### Skills` section
4. สร้างรายการ `global` และ `project` skills พร้อม path

### 2. Resolve Skill Name

> Goal: หา skill ทีต้องการใช้

1. ถ้ามี `argument [skill-name]` → ค้นหา skill ทีตรง
2. ถ้าไม่ระบุ → ค้นหาจาก context ของ task
3. ค้นหาทั้งใน `follow-devin-skills` (global) และ `.devin/skills/` (project)
4. ถ้ามีทั้ง global และ project ชื่อเดียวกัน → ใช้ project skill เว้นแต่ global ใหม่กว่าหรือ user ระบุ

### 3. Read Skill

> Goal: เข้าใจเนื้อหา skill

1. อ่าน `SKILL.md` ของ skill ทีเลือก
2. ถ้ามี `references/` ให้อ่าน `references/index.md`
3. ระบุ goal, scope, execute, rules, expected outcome
4. ตรวจสอบ `related` ว่า skills ทีอ้างอิงมีอยู่จริง

### 4. Check References

> Goal: ตรวจสอบความถูกต้องก่อนใช้

1. ทำ `/check-reference` เพื่อตรวจ references
2. ถ้า reference ไม่มีอยู่ → แจ้ง user หรือใช้ `/update-references`
3. ตรวจว่า skill ไม่มี circular dependency

### 5. Use Skill

> Goal: ดำเนินการตาม skill

1. ทำตาม instructions ใน `## Execute`
2. ใช้ tools ที่ skill ระบุ
3. ถ้า skill บอกให้ใช้ skills อื่น → ทำ `/follow-devin-skills` ซ้ำตามลำดับ
4. ตรวจสอบผลลัพธ์ตาม `## Expected Outcome`

### 6. Report

> Goal: สรุปการใช้ skill

1. ทำ `/report` ระบุ skill ที่ใช้, ผลลัพธ์, และ next action
2. ถ้ามี skill หลายตัว → สรุปลำดับทีใช้

## Rules

### 1. Global + Project

- ค้นหา skills ทั้ง global และ project
- project skills มี priority สูงกว่าเมื่อชื่อซ้ำ
- ถ้าไม่พบ → แจ้ง user และแนะนำให้สร้าง

### 2. Reference First

- อ่าน skill ก่อนใช้เสมอ
- ตรวจ references ก่อนอ้างอิง
- ไม่ใช้ skill ที่ validate ไม่ผ่าน

### 3. Scope Respect

- ไม่ใช้ skills ที่ไม่เกี่ยวข้อง
- ห้ามส่ง skill ซ้ำซ้อน
- ใช้ `argument-hint` ตามที่ skill ระบุ

## Expected Outcome

- อ่านและใช้ skill ได้อย่างถูกต้อง
- ใช้ skills ที่เหมาะสมกับ task
- References ถูกต้องทั้งหมด
- ผลลัพธ์ถูกต้องตามที่คาดหวัง
