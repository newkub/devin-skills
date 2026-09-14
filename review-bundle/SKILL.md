---
name: review-bundle
description: Review bundle size, chunks, static assets (images/fonts/media) และ build output
argument-hint: "[app-or-package]"
related:
  - run-build
  - report
  - scan-codebase
  - review-performance
  - deep-review-then-fix
  - run-review
---

## Goal

Review production output ทั้งหมด — bundle size, build output, chunks และ static assets (images, fonts, media) พร้อม loading strategy — review เท่านั้น ไม่แก้ไข config; fix ทำใน section `## Fix` หลัง user confirm (merged from: `review-assets`)

## Scope

ใช้กับ project ที่มี Vite / Rolldown / esbuild / Webpack หรือ bundler ที่คล้ายกัน รองรับ monorepo — ครอบคลุม `dist/` output และ assets ใน `public/`, `src/assets`

ไม่รวม: runtime performance deep-dive → ใช้ `/review-performance`

## Execute

### 1. Inspect Build Configuration

> Goal: เข้าใจ build config

1. อ่าน `package.json` scripts ที่เกี่ยวข้องกับ build, dev, deploy
2. อ่าน `vite.config.*`, `tsup.config.*`, `wrangler.jsonc`, `turbo.json`
3. ระบุ framework และ output target

### 2. Analyze Bundle Output

> Goal: เข้าใจ output ที่ผลิตออกมา

1. ทำ `/run-build` พร้อม bundle analyzer
2. วัด `dist/` size
3. ระบุ chunks ที่ใหญ่เกิน 500 kB หรือ duplicate vendor modules

### 3. Review Chunk And Dependency Strategy

> Goal: ตรวจสอบ chunking และ deps

1. ตรวจ manual chunks และ dynamic imports
2. ตรวจ tree shaking และ dead code
3. ตรวจ third-party dependencies ที่ inflate bundle

### 4. Audit Static Assets

> Goal: assets optimize ถูก format และ loading strategy เหมาะสม

ทำตาม references/assets-checklist.md

1. images — `png`/`jpg` ที่ควรเป็น `webp`/`avif`, ขาด `srcset`/`sizes`, `loading="lazy"`, `decoding="async"`, ขาด `width`/`height` (CLS risk)
2. fonts — `font-display: swap`, preloading, subset fonts และ weights ที่ใช้จริง
3. media — video/audio auto-load, ขาด poster, icons ที่ควรเป็น SVG sprite

### 5. Rate And Report

> Goal: สรุป findings พร้อม fix direction

1. ทำ `/report` ตาราง columns: No., Area, Severity, Finding, Evidence, Fix
2. แนะนำ section `## Fix` เมื่อ user confirm การแก้ไข

### Subskills

> Goal: dispatch ไป fix เมื่อ subskill ตรงกับ user confirm scope ของ findings

| Topic | Subskill |
|-------|----------|
| Apply bundle findings - dedupe deps, splitting, lazy loading | `subskills/optimize-bundle/SKILL.md` |

## Rules

### 1. Read Only

- ไม่แก้ไข build config หรือ assets ระหว่าง review
- ทุก audit ใช้ measurement จริงเท่านั้น

### 2. Evidence Required

- ทุก finding ต้องมี bundle size, chunk name, asset path/size หรือ config line
- ไม่สรุป chunking หรือ format โดยไม่มี evidence

## Fix

> ทำ section นี้เฉพาะเมื่อ user confirm ให้แก้ findings — review/report-only โดย default; multi-domain fix orchestration → `/deep-review-then-fix`

### Fix Steps

1. baseline: `/run-build` + bundle analyzer — sizes ต่อ chunk, biggest deps, assets inventory ตาม type/size
2. code splitting: route-based `import()`, vendor split, lazy heavy features
3. tree shaking: named imports, `sideEffects`, dev-only code ออก
4. images: AVIF/WebP+fallback, srcset, compress, lazy ใต้ viewport — ดู `references/fix-optimize-images.md`
5. fonts: woff2+subset, font-display swap, preload critical — ดู `references/fix-optimize-fonts.md`
6. videos/icons: compressed formats, poster, SVG sprites; cache headers immutable+hash — ดู `references/fix-optimize-videos.md`, `references/fix-optimize-assets.md`
7. compression: brotli/gzip, minify, hashed names + long-term cache
8. verify: build เทียบ bytes before/after, smoke test lazy chunks, ไม่มี visual/CLS regression

## References

- [Full-dimension checklist](references/checklist.md)
- [Assets checklist](references/assets-checklist.md)
- ใช้ /run-review ถ้าจำเป็น

## Expected Outcome

- ตาราง findings แยกตาม bundle size, chunks, deps, images, fonts, media
- ทุก finding มี evidence และ severity
- next action ชัดเจนผ่าน section `## Fix`
