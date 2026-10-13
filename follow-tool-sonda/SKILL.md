---
name: follow-tool-sonda
description: ตั้งค่า Sonda bundle analyzer วิเคราะห์ bundle จริงผ่าน source maps
argument-hint: "[scope]"
related:
  - report-bundle
  - run-build
  - follow-tool-vite
  - optimize-bundle
---

## Goal

ตั้งค่าและใช้ Sonda เพื่อ analyze และ visualize bundle ของ bundler/framework ที่ project ใช้ — treemap, dependency tree, compression sizes และ JSON report สำหรับ automation

## Scope

ใช้สำหรับ JS/TS projects ที่ bundle ด้วย Vite, Rollup, Rolldown, esbuild, webpack, Rspack หรือ frameworks (Next.js, Nuxt, Astro, SvelteKit, Angular CLI)

- Boundary: Sonda วิเคราะห์ source maps ของ final output — ต้องเปิด sourcemaps ใน build config; ถ้าเป้าหมายคือ inspect `node_modules` ทั้ง tree → `/follow-tool-node-modules-inspector`
- ใช้ใน `/report-bundle` เพื่อได้ per-asset และ per-dependency sizes จาก report จริง แทน `du` estimate
- Latest: `sonda@0.14.0` (verified 2026-10-03)

## Execute

### 1. Install And Enable Sourcemaps

> Goal: ติดตั้ง sonda และเปิด source maps

1. ติดตั้ง `bun add -D sonda`
2. เปิด sourcemaps ใน build config (เช่น `build.sourcemap: true` ใน `vite.config.ts`) — Sonda ทำงานจาก final source maps
3. ถ้า report ไม่ครบ ตรวจ plugins อื่นว่า generate source maps ด้วย

### 2. Register Plugin

> Goal: ผูก Sonda เข้า bundler หรือ framework ที่ใช้

1. เลือก entry point ตาม bundler: `sonda/vite`, `sonda/rollup`, `sonda/rolldown`, `sonda/esbuild`, `sonda/webpack`, `sonda/rspack`
2. Framework integrations มี entry เฉพาะ (Next.js, Nuxt, Astro, SvelteKit, Angular CLI) — ดู official docs ต่อ framework
3. Vite ตัวอย่าง:

   ```ts
   import { defineConfig } from 'vite'
   import Sonda from 'sonda/vite'

   export default defineConfig({
     build: { sourcemap: true },
     plugins: [Sonda()],
   })
   ```

4. ดู options ทั้งหมดใน [API reference](references/apis.md)

### 3. Configure Options

> Goal: ตั้ง report ให้ตรง use case

1. `format: ['html', 'json']` — html สำหรับ interactive treemap, json สำหรับ automation/CI
2. `gzip: true`, `brotli: true` — รายงาน compressed sizes (เพิ่มเวลา build)
3. `deep: true` — แตก dependencies เป็น source files ต้นทางผ่าน source maps ของพวกมัน
4. `sources: true` — embed source code ใน report (ระวัง proprietary code เวลา share)
5. `open: false` สำหรับ CI; `outputDir`/`filename` กำหนดปลายทาง report (default `.sonda/`, `sonda_[index]`)

### 4. Generate And Read Report

> Goal: ได้ข้อมูล bundle จริงจาก report

1. รัน build ตามปกติผ่าน `/run-build` — Sonda generate report ทุกครั้ง
2. เปิด `.sonda/sonda_*.html` — treemap per asset, dependency tree, deep view, inspect code
3. ใช้ JSON format เป็น input ให้ `/report-bundle` tables และ CI assertions

## Rules

### 1. Sourcemaps Required

- ไม่มี source maps → ไม่มี report; เปิดใน build config ก่อนใช้เสมอ
- Vite: CSS files ไม่มี source maps → CSS ไม่อยู่ใน report (upstream limitation, vitejs/vite#2830)

### 2. Performance

- เปิดเฉพาะ options ที่จำเป็น — `deep`, `sources`, `gzip`, `brotli` เพิ่ม build time และ report size
- CI ใช้ `format: 'json'` + `open: false`

### 3. Privacy

- `sources: true` embed source code ใน report — ห้าม share report ถ้าโค้ด proprietary

- ใช้ /report-bundle ถ้าจำเป็น
- ใช้ /run-build ถ้าจำเป็น
- ใช้ /follow-tool-vite ถ้าจำเป็น
- ใช้ /optimize-bundle ถ้าจำเป็น

## References

- [API and config options](references/apis.md)

- ดู best-practices/ สำหรับ recommended patterns และ pitfalls

## Expected Outcome

- Sonda plugin ผูกกับ bundler/framework และ sourcemaps เปิด
- Build ทุกครั้งได้ HTML/JSON report ใน `.sonda/`
- มี treemap, dependency tree, compressed sizes พร้อมใช้ใน `/report-bundle` และ CI
