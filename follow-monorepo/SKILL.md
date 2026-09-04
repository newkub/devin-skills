---
name: follow-monorepo
description: ตรวจสอบและดำเนินการตาม monorepo conventions, workspace scripts, dependencies, และ build pipelines
argument-hint: "[workspace-or-command]"
related:
  - ship
  - run-build
  - run-verify
  - follow-tool-vite
  - follow-tool-bun
  - optimize-bundling
  - optimize-codebase-everything
  - report-table
  - suggest-next-action
---

## Goal

ตรวจสอบและดำเนินการตาม monorepo conventions, workspace scripts, dependencies, และ build pipelines

## Scope

ใช้กับ monorepo ทีใช้ `moon`, `turbo`, `pnpm workspace`, `bun workspace`, หรือ `nx` โดย detect tool, verify workspace conventions, run commands, และจัดการ dependencies

## Execute

### 1. Detect Monorepo Tool

> Goal: รู้ว่าใช้ monorepo tool อะไร

1. ตรวจ root `package.json` สำหรับ `workspaces`, `packageManager`
2. ตรวจ `moon.yml`, `turbo.json`, `nx.json`, `pnpm-workspace.yaml`
3. ตรวจ `moon --version`, `turbo --version`, `pnpm --version`, `bun --version`
4. บันทึก tool ทีใช้

### 2. List Workspaces

> Goal: รู้ว่ามี workspaces อะไรบ้าง

1. ถ้า `moon` → รัน `moon query projects`
2. ถ้า `turbo` → อ่าน `package.json` workspaces
3. ถ้า `pnpm` → รัน `pnpm -r list`
4. ถ้า `bun` → อ่าน `package.json` workspaces
5. สร้าง list: name, path, type (app/package/integration/tool)

### 3. Verify Workspace Conventions

> Goal: ตรวจสอบว่าแต่ละ workspace ตาม conventions

1. ตรวจ `package.json` มี `name`, `type: module`, `scripts`
2. ตรวจ `moon.yml` ถ้าใช้ moon
3. ตรวจ `tsconfig.json`, `biome.jsonc` มีหรือไม่
4. ตรวจ `README.md` หรือ `AGENTS.md` ใน workspace
5. บันทึก workspaces ทีขาด conventions

### 4. Run Workspace Command

> Goal: รัน command ทั่ว workspaces

1. ใช้ tool command ทีเหมาะสม:
   - moon: `moon run :<task> --concurrency 1`
   - turbo: `turbo run <task>`
   - pnpm: `pnpm -r <command>`
   - bun: `bun run --filter <workspace> <script>`
2. บันทึกผลลัพธ์และ errors
3. ถ้า fail → ทำ `/resolve-errors`

### 5. Check Dependencies

> Goal: ตรวจ dependencies ระหว่าง workspaces

1. ตรวจ `package.json` dependencies ในแต่ละ workspace
2. ตรวจ external dependencies ว่า duplicate หรือไม่
3. ตรวจ internal workspace dependencies (`workspace:*`)
4. ถ้ามี duplicate หรือ version ต่าง → ทำ `/update-version-latest`

### 6. Verify Build Pipeline

> Goal: ยืนยัน build pipeline ทำงาน

1. รัน `bun install` หรือ package manager install
2. รัน `moon run :build` หรือ `turbo run build`
3. รัน `moon run :typecheck` หรือ `turbo run typecheck`
4. รัน `moon run :lint` หรือ `turbo run lint`
5. ถ้า fail → ทำ `/resolve-errors`

## Rules

### 1. Tool Agnostic

- รองรับ moon, turbo, pnpm, bun, nx
- ใช้ command ที tool แนะนำ
- ไม่สมมติว่าทุก project ใช้ tool เดียวกัน

### 2. Workspace Conventions

- ทุก workspace ต้องมี `package.json` กับ `name`
- ทุก workspace ควรมี `README.md`
- ทุก app ควรมี `AGENTS.md` ถ้ามี global rules

### 3. Consistent Dependencies

- ใช้ `workspace:*` สำหรับ internal packages
- หลีกเลี่ยง duplicate external versions
- อัปเดต `bun.lock` หรือ `pnpm-lock.yaml` เมื่อ dependencies เปลี่ยน

### 4. Parallel Safety

- รัน commands ด้วย concurrency ทีเหมาะสม
- ไม่รัน destructive command กับทุก workspace พร้อมกัน
- ใช้ dry-run ถ้า command มี side effects

### 5. Minimal Impact

- ไม่เปลี่ยน tool ถ้าไม่จำเป็น
- ไม่ refactor workspaces ทั้งหมดในครั้งเดียว
- แก้เฉพาะ workspaces ทีมีปัญหา

## Expected Outcome

- Monorepo tool ถูก detect
- Workspaces ถูก list และ verify conventions
- Dependencies consistent
- Build/typecheck/lint ผ่าน
- Report table สรุปสถานะทุก workspace
