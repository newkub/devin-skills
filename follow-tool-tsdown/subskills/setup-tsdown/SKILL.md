---
name: follow-tool-tsdown-setup-tsdown
description: ติดตั้ง tsdown และสร้าง tsdown.config.ts — entry/dts/sourcemap
argument-hint: "[project-path]"
related:
  - follow-tool-tsdown
  - follow-tool-rolldown
  - follow-lang-typescript
---

## Goal

ติดตั้ง tsdown และตั้งค่า `tsdown.config.ts` พื้นฐานสำหรับ TypeScript library — entry, formats, dts, sourcemap, package scripts

## Scope

- first-time setup ของ tsdown ใน TypeScript library project
- ครอบคลุม install, `tsdown.config.ts`, `entry`/`format`/`dts`/`sourcemap`, build scripts
- migration จาก tsup → `subskills/migrate-from-tsup/SKILL.md`

## Execute

### 1. Prerequisites

> Goal: project พร้อมสำหรับ tsdown

1. ยืนยันว่าเป็น TypeScript library project — มี `tsconfig.json` และ entry ใน `src/`
2. ตรวจ Node.js version ตาม requirement ใน parent skill หรือ official docs
3. ถ้ามี tsdown setup อยู่แล้ว → verify เท่านั้น ข้ามไป step 5

### 2. Install

> Goal: ติดตั้ง tsdown

1. `bun add -D tsdown` หรือ scaffold project ใหม่ด้วย `bun create tsdown@latest`
2. verify ด้วย `bunx tsdown --version`

### 3. Create Config

> Goal: `tsdown.config.ts` ขั้นต่ำที่จำเป็น

1. สร้าง `tsdown.config.ts` ที่ root ใช้ `defineConfig` จาก `tsdown`
2. กำหนด `entry` — string/array/object ชี้ไป entry files เช่น `src/index.ts`
3. กำหนด `format: ['esm', 'cjs']` ตาม consumers และ `platform` (`node`/`browser`/`neutral`)
4. เปิด `dts: true` สำหรับ `.d.ts` generation และ `sourcemap` ถ้าต้องการ
5. options อื่น (`clean`, `minify`, `external`, `publint`, `attw`) → เพิ่มตาม need ดู official docs

### 4. Package Scripts And Exports

> Goal: build runnable และ package ชี้ output ถูก

1. เพิ่ม `"build": "tsdown"` และ `"dev": "tsdown --watch"` ใน `package.json`
2. ตรวจ `exports`/`main`/`module`/`types` ชี้ไป `dist/` files ที่ tsdown สร้าง — ดู official docs สำหรับ pattern

### 5. Verify

> Goal: build ผ่าน output ครบ

1. รัน `bun run build` → ไม่มี error
2. ตรวจ `dist/`: `.mjs`/`.cjs` ตาม formats, `.d.ts`/`.d.cts` ครบ, sourcemaps ถ้าเปิด
3. ถ้าเปิด `publint`/`attw` → ผลต้องผ่าน
4. ถ้า verify ไม่ผ่าน → `/resolve-errors` max 3 รอบ แล้ว report

## Rules

### 1. Setup

- ใช้ `defineConfig` เสมอ, config ขั้นต่ำก่อนแล้วค่อยเพิ่ม
- ใช้เฉพาะ options จาก official docs — ห้ามเดา

### 2. Package Hygiene

- `exports` ต้องตรง output files จริง — mismatch = consumers import ไม่ได้
- `files` ใน `package.json` ต้องรวม `dist`

## Expected Outcome

- tsdown ติดตั้ง `tsdown.config.ts` ถูกต้อง
- `bun run build` สร้าง `dist/` พร้อม JS + `.d.ts` ครบ
- `package.json` exports ชี้ output ถูก
