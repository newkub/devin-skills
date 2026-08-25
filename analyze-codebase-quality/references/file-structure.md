---
name: file-structure
description: โครงสร้างไฟล์ของ analyze-codebase-quality package
---

## Goal

แสดงโครงสร้างไฟล์และ directory ของ `analyze-codebase-quality` ให้ skill จัดการได้ถูกต้อง

## Required Files

- `SKILL.md` ไฟล์หลัก เรียก `references/skill-me`
- `references/index.md` ดัชนีรายการ references
- `references/skill-me.md` เนื้อหาหลักของ skill
- `references/file-structure.md` เอกสารโครงสร้าง (this file)
- `src/SKILL.md` สำหรับ build และ run CLI

## Optional Directories

- `src/` CLI/web application source (submodule)
- `src/.devin/` project rules ถ้ามี

## Flattening

- ถ้าต้องแปลง nested references เป็น flat files → ใช้ `/follow-flat-files`
- ถ้าต้องแปลง nested directories ภายใน scope เดียว → ใช้ `/follow-flat-folders`

## Rules

### 1. Naming

- ชื่อ directory ต้องตรงกับ `name` ใน `SKILL.md`
- ไฟล์ references ใช้ `kebab-case`

### 2. Size

- `SKILL.md` และ `references/*.md` ไม่เกิน 250 บรรทัด
- CLI source files อยู่ใน `src/` ตาม project structure (submodule)

## Expected Outcome

- โครงสร้าง skill package ชัดเจน
- `SKILL.md` ไม่เกิน 250 บรรทัด
- `references/` ครบถ้วนและสามารถ flatten ได้
