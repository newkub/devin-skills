---
name: update-project-skills
description: สร้างและอัปเดต project skills ใน .devin/skills/ ตามมาตรฐาน follow-write-devin-skills
related:
  - analyze-project
  - list-devin-global-skills
  - follow-write-devin-skills
  - check-monorepo
  - validate
  - update-agents-md
---

## Goal

สร้างและอัปเดต project-level skills ใน `.devin/skills/` ของ project โดยวิเคราะห์ dependencies, workflows และ gaps แล้วเขียนตาม `/follow-write-devin-skills`

## Scope

ใช้เพื่อสร้างหรืออัปเดต skills ใน project's `.devin/skills/` directory ครอบคลุมการวิเคราะห์ project needs, เลือก template, สร้าง `SKILL.md` และไฟล์ย่อย ไม่รวมการแก้ไข global skills หรือ source code ของ project

## Execute

### 1. Prepare Project Context

> Goal: ทราบ project structure, dependencies และ existing skills

1. ทำ `/prepare-skills-context` เพื่อตรวจจับ AI tool และเลือก template
2. ตรวจว่า project มี `.devin/skills/` directory หรือไม่:
   - ถ้ามี → อ่าน skills ที่มีอยู่ทั้งหมด
   - ถ้าไม่มี → สร้าง `.devin/skills/` directory
3. ทำ `/analyze-project` เพื่อวิเคราะห์ tech stack, dependencies และ workflows
4. ทำ `/check-monorepo` ถ้า project เป็น monorepo เพื่อระบุ workspaces
5. บันทึก project context: stack, dependencies, existing skills, gaps

### 2. Identify Needed Skills

> Goal: ระบุ skills ที่ project ต้องการ

1. วิเคราะห์ dependencies จาก `package.json`, `Cargo.toml`, `go.mod`, `pyproject.toml` หรือ `requirements.txt`
2. ดึงรายชื่อ dependencies ที่มี skill pattern ใน Devin ecosystem
3. ทำ `/list-devin-global-skills` หรือ scan `%APPDATA%\devin\skills` เพื่อดู skills ทีมีใน global
4. สำหรับแต่ละ dependency:
   - ถ้ามี global skill ที่ตรง → อ้างอิง global skill แทน ไม่สร้างใหม่
   - ถ้าไม่มี global skill และ project ต้องการ → เพิ่มลงรายการ skills ที่ขาด
5. ข้าม dependencies ที่ไม่มี skill pattern
6. วิเคราะห์ project workflows และ conventions ที่ควรเป็น skills
7. ตรวจ `AGENTS.md` ของ project เพื่อหา workflows ที่ยังไม่มี skill
8. จัดรายการ skills ที่ต้องสร้างหรืออัปเดต พร้อม priority

### 3. Create Or Update Skills

> Goal: สร้างหรืออัปเดต skills ใน `.devin/skills/` ตามมาตรฐาน

1. สำหรับแต่ละ skill ในรายการ:
   - ทำ `/follow-write-devin-skills` เพื่อสร้างหรืออัปเดต skill package
   - ใช้ `.devin/skills/<skill-name>/SKILL.md` เป็น target path
   - เลือก template ตาม prefix ของ skill
   - เขียน `SKILL.md` ตามมาตรฐาน `Goal` → `Scope` → `Execute` → `Rules` → `Expected Outcome`
2. ถ้า skill มี dependencies → สร้าง `references/` ครบถ้วน
3. ถ้า skill มี CLI หรือ web → สร้าง `src/` directory
4. ทำ `/validate` สำหรับแต่ละ skill หลังสร้างเสร็จ
5. ถ้า validation ไม่ผ่าน → แก้และ revalidate (max 3 → stop/report)

### 4. Update Project AGENTS.md

> Goal: project `AGENTS.md` อ้างถึง skills ใหม่

1. ทำ `/update-agents-md` เพื่ออัปเดต `AGENTS.md` ของ project
2. เพิ่ม skills ใหม่ใน `### Skills` section ของ `AGENTS.md`
3. ตรวจว่า `AGENTS.md` อ้างถึง skills ที่สร้างขึ้นครบถ้วน
4. ถ้า project ไม่มี `AGENTS.md` → ทำ `/update-agents-md` เพื่อสร้างใหม่

### 5. Validate And Report

> Goal: project skills พร้อมใช้งานและผ่าน validation

1. ทำ `/validate` เพื่อตรวจ `.devin/skills/` structure และ references
2. ทำ `/check-circular-dependencies` ถ้ามีการเพิ่ม `related` fields
3. ทำ `/report` สรุป:
   - skills ที่สร้างใหม่
   - skills ที่อัปเดต
   - validation ผล
   - next actions ที่แนะนำ

## Rules

### 1. Follow Write Devin Skills

- ทุก skill ต้องเขียนตาม `/follow-write-devin-skills`
- ใช้ template ตาม prefix ของ skill
- `SKILL.md` ไม่เกิน 250 บรรทัด
- ไฟล์ย่อยทุกไฟล์ไม่เกิน 250 บรรทัด

### 2. Project Skills Directory

- สร้าง skills ใน `.devin/skills/` ของ project เท่านั้น
- ห้ามแก้ไข global skills ใน `%APPDATA%\devin\skills\`
- ห้ามแก้ไข source code ของ project

### 3. No Commit

- `update-project-skills` ไม่ commit การเปลี่ยนแปลง
- ถ้าใช้ standalone → ทำ `/git-commit` หลัง `/update-project-skills`
- ถ้าใช้ใน `/update-project` → commit ตาม workflow ของ `/update-project`

### 4. Global Skills First

- ตรวจสอบ global skills ก่อนสร้าง project skill
- ไม่สร้าง skills ที่ซ้ำซ้อนกับ global skills
- ถ้ามี global skill ที่ตรง → อ้างอิงแทนการสร้างใหม่
- ข้าม dependencies ที่ไม่มี skill pattern ทีตรง

## Expected Outcome

- `.devin/skills/` directory สร้างขึ้นถ้ายังไม่มี
- skills ที่จำเป็นถูกสร้างหรืออัปเดตตามมาตรฐาน `/follow-write-devin-skills`
- ทุก skill ผ่าน `/validate`
- project `AGENTS.md` อ้างถึง skills ใหม่ครบถ้วน
- รายงานสรุป skills ที่สร้าง/อัปเดตและ next actions
