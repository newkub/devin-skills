---
name: follow-create-devin-project-skills
description: มาตรฐานการสร้าง project-local Devin skills ใน .devin/skills/ ตาม project conventions
argument-hint: "[skill-name...]"
related:
  - update-devin-project-skills
  - follow-create-devin-global-skills
  - update-dot-devin
  - update-devin-project-rules
  - update-agents-md
  - check-skills-related
  - prepare-skills-context
  - scan-codebase
  - deep-validate
---

## Goal

กำหนดมาตรฐานการสร้าง project-local Devin skills ใน `.devin/skills/` — naming, structure, content rules และการ sync กับ `AGENTS.md` ของ project

## Scope

ใช้เป็น reference หลักเมื่อสร้าง skill ใหม่ใน `.devin/skills/` ของ project หรือ workspace ใน monorepo — ไม่ใช้กับ global skills ใน `%APPDATA%\devin\skills` (ใช้ `/follow-create-devin-global-skills` แทน)

ดูเพิ่มเติม: /update-devin-project-skills, /follow-create-devin-global-skills, /update-devin-project-rules, /update-agents-md

## Execute

### 1. Identify Skill And Workspace

> Goal: รู้ว่าจะสร้าง skill อะไรที่ workspace ไหน

1. รับ `skill-name` จาก argument หรือ context — ถ้าไม่ชัด → ทำ `/ask-me`
2. ระบุ target: root `.devin/skills/` หรือ `apps/<workspace>/.devin/skills/`
3. ตรวจว่า skill นั้นเฉพาะ project จริง — ถ้าใช้ได้ทั่วไป → ส่งต่อ `/follow-create-devin-global-skills`
4. ทำ `/scan-codebase` เพื่อหา workflow/pattern เฉพาะ project ที่ skill จะครอบคลุม

### 2. Check Duplicates And Conventions

> Goal: ไม่ซ้ำกับ skills ที่มีและตรง conventions

1. ตรวจ `.devin/skills/` ของ project และ `%APPDATA%\devin\skills` ว่ามี skill คล้ายกันไหม
2. ทำ `/check-skills-related` หรือ `/use-in-another-skills` ถ้าพบ skill ที่อาจซ้ำ
3. อ่าน `AGENTS.md` root และ workspace เพื่อดึง project conventions, commands และ tech stack
4. ทำ `/prepare-skills-context` เพื่อเลือก template และ directory pattern

### 3. Create Structure

> Goal: skill มีโครงสร้างเริ่มต้นที่ถูกต้อง

1. สร้าง `<project-or-workspace>/.devin/skills/<skill-name>/SKILL.md`
2. ใช้ kebab-case และ `name` ใน frontmatter ต้องตรงกับ directory name
3. ถ้าต้องการ code → สร้าง `src/` ตาม project stack ที่ตรวจจาก manifest
4. ถ้ามีรายละเอียดเพิ่ม → สร้าง `references/` พร้อม `index.md`
5. ถ้ามี rules → ใช้ `.devin/rules/` ตาม `/update-devin-project-rules` แทนการฝังใน skill

### 4. Write SKILL.md

> Goal: เอกสาร skill ถูกต้องตาม spec ฝั่ง project

1. Frontmatter ครบ: `name`, `description` ≤100 ตัวอักษร, `argument-hint`, `related`
2. Sections: `## Goal` → `## Scope` → `## Execute` → `## Rules` → `## Expected Outcome`
3. เขียนเนื้อหาเป็นภาษาอังกฤษทั้งหมด ยกเว้น project กำหนดภาษาอื่น
4. ใช้ commands และ paths ของ project จริงจาก `package.json`, `AGENTS.md`, หรือ scripts ที่มี
5. ใช้ backticks สำหรับ `tools`, `commands`, `paths`, `skill-name`
6. ไม่เกิน 250 บรรทัด — แยกรายละเอียดไป `references/`

### 5. Sync With Project

> Goal: skill เชื่อมกับ project artifacts

1. ทำ `/update-agents-md` ให้ `AGENTS.md` อ้างถึง skill ใหม่ถ้าเป็น workflow หลัก
2. ตรวจ `related` ชี้ไป skills ที่มีอยู่จริงทั้ง project และ global
3. ถ้า skill เกี่ยวกับ hooks/MCP → sync กับ `/update-devin-project-hooks` หรือ `/update-devin-project-mcp`
4. ทำ `/update-dot-devin` ถ้า `.devin/` manifest ต้องอัปเดต

### 6. Validate And Ship

> Goal: skill ผ่านมาตรฐานก่อนส่งมอบ

1. ทำ `/deep-validate` — frontmatter, ความยาว, TODO/placeholder, broken links
2. ตรวจ `related` ไม่มี missing หรือ circular
3. ถ้าไม่ผ่าน → แก้และ recheck ไม่เกิน 3 รอบ
4. ส่งต่อ `/update-devin-project-skills` สำหรับการอัปเดตภายหลัง

## Rules

### 1. Project-Local Only

- สร้างเฉพาะ skills ที่ใช้เฉพาะ project — skill ทั่วไปใช้ `/follow-create-devin-global-skills`
- ไม่ duplicate กับ global skills ที่มีอยู่

### 2. English Content

- Project-local skills เขียนด้วยภาษาอังกฤษทั้งหมด
- ยกเว้น project กำหนดให้ใช้ภาษาอื่นไว้ชัดเจน

### 3. Naming And Structure

- `name` ตรง directory name, kebab-case
- `description` ≤100 ตัวอักษร
- ทุกไฟล์ไม่เกิน 250 บรรทัด
- ไม่มี TODO/MOCK/placeholder

### 4. Project Truth

- ใช้ commands, paths และ conventions จาก `AGENTS.md` และ manifests จริงของ project
- ไม่ hardcode commands ที่ไม่มีใน project
- ทำ dry run ก่อน overwrite skill เดิม และขอ confirmation เสมอ

## Expected Outcome

- Skill ใหม่อยู่ใน `.devin/skills/<skill-name>/` ของ project หรือ workspace ที่ถูกต้อง
- `SKILL.md` เป็นภาษาอังกฤษ ผ่าน frontmatter spec และ section order
- ใช้ project commands/paths จริง ไม่ซ้ำกับ global skills
- `AGENTS.md` และ `.devin/` sync ถูกต้อง
- ผ่าน `/deep-validate` พร้อมใช้งาน
