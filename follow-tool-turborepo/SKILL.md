---
name: follow-tool-turborepo
description: ตั้งค่าและใช้ Turborepo v2.x สำหรับ monorepo task orchestration
related:
  - follow-monorepo
  - follow-package-manifest
  - follow-tool-taze
  - follow-tool-vite
  - follow-tool-vitest
---

## Goal

ตั้งค่าและใช้ Turborepo v2.x สำหรับ task orchestration, caching และ build pipeline ใน monorepo

## Scope

ใช้สำหรับ monorepos ที่ต้องการ orchestrate tasks, cache outputs, remote cache, package boundaries

## Execute

### 1. Repository Structure

> Goal: จัดโครงสร้าง workspace สำหรับ Turborepo

1. ใช้ `bun` หรือ package manager ที project ใช้
2. ตั้งค่า root `package.json` ด้วย `private`, `packageManager`, `workspaces`
3. จัด directory ด้วย `apps/*` และ `packages/*`
4. หลีกเลี่ยง nested packages
5. ตรวจสอบแต่ละ package มี `package.json` พร้อม `exports`

### 2. Install Turbo

> Goal: ติดตั้ง turbo CLI

1. ติดตั้งด้วย `bun add -D turbo`
2. ตรวจสอบ version ด้วย `bunx turbo --version`
3. ดูรายละเอียด CLI ใน [references/turborepo.md](references/turborepo.md)

### 3. Configure turbo.json

> Goal: สร้าง `turbo.json` ที root

1. สร้าง `turbo.json` ที root พร้อม `$schema`
2. กำหนด `tasks` สำหรับ build, test, lint, dev
3. ตั้งค่า `dependsOn`, `inputs`, `outputs`, `cache`
4. ตั้งค่า `env` และ `passThroughEnv`
5. เปิดใช้ `futureFlags.globalConfiguration` เพื่อย้าย global keys ไปยัง `global`
6. ดู config details ใน [references/turborepo.md](references/turborepo.md)

### 4. Package-Level Config

> Goal: override หรือ extend root config ในแต่ละ package

1. สร้าง `turbo.json` ใน package ถ้าต้องการ override
2. ใช้ `"extends": ["//"]` เพื่อ inherit จาก root
3. ใช้ `$TURBO_EXTENDS$` เพื่อ append แทน replace
4. ระบุ `outputs` และ `dependsOn` เฉพาะ package

### 5. Task Filtering and Watch

> Goal: ใช้ filter และ watch mode

1. รัน `bunx turbo run <task>`
2. ใช้ `--filter` สำหรับ package เฉพาะ
3. ใช้ `--affected` สำหรับ changed packages
4. ใช้ `bunx turbo watch <task>` สำหรับ development
5. ใช้ `--dry=json` เพื่อ inspect task graph

### 6. Boundaries and Remote Cache

> Goal: enforce package isolation และ remote cache

1. ใช้ `bunx turbo boundaries` เพื่อตรวจ package isolation
2. กำหนด `tags` และ `boundaries` rules ใน `turbo.json`
3. ตั้งค่า remote cache ด้วย `bunx turbo link --yes`
4. ใช้ `TURBO_TOKEN` และ `TURBO_TEAM` สำหรับ authentication
5. ตั้งค่า `cacheMaxSize` และ `cacheMaxAge`

## Rules

### 1. Configuration

- ใช้ `turbo.json` ที root พร้อม `$schema`
- ใช้ `futureFlags.globalConfiguration: true`
- กำหนด `inputs` และ `outputs` ให้ชัดเจน

### 2. Task Dependencies

- ใช้ `^task` สำหรับ upstream dependencies
- ใช้ `task` สำหรับ same package
- ระบุ `dependsOn` ตาม task graph

### 3. Caching

- เปิด `cache: true` สำหรับ deterministic tasks
- ปิด `cache` สำหรับ dev servers และ side-effect tasks
- ใช้ `persistent: true` สำหรับ long-running tasks

### 4. Environment Variables

- ใช้ `env` สำหรับ variables ที affect cache hash (ไม่มี `$` prefix)
- ใช้ `passThroughEnv` สำหรับ secrets
- ไม่ hard-code secrets

### 5. Boundaries

- ใช้ `turbo boundaries` ตรวจ package isolation
- กำหนด `tags` และ `boundaries` rules
- หลีกเลี่ยง imports ข้าม package boundaries

## References

- [CLI reference](references/cli.md)
- [References index](references/index.md)

## Expected Outcome

- `turbo.json` ถูกต้อง
- Tasks รันและ cache ได้
- Watch mode และ filter ทำงาน
- Remote cache ตั้งค่าได้
- Package isolation enforce ด้วย boundaries
