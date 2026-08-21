---
name: follow-moonrepo
description: ใช้ moonrepo จัดการ monorepo build, tasks, และ project graph
allowed-tools:
  - read
  - edit
  - write
  - grep
  - glob
  - exec
triggers:
  - user
  - model
related:
  - follow-tasks
  - follow-package-manifest
  - follow-config
  - validate
---

## Goal

ตั้งค่าและใช้งาน moonrepo สำหรับ monorepo ด้วย `.moon/` configuration, task graph, และ project boundaries

## Scope

ใช้สำหรับ project ที่เลือกใช้ moonrepo เป็น monorepo orchestrator แทน turborepo

## Execute

### 1. Identify Workspace

> Goal: ระบุว่า project ใช้ moonrepo
> Goal: รู้ scope ของ moonrepo workspace

1. ตรวจสอบ `.moon/workspace.yml` หรือ `moon.yml`
2. อ่าน root `package.json` scripts
3. ระบุ projects ใน monorepo จาก `.moon/workspace.yml` globs
4. บันทึก project list

### 2. Configure Workspace

> Goal: ตั้งค่า moonrepo workspace
> Goal: `.moon/` config ครบถ้วน

1. สร้าง/อัปเดต `.moon/workspace.yml` ด้วย project globs
2. สร้าง/อัปเดต `.moon/toolchains.yml` ตาม stack (Bun, Rust, Node)
3. สร้าง `.moon/tasks/all.yml` สำหรับ shared task config
4. ตรวจสอบ `moon.yml` ในแต่ละ workspace

### 3. Define Tasks

> Goal: กำหนด tasks ใน moonrepo
> Goal: tasks ทำงานสอดคล้องกันระหว่าง projects

1. ใช้ชื่อ task เดียวกันกับ package scripts (build, dev, test, lint, typecheck, scan)
2. กำหนด `deps` (`^build`) ให้ถูกต้อง
3. กำหนด `outputs` สำหรับ build tasks
4. กำหนด `inputs` และ `options` ตามจำเป็น

### 4. Migrate From Turborepo

> Goal: ย้ายจาก turborepo ไป moonrepo
> Goal: ไม่มี turborepo dependency เหลือ

1. ลบ `turbo.json`
2. ลบ `turbo` ออกจาก `package.json` devDependencies
3. แก้ไข scripts ใน `package.json` จาก `turbo run` ไป `moon run`
4. อัปเดต README, AGENTS, docs ให้ระบุ moonrepo
5. อัปเดต `.devin/rules` และ skills ที่อ้างอิงถึง turborepo

### 5. Verify

> Goal: ตรวจสอบว่า moonrepo ทำงานได้
> Goal: workspace พร้อมใช้งานและผ่าน validation

1. รัน `moon check` หรือ `moon run :check`
2. รัน `moon run :build` เพื่อตรวจ project graph
3. ตรวจสอบว่าไม่มี `turbo.json` หรือ `turbo` dependencies
4. ทำ `/validate` เพื่อ verify setup

## Rules

### 1. Prefer moonrepo For This Codebase

- ใช้ `moon` สำหรับ task orchestration
- ไม่เพิ่ม `turbo` dependencies กลับเข้ามา
- ใช้ `moon run :<task>` ใน root scripts

### 2. Task Naming

- ใช้ชื่อ task เดียวกันระหว่าง workspaces
- ใช้ kebab-case สำหรับ task labels
- หลีกเลี่ยง task ทีไม่มี `deps` ทีชัดเจน

### 3. Project Boundaries

- กำหนด project globs ใน `.moon/workspace.yml`
- ใช้ moonrepo implicit project detection
- ไม่ซ้อน project boundaries ซ้ำซ้อน

## Expected Outcome

- `.moon/` config ถูกต้องและสมบูรณ์
- ไม่มี `turbo.json` หรือ `turbo` dependency
- root scripts ใช้ `moon run`
- project graph สามารถ build ได้
