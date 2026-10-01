---
name: follow-tool-vite-migrate-to-vite8
description: Migrate Vite ≤7 หรือ rolldown-vite preview ไป vite@^8 — plugin compat, config rename, verify
argument-hint: "[project-path]"
related:
  - follow-tool-vite
  - follow-tool-rolldown
  - deep-impact
  - deep-review
  - report-before-after
---

## Goal

ย้าย Vite project ไป `vite@^8` (Rolldown + Oxc เป็น default) อย่างปลอดภัย — dev, build และ plugins ทำงานเหมือนเดิม และ rollback ได้

## Scope

- ใช้กับ project ที่ยังเป็น Vite ≤7 หรือ alias `vite` ไป `npm:rolldown-vite` (technical preview สำหรับ Vite 6/7)
- `rolldown-vite` package เลิกใช้แล้ว — Vite 8 ใช้ Rolldown เป็น bundler เดียวโดย default ไม่ต้อง opt-in; ห้ามเพิ่ม `npm:rolldown-vite` alias/overrides ใหม่
- ครอบคลุม package upgrade, plugin compatibility, config options rename, verify output

## Execute

### 1. Plan And Baseline

> Goal: รู้ from→to และเก็บ baseline

1. ตรวจ `vite` version ใน `package.json` และ list plugins ทั้งหมดใน `vite.config.*`
2. รัน `vite build` + dev server บน setup เดิม เก็บ build time และ output size เป็น baseline
3. อ่าน official migration guide ที่ `vite.dev` (`/learn` (web) ถ้าไม่แน่ใจ) — ถ้า project ใหญ่มากและต้อง isolate ปัญหา Rolldown ค่อยพิจารณา `rolldown-vite` เป็นขั้นกลางชั่วคราว แล้วขึ้น Vite 8 ต่อ
4. commit state ปัจจุบันก่อน — migration ต้อง revert ได้

### 2. Upgrade Package

> Goal: `vite` เป็น `^8` โดยตรง ไม่มี alias

1. ถ้า `package.json` มี `"vite": "npm:rolldown-vite@..."` หรือ `overrides`/`pnpm.overrides` ชี้ไป `rolldown-vite` → ลบ alias/override ออก
2. `"vite": "^8.0.0"` ใน `devDependencies` แล้ว reinstall (`bun install`)
3. verify ด้วย `bunx vite --version` ว่าเป็น Vite 8.x

### 3. Fix Plugin Compatibility

> Goal: plugins ทั้งหมดทำงานบน Rolldown

1. รัน `bunx vite build` — เก็บ plugin errors/warnings ทั้งหมด
2. plugins ที่ใช้ Rollup-only hooks หรือ `transformWithEsbuild` อาจต้องอัปเดต — เช็ค compatibility list ใน official docs (`transformWithEsbuild` deprecated → `transformWithOxc`)
3. พิจารณา native/Oxc-based plugin replacements ตาม official docs ต่อ plugin
4. ถ้า plugin สำคัญไม่ compatible → หน่วง migration หรือหา alternative ก่อนดำเนินการต่อ

### 4. Translate Config Options

> Goal: เปลี่ยน options ที่ rename/deprecated แล้ว

1. `build.rollupOptions` → `build.rolldownOptions` (compat layer ยังรองรับ แต่ควร migrate)
2. `optimizeDeps.esbuildOptions` → `optimizeDeps.rolldownOptions`; `esbuild.*` top-level → `oxc.*` (ทั้งคู่ deprecated ใน Vite 8)
3. ถ้า plugin ใช้ `transformWithEsbuild` ให้ติดตั้ง `esbuild` เป็น devDependency ชั่วคราว — esbuild ไม่ได้เป็น dep ตรงของ Vite แล้ว
4. เช็ค deprecated options เหลือด้วย `/deep-review` — options ที่ไม่แน่ใจ ดู official docs ห้ามเดา

### 5. Verify

> Goal: dev + build เทียบเท่าเดิม

1. `bunx vite` → dev server + HMR ทำงาน
2. `bunx vite build` → ผ่าน, compare output size/file list กับ baseline
3. รัน test suite + smoke test บน `vite preview`
4. ถ้าพังและแก้ไม่ได้ใน 3 รอบ → pin `vite` กลับเป็น version เดิม + reinstall (rollback path) แล้ว report

## Rules

### 1. Safety

- ห้ามผสม migration กับ feature work ใน commit เดียว — แยก commit ต่อ step ให้ bisect ได้
- rollback path = เปลี่ยน `"vite"` กลับเป็น version เดิม + reinstall — ต้องพร้อมใช้เสมอ

### 2. Compatibility

- plugin ที่ไม่รองรับ Rolldown ต้องแก้ก่อนอัปเกรด — ห้าม ignore warnings ที่เกี่ยวกับ bundler
- เก็บ config แบบ conditional ไว้ถ้าต้องรันหลาย version ระหว่าง transition

- ใช้ /follow-tool-vite ถ้าจำเป็น
- ใช้ /follow-tool-rolldown ถ้าจำเป็น
- ใช้ /deep-impact ถ้าจำเป็น
- ใช้ /report-before-after ถ้าจำเป็น

## Expected Outcome

- project รันบน `vite@^8` โดยตรง — ไม่มี `rolldown-vite` alias/overrides ค้าง — dev/build/tests ผ่านเหมือนเดิม
- config ใช้ `rolldownOptions`/`oxc` ไม่มี deprecated options ค้าง
- build เร็วขึ้นหรือเท่าเดิม output ไม่ regression
