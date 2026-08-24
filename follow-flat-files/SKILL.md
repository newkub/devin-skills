---
name: follow-flat-files
description: แปลง references directory จากโครงสร้าง `<name>/SKILL.md` เป็น flat file `<name>.md`
allowed-tools:
  - read
  - edit
  - write
  - grep
  - glob
  - exec
  - ask_user_question
triggers:
  - user
  - model
related:
  - check-reference
  - follow-write-devin-skills
  - update-reference
  - validate
---

## Goal

แปลง references ที่มีโครงสร้าง nested directories (`<name>/SKILL.md`) ให้กลายเป็น flat files (`<name>.md`) ใน directory เดียวกัน

## Scope

ใช้สำหรับ skill references หรือ archived skills ที่ไม่ต้องการเก็บเป็น directory ย่อย — รองรับโครงสร้าง `references/<name>/SKILL.md` → `references/<name>.md` แต่ไม่ใช้กับ top-level active skills

## Execute

### 1. Identify Target Directories

> Goal: หา directories ที่ต้องแปลง
> Goal: รู้จำนวนไฟล์และตำแหน่งที่ต้องแปลง

1. ระบุ `references/` หรือ target directory ที่ต้องการแปลง
2. ใช้ `glob` หา `*/SKILL.md` ภายใต้ target directory
3. ตรวจสอบว่าไฟล์ทุกไฟล์มี `name` ใน frontmatter ตรงกับ directory name ก่อนแปลง
4. ถ้ามีไฟล์นอก `SKILL.md` ใน directory (เช่น `README.md`, `examples.md`) → เก็บไว้ หรือถาม user ก่อน

### 2. Convert To Flat Files

> Goal: ย้าย `SKILL.md` จากแต่ละ directory ออกมาเป็น flat file
> Goal: ไม่มี nested directories เหลืออยู่

1. สำหรับแต่ละ `<name>/SKILL.md`:
   - อ่านเนื้อหาทั้งหมด
   - เขียนไฟล์ใหม่ที่ `<name>.md`
   - ลบ directory `<name>/`
2. ตรวจสอบว่าไฟล์ใหม่สามารถ `read` ได้และ frontmatter ไม่เสียหาย
3. ถ้า directory ไม่ว่างหลังย้าย → รายงานและ stop

### 3. Update Path References

> Goal: อัปเดท paths ใน active skill files หรือ references อื่นที่อ้างอิงถึง directories เดิม
> Goal: ไม่มี broken references

1. ใช้ `grep` ค้นหา `references/<name>/` หรือ `references/<name>/SKILL.md` ทั่ว target skill
2. แทนที่ด้วย `references/<name>.md`
3. ตรวจสอบ `related` lists ของ active skills ว่ายังถูกต้อง
4. ทำ `/check-reference` เพื่อตรวจหา broken references

### 4. Validate

> Goal: ตรวจสอบว่าโครงสร้าง flat ถูกต้อง
> Goal: active skill ยังเรียก references ได้

1. ตรวจสอบ active skill ยังเรียก references ได้
2. ทำ `/update-reference` กับ active skill หลัก
3. ทำ `/validate` เพื่อตรวจความถูกต้องของ flat files
4. ถ้ามีปัญหา → แก้ไขและ revalidate (max 3 → stop/report)

## Rules

### 1. When To Flatten

- ใช้เมื่องาน skill references หรือ archived skills ไม่ต้องการ directory ย่อย
- ไม่ใช้กับ top-level active skills ที่ต้องมี `<skill-name>/SKILL.md`
- ไม่แปลงถ้า directory มีไฟล์หลักกว่า 1 ไฟล์โดยไม่ได้ถาม user ก่อน

### 2. File Naming

- `<name>.md` ต้องตรงกับ `name` ใน frontmatter
- ใช้ `kebab-case` สำหรับชื่อไฟล์
- ถ้า `name` ใน frontmatter ไม่ตรงกับ directory name → แก้ไขให้ตรงก่อน flatten

### 3. Reference Updates

- อัปเดท `references/<name>/` → `references/<name>.md`
- อัปเดท `references/<name>/SKILL.md` → `references/<name>.md`
- ไม่เปลี่ยน `name` ใน frontmatter ของ flat file
- active skill ที่เรียก references ต้องอัปเดท path ด้วย

### 4. Safety

- ทำ dry run ก่อนดำเนินการถ้า target มีมากกว่า 10 files
- ถาม user ก่อนลบ directory ที่มีไฟล์นอก `SKILL.md`
- ถ้า git ไม่สะอาด → stop และ report ก่อนแปลง

## Expected Outcome

- ไม่มี nested `references/<name>/` directories เหลือ
- ทุก reference กลายเป็น `references/<name>.md`
- Active skill ยังอ้างอิง references ได้ถูกต้อง
- ไม่มี broken path references
