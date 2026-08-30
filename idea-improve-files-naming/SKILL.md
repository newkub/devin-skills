---
name: idea-improve-files-naming
description: สร้างชื่อไฟล์และ directory สำหรับ idea ใหม่ตาม convention ของ project
related:
  - ask-me
  - report-table
---

## Goal

สร้างชื่อไฟล์, directory และโครงสร้างเริ่มต้นสำหรับ idea หรือ feature ใหม่ โดยสอดคล้องกับ convention ของ project

## Scope

ใช้เมื่อเริ่มต้น feature, module, library หรือ project ใหม่ และต้องการตั้งชื่อไฟล์และโครงสร้าง directory ให้ถูกต้องตามมาตรฐาน

## Execute

### 1. Understand Idea

> Goal: รู้ว่า idea/feature ทำอะไรและอยู่ใน context ใด

1. รับชื่อหรือคำอธิบายของ idea จาก user
2. ระบุ scope: project ใหม่, module, component, page, API, test หรือ document
3. ตรวจสอบ tech stack และ conventions ของ project จาก `AGENTS.md`, `package.json` หรือ existing files
4. ถ้าไม่ชัด → ทำ `/ask-me` ก่อนดำเนินการ

### 2. Select Naming Convention

> Goal: เลือก convention ที่เหมาะสม

1. directory ใช้ `kebab-case` เสมอ
2. ไฟล์ source ภาษา TypeScript/JavaScript/Python/Go ใช้ `kebab-case` ถ้าเป็น convention หลัก
3. React/Vue/Solid components ใช้ `PascalCase` ถ้า framework ต้องการ
4. ไฟล์ test ใช้ `*.test.ts`, `*.spec.ts` หรือตาม convention ของ project
5. ไฟล์เอกสารใช้ `kebab-case.md`

### 3. Generate File And Directory Names

> Goal: สร้างรายการชื่อที่สอดคล้องกับ idea

1. สร้าง root directory ตามชื่อ idea ใน `kebab-case`
2. สร้างไฟล์หลัก: `index.ts`, `index.tsx`, `index.vue` หรือ `__init__.py` ตามภาษา
3. สร้างไฟล์ test: `*.test.ts` ข้างคู่หรือใน `__tests__/`
4. สร้างไฟล์เอกสาร: `README.md` หรือ `notes.md` ถ้าจำเป็น
5. ถ้าเป็น library ให้เพิ่ม `package.json` หรือ `Cargo.toml` ตาม ecosystem

### 4. Check Conflicts

> Goal: ไม่ซ้ำกับไฟล์ที่มีอยู่

1. ค้นหาชื่อที่เสนอใน project ด้วย `find_file_by_name`
2. ถ้าซ้ำ → แนะนำชื่อท่ีเลือกหรือย้ายไปยัง subdirectory
3. ถ้า conflict หลายอัน → report กลับ user

### 5. Report Suggestions

> Goal: สรุปผลให้ user เลือก

1. ใช้ `/report-table` แสดง: Type, Suggested Name, Convention, Notes
2. แยกเป็น groups: directories, source files, tests, docs
3. ถ้ามีหลายทางเลือกให้เรียงตาม preference

## Rules

### 1. Naming Conventions

- directory ทั้งหมด `kebab-case`
- ไฟล์ source ส่วนใหญ่ `kebab-case` ยกเว้น component framework
- component files ใช้ `PascalCase` ถ้า convention ของ framework
- test files ติดท้ายด้วย `.test` หรือ `.spec` ตาม project
- เอกสาร `kebab-case.md`

### 2. Consistency

- สืบทอด convention จาก project ที่มีอยู่
- ไม่ใช้ชื่อท่ีกำกวมหรือสั้นเกินไป
- หลีกเลี่ยง generic ชื่อ เช่น `utils`, `helpers` โดยไม่มี prefix

### 3. Minimal Scope

- สร้างเฉพาะไฟล์ที่จำเป็น
- ไม่เสนอไฟล์เกินความจำเป็นเพื่อลด noise
- ถ้า idea ยังไม่ชัดให้ propose โครงสร้างรองรับสองสามทางเลือก

### 4. Safety

- ไม่สร้างหรือแก้ไขไฟล์โดยไม่ได้ user confirmation
- ถ้ามี overwrite ที่อาจเกิดขึ้น → dry run และ report

## Expected Outcome

- รายการชื่อ directory และไฟล์ที่สอดคล้องกับ idea
- Convention ทีใช้ชัดเจน
- ไม่มีชื่อซ้ำกับ existing files
- User สามารถเลือกหรือปรับได้ทันที
