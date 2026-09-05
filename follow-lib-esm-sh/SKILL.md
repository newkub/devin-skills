---
name: follow-lib-esm-sh
description: ใช้ esm.sh CDN สำหรับโหลด ES Modules บน browser โดยไม่ต้อง bundler
argument-hint: "[scope]"
related:
  - follow-lib-js-delivr
  - follow-lib-jspm
  - follow-lib-animejs
  - follow-lib-arktype
  - follow-lib-better-auth
  - follow-best-practice
  - use-my-packages-on-registry
  - setup-cicd
---

## Goal

ใช้ `esm.sh` CDN โหลด `ES Modules` จาก `npm`, `JSR`, `GitHub` และ `pkg.pr.new` บน `browser`, `Deno` หรือ `Node.js` โดยไม่ต้อง `bundler`

## Scope

ใช้สำหรับการ `import` modules ผ่าน `HTTPS URL` พร้อม `tree-shaking`, `bundling`, `dependency rewriting` และ `import maps` อัตโนมัติ

## Execute

### 1. Import Modules

> Goal: โหลด ES Modules ผ่าน `esm.sh`

1. ใช้ URL format `https://esm.sh/{package}@{version}/{subpath}`
2. รองรับ `npm` (default), `JSR` (`/jsr/`), `GitHub` (`/gh/`) และ `pkg.pr.new` (`/pr/`)
3. ตัวอย่าง:
   - `import React from 'https://esm.sh/react@19.2.4'`
   - `import { encodeBase64 } from 'https://esm.sh/jsr/@std/encoding@1.0.0/base64'`
   - `import tslib from 'https://esm.sh/gh/microsoft/tslib@v2.8.0'`

### 2. Configure Dependencies And Build Options

> Goal: ควบคุม dependencies และ build options

1. ใช้ `?deps=PACKAGE@VERSION,PACKAGE2@VERSION` เพื่อ lock version ของ dependencies
2. ใช้ `?external=PACKAGE` หรือ prefix `*` เช่น `https://esm.sh/*react-dom` เพื่อกำหนด external dependencies ทั้งหมด
3. ใช้ `?alias=PACKAGE:ALIAS` เพื่อเปลี่ยน package ที่ resolve เช่น `?alias=react:preact/compat`
4. ใช้ `?bundle=false` เมื่อต้องการปิด default bundling, `?standalone` เพื่อ bundle ทุก dependency (ยกเว้น `peerDependencies`)
5. ใช้ `?exports=a,b` เพื่อ `tree-shaking` เฉพาะ exports ที่ต้องการ
6. ใช้ `?dev` สำหรับ development build, `?target=es2022` สำหรับ build target, `?conditions=...` สำหรับ conditional exports

### 3. Use Import Maps

> Goal: ใช้ bare specifiers กับ `import maps`

1. สร้าง `<script type="importmap">` แล้ว map specifier ไปยัง `esm.sh` URL
2. สำหรับ trailing slash ให้เปลี่ยน `?` เป็น `&` หลัง version เช่น `https://esm.sh/react-dom@19.2.4&dev/`
3. ใช้ `?external` ร่วมกับ `import maps` เพื่อให้ `browser` resolve dependency เอง

### 4. Use Advanced Features

> Goal: ใช้ฟีเจอร์เสริมของ `esm.sh` ตามความเหมาะสม

1. ใช้ `?worker` เพื่อโหลด module เป็น `Web Worker`
2. ใช้ `?css` เพื่อ import `CSS` ที่ package import ใน JS
3. ใช้ `?raw` หรือ `https://raw.esm.sh/<PATH>` เพื่อดึง source file โดยไม่ transform
4. ใช้ `?no-dts` เพื่อปิด `TypeScript` type declarations ใน `Deno`
5. ใช้ `esm.sh/run` (`<script type="module" src="https://esm.sh/run"></script>`) สำหรับ `JSX/TSX` ใน HTML โดยไม่ build (experimental)

### 5. Ensure Stability

> Goal: รักษาความเสถียรของ production

1. Pin version เสมอ เช่น `https://esm.sh/react@19.2.4` แทน `latest` หรือ bare package
2. ตั้งแต่ build v136 ระบบไม่ใช้ build version prefix (`/v135/...`) และ `?pin` ถูก ignore
3. ทดสอบ URL ใน `browser` หรือ `Deno` ก่อน deploy
4. ติดตาม changelog ที่ `https://github.com/esm-dev/esm.sh/releases`

## Rules

- ใช้ URL format `https://esm.sh/{package}@{version}/{subpath}`
- ใช้ `?deps` สำหรับ lock version ของ dependencies
- ใช้ `?external` หรือ prefix `*` สำหรับ external dependencies
- ใช้ `?bundle=false` เมื่อ bundling ทำให้เกิด duplicate shared modules
- ใช้ `?exports` เพื่อ `tree-shaking` เฉพาะส่วนที่ใช้
- Pin version ทุก URL สำหรับ production
- ใช้ `&` แทน `?` เมื่อต้องการ query params กับ trailing slash
- ใช้ `?target` สำหรับกำหนด ES target
- ใช้ `?dev` สำหรับ development build เท่านั้น
- ใช้ `?no-dts` หาก type declaration จาก CDN ทำให้ `Deno` ตรวจ type ผิด

- ใช้ `/follow-lib-js-delivr` ถ้าต้องการ `multi-CDN`
- ใช้ `/follow-lib-jspm` ถ้าต้องการ `import maps package manager`
- ใช้ `/follow-lib-animejs` ถ้าจำเป็น
- ใช้ `/follow-lib-arktype` ถ้าจำเป็น
- ใช้ `/follow-lib-better-auth` ถ้าจำเป็น
- ใช้ `/follow-best-practice` ถ้าจำเป็น
- ใช้ `/use-my-packages-on-registry` ถ้าจำเป็น
- ใช้ `/setup-cicd` ถ้าจำเป็น

## Expected Outcome

- โหลด `ES Modules` ได้โดยไม่ต้อง `bundler`
- `Bundle size` ลดลงด้วย `tree-shaking` และ `?exports`
- `Dependency resolution` ชัดเจนและเสถียรด้วย version pinning
- `Development workflow` ง่ายขึ้นด้วย `import maps` และ `?dev`
