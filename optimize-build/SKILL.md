---
name: optimize-build
description: ลดเวลา build ด้วย cache, incremental builds, parallelism และ config tuning
argument-hint: "[target-or-framework]"
related:
  - run-build
  - check-bottlenecks
  - run-watch-build
  - follow-tool-vite
  - optimize-bundle
  - follow-tool-turborepo
  - report-before-after
---

## Goal

วิเคราะห์และลด build time ของ project — หา stages ที่ช้า, ตั้ง cache ให้ถูก, เปิด incremental/parallel builds และ tune bundler config

## Scope

- ครอบคลุม: dev build, production build, typecheck, codegen, asset pipeline
- เครื่องมือตาม ecosystem: Vite/Rolldown, webpack, esbuild, tsc, Bun, Cargo, Go
- Action-oriented: ปรับ config จริง — ต้องมี baseline และวัดผลก่อน/หลัง

## Execute

### 1. Measure Baseline

> Goal: จับเวลา build ปัจจุบันแยกตาม stage

1. รัน `/run-build` พร้อมจับเวลา (`time`, `Measure-Command`)
2. เปิด profiler ของ bundler ถ้ามี (`vite --profile`, `webpack --profile`, `speed-measure`)
3. บันทึก baseline: total time, stage breakdown, output size

### 2. Identify Bottlenecks

> Goal: หา stage/plugin ที่ช้าที่สุด

1. วิเคราะห์ profile: transforms ช้า, typecheck ช้า, minification, asset processing
2. ใช้ `/check-bottlenecks` ถ้าต้องการวิเคราะห์เชิงลึก
3. flag: plugins ซ้ำซ้อน, sourcemaps ที่ไม่จำเป็น, polyfills เกิน, unoptimized images

### 3. Apply Optimizations

> Goal: ปรับ config ตาม findings โดยเรียง impact

1. **Cache**: เปิด persistent cache (`turbo`, `moon`, babel/esbuild cache, `incremental` ใน tsconfig)
2. **Parallelism**: workers/threads สำหรับ minify, transpile
3. **Skip work**: ลด transpile targets, ปิด sourcemap ใน dev, lazy codegen
4. **Deps**: prebundle, dedupe, เปลี่ยน lib หนักเป็นเบา (ทำ `/optimize-deps` ถ้าเจอ)
5. แก้ครั้งละอย่าง แล้ววัดผลทันที

### 4. Verify And Report

> Goal: ยืนยันผลลัพธ์และรายงาน delta

1. รัน build ซ้ำด้วย input เดิม — output ต้องเท่าเดิม (verify artifacts)
2. ใช้ `/report-before-after` แสดง: baseline → optimized, % improvement ต่อ stage
3. ทำ `/run-check` เพื่อยืนยัน lint/typecheck ยังผ่าน

## Rules

### 1. Measure First

- ต้องมี baseline ก่อนแก้เสมอ — ห้าม optimize โดยไม่มีตัวเลข
- รายงาน % improvement จากการวัดจริง ไม่ใช่คาดเดา

### 2. Minimal Config Changes

- แก้เฉพาะ config ที่จำเป็น — ไม่เปลี่ยน bundler ทั้งตัวถ้าไม่จำเป็น
- รักษา output correctness — build output ต้องทำงานเหมือนเดิม

### 3. Ecosystem Aware

- ตรวจ bundler/framework จาก `package.json`, `vite.config.*`, `Cargo.toml` ก่อนเลือก technique
- monorepo ให้ใช้ remote/local cache ของ task runner (`turbo`, `moon`)

## Expected Outcome

- Build time ลดลงพร้อมตัวเลข before/after
- Cache และ incremental builds ตั้งค่าถูกต้อง
- รายงาน stages ที่ช้าและสิ่งที่แก้ไป
