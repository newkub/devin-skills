---
name: optimize-bundling
description: Optimize bundle output — code splitting, tree shaking, compression ตาม review-bundle findings
argument-hint: "[scope]"
related:
  - review-bundle
  - check-bundle-regression
  - bench-bundle-tools
  - report-bundle
  - optimize-web-vitals
  - run-build
  - run-check
  - report
  - suggest-next-action
---

## Goal

ลด bundle size และปรับปรุง bundling strategy — code splitting, tree shaking, compression, chunking — ตาม findings จาก `/review-bundle` พร้อมวัดขนาด before/after จริง

## Scope

ใช้หลัง `/review-bundle` มี findings หรือเมื่อ bundle ใหญ่เกิน budget — apply fixes ไม่ใช่แค่ report

- ถ้าต้องการ runtime metrics (LCP/INP) → `/optimize-web-vitals`
- ถ้าต้องการเปรียบเทียบ bundlers → `/bench-bundle-tools`

## Execute

### 1. Measure Baseline

> Goal: รู้ขนาดปัจจุบันและ composition

1. ทำ `/run-build` เก็บ output sizes ต่อ chunk/file
2. ใช้ bundle analyzer ตาม bundler ที่ตรวจพบ (`vite-bundle-visualizer`, `webpack-bundle-analyzer`, `bun build --analyze` หรือ equivalent)
3. บันทึก baseline: total size, largest chunks, duplicated modules, biggest deps
4. ทำ `/check-bundle-regression` ถ้ามี baseline เก่าให้เทียบ

### 2. Collect Findings

> Goal: รู้ว่าต้องแก้อะไร

1. ทำ `/review-bundle` หรืออ่าน findings เดิม
2. จัดกลุ่ม: oversized deps, missing code-split, duplicated code, non-treeshaken imports, uncompressed assets

### 3. Fix Code Splitting

> Goal: load เฉพาะที่ต้องใช้

1. route-based splitting — dynamic `import()` ต่อ route
2. vendor splitting — แยก framework/heavy libs เป็น chunk แยก cache ได้นาน
3. lazy-load heavy features (charts, editors, modals) — ไม่ bundle เข้า main

### 4. Fix Tree Shaking And Imports

> Goal: bundle เฉพาะ code ที่ใช้จริง

1. named imports แทน barrel/default imports สำหรับ libs ใหญ่ (lodash → `lodash-es` named, moment → date-fns/dayjs)
2. side-effect imports ที่ไม่จำเป็น → ลบหรือกำหนด `sideEffects: false` ใน package ตัวเอง
3. dev-only code ออกจาก production bundle (`import.meta.env.DEV` guards)

### 5. Optimize Assets And Compression

> Goal: bytes over wire น้อยสุด

1. เปิด brotli/gzip compression ใน build/server config
2. minification + CSS minify + dead CSS removal ตาม tools ของ project
3. static assets: inline เล็ก, hash names สำหรับ long-term caching

### 6. Verify

> Goal: ยืนยัน size ลดและไม่พัง

1. `/run-build` ใหม่ — เทียบ sizes before/after ต่อ chunk
2. `/run-check` + smoke test หน้าที่ใช้ lazy chunks
3. ถ้า regression → ทำ `/check-bundle-regression` ยืนยันแล้วแก้

### 7. Report

> Goal: ส่งมอบ

1. ทำ `/report-bundle` หรือ `/report` — size table before/after, biggest wins
2. ทำ `/suggest-next-action`

## Rules

### 1. Measure Before Fix

- ทุก fix ต้องมี size impact ที่วัดได้ — ห้าม optimize ตาม intuition
- baseline และ after ต้อง build ด้วย config เดียวกัน

### 2. No Behavior Change

- code splitting/lazy loading ต้องไม่ทำให้ UX แย่ลง — มี loading state ที่เหมาะ
- ทุก lazy boundary ต้อง test จริง

### 3. Ecosystem Native

- ใช้ config ของ bundler ที่ project ใช้อยู่ — ห้ามเปลี่ยน bundler ใน skill นี้ (เปลี่ยนเป็น task แยก)
- ไม่เพิ่ม deps ใหม่ถ้าไม่จำเป็น — เป้าหมายคือลด size

## Expected Outcome

- bundle size ลดลงอย่างมีนัยสำคัญพร้อม evidence ต่อ chunk
- code splitting + tree shaking + compression ครบ
- ไม่มี functional regression — tests/build ผ่าน
