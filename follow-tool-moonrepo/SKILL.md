---
name: follow-tool-moonrepo
description: ใช้ moonrepo จัดการ monorepo build, tasks, และ project boundaries สำหรับหลาย stacks
related:
  - follow-monorepo
  - follow-tool-mise
  - run-build
  - run-lint
  - run-test
  - run-verify-on-local
---

## Goal

ตั้งค่าและใช้งาน moonrepo สำหรับ monorepo ด้วย `.moon/` configuration, task graph, และ project boundaries

## Scope

ใช้สำหรับ project ที่เลือกใช้ moonrepo เป็น monorepo orchestrator แทน turborepo รองรับ Bun, Node, Rust

## Execute

### 1. Install moon

> Goal: ติดตั้ง moon CLI บน environment

1. ติดตั้งด้วย package manager ที่เหมาะสม:
   - Bun: `bun add -D @moonrepo/cli`
   - npm/pnpm/yarn: `npm install -D @moonrepo/cli` (หรือ `pnpm add -D`, `yarn add --dev`)
   - PowerShell: `irm https://moonrepo.dev/install/moon.ps1 | iex`
   - macOS/Linux/WSL: `bash <(curl -fsSL https://moonrepo.dev/install/moon.sh)`
   - proto: `proto install moon`
   - mise: `mise use -g moon` (ถ้ามี `mise` ใน `.tool-versions` หรือ `mise.toml`)
2. ตรวจสอบ version ด้วย `moon --version`
3. ถ้าจะให้ project อื่นใช้ moon ใน repo นี้ → ใช้ package manager ของ workspace (`bun add -D @moonrepo/cli` หรือ `npm install -D @moonrepo/cli`)
4. ดูรายละเอียดเพิ่มเติมใน [references/moonrepo.md](references/moonrepo.md)

### 2. Identify Workspace

> Goal: ระบุว่า project ใช้ moonrepo

1. ตรวจสอบ `.moon/workspace.yml` หรือ `moon.yml`
2. อ่าน root manifest: `package.json` scripts สำหรับ JS/Bun, `Cargo.toml` workspace สำหรับ Rust
3. ระบุ projects ใน monorepo จาก `.moon/workspace.yml` globs
4. บันทึก project list (package = JS/Bun, crate = Rust)

### 3. Configure Workspace

> Goal: ตั้งค่า moonrepo workspace

1. สร้าง/อัปเดต `.moon/workspace.yml` ด้วย project globs
   - JS/Bun: `packages/*` หรือ `apps/*`
   - Rust: `crates/*`
2. สร้าง/อัปเดต `.moon/toolchains.yml` ตาม stack (Bun, Node, Rust)
3. สร้าง `.moon/tasks/all.yml` สำหรับ shared task config
4. ตรวจสอบ `moon.yml` ในแต่ละ project

### 4. Define Tasks

> Goal: กำหนด tasks ใน moonrepo

1. ใช้ชื่อ task เดียวกันระหว่าง workspaces
2. JS/Bun: ใช้ `package.json` scripts (`build`, `dev`, `test`, `lint`, `typecheck`, `scan`)
3. Rust: ใช้ `cargo build`, `cargo test`, `cargo clippy`
4. กำหนด `deps` (`^build`) ให้ถูกต้อง
5. กำหนด `outputs` สำหรับ build tasks
6. กำหนด `inputs` และ `options` ตามจำเป็น

### 5. Migrate From Turborepo

> Goal: ย้ายจาก turborepo ไป moonrepo

1. ลบ `turbo.json`
2. ลบ `turbo` ออกจาก `package.json` devDependencies
3. แก้ไข scripts ใน `package.json` จาก `turbo run` ไป `moon run`
4. อัปเดต README, AGENTS, docs ให้ระบุ moonrepo
5. อัปเดต `.devin/rules` และ skills ที่อ้างอิงถึง turborepo

### 6. Verify

> Goal: ตรวจสอบว่า moonrepo ทำงานได้

1. รัน `moon check` หรือ `moon run :check`
2. รัน `moon run :build` เพื่อตรวจ project graph
3. ตรวจสอบว่าไม่มี `turbo.json` หรือ `turbo` dependencies
4. ทำ `/deep-validate` เพื่อ verify setup

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
- JS/Bun project = package, Rust project = crate (Cargo package)

## Expected Outcome

- `.moon/` config ถูกต้องและสมบูรณ์
- ไม่มี `turbo.json` หรือ `turbo` dependency
- root scripts ใช้ `moon run`
- project graph สามารถ build ได้
- รองรับ JS/Bun packages และ Rust crates
