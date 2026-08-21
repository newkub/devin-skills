---
name: follow-wxt
description: ตั้งค่าและพัฒนา Web Extensions ด้วย WXT framework ตาม best practices
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

ตั้งค่าและพัฒนา Web Extensions ด้วย WXT framework ตาม best practices

## Scope

Use `follow-wxt` for the specific tasks and workflows it covers

## Execute

## Execute

### 1. Initialize Project

1. ทำ `/tasks` เพื่อตั้งค่า scripts มาตรฐาน
2. รัน `bunx wxt init` เพื่อเริ่มต้นโปรเจกต์
3. เลือก template ที่ต้องการ (vanilla, react, vue)
4. ติดตั้ง dependencies ด้วย `bun install`

### 2. Configure WXT

1. แก้ไข `wxt.config.ts` ตาม requirements
2. กำหนด manifest permissions และ host permissions
3. ตั้งค่า `srcDir` และ `outDir`
4. เพิ่ม TypeScript configuration หากจำเป็น

### 3. Structure Extension

1. สร้าง `src/background.ts` สำหรับ background script
2. สร้าง `src/content.ts` สำหรับ content script
3. สร้าง `src/popup/` สำหรับ popup UI
4. แยก pure logic ไว้ใน `src/lib/`
5. สร้าง browser API wrappers ใน `src/services/`

### 4. Setup CI/CD

1. ทำ `/follow-github-actions` เพื่อตั้งค่า CI/CD
2. ติดตั้ง `chrome-webstore-upload-cli` ด้วย `bun add -D`
3. สร้าง `.github/workflows/chrome-release.yml`
4. ตั้งค่า GitHub Secrets สำหรับ Chrome Web Store

### 5. Build And Release

1. รัน `bun run build` เพื่อ build production
2. ตรวจสอบ `dist/` directory
3. Trigger GitHub Actions workflow
4. ตรวจสอบ Chrome Web Store

## Rules

## Rules

### 1. Project Structure

โครงสร้างโปรเจกต์ต้องเป็นไปตามนี้:

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

- กำหนด permissions ขั้นต่ำที่จำเป็น
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

## Expected Outcome

- WXT project ติดตั้งและทำงานได้
- Extension structure ถูกต้องตาม best practices
- CI/CD workflow สามารถ release ไป Chrome Web Store ได้
- Code มี type safety และ quality สูง
