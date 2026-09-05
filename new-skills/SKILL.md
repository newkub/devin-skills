---
name: new-skills
description: สร้าง global Devin skills หนึ่งรายการขึ้นไปโดยปฏิบัติตามมาตรฐานของ update-devin-global-skills
argument-hint: "<skill-name> [skill-name...]"
allowed-tools:
  - read
  - write
  - edit
  - grep
  - find_file_by_name
  - exec
  - skill
  - run_subagent
  - ask_user_question
  - todo_write
triggers:
  - user
  - model
related:
  - follow-create-devin-global-skills
  - update-devin-global-skills
  - review-devin-global-skills
  - use-in-another-skills
  - follow-global-rules
  - deep-validate
  - check-skills-related
  - update-references
---

## Goal

สร้าง global Devin skills ใหม่หนึ่งรายการขึ้นไปใน `%APPDATA%\devin\skills` โดยปฏิบัติตามมาตรฐานจาก `follow-create-devin-global-skills`

## Scope

ใช้เมื่อผู้ใช้ต้องการสร้าง skill files ใหม่ โดย skill นี้จะ delegate ไปยัง `follow-create-devin-global-skills` สำหรับการสร้างจริง แต่ให้จุดเริ่มต้นที่รวดเร็วและจัดการ batch naming

ดูเพิ่มเติม: /follow-global-rules

## Execute

### 1. Identify Skill Names

> Goal: ระบุชื่อ skill

1. รับชื่อ skill หนึ่งรายการขึ้นไปจาก argument หรือ context
2. validate ว่าชื่อแต่ละรายการเป็น kebab-case
3. ตรวจสอบว่ามี skill ใดที่มีชื่อนั้นแล้วใน `%APPDATA%\devin\skills` หรือไม่
4. หากชื่อนั้นมีอยู่แล้ว ให้ถามว่าจะ overwrite, rename หรือ extend
5. หากไม่ได้ให้ชื่อมา ให้ถามผู้ใช้อย่างน้อยหนึ่งชื่อ

### 2. Check For Duplicates

> Goal: ตรวจหา skill ที่ซ้ำกัน

1. เรียก `find_file_by_name` หรือ `grep` เพื่อตรวจสอบว่ามี skill ที่คล้ายกันอยู่แล้วหรือไม่
2. ใช้ `use-in-another-skills` หากพบ skill ที่อาจซ้ำกัน
3. หากผู้ใช้ยืนยัน ให้ดำเนินการต่อด้วยชื่อใหม่

### 3. Run follow-create-devin-global-skills

> Goal: รัน follow-create-devin-global-skills

1. เรียก `/follow-create-devin-global-skills` ด้วยรายการชื่อ skill ใหม่
2. ปล่อยให้ skill นั้นจัดการ naming, frontmatter, sections, templates, และ directory structure
3. หาก skill ต้องการ code หรือ CLI ให้เรียก `follow-create-*` skill ที่เหมาะสม

### 4. Review And Validate

> Goal: ตรวจทานและ validate

1. เรียก `/review-devin-global-skills` เพื่อตรวจสอบ conventions และคุณภาพเนื้อหา
2. เรียก `/deep-validate` สำหรับ frontmatter, ความยาว, TODO, และ references
3. เรียก `/check-skills-related` เพื่อให้แน่ใจว่า skill ใหม่ไม่ซ้ำกับ skill ที่มีอยู่

### 5. Update References

> Goal: อัปเดต references

1. เรียก `/update-references` เพื่อ sync related skills
2. อัปเดต `AGENTS.md` และ `global_rules.md` หาก skill ใหม่แนะนำ patterns หรือ rules ใหม่

### 6. Ship

> Goal: Ship

1. รัน `/ship` หาก skill มี code หรือต้องการ deploy
2. รายงาน paths ของ skill ที่สร้างขึ้นและ validation status

## Rules

### 1. Naming

- ชื่อ skill ต้องเป็น kebab-case และตรงกับ directory name
- ห้าม overwrite skill ที่มีอยู่โดยไม่ได้รับการยืนยันจากผู้ใช้
- หากชื่อถูกใช้แล้ว ให้เสนอการ rename หรือ extension

### 2. Delegation

- เสมอให้ delegate การสร้างจริงไปยัง `/follow-create-devin-global-skills`
- ห้าม bypass global standards
- ใช้ `follow-create-*` skill ที่ถูกต้องสำหรับ skill ที่มี code, CLI, web หรือ MCP

### 3. Validation

- skill ใหม่ต้องผ่าน `/deep-validate` และ `/review-devin-global-skills`
- เก็บ `SKILL.md` ให้ต่ำกว่า 250 บรรทัด
- เก็บ `description` ให้ต่ำกว่า 100 ตัวอักษร
- ห้ามปล่อยให้ค้าง TODO, MOCK หรือ placeholder text

### 4. References

- อัปเดต references หลังจากสร้างหรือ rename skill
- เพิ่ม skill ใหม่ใน `AGENTS.md` หรือ `global_rules.md` เฉพาะเมื่อพวกมันเป็น core workflows

## Expected Outcome

- สร้าง skill directories ใหม่ใน `%APPDATA%\devin\skills`
- แต่ละ `SKILL.md` ปฏิบัติตาม global skill conventions
- skill ผ่านการ validate และ references ได้รับการ synchronize
- ผู้ใช้ได้รับรายการ paths ของ skill ที่สร้างหรืออัปเดต

