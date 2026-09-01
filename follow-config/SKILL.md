---
name: follow-config
description: จัดการและ validate config files ของ project ให้สอดคล้องกับ conventions
argument-hint: "[config-type-or-file]"
allowed-tools:
  - read
  - write
  - edit
  - grep
  - find_file_by_name
  - exec
  - skill
  - ask_user_question
  - report
  - report-table
  - suggest-next-action
  - resolve-errors
triggers:
  - user
  - model
related:
  - update-config
  - update-dot-devin
  - setup-cicd
  - follow-my-tech-stack
  - follow-agents-md
  - update-references
  - deep-validate
  - resolve-errors
---

## Goal

ตรวจสอบ ซิงค์ และ validate config files ของ project ให้สอดคล้องกับ conventions ของ project และ tech stack

## Scope

ใช้กับ config files ทั่วไปใน project เช่น `.devin/`, `.vscode/`, `.github/`, `package.json`, `turbo.json`, `moon.yml`, `wrangler.toml`, `playwright.config.*`, รวมถึง CI/CD config และ tooling configs

## Execute

### 1. Identify Configs

> Goal: ระบุ config files ทีเกี่ยวข้อง

1. หา config files ด้วย `/find_file_by_name` ในพื้นที:
   - root project
   - `.devin/`
   - `.vscode/`
   - `.github/`
   - `packages/*/` (monorepo)
2. อ่าน `package.json` และ `AGENTS.md` เพื่อเข้าใจ conventions
3. ระบุ tech stack จาก dependencies

### 2. Check Conventions

> Goal: ตรวจสอบว่า config files ตรงกับ conventions

1. ตรวจชื่อไฟล์และ location ของ config ทีควรมี
2. ตรวจ shared settings: root `package.json`, `tsconfig.json`, `biome.json`, `eslint.config.*`
3. ตรวจ workspace overrides: `turbo.json`, `moon.yml`, `pnpm-workspace.yaml`
4. ตรวจ CI/CD: `.github/workflows/`, `.gitlab-ci.yml`
5. ตรวจ project rules: `.devin/rules/`, `AGENTS.md`

### 3. Sync Configs

> Goal: ทำให้ config ทั่งหมดสอดคล้องกัน

1. ถ้า root เปลี่ยน → sync ลง workspaces
2. ถ้า workspace เปลี่ยน → sync ขึ้น root ถ้าจำเป็น
3. อัปเดต `AGENTS.md` ถ้า conventions เปลี่ยน
4. ใช้ `/update-references` เมื่อ config references มีการเปลี่ยนแปลง

### 4. Validate Configs

> Goal: ยืนยันว่า config ใช้งานได้

1. รัน `bun run lint`, `bun run typecheck` หรือ command ทีเกี่ยวข้อง
2. รัน `bun run build` ถ้าจำเป็น
3. ตรวจ schema ของ config files ถ้ามี เช่น `wrangler.toml`, `turbo.json`
4. ถ้า fail → ทำ `/resolve-errors` แล้ว retry (max 3)

### 5. Report

> Goal: สรุปผลลัพธ์

1. ทำ `/report-table` แสดง config files ทีตรวจ, สถานะ, การเปลี่ยนแปลง
2. ทำ `/report` สรุป findings และ next actions
3. ทำ `/suggest-next-action`

## Rules

### 1. Config Types

- Project root: `package.json`, `tsconfig.json`, `biome.json`, `eslint.config.*`, `.gitignore`
- Devin: `.devin/`, `AGENTS.md`
- IDE: `.vscode/settings.json`, `.vscode/extensions.json`, `.vscode/launch.json`
- CI/CD: `.github/workflows/`, `.gitlab-ci.yml`
- Deployment: `wrangler.toml`, `netlify.toml`, `vercel.json`
- Testing: `playwright.config.*`, `vitest.config.*`, `jest.config.*`

### 2. Sync Rules

- root config เป้น source of truth ถ้าไม่ระบุอื่น
- workspace สามารถ override ได้แต่ต้องมีเหตุผล
- ไม่ copy secrets หรือ environment-specific values ลง config ที่ commit
- ใช้ `/update-references` เมื่อเปลี่ยน path หรือชื่อ config

### 3. Safety

- ไม่ลบหรือ overwrite config เก่าโดยไม่มี backup หรือ dry run
- ถ้า config มี sensitive data → หยุดและถาม user
- ทำ git diff ก่อน commit config changes

## Expected Outcome

- Config files ทั่งหมดสอดคล้องกัน
- ไม่มี config drift ระหว่าง root กับ workspaces
- Project conventions ถูกบันทึกใน `AGENTS.md` หรือ `.devin/rules/`
- ผ่าน lint, typecheck, build โดยไม่มี errors จาก config
