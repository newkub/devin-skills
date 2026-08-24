---
name: follow-vscode-extensions
description: สร้าง VSCode extension ด้วย reactive-vscode
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

สร้าง VSCode extension ด้วย `reactive-vscode` และโครงสร้างที่ถูกต้อง

## Scope

ใช้สำหรับ project ที่ต้องการสร้าง VSCode extension

## Execute

### 1. Setup

> Goal: ติดตั้ง dependency และสร้างโครงสร้างไฟล์
> Goal: มี dependency และโครงสร้างไฟล์ที่ถูกต้อง

1. ติดตั้ง: `bun add -d reactive-vscode`
2. สร้างโครงสร้างไฟล์:

```text
packages/
    .vscode/
    src/
    test/
    .gitignore
    .vscodeignore
    README.md
    package.json
    tsconfig.json
```

### 2. Configure Package

> Goal: เพิ่ม scripts สำหรับ package และ publish
> Goal: package.json มี scripts ครบ

1. เพิ่ม `"package": "vsce package"` ใน scripts
2. เพิ่ม `"publish": "vsce publish"` ใน scripts

### 3. Follow Related

> Goal: ทำตาม workflows ที่เกี่ยวข้อง
> Goal: ใช้งานร่วมกับ workflows อื่นได้

1. ทำ `/follow-bun` สำหรับ runtime
2. ทำ `/follow-nuxt` ถ้าต้องใช้

## Rules

- ใช้ `reactive-vscode` สำหรับ extension development
- ใช้ `vsce` สำหรับ package และ publish
- โครงสร้างไฟล์ตามที่กำหนดใน Execute step 1

## Expected Outcome

- Extension ติดตั้ง dependency ครบ
- โครงสร้างไฟล์ถูกต้อง
- `package.json` มี scripts สำหรับ package และ publish
