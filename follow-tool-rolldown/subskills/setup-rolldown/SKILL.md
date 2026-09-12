---
name: follow-tool-rolldown-setup-rolldown
description: ติดตั้ง Rolldown และสร้าง rolldown.config.ts — entry/output basics
argument-hint: "[project-path]"
related:
  - follow-tool-rolldown
  - follow-tool-vite
  - follow-lang-typescript
---

## Goal

ติดตั้ง Rolldown และตั้งค่า `rolldown.config.ts` พื้นฐานให้ bundle JavaScript/TypeScript ได้ — entry, output formats, build scripts

## Scope

- first-time setup ของ Rolldown standalone (ไม่ใช่ผ่าน Vite)
- ครอบคลุม install, config file, `input`/`output` basics, package scripts
- bundle optimization → `subskills/optimize-bundle/SKILL.md`; migration จาก Rollup → `subskills/migrate-from-rollup/SKILL.md`

## Execute

### 1. Prerequisites

> Goal: environment พร้อมก่อนติดตั้ง

1. ตรวจ Node.js version `^20.19.0 || >=22.12.0`
2. ตรวจ `package.json` และ package manager ที่ project ใช้
3. ถ้า setup ไปแล้ว (มี `rolldown` ใน deps + config อยู่) → verify เท่านั้น ข้ามไป step 5

### 2. Install

> Goal: ติดตั้ง rolldown

1. `bun add -D rolldown` หรือ package manager ที่ project ใช้
2. verify ด้วย `bunx rolldown --version`

### 3. Create Config

> Goal: `rolldown.config.ts` ขั้นต่ำที่จำเป็น

1. สร้าง `rolldown.config.ts` ที่ root ใช้ `defineConfig` จาก `rolldown`
2. กำหนด `input` — string หรือ object ของ entry points
3. กำหนด `output.dir`, `output.format` (`'esm'`/`'cjs'`/`'iife'`) และ `output.sourcemap` ถ้าต้องการ
4. เขียน config ขั้นต่ำก่อนแล้วค่อยเพิ่ม options — ดู official docs (`rolldown.rs`) สำหรับ options ทั้งหมด

### 4. Package Scripts

> Goal: รัน build ผ่าน scripts

1. เพิ่ม `"build": "rolldown -c"` ใน `package.json` (CLI flags ดู `bunx rolldown --help` หรือ official docs)
2. เพิ่ม `"build:watch": "rolldown -c --watch"` ถ้าต้องการ watch mode

### 5. Verify

> Goal: build ผ่านและ output ถูก

1. รัน `bun run build` → ไม่มี error
2. ตรวจ `dist/` (หรือ `output.dir` ที่กำหนด): ไฟล์ครบ, format ถูก, sourcemap ตามที่ตั้ง
3. smoke test import output ใน consumer หรือ `node dist/<file>`
4. ถ้า verify ไม่ผ่าน → `/resolve-errors` max 3 รอบ แล้ว report

## Rules

### 1. Setup

- ใช้ `defineConfig` เสมอ
- config ขั้นต่ำก่อน — ห้าม copy config ตัวอย่างทั้งก้อนโดยไม่เข้าใจ
- ใช้เฉพาะ options จาก official docs — ห้ามเดา option names

### 2. Idempotent

- ถ้ามี setup อยู่แล้ว → verify อย่างเดียว ห้าม reinstall หรือเขียนทับ config

## Expected Outcome

- `rolldown` ติดตั้งและ `rolldown.config.ts` ถูกต้อง
- `bun run build` สร้าง output ใน `dist/` ครบถ้วน
