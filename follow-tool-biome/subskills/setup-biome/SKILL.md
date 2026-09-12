---
name: follow-tool-biome-setup-biome
description: ติดตั้ง Biome และสร้าง biome.json — editor integration, CLI basics
argument-hint: "[project-path]"
related:
  - follow-tool-biome
  - run-lint
  - run-format
  - setup-cicd
---

## Goal

ติดตั้ง Biome ใน project — `biome.json`/`biome.jsonc` ถูกต้อง, editor format-on-save ทำงาน, CLI scripts พร้อมใช้

## Scope

- first-time setup ของ Biome (linter + formatter + assist)
- ครอบคลุม install, config file, editor integration, CLI basics
- migration จาก ESLint/Prettier → `subskills/migrate-from-eslint-prettier/SKILL.md`

## Execute

### 1. Prerequisites

> Goal: environment พร้อมก่อนติดตั้ง

1. ตรวจว่ามี `package.json` และระบุ package manager ที่ project ใช้
2. ถ้ามี `biome.json`/`biome.jsonc` + `@biomejs/biome` ใน deps อยู่แล้ว → verify เท่านั้น ข้ามไป step 5

### 2. Install And Init

> Goal: ติดตั้งและสร้าง config

1. `bun add -D @biomejs/biome` หรือ package manager ที่ project ใช้
2. รัน `bunx biome init` เพื่อสร้าง config — หรือสร้าง `biome.jsonc` เองตาม parent skill
3. ตั้ง `$schema` ชี้ไป `./node_modules/@biomejs/biome/configuration_schema.json` เพื่อ autocomplete
4. เปิด `vcs` integration (`enabled`, `clientKind: "git"`, `useIgnoreFile: true`)

### 3. Configure Features

> Goal: เปิด linter/formatter/assist ตาม need

1. `linter.enabled: true` + recommended rules — เพิ่ม rules เฉพาะที่ project ต้องการ
2. `formatter.enabled: true` — ตั้ง indent/line width ถ้าต่างจาก default
3. `assist.enabled: true` สำหรับ import sorting/actions
4. monorepo → root `biome.jsonc` + workspace configs ด้วย `root: false` + `extends` (ดู parent skill)
5. options ที่ไม่แน่ใจ → ดู official docs (`biomejs.dev`)

### 4. Editor Integration

> Goal: format-on-save และ lint ใน editor

1. VS Code: ติดตั้ง Biome extension, ตั้ง `"editor.defaultFormatter": "biomejs.biome"` และ `editor.formatOnSave` ใน `.vscode/settings.json`
2. เปิด `source.fixAll.biome` ใน `codeActionsOnSave` ถ้าต้องการ auto-fix
3. editor อื่น → ดู official docs สำหรับ extension/LSP ที่รองรับ
4. ถ้า project เคยใช้ Prettier/ESLint extensions → disable สำหรับ JS/TS เพื่อกัน conflict

### 5. CLI And Verify

> Goal: scripts ทำงานและ output ถูก

1. เพิ่ม scripts: `"lint": "biome lint"`, `"lint:fix": "biome lint --write"`, `"format": "biome format --write"` ตาม parent skill
2. รัน `bun run lint` + `bun run format` → ทำงานไม่มี config error
3. รัน `bunx biome check .` → รายงาน diagnostics จริง
4. ถ้า config error → `/resolve-errors` max 3 รอบ แล้ว report

## Rules

### 1. Setup

- ใช้ `biome.jsonc` (รองรับ comments) ตาม parent skill
- config ขั้นต่ำก่อน — ห้าม copy rules ทั้งก้อนโดยไม่เข้าใจ
- ใช้เฉพาะ options จาก official docs

### 2. Conflicts

- ห้ามรัน Biome ขนานกับ Prettier/ESLint บนไฟล์เดียวกันโดยไม่มีแผน — ทำ `migrate-from-eslint-prettier` ถ้าจะย้าย
- disable conflicting editor formatters สำหรับ JS/TS

## Expected Outcome

- Biome ติดตั้ง, config ถูกต้อง, editor format-on-save ทำงาน
- `lint`/`format`/`check` scripts รันได้
