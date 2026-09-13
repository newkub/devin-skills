---
name: follow-tool-turborepo-setup-turborepo
description: ติดตั้ง Turborepo และจัดโครงสร้าง workspace สำหรับ monorepo ครั้งแรก
argument-hint: "[scope]"
related:
  - follow-monorepo
  - run-install
  - run-verify
---

## Goal

ติดตั้ง `turbo` CLI และจัดโครงสร้าง monorepo workspace ให้พร้อมใช้งานกับ Turborepo — first-time setup ไม่ใช่ ongoing maintenance

## Scope

ใช้สำหรับ project ที่ต้องการเริ่มใช้ Turborepo ใหม่ — install, root `package.json`, directory layout, smoke check

- ถ้า `turbo.json` มีอยู่แล้ว → verify เท่านั้น ไม่ต้อง setup ซ้ำ
- รายละเอียด pipeline/tasks ดู `subskills/config-pipeline/SKILL.md`

## Execute

### 1. Check Prerequisites

> Goal: ตรวจสอบ state ปัจจุบันก่อน setup

1. ตรวจ `package.json` ที่ root — ต้องมี `private: true`, `packageManager`, และ `workspaces`
2. ตรวจว่ามี `turbo.json` หรือ `turbo` dependency อยู่แล้วหรือไม่ — ถ้ามี → skip ไป verify
3. ระบุ package manager ที่ project ใช้ (`bun`, `pnpm`, `npm`, `yarn`) จาก lockfile

### 2. Install Turbo

> Goal: ติดตั้ง turbo CLI

1. ติดตั้งด้วย `bun add -D turbo` (หรือ package manager ของ project)
2. ตรวจสอบ version ด้วย `bunx turbo --version`
3. เพิ่ม root scripts เช่น `"build": "turbo run build"`, `"dev": "turbo run dev"`

### 3. Arrange Workspace Layout

> Goal: จัด directory structure ตาม Turborepo conventions

1. จัด directory ด้วย `apps/*` สำหรับ applications และ `packages/*` สำหรับ shared libraries
2. หลีกเลี่ยง nested packages ที่ทำให้ workspace globs ซับซ้อน
3. ตรวจสอบแต่ละ package มี `package.json` พร้อม `name` ที่ unique และ `exports` ถ้าเป็น library
4. ตั้งค่า `workspaces` ใน root `package.json` ให้ครอบคลุม `apps/*` และ `packages/*`

### 4. Create Minimal turbo.json

> Goal: สร้าง `turbo.json` ขั้นต่ำที่ใช้งานได้

1. สร้าง `turbo.json` ที่ root พร้อม `$schema`
2. กำหนด `tasks` เบื้องต้นสำหรับ `build`, `dev`, `lint`, `test` — รายละเอียดเต็มทำต่อใน `subskills/config-pipeline/SKILL.md`

### 5. Verify

> Goal: ยืนยันว่า setup ทำงานได้

1. รัน `bunx turbo run build` หรือ task พื้นฐาน — ต้องรันผ่านและสร้าง cache ใน `.turbo/`
2. รัน `bunx turbo run build` ซ้ำ — ต้องเห็น cache hit (`FULL TURBO` หรือ cache replay)
3. ถ้า verify ไม่ผ่าน → ทำ `/resolve-errors` max 3 รอบ แล้ว stop report

## Rules

### 1. Idempotent

- ถ้า setup ไปแล้ว (มี `turbo.json` + turbo dependency) → verify เท่านั้น ห้าม reinstall ซ้ำ
- ไม่เปลี่ยน package manager ของ project เพื่อติดตั้ง turbo

### 2. Layout

- ใช้ `apps/*` + `packages/*` เป็น standard layout
- ทุก package ต้องมี `package.json` พร้อม `name` unique

### 3. Verification

- ต้องเห็น cache ทำงาน (run ซ้ำเร็วขึ้น) ก่อนถือว่า setup สำเร็จ
- รายงานผลด้วย `/report-before-after`

- ใช้ /follow-monorepo ถ้าจำเป็น
- ใช้ /run-install ถ้าจำเป็น
- ใช้ /run-verify ถ้าจำเป็น

## Expected Outcome

- `turbo` ติดตั้งและ `turbo.json` ถูกสร้างที่ root
- Workspace layout `apps/*` + `packages/*` พร้อมใช้งาน
- `turbo run <task>` รันและ cache ได้
