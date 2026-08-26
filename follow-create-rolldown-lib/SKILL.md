---
name: follow-create-rolldown-lib
description: ตั้งค่าและใช้งาน Rolldown bundler สำหรับ libraries
---

## Goal

ใช้ Rolldown bundler สำหรับสร้าง JavaScript/TypeScript libraries ด้วยความเร็วสูง

## Scope

ใช้ `follow-create-rolldown-lib` สำหรับ tasks และ workflows เฉพาะที่ครอบคลุม

## Execute

### 1. Install Rolldown

> Goal: ติดตั้ง Rolldown และตรวจสอบ version ที่ใช้งานได้

1. ติดตั้งด้วย `bun add -D rolldown`
2. ตรวจสอบ version ด้วย `rolldown --version`
3. ตรวจสอบ CLI options ด้วย `rolldown --help` — ดู [references/rolldown.md](references/rolldown.md) สำหรับรายละเอียด CLI usage

### 2. Create Config File

> Goal: สร้าง config file ที่มี type safety และตั้งค่า input/output

1. สร้าง config file (.js, .cjs, .mjs, .ts, .mts, หรือ .cts) — ดูตัวอย่างใน [references/rolldown.md](references/rolldown.md)
2. ใช้ `defineConfig` helper สำหรับ type safety
3. ตั้งค่า `input` และ `output` options
4. เพิ่ม config ลงใน npm scripts ด้วย `rolldown -c`

### 3. Configure Build Options

> Goal: กำหนด external, plugins, minify, sourcemap และ declaration สำหรับ library

1. ตั้งค่า `external` สำหรับ dependencies
2. ตั้งค่า `plugins` สำหรับ custom transformations
3. ตั้งค่า `minify` สำหรับ production builds
4. ตั้งค่า `sourcemap` สำหรับ debugging
5. ตั้งค่า `declaration` สำหรับ TypeScript types — ดู configuration options ใน [references/rolldown.md](references/rolldown.md)

### 4. Use Native Plugins

> Goal: เลือกใช้ built-in plugins ของ Rolldown สำหรับการ analyze และ transform

1. ใช้ `BundleAnalyzerPlugin` สำหรับ analyze bundle size
2. ใช้ `ReplacePlugin` สำหรับ replace variables
3. ใช้ `IsolatedDeclarationPlugin` สำหรับ generate types
4. ใช้ Vite compatibility plugins ถ้าจำเป็น — ดูรายการ built-in plugins ใน [references/rolldown.md](references/rolldown.md)

### 5. Build and Bundle

> Goal: สร้าง production build และตรวจสอบ output ใน `dist/`

1. รัน `bun run build` สำหรับ production builds
2. รัน `bun run dev` สำหรับ development
3. ตรวจสอบ output ใน `dist/` directory
4. ตรวจสอบ type declarations ถ้ามี

### 6. Optimize Performance

> Goal: ใช้ native bindings, treeshake และ code splitting เพื่อเพิ่มประสิทธิภาพ

1. ใช้ `@rolldown/browser` สำหรับ WASM builds
2. ใช้ native bindings สำหรับ platform-specific optimizations
3. ตั้งค่า `treeshake` สำหรับ dead code elimination
4. ใช้ `code splitting` สำหรับ large libraries

### 7. Ship

> Goal: ส่งมอบงาน

1. ทำ `/ship`
2. ถ้า `ship` ไม่ผ่าน → report สถานะ

## Rules

### 1. Library Bundler Choice

สำหรับ TypeScript libraries ให้ใช้ `tsdown` แทน direct Rolldown — ดูรายละเอียดใน [references/rolldown.md](references/rolldown.md)

### 2. Configuration

ใช้ `defineConfig` helper สำหรับ type safety และ auto-completion

### 3. Dependencies

ตั้งค่า `external` สำหรับ dependencies ทั้งหมดเพื่อไม่ bundle ลงไป

### 4. TypeScript

สร้าง type declarations เสมอสำหรับ TypeScript libraries

### 5. Optimization

ใช้ minification สำหรับ production builds และตรวจสอบ bundle size

### 6. Debugging

ใช้ sourcemaps สำหรับ debugging ใน development

### 7. Related Workflows

สำหรับ library bundling ที่ง่ายกว่า ใช้ `/follow-tool-tsdown`

## Expected Outcome

- Libraries ที่เร็วขึ้นด้วย Rust-based bundler
- TypeScript declarations ที่ถูกต้อง
- Bundle sizes ที่เล็กลงด้วย tree-shaking
- Compatible กับ Rollup/Vite plugin ecosystem
- Cross-platform builds ด้วย native bindings