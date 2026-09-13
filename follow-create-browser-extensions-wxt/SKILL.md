---
name: follow-create-browser-extensions-wxt
description: "สร้าง browser extensions ด้วย WXT + Manifest V3 บน Chrome, Firefox, Edge"
argument-hint: "[scope]"
related:
  - follow-tasks
  - follow-lang-typescript
  - follow-tool-github-actions
  - run-dev
---

## Goal

ตั้งค่าและพัฒนา Web Extensions ด้วย WXT framework ตาม best practices

## Scope

- รวม capability จาก skills เดิมที่ถูก merge เข้าตัวนี้ (merged from: follow-create-browser-extensions-wxt, follow-create-browser-extensions-wxt)

ใช้สำหรับสร้าง ปรับปรุง และ release Web Extensions ด้วย WXT รองรับ TypeScript และ Bun

- สร้าง WXT project ด้วย template ทีเหมาะสม
- ตั้งค่า manifest, permissions, และ build
- แยก pure logic ออกจาก browser API integration
- ตั้งค่า CI/CD สำหรับ release ไป Chrome Web Store

- Latest: `wxt@0.21.4` (verified 2026-09-12)

## Execute

### 1. Initialize Project

> Goal: เริ่มต้น WXT project ด้วย template ทีเหมาะสม

1. ทำ `/follow-tasks` เพื่อตั้งค่า scripts มาตรฐาน
2. รัน `bunx wxt@latest init` เพื่อเริ่มต้นโปรเจกต์
3. เลือก template ที่ต้องการ (vanilla, react, vue, svelte, solid)
4. ติดตั้ง dependencies ด้วย `bun install`
5. ยืนยัน `bun run dev` ทำงานได้ (dev mode มี HMR และเปิด browser window อัตโนมัติ)

### 2. Configure WXT

> Goal: กำหนดค่า `wxt.config.ts` และ manifest

1. แก้ไข `wxt.config.ts` ตาม requirements ด้วย `defineConfig()`
2. กำหนด manifest ผ่าน `manifest` option ใน `wxt.config.ts` (permissions และ host permissions)
3. ตั้งค่า `srcDir` (default `.`) และ `outDir` (default `.output`) ถ้าต้องการ
4. ถ้าต้องการ TypeScript configuration ให้ทำ `/follow-lang-typescript`
5. ตรวจสอบ `wxt.config.ts` ไม่มี invalid paths

### 3. Structure Extension

> Goal: สร้างโครงสร้าง extension ตาม WXT file-based entrypoints ทีแยก concerns ชัดเจน

1. สร้าง `entrypoints/background.ts` สำหรับ background script (export default `defineBackground()`)
2. สร้าง `entrypoints/content.ts` สำหรับ content script (export default `defineContentScript()`)
3. สร้าง `entrypoints/popup/` สำหรับ popup UI (index.html + main script)
4. แยก pure logic ไว้ใน `utils/` (auto-imported) หรือ `lib/`
5. สร้าง browser API wrappers ใน `services/` หรือ `utils/`
6. ให้ background/content/popup เรียกใช้ wrappers เท่านั้น
7. ถ้าใช้ `srcDir: "src"` → entrypoints ย้ายไป `src/entrypoints/`

### 4. Setup CI/CD

> Goal: ตั้งค่า GitHub Actions สำหรับ build และ release

1. ทำ `/follow-tool-github-actions` เพื่อตั้งค่า CI/CD
2. ใช้ built-in `wxt submit` สำหรับ automated publishing (รัน `bunx wxt submit init` เพื่อสร้าง `.env.submit` — เพิ่ม `.env.submit` ใน `.gitignore`)
3. สร้าง `.github/workflows/release.yml` ทีรัน `wxt zip` + `wxt submit` (ใช้ `chrome-webstore-upload-cli` เฉพาะเมื่อต้องการ upload เฉยๆ แยกจาก submit)
4. ตั้งค่า GitHub Secrets สำหรับ stores ที target (ดู Rules §5)
5. ยืนยัน workflow syntax ถูกต้อง

### 5. Build And Release

> Goal: Build production และ release

1. รัน `bun run build` เพื่อ build production ไป `.output/`
2. รัน `bunx wxt zip` (และ `wxt zip -b firefox` สำหรับ Firefox — สร้าง `*-firefox.zip` + `*-sources.zip`)
3. ทดสอบ submission ด้วย `bunx wxt submit --dry-run` ก่อน release จริง
4. Trigger GitHub Actions workflow
5. ตรวจสอบ store status (Chrome Web Store, Firefox AMO, Edge Add-ons)

## Rules

### 1. Project Structure

```text
project/
├── entrypoints/
│   ├── background.ts    # defineBackground()
│   ├── content.ts       # defineContentScript()
│   └── popup/           # index.html + main.ts
├── utils/               # auto-imported pure logic
├── services/            # browser API wrappers
├── public/              # copied as-is
├── .github/workflows/
├── wxt.config.ts
└── package.json
```

- Directories `utils/`, `composables/`, `components/`, `hooks/` ถูก auto-import โดย WXT
- ใช้ `srcDir: "src"` ได้ — entrypoints จะอยู่ที่ `src/entrypoints/`

### 2. Separation Of Concerns

- แยก pure logic จาก browser API integration
- Pure logic อยู่ใน `utils/` หรือ `lib/`
- Browser API wrappers อยู่ใน `services/`
- Background/content/popup scripts เรียกใช้ wrappers เท่านั้น

### 3. Manifest Configuration

- กำหนด permissions ขั้นต่ำทีจำเป็น
- ใช้ host permissions แทน `<all_urls>` หากเป็นไปได้
- Version ต้อง follow semantic versioning
- Name และ description ต้องชัดเจน
- ใช้ Manifest V3 สำหรับ Chrome/Edge — WXT build Firefox เป็น MV2 โดย default (`wxt build -b firefox` → `.output/firefox-mv2`) (ดู `references/browser-extension-manifest.md`)

### 4. Build Configuration

- ใช้ Bun สำหรับ reproducible builds
- `outDir` default คือ `.output/` — เปลี่ยนเฉพาะเมื่อจำเป็น
- Enable TypeScript strict mode
- Enable auto-imports สำหรับ composables/utils

### 5. CI/CD Requirements

- GitHub Actions workflow สำหรับ release
- ใช้ `wxt submit` สำหรับ upload + submit review (Chrome, Firefox, Edge)
- Secrets ต้องมี: `CHROME_EXTENSION_ID`, `CHROME_CLIENT_ID`, `CHROME_CLIENT_SECRET`, `CHROME_REFRESH_TOKEN` (+ `FIREFOX_EXTENSION_ID`, `FIREFOX_JWT_ISSUER`, `FIREFOX_JWT_SECRET` ถ้า target Firefox; `EDGE_PRODUCT_ID`, `EDGE_CLIENT_ID`, `EDGE_CLIENT_SECRET` สำหรับ Edge)
- ใช้ `CHROME_SKIP_SUBMIT_REVIEW=true` ถ้าต้องการ upload โดยไม่ submit review
- Workflow ต้อง trigger ด้วย `workflow_dispatch`

### 6. Development Best Practices

- ใช้ `bun run dev` สำหรับ development mode
- ใช้ TypeScript สำหรับ type safety
- เขียน tests สำหรับ pure logic
- ใช้ ESLint และ Prettier สำหรับ code quality
- ใช้ /run-dev ถ้าจำเป็น

## Expected Outcome

- WXT project ติดตั้งและทำงานได้
- Extension structure ถูกต้องตาม best practices
- CI/CD workflow สามารถ release ไป Chrome Web Store ได้
- Code มี type safety และ quality สูง
