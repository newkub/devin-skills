---
name: add-devin-skills
description: เพิ่ม devin skills ใหม่ลงใน windsurf skills repository ตามมาตรฐาน
triggers: ['user', 'model']
allowed-tools: ['read', 'edit', 'write', 'grep', 'glob', 'exec', 'ask_user_question']
related:
  - follow-write-skill-md
  - scan-codebase
  - check-reference
  - follow-content-quality
  - validate
  - update-reference
---

## Goal

เพิ่ม devin skill ใหม่ลงใน `C:\Users\Veerapong\.codeium\windsurf\skills` ตามมาตรฐาน `follow-write-skill-md`

## Scope

ใช้เมื่อต้องคัดลอกหรือสร้าง skill ใหม่จาก devin skills ไปยัง windsurf skills repo โดยไม่ซ้ำซ้อนกับ skills ที่มีอยู่

## Execute

### 1. Identify Source Skill

ระบุ skill ที่ต้องการเพิ่ม

> Goal: รู้ตำแหน่ง source และชื่อ skill ที่ถูกต้อง

1. ทำตาม `scan-codebase` เพื่องหา skill ที่ต้องการเพิ่มใน `C:\Users\Veerapong\AppData\Roaming\devin\skills`
2. ระบุ target name ให้ตรงกับ directory name ใน `C:\Users\Veerapong\.codeium\windsurf\skills`
3. ตรวจสอบว่า skill ชื่อเดียวกันยังไม่มีอยู่ใน windsurf skills

### 2. Read References

อ่าน context และ references เพื่องไม่ซ้ำซ้อน

> Goal: ได้ context ครบถ้วนก่อนเขียน skill

1. ทำตาม `check-reference` เพื่องตรวจสอบว่า source skill และ references มีอยู่จริง
2. อ่าน `AGENTS.md` ใน `C:\Users\Veerapong\.codeium\windsurf\skills` เพื่อดูมาตรฐาน
3. อ่าน skills ที่คล้ายกันเพื่อป้องกันการซ้ำซ้อน

### 3. Create Skill

สร้าง directory และเขียน SKILL.md

> Goal: สร้าง skill ใหม่ให้ถูกต้อง

1. สร้าง directory `<skill-name>/` ใน `C:\Users\Veerapong\.codeium\windsurf\skills`
2. ทำตาม `follow-write-skill-md` เพื่อเขียน `SKILL.md`
3. ถ้ามีไฟล์เพิ่มเติม (`guide/`, `key-concepts/`, `references/`) ให้สร้างตามมาตรฐาน
4. ทำตาม `follow-content-quality` เพื่อตรวจสอบคุณภาพเนื้อหา

### 4. Validate And Update References

ตรวจสอบและอัปเดท references

> Goal: skill ผ่าน validation และ references ครบถ้วน

1. ทำตาม `validate` เพื่อตรวจสอบว่าไฟล์ไม่เกิน 250 บรรทัด และ frontmatter ถูกต้อง
2. ทำตาม `update-reference` ถ้ามีการเปลี่ยนแปลงชื่อ ย้าย หรือเพิ่ม skill
3. ตรวจสอบว่าไม่มีชื่อซ้ำหรือ circular references

## Rules

### 1. Target Location

- สร้าง skill ใน `C:\Users\Veerapong\.codeium\windsurf\skills`
- directory name ต้องตรงกับ `name` ใน frontmatter
- ห้ามสร้างทับ skill ที่มีอยู่ ถ้าซ้ำให้ extend หรือ rename

### 2. Content Standard

- ทำตาม `follow-write-skill-md` สำหรับ frontmatter และ structure
- `description` ไม่เกิน 100 ตัวอักษร
- ใช้ backticks สำหรับ `tools`, `commands`, `file paths`, `/workflow-name`
- ไม่เกิน 250 บรรทัดต่อไฟล์

### 3. Safety

- ถ้ามีการ overwrite ไฟล์เดิม ต้องมี dry run และ user confirmation ก่อน
- ไม่ทำลาย references หรือ existing skills

## Expected Outcome

- Devin skill ใหม่ถูกเพิ่มลงใน windsurf skills repo
- `SKILL.md` ถูกต้องตามมาตรฐาน `follow-write-skill-md`
- ไม่มี skill ซ้ำหรือ references ขาด