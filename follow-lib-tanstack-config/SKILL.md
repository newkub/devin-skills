---
name: follow-lib-tanstack-config
description: ใช้ TanStack Config — build/publish toolchain สำหรับ maintain JS packages คุณภาพสูง
argument-hint: "[package-dir]"
related:
  - follow-lib-tanstack-ecosystem
  - run-build
  - resolve-errors
---

## Goal

ใช้ TanStack Config — configuration และ tooling ที่ TanStack ใช้เองสำหรับ build + publish packages คุณภาพสูง (ESM/CJS, types, publint-style checks)

## Scope

ใช้เมื่อ maintain/publish library packages — **ไม่ใช่ app config**; app projects ไม่ต้องใช้ (ใช้ tsdown/tsup/vite ตาม `follow-tool-*` แทนได้)

- part of TanStack ecosystem — selection/dispatch อยู่ที่ `/follow-lib-tanstack-ecosystem`

## Execute

### 1. Install

```bash
bun add -D @tanstack/config
```

### 2. Configure Package Build

> Goal: build/publish config ตาม TanStack standard

1. อ่าน `https://tanstack.com/config/latest` — ตรวจ config file format ล่าสุด (`tanstack.config.*` หรือ `package.json` field)
2. กำหนด entry points + output formats (ESM/CJS + `.d.ts`)
3. รัน build/publish checks ที่ package provide — ตรวจ exports map, types resolution, publint-style issues ก่อน publish

### 3. Verify

> Goal: package build/publish ผ่าน checks

1. `/run-build` — outputs ครบ (ESM + CJS + types)
2. `npm pack --dry-run` — published files ถูกต้อง
3. `bunx publint` หรือ equivalent check ผ่าน
4. ถ้า fail → `/resolve-errors` max 3 รอบ

## Rules

- ใช้เฉพาะกับ packages ที่จะ publish — app ไม่เกี่ยว
- Exports map ต้อง resolve ได้ทั้ง `import`/`require`/`types` conditions
- อย่า replace build tool ที่ project ใช้อยู่ (tsdown/tsup) ถ้าไม่มีเหตุผล — config lib นี้ optimize ให้ TanStack-style publishing

## Expected Outcome

- Package build ครบ formats + types
- Publish checks ผ่าน ไม่มี exports/types issues
