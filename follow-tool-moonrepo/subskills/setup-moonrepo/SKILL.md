---
name: follow-tool-moonrepo-setup-moonrepo
description: ติดตั้ง moon และ init `.moon/` workspace สำหรับ monorepo ครั้งแรก
argument-hint: "[scope]"
related:
  - follow-monorepo
  - follow-tool-mise
  - run-install
  - run-verify
---

## Goal

ติดตั้ง moon CLI และ initialize `.moon/` workspace configuration ให้ monorepo พร้อมใช้ moonrepo — first-time setup

## Scope

ใช้สำหรับ project ที่เลือก moonrepo เป็น orchestrator (รองรับ Bun, Node, Rust) — ไม่ครอบคลุม task tuning (ดู `subskills/config-pipeline/SKILL.md`)

- ถ้า `.moon/` มีอยู่แล้ว → verify เท่านั้น ไม่ต้อง setup ซ้ำ

## Execute

### 1. Check Prerequisites

> Goal: ตรวจสอบ state ปัจจุบันก่อน setup

1. ตรวจว่ามี `.moon/workspace.yml` หรือ `moon.yml` อยู่แล้วหรือไม่ — ถ้ามี → skip ไป verify
2. ระบุ stack ของ project: `package.json` (JS/Bun), `Cargo.toml` workspace (Rust), หรือ mixed
3. ระบุ package manager จาก lockfile (`bun.lockb`, `pnpm-lock.yaml`, ฯลฯ)

### 2. Install moon

> Goal: ติดตั้ง moon CLI ตาม environment

1. ติดตั้งด้วย package manager ที่เหมาะสม:
   - Bun project: `bun add -D @moonrepo/cli`
   - npm/pnpm/yarn project: ใช้ package manager ของ project
   - PowerShell: `irm https://moonrepo.dev/install/moon.ps1 | iex`
   - macOS/Linux/WSL: `bash <(curl -fsSL https://moonrepo.dev/install/moon.sh)`
   - proto: `proto install moon`
   - mise: `mise use -g moon` (ตาม `global_rules` — prefer mise สำหรับ global tools)
2. ตรวจสอบ version ด้วย `moon --version`

### 3. Initialize Workspace

> Goal: สร้าง `.moon/` configuration

1. รัน `moon init` ใน repo root สำหรับ scaffold หรือสร้าง `.moon/workspace.yml` ด้วยมือ
2. กำหนด project globs ใน `.moon/workspace.yml`:
   - JS/Bun: `packages/*`, `apps/*`
   - Rust: `crates/*`
3. สร้าง `.moon/toolchains.yml` ตาม stack ที่ตรวจพบ (Bun, Node, Rust)
4. สร้าง `.moon/tasks/all.yml` สำหรับ shared task config
5. ตรวจว่าแต่ละ project ถูก detect — ใช้ `moon query projects` หรือตรวจ `moon.yml` ต่อ project

### 4. Migrate From Turborepo (If Needed)

> Goal: ย้ายจาก turborepo ถ้า project เดิมใช้ turbo

1. ลบ `turbo.json` และ `turbo` ออกจาก devDependencies
2. แก้ root scripts จาก `turbo run` → `moon run`
3. อัปเดต README, AGENTS, `.devin/rules` ที่อ้างอิง turborepo — ทำ `/update-references`

### 5. Verify

> Goal: ยืนยันว่า workspace ทำงานได้

1. รัน `moon run :build` หรือ `moon check` — project graph ต้อง build ได้
2. ถ้า verify ไม่ผ่าน → ทำ `/resolve-errors` max 3 รอบ แล้ว stop report

## Rules

### 1. Idempotent

- ถ้า `.moon/` มีอยู่แล้ว → verify เท่านั้น
- ไม่เพิ่ม `turbo` dependencies กลับเข้ามาใน repo ที่ใช้ moon

### 2. Toolchain

- ตั้ง `.moon/toolchains.yml` ตาม stack ที่ตรวจพบจริง ไม่เปิด toolchain ที่ไม่ใช้
- prefer `mise use -g moon` สำหรับ global install ตาม `global_rules`

### 3. Layout

- project globs ต้องครอบคลุมทุก workspace แต่ไม่กว้างเกิน (JS/Bun = package, Rust = crate)

- ใช้ /follow-monorepo ถ้าจำเป็น
- ใช้ /follow-tool-mise ถ้าจำเป็น

## Expected Outcome

- moon CLI ติดตั้งและ `moon --version` ทำงาน
- `.moon/` config ถูกสร้างพร้อม project globs ที่ถูกต้อง
- `moon run :build` รันผ่าน — project graph สร้างได้
