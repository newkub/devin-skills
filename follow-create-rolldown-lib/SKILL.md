---
name: follow-create-rolldown-lib
description: ตั้งค่าและใช้งาน Rolldown bundler สำหรับ libraries
---

## Goal

ใช้ Rolldown bundler สำหรับสร้าง JavaScript/TypeScript libraries ด้วยความเร็วสูง

## Execute

### 1. Install Rolldown

1. ติดตั้งด้วย `bun add -D rolldown`
2. ตรวจสอบ version ด้วย `rolldown --version`
3. ตรวจสอบ CLI options ด้วย `rolldown --help`

### 2. Create Config File

1. สร้าง config file (.js, .cjs, .mjs, .ts, .mts, หรือ .cts)
2. ใช้ `defineConfig` helper สำหรับ type safety
3. ตั้งค่า `input` และ `output` options
4. เพิ่ม config ลงใน npm scripts ด้วย `rolldown -c`

### 3. Configure Build Options

1. ตั้งค่า `external` สำหรับ dependencies
2. ตั้งค่า `plugins` สำหรับ custom transformations
3. ตั้งค่า `minify` สำหรับ production builds
4. ตั้งค่า `sourcemap` สำหรับ debugging
5. ตั้งค่า `declaration` สำหรับ TypeScript types

### 4. Use Native Plugins

1. ใช้ `BundleAnalyzerPlugin` สำหรับ analyze bundle size
2. ใช้ `ReplacePlugin` สำหรับ replace variables
3. ใช้ `IsolatedDeclarationPlugin` สำหรับ generate types
4. ใช้ Vite compatibility plugins ถ้าจำเป็น

### 5. Build and Bundle

1. รัน `bun run build` สำหรับ production builds
2. รัน `bun run dev` สำหรับ development
3. ตรวจสอบ output ใน `dist/` directory
4. ตรวจสอบ type declarations ถ้ามี

### 6. Optimize Performance

1. ใช้ `@rolldown/browser` สำหรับ WASM builds
2. ใช้ native bindings สำหรับ platform-specific optimizations
3. ตั้งค่า `treeshake` สำหรับ dead code elimination
4. ใช้ `code splitting` สำหรับ large libraries

## Rules

### Library Bundler Choice

สำหรับ TypeScript libraries ให้ใช้ `tsdown` แทน direct Rolldown

### Configuration

ใช้ `defineConfig` helper สำหรับ type safety และ auto-completion

### Dependencies

ตั้งค่า `external` สำหรับ dependencies ทั้งหมดเพื่อไม่ bundle ลงไป

### TypeScript

สร้าง type declarations เสมอสำหรับ TypeScript libraries

### Optimization

ใช้ minification สำหรับ production builds และตรวจสอบ bundle size

### Debugging

ใช้ sourcemaps สำหรับ debugging ใน development

### Related Workflows

สำหรับ library bundling ที่ง่ายกว่า ใช้ `/follow-tsdown`

## Expected Outcome

- Libraries ที่เร็วขึ้นด้วย Rust-based bundler
- TypeScript declarations ที่ถูกต้อง
- Bundle sizes ที่เล็กลงด้วย tree-shaking
- Compatible กับ Rollup/Vite plugin ecosystem
- Cross-platform builds ด้วย native bindings
