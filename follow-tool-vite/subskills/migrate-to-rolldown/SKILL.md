---
name: follow-tool-vite-migrate-to-rolldown
description: Migrate Vite ไปใช้ rolldown-vite — plugin compat, native plugins, verify
argument-hint: "[project-path]"
related:
  - follow-tool-vite
  - follow-tool-rolldown
  - deep-impact
  - check-deprecated-apis
  - report-before-after
---

## Goal

ย้าย Vite project ไปใช้ `rolldown-vite` (Rolldown-powered Vite) อย่างปลอดภัย — dev, build และ plugins ทำงานเหมือนเดิม และ rollback ได้

## Scope

- ใช้กับ project ที่ยังเป็น Vite ≤7 (Rollup/esbuild bundler) และต้องการย้ายไป `rolldown-vite`
- ถ้า project เป็น Vite 8+ อยู่แล้ว → Rolldown เป็น default bundler ไม่ต้อง migrate
- ครอบคลุม package swap, plugin compatibility, config options rename, verify output

## Execute

### 1. Plan And Baseline

> Goal: รู้ from→to และเก็บ baseline

1. ตรวจ `vite` version ใน `package.json` และ list plugins ทั้งหมดใน `vite.config.*`
2. รัน `vite build` + dev server บน setup เดิม เก็บ build time และ output size เป็น baseline
3. อ่าน official migration guide ที่ `vite.dev` — ทำ `/learn` (web) ถ้าไม่แน่ใจ
4. commit state ปัจจุบันก่อน — migration ต้อง revert ได้

### 2. Swap Package

> Goal: แทน `vite` ด้วย `rolldown-vite` แบบ drop-in

1. alias package ใน `package.json`: `"vite": "npm:rolldown-vite@latest"` — หรือผ่าน `overrides`/`pnpm.overrides` ตาม package manager ที่ใช้
2. reinstall dependencies (`bun install`) แล้ว verify ด้วย `bunx vite --version` ว่าเป็น rolldown-vite
3. ถ้า package manager ไม่รองรับ alias/overrides → ดู official docs สำหรับวิธีที่ ecosystem นั้นใช้

### 3. Fix Plugin Compatibility

> Goal: plugins ทั้งหมดทำงานบน Rolldown

1. รัน `bunx vite build` — เก็บ plugin errors/warnings ทั้งหมด
2. plugins ที่ใช้ Rollup-only hooks อาจต้องอัปเดต — เช็ค compatibility list ใน official docs
3. พิจารณา native/Oxc-based plugin replacements ที่ rolldown-vite มีให้ — ดู official docs ต่อ plugin
4. ถ้า plugin สำคัญไม่ compatible → หน่วง migration หรือหา alternative ก่อนดำเนินการต่อ

### 4. Translate Config Options

> Goal: เปลี่ยน options ที่ rename แล้ว

1. `build.rollupOptions` → `build.rolldownOptions`
2. `optimizeDeps.esbuildOptions` → `optimizeDeps.rolldownOptions`; `esbuild.*` top-level → `oxc.*`
3. เช็ค deprecated options เหลือด้วย `/check-deprecated-apis`
4. options ที่ไม่แน่ใจ → ดู official docs ห้ามเดา

### 5. Verify

> Goal: dev + build เทียบเท่าเดิม

1. `bunx vite` → dev server + HMR ทำงาน
2. `bunx vite build` → ผ่าน, compare output size/file list กับ baseline
3. รัน test suite + smoke test บน `vite preview`
4. ถ้าพังและแก้ไม่ได้ใน 3 รอบ → revert alias ใน `package.json` (rollback path) แล้ว report

## Rules

### 1. Safety

- ห้ามผสม migration กับ feature work ใน commit เดียว — แยก commit ต่อ step ให้ bisect ได้
- rollback path = เปลี่ยน `"vite"` กลับเป็น version เดิม + reinstall — ต้องพร้อมใช้เสมอ

### 2. Compatibility

- plugin ที่ไม่รองรับ Rolldown ต้องแก้ก่อนสลับ — ห้าม ignore warnings ที่เกี่ยวกับ bundler
- เก็บ config แบบ conditional ไว้ถ้าต้องรันทั้งสอง bundler ระหว่าง transition

- ใช้ /follow-tool-vite ถ้าจำเป็น
- ใช้ /follow-tool-rolldown ถ้าจำเป็น
- ใช้ /deep-impact ถ้าจำเป็น
- ใช้ /report-before-after ถ้าจำเป็น

## Expected Outcome

- project รันบน `rolldown-vite` — dev/build/tests ผ่านเหมือนเดิม
- config ใช้ `rolldownOptions`/`oxc` ไม่มี deprecated options ค้าง
- build เร็วขึ้นหรือเท่าเดิม output ไม่ regression
