---
name: follow-tool-moonrepo-config-pipeline
description: ตั้งค่า moon tasks, deps, inputs/outputs และ shared task config ใน `.moon/`
argument-hint: "[scope]"
related:
  - follow-monorepo
  - run-build
  - run-test
---

## Goal

ตั้งค่า task pipeline ของ moonrepo — `tasks`, `deps`, `inputs`/`outputs`, shared config ใน `.moon/tasks/` และ per-project `moon.yml` โดยไม่ clobber config เดิม

## Scope

ใช้เมื่อต้อง define/แก้ tasks ใน moonrepo — ไม่ครอบคลุม install/workspace init (ดู `subskills/setup-moonrepo/SKILL.md`) และ cache tuning (ดู `subskills/optimize-cache/SKILL.md`)

## Execute

### 1. Read Current Config

> Goal: อ่าน config เดิมก่อนแก้

1. อ่าน `.moon/workspace.yml`, `.moon/toolchains.yml`, `.moon/tasks/*.yml` และ `moon.yml` ทุก project
2. ตรวจ `package.json` scripts (JS/Bun) และ `Cargo.toml` (Rust) — task names ต้อง map กับ scripts จริง
3. ถ้าไม่พบ `.moon/` → ทำ `subskills/setup-moonrepo/SKILL.md` ก่อน

### 2. Define Shared Tasks

> Goal: กำหนด shared tasks ใน `.moon/tasks/all.yml`

1. ใช้ชื่อ task เดียวกันระหว่าง workspaces: `build`, `dev`, `test`, `lint`, `typecheck`, `check`
2. JS/Bun: map tasks ไปยัง `package.json` scripts
3. Rust: map tasks ไปยัง `cargo build`, `cargo test`, `cargo clippy`
4. กำหนด `deps` ให้ถูกต้อง — `^build` สำหรับ upstream dependencies
5. กำหนด `inputs` และ `outputs` สำหรับ build tasks เพื่อให้ cache hash ถูกต้อง

### 3. Per-Project Tasks

> Goal: override/extend ด้วย `moon.yml` ต่อ project

1. สร้าง `moon.yml` ใน project ที่ต้องการ tasks เฉพาะตัว
2. define tasks เพิ่มหรือ override shared config เฉพาะ keys ที่ต่างจริง — ห้าม duplicate shared config โดยไม่จำเป็น
3. ระบุ `outputs` ของ build tasks ตาม tool ที่ใช้ (`dist/**`, `target/**` ฯลฯ)

### 4. Options And Boundaries

> Goal: ตั้งค่า task options และ project boundaries

1. กำหนด `options` ตามจำเป็น — เช่น caching behavior, run mode สำหรับ long-running tasks (ดู official docs สำหรับ option names ที่ไม่แน่ใจ)
2. ใช้ kebab-case สำหรับ task labels
3. ตรวจ project globs ใน `.moon/workspace.yml` ครอบคลุมทุก project — JS/Bun = package, Rust = crate

### 5. Verify

> Goal: ตรวจว่า task graph ถูกต้อง

1. รัน `moon run :build` — ตรวจ dependency order ถูกต้อง
2. รัน `moon check` หรือ `moon run :check` ตรวจ config
3. รันซ้ำเพื่อยืนยัน cache hit — ถ้าพัง → revert keys ที่แก้แล้ว report diff

## Rules

### 1. Config Discipline

- merge กับ config เดิม — ห้าม overwrite ทั้งไฟล์ถ้าไม่จำเป็น
- shared behavior อยู่ใน `.moon/tasks/all.yml`; per-project overrides อยู่ใน `moon.yml` เท่านั้น

### 2. Task Naming

- ใช้ชื่อ task เดียวกันระหว่าง workspaces
- ใช้ kebab-case สำหรับ task labels
- หลีกเลี่ยง task ที่ไม่มี `deps` ที่ชัดเจน

### 3. Task Graph

- ใช้ `^task` สำหรับ upstream dependencies
- ไม่สร้าง circular `deps`
- ไม่ซ้อน project boundaries ซ้ำซ้อน

- ใช้ /follow-monorepo ถ้าจำเป็น

## Expected Outcome

- `.moon/tasks/` และ `moon.yml` มี task graph ถูกต้อง
- `moon run :<task>` รัน tasks ตาม dependency order
- Cache ทำงานจาก `inputs`/`outputs` ที่กำหนด
