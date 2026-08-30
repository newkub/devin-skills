---
name: follow-tool-pkg-new
description: ตั้งค่า pkg.pr.new สำหรับ continuous preview releases
related:
  - follow-tool-github-actions
  - follow-tool-release-it
  - follow-tool-semantic-release
  - follow-tool-renovate
  - follow-tool-node-modules-inspector
---

## Goal

ตั้งค่า pkg.pr.new สำหรับ continuous (preview) releases สำหรับ libraries ด้วยการ publish อัตโนมัติทุก commit และ pull request

## Scope

ใช้สำหรับ libraries บน GitHub ที่ต้องการ preview packages สำหรับทุก commit และ pull request

## Execute

### 1. Install GitHub Application

> Goal: ติดตั้ง GitHub Application บน repository

1. ไปที่ `https://github.com/apps/pkg-pr-new`
2. Install application บน repository
3. ตรวจสอบ permissions ที่จำเป็น
4. ดูรายละเอียดใน [references/pkg-new.md](references/pkg-new.md)

### 2. Install Package

> Goal: ติดตั้ง pkg-pr-new package ใน project

1. รัน `bun add -D pkg-pr-new`
2. หรือใช้ `bunx pkg-pr-new publish` โดยตรง
3. ดูรายละเอียดใน [references/pkg-new.md](references/pkg-new.md)

### 3. Configure Workflow

> Goal: สร้าง GitHub Actions workflow สำหรับ publish

1. สร้างไฟล์ `.github/workflows/publish.yml`
2. trigger บน `push` และ `pull_request`
3. รัน `bun install`, `bun run build` แล้ว `bunx pkg-pr-new publish`
4. สำหรับ monorepos ระบุ packages paths เช่น `'./packages/*'`
5. ดูรายละเอียดใน [references/pkg-new.md](references/pkg-new.md)

### 4. Configure Options

> Goal: กำหนด options สำหรับ templates, CLI และ comments

1. ใช้ `--template './examples/*'` สำหรับ StackBlitz templates
2. ใช้ `--bin` สำหรับ CLI applications
3. ใช้ `--comment=update` สำหรับ custom comments
4. ใช้ `--packageManager=bun` สำหรับ package manager ใน comments
5. ดูรายละเอียดใน [references/pkg-new.md](references/pkg-new.md)

## Rules

### 1. Installation

- ต้อง install GitHub Application ก่อนใช้งาน
- ใช้ `bun` แทน `npm` เสมอ
- รัน command เพียงครั้งเดียวต่อ workflow

### 2. Configuration

- ระบุ packages paths สำหรับ monorepos
- ใช้ patterns เช่น `./packages/*` แทนการรันหลายครั้ง
- ตั้งค่า permissions ใน workflow

### 3. Options

- `--template`: สร้าง Stackblitz instances สำหรับ examples
- `--bin`: แสดง `bunx` แทน `npm i` ใน comments
- `--comment`: `update`, `create` หรือ `off`
- `--packageManager`: `npm`, `pnpm`, `yarn` หรือ `bun`
- `--only-templates`: แสดงเฉพาะ templates ใน comments

### 4. Best Practices

- Publish approved pull requests เท่านั้นสำหรับความปลอดภัย
- ใช้ outputs สำหรับ E2E tests
- หลีกเลี่ยง publishing บน tags

- ใช้ /follow-tool-github-actions ถ้าจำเป็น
- ใช้ /follow-tool-release-it ถ้าจำเป็น
- ใช้ /follow-tool-semantic-release ถ้าจำเป็น
- ใช้ /follow-tool-renovate ถ้าจำเป็น
- ใช้ /follow-tool-node-modules-inspector ถ้าจำเป็น

## References

- [CLI reference](references/cli.md)
- [References index](references/index.md)

## Expected Outcome

- pkg.pr.new ติดตั้งและทำงานได้
- GitHub Application install สำเร็จ
- Workflow ตั้งค่าถูกต้อง
- Preview packages publish อัตโนมัติ
- Comments ปรากฏบน pull requests
