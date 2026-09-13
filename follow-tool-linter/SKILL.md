---
name: follow-tool-linter
description: ใช้งาน linter ใน project
argument-hint: "[scope]"
related:
  - follow-tool-biome
  - follow-tool-eslint
  - follow-tool-formatter
  - follow-tool-hk
  - follow-tool-moonrepo
  - resolve-errors
  - run-lint
  - run-format
  - run-verify
---

## Goal

ใช้งาน linter ใน project ตาม tech stack

## Scope

ใช้งาน linter สำหรับ projects ตาม tech stack

- Boundary: skill นี้ช่วยเลือกและ wire linter เข้า repo/CI — หลังเลือก tool แล้วให้ใช้ skill เฉพาะทาง (`/follow-tool-eslint`, `/follow-tool-biome`) สำหรับ config ละเอียด; formatting อยู่ที่ `/follow-tool-formatter`
- Latest: oxlint `1.82.0`, biome `2.5.13`, eslint `10.10.0`, ruff `0.16.7`, golangci-lint `2.13.2` (verified 2026-09-13)
- References: [cli](references/cli.md) | [apis](references/apis.md) | [routes](references/routes.md) | [website](references/website.md) | [package-manifest](references/package-manifest.md)

## Execute

### 1. Select Linter

> Goal: เลือก linter ตาม tech stack ของ project

1. ตรวจสอบ tech stack ของ project
2. เลือก linter ตามความเหมาะสม:
   - TypeScript/JavaScript: oxlint หรือ biome
   - Rust: clippy
   - Go: golangci-lint
   - Python: ruff

### 2. Setup Linter

> Goal: ติดตั้งและตั้งค่า linter

1. รัน `/follow-tool-biome` สำหรับ TypeScript/JavaScript
2. รัน `/follow-tool-eslint` สำหรับ TypeScript/JavaScript
3. สำหรับ oxlint: `bun add -D oxlint` แล้ว `bunx oxlint` — ถ้าต้องการ type-aware rules ให้ติดตั้ง `oxlint-tsgolint` เพิ่ม
4. รัน `clippy` สำหรับ Rust (`rustup component add clippy` แล้ว `cargo clippy`)
5. สำหรับ Python: `pipx install ruff` แล้ว `ruff check` (+ `ruff format` สำหรับ formatter)
6. สำหรับ Go: `mise use -g golangci-lint` แล้ว `golangci-lint run`

### 3. Validate

> Goal: ทดสอบ linter และตรวจสอบ configuration

1. รัน linter เพื่อทดสอบ (เช่น `bun run lint` หรือ `bunx <linter> .`)
2. ตรวจสอบ configuration — effective rules ตรงตั้งใจ, ไฟล์ที่ควร ignore ไม่ถูก lint
3. ทำ `/run-verify` เพื่อตรวจ lint + typecheck รวม

### 4. Integrate With CI And Hooks

> Goal: linter ทำงานใน CI และ pre-commit

1. เพิ่ม lint step ใน CI (`/follow-tool-github-actions` สำหรับ GitHub Actions) — ใช้ check mode ไม่ใช่ fix
2. git hooks สำหรับ lint บน staged files: repo ที่มี `.moon/workspace.yml` → `vcs.hooks` ของ moon เช่น `moon run :lint --affected --status=staged` (ดู `/follow-tool-moonrepo`); repo อื่นหรือต้องการ parallel staged-file linting → `/follow-tool-hk`
3. ใช้ `--max-warnings 0` หรือ equivalent ใน CI ถ้าต้องการ zero-warning gate
4. lint findings ที่พัง → ทำ `/resolve-errors` ก่อน commit

## Rules

### 1. Linter Selection

- เลือก linter ตาม tech stack — ถ้า project มี linter อยู่แล้ว ใช้ตัวเดิม
- แยก lint (code quality) ออกจาก format (style) — ดู `/follow-tool-formatter`
- ใน CI รัน check mode เท่านั้น; auto-fix (`--fix`) ทำ local/hooks

### 2. Error Handling

- ใช้ `/resolve-errors` เมื่อพบ error

- ใช้ `/follow-tool-biome` สำหรับ Biome config ละเอียด
- ใช้ `/follow-tool-eslint` สำหรับ ESLint config ละเอียด
- ใช้ `/follow-tool-formatter` สำหรับ formatter (แยกจาก lint)
- ใช้ `/follow-tool-hk` สำหรับ hooks ใน repo ที่ไม่ใช้ moon
- ใช้ `/follow-tool-moonrepo` สำหรับ `vcs.hooks` ใน moon repo
- ใช้ `/run-lint` เพื่อรัน lint
- ใช้ `/run-format` เพื่อรัน format
- ใช้ `/run-verify` เพื่อ verify lint + typecheck

## Expected Outcome

- Linter ตั้งค่าเรียบร้อย
- Linter ทำงานได้ถูกต้อง
