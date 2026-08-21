---
name: follow-release-vscode
description: ตั้งค่า VS Code extensions สำหรับ automated releases
allowed-tools:
  - read
  - edit
  - grep
  - glob
  - exec
triggers:
  - user
  - model
---

## Goal

## Goal

ตั้งค่า VS Code extensions สำหรับ automated releases ไปยัง VS Code Marketplace

## Scope

Use `follow-release-vscode` for the specific tasks and workflows it covers

## Execute

## Execute

### 1. Setup Package Configuration

1. ตรวจสอบ package.json มีข้อมูลครบถ้วน
2. เพิ่ม publisher ใน package.json
3. เพิ่ม version, displayName, description
4. เพิ่ม repository, bugs, homepage
5. ตั้งค่า engines.vscode

### 2. Install VSCE

1. รัน `bun add -D @vscode/vsce`
2. ตรวจสอบ installation สำเร็จ
3. หรือใช้ `npm install -g @vscode/vsce`

### 3. Setup Publisher

1. สร้าง publisher บน marketplace.visualstudio.com
2. ตั้งค่า publisher name
3. เพิ่ม publisher ใน package.json

### 4. Setup Authentication

1. สร้าง PAT token จาก Azure DevOps
2. เพิ่ม VSCE_PAT ใน environment variables
3. หรือใช้ `vsce login publisher-name`

### 5. Create GitHub Workflow

1. สร้างไฟล์ .github/workflows/release.yml
2. เพิ่ม permissions: contents write
3. เพิ่ม environment variables: VSCE_PAT
4. ตั้งค่า trigger บน push ไป main branch

## Rules

## Rules

### 1. Package Configuration

- ต้องมี publisher, name, version, displayName
- ต้องมี description, engines.vscode
- ต้องมี repository และ homepage
- ต้องมี categories และ keywords

### 2. Installation

- ใช้ bun หรือ npm สำหรับ vsce
- ใช้ @vscode/vsce package
- ตรวจสอบ version compatibility

### 3. Configuration

- ต้องมี publisher ที่ valid
- ต้องตั้งค่า engines.vscode ให้ถูกต้อง
- ใช้ semantic versioning

### 4. Authentication

- ต้องมี VSCE_PAT หรือ login
- token ต้องมีสิทธิ์ publish
- ต้องมี permissions ใน workflow

## Expected Outcome

## Expected Outcome

- VSCE ติดตั้งและทำงานได้
- Config กำหนดค่าถูกต้อง
- Publisher พร้อมใช้งาน
- VSCE_PAT token พร้อมใช้งาน
- Extension publish ไปยัง Marketplace อัตโนมัติ
