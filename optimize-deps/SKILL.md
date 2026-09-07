---
name: optimize-deps
description: ลดน้ำหนัก dependencies เปลี่ยน lib หนักเป็นตัวเบา ลด dep tree และ bundle impact
argument-hint: "[package-name]"
related:
  - use-lib-better
  - review-dependencies
  - list-dependencies
  - analyze-dependencies
  - follow-tool-node-modules-inspector
  - check-unused
  - report-before-after
---

## Goal

ลด dependency footprint ของ project — แทนที่ libraries หนักด้วยทางเลือกเบากว่า, ลบ deps ที่ซ้ำซ้อน, flatten dep tree และลด install/bundle size

## Scope

- ตรวจ `package.json`, `Cargo.toml`, `go.mod` ฯลฯ ตาม ecosystem
- ครอบคลุม: heavy deps (moment, lodash, axios → fetch), duplicate-purpose libs, deps ที่ใช้แค่ function เดียว, transitive deps bloat, devDeps ผิดที่
- Action-oriented: เปลี่ยน deps จริง — verify ด้วย build/test

## Execute

### 1. Analyze Dependency Tree

> Goal: หา deps ที่หนักและซ้ำซ้อน

1. ใช้ `/analyze-dependencies` และ `/list-dependencies` ดู tree
2. วัดขนาด: `node_modules` size, bundle contribution (source-map-explorer, `vite-bundle-visualizer`)
3. หา duplicates: หลาย versions ของ package เดียว (`npm ls`, `pnpm why`, `bun pm`)
4. ใช้ `/check-unused` หา deps ที่ไม่ถูกใช้

### 2. Identify Replacement Candidates

> Goal: หา lib หนักที่มีทางเลือกเบา

1. flag patterns คลาสสิก: `moment`→`date-fns`/`dayjs`, `lodash`→native/subpath, `axios`→`fetch`, `request`→หยุดใช้
2. flag deps ที่ใช้ 1-2 functions → พิจารณา inline หรือ lib เฉพาะทาง
3. ใช้ `/use-lib-better` เพื่อเทียบทางเลือกตาม tech stack
4. ใช้ `/follow-tool-node-modules-inspector` ดู size จริงของแต่ละ package

### 3. Replace And Remove

> Goal: เปลี่ยน deps ทีละตัวพร้อม verify

1. เปลี่ยนทีละ dependency — อย่าเปลี่ยนพร้อมกันหลายตัว
2. แก้ import/call sites — ใช้ `use-astgrep` หา usages ครบ
3. รัน package manager เพื่อ prune (`pnpm prune`, `bun install`, lockfile update)
4. รัน `/run-typecheck` + `/run-test` หลังแต่ละ replacement

### 4. Verify

> Goal: วัดผลลัพธ์

1. เทียบ install size, bundle size, dep count ก่อน-หลัง
2. ทำ `/check-bundle-regression` สำหรับ frontend bundle
3. ใช้ `/report-before-after` แสดง savings

## Rules

### 1. Verify Each Replacement

- ทุก replacement ต้อง typecheck + test ผ่าน ก่อนไปตัวถัดไป
- ห้ามลบ dep ที่มี transitive consumers — ตรวจ `pnpm why`/`npm ls` ก่อน

### 2. Compatibility Aware

- เช็ค API parity ก่อนเปลี่ยน — ระบุ behavioral differences (เช่น date formatting)
- ตรวจ license และ maintenance status ของ lib ใหม่ (`/review-dependencies`)

### 3. Minimal Scope

- แก้เฉพาะ deps ที่มี evidence ว่าหนัก/ซ้ำ/ไม่ได้ใช้ — ไม่ rewrite ทั้ง dep tree
- ถ้า dep หนักแต่จำเป็น → ลดผ่าน subpath imports หรือ lazy loading (`/optimize-imports`)

## Expected Outcome

- Dependencies ที่ซ้ำ/ไม่ใช้/หนักถูกลบหรือแทนที่
- Install size และ bundle size ลดลงพร้อมตัวเลข
- Tests/typecheck ผ่านทุก replacement
