---
name: follow-tool-changelogen
description: สร้าง changelog และจัดการ releases ด้วย changelogen
argument-hint: "[scope]"
related:
  - fix
  - refactor
  - run-release
---

## Goal

ใช้ changelogen สำหรับสร้าง changelog และจัดการ releases อัตโนมัติ

## Scope

ใช้สำหรับ projects ที่ต้องการ automated changelog generation และ release management

- Latest: `changelogen@0.6.2` (verified 2026-09-12)

## Execute

### 1. Configure Changelogen

> Goal: สร้าง `changelog.config.ts` สำหรับ project

ตั้งค่า changelogen สำหรับ project — config โหลดผ่าน c12 จาก `changelog.config.{ts,js,mjs,cjs}`, `changelog.config.json`, `.changelogrc` หรือ field `changelog` ใน `package.json`

1. สร้าง `changelog.config.ts` ใน root พร้อม `defineConfig` จาก `changelogen`
2. ตั้งค่า `types` (commit type → title + semver bump) และ `scopeMap` (map scope → display name)
3. ตั้งค่า `output` ถ้าต้องการ custom changelog path (default `CHANGELOG.md`)
4. ตั้งค่า `templates` (commitMessage, tagMessage, tagBody), `excludeAuthors` และ `publish` ตามต้องการ

### 2. Setup Package Scripts

> Goal: เพิ่ม scripts สำหรับ changelog ใน `package.json`

เพิ่ม scripts ลงใน `package.json`

1. เพิ่ม `"changelog": "bunx changelogen@latest --release"` สำหรับ full release
2. เพิ่ม `"changelog:version": "bunx changelogen@latest --bump"` สำหรับ version bump
3. เพิ่ม `"changelog:generate": "bunx changelogen@latest"` สำหรับ generate only

### 3. Generate Changelog

> Goal: สร้าง changelog จาก git commits

สร้าง changelog จาก git commits

1. รัน `bun run changelog` สำหรับ full release
2. รัน `bun run changelog:version` สำหรับ bump version เท่านั้น
3. รัน `bun run changelog:generate` สำหรับ generate changelog เท่านั้น
4. ตรวจสอบ `CHANGELOG.md` ที่สร้าง

### 4. Review And Commit

> Goal: ตรวจสอบและ commit changelog ที่สร้าง

ตรวจสอบและ commit changelog

1. ตรวจสอบ version bump ถูกต้อง
2. ตรวจสอบ changelog format ถูกต้อง
3. Commit และ push ไปยัง remote

## Rules

### 1. Conventional Commits

ใช้ conventional commits สำหรับ changelog generation

- ใช้ format: `type(scope): description`
- Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `perf`
- ใช้ breaking change indicator: `feat!:` หรือ `BREAKING CHANGE:`
- ใช้ scopes สำหรับ categorization ใน monorepos

### 2. Configuration

ตั้งค่า changelogen ให้เหมาะสมกับ project

- ใช้ `changelog.config.ts` สำหรับ TypeScript projects (ชื่อ config คือ `changelog` ไม่ใช่ `changelogen`)
- ตั้งค่า `types` สำหรับ custom commit types
- ตั้งค่า `scopeMap` สำหรับ map commit scope → display name
- ตั้งค่า `repo` ถ้า auto-detect จาก `package.json` ไม่ได้

### 3. Version Management

จัดการ semantic versioning อย่างถูกต้อง

- ใช้ `--bump` สำหรับ version bump เท่านั้น
- ใช้ `--release` สำหรับ full release (bump + changelog + git commit + tag + GitHub release)
- ปิด sub-steps ของ release ด้วย `--no-commit`, `--no-tag`, `--no-github`
- ใช้ `--push` สำหรับ auto-push หลัง release
- ระบุ version ตรงๆ ด้วย `-r <version>` หรือ force bump ด้วย `--major` / `--minor` / `--patch` / `--pre*` flags
- ใช้ `--canary` สำหรับ canary release (เท่ากับ `--bump --versionSuffix`)

### 4. Monorepo Support

changelogen ทำงานต่อ git repository เดียว — ไม่มี `--workspace`/`--all` flags

- ใช้ `--dir <path>` เพื่อชี้ไปยัง package ย่อยใน monorepo
- ใช้ `scopeMap` เพื่อ group commits ตาม scope ใน changelog
- สำหรับ multi-package versioning ให้รัน per-package หรือใช้ `/follow-tool-changesets` แทน

### 5. Release Automation

ใช้ automation สำหรับ release workflow

- ใช้ `--release` สำหรับ automated release — sync GitHub release อัตโนมัติเมื่อ repo อยู่บน GitHub
- ตั้งค่า `CHANGELOGEN_TOKENS_GITHUB`, `GITHUB_TOKEN` หรือ `GH_TOKEN` สำหรับ GitHub releases (ถ้าไม่มี token จะเปิด browser link ให้สร้างเอง)
- ใช้ `--publish` สำหรับ publish ไป npm (auth ผ่าน `.npmrc` หรือ env) และ `--publishTag` สำหรับ custom dist-tag
- ใช้ `bunx changelogen gh release` เพื่อ sync GitHub releases จาก `CHANGELOG.md` โดยไม่ bump ซ้ำ
- ใช้ `--clean` เพื่อบังคับ working directory ต้อง clean ก่อน release

## References

- [CLI reference](references/cli.md)

- ใช้ /run-release ถ้าจำเป็น

## Expected Outcome

- Changelog สร้างอัตโนมัติจาก conventional commits
- Version bump ถูกต้องตาม semantic versioning
- Release workflow ทำงานอัตโนมัติ
- Monorepo support ทำงานได้อย่างถูกต้อง
