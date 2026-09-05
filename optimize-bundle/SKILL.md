---
name: optimize-bundle
description: ปรับปรุง bundle size: manual chunks, dynamic imports, tree-shaking, duplicate vendors
argument-hint: "[app-or-package]"
related:
  - optimize-codebase-everything
  - optimize-assets
  - optimize-network
  - follow-tool-vite
  - run-build
  - report-table
---

## Goal

ปรับปรุง bundle size: manual chunks, dynamic imports, tree-shaking, duplicate vendors

## Scope

ใช้กับ Vite, Webpack, Rollup โดย analyze bundle แล้ว optimize

## Execute

### 1. Analyze Bundle

> Goal: Analyze Bundle

1. รัน `bunx vite-bundle-visualizer` หรือ `bun run build`
2. ดู bundle analyzer output
3. ระบุ chunks ใหญ่และ duplicate vendors

### 2. Manual Chunks

> Goal: Manual Chunks

1. ตรวจ `vite.config.*` สำหรับ `manualChunks`
2. แยก vendor chunks ตาม framework/library
3. แยก feature chunks

### 3. Dynamic Imports

> Goal: Dynamic Imports

1. ใช้ `import()` สำหรับ heavy components
2. ใช้ route-based code splitting
3. โหลด components ตาม condition

### 4. Tree Shaking

> Goal: Tree Shaking

1. ลบ unused exports
2. ลด barrel files
3. ใช้ named imports แทน `import *`
4. ตรวจ `sideEffects` ใน `package.json`

### 5. Validate

> Goal: Validate

1. รัน `/run-build`
2. วัด bundle size ใหม่
3. ทำ `/report-table` สรุป

## Rules

- วัด bundle size ก่อน/หลัง
- ไม่ split เกินจำเป็น
- รักษา runtime behavior

## Expected Outcome

- Bundle size ลดลง
- Chunks มีขนาดเหมาะสม
- ไม่มี duplicate vendors
