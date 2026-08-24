---
name: follow-pkg-new
description: ตั้งค่า pkg.pr.new สำหรับ continuous preview releases
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
---

## Goal

ตั้งค่า pkg.pr.new สำหรับ continuous (preview) releases สำหรับ libraries ด้วยการ publish อัตโนมัติทุก commit และ pull request

## Scope

Use `follow-pkg-new` for the specific tasks and workflows it covers

## Execute

### 1. Install GitHub Application
> Goal: Install GitHub Application

1. ไปที่ https://github.com/apps/pkg-pr-new
2. Install application บน repository
3. ตรวจสอบ permissions ที่จำเป็น

### 2. Install Package
> Goal: Install Package

1. รัน `bun add -D pkg-pr-new`
2. หรือใช้ `bunx pkg-pr-new publish` โดยตรง

### 3. Configure Workflow
> Goal: Configure Workflow

1. สร้างไฟล์ `.github/workflows/publish.yml`

```yml
name: Publish

on:
  push:
    branches:
      - "**"
  pull_request:

permissions: {}

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v1
      - run: bun install
      - run: bun run build
      - run: bunx pkg-pr-new publish
```

2. สำหรับ monorepos

```yml
- run: bunx pkg-pr-new publish './packages/A' './packages/B'
```

3. สำหรับ approved pull requests เท่านั้น

```yml
on:
  pull_request_review:
    types: [submitted]
```

### 4. Configure Options
> Goal: Configure Options

1. สำหรับ templates

```bash
bunx pkg-pr-new publish './packages/A' --template './examples/*'
```

2. สำหรับ CLI applications

```bash
bunx pkg-pr-new publish --bin
```

3. สำหรับ custom comments

```bash
bunx pkg-pr-new publish --comment=update
```

4. สำหรับ package manager

```bash
bunx pkg-pr.new publish --packageManager=bun
```

## Rules

### 1. Installation

- ต้อง install GitHub Application ก่อนใช้งาน
- ใช้ bun แทน npm เสมอ
- รัน command เพียงครั้งเดียวต่อ workflow

### 2. Configuration

- ระบุ packages paths สำหรับ monorepos
- ใช้ patterns เช่น `./packages/*` แทนการรันหลายครั้ง
- ตั้งค่า permissions ใน workflow

### 3. Options

- `--template`: สร้าง Stackblitz instances สำหรับ examples
- `--bin`: แสดง bunx แทน npm i ใน comments
- `--comment`: update, create, หรือ off
- `--packageManager`: npm, pnpm, yarn, หรือ bun
- `--only-templates`: แสดงเฉพาะ templates ใน comments

### 4. Best Practices

- Publish approved pull requests เท่านั้นสำหรับความปลอดภัย
- ใช้ outputs สำหรับ E2E tests
- หลีกเลี่ยง publishing บน tags

## Expected Outcome

- pkg.pr.new ติดตั้งและทำงานได้
- GitHub Application install สำเร็จ
- Workflow ตั้งค่าถูกต้อง
- Preview packages publish อัตโนมัติ
- Comments ปรากฏบน pull requests
