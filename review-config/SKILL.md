---
name: review-config
description: Review config files หา drift, missing, duplicate, shared config และ dependencies catalog
argument-hint: "[path]"
related:
  - report-config-files
  - list-ci-configs
  - setup-ci-cd
  - setup-package
  - setup-release
  - follow-devin-skills
  - follow-devin-global-subagents
  - follow-tool-mise
  - follow-tool-moonrepo
  - deep-validate
---

## Goal

Review ทุก configuration files ใน project ว่ามีอะไรบ้าง หา drift, missing, duplicate, และโอกาสใช้ extends config หรือ dependencies catalog

## Scope

- ใช้กับ root project หรือ workspace ใดๆ
- ครอบคลุม config files ทุกประเภท: package manifest, tool configs, CI/CD, env, moon/turbo, editor, git hooks
- ไม่แก้ไขไฟล์ ให้ report findings เป็น input สำหรับ `/update-config`

## Execute

### 1. Discover Config Files

> Goal: รวบรวม config files ทั้งหมด

1. ใช้ `/report-config-files` เพื่อหา config files
2. ค้นหาเพิ่มเติมด้วย `glob` สำหรับ patterns:
   - package: `package.json`, `bun.lockb`, `pnpm-workspace.yaml`, `Cargo.toml`, `go.mod`, `pyproject.toml`, `requirements.txt`
   - tooling: `tsconfig*.json`, `jsconfig.json`, `vite.config.*`, `vitest.config.*`, `eslint.config.*`, `.eslintrc*`, `prettier.config.*`, `.prettierrc*`, `knip.config.*`, `renovate.json`, `dependabot.yml`
   - monorepo: `moon.yml`, `.moon/workspace.yml`, `.moon/toolchains.yml`, `.moon/tasks/*.yml`, `turbo.json`, `pnpm-workspace.yaml`, `bun-workspace.toml`, `bunfig.toml`
   - CI/CD: `.github/workflows/*.yml`, `.github/dependabot.yml`, `.gitea/workflows/*`, `.circleci/*`, `.gitlab-ci.yml`
   - editor/ide: `.vscode/settings.json`, `.vscode/extensions.json`, `.vimrc`, `.devin/rules`, `.cursor/rules`, `.windsurf/memories/global_rules.md`
   - env: `.env*`, `*.env`, `config/.env*`
   - git: `.gitignore`, `.gitattributes`, `.github/*`, `lefthook.yml`, `husky/*`, `.pre-commit-config.yaml`
   - docs: `README.md`, `AGENTS.md`, `USAGE.md`, `CONTRIBUTING.md`, `LICENSE`
3. จัดกลุ่มไฟล์ตาม category: build, lint, test, deploy, editor, env, monorepo, docs
4. บันทึก path, format, purpose โดยประมาณ

### 2. Analyze Config Coverage

> Goal: ระบุ config ที่มี, ขาด, หรือซ้ำซ้อน

1. ตรวจสอบว่า project มี config ที่จำเป็นต่อ tech stack:
   - TypeScript: `tsconfig.json`, แยก `tsconfig.base.json` ถ้า monorepo
   - Bun/Node: `package.json` ครบ scripts, engines, volta/mise?
   - Lint: `eslint.config.*` หรือ `.eslintrc*`
   - Format: `prettier.config.*` หรือ `.prettierrc*`
   - Test: `vitest.config.*`, `jest.config.*`, `playwright.config.*`
   - Build: `vite.config.*`, `tsup.config.*`, `rollup.config.*`, `webpack.config.*`
   - Monorepo: `moon.yml` / `.moon/` หรือ `turbo.json` / `pnpm-workspace.yaml`
   - Type check / unused: `knip.config.*`, `taze.config.*`
   - Security/quality: `.gitleaks.toml`, `snyk.yml`, `codeql.yml`
2. ระบุ config ที่ซ้ำซ้อนกัน (เช่น `.eslintrc` + `eslint.config.js`)
3. ระบุ config ที่ drift ระหว่าง workspaces (เช่น `tsconfig.json` แต่ละ package ไม่ consistent)
4. ระบุ config ที่ out-of-date (version, deprecated keys)

### 3. Check Shared Config Opportunities

> Goal: หาโอกาสรวม config ด้วย extends / catalog

1. ตรวจ monorepo:
   - ถ้าใช้ moonrepo → ทำ `/follow-tool-moonrepo` เพื่อดู `.moon/workspace.yml`, `.moon/tasks/*.yml`, shared toolchain
   - ถ้าใช้ pnpm workspace → ตรวจ `pnpm-workspace.yaml` และ `catalog:` ใน `package.json` / `pnpm-workspace.yaml`
   - ถ้าใช้ bun workspace → ตรวจ `bun-workspace.toml` และ shared `tsconfig.base.json`
   - ถ้าใช้ npm/yarn workspace → ตรวจ `workspaces` field
2. ตรวจ extends config:
   - `tsconfig.json` มี `extends` หรือไม่
   - `eslint.config.*` มี `import(...)` shared config หรือไม่
   - `prettier` มี shared config package หรือไม่
   - `vitest`, `vite`, `knip` แยก shared config ได้หรือไม่
3. ตรวจ dependencies catalog:
   - `pnpm.catalogs` หรือ `bun.catalogs`
   - `mise` global tools กับ project `mise.toml`
   - ใช้ `package.json` `overrides`/`resolutions` ควบคุม versions
4. ระบุโอกาสเปลี่ยน duplicate config เป็น shared / catalog

### 4. Review Security And Secrets

> Goal: ตรวจ config ด้านความปลอดภัย

1. ค้นหา hardcoded secrets: API keys, tokens, passwords ใน config files
2. ตรวจ `.env` files ว่าอยู่ใน `.gitignore` หรือไม่
3. ตรวจ `package.json` มี `engines` / `trustedDependencies` / `onlyBuiltDependencies` ที่เหมาะสมหรือไม่
4. ตรวจ CI/CD config มี secret scanning, SLSA, signed commits หรือไม่
5. ถ้าพบ CI config ผิดหรือ pipeline ต้อง monitor จนผ่าน → ระบุให้ใช้ `/watch-ci-and-resolve`

### 5. Check Tool Versions And Consistency

> Goal: ให้ tool versions สอดคล้องกัน

1. ตรวจ versions ใน `package.json` devDependencies/dependencies กับ `mise.toml` / `.tool-versions`
2. ตรวจ node/bun/pnpm versions ระหว่าง `package.json engines`, `mise.toml`, `.nvmrc`, `.node-version`
3. ตรวจ `packageManager` field ใน `package.json` (pnpm, bun, yarn, npm)
4. ระบุ inconsistencies เช่น `package.json` ใช้ bun แต่ CI ใช้ pnpm

### 6. Generate Report

> Goal: สรุป findings สำหรับ update

1. ทำ `/report-table` ด้วย columns: Category, File, Status, Issue, Severity, Recommendation
2. ทำ `/report-file-structure` สำหรับ config tree
3. สรุป:
   - config ที่ครบ
   - config ที่ขาด
   - config ที่ซ้ำ / drift
   - โอกาส shared config / catalog
   - security risks
   - version inconsistencies
4. ระบุ next actions สำหรับ `/update-config`
   - ถ้า package manifest ขาด fields สำหรับ publish → แนะนำ `/setup-package`
   - ถ้า release workflow หรือ release tool ขาด → แนะนำ `/setup-release`
   - ถ้า CI/CD config ขาด/ผิด → แนะนำ `/setup-ci-cd`

## Rules

### 1. Read-Only Review

- ไม่แก้ไข config files
- ไม่ expose secrets
- ไม่ commit

### 2. Ecosystem Aware

- ใช้ conventions ตาม tech stack
- ใช้ `/follow-devin-skills` เพื่อหา config-related skills
- ถ้า monorepo → ใช้ `/follow-tool-moonrepo`

### 3. Comprehensive Coverage

- ตรวจทั้ง root และ workspaces
- ตรวจทั้ง package config, tool config, CI/CD, editor, env, git
- ไม่ละเว้น config ที่ไม่ใช่ code

### 4. Prioritize

- เรียง severity: security > consistency > duplication > missing
- ระบุ quick wins และ high-impact changes

### 5. Shared Config And Deduplication

- ถ้า pattern คล้ายกันระหว่าง workspaces ให้ใช้ shared config หรือ `extends`
- พยายามสร้าง schema สำหรับ config ที่ซับซ้อนเพื่อ validate
- ไม่เขียน config ที่ซ้ำกับ default config
- เขียนเฉพาะสิ่งที่ต่างจาก default พร้อม comment อธิบาย default config คืออะไร
- เก็บเฉพาะ config หลักๆ ที่มีผลต่อ project

## Expected Outcome

- รายการ config files ทั้งหมดจัดกลุ่มตาม category
- ตาราง findings ด้วย severity และ recommendation
- รายการโอกาสใช้ extends config / dependencies catalog / shared config
- รายงาน security risks และ version inconsistencies
- รายการ config ที่สามารถ deduplicate หรือรวมเป็น shared/extends ได้
- รายการ config ที่ควรมี schema หรือ comment อธิบาย default
- input ที่ครบสำหรับ `/update-config`
