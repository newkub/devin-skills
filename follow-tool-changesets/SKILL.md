---
name: follow-tool-changesets
description: ตั้งค่า Changesets สำหรับ versioning และ changelog management ใน monorepo
---

## Goal

ตั้งค่า Changesets สำหรับจัดการ versioning, changelogs และ package publishing ใน monorepo อย่างเป็นระบบ

## Scope

ตั้งค่า Changesets สำหรับ monorepos และ workspaces

## Execute

### 1. Install Changesets

> Goal: Install Changesets

1. รัน `bun add -D @changesets/cli`
2. รัน `bunx changeset init`

### 2. Configure Changesets

> Goal: Configure Changesets

1. แก้ไข `.changeset/config.json`
2. ตั้งค่า base branch, access, และ updateInternalDependencies
3. กำหนดค่า access token สำหรับ publishing

```json [.changeset/config.json]
{
  "$schema": "https://unpkg.com/@changesets/config@3.0.0/schema.json",
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

> Goal: Setup GitHub Actions
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
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v1
      - run: bun install
      - name: Create Release Pull Request or Publish
        uses: changesets/action@v1
        with:
          version: bun changeset version
          publish: bun changeset publish
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```

### 4. Create Changesets

> Goal: Create Changesets
1. รัน `bunx changeset` เพื่อสร้าง changeset file
2. เลือก packages และระบุ changeset type (major, minor, patch)
3. เขียน description สำหรับ changelog

### 5. Publish

> Goal: Publish
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

- ใช้ changesets/action@v1 สำหรับ GitHub Actions
- ตั้งค่า version และ publish commands
- ใช้ concurrency เพื่อป้องกัน conflicts

## Expected Outcome

- Changesets ติดตั้งและทำงานได้
- Config กำหนดค่าถูกต้อง
- GitHub Actions workflow พร้อมใช้งาน
- Versioning และ publishing ทำงานอัตโนมัติ
