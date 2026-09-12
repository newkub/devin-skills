---
name: follow-tool-storybook-setup-storybook
description: ติดตั้ง Storybook ด้วย CLI init และ framework detection พร้อม config พื้นฐาน
argument-hint: "[scope]"
related:
  - follow-tool-vite
  - follow-tool-vitest
  - run-verify
---

## Goal

ติดตั้ง Storybook ใน project ด้วย official CLI — framework detection, `.storybook/` config files, scripts — ให้ dev server start ได้

## Scope

ใช้สำหรับ frontend projects ที่ยังไม่มี Storybook — init, framework setup, minimal config. Addons อยู่ใน `subskills/config-addons/SKILL.md`

- ถ้า `.storybook/` มีอยู่แล้ว → verify เท่านั้น

## Execute

### 1. Check Prerequisites

> Goal: ตรวจ state ก่อน setup

1. ตรวจว่ามี `.storybook/` directory หรือ `storybook` ใน devDependencies อยู่แล้ว — ถ้ามี → skip ไป verify
2. ระบุ framework ของ project จาก `package.json` (React, Vue, Svelte, Angular, ฯลฯ) และ builder (Vite, webpack)
3. ระบุ package manager จาก lockfile

### 2. Init Storybook

> Goal: ติดตั้งด้วย CLI init

1. รัน `bun create storybook@latest` (หรือ `bunx storybook@latest init`/`create` ตาม version — ดู parent skill สำหรับคำสั่งล่าสุด)
2. CLI detect framework อัตโนมัติ — ถ้า fail ให้ระบุด้วย `--type <framework>` (ดู `storybook init --help` สำหรับ type names)
3. ตรวจสิ่งที่ CLI สร้าง: `.storybook/main.ts`, `.storybook/preview.ts`, example stories, scripts ใน `package.json`
4. ตรวจ framework package ที่ติดตั้งตรงกับ project (เช่น `@storybook/react-vite` สำหรับ React+Vite)

### 3. Verify Config Files

> Goal: ตรวจ `.storybook/` config ขั้นต่ำถูกต้อง

1. `.storybook/main.ts` — `framework`, `stories` glob ครอบคลุม source dirs จริง, `addons` array
2. `.storybook/preview.ts` — global parameters/decorators/styles
3. `staticDirs` — ถ้า project มี static assets (public/, images)
4. เพิ่ม scripts: `storybook` (dev server), `build-storybook` (static build) — ดู scripts ที่ CLI สร้างให้

### 4. Verify Run

> Goal: ยืนยัน dev server และ build ทำงาน

1. รัน dev server (`bun run storybook` หรือ script ที่ CLI สร้าง) — เปิด URL ที่แสดง ต้องเห็น example stories
2. รัน `bunx storybook build` — static build ผ่าน สร้าง `storybook-static/`
3. ถ้า fail → ทำ `/resolve-errors` max 3 รอบ แล้ว stop report

## Rules

### 1. Init

- ใช้ official CLI init เสมอ — ห้ามเขียน boilerplate เองถ้า CLI ทำได้
- ใช้ `--type` เมื่อ auto-detect ล้มเหลว
- ใช้ official framework packages เท่านั้น

### 2. Config

- `stories` glob ต้องครอบคลุม dirs ที่มี components จริง
- `.storybook/preview.ts` สำหรับ global rendering; `manager.ts` สำหรับ UI behavior

### 3. Verification

- dev server start + static build ผ่าน ก่อนถือว่า setup สำเร็จ

- ใช้ /follow-tool-vite ถ้าจำเป็น
- ใช้ /follow-tool-vitest ถ้าจำเป็น

## Expected Outcome

- Storybook ติดตั้งพร้อม framework package ที่ถูกต้อง
- `.storybook/main.ts` + `preview.ts` ถูกสร้าง
- dev server และ `build-storybook` ทำงาน
