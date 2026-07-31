---
name: new-devin-skills-global
description: สร้าง skill ใหม่ใน devin global skills โดยใช้ follow-write-devin-skills
triggers: ['user', 'model']
allowed-tools: ['read', 'edit', 'write', 'grep', 'glob', 'exec', 'ask_user_question']
related:
  - follow-write-devin-skills
  - follow-write-skill-md
  - scan-codebase
  - ask-me
  - validate
  - check-reference
  - follow-content-quality
  - update-reference
---

## Goal

สร้าง skill ใหม่ใน `C:\Users\Veerapong\AppData\Roaming\devin\skills` ตามมาตรฐาน และใช้ `follow-write-devin-skills` เป็นหลักสำหรับเขียน `SKILL.md`

## Scope

ใช้เมื่อต้องสร้าง skill ใหม่จาก scratch ใน devin skills repo โดยไม่ซ้ำซ้อนกับ skills ที่มีอยู่

## Execute

### 1. Identify New Skill

ระบุชื่อและวัตถุประสงค์ของ skill

> Goal: skill ใหม่มีชื่อและ scope ชัดเจน

1. รับชื่อ skill และสิ่งที่ต้องการทำจาก user
2. ตรวจสอบว่า skill name ใช้ lowercase, คั่นด้วย `-` และไม่มีอักขระพิเศษ
3. ระบุ target directory: `C:\Users\Veerapong\AppData\Roaming\devin\skills\<skill-name>`
4. ถ้าชื่อไม่ชัด → ทำ `ask-me` ก่อนดำเนินการ

### 2. Check Existing Skills

ตรวจสอบว่าไม่ซ้ำซ้อน

> Goal: ไม่สร้าง skill ซ้ำ

1. ทำ `scan-codebase` ใน `C:\Users\Veerapong\AppData\Roaming\devin\skills`
2. ตรวจสอบว่า skill name ซ้ำกับ existing skills หรือไม่
3. ถ้าซ้ำ ให้เสนอ extend หรือ rename ก่อน
4. อ่าน `AGENTS.md` และ `global_rules.md` เพื่อดู conventions

### 3. Create Directory

สร้าง directory สำหรับ skill

> Goal: โครงสร้าง skill ถูกต้อง

1. สร้าง `C:\Users\Veerapong\AppData\Roaming\devin\skills\<skill-name>\`
2. สร้าง `SKILL.md` เปล่าภายใน directory
3. ถ้าต้องการ child directories (`guide/`, `references/`, `scripts/`) ให้สร้างตามทีจำเป็น

### 4. Write SKILL.md

เขียน `SKILL.md` โดยใช้ follow-write-devin-skills

> Goal: `SKILL.md` ถูกต้องตามมาตรฐาน

1. ทำ `follow-write-skill-md` เพื่อเขียน `SKILL.md` หลัก
2. ถ้า skill ต้องการ subdirectories หรือหลายไฟล์ ให้ทำ `follow-write-devin-skills`
3. กำหนด `name` ให้ตรงกับ directory name
4. ใส่ `description` กระชับไม่เกิน 100 ตัวอักษร

### 5. Validate And Update References

ตรวจสอบคุณภาพและ references

> Goal: skill พร้อมใช้งาน

1. ทำ `validate` เพื่อตรวจสอบว่าไฟล์ไม่เกิน 250 บรรทัด
2. ทำ `check-reference` เพื่อตรวจสอบ `related` references
3. ทำ `follow-content-quality` เพื่อตรวจสอบความชัดเจน
4. ทำ `update-reference` ถ้ามีการเปลี่ยนแปลงชื่อ หรือเพิ่ม references

## Rules

### Target Location

- สร้าง skill ใน `C:\Users\Veerapong\AppData\Roaming\devin\skills`
- directory name ต้องตรงกับ `name` ใน frontmatter
- ห้ามสร้างทับ skill ที่มีอยู่ ถ้าซ้ำให้ extend หรือ rename

### Content Standard

- ทำตาม `follow-write-devin-skills` สำหรับโครงสร้างและมาตรฐาน
- `description` ไม่เกิน 100 ตัวอักษร
- ใช้ backticks สำหรับ `tools`, `commands`, `file paths`, `skill-name`
- ไม่เกิน 250 บรรทัดต่อไฟล์

### Safety

- ถ้ามีการ overwrite ไฟล์เดิม ต้องมี dry run และ user confirmation ก่อน
- ไม่ทำลาย references หรือ existing skills

## Expected Outcome

- Skill ใหม่อยู่ใน `C:\Users\Veerapong\AppData\Roaming\devin\skills\<skill-name>`
- `SKILL.md` ถูกต้องตามมาตรฐาน `follow-write-devin-skills`
- ไม่มี skill ซ้ำหรือ references ขาด
