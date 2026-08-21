---
name: follow-release-it
description: ตั้งค่า release-it สำหรับ automated releases
allowed-tools:
  - read
  - write
  - edit
  - grep
  - glob
  - exec
triggers:
  - user
  - model
related:
  - follow-open-github-secrets
  - open-env-website
---

## Goal

ตั้งค่า release-it สำหรับ automated releases ไปยัง npm

## Scope

ตั้งค่า release-it สำหรับ packages ที่ต้องการ automated releases

## Execute

### 1. Setup Package Scripts

> Goal: เพิ่ม release script ใน `package.json`
> Goal: สามารถรัน `bun run release` ได้

1. เพิ่ม script ใน `package.json`

```json
{
  "scripts": {
    "release": "release-it"
  }
}
```

### 2. Create Release-it Config

> Goal: สร้างไฟล์ config สำหรับ release-it
> Goal: config ตั้งค่า git, npm, GitHub, และ hooks ถูกต้อง

1. สร้างไฟล์ `.releaseit.json`

```json
{
  "git": {
    "commitMessage": "chore: release v${version}",
    "tagName": "v${version}",
    "requireCleanWorkingDir": false,
    "requireUpstream": false,
    "push": true,
    "commit": true,
    "tag": true
  },
  "npm": {
    "publish": true,
    "publishPath": "."
  },
  "github": {
    "release": false
  },
  "hooks": {
    "before:init": [
      "bun run pre-release"
    ],
    "after:release": [
      "echo Successfully released ${name}@${version} to npm!",
      "echo Install with: bun add ${name}"
    ]
  }
}
```

### 3. Create GitHub Workflow

> Goal: สร้าง GitHub Actions workflow สำหรับ auto release
> Goal: release อัตโนมัติเมื่อ push ไป main

1. สร้างไฟล์ `.github/workflows/release-it.yml`

```yml
name: Auto Release Every Push

on:
  push:
    branches:
      - main

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5
      - uses: oven-sh/setup-bun@v2
      - name: Auto Release
        run: release-it --ci --no-git.requireCleanWorkingDir --npm.publish
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### 4. Setup GitHub Secrets

> Goal: ตั้งค่า secrets สำหรับ npm และ GitHub
> Goal: GitHub Actions มีสิทธิ์ release และ publish package

1. ทำ `/follow-open-github-secrets`
2. ทำ `/open-env-website`
3. เพิ่ม secrets ที่จำเป็น

## Rules

### 1. Release Rules

- ใช้ `bun` แทน `npm` เสมอ
- ตรวจสอบว่ามีสิทธิ์ publish ไปยัง npm
- ตรวจสอบว่า `GITHUB_TOKEN` มีสิทธิ์เพียงพอ

## Expected Outcome

- release-it ติดตั้งและตั้งค่าเรียบร้อย
- GitHub workflow สร้างอัตโนมัติเมื่อ push ไป main branch
- Package release ไปยัง npm อัตโนมัติ
