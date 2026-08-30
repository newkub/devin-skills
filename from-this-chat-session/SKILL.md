---
name: from-this-chat-session
description: สกัดการทำงานจาก chat session นี้ไปสร้างเป็น skill ใหม่ใน repo
argument-hint: "[target]"
---

## Goal

สกัด workflow หรือการทำงานที่เกิดขึ้นใน chat session ปัจจุบัน แล้วสร้างเป็น skill ใหม่ใน `%APPDATA%\devin\skills` ตามมาตรฐาน `/update-devin-global-skills`

## Scope

ใช้เมื่อการทำงานใน chat session นี้มีรูปแบบที่ reusable และควรเป็น skill ไม่รวมการสรุป session (ใช้ `/summarize-this-chat-session`) หรือการบันทึก context ทั่วไป

## Execute

### 1. Analyze Chat Session

> Goal: ระบุ workflow ที่ reusable จาก session

1. รวบรวม tasks, steps, และ tools ที่ใช้ใน chat session นี้
2. ระบุรูปแบบการทำงานที่เกิดซ้ำได้และมีประโยชน์
3. กรองสิ่งที่เป็น one-off task ที่ไม่ควรเป็น skill
4. ถ้าไม่พบ workflow ที่ reusable → stop และ report

### 2. Determine Skill Name And Type

> Goal: ระบุชื่อและ prefix ของ skill ใหม่

1. เลือก prefix ตาม `/update-devin-global-skills`: `run-*`, `follow-*`, `check-*`, `review-*`, `report-*`, `idea-*`, `lib-*`
2. ตั้งชื่อ skill ให้สื่อถึง workflow ที่สกัดได้
3. ตรวจสอบว่าชื่อไม่ซ้ำกับ existing skills ด้วย `/scan-codebase`
4. ถ้าซ้ำ → เสนอ extend หรือ rename

### 3. Extract Steps Into SKILL.md

> Goal: แปลงการทำงานใน session เป็น skill structure

1. แปลง tasks ใน session เป็น `## Execute` steps ตามมาตรฐาน `/update-devin-global-skills`
2. สกัด rules และ constraints ที่ใช้ใน session เป็น `## Rules`
3. เขียน `## Goal`, `## Scope`, `## Expected Outcome` ให้สอดคล้อง
4. เพิ่ม `> Goal:` สำหรับแต่ละ step (อันเดียวต่อ step)
5. ใช้ backticks สำหรับ `tools`, `commands`, `paths`, `skill-name`

### 4. Create Skill Package

> Goal: สร้าง skill package ครบถ้วน

1. ทำ `/update-devin-global-skills` เพื่อเลือก template และสร้าง directory structure
2. สร้าง `%APPDATA%\devin\skills\<skill-name>\SKILL.md`
3. ถ้าต้องการ `references/`, `scripts/`, `guide/` → สร้างตามความจำเป็น
4. กำหนด `name` ให้ตรงกับ directory name
5. ใส่ `description` กระชับไม่เกิน 100 ตัวอักษร

### 5. Validate And Ship

> Goal: skill ใหม่ผ่าน validation และพร้อมใช้งาน

1. ตรวจสอบว่า `SKILL.md` ไม่เกิน 250 บรรทัด
2. ทำ `/deep-validate` เพื่อตรวจความถูกต้อง
3. ทำ `/deep-validate` เพื่อตรวจ: sections ครบ, ไม่มี TODO/MOCK/placeholder
4. ทำ `/ship-ci`

## Rules

### 1. Reusability

- สกัดเฉพาะ workflow ที่ reusable ไม่ใช่ one-off task
- ถ้า session มีหลาย workflows → เลือกอันที่มีค่าที่สุดหรือถามผู้ใช้
- ไม่สร้าง skill ที่ซ้ำซ้อนกับ existing skills

### 2. Content Standard

- ทำตาม `/update-devin-global-skills` สำหรับ structure และ template
- Frontmatter มีเฉพาะ `name` และ `description`
- `description` ไม่เกิน 100 ตัวอักษร
- ใช้ backticks สำหรับ `tools`, `commands`, `file paths`, `skill-name`
- ไม่เกิน 250 บรรทัดต่อไฟล์

### 3. Safety

- ไม่ทำลาย existing skills
- ถ้าชื่อซ้ำ → extend หรือ rename ก่อน
- ถ้ามีการ overwrite → user confirmation ก่อน

### 4. Non-Redundancy

- การสรุป session อยู่ใน `/summarize-this-chat-session` แล้ว
- skill นี้เน้นการสกัด workflow เป็น skill ใหม่เท่านั้น

## Expected Outcome

- skill ใหม่ถูกสร้างจาก workflow ใน chat session นี้
- ชื่อและ prefix ตรงกับประเภทของ workflow
- `SKILL.md` ถูกต้องตามมาตรฐาน `/update-devin-global-skills` ไม่เกิน 250 บรรทัด
- ผ่าน `/deep-validate`
- ไม่ซ้ำกับ skills ที่มีอยู่
