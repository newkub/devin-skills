---
name: optimize-bundling
description: วิเคราะห์และปรับปรุง bundle size, build time, และ output ก่อนรัน build production
related:
  - run-build
  - review-delivery
  - run-typecheck
  - resolve-errors
  - run-clean
  - report-table
  - report-ansi
  - follow-tool-build-packages
  - follow-framework-solidjs
  - follow-lib-esm-sh
---

## Goal

ลด bundle size, build time, และ warning ก่อน build production โดยตรวจสอบ build configuration, dependencies, และ output ตาม ecosystem ของ project

## Scope

ใช้กับ project ที่ใช้ Vite / Rolldown / esbuild / Webpack หรือ bundler ใดก็ตาม โดยเฉพาะ monorepo ที่มี apps/packages หลายตัว, Cloudflare Workers, และ SPA/SSR

## Execute

### 1. Inspect Build Configuration

> Goal: เข้าใจ build config ก่อนปรับ

1. อ่าน `package.json` scripts ที่เกี่ยวกับ build, dev, deploy
2. อ่าน `vite.config.*`, `vite.shared.*`, `tsup.config.*`, `wrangler.jsonc`, `turbo.json` ที่มีอยู่
3. ระบุ framework: Solid, React, Vue, Nuxt, TanStack Start, หรืออื่น
4. ระบุ output target: Cloudflare Workers, Pages, SPA, SSR, library, หรือ CLI

### 2. Analyze Bundle Output

> Goal: รู้ว่า output มีปัญหาอะไร

1. รัน `bun run build` หรือ build command ที่กำหนด ถ้ายังไม่เคย
2. วัด `dist/` size ด้วย `du -sh dist` หรือ PowerShell equivalent
3. นับจำนวน chunks และ size ของ entry chunks
4. ค้นหา chunks ทีใหญ่เกิน 500 kB หรือ 1 MB
5. ตรวจซ้ำซ้อน: `node_modules` ปรากฏใน client chunks หลายชื่อ, duplicate vendor modules

### 3. Check Manual Chunks

> Goal: กระจาย chunks อย่างเหมาะสม

1. ตรวจ `manualChunks` ใน `vite.config.*` หรือ `vite.shared.*`
2. ตรวจว่า vendor ถูกแยกออกจาก app code หรือไม่
3. ตรวจว่า large libraries ถูก split เป็น chunk ของตัวเองหรือไม่ (`tanstack`, `solid-js`, `router`, `lib`)
4. แนะนำ chunk ใหม่ถ้าพบ library ใหญ่หลายชื่อรวมกัน

### 4. Check Browser/Node Externalization

> Goal: ไม่ให้ server-only modules หลุดไป client bundle

1. ค้นหา warning `Module "fs" has been externalized for browser compatibility`
2. ตรวจ `ssr.noExternal` หรือ `ssr.external` ถ้ามี
3. ตรวจ `resolve.alias` สำหรับ node builtins ใน client
4. แนะนำ `resolve.alias` หรือ `optimizeDeps.exclude` สำหรับ `postgres`, `ioredis`, `pdfkit`, `node:crypto` ฯลฯ

### 5. Check Dependency Pre-bundling

> Goal: ลด cold start ของ dev และ build

1. ตรวจ `optimizeDeps.include` และ `optimizeDeps.exclude`
2. ย้าย deps ทีถูก externalize ผิดไปยัง `exclude` ถ้าจำเป็น
3. เปลี่ยน `optimizeDeps.esbuildOptions` ไป `optimizeDeps.rolldownOptions` ถ้า Vite 8 + Rolldown

### 6. Check Minification And Sourcemaps

> Goal: output production-ready และ debuggable

1. ตรวจ `build.minify` และ `build.sourcemap`
2. ตรวจ `build.cssMinify`
3. แนะนำเปิด `sourcemap` สำหรับ production เฉพาะถ้า observability ต้องการ
4. ตรวจว่า minification ใช้ `esbuild` หรือ `terser` ตาม compatibility

### 7. Check Static Assets

> Goal: ลดขนาด assets

1. ตรวจ `assetsInlineLimit`
2. ตรวจ icons, fonts, images ใน `public/` และ `src/`
3. แนะนำ compression, brotli, gzip ผ่าน plugin ถ้าขาด
4. ตรวจ `manifest.webmanifest`, favicons, apple-touch-icon

### 8. Apply Safe Optimizations

> Goal: แก้ config โดยไม่พัง behavior

1. แก้ `vite.config.*` หรือ `vite.shared.*` ตาม findings
2. แก้ `package.json` build scripts ถ้าจำเป็น เช่น `mise x -- bunx vite build` แทน `bunx --bun vite build`
3. อัปเดต `wrangler.jsonc` `build.command` ให้สอดคล้องกับ package `build` script
4. ทำ `bun install` ถ้ามีการเปลี่ยน deps

### 9. Re-measure And Report

> Goal: ยืนยันว่าปรับแล้วดีขึ้น

1. ทำ `bun run build` อีกครั้ง
2. วัด `dist/` size, build time, chunk count
3. รัน `/report-table` เปรียบเทียบ before/after
4. รัน `/report-ansi` สรุป optimization recommendations ทียังค้าง

## Rules

### 1. Safe Changes

- ไม่ลด feature code หรือ business logic
- ไม่ disable `sourcemap` โดยไม่ได้รับอนุญาต
- ไม่ minify ถ้าจะทำให้ debug ยากโดยไม่จำเป็น
- ทุกการแก้ไขต้อง build ผ่านและ test ผ่าน

### 2. Ecosystem Aware

- Vite 8 + Rolldown: ใช้ `optimizeDeps.rolldownOptions` แทน `esbuildOptions`
- Cloudflare Workers: ใช้ `wrangler deploy --dry-run` สำหรับ build validation
- Bun: ใช้ `mise x -- bunx vite build` เมื่อ proto shim ทำให้ Node วน loop
- Solid/TanStack: ระวัง Solid transform, router codegen, server functions

### 3. No Secrets Or Hardcoded Paths

- ไม่เขียน absolute path ของเครื่องลง in source
- ไม่ commit build output
- ใช้ `env` หรือ `vars` สำหรับ configuration ทีเปลี่ยนแปลง

### 4. Reporting

- บันทึก before/after size, build time, chunk count
- ระบุ warning ทีถูก fix และ warning ทียังคงอยู่
- ชี้ไปยัง file/line ทีถูกแก้ไข

## Expected Outcome

- Bundle size ลดลงหรืออยู่ใน threshold ทียอมรับได้
- Build time ลดหรือคงที
- Browser/Node externalization warnings ลดลง
- `dist/` output พร้อมสำหรับ production deploy
- ไม่มี regression ทาง functionality
