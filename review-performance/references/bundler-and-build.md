---
name: bundler-and-build
description: Bundler and build performance review checklist
---

# Bundler And Build Performance

## Goal

bundle และ build output มีขนาดเล็ก โหลดเร็ว

## Checks

1. ระบุ build tool จาก `package.json` และ config: `bunup.config.ts`, `tsdown.config.ts`, `vite.config.ts`
2. ตรวจสอบ chunk splitting: vendor chunks, route-level chunks, dynamic imports
3. ตรวจสอบ tree shaking: `sideEffects` in `package.json`, unused exports, dead code
4. ตรวจสอบ minification, source maps, `external` dependencies
5. ตรวจสอบ asset optimization: image, font, SVG, gzip size
6. ถ้าไม่มี build step → ข้าม step นี้

## Severity

- Critical: broken build, bundle > 1MB on critical path, no source maps in production
- High: missing code splitting, large vendor chunk, missing tree shaking
- Medium: suboptimal chunk, missing asset optimization
- Low: minor bundle size improvement
