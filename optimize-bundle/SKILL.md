---
name: optimize-bundle
description: วิเคราะห์และปรับปรุง bundle size, build time, chunks และ output ก่อน build production
argument-hint: "[app-or-package]"
related:
  - optimize-codebase-everything
  - optimize-assets
  - optimize-network
  - follow-tool-vite
  - follow-tool-build-packages
  - run-build
  - run-clean
  - run-typecheck
  - review-delivery
  - resolve-errors
  - report-table
  - report-ansi
---

## Goal

ลด bundle size, build time และ warning ก่อน build production โดยตรวจสอบ build configuration, chunks, dependencies และ output ตาม ecosystem ของ project

## Scope

ใช้กับ project ที่ใช้ Vite / Rolldown / esbuild / Webpack หรือ bundler ใดก็ตาม โดยเฉพาะ monorepo ที่มี apps/packages หลายตัว, Cloudflare Workers และ SPA/SSR

## Execute

### 1. Inspect Build Configuration

> Goal: เข้าใจ build config ก่อนปรับ

1. อ่าน `package.json` scripts ที่เกี่ยวกับ build, dev, deploy
2. อ่าน `vite.config.*`, `vite.shared.*`, `tsup.config.*`, `wrangler.jsonc`, `turbo.json` ที่มีอยู่
3. ระบุ framework: Solid, React, Vue, Nuxt, TanStack Start หรืออื่น
4. ระบุ output target: Cloudflare Workers, Pages, SPA, SSR, library หรือ CLI

### 2. Analyze Bundle Output

> Goal: รู้ว่า output มีปัญหาอะไร

1. รัน `bun run build` หรือ `bunx vite-bundle-visualizer`
2. วัด `dist/` size ด้วย `du -sh dist` หรือ PowerShell equivalent
3. ค้นหา chunks ที่ใหญ่เกิน 500 kB หรือ 1 MB และ duplicate vendor modules

### 3. Check Manual Chunks

> Goal: กระจาย chunks อย่างเหมาะสม

1. ตรวจ `manualChunks` ใน `vite.config.*` — vendor ต้องแยกจาก app code
2. แยก large libraries เป็น chunk ของตัวเอง (`tanstack`, `solid-js`, `router`, `lib`)
3. แนะนำ chunk ใหม่ถ้าพบ library ใหญ่หลายชื่อรวมกัน

### 4. Check Dynamic Imports And Tree Shaking

> Goal: โหลดเฉพาะ code ที่จำเป็น

1. ใช้ `import()` สำหรับ heavy components และ route-based code splitting
2. ลบ unused exports และลด barrel files — ใช้ named imports แทน `import *`
3. ตรวจ `sideEffects` ใน `package.json`

### 5. Check Externalization And Pre-bundling

> Goal: ไม่ให้ server-only modules หลุดไป client bundle

1. ค้นหา warning `Module "fs" has been externalized for browser compatibility`
2. ตรวจ `ssr.noExternal`, `ssr.external`, `resolve.alias` สำหรับ node builtins
3. ตรวจ `optimizeDeps.include`/`exclude`; Vite 8 + Rolldown ใช้ `optimizeDeps.rolldownOptions` แทน `esbuildOptions`

### 6. Check Minification, Sourcemaps And Assets

> Goal: output production-ready และ debuggable

1. ตรวจ `build.minify`, `build.sourcemap`, `build.cssMinify`
2. ตรวจ `assetsInlineLimit`, icons, fonts, images ใน `public/` และ `src/`
3. แนะนำ compression (brotli/gzip) ผ่าน plugin ถ้าขาด

### 7. Apply Safe Optimizations

> Goal: แก้ config โดยไม่พัง behavior

1. แก้ `vite.config.*` หรือ `vite.shared.*` ตาม findings
2. อัปเดต `wrangler.jsonc` `build.command` ให้สอดคล้องกับ `build` script
3. ทำ `bun install` ถ้ามีการเปลี่ยน deps

### 8. Re-measure And Report

> Goal: ยืนยันว่าปรับแล้วดีขึ้น

1. รัน `/run-build` อีกครั้ง วัด `dist/` size, build time, chunk count
2. ทำ `/report-table` เปรียบเทียบ before/after
3. ทำ `/report-ansi` สรุป recommendations ที่ยังค้าง

## Rules

### 1. Safe Changes

- ไม่ลด feature code หรือ business logic — รักษา runtime behavior
- ไม่ disable `sourcemap` หรือ minify โดยไม่จำเป็น
- ไม่ split เกินจำเป็น; ทุกการแก้ไขต้อง build และ test ผ่าน

### 2. Ecosystem Aware

- Vite 8 + Rolldown: ใช้ `optimizeDeps.rolldownOptions` แทน `esbuildOptions`
- Cloudflare Workers: ใช้ `wrangler deploy --dry-run` สำหรับ build validation
- Bun: ใช้ `mise x -- bunx vite build` เมื่อ proto shim ทำให้ Node วน loop
- Solid/TanStack: ระวัง Solid transform, router codegen, server functions

### 3. Reporting

- บันทึก before/after size, build time, chunk count
- ระบุ warning ที่ fix แล้วและที่ยังคงอยู่ พร้อม file/line ที่แก้ไข

- ใช้ /optimize-codebase-everything ถ้าจำเป็น
- ใช้ /optimize-assets ถ้าจำเป็น
- ใช้ /optimize-network ถ้าจำเป็น
- ใช้ /follow-tool-vite ถ้าจำเป็น
- ใช้ /follow-tool-build-packages ถ้าจำเป็น
- ใช้ /run-clean ถ้าจำเป็น
- ใช้ /run-typecheck ถ้าจำเป็น
- ใช้ /review-delivery ถ้าจำเป็น
- ใช้ /resolve-errors ถ้าจำเป็น

## Expected Outcome

- Bundle size ลดลงหรืออยู่ใน threshold ที่ยอมรับได้
- Build time ลดหรือคงที่ ไม่มี duplicate vendors
- Browser/Node externalization warnings ลดลง
- `dist/` output พร้อมสำหรับ production deploy โดยไม่มี regression
