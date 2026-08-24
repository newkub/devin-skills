---
name: review-bundler
description: Review build/bundler config: chunks, tree shaking, minify, sourcemap, plugins
allowed-tools:
  - read
  - edit
  - grep
  - glob
  - exec
  - ask_user_question
triggers:
  - user
  - model
related:
  - review-codebase
  - validate
  - suggest-next-action
---


## Goal

Review build/bundler configuration ครอบคลุม chunk splitting, tree shaking, minification, sourcemap, plugins และ build performance พร้อม review score

## Scope

Bundler review สำหรับ build tool (`bunup`, `tsdown`, `vite`, `tauri`), build config file (`bunup.config.ts`, `tsdown.config.ts`, `vite.config.ts`, `tauri.conf.json`), output format, target, minify, sourcemap, external, chunk splitting, tree shaking, compression, plugins, build scripts, bundle analysis, entry points และ build performance

## Execute

### 1. Prepare And Scan

> Goal: เข้าใจ bundler setup และ build configuration

1. ตรวจสอบ build tool จาก `package.json` และ config file (`bunup.config.ts`, `tsdown.config.ts`, `vite.config.ts`, `tauri.conf.json`)
2. ระบุ build mode, package manager, entry points, output format, target browser/runtime
3. ตรวจสอบว่า project มี build step หรือไม่ — ถ้าไม่มีให้ stop และ report
4. บันทึก baseline build time และ output size ถ้า build ได้

### 2. Review Build Configuration

> Goal: ประเมิน build config ปัจจุบัน

1. ตรวจสอบ output format และ `target` ตรงกับ runtime ที่รองรับ
2. ตรวจสอบ `minify` เปิดใน production และ minifier ที่ใช้ (esbuild, terser, swc)
3. ตรวจสอบ `sourcemap` ใน development และ production — ประเมิน exposure risk
4. ตรวจสอบ `external` สำหรับ dependencies ที่ไม่ควร bundle
5. ตรวจสอบ over/under-configure ใน build config
6. ตรวจสอบ build script correctness, consistency, documentation, environment handling, CI compatibility

### 3. Review Dependencies And Tree Shaking

> Goal: ประเมิน dependencies และ tree shaking

1. ตรวจสอบ unused dependencies และ dead code
2. ตรวจสอบ barrel files และ import paths ที่อาจโหลด module ทั้งหมดโดยไม่จำเป็น
3. ตรวจสอบ `sideEffects` field ใน `package.json` และ tree-shakeable exports
4. ตรวจสอบ import granularity (named vs namespace), unused exports, pure function annotations

### 4. Review Chunks And Code Splitting

> Goal: ประเมิน chunk splitting และ dynamic imports

1. ตรวจสอบ manual chunks, vendor splitting, dynamic `import()`, route-level code splitting
2. ตรวจสอบ lazy loading chunks, shared chunk detection, chunk size limits, chunk naming
3. ตรวจสอบ dead code และโอกาสลด bundle size จากการ split

### 5. Review Minify, Sourcemap And Plugins

> Goal: ประเมิน minification, sourcemap, plugins

1. ตรวจสอบ minification: enabled, minifier selection, CSS/HTML minification, minification correctness
2. ตรวจสอบ source maps: dev vs prod, exposure risk, quality, hidden source maps, upload to monitoring, removal in production
3. ตรวจสอบ plugin configuration: necessity, compatibility, order, security, bundle size impact
4. ตรวจสอบ build performance: build time, build caching, incremental build, parallel build, bundle analysis tools (`rollup-plugin-visualizer`, `webpack-bundle-analyzer`)

### 6. Review Compression And Assets

> Goal: ประเมิน compression และ assets

1. ตรวจสอบ compression: gzip, brotli, compression plugin config, level, compression for assets/HTML/CSS/JS
2. ตรวจสอบ assets ขนาดใหญ่ใน `src/` หรือ `public/`, unused assets, format conversion opportunities
3. ตรวจสอบ bundle analysis: size tracking, size limits, bundle composition, largest dependencies, duplicate dependencies, export size analysis

### 7. Validate And Report

> Goal: Validate findings และรายงานเป็นตาราง

1. ทำ `/deep-validate` และ `/validate` เพื่อ validate findings
2. จัดลำดับ severity: Critical → High → Medium → Low
3. คำนวณ review score: (Critical=0, High=25, Medium=50, Low=75, Info=100) → weighted average
4. ทำ `/report` พร้อม `/report-table`
5. ทำ `/suggest-next-action`

## Rules

### 1. Skip Conditions

- ถ้า project ไม่มี build step → ข้ามทั้งหมด
- ถ้า project ไม่มี source maps → ข้าม sourcemap review
- ถ้า project ไม่มี plugins → ข้าม plugin review
- ถ้า project ไม่มี assets → ข้าม asset/compression review

### 2. Build Tool Specifics

- `bunup`: ตรวจสอบ `minify`, `sourcemap`, `external` ใน `bunup.config.ts`
- `tsdown`: ตรวจสอบ `minify`, `sourcemap`, `external` ใน `tsdown.config.ts`
- `vite`: ตรวจสอบ `build.minify`, `build.sourcemap`, `build.rollupOptions.external` ใน `vite.config.ts`
- `tauri`: ตรวจสอบ `bundle` options ใน `tauri.conf.json`

### 3. Severity Classification

- Critical: broken build config, missing minification, production source maps exposed, build ที่ fail บน production
- High: missing chunk splitting, no tree shaking, slow build blocking CI, missing compression, oversized bundle, missing bundle analysis, incorrect source maps, missing dynamic imports
- Medium: suboptimal chunk strategy, missing brotli, minor plugin issue, missing build caching, suboptimal minification
- Low: cosmetic, minor config improvement, documentation gap

### 4. Evidence-Based Findings

- ทุก finding ต้องมี file path และ line number
- ระบุ config file, plugin, หรือ chunk ที่เกี่ยวข้อง

### 5. Review Independence

- ทำ review เท่านั้น ไม่แก้ไข code ระหว่าง review

### 6. Formatting

- ห้ามใช้ `**` (bold markers) — ใช้ backticks สำหรับ emphasis
- รายงานเป็นตารางด้วย `/report-table`

## Expected Outcome

- รายงานตาราง aggregate findings จากทุก bundler section
- Review score ต่อ dimension และ overall
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`

