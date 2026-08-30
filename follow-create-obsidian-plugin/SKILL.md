---
name: follow-create-obsidian-plugin
description: สร้าง Obsidian plugin ด้วย TypeScript พร้อม manifest, commands, settings
related:
  - follow-create-sdk
  - follow-create-web
  - follow-lang-typescript
  - run-test
  - update-dot-vscode
  - follow-my-tech-stack
  - review-techstack
  - report-table
---

## Goal

สร้าง Obsidian plugin project ด้วย TypeScript ทีมี manifest ถูกต้อง command, settings tab, build, และพร้อม release

## Scope

ใช้สำหรับสร้าง Obsidian desktop/mobile plugin ด้วย sample plugin หรือ setup เอง พร้อม esbuild, manifest, styles, และ GitHub release

## Execute

### 1. Review Tech Stack

> Goal: ตรวจสอบ tech stack ก่อนสร้าง

1. ทำ `/follow-my-tech-stack` เพื่อสรุป tech stack ที่ใช้
2. ทำ `/review-techstack` เพื่อ review tech stack, dependencies, และ library design
3. บันทึกเหตุผลที่เลือก stack และ libraries สำหรับ reference ต่อไป

### 2. Setup Project

> Goal: สร้างโครงสร้าง plugin

1. โคลน https://github.com/obsidianmd/obsidian-sample-plugin หรือสร้างโครงสร้างเอง
2. สร้าง `src/`, `styles.css`, `manifest.json`, `versions.json`, `package.json`, `tsconfig.json`, `esbuild.config.mjs`
3. เปลี่ยนชื่อ folder ให้ตรงกับ `id` ใน `manifest.json`
4. ติดตั้ง dependencies ด้วย `bun install` (ถ้า project ใช้ npm เป็นหลัก ให้ใช้ `npm install`)

### 3. Configure Manifest

> Goal: กำหนด plugin metadata

1. แก้ `manifest.json`:
   - `id`: unique identifier
   - `name`, `description`, `author`, `version`
   - `minAppVersion`: Obsidian version ต่ำสุด
   - `isDesktopOnly`: `false` ถ้ารองรับ mobile
2. แก้ `versions.json` ให้ map version กับ `minAppVersion`

### 4. Implement Plugin Class

> Goal: สร้าง `Plugin` subclass

1. สร้าง `src/main.ts` ด้วย `import { Plugin, Notice } from 'obsidian'`
2. สร้าง class `MyPlugin extends Plugin`
3. Implement `onload()` สำหรับ `addCommand`, `addRibbonIcon`, `addSettingTab`
4. Implement `onunload()` สำหรับ cleanup

### 5. Add Settings

> Goal: สร้าง settings tab

1. สร้าง `src/settings.ts` ด้วย `PluginSettingTab`
2. กำหนด interface สำหรับ default settings
3. ใช้ `this.loadData()` และ `this.saveData()` อ่าน/เขียน settings
4. สร้าง UI ด้วย `Setting` class

### 6. Build And Watch

> Goal: build plugin เป้น `main.js`

1. ใช้ `esbuild.config.mjs` สำหรับ compile `src/main.ts` → `main.js`
2. ตั้งค่า `external: ['obsidian', 'fs', 'path']` ใน esbuild
3. รัน `bun run dev` สำหรับ watch (ถ้า project ใช้ npm เป็นหลัก ให้ใช้ `npm run dev`)
4. ตรวจสอบ `main.js` และ `styles.css` อยู่ root

### 7. Test In Obsidian

> Goal: ทดสอบ plugin ใน vault

1. คัดลอก plugin folder ไป `vault/.obsidian/plugins/{id}/`
2. เปิด Obsidian → Settings → Community Plugins → เปิด plugin
3. ทดสอบ command, ribbon icon, settings tab
4. ใช้ `Ctrl+Shift+I` / `Cmd+Opt+I` ดู console errors

### 8. Release

> Goal: สร้าง GitHub release

1. อัปเดต `manifest.json` และ `versions.json` ด้วย version ใหม่
2. สร้าง git tag ตาม version
3. สร้าง GitHub release พร้อมแนบ `main.js`, `manifest.json`, `styles.css`
4. ทำ `/ship`

## Rules

- `id` ใน `manifest.json` ต้อง unique และตรงกับ folder name
- `manifest.json`, `main.js`, `styles.css` ต้องอยู่ root ของ release
- ใช้ `external: ['obsidian']` ใน esbuild ไม่ bundle `obsidian`
- ใช้ `loadData` / `saveData` สำหรับ settings ไม่เขียนไฟล์เอง
- ระบุ `minAppVersion` ให้ถูกต้องทุก release

- ใช้ /follow-create-sdk ถ้าจำเป็น
- ใช้ /follow-create-web ถ้าจำเป็น
- ใช้ /follow-lang-typescript ถ้าจำเป็น
- ใช้ /run-test ถ้าจำเป็น
- ใช้ /update-dot-vscode ถ้าจำเป็น
- ใช้ /report-table ถ้าจำเป็น

## Expected Outcome

- Obsidian plugin build ผ่าน `bun run build`
- Plugin โหลดใน Obsidian vault ได้
- Command, ribbon icon, settings tab ทำงาน
- Release มี `main.js`, `manifest.json`, `styles.css`
