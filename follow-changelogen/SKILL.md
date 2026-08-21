---
name: follow-changelogen
description: สร้าง changelog และจัดการ releases ด้วย changelogen
allowed-tools:
  - read
  - edit
  - grep
  - glob
  - exec
triggers:
  - user
  - model
---

## Goal

ใช้ changelogen สำหรับสร้าง changelog และจัดการ releases อัตโนมัติ

## Scope

ใช้สำหรับ projects ที่ต้องการ automated changelog generation และ release management

## Execute

### 1. Configure Changelogen

ตั้งค่า changelogen สำหรับ project

1. สร้าง `changelogen.config.ts` ใน root
2. ตั้งค่า `types`, `scopes`, `headers`
3. ตั้งค่า `versionResolver` สำหรับ monorepos
4. ตั้งค่า `changelogFile` ถ้าต้องการ custom path

### 2. Setup Package Scripts

เพิ่ม scripts ลงใน `package.json`

1. เพิ่ม `"changelog": "bunx changelogen@latest --release"` สำหรับ full release
2. เพิ่ม `"changelog:version": "bunx changelogen@latest --bump"` สำหรับ version bump
3. เพิ่ม `"changelog:generate": "bunx changelogen@latest"` สำหรับ generate only

### 3. Generate Changelog

สร้าง changelog จาก git commits

1. รัน `bun run changelog` สำหรับ full release
2. รัน `bun run changelog:version` สำหรับ bump version เท่านั้น
3. รัน `bun run changelog:generate` สำหรับ generate changelog เท่านั้น
4. ตรวจสอบ `CHANGELOG.md` ที่สร้าง

### 4. Review And Commit

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

- ใช้ `changelogen.config.ts` สำหรับ TypeScript projects
- ตั้งค่า `types` สำหรับ custom commit types
- ตั้งค่า `scopes` สำหรับ monorepo packages
- ใช้ `versionResolver` สำหรับ Turborepo integration

### 3. Version Management

จัดการ semantic versioning อย่างถูกต้อง

- ใช้ `--bump` สำหรับ version bump เท่านั้น
- ใช้ `--release` สำหรับ full release (bump + changelog + git)
- ใช้ `--no-git` สำหรับ skip git operations
- ใช้ `--push` สำหรับ auto-push หลัง release

### 4. Monorepo Support

ใช้ changelogen กับ monorepos อย่างถูกต้อง

- ตั้งค่า `versionResolver` สำหรับ workspace packages
- ใช้ `--workspace` สำหรับ specific package
- ใช้ `--all` สำหรับ all workspaces
- ตั้งค่า `group` สำหรับ package grouping

### 5. Release Automation

ใช้ automation สำหรับ release workflow

- ใช้ `--release` สำหรับ automated release
- ตั้งค่า `GITHUB_TOKEN` สำหรับ GitHub releases
- ใช้ `--dry` สำหรับ dry-run mode
- ตั้งค่า `NPM_TOKEN` สำหรับ NPM publishing

## Expected Outcome

- Changelog สร้างอัตโนมัติจาก conventional commits
- Version bump ถูกต้องตาม semantic versioning
- Release workflow ทำงานอัตโนมัติ
- Monorepo support ทำงานได้อย่างถูกต้อง
