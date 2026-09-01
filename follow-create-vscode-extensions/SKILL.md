---
name: follow-create-vscode-extensions
description: สร้าง VSCode extensions ด้วย TypeScript, official generator, หรือ reactive-vscode
related:
  - follow-create-bun-cli
  - follow-create-sdk
  - follow-lang-typescript
  - follow-release
  - follow-tool-vite
  - run-test
  - follow-my-tech-stack
  - review-techstack
  - report-table
---
## Goal

สร้าง VSCode extension project ด้วย TypeScript ทีมี `package.json` manifest, commands, activation events, contribution points, build, package, และ publish

## Scope

ใช้สำหรับสร้าง VSCode extension ทั่วไป รองรับทั้ง official `yo generator-code`, `reactive-vscode`, และ manual setup

## Execute

### 1. Review Tech Stack

> Goal: ตรวจสอบ tech stack ก่อนสร้าง

1. ทำ `/follow-my-tech-stack` เพื่อสรุป tech stack ที่ใช้
2. ทำ `/review-techstack` เพื่อ review tech stack, dependencies, และ library design
3. บันทึกเหตุผลที่เลือก stack และ libraries สำหรับ reference ต่อไป

### 2. Setup Project

> Goal: สร้างโครงสร้าง extension

1. ทางเลือก A: `bunx create yo generator-code` หรือ `bunx yo code`
2. ทางเลือก B: `bun create reactive-vscode` หรือ `bun add -D reactive-vscode`
3. ทางเลือก C: สร้าง `package.json`, `tsconfig.json`, `src/` เอง
4. สร้าง `src/extension.ts`, `README.md`, `CHANGELOG.md`, `.vscodeignore`

### 3. Configure Package And Manifest

> Goal: กำหนด `package.json` ตาม VSCode schema

1. ระบุ `name`, `displayName`, `description`, `version`, `publisher`
2. ระบุ `engines.vscode` เช่น `^1.90.0`
3. ระบุ `categories`, `keywords`, `activationEvents`, `main`
4. ระบุ `contributes.commands`, `menus`, `keybindings`, `configuration`
5. ระบุ `scripts` สำหรับ `compile`, `watch`, `package`, `publish`

### 4. Implement Extension

> Goal: implement extension logic

1. สร้าง `src/extension.ts` ด้วย `activate(context: vscode.ExtensionContext)`
2. register commands ด้วย `vscode.commands.registerCommand`
3. push disposables เข้า `context.subscriptions`
4. ใช้ `reactive-vscode` ถ้าเลือกทาง B

### 5. Build And Watch

> Goal: compile TypeScript

1. ติดตั้ง `esbuild` หรือ `tsc`
2. ตั้งค่า `tsconfig.json` ด้วย `strict: true`
3. รัน `bun run watch` สำหรับ dev
4. รัน `bun run compile` สำหรับ build

### 6. Test In Extension Host

> Goal: ทดสอบใน VSCode

1. เปิด project ใน VSCode
2. กด `F5` เพื่อเปิด Extension Development Host
3. ทดสอบ commands และ features
4. ตรวจสอบ Debug Console

### 7. Package And Publish

> Goal: สร้าง `.vsix` และ publish

1. ติดตั้ง `vsce` หรือ `reactive-vscode` CLI
2. รัน `bunx vsce package` เพื่อสร้าง `.vsix`
3. สร้าง publisher account ใน Marketplace
4. รัน `bunx vsce publish` หรือใช้ GitHub Actions
5. ทำ `/ship-verify-cicd`

## Rules

- ใช้ TypeScript first
- `engines.vscode` ต้องตรงกับ API ทีใช้
- ใช้ `context.subscriptions.push` สำหรับทุก disposable
- ไม่ hardcode secrets หรือ absolute paths
- `activationEvents` ต้องตรงกับ command หรือ event จริง
- ใช้ `vsce` สำหรับ package และ publish

- ใช้ /follow-create-bun-cli ถ้าจำเป็น
- ใช้ /follow-create-sdk ถ้าจำเป็น
- ใช้ /follow-lang-typescript ถ้าจำเป็น
- ใช้ /follow-release ถ้าจำเป็น
- ใช้ /follow-tool-vite ถ้าจำเป็น
- ใช้ /run-test ถ้าจำเป็น
- ใช้ /report-table ถ้าจำเป็น

## Expected Outcome

- VSCode extension build ผ่าน
- Extension ทำงานใน Extension Development Host
- `.vsix` สร้างได้
- พร้อม publish ไป VSCode Marketplace

