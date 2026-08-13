---
name: review-bundler
description: Review Vite config, chunk splitting, tree shaking, minification, compression, source maps, plugins
---

## Goal

Review bundler ครอบคลุม Vite config, chunk splitting, tree shaking, minification, source maps, build performance พร้อม health score

## Scope

bundler review สำหรับ: Vite config, esbuild options, build mode (SSR/SPA/SSG/ISR), chunk splitting (manual chunks, dynamic imports, vendor splitting), tree shaking (side effects, unused exports), minification, compression (gzip, brotli), source maps (production exposure risk), build scripts, plugin configuration, build performance, bundle analysis, entry points, output format

## Execute

### 1. Prepare And Scan

> Goal: เข้าใจ bundler setup และ build configuration

1. ทำ `/scan-codebase` เพื่อเข้าใจ bundler structure
2. ระบุ bundler (Vite, webpack, Rollup, esbuild), build mode, plugin list, chunk strategy ที่ใช้
3. ถ้า project ไม่มี build step → stop และ report

### 2. Deep Analyze

> Goal: ครอบคลุมทุก bundler dimension พร้อม health score

1. ทำ `/deep-analyze` เพื่อวิเคราะห์ bundler patterns
2. ทำ `/update-codebase-health-cli` — `/update-codebase-health-cli` เรียก `/update-rules` ภายในตัวเองเพื่ออัปเดต `ast-grep` rules
3. ถ้า `/update-codebase-health-cli` ข้าม `/update-rules` → ทำ `/update-rules` แยก
4. รัน `bunx ast-grep scan --inspect summary` เพื่อ verify rules ทำงานได้
5. ทำ `/run-health` เพื่อดึง metrics ล่าสุด

### 3. Config, Chunk Splitting And Tree Shaking Review

> Goal: ครอบคลุม config, chunks, tree shaking

1. ตรวจสอบ bundler config: Vite config correctness, esbuild options, build mode (SSR/SPA/SSG/ISR), base path, public dir, assets dir, entry points, output format (ESM/CJS), target browsers
2. ตรวจสอบ chunk splitting: manual chunks configuration, vendor splitting strategy, dynamic imports usage, route-level code splitting, lazy loading chunks, shared chunk detection, chunk size limits, chunk naming
3. ตรวจสอบ tree shaking: side effects declaration (sideEffects field), tree-shakeable exports, unused exports detection, dead code elimination, pure function annotations, import granularity (named vs namespace)
4. ตรวจสอบ minification: minification enabled, minifier selection (esbuild, terser), minification options, CSS minification, HTML minification, minification correctness

### 4. Compression, Source Maps, Plugins And Performance Review

> Goal: ครอบคลุม compression, source maps, plugins, build performance

1. ตรวจสอบ compression: gzip compression, brotli compression, compression plugin config, compression level, compression for assets, compression for HTML/CSS/JS
2. ตรวจสอบ source maps: source maps in development, source maps in production (exposure risk), source map quality, hidden source maps, source map upload to monitoring service, source map removal in production
3. ตรวจสอบ plugin configuration: plugin necessity, plugin compatibility, plugin order, plugin security, custom plugin quality, plugin bundle size impact
4. ตรวจสอบ build scripts: build script correctness, build script consistency, build script documentation, build script environment handling, build script CI compatibility
5. ตรวจสอบ build performance: build time, build caching, incremental build, parallel build, build optimization, bundle analysis (rollup-plugin-visualizer, webpack-bundle-analyzer), dependency size impact
6. ตรวจสอบ bundle analysis: bundle size tracking, bundle size limits, bundle composition, largest dependencies, duplicate dependencies, export size analysis

### 5. Validate, Rate And Report

> Goal: Issues ถูก validate และรายงานเป็นตาราง

1. ทำ `/deep-validate` เพื่อ validate findings
2. ทำ `/validate` สำหรับ validate issues จากทุก section
3. จัดลำดับตาม severity: Critical → High → Medium → Low
4. คำนวณ health score: (Critical=0, High=25, Medium=50, Low=75, Info=100) → weighted average
5. ทำ `/report` พร้อม `/report-format-table`
6. ทำ `/suggest-next-action`

## Rules

### 1. Skip Conditions

- ถ้า project ไม่มี build step → ข้ามทั้งหมด
- ถ้า project ไม่มี source maps → ข้าม Step 4 item 2
- ถ้า project ไม่มี plugins → ข้าม Step 4 item 3

### 2. Severity Classification

- Critical: broken build config, missing minification, production source maps exposed, build ที่ fail บน production
- High: missing chunk splitting, no tree shaking, slow build blocking CI, missing compression, oversized bundle, missing bundle analysis, incorrect source maps, missing dynamic imports
- Medium: suboptimal chunk strategy, missing brotli, minor plugin issue, missing build caching, suboptimal minification
- Low: cosmetic, minor config improvement, documentation gap

### 3. Evidence-Based Findings

- ทุก finding ต้องมี file path และ line number
- ระบุ config file, plugin, หรือ chunk ที่เกี่ยวข้อง

### 4. Review Independence

- ทำ review เท่านั้น ไม่แก้ไข code ระหว่าง review

### 5. Formatting

- ห้ามใช้ `**` (bold markers) — ใช้ backticks สำหรับ emphasis
- รายงานเป็นตารางด้วย `/report-format-table`

## Expected Outcome

- รายงานตาราง aggregate findings จากทุก bundler section
- Health score ต่อ dimension และ overall
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`
