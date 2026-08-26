---
name: convert-to-project
description: แปลง idea, requirements หรือ sketch เป็น project plan และ structure
---

## Goal

แปลง idea, requirements, หรือ sketch ที user ให้มาเป็น project plan, structure, และ actionable tasks

## Scope

ใช้เมื่อต้องการสร้างโครงสร้าง project, กำหนด scope, เลือก tech stack, และแบ่งงานจาก input ทีไม่ละเอียด

## Execute

### 1. Analyze Input

> Goal: ทำความเข้าใจ idea หรือ requirements

1. อ่าน input ทั้งหมด
2. ระบุ problem, target user, goals
3. ระบุ constraints: time, budget, tech, team
4. ถ้า input ไม่ชัด → ใช้ `/ask-project-requirement`

### 2. Define Project Structure

> Goal: กำหนดโครงสร้าง project

1. ระบุ root directories: `src/`, `tests/`, `docs/`, `scripts/`, `.github/`
2. เลือก tech stack ตาม context (จาก `package.json`, ecosystem)
3. ระบุ entry points และ public API
4. สร้าง `README.md` outline

### 3. Create Plan

> Goal: แบ่งงานเป็น tasks

1. ใช้ `/create-plan-md-in-dot-devin` หรือ `/update-todo-md`
2. แบ่ง phase: foundation, features, quality, release
3. ระบุ dependencies ระหว่าง tasks
4. ระบุ deliverable ของแต่ละ task

### 4. Generate Artifacts

> Goal: สร้างไฟล์เริ่มต้น

1. สร้าง `plan.md` หรือ `TODO.md`
2. สร้าง `README.md` ด้วย overview, setup, usage
3. ถ้าต้องการ scaffold code → ใช้ `write` สร้างไฟล์เริ่มต้น
4. ใช้ `/report-table` สรุป structure

## Rules

### 1. Feasibility

- ไม่เสนอ stack หรือ architecture ทีเกิน scope
- ระบุสมมติฐานทีต้อง verify
- ไม่สร้างไฟล์จริงโดยไม่ได้ user confirm

### 2. Minimal Viable

- เริ่มจาก MVP แล้วค่อยขยาย
- ระบุ must-have vs nice-to-have
- แบ่ง phase ชัดเจน

### 3. Reusability

- ใช้ conventions ของ project/team
- อ้างอิง `follow-create-devin-global-skills` ถ้าเป็น devin skills project
- ใช้ `AGENTS.md` หรือ `global_rules.md` ถ้ามี

## Expected Outcome

- project plan พร้อม structure
- task list แบ่ง phase
- README.md outline หรือ draft
- ไฟล์เริ่มต้นถ้าได้รับ approval
