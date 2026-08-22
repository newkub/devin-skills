---
name: skill-type-lib
description: Canonical pattern สำหรับ skills ทีเป็น installable library ผ่าน registry
---

## Goal

กำหนดโครงสร้าง skill สำหรับ library/framework ทีติดตั้งผ่าน registry (npm, crates.io, PyPI, ฯลฯ)

## Scope

ใช้กับ skill ทีขึ้นต้นด้วย `lib-*` หรือ `follow-*` ทีเน้นการใช้งาน library โดยตรง

## Required Files

- `SKILL.md` ไฟล์หลัก ไม่เกิน 250 บรรทัด

## Optional Files And Directories

- `references/api/` สำหรับ API references: methods, types, options, examples
  - แยกตาม module หรือ category เช่น `core.md`, `config.md`, `errors.md`
- `references/cli/` สำหรับ CLI commands ของ library
  - เช่น `commands.md`, `flags.md`
- `references/components/` สำหรับ components, hooks, widgets, หรือ usage patterns
  - เช่น `button.md`, `form.md`
- `references/comparison.md` สำหรับ compare กับ alternatives
- `subskills/<lib>/<subskill>/SKILL.md` สำหรับ subskills ย่อยของ library
  - `name` หน้า frontmatter เป็น `<lib>-<subskill>`
- `examples/` สำหรับตัวอย่างโค้ดเต็ม

## Frontmatter

- `name` ต้องตรงกับ directory name
- `description` ≤100 ตัวอักษร
- `allowed-tools` รวม `exec`, `read`, `write`, `edit`, `ask_user_question`, `webfetch`, `learn-from-web`
- `related` รวม package-manager skill ทีเหมาะสม เช่น `follow-bun`, `follow-package-manifest`, `validate`

## Execute Structure

### 1. Detect Environment

1. ตรวจสอบ project manifest (`package.json`, `Cargo.toml`, etc.)
2. ระบุ registry และ version ทีใช้
3. ตรวจสอบ ecosystem (bun, node, pnpm, yarn, cargo, pip)

### 2. Install Library

1. ใช้คำสั่ง install ทีเหมาะกับ package manager (เช่น `bun add <lib>`, `npm install <lib>`)
2. บันทึก version ทีติดตั้ง
3. ถ้ามี peer dependencies ให้ติดตั้งด้วย

### 3. Configure And Use

1. เขียน/แก้ไข config ทีจำเป็น
2. ระบุ entry point และ initial setup
3. ใช้ examples จาก `references/components/` หรือ `examples/`

### 4. Validate

1. ทำ `/validate` หรือ `/run-check`
2. รัน tests/examples ถ้ามี
3. ทำ `/git-commit` ถ้ามีการเปลี่ยนแปลง

## Rules

### 1. References

- ทุก lib skill ต้องมี `references/api/`, `references/cli/`, `references/components/` ถ้า library มีส่วนนั้น
- ถ้าไม่มี CLI ให้ละ `references/cli/` ได้ แต่ระบุเหตุผลใน `## Scope`
- references แยกไฟล์ตาม topic ไม่รวมทุกอย่างไว้ใน `SKILL.md`

### 2. Subskills

- ถ้า library มีหลาย use cases ให้สร้าง `subskills/<lib>/<subskill>/SKILL.md`
- parent skill `lib-<name>` หรือ `follow-<name>` ต้อง `related` ทุก subskill
- ใช้ syntax `<name>-subskills[<subskill>, ...]` ถ้า parent skill รองรับ

### 3. Concrete Commands

- ระบุคำสั่ง install จริง (`bun add`, `npm install`, `cargo add`, `pip install`)
- ระบุ config files และ snippets จริง
- ใช้ backticks สำหรับ code และ command เสมอ

## Expected Outcome

- Skill ติดตั้ง library ผ่าน registry ได่จริง
- `SKILL.md` ไม่เกิน 250 บรรทัด
- `references/` ครบถ้วนตาม scope ของ library
- subskills ถูกสร้างถ้ามี use cases ย่อย
