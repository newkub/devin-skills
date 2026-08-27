---
name: update-config
description: อัปเดต project config ให้ครบถ้วน สอดคล้อง ลด duplication โดยใช้ shared config/dependencies catalog
argument-hint: "[path]"
related:
  - review-config
  - report-config-files
  - follow-devin-skills
  - follow-tool-mise
  - follow-tool-moonrepo
  - update-project
  - update-dot-devin
  - update-gitignore
  - deep-validate
  - report-idea-cleanup-files-in-computer
---

## Goal

อัปเดต project configuration ให้ครบถ้วน สอดคล้องกัน ลด duplication และใช้ shared config / dependencies catalog เมื่อเป็นไปได้

## Scope

- ใช้กับ root project หรือ workspace ใดๆ
- ครอบคลุม package manifest, tool configs, monorepo setup, CI/CD, editor, env, git
- เรียก `/review-config` ก่อนเพื่อดู findings
- ถ้า monorepo → ใช้ `/follow-tool-moonrepo`

## Execute

### 1. Review Current Config

> Goal: รู้สภาพ config ปัจจุบัน

1. ทำ `/review-config` เพื่อดู findings
2. บันทึก priority list จาก severity
3. ระบุ config ที่ต้องสร้าง ลบ หรือ refactor
4. ถ้า project ยังไม่มี `.devin/rules` หรือ `AGENTS.md` → ทำ `/update-dot-devin` และ `/update-agents-md`

### 2. Plan Shared Config Strategy

> Goal: เลือกวิธีรวม config

1. ถ้า monorepo ใช้ moonrepo:
   - ทำ `/follow-tool-moonrepo` เพื่อตรวจ `.moon/workspace.yml`, `.moon/toolchains.yml`, `.moon/tasks/*.yml`
   - สร้าง/อัปเดต `tsconfig.base.json` หรือ `tsconfig.options.json` แล้วให้แต่ละ workspace `extends` มัน
   - ใช้ `.moon/tasks/*.yml` สำหรับ shared tasks (build, lint, test, typecheck, scan)
   - ใช้ `moon.yml` ในแต่ละ project อ้างอิง tasks หลัก
2. ถ้า monorepo ใช้ pnpm workspace:
   - ตรวจ `pnpm-workspace.yaml` ว่ามี `catalogs:` หรือไม่
   - ย้าย shared dependencies ไป `pnpm-workspace.yaml` catalogs หรือ `catalog:` field
   - ใช้ `package.json` แบบ `catalog:` แทน version numbers
   - สร้าง root `tsconfig.base.json` ให้ทุก package `extends`
   - สร้าง root `.eslintrc` / `eslint.config.js` และ `prettier.config.js`
3. ถ้า monorepo ใช้ bun workspace:
   - ตรวจ `bun-workspace.toml` หรือ `package.json` `workspaces`
   - ใช้ `bun.catalogs` (ถ้ามี) หรือ root `package.json` `overrides`
   - สร้าง `bunfig.toml` สำหรับ shared install config
   - สร้าง `tsconfig.base.json` ให้ workspaces `extends`
4. ถ้า single project:
   - ตรวจว่า `tsconfig.json`, `eslint.config.*`, `prettier.config.*` มี `extends` หรือไม่
   - พิจารณาใช้ shared config packages เช่น `@antfu/eslint-config`, `@tsconfig/*`, `prettier-config-standard`
   - ตรวจ `mise.toml` หรือ `.tool-versions` ให้ pin versions

### 3. Update Package Manifest

> Goal: package.json หรือ manifest หลักอัปเดต

1. ตรวจ `package.json`:
   - มี `packageManager` หรือไม่ (`pnpm@9.1.0`, `bun@1.1.0`)
   - มี `engines` หรือไม่
   - มี `workspaces` หรือ `package.json#workspaces`
   - มี `trustedDependencies` / `onlyBuiltDependencies` (Bun) หรือไม่
   - มี `repository`, `homepage`, `bugs`, `license` หรือไม่
   - มี `type`, `main`, `module`, `types` หรือไม่
2. ถ้า monorepo:
   - เพิ่ม/อัปเดต `pnpm-workspace.yaml` หรือ `bun-workspace.toml`
   - ใช้ `catalog:` หรือ `catalogs` สำหรับ shared dependencies
   - ลบ duplicate devDependencies ออกจาก package ลูก ย้ายไป root หรือ catalog
3. ถ้าใช้ mise:
   - ทำ `/follow-tool-mise` เพื่อตรวจ `mise.toml` ใน root
   - ระบุ tool versions สอดคล้องกับ `package.json engines`

### 4. Update Tool Configs

> Goal: tool configs สอดคล้องและไม่ซ้ำซ้อน

1. TypeScript:
   - สร้าง/อัปเดต `tsconfig.base.json` ใน root
   - ให้ workspace `tsconfig.json` extends `tsconfig.base.json`
   - ตรวจ `compilerOptions` ไม่ conflict ระหว่าง workspaces
2. ESLint:
   - รวมเป็น `eslint.config.js` / `eslint.config.mjs` หรือ root `.eslintrc`
   - ใช้ shared config package ถ้าเหมาะสม
   - ลบ `.eslintrc.*` ที่ซ้ำซ้อน
3. Prettier:
   - รวมเป็น root `prettier.config.*` หรือ `.prettierrc`
   - อ้างอิงใน `package.json#prettier`
4. Vitest / Jest:
   - สร้าง shared test config แล้วให้ workspace `extends` หรือ `defineConfig` จาก shared
5. Build tools:
   - รวม `vite.config.*`, `tsup.config.*` ใช้ shared plugins ถ้าเป็นไปได้
6. Knip / Taze:
   - สร้าง `knip.config.*` หรือ `knip.json` ใน root
   - สร้าง `taze.config.*` ถ้าใช้

### 5. Update Monorepo Orchestration

> Goal: monorepo config ถูกต้อง

1. ถ้าใช้ moonrepo:
   - ทำ `/follow-tool-moonrepo` อัปเดต `.moon/workspace.yml`, `.moon/toolchains.yml`, `.moon/tasks/*.yml`
   - ตรวจ `moon.yml` แต่ละ project มี `id`, `language`, `type`, `dependsOn`
2. ถ้าใช้ turbo:
   - อัปเดต `turbo.json` ด้วย pipeline tasks
   - ใช้ `$schema` เวอร์ชันล่าสุด
   - ตรวจ `globalDependencies`, `globalEnv`, `remoteCache`
3. ถ้าใช้ pnpm/yarn/npm workspaces:
   - อัปเดต `pnpm-workspace.yaml` / `package.json#workspaces`
   - ใช้ `catalogs` หรือ `nohoist` ตามจำเป็น

### 6. Update CI/CD And Automation

> Goal: CI/CD config sync กับ project

1. ตรวจ `.github/workflows/*.yml`:
   - ใช้ package manager ตรงกับ `packageManager` field
   - ใช้ node/bun version ตรงกับ `engines` หรือ `mise.toml`
   - ใช้ moon/turbo run ตรงกับ root scripts
2. ตรวจ `.github/dependabot.yml` หรือ renovate config
3. ตรวจ git hooks:
   - `lefthook.yml` หรือ `husky` config
   - ใช้ `lint-staged` หรือ `nano-staged` ถ้าจำเป็น
4. ทำ `/update-dot-devin` สำหรับ Devin-specific rules

### 7. Update Editor And Environment

> Goal: editor, env, git config สะดวกและปลอดภัย

1. สร้าง/อัปเดต `.vscode/settings.json`, `.vscode/extensions.json`, `.vscode/launch.json`
2. สร้าง/อัปเดต `.editorconfig`
3. ตรวจ `.env.example` หรือ `.env.local.example`
4. ทำ `/update-gitignore` เพื่อ sync `.gitignore`
5. ตรวจ `.gitattributes`

### 8. Apply Changes With Dry Run

> Goal: ไม่ทำลาย config ที่มีอยู่

1. แสดง preview ของทุกการเปลี่ยนแปลงก่อน write
2. ถ้ามี destructive change (ลบ/overwrite) → ทำ dry-run แล้วถาม user
3. ใช้ `edit` ทีละไฟล์
4. บันทึกทุก config ที่ถูกเปลี่ยน

### 9. Validate

> Goal: ตรวจสอบว่า config ถูกต้อง

1. ทำ `/deep-validate` เพื่อตรวจ structure และ references
2. รัน tool validate ตาม ecosystem:
   - `moon check` หรือ `moon run :check` (moonrepo)
   - `tsc --noEmit` หรือ `tsc -b` (TypeScript)
   - `eslint .` (ESLint)
   - `prettier --check .` (Prettier)
   - `knip` (unused)
3. ทำ `/report-config-files` อีกครั้งเพื่อ verify
4. ทำ `/report-table` สรุป changes

## Rules

### 1. Review First

- ต้องทำ `/review-config` ก่อน update
- ไม่แก้ไขก่อนมี findings และ priority
- ถ้า project ใหญ่หรือ monorepo ซับซ้อน → ใช้ `/follow-devin-global-subagents`

### 2. Prefer Shared And Extends

- ใช้ shared config / `extends` แทน duplicate config ในแต่ละ workspace
- ใช้ dependencies catalog (`pnpm catalogs`, `bun catalogs`) แทน version ซ้ำ
- ย้าย shared devDependencies ไป root หรือ catalog

### 3. Monorepo

- ถ้ามี `.moon` หรือ `moon.yml` → ใช้ `/follow-tool-moonrepo`
- ถ้ามี `turbo.json` → ตรวจ `turbo.json` schema และ pipeline
- ถ้ามี `pnpm-workspace.yaml` → ตรวจ `catalogs` และ `packages`

### 4. Safety

- ทำ dry run สำหรับ destructive changes
- ถาม user ก่อนลบหรือ overwrite config
- ไม่ expose secrets
- สำรองไฟล์สำคัญก่อนแก้ถ้าจำเป็น

### 5. Ecosystem Aware

- ใช้ conventions ของ Bun, pnpm, Node, Rust, Python ตามทีตรวจพบ
- ใช้ `/follow-devin-skills` เพื่อหา config skills เฉพาะทาง

## Expected Outcome

- config files ทั้งหมดครบถ้วนและสอดคล้องกัน
- ลด duplication ด้วย shared config / extends / catalog
- monorepo orchestration ถูกต้อง
- CI/CD, editor, env, git config sync
- ผ่าน `/deep-validate` และ tool checks ตาม ecosystem
- รายงาน changes, risks, และ next actions
