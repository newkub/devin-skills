---
name: follow-package-manifest
description: ตั้งค่า scripts ใน package.json หรือ Cargo.toml ตามมาตรฐาน
allowed-tools:
  - read
  - edit
  - grep
  - glob
  - exec
triggers:
  - user
  - model
---

## Goal

ตั้งค่า scripts ใน `package.json` หรือ `Cargo.toml` ตามมาตรฐานที่กำหนด รองรับทั้ง Minimal, Standard และ Complete levels

## Scope

ตั้งค่า scripts สำหรับ packages และ workspaces ใน monorepo

## Execute

### 1. Check Prerequisites

1. รัน `/ship` เพื่อตรวจสอบและจัดโครงสร้างโปรเจกต์ให้ถูกต้อง
2. ตรวจสอบว่ามี `package.json` หรือ `Cargo.toml`
3. ยืนยันว่า tools จำเป็นติดตั้งแล้ว (`biome`, `vitest`)
4. ตรวจสอบว่า project structure เหมาะสมสำหรับการรัน `run-verify`

### 2. Select Template Level

1. ประเมินขนาดและความซับซ้อนของโปรเจกต์
2. เลือกระดับตามความเหมาะสม:
   - Minimal (Default): โปรเจกต์ส่วนใหญ่, เน้น pragmatic
   - Standard: ต้องการ testing และ dependency management เพิ่มเติม
   - Complete: เฉพาะ infra/tooling team, ต้องการ benchmark และ performance testing

### 3. Apply Scripts Template

เลือกระดับ scripts ตามความเหมาะสมกับโปรเจกต์:

Minimal (Default): โปรเจกต์ส่วนใหญ่, เน้น pragmatic
- dev, build, typecheck, lint, format, test, verify, ci

Standard: ต้องการ testing และ dependency management เพิ่มเติม
- Minimal + test:watch, test:coverage, deps:analyze, clean

Complete: เฉพาะ infra/tooling team, ต้องการ benchmark และ performance testing
- Standard + prepare, build:watch, typecheck:watch, test:integration, test:e2e, bench, prerelease, release

ตัวอย่าง `package.json` (Minimal - Default):

```json
{
  "scripts": {
    "dev": "bun run src/index.ts",
    "build": "bun build",
    "typecheck": "tsc --noEmit",
    "lint": "biome check",
    "format": "biome check --write",
    "test": "vitest run",
    "verify": "bun run lint && bun run typecheck && bun run test",
    "ci": "bun run verify && bun run build"
  }
}
```

ตัวอย่าง `package.json` (Standard):

```json
{
  "scripts": {
    "dev": "bun run src/index.ts",
    "build": "bun build",
    "typecheck": "tsc --noEmit",
    "lint": "biome check",
    "format": "biome check --write",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "deps:analyze": "bunx depcheck",
    "clean": "bunx rimraf node_modules",
    "verify": "bun run lint && bun run typecheck && bun run test",
    "ci": "bun run verify && bun run build"
  }
}
```

ตัวอย่าง `package.json` (Complete - Infra/Tooling Team):

```json
{
  "scripts": {
    "prepare": "bunx lefthook install",
    "dev": "bun run src/index.ts",
    "build": "bun build",
    "build:watch": "bun build --watch",
    "typecheck": "tsc --noEmit",
    "typecheck:watch": "tsc --noEmit --watch",
    "lint": "biome check",
    "format": "biome check --write",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "test:integration": "vitest run --config vitest.integration.config.ts",
    "test:e2e": "vitest run --config vitest.e2e.config.ts",
    "deps:analyze": "bunx depcheck",
    "clean": "bunx rimraf node_modules",
    "bench": "bunx mitata",
    "prerelease": "bun run build",
    "release": "auto-it",
    "verify": "bun run lint && bun run typecheck && bun run test",
    "ci": "bun run verify && bun run build"
  }
}
```

### 4. Validate Scripts

1. ตรวจสอบว่า scripts ถูกต้องตาม syntax
2. ยืนยันว่า commands ทำงานได้จริง
3. ทดสอบรัน `bun run verify` เบื้องต้น
4. ยืนยันว่ามี script `prepare` สำหรับ Lefthook (ใน Complete template)
5. ตรวจสอบว่า scripts สอดคล้องกับ `run-verify` workflow

## Rules

### 1. Template Selection

เลือกระดับ template ตามขนาดและความซับซ้อนของโปรเจกต์

### 2. Scripts Levels

Scripts ตามระดับ:
- Minimal (Default): dev, build, typecheck, lint, format, test, verify, ci
- Standard: Minimal + test:watch, test:coverage, deps:analyze, clean
- Complete: Standard + prepare, build:watch, typecheck:watch, test:integration, test:e2e, bench, prerelease, release

### 3. Core Scripts Table

หมายเหตุสำคัญ: Nuxt module ใช้ `build:module` (ไม่ใช่ `build`) เพราะเป็น Nuxt layer ที่ไม่ต้อง build แยก และ Nuxt module ที่ใช้ tsdown สำหรับ bundling library

| Task | Bun | Nuxt | Vite-React | Rust |
|------|-----|------|------------|------|
| dev | bun run src/index.ts | nuxt dev | vite | cargo run |
| build | bun build | nuxt build | vite build | cargo build |
| typecheck | tsc --noEmit | nuxt typecheck | tsc --noEmit | cargo check |
| format | biome check --write | biome check --write | biome check --write | cargo fmt |
| lint | biome check | biome check | biome check | cargo clippy |
| test | vitest run | vitest run | vitest run | cargo test |
| verify | lint && typecheck && test | lint && typecheck && test | lint && typecheck && test | cargo clippy && cargo check && cargo test |
| ci | verify && build | verify && build | verify && build | verify && build |

### 4. Advanced Scripts Table

หมายเหตุ: Scripts เหล่านี้ใช้เฉพาะใน Complete template (infra/tooling team)

| Task | Bun | Nuxt | Vite-React | Rust |
|------|-----|------|------------|------|
| build:watch | bun build --watch | nuxt build --watch | vite build --watch | cargo build --watch |
| typecheck:watch | tsc --noEmit --watch | nuxt typecheck --watch | tsc --noEmit --watch | cargo watch -x check |
| test:watch | vitest | vitest | vitest | cargo test |
| test:coverage | vitest run --coverage | vitest run --coverage | vitest run --coverage | cargo test |
| test:integration | vitest run --config vitest.integration.config.ts | vitest run --config vitest.integration.config.ts | vitest run --config vitest.integration.config.ts | cargo test --test-dir integration |
| test:e2e | vitest run --config vitest.e2e.config.ts | vitest run --config vitest.e2e.config.ts | vitest run --config vitest.e2e.config.ts | cargo test --test-dir e2e |
| deps:analyze | bunx depcheck | bunx depcheck | bunx depcheck | cargo outdated |
| clean | bunx rimraf node_modules | bunx rimraf node_modules | bunx rimraf node_modules | cargo clean |
| prepare | bunx lefthook install | bunx lefthook install | bunx lefthook install | bunx lefthook install |
| bench | bunx mitata | bunx mitata | bunx mitata | cargo bench |
| prerelease | bun run build | bun run build | bun run build | cargo build |
| release | auto-it | auto-it | auto-it | cargo release |

### 5. Table Consistency

Script Commands Tables ต้องสอดคล้องกับ `package.json` example เสมอ หากมีการเปลี่ยนแปลงใดๆ ต้องอัพเดตทั้งสองส่วนพร้อมกัน

### 6. Verify Pipeline

Verify Pipeline ตามมาตรฐาน `run-verify`:

| Script | Definition | Note |
|--------|------------|------|
| verify | lint && typecheck && test | Fail-fast ordering (lint fastest) |
| ci | verify && build | Build gate |

### 7. Execution Guidelines

- ใช้ `bun run verify` ใน GitHub Actions สำหรับการตรวจสอบคุณภาพโค้ด (fail-fast ordering)
- ใช้ `bun run ci` สำหรับ task ที่ต้องการ build ด้วย
- ใช้ `bun turbo run verify --filter=...[origin/main]` สำหรับการตรวจสอบเฉพาะที่เปลี่ยนแปลงใน monorepo
- Execution Order: pre-commit (lint), pre-push (verify), CI (ci), Local dev (dev)
- hk hooks จะรันอัตโนมัติก่อน commit, push, rebase (ต้องรัน `/follow-hk` ก่อน)
- ลำดับการทำงาน: Prepare → Update Dependencies → Setup Verify → Setup hk → Scan → Lint → Format → Build → Test → Dev → Verify
- Script Composition Layer: สำหรับ monorepo ขนาดใหญ่ ควรพิจารณาใช้ turbo, justfile, หรือ makefile สำหรับ reuse และ scale

## Expected Outcome

- `package.json` มี scripts ตาม template ที่เลือก (Minimal/Standard/Complete)
- Scripts สอดคล้องกับ tech stack ของโปรเจกต์
- Verify pipeline ทำงานได้ถูกต้องตามมาตรฐาน `run-verify` ด้วย fail-fast ordering
- รองรับการทำงานทั้ง local development และ CI/CD
- Tables sync กับ examples อย่างสมบูรณ์
- Pragmatic และ production-ready สำหรับโปรเจกต์ส่วนใหญ่
