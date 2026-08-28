---
name: follow-tool-auto-it
description: ตั้งค่า Auto สำหรับ automated releases ด้วย conventional commits
related:
  - follow-secret-manager
  - follow-tool-release-it
  - follow-tool-github-actions
---

## Goal

ตั้งค่า Auto สำหรับ automated releases ด้วย conventional commits, semantic versioning และ changelog generation อัตโนมัติ

## Scope

ตั้งค่า Auto สำหรับ packages และ workspaces ที่ต้องการ automated releases

## Execute

### 1. Install Auto

> Goal: ติดตั้ง Auto CLI ใน project

1. รัน `bun add -D auto`
2. ตรวจสอบ installation สำเร็จ

### 2. Configure Auto

> Goal: ตั้งค่า Auto config พร้อม released plugin

1. เพิ่ม config ใน `package.json`

```json
{
  "scripts": {
    "release": "auto shipit"
  },
  "author": "your-name <your-email>",
  "auto": {
    "plugins": [
      "released"
    ],
    "baseBranch": "main"
  }
}
```

2. หรือสร้างไฟล์ `.autorc`

```json
{
  "plugins": [
    "released"
  ],
  "baseBranch": "main",
  "author": "your-name <your-email>"
}
```

3. Released plugin options

```json
{
  "plugins": [
    [
      "released",
      {
        "label": ":shipit:",
        "prereleaseLabel": "🚧",
        "message": "%TYPE went out with version: %VERSION",
        "lockIssues": true,
        "includeBotPrs": false
      }
    ]
  ]
}
```

Important: ต้องเพิ่ม `author` ใน package.json หรือ .autorc เพื่อให้ Auto สามารถ commit ได้

### 3. Setup GitHub Token

> Goal: ตั้งค่า GitHub token สำหรับ release automation

1. สร้าง GitHub Personal Access Token
2. เพิ่มเป็น `GH_TOKEN` ใน repository secrets
3. หรือใช้ `GITHUB_TOKEN` (ถ้าใช้ GitHub Actions)

### 4. Setup NPM Token

> Goal: ตั้งค่า NPM token สำหรับ package publishing

1. สร้าง NPM token จาก https://www.npmjs.com/settings/newkubise/tokens (Automation token)
2. เพิ่ม NPM_TOKEN ใน GitHub secrets ด้วย:
   ```bash
   gh secret set NPM_TOKEN
   ```
3. สำหรับ scoped package (@scope/package):
   - ตรวจสอบว่า scope มีใน npm หรือไม่
   - ถ้าไม่มี scope: publish ครั้งแรกใน local ด้วย `bun publish --access public`
   - ตรวจสอบ NPM_TOKEN มีสิทธิ์ publish ไปที่ scope นั้น

### 5. Create GitHub Workflow

> Goal: สร้าง GitHub workflow สำหรับ automated release
1. สร้างไฟล์ `.github/workflows/release.yml`

```yml
name: Release

on:
  push:
    branches:
      - main

permissions:
  contents: write
  pull-requests: write

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - uses: oven-sh/setup-bun@v1
      - run: bun install
      - name: Release
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
        run: bun run release
```

Important: ต้องเพิ่ม `permissions` เพื่อให้ workflow สามารถ push tags และ create releases ได้

### 6. Run Release

> Goal: รัน release และตรวจสอบผลลัพธ์
1. รัน `bun run release` (local)
2. หรือ push ไป main branch (CI/CD)
3. Auto จะ detect commits และสร้าง release/tag อัตโนมัติ

## Rules

### 1. Installation

- ใช้ bun แทน npm เสมอ
- Released plugin included กับ auto CLI โดย default
- ไม่ต้อง install @auto-it/released แยก

### 2. Configuration

- ต้องมี `author` ใน config
- ระบุ base branch (main/master)
- ใช้ conventional commits (feat:, fix:, etc.)

### 3. Authentication

- ต้องมี `GH_TOKEN` หรือ `GITHUB_TOKEN`
- ต้องมี `NPM_TOKEN` สำหรับ npm publish

### 4. Released Plugin Options

- `label`: customize label บน merged PRs
- `prereleaseLabel`: label สำหรับ prerelease branches
- `message`: custom message ด้วย %TYPE และ %VERSION
- `lockIssues`: lock issues ที่ merged ใน PRs
- `includeBotPrs`: comment บน PRs จาก bots

## Expected Outcome

- Auto ติดตั้งและทำงานได้
- Config กำหนดค่าถูกต้อง
- GitHub token พร้อมใช้งาน
- Releases สร้างอัตโนมัติตาม conventional commits
- Released plugin comment บน PRs และ issues
