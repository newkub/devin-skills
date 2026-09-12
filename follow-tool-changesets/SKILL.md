---
name: follow-tool-changesets
description: ตั้งค่า Changesets สำหรับ versioning และ changelog management ใน monorepo
argument-hint: "[scope]"
related:
  - use-agent-browser
  - use-astgrep
  - follow-tool-aube
  - follow-tool-usage
  - follow-best-practice
  - setup-cicd
---

## Goal

ตั้งค่า Changesets สำหรับจัดการ versioning, changelogs และ package publishing ใน monorepo อย่างเป็นระบบ

## Scope

ตั้งค่า Changesets สำหรับ monorepos และ workspaces

- Latest: `@changesets/cli@3.0.2` (verified 2026-09-12) — `changesets/action@v2` (v2.1.1), `actions/checkout@v7`, `oven-sh/setup-bun@v2`

## Execute

### Subskills

| Topic | Subskill |
|-------|----------|
| Init, `.changeset/` flow, version/publish commands | `subskills/setup-changesets/SKILL.md` |
| `config.json`, `fixed`/`linked` packages, access | `subskills/config-changesets/SKILL.md` |

### 1. Install Changesets

> Goal: ติดตั้ง Changesets CLI และ init config

1. รัน `bun add -D @changesets/cli`
2. รัน `bunx changeset init`

### 2. Configure Changesets

> Goal: ตั้งค่า `.changeset/config.json` ให้เหมาะสม

1. แก้ไข `.changeset/config.json`
2. ตั้งค่า base branch, access, และ updateInternalDependencies
3. กำหนดค่า access token สำหรับ publishing

```json [.changeset/config.json]
{
  "$schema": "https://unpkg.com/@changesets/config@4.0.0/schema.json",
  "changelog": "@changesets/cli/changelog",
  "commit": false,
  "fixed": [],
  "linked": [],
  "access": "restricted",
  "baseBranch": "main",
  "updateInternalDependencies": "patch",
  "ignore": []
}
```

### 3. Setup GitHub Actions

> Goal: สร้าง GitHub Actions workflow สำหรับ release
1. สร้าง `.github/workflows/release.yml`
2. กำหนดค่า GITHUB_TOKEN และ NPM_TOKEN
3. ตั้งค่า version และ publish commands

```yml [.github/workflows/release.yml]
name: Release

on:
  push:
    branches:
      - main

concurrency: ${{ github.workflow }}-${{ github.ref }}

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
      - uses: oven-sh/setup-bun@v2
      - run: bun install
      - name: Create Release Pull Request or Publish
        uses: changesets/action@v2
        with:
          version-script: bun changeset version
          publish-script: bun changeset publish
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```

### 4. Create Changesets

> Goal: สร้าง changeset file สำหรับการเปลี่ยนแปลง
1. รัน `bunx changeset` เพื่อสร้าง changeset file
2. เลือก packages และระบุ changeset type (major, minor, patch)
3. เขียน description สำหรับ changelog

### 5. Publish

> Goal: publish packages ผ่าน Changesets
1. Merge release PR ที่สร้างโดย GitHub Actions
2. หรือรัน `bunx changeset publish` ด้วยตนเอง
3. Changesets จะ version และ publish packages อัตโนมัติ

## Rules

### 1. Installation

- ใช้ `bun add -D @changesets/cli` สำหรับติดตั้ง
- รัน `bunx changeset init` เพื่อ initialize

### 2. Configuration

- ต้องมี base branch (default: main)
- ตั้งค่า access (restricted สำหรับ scoped packages)
- ตั้งค่า updateInternalDependencies เป็น patch

### 3. Authentication

- ต้องมี GITHUB_TOKEN สำหรับ GitHub operations
- ต้องมี NPM_TOKEN สำหรับ npm publishing

### 4. Workflow

- ใช้ changesets/action@v2 สำหรับ GitHub Actions — v2 ต้อง pair กับ Changesets CLI v3 (CLI v2 ใช้ action@v1)
- ใช้ inputs `version-script` และ `publish-script` (v2 เปลี่ยนชื่อจาก `version`/`publish`)
- ใช้ concurrency เพื่อป้องกัน conflicts

- ใช้ /use-agent-browser ถ้าจำเป็น
- ใช้ /use-astgrep ถ้าจำเป็น
- ใช้ /follow-tool-aube ถ้าจำเป็น
- ใช้ /follow-tool-usage ถ้าจำเป็น
- ใช้ /follow-best-practice ถ้าจำเป็น
- ใช้ /setup-cicd ถ้าจำเป็น

## References

- [CLI reference](references/cli.md)


## Expected Outcome

- Changesets ติดตั้งและทำงานได้
- Config กำหนดค่าถูกต้อง
- GitHub Actions workflow พร้อมใช้งาน
- Versioning และ publishing ทำงานอัตโนมัติ

