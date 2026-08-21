---
name: follow-renovate
description: ตั้งค่า Renovate สำหรับ auto update dependencies
allowed-tools:
  - read
  - edit
  - grep
  - glob
  - exec
  - write
triggers:
  - user
  - model
related:
  - renovate
---

## Goal

ตั้งค่า Renovate เพื่ออัปเดต dependencies อัตโนมัติผ่าน GitHub Actions

## Scope

ตั้งค่า Renovate สำหรับ repositories ที่ใช้ GitHub

## Execute

### 1. Setup Renovate Config

> Goal: Setup Renovate Config

1. สร้างไฟล์ `.github/renovate.json` ด้วย config พื้นฐาน
2. ตั้งค่า schedule และ automerge rules
3. ตั้งค่า extends สำหรับ base config

```json [.github/renovate.json]
{
  "$schema": "https://docs.renovatebot.com/renovate-schema.json",
  "extends": ["config:base"],
  "schedule": ["every day"],
  "docker": false,
  "platform": github,
  "repositories": ["owner/repo"],
  "packageRules": [
    {
      "matchDepTypes": ["dependencies", "devDependencies"],
      "automerge": true
    }
  ]
}
```

### 2. Setup GitHub Actions Workflow

> Goal: Setup GitHub Actions Workflow
1. สร้างไฟล์ `.github/workflows/renovate.yml`
2. ตั้งค่า schedule และ triggers
3. ตั้งค่า permissions สำหรับ contents, pull-requests, issues
4. เพิ่ม steps: checkout, setup bun, install dependencies, run renovate

```yaml [.github/workflows/renovate.yml]
name: Renovate

on:
  schedule:
    - cron: "0 2 * * *" # Every day at 2 AM UTC
  workflow_dispatch:
  push:
    branches: [main, master]
    paths:
      - ".github/renovate.json"
      - ".github/renovate.json5"
      - ".github/renovate.yml"
      - ".github/renovate.yaml"

jobs:
  renovate:
    runs-on: ubuntu-latest
    timeout-minutes: 30

    permissions:
      contents: write
      pull-requests: write
      issues: write

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Bun
        uses: oven-sh/setup-bun@v1
        with:
          bun-version: latest

      - name: Install dependencies
        run: bun install --ignore-scripts

      - name: Run Renovate
        uses: renovatebot/github-action@v39.2.4
        with:
          configurationFile: .github/renovate.json
          token: ${{ secrets.RENOVATE_TOKEN }}
        env:
          LOG_LEVEL: info
          RENOVATE_PLATFORM: github
          RENOVATE_TOKEN: ${{ secrets.RENOVATE_TOKEN }}
```

### 3. Setup RENOVATE_TOKEN

> Goal: Setup RENOVATE_TOKEN
1. สร้าง GitHub Personal Access Token ด้วย `repo` scope
2. ตั้งค่า secret ใน repository ผ่าน GitHub CLI: `gh secret set RENOVATE_TOKEN`
3. ตรวจสอบว่า workflow สามารถ access secret ได้

## Rules

### 1. Renovate Config

- ใช้ `config:base` เป็น base config (หลีกเลี่ยง config:recommended และ customManagers ที่อาจมี Node.js version check)
- ตั้งค่า `docker: false` เพื่อปิดการใช้ Docker
- ตั้งค่า `platform: github` เพื่อระบุ platform อย่างชัดเจน
- ระบุ `repositories: ["owner/repo"]` เพื่อรัน Renovate เฉพาะ repository ที่ต้องการ
- ตั้งค่า `schedule: ["every day"]` สำหรับรันทุกวัน
- ตั้งค่า `automerge: true` สำหรับ dependencies และ devDependencies

### 2. GitHub Actions Workflow

- ใช้ `cron: "0 2 * * *"` สำหรับรันทุกวันเวลา 2 AM UTC
- เพิ่ม `workflow_dispatch` สำหรับ manual trigger
- เพิ่ม `push` trigger เมื่อ renovate config เปลี่ยน
- ตั้งค่า permissions: contents write, pull-requests write, issues write
- ใช้ `renovatebot/github-action@v39.2.4`
- ใช้ `bun install --ignore-scripts` แทน `--frozen-lockfile` เพื่อ skip postinstall scripts
- ลบ `RENOVATE_AUTODISCOVER` และ `RENOVATE_AUTODISCOVER_FILTER` ออกเพราะใช้ repositories ใน config แทน

### 3. Token Management

- ใช้ GitHub Personal Access Token ด้วย `repo` scope
- ตั้งค่า secret ผ่าน GitHub CLI: `gh secret set RENOVATE_TOKEN -b "token"`
- ตรวจสอบ secret ผ่าน `gh secret list`

## Expected Outcome

- Renovate รันทุกวันเวลา 2 AM UTC หรือ manual trigger
- Dependencies อัปเดตอัตโนมัติและ auto merge
- PRs สร้างขึ้นสำหรับ dependency updates
- Lock files อัปเดตอัตโนมัติ

## Common Mistakes

- ไม่ตั้งค่า `RENOVATE_TOKEN` ทำให้ workflow fail
- ใช้ scope ไม่เพียงพอ (ต้องใช้ `repo` สำหรับ private repos)
- ไม่ตั้งค่า permissions ใน workflow ทำให้ไม่สามารถสร้าง PR ได้
- ใช้ `config:recommended` หรือ `customManagers` ที่อาจมี Node.js version check
- ไม่ตั้งค่า `docker: false` ทำให้เกิด Docker error
- ใช้ `--frozen-lockfile` ทำให้ lockfile ไม่สามารถ update ได้
