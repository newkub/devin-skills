---
name: follow-wxt
description: ตั้งค่าและพัฒนา Web Extensions ด้วย WXT framework ตาม best practices
allowed-tools:
  - read
  - write
  - edit
  - grep
  - glob
  - exec
  - ask_user_question
triggers:
  - user
  - model
related: []
---
## Goal

ตั้งค่าและพัฒนา Web Extensions ด้วย WXT framework ตาม best practices

## Scope

ใช้สำหรับสร้าง ปรับปรุง และ release Web Extensions ด้วย WXT รองรับ TypeScript และ Bun

- สร้าง WXT project ด้วย template ทีเหมาะสม
- ตั้งค่า manifest, permissions, และ build
- แยก pure logic ออกจาก browser API integration
- ตั้งค่า CI/CD สำหรับ release ไป Chrome Web Store

## Execute

### 1. Initialize Project

> Goal: เริ่มต้น WXT project ด้วย template ทีเหมาะสม
> Goal: มี project structure พร้อม dependencies

1. ทำ `/follow-tasks` เพื่อตั้งค่า scripts มาตรฐาน
2. รัน `bunx wxt init` เพื่อเริ่มต้นโปรเจกต์
3. เลือก template ที่ต้องการ (vanilla, react, vue)
4. ติดตั้ง dependencies ด้วย `bun install`
5. ยืนยัน `bun run dev` ทำงานได้

### 2. Configure WXT

> Goal: กำหนดค่า `wxt.config.ts` และ manifest
> Goal: WXT build ถูกต้องตาม requirements

1. แก้ไข `wxt.config.ts` ตาม requirements
2. กำหนด manifest permissions และ host permissions
3. ตั้งค่า `srcDir` และ `outDir`
4. ถ้าต้องการ TypeScript configuration ให้ทำ `/follow-typescript`
5. ตรวจสอบ `wxt.config.ts` ไม่มี invalid paths

### 3. Structure Extension

> Goal: สร้างโครงสร้าง extension ทีแยก concerns ชัดเจน
> Goal: code อ่านง่าย ทดสอบได้ และ maintain ได้

1. สร้าง `src/background.ts` สำหรับ background script
2. สร้าง `src/content.ts` สำหรับ content script
3. สร้าง `src/popup/` สำหรับ popup UI
4. แยก pure logic ไว้ใน `src/lib/`
5. สร้าง browser API wrappers ใน `src/services/`
6. ให้ background/content/popup เรียกใช้ wrappers เท่านั้น

### 4. Setup CI/CD

> Goal: ตั้งค่า GitHub Actions สำหรับ build และ release
> Goal: สามารถ release extension ไป Chrome Web Store อัตโนมัติ

1. ทำ `/follow-github-actions` เพื่อตั้งค่า CI/CD
2. ติดตั้ง `chrome-webstore-upload-cli` ด้วย `bun add -D`
3. สร้าง `.github/workflows/chrome-release.yml`
4. ตั้งค่า GitHub Secrets สำหรับ Chrome Web Store
5. ยืนยัน workflow syntax ถูกต้อง

### 5. Build And Release

> Goal: Build production และ release
> Goal: extension พร้อมใช้งานบน Chrome Web Store

1. รัน `bun run build` เพื่อ build production
2. ตรวจสอบ `dist/` directory
3. Trigger GitHub Actions workflow
4. ตรวจสอบ Chrome Web Store status

## Rules

### 1. Project Structure

```text
project/
├── src/
│   ├── background.ts
│   ├── content.ts
│   ├── popup/
│   ├── lib/
│   └── services/
├── .github/workflows/
├── wxt.config.ts
└── package.json
```

### 2. Separation Of Concerns

- แยก pure logic จาก browser API integration
- Pure logic อยู่ใน `src/lib/`
- Browser API wrappers อยู่ใน `src/services/`
- Background/content/popup scripts เรียกใช้ wrappers เท่านั้น

### 3. Manifest Configuration

- กำหนด permissions ขั้นต่ำทีจำเป็น
- ใช้ host permissions แทน `<all_urls>` หากเป็นไปได้
- Version ต้อง follow semantic versioning
- Name และ description ต้องชัดเจน

### 4. Build Configuration

- ใช้ Bun สำหรับ reproducible builds
- ตั้งค่า `outDir` เป็น `dist/`
- Enable TypeScript strict mode
- Enable auto-imports สำหรับ composables

### 5. CI/CD Requirements

- GitHub Actions workflow สำหรับ release
- ใช้ `chrome-webstore-upload-cli` สำหรับ upload
- Secrets ต้องมี: `EXTENSION_ID`, `CHROME_CLIENT_ID`, `CHROME_CLIENT_SECRET`, `CHROME_REFRESH_TOKEN`
- Workflow ต้อง trigger ด้วย `workflow_dispatch`

### 6. Development Best Practices

- ใช้ `bun run dev` สำหรับ development mode
- ใช้ TypeScript สำหรับ type safety
- เขียน tests สำหรับ pure logic
- ใช้ ESLint และ Prettier สำหรับ code quality

## Expected Outcome

- WXT project ติดตั้งและทำงานได้
- Extension structure ถูกต้องตาม best practices
- CI/CD workflow สามารถ release ไป Chrome Web Store ได้
- Code มี type safety และ quality สูง
