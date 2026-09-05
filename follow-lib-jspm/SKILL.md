---
name: follow-lib-jspm
description: ใช้ JSPM CLI จัดการ import maps และ CDN สำหรับ native ES modules
related:
  - follow-lib-esm-sh
  - follow-lib-js-delivr
  - follow-lib-animejs
  - follow-lib-arktype
  - follow-lib-better-auth
  - follow-best-practice
  - use-my-packages-on-registry
  - setup-cicd
---

## Goal

ใช้ `JSPM CLI` สำหรับจัดการ `import maps`, `ES modules` และ `CDN resolution` บน `browser` โดยไม่ต้อง `bundler`

## Scope

ใช้สำหรับ native `ES modules`, `import maps`, `zero config builds`, `TypeScript type stripping`, `hot module reloading` และ `CDN provider` integration (`jspm.io`, `esm.sh`, `jsdelivr`, `unpkg`, `nodemodules`)

## Execute

### 1. Install

> Goal: ติดตั้ง `JSPM CLI`

1. ติดตั้ง `JSPM` globally ด้วย `npm install -g jspm` หรือเรียกผ่าน `npx jspm`
2. ตรวจสอบ version ด้วย `jspm --version`
3. สำหรับ `mise` ให้ลอง `mise use -g npm:jspm` ก่อนหาก environment รองรับ

### 2. Initialize Project

> Goal: เริ่มต้น project

1. รัน `jspm init my-project` เพื่อสร้าง project ใหม่
2. หรือรัน `jspm init` ใน directory ว่างเพื่อเริ่มต้น `current directory`
3. ตรวจสอบ `package.json` มี `"type": "module"` และ `exports` กำหนด entry point
4. `importmap.js` จะถูกสร้างเมื่อรัน `jspm serve` หรือ `jspm install`

### 3. Start Development Server

> Goal: เริ่ม `development server`

1. รัน `jspm serve` สำหรับ `development server` ที่ default port `5776`
2. ใช้ `jspm serve --static` หากต้องการ `static server` โดยไม่มี `hot reload` และ `auto install`
3. ใช้ `jspm serve -p 3000` เพื่อกำหนด port
4. แก้ไข `src/index.ts` หรือ `src/index.js` แล้ว `importmap.js` จะอัปเดตอัตโนมัติเมื่อเพิ่ม dependency

### 4. Manage Dependencies

> Goal: จัดการ dependencies ด้วย `import maps`

1. รัน `jspm install` เพื่อสร้างหรืออัปเดต `importmap.js` จาก `package.json` `exports` และ `dependencies`
2. ใช้ `jspm install -C production` เพื่อสลับเป็น `production` conditions
3. ใช้ `jspm install --integrity` เพื่อเพิ่ม `integrity` attribute ใน `import map`
4. ใช้ `jspm install --preload` เพื่อเพิ่ม `modulepreload` links
5. ใช้ `jspm install --provider esm.sh` (หรือ `jsdelivr`, `unpkg`, `nodemodules`) เพื่อเปลี่ยน `CDN provider`
6. ใช้ `--map` เพื่อระบุ input map และ `--out` เพื่อระบุ output file

### 5. Build For Production

> Goal: สร้าง `production build`

1. รัน `jspm build` สำหรับ `zero config` production build
2. ใช้ `jspm build --output dist` เพื่อกำหนด output directory
3. รัน `jspm install --dir dist -C production --integrity --preload -o app.html` เพื่อสร้าง `import map` พร้อม `preload` สำหรับ build output
4. ตรวจสอบ `dist/` มี `importmap.js` หรือ `app.html` ที่ resolve ถูกต้อง

### 6. Apply Best Practices

> Goal: ใช้ patterns และ best practices

1. กำหนด `exports` ใน `package.json` เพื่อให้ `JSPM` รู้จัก entry points
2. ใช้ conditional environment ด้วย `-C production` หรือ `-C development`
3. ใช้ `jspm install --release` เพื่อ enable `flatten-scopes`, `combine-subpaths` และ `production` conditions ในครั้งเดียว
4. ศึกษา docs ที่ `https://jspm.org/docs/cli` และ `https://jspm.org/getting-started`

## Rules

- ใช้ `npm install -g jspm` หรือ `npx jspm` สำหรับ installation
- ใช้ `jspm init my-project` สำหรับสร้าง project ใหม่
- ใช้ `jspm serve` สำหรับ development server
- ใช้ `jspm serve --static` หากไม่ต้องการ `hot reload`
- ใช้ `jspm install` สำหรับสร้าง/อัปเดต `importmap.js`
- ใช้ `jspm build` สำหรับ production build
- ใช้ `-C production` สำหรับ production mappings
- ใช้ `--integrity` สำหรับ `subresource integrity`
- ใช้ `--provider {jspm.io|esm.sh|jsdelivr|unpkg|nodemodules}` สำหรับเลือก `CDN provider`
- ใช้ `backticks` สำหรับ `commands`, `files` และ `URLs`
- ใช้ `code blocks` สำหรับ examples

- ใช้ `/follow-lib-esm-sh` ถ้าต้องการ `ESM CDN`
- ใช้ `/follow-lib-js-delivr` ถ้าต้องการ `multi-CDN`
- ใช้ `/follow-lib-animejs` ถ้าจำเป็น
- ใช้ `/follow-lib-arktype` ถ้าจำเป็น
- ใช้ `/follow-lib-better-auth` ถ้าจำเป็น
- ใช้ `/follow-best-practice` ถ้าจำเป็น
- ใช้ `/use-my-packages-on-registry` ถ้าจำเป็น
- ใช้ `/setup-cicd` ถ้าจำเป็น

## Expected Outcome

- `ES modules` ที่ native และ efficient
- `Import maps` ที่ configured อย่างถูกต้องและอัปเดตอัตโนมัติ
- `Development` ที่ fast ด้วย `hot reloading` และ `TypeScript type stripping`
- `Production build` ที่พร้อมใช้งานด้วย `integrity` และ `preload`
- `CDN integration` ที่ seamless ผ่าน `provider` switching
