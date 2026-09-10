---
name: update-devin-global-skills
description: "จัดการ global Devin skills: สร้าง อัปเดต refactor และตรวจสอบมาตรฐาน"
argument-hint: "[@files-or-topic...]"
related:
  - new-skills
  - deep-research
  - deep-validate
  - report
  - ship
---

## Goal

สร้าง อัปเดต หรือ refactor global Devin skills ใน `%APPDATA%\devin\skills` ให้ทันสมัย ถูกต้อง และสอดคล้องมาตรฐาน repo

## Scope

ใช้สำหรับ skill ใหม่หรือ skill ที่มีอยู่ รองรับ:

- อัปเดต skill เดียว หลาย skill หรือทั้ง repo
- สร้าง skill ใหม่โดยระบุ idea หรือ topic
- refactor skill ให้ SRP ชัดเจน แยกไฟล์ย่อยเมื่อจำเป็น
- จัด sub-workflows เป็น `subskills/` และ subagent profiles เป็น `subagents/` ตาม [references/subskills-and-subagents.md](references/subskills-and-subagents.md)

ถ้าต้องสร้าง skill เดียวแบบ focused ให้ใช้ `/new-skills` แทน

## Execute

### 1. Prepare Context

> Goal: รู้ environment, conventions, และ scope ก่อนลงมือ

ทำตาม [references/prepare-context.md](references/prepare-context.md) (devin global skills)

### 2. Identify Targets

> Goal: รู้ว่าต้องสร้าง อัปเดต หรือ refactor skill ใด

ทำตาม [references/identify-targets.md](references/identify-targets.md)

### 3. Check Duplicates And Refactor Scope

> Goal: ไม่ซ้ำ และรู้ว่าต้องแยกไฟล์ย่อยเมื่อไหร่

ทำตาม [references/check-duplicates-and-refactor-scope.md](references/check-duplicates-and-refactor-scope.md)

### 4. Select Template And Structure

> Goal: skill มีโครงสร้างเริ่มต้นทีถูกต้อง

ทำตาม [references/select-template-and-structure.md](references/select-template-and-structure.md)

### 5. Deep Research

> Goal: มีข้อมูลล่าสุดก่อนแก้ไข

ทำตาม [references/deep-research.md](references/deep-research.md)

### 6. Write Or Update SKILL.md

> Goal: `SKILL.md` ถูกต้องตาม spec

ทำตาม [references/write-update-skill.md](references/write-update-skill.md)

### 7. Add References, Subskills, Examples, And Src

> Goal: skill package ครบถ้วนและไม่ซ้ำซ้อน

ทำตาม [references/add-references-and-src.md](references/add-references-and-src.md)

### 8. Validate And Update References

> Goal: skill ผ่านเกณฑ์ทั้งหมด

ทำตาม [references/validate-and-update-refs.md](references/validate-and-update-refs.md)

### 9. Ship

> Goal: ส่งมอบงาน

ทำตาม [references/ship.md](references/ship.md)

## Rules

### 1. Single Responsibility And Refactor

- ทุกไฟล์ใน skill package ไม่เกิน 250 บรรทัด
- `SKILL.md` เป็น entry point หลัก เก็บเฉพาะ high-level workflow และ pointer
- ถ้า skill มี dependencies, CLI, web, templates, หรือ examples จำเป็น → แยกไป `references/`, `templates/`, `examples/`, หรือ `src/` ตาม [references/refactor-guidelines.md](references/refactor-guidelines.md)
- ถ้า skill มีหลาย responsibility → refactor เป็น `references/`, `subskills/` หรือ `subagents/` ตาม decision matrix ใน [references/subskills-and-subagents.md](references/subskills-and-subagents.md)
- ถ้าเนื้อหาซ้ำกับ skill อื่น → merge เข้าตัวเดิมแทนการสร้างใหม่

### 2. Official Sources First

- ใช้ official docs, changelog, repository เป็นแหล่งหลัก
- ไม่ใช้ third-party ถ้า official มี และระบุ source URLs

### 3. Evidence-Based Updates

- ทุกการแก้ skill ต้องมี evidence และบันทึก version ที่ research
- ไม่เดา API, command หรือ version

### 4. Safety

- ทำ dry run ก่อน destructive หรือ high-risk actions
- ถ้ามี overwrite ไฟล์เดิม → user confirmation ก่อน
- ไม่ทำลาย references หรือ existing skills

### 5. Content Standard

- `name` ตรง directory name, `description` ≤100 ตัวอักษร
- ไม่มี TODO/MOCK/placeholder — ถ้าข้อมูลไม่ชัดให้ระบุความไม่แน่นอน
- global skills เขียนภาษาไทยคงคำศัพท์เทคนิคอังกฤษ
- install commands ตาม ecosystem: `bun add`/`bun install` (Bun/Node), `cargo add` (Rust), `go get` (Go), `pip install` (Python), `mise use -g npm:<package>` สำหรับ global npm CLI

## Expected Outcome

- Skill ใหม่/อัปเดตสะท้อน latest version, APIs, commands และ best practices
- `SKILL.md` ผ่าน `/deep-validate`, ไม่เกิน 250 บรรทัด, ไม่มี TODO/MOCK/placeholder
- `related` ครบถ้วน ไม่มี missing/unused
- Deprecated commands/options ถูกลบออก
- References อัปเดตครบทั้ง `AGENTS.md`, `global_rules.md` และ skills อื่นที่เกี่ยวข้อง
- `/report` สรุป findings และการเปลี่ยนแปลง
