---
name: follow-monorepo-config-workspaces
description: ตั้งค่า workspaces สำหรับ bun/npm/pnpm และ orchestrator config สำหรับ moon/turbo
argument-hint: "[tool]"
related:
  - follow-monorepo
  - follow-tool-moonrepo
  - follow-tool-turborepo
  - list-workspaces
  - update-config
  - run-install
---

## Goal

ตั้งค่าหรือแก้ไข workspace configuration ของ monorepo — package manager workspaces (bun/npm/pnpm) และ orchestrator config (moon/turbo) ให้สอดคล้องกัน

## Scope

- ใช้กับ monorepo ที่มีอยู่แล้วหรือ setup ใหม่ — config เท่านั้น ไม่ย้ายไฟล์ (ย้าย → `subskills/migrate-to-monorepo/SKILL.md`)
- ครอบคลุม: `package.json#workspaces`, `pnpm-workspace.yaml`, catalogs, `turbo.json`, `.moon/*`, `moon.yml`

## Execute

### 1. Detect Tool

> Goal: รู้ว่าใช้ package manager และ orchestrator อะไร

1. อ่าน root `package.json` — `packageManager`, `workspaces` field
2. ตรวจ `pnpm-workspace.yaml`, `turbo.json`, `.moon/workspace.yml`, `nx.json`
3. ทำ `/list-workspaces` เพื่อดู projects ที่ detect ได้ปัจจุบัน

### 2. Config Package Manager Workspaces

> Goal: workspace globs และ dependency strategy ถูกต้อง

1. bun/npm: ตั้ง `workspaces` ใน root `package.json` เป็น globs เช่น `["apps/*", "packages/*"]`
2. pnpm: ตั้ง `packages:` ใน `pnpm-workspace.yaml` — ใช้ `catalogs:` สำหรับ shared dependency versions ถ้ารองรับ
3. internal deps ใช้ `workspace:*` (pnpm/bun) — npm ใช้ version ที่ตรงกับ local package
4. ถ้า flag/config เฉพาะ tool ไม่แน่ใจ → ดู official docs

### 3. Config Orchestrator

> Goal: task pipeline สอดคล้องกับ workspaces

1. moon: ทำ `/follow-tool-moonrepo` — `.moon/workspace.yml` projects globs, `.moon/tasks/*.yml` shared tasks, `moon.yml` ต่อ project
2. turbo: ทำ `/follow-tool-turborepo` — `turbo.json` tasks/pipeline, `dependsOn`, `outputs`, cache config
3. ไม่มี orchestrator → ใช้ recursive run ของ package manager (`pnpm -r`, `bun run --filter`) ตามที่ตรวจพบ

### 4. Install And Verify

> Goal: install ผ่านและ tasks รันได้

1. ทำ `/run-install` — lockfile regenerate ไม่มี conflicts
2. รัน task หลักผ่าน orchestrator — `moon run :typecheck` หรือ `turbo run typecheck` — บน 1 workspace ก่อนแล้วค่อยทั้ง repo
3. ตรวจ dependency graph ถูกต้อง — `moon query projects` หรือ `turbo run build --dry-run` เท่าที่ tool รองรับ

## Rules

- อ่าน current config ก่อนเสมอ — merge กับของเดิม ห้าม overwrite ทั้งไฟล์ถ้าไม่จำเป็น
- workspace globs ต้องครอบคลุมทุก package ที่ตั้งใจ — ตรวจด้วย list command ของ tool
- ห้าม hardcode version ซ้ำหลาย packages ถ้า catalogs/overrides ใช้ได้
- ทุก config change ต้อง install + verify ก่อน report
- ใช้ `/update-config` สำหรับ shared config ที่กว้างกว่า workspace setup

## Expected Outcome

- workspace config ตรง tool ที่ใช้, projects ถูก detect ครบ
- internal deps ใช้ workspace protocol, shared versions ผ่าน catalogs
- install และ orchestrator tasks รันผ่าน
