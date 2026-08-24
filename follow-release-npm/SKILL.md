---
name: follow-release-npm
description: ตั้งค่า Auto สำหรับ automated releases ไปยัง npm
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
  - follow-pkg-new
---

## Goal

ตั้งค่า Auto สำหรับ automated releases ไปยัง npm ด้วย conventional commits และ semantic versioning

## Scope

Use `follow-release-npm` for the specific tasks and workflows it covers

## Execute

### 1. Setup Package Configuration

> Goal: Setup Package Configuration

1. ตรวจสอบ package.json มีข้อมูลครบถ้วน
2. ตั้งค่า private เป็น false
3. เพิ่ม publishConfig.access เป็น public
4. เพิ่ม author ใน package.json

### 2. Install Auto

> Goal: Install Auto

1. รัน `bun add -D auto`
2. ตรวจสอบ installation สำเร็จ

### 3. Configure Auto

> Goal: Configure Auto

1. เพิ่ม config ใน package.json
2. เพิ่ม script release: `auto shipit`
3. ตั้งค่า baseBranch เป็น main
4. เพิ่ม released plugin

### 4. Setup Authentication

> Goal: Setup Authentication

1. สร้าง NPM token จาก https://www.npmjs.com/settings/newkubise/tokens (Automation token)
2. เพิ่ม NPM_TOKEN ใน GitHub secrets ด้วย:
   ```bash
   gh secret set NPM_TOKEN
   ```
3. ใช้ GITHUB_TOKEN สำหรับ GitHub Actions
4. สำหรับ scoped package (@scope/package):
   - ตรวจสอบว่า scope มีใน npm หรือไม่
   - ถ้าไม่มี scope: publish ครั้งแรกใน local ด้วย `bun publish --access public`
   - ตรวจสอบ NPM_TOKEN มีสิทธิ์ publish ไปที่ scope นั้น

### 5. Create GitHub Workflow

> Goal: Create GitHub Workflow
1. สร้างไฟล์ .github/workflows/release.yml
2. เพิ่ม permissions: contents write, pull-requests write
3. เพิ่ม environment variables: GH_TOKEN, NPM_TOKEN
4. ตั้งค่า trigger บน push ไป main branch

## Rules

### 1. Package Configuration

- ต้องมี name, description, version, author
- private ต้องเป็น false
- publishConfig.access ต้องเป็น public
- ต้องมี author ใน config

### 2. Installation

- ใช้ bun แทน npm เสมอ
- Released plugin included กับ auto CLI

### 3. Configuration

- ต้องมี author ใน config
- ระบุ base branch (main/master)
- ใช้ conventional commits (feat:, fix:, etc.)

### 4. Authentication

- ต้องมี GH_TOKEN หรือ GITHUB_TOKEN
- ต้องมี NODE_AUTH_TOKEN สำหรับ npm publish
- ต้องมี permissions ใน workflow

## Expected Outcome

- Auto ติดตั้งและทำงานได้
- Config กำหนดค่าถูกต้อง
- GitHub token พร้อมใช้งาน
- Releases สร้างอัตโนมัติตาม conventional commits
- Package release ไปยัง npm อัตโนมัติ
