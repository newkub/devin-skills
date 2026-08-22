---
name: file-structure
description: โครงสร้างไฟล์และ directory สำหรับ skill package
---

## Goal

กำหนด file structure ทีอนุญาตให้ skill packages ใช้ ให้ `skill-type-*.md` และ references อยู่ภายใต้ structure เดียวกัน

## Scope

ใช้กับ skills ทีสร้างตาม `/follow-write-devin-skills` ไม่ว่าจะเป็น template หรือ reference files

## Required Files

- `SKILL.md` ไฟล์หลัก ไม่เกิน 250 บรรทัด

## Optional Files And Directories

- `references/` สำหรับ templates และ reference docs
  - `skill-type-*.md` ใช้เป็น canonical pattern ตาม prefix
  - `skill-me.md` เนื้อหาหลักของ skill เมื่อต้องการแยกออกจาก `SKILL.md`
  - `file-structure.md` เอกสารโครงสร้างไฟล์ (this file)
- `scripts/` สำหรับ helper scripts
- `workflows/` สำหรับ Devin workflows
- `guide/` สำหรับขยายเอกสาร
- `examples/` สำหรับตัวอย่าง
- `web/` สำหรับ web app ถ้า skill ต้องการ
- `.devin/rules/` สำหรับ project rules ที่ skill ship
- `src/presentation/cli.ts` ถ้า skill มี CLI

## Skill Type Files

- `references/skill-type-analyze.md`
- `references/skill-type-architecture.md`
- `references/skill-type-check.md`
- `references/skill-type-deep.md`
- `references/skill-type-follow.md`
- `references/skill-type-idea.md`
- `references/skill-type-report.md`
- `references/skill-type-review.md`
- `references/skill-type-run.md`

## Flattening References

- ถ้า `references/` มี nested directories ให้ใช้ `/follow-flat-files` เพื่อแปลงเป็น flat files
- ถ้าต้อง flat ทั้ง skill package ให้ใช้ `/follow-flat-folders`

## Rules

### 1. Not Exceed Structure

- `skill-type-*.md` อ้างอิง file structure นี้ ไม่เพิ่ม directory นอกเหนือ
- ไฟล์ย่อยทุกไฟล์ไม่เกิน 250 บรรทัด
- ไม่สร้างไฟล์ root ทีไม่จำเป็น เช่น `README.md` ถ้าไม่ได้ใช้

### 2. Names

- directory name ต้องตรงกับ `name` ใน `SKILL.md`
- flat reference files ใช้ `kebab-case` เช่น `skill-type-analyze.md`

## Expected Outcome

- Skill package อยู่ภายใต้ file structure ทีกำหนด
- References เป็น flat files เมื่อใช้ `/follow-flat-files`
- ไม่มีไฟล์หรือ directory นอก structure โดยไม่มีเหตุผล
