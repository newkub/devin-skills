---
name: follow-tool-changelogen-setup-changelogen
description: ติดตั้ง changelogen, ตั้งค่า changelog generation และ release command
argument-hint: "[scope]"
related:
  - follow-tool-changesets
  - run-release
  - follow-secret-manager
---

## Goal

ติดตั้งและตั้งค่า changelogen ให้ generate changelog จาก conventional commits และรัน release command ได้ — first-time setup

## Scope

ใช้สำหรับ projects ที่ต้องการ automated changelog generation และ release ด้วย changelogen — config, package scripts, release commands

## Execute

### 1. Check Prerequisites

> Goal: ตรวจ state ก่อน setup

1. ตรวจว่ามี `changelog.config.ts` หรือ `changelog` field ใน `package.json` อยู่แล้วหรือไม่ — ถ้ามี → skip ไป verify
2. ตรวจว่า project ใช้ conventional commits — changelogen parse `type(scope): description`
3. changelogen รันผ่าน `bunx changelogen@latest` ได้โดยไม่ต้องติดตั้ง — หรือ `bun add -D changelogen` เพื่อ pin version

### 2. Configure

> Goal: สร้าง config สำหรับ project

1. สร้าง `changelog.config.ts` ที่ root พร้อม `defineConfig` จาก `changelogen` — config โหลดผ่าน c12 จาก `changelog.config.{ts,js,mjs,cjs}`, `.changelogrc` หรือ field `changelog` ใน `package.json`
2. ตั้ง `types` (commit type → title + semver bump) และ `scopeMap` (map scope → display name)
3. ตั้ง `output` ถ้าต้องการ custom path (default `CHANGELOG.md`)
4. ตั้ง `templates` (commitMessage, tagMessage, tagBody), `excludeAuthors`, `publish`, `repo` ตามต้องการ

### 3. Setup Package Scripts

> Goal: เพิ่ม scripts สำหรับ changelog/release

1. `"changelog": "bunx changelogen@latest --release"` — full release (bump + changelog + commit + tag + GitHub release)
2. `"changelog:version": "bunx changelogen@latest --bump"` — version bump เท่านั้น
3. `"changelog:generate": "bunx changelogen@latest"` — generate changelog เท่านั้น

### 4. Release Flow

> Goal: ใช้ release commands อย่างถูกต้อง

1. `--release` — full release: bump + changelog + git commit + tag + sync GitHub release
2. ปิด sub-steps ด้วย `--no-commit`, `--no-tag`, `--no-github`; ใช้ `--push` auto-push หลัง release
3. `-r <version>` ระบุ version ตรงๆ; `--major`/`--minor`/`--patch`/`--pre*` force bump; `--canary` สำหรับ canary
4. `--publish` publish ไป npm (auth ผ่าน `.npmrc`/env), `--publishTag` custom dist-tag
5. `bunx changelogen gh release` — sync GitHub releases จาก `CHANGELOG.md` โดยไม่ bump ซ้ำ
6. `--clean` บังคับ working directory clean ก่อน release
7. GitHub token: `CHANGELOGEN_TOKENS_GITHUB`, `GITHUB_TOKEN` หรือ `GH_TOKEN` — ใช้ `/follow-secret-manager`

### 5. Verify

> Goal: ยืนยัน changelog generation ทำงาน

1. รัน `bun run changelog:generate` — ตรวจ `CHANGELOG.md` output ถูกต้อง
2. ตรวจ version bump preview ด้วย `--bump` บน test branch (revert หลังตรวจ)
3. ถ้าไม่ผ่าน → ทำ `/resolve-errors` max 3 รอบ แล้ว stop report

## Rules

### 1. Conventional Commits

- format `type(scope): description`; types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `perf`
- breaking change: `feat!:` หรือ `BREAKING CHANGE:`

### 2. Monorepo

- changelogen ทำงานต่อ git repo เดียว — ไม่มี `--workspace`/`--all`; ใช้ `--dir <path>` ชี้ package ย่อย
- multi-package versioning → รัน per-package หรือใช้ `/follow-tool-changesets` แทน

### 3. Secrets

- tokens ผ่าน env เท่านั้น ห้าม commit — ใช้ `/follow-secret-manager`

- ใช้ /follow-tool-changesets ถ้าจำเป็น
- ใช้ /run-release ถ้าจำเป็น

## Expected Outcome

- `changelog.config.ts` ถูกสร้างและ parse ได้
- Scripts สำหรับ generate/bump/release พร้อมใช้
- `CHANGELOG.md` generate จาก conventional commits ถูกต้อง
