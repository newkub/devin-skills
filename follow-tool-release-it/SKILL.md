---
name: follow-tool-release-it
description: ตั้งค่า release-it สำหรับ automated version bump, tag และ npm publish
related:
  - follow-secret-manager
  - follow-tool-semantic-release
  - follow-tool-changesets
  - follow-tool-github-actions
  - follow-tool-pkg-new
  - follow-lang-nodejs
  - open-web-for-config-secret
---

## Goal

ตั้งค่า `release-it` สำหรับ automated releases ไปยัง npm และ GitHub

## Scope

ใช้สำหรับ Node.js projects ที่ต้องการ version bump, git tag, changelog, npm publish และ GitHub release แบบ automated

## Execute

### 1. Install

> Goal: ติดตั้ง release-it ใน project

1. รัน `bun add -D release-it`
2. เพิ่ม script ใน `package.json`: `"release": "release-it"`
3. ยืนยันด้วย `bunx release-it --version`
4. ดูรายละเอียดใน [references/release-it.md](references/release-it.md)

### 2. Configure

> Goal: สร้าง config สำหรับ release-it

1. สร้าง `.release-it.json` ที่ project root
2. ตั้งค่า `git`, `npm`, `github` และ `hooks` ตาม project policy
3. ใช้ `requireCleanWorkingDir: false` เฉพาะเมื่อ CI รันโดยไม่ต้อง clean working dir
4. ดูรายละเอียดใน [references/release-it.md](references/release-it.md)

### 3. Manual Release

> Goal: รัน release ใน local หรือ CI

1. รัน `bun run release` สำหรับ interactive mode
2. รัน `bun run release --ci` สำหรับ non-interactive mode
3. ใช้ `major`, `minor`, `patch` หรือ `--release-version` เพื่อควบคุม version
4. ดูรายละเอียดใน [references/release-it.md](references/release-it.md)

### 4. GitHub Actions Workflow

> Goal: รัน release อัตโนมัติเมื่อ push ไป main

1. สร้าง `.github/workflows/release.yml`
2. ใช้ `/follow-secret-manager` เพื่อจัดการ `NPM_TOKEN` และ `GITHUB_TOKEN` secrets หรือ `/open-web-for-config-secret` เพื่อเปิด URLs สร้าง tokens
3. ใช้ `actions/checkout@v4` และ `oven-sh/setup-bun@v1`
4. รัน `bun install` แล้ว `bun run release --ci`
5. ดูรายละเอียดใน [references/release-it.md](references/release-it.md)

### 5. Plugins

> Goal: ขยาย release-it ด้วย plugins

1. ใช้ `@release-it/conventional-changelog` สำหรับ auto changelog
2. ใช้ `@release-it/bumper` สำหรับ custom manifest files
3. ใช้ `@release-it/keep-a-changelog` สำหรับ maintain `CHANGELOG.md`
4. ดูรายละเอียดใน [references/release-it.md](references/release-it.md)

## Rules

### 1. Safety

- ตรวจสอบสิทธิ์ publish ไปยัง npm ก่อนรัน release
- ใช้ `requireCleanWorkingDir: true` สำหรับ local release
- ตั้งค่า `NPM_TOKEN` และ `GITHUB_TOKEN` เป็น repository secrets

### 2. CI

- ใช้ `--ci` ใน GitHub Actions เพื่อปิด interactive prompts
- ใช้ `fetch-depth: 0` ใน `actions/checkout` เพื่อให้มมีประวัติทั้งหมด
- ไม่รัน release บน pull request

### 3. Versioning

- ใช้ conventional commits หรือ bump type ที่ถูกต้อง
- ตรวจสอบ `package.json` version ก่อน release
- ใช้ `--no-npm.publish` สำหรับ test run ถ้าจำเป็น

### 4. Secrets

- ไม่ hard-code tokens ใน config หรือ workflow
- ใช้ `/follow-secret-manager` เพื่อจัดการ `NPM_TOKEN` และ `GITHUB_TOKEN`
- ใช้ `/open-web-for-config-secret` เพื่อเปิด URLs สร้าง API keys
- ใช้ `secrets.NPM_TOKEN` และ `secrets.GITHUB_TOKEN` ผ่าน GitHub Actions
- ถ้าจำเป็น ใช้ `gh secret set` สำหรับตั้งค่าผ่าน CLI

- ใช้ /follow-tool-semantic-release ถ้าจำเป็น
- ใช้ /follow-tool-changesets ถ้าจำเป็น
- ใช้ /follow-tool-github-actions ถ้าจำเป็น
- ใช้ /follow-tool-pkg-new ถ้าจำเป็น
- ใช้ /follow-lang-nodejs ถ้าจำเป็น

## References

- [CLI reference](references/cli.md)
- [References index](references/index.md)

## Expected Outcome

- `release-it` ติดตั้งและตั้งค่าใน project
- `bun run release` ทำงานได้ทั้ง local และ CI
- Version, tag, npm publish และ GitHub release เกิดขึ้นอัตโนมัติ
- Secrets และ permissions ตั้งค่าถูกต้อง
- Plugins ทีต้องการทำงานตาม config
