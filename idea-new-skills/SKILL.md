---
name: idea-new-skills
description: สร้างไอเดีย skill ใหม่ของ Devin โดยอิงจาก gaps, workflows และความต้องการของผู้ใช้
argument-hint: "[topic-or-gap]"
allowed-tools:
  - read
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
  - new-skills
  - check-skills-related
  - use-in-another-skills
  - follow-create-devin-skills
  - update-devin-global-skills
  - report-idea
  - deep-thinking
  - scan-codebase
  - follow-skills-map
---

## Goal

สร้างไอเดียที่เป็นรูปธรรมสำหรับ Devin skills ใหม่ โดยวิเคราะห์ gaps ใน skill set ที่มีอยู่, user workflows และ common tasks

## Scope

ใช้เมื่อผู้ใช้ต้องการไอเดีย skill ใหม่, สังเกตว่า workflow ใดขาดหายไป หรือถามว่า "ควรมี skill สำหรับ X หรือไม่" ผลลัพธ์เป็นรายการที่เรียงลำดับของ skill proposals พร้อม name, description และ trigger

## Execute

### 1. Identify Context

> Goal: ระบุ context

1. รับ topic หรือ gap ทั่วไปจาก argument หรือ context โดยไม่บังคับ
2. ถ้าไม่มี topic ให้ถามผู้ใช้ว่างานประเภทใดยังขาด skill อยู
3. ตัวอย่าง: terminal tools, git workflows, report skills, deployment, IDE integration
4. บันทึก topic ลงใน `todo_write`

### 2. Scan Existing Skills

> Goal: สำรวจ skills ที่มีอยู่

1. แสดงรายการ skills ทั้งหมดใน `%APPDATA%\devin\skills`
2. ใช้ `find_file_by_name` เพื่อค้นหา skills ที่เกี่ยวข้องกับ topic
3. ใช้ `grep` เพื่อหา skills ที่มีอยู่แล้วที่อาจครอบคลุมไอเดียนั้น
4. ระบุ gaps: งานทั่วไปที่ไม่มี skill เฉพาะ, skills ที่กว้างเกินไป หรือ workflows ที่ยังขาดหาย

### 3. Analyze Workflows

> Goal: วิเคราะห์ workflows

1. รัน `/scan-codebase` ถ้าไอเดียเกี่ยวข้องกับโปรเจกต์
2. ดูคำสั่งล่าสุดของผู้ใช้และประวัติ session ถ้ามี
3. ระบุรูปแบบหรืองานที่ผู้ใช้ทำซ้ำด้วยตนเอง
4. ตรวจสอบ `AGENTS.md` และ `global_rules.md` เพื่อหา workflow gaps

### 4. Generate Ideas

> Goal: สร้างไอเดีย

1. ใช้ `/deep-thinking` เพื่อระดมความคิดเกี่ยวกับ concept ของ skills
2. สำหรับแต่ละไอเดีย ให้กำหนด:
   - `name` ใน kebab-case
   - `description` ไม่เกิน 100 ตัวอักษร
   - `trigger` ว่า skill ควรรันเมื่อใด
   - `related` skills
   - ขั้นตอนหลักใน `Execute` (ไม่เกิน 6-8 ขั้นตอน)
3. หลีกเลี่ยงการซ้ำกับ skills ที่มีอยู่
4. จัดลำดับความสำคัญของไอเดียตาม impact และ effort

### 5. Present Ideas

> Goal: นำเสนอไอเดีย

1. แสดงรายการ skill proposals ในรูปตาราง 2 คอลัมน์:
   - `Skill ใหม่`: name, description และ trigger
   - `Skills ทีควรใช้`: รายการ skills ทีมีอยู่ที skill ใหม่นี้ควร integrate ด้วย
2. จัดกลุ่มไอเดียตามหมวดหมู (terminal, git, report, review, deploy, etc.)
3. ระบุ impact และ effort สำหรับแต่ละไอเดีย
4. ถามผู้ใช้ว่าต้องการ implement ไอเดียใด

### 6. Create Selected Skills

> Goal: สร้าง skills ที่เลือก

1. สำหรับแต่ละไอเดียที่เลือก ให้เรียก `/new-skills` หรือ `/update-devin-global-skills`
2. ให้ผู้ใช้ปรับแต่ง skill ก่อนสร้าง
3. ตรวจสอบ skill แต่ละอันด้วย `/deep-validate`
4. อัปเดต references ด้วย `/update-references`

## Rules

### 1. No Duplicates

- ตรวจสอบ skills ที่มีอยู่ก่อนเสนอ skill ใหม่
- ถ้ามี skill คล้ายกันอยู่แล้ว ให้เสนอการขยาย skill นั้นแทน
- ใช้ `use-in-another-skills` เมื่อพบความซ้อนทับ

### 2. Concrete And Focused

- แต่ละไอเดียต้องมี name, description และ trigger ที่ชัดเจน
- description ต้องไม่เกิน 100 ตัวอักษร
- ไอเดียควรแก้ปัญหา workflow เดียว ไม่ใช่ทุกปัญหา

### 3. User-Driven

- ถามผู้ใช้ก่อนสร้าง skills
- ให้ผู้ใช้จัดลำดับหรือปฏิเสธไอเดีย
- ห้ามสร้าง skills โดยไม่ได้รับ confirmation

### 4. Align With Standards

- ไอเดีย skill ใหม่ต้องปฏิบัติตาม conventions ของ skills ทั่วไป
- เลือกใช้ prefix `follow-*`, `check-*`, `report-*`, `run-*`, `review-*` หรือ `view-*` เมื่อเหมาะสม
- หลีกเลี่ยงชื่อทั่วไป เช่น `helper` หรือ `tool`

### 5. Evidence-Based

- อิงจาก gaps ที่เป็นจริง, งานที่ทำซ้ำ หรือคำขอของผู้ใช้
- ห้ามสร้าง skill ที่ไม่แก้ปัญหา workflow จริง

## Expected Outcome

- รายการไอเดีย skill ใหม่ที่เรียงลำดับ พร้อม name, description, trigger และ related skills
- skills ที่เลือกถูกสร้างและตรวจสอบแล้ว
- ไม่มี skills ที่ซ้ำหรือกว้างเกินไปถูกสร้าง
- ผู้ใช้ได้รับ proposal ที่ชัดเจนก่อนมีการเขียนไฟล์ใดๆ