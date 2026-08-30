---
name: follow-tool-semantic-release
description: ใช้ Semantic Release สำหรับ automated version management และ package publishing
related:
  - follow-release
  - follow-tool-github-actions
  - follow-tool-changesets
  - follow-tool-git
  - follow-test
---

## Goal

ใช้งาน Semantic Release สำหรับ automated version management, changelog generation และ package publishing ตาม semantic versioning

## Scope

ใช้สำหรับ projects ที่ใช้ conventional commits และต้องการ automate release, changelog, npm/GitHub publish

## Execute

### 1. Installation

> Goal: ติดตั้ง semantic-release ใน project

1. ตรวจสอบ `package.json` และ repository URL
2. ติดตั้งด้วย `bun add -D semantic-release`
3. ติดตั้ง additional plugins ถ้าจำเป็น เช่น `bun add -D @semantic-release/changelog @semantic-release/git`
4. ดู plugin list ใน [references/semantic-release.md](references/semantic-release.md)

### 2. Configuration

> Goal: ตั้งค่า release config ตาม project needs

1. สร้าง `.releaserc` หรือ `release.config.cjs` หรือ `release` field ใน `package.json`
2. กำหนด `branches`, `tagFormat`, `plugins`
3. ตั้งค่า plugin options เช่น `changelogFile`, `assets`
4. ตรวจสอบ authentication tokens (`GITHUB_TOKEN`, `NPM_TOKEN`)
5. ดู config options ใน [references/semantic-release.md](references/semantic-release.md)

### 3. Local Dry Run

> Goal: ทดสอบ release โดยไม่ publish จริง

1. รัน `bunx semantic-release --dry-run`
2. ตรวจสอบ version ทีจะได้ และ release notes
3. แก้ไข conventional commits ถ้า version ไม่ตรงคาด
4. ใช้ `--debug` ถ้าต้องการ verbose output

### 4. CI Integration

> Goal: รัน semantic-release ใน CI/CD

1. สร้าง GitHub Actions workflow สำหรับ verify และ release
2. กำหนด permissions `contents: write`, `pull-requests: write`, `id-token: write`
3. รัน `npx semantic-release` ใน release job หลังจาก tests ผ่าน
4. ใช้ trusted publishing (OIDC) สำหรับ npm ถ้าได้
5. ดู CI example ใน [references/semantic-release.md](references/semantic-release.md)

### 5. Validate and Monitor

> Goal: ตรวจสอบว่า release ทำงานถูกต้อง

1. ตรวจสอบ version bump, git tag, GitHub release, npm package
2. ตรวจสอบ changelog ถูกอัปเดต
3. ตรวจสอบว่า publish ไม่ duplicate
4. ทำ `/follow-release` เพื่อติดตามกระบวนการ release

## Rules

### 1. Commits

- ใช้ conventional commits สำหรับทุก commit
- ตรวจสอบ commit history ก่อน release
- ใช้ `feat`, `fix`, `BREAKING CHANGE` ให้ถูกต้อง

### 2. Configuration

- ใช้ `release.config.cjs` หรือ `.releaserc` ทีชัดเจน
- ไม่ hard-code tokens หรือ secrets
- ระบุ branches ที release อนุญาต

### 3. CI/CD

- รัน release ใน CI เท่านั้น ยกเว้น local dry run
- ใช้ `dry-run` สำหรับ validate ก่อน publish
- ตั้ง permissions ให้ถูกต้อง

### 4. Publishing

- ใช้ trusted publishing ถ้าได้
- ตรวจสอบว่า package ผ่าน tests และ lint ก่อน publish
- ไม่ publish บน branch ทีไม่ได้รับอนุญาต

## References

- [CLI reference](references/cli.md)
- [References index](references/index.md)

## Expected Outcome

- Version management เป็นไปโดยอัตโนมัติ
- Changelog สร้างถูกต้อง
- GitHub release และ npm publish ทำงาน
- Release process ปลอดภัยและ reproducible
