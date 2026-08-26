---
name: create-devin-global-skills
description: สร้าง skill ใหม่ใน devin global skills โดยใช้ follow-write-devin-skills
argument-hint: "[skill-name]"
related:
  - follow-write-devin-skills
  - consider-use-in-another-skills
  - scan-codebase
  - validate
  - check-reference
  - review-writing
  - update-reference
  - ship
---

## Goal

สร้าง skill ใหม่ใน `%APPDATA%\devin\skills` ตามมาตรฐาน โดยใช้ `/follow-write-devin-skills` สำหรับ `SKILL.md` และ directory structure

## Scope

ใช้เมื่อต้องสร้าง skill ใหม่จาก scratch ใน devin skills repo โดยไม่ซ้ำซ้อนกับ skills ที่มีอยู่

## Execute

### 1. Identify New Skill

> Goal: ระบุชื่อและวัตถุประสงค์ของ skill

1. รับชื่อ skill และสิ่งที่ต้องการทำจาก user
2. ตรวจสอบว่า skill name ใช้ lowercase, คั่นด้วย `-` และไม่มีอักขระพิเศษ
3. ระบุ target directory: `%APPDATA%\devin\skills\<skill-name>`
4. ถ้าชื่อไม่ชัด → ทำ `/ask-me` ก่อนดำเนินการ

### 2. Check Existing Skills

> Goal: ตรวจสอบว่าไม่ซ้ำซ้อน

1. ทำ `/scan-codebase` ใน `%APPDATA%\devin\skills`
2. ตรวจสอบว่า skill name ซ้ำกับ existing skills หรือไม่
3. ถ้าซ้ำ ให้ทำ `/consider-use-in-another-skills` เพื่อเสนอ extend หรือ rename ก่อน
4. อ่าน `AGENTS.md` และ `global_rules.md` เพื่อดู conventions

### 3. Create Directory

> Goal: สร้าง directory สำหรับ skill

1. สร้าง `%APPDATA%\devin\skills\<skill-name>\`
2. สร้าง `SKILL.md` เปล่าภายใน directory
3. ถ้าต้องการ child directories (`guide/`, `references/`, `scripts/`) ให้สร้างตามที่จำเป็น

### 4. Write SKILL.md And Directory

> Goal: สร้าง `SKILL.md` และ directory contents

1. ทำ `/follow-write-devin-skills` เพื่อเขียน `SKILL.md` หลัก (frontmatter + prompt body), เลือก template, จัดการ directory structure, references, `scripts/`, `guide/`, หรือ `examples/`
2. กำหนด `name` ให้ตรงกับ directory name
3. ใส่ `description` กระชับไม่เกิน 100 ตัวอักษร

### 5. Validate And Update References

> Goal: ตรวจสอบคุณภาพและ references

1. ทำ `/validate` เพื่อตรวจ: ไม่เกิน 250 บรรทัด, sections ครบ, `related` ไม่มี missing/unused, ไม่มี TODO/MOCK/placeholder
2. ทำ `/check-reference` เพื่อตรวจสอบ `related` references
3. ทำ `/review-writing` เพื่อตรวจสอบความชัดเจน
4. ทำ `/update-reference` ถ้ามีการเปลี่ยนแปลงชื่อ หรือเพิ่ม references

### 6. Ship

> Goal: ส่งมอบงาน

1. ทำ `/ship`
2. ถ้า `ship` ไม่ผ่าน → report สถานะ

## Rules

### 1. Target Location

- สร้าง skill ใน `%APPDATA%\devin\skills`
- directory name ต้องตรงกับ `name` ใน frontmatter
- ห้ามสร้างทับ skill ที่มีอยู่ ถ้าซ้ำให้ extend หรือ rename

### 2. Content Standard

- ทำตาม `/follow-write-devin-skills` สำหรับการเขียน `SKILL.md`
- ทำตาม `/follow-write-devin-skills` สำหรับ directory structure และ templates
- `description` ไม่เกิน 100 ตัวอักษร
- ใช้ backticks สำหรับ `tools`, `commands`, `file paths`, `skill-name`
- ไม่เกิน 250 บรรทัดต่อไฟล์

### 3. Safety

- ถ้ามีการ overwrite ไฟล์เดิม ต้องมี dry run และ user confirmation ก่อน
- ไม่ทำลาย references หรือ existing skills

## Expected Outcome

- skill ใหม่ถูกสร้างที่ `%APPDATA%\devin\skills\<skill-name>\` พร้อม `SKILL.md` ถูกต้อง
- directory name ตรงกับ `name` ใน frontmatter
- `SKILL.md` ผ่าน `/validate` ไม่เกิน 250 บรรทัด ไม่มี TODO/MOCK/placeholder
- `related` references ครบถ้วน ไม่มี missing/unused
- directory structure ครบถ้วนตาม `/follow-write-devin-skills` พร้อม `references/` `scripts/` `guide/` หรือ `examples/` เมื่อจำเป็น
- ไม่ซ้ำกับ skills ที่มีอยู่ หรือได้รับการยืนยันให้ extend หรือ rename
