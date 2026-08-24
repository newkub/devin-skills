---
name: update-contributing-md
description: อัปเดต CONTRIBUTING.md ให้สอดคล้องกับ project workflows และ conventions
---

## Goal

สร้างหรืออัปเดต `CONTRIBUTING.md` ให้สะท้อนวิธีพัฒนา, conventions, และ validation workflows ของ project

## Scope

ใช้สำหรับ project ใดๆ ที่ต้องการ CONTRIBUTING guide

## Execute

### 1. Gather Project Context

> Goal: รวบรวมข้อมูล project
> Goal: รู้ project setup, stack, และ conventions

1. อ่าน `package.json`, `README.md`, `AGENTS.md`
2. อ่าน `.devin/rules` หรือ project rules
3. อ่าน `docs/` ที่เกี่ยวกับ development
4. ระบุ tech stack, package manager, และ scripts

### 2. Identify Contributing Sections

> Goal: ระบุ sections
> Goal: CONTRIBUTING ครอบคลุมทุกสิ่งที contributor ต้องรู้ ทีต้องมี

1. Prerequisites (tools, versions)
2. Setup / installation
3. Development workflow (dev, build, test, lint, typecheck)
4. Git conventions (branch, commit message)
5. Code style and rules
6. Validation before PR
7. How to add workspaces/packages
8. Where to get help

### 3. Write Or Update

> Goal: เขียนหรืออัปเดต `CONTRIBUTING.md`
> Goal: `CONTRIBUTING.md` ครบถ้วนและถูกต้อง

1. ใช้ข้อมูลจริงจาก project ไม่ใส่ placeholder
2. ใช้ bullet points และตัวอย่าง commands
3. อ้างอิงไปยัง `AGENTS.md` และ `README.md`
4. ระบุ scripts จริง เช่น `bun run check`, `moon run :build`

### 4. Coordinate With Other Files

> Goal: ประสานงานกับเอกสารอื่น
> Goal: เอกสารทีเกี่ยวข้องสอดคล้องกัน

1. ตรวจสอบว่า conventions สอดคล้องกับ `AGENTS.md`
2. ตรวจสอบว่า scripts ตรงกับ `package.json`
3. อัปเดต links ใน `README.md` ไปยัง `CONTRIBUTING.md`

### 5. Validate

> Goal: ตรวจสอบคุณภาพ
> Goal: `CONTRIBUTING.md` ผ่าน validation

1. ทำ `/validate` เพื่อตรวจ Markdown quality
2. ทำ `git diff --check` เพื่อหา whitespace errors
3. ทำ `/check-reference` เพื่อตรวจ links

## Rules

### 1. No Placeholders

- ใช้ real commands, paths, และ versions
- ไม่ใส่ TODO หรือ MOCK โดยไม่ระบุเหตุผล

### 2. Conciseness

- ไม่เกิน 250 บรรทัด
- เน้น bullet points สั้นๆ

### 3. Cross-References

- อ้างอิง `README.md`, `AGENTS.md`, `docs/`
- ใช้ relative links

## Expected Outcome

- `CONTRIBUTING.md` ครบถ้วนและสอดคล้องกับ project
- ผ่าน `/validate` และ `/check-reference`
- ไม่มี whitespace errors
