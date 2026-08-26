---
name: follow-tool-rolldown
description: ใช้งาน Rolldown bundler และ ecosystem สำหรับ JavaScript/TypeScript
---

## Goal

ใช้งาน Rolldown สำหรับ bundle JavaScript/TypeScript ด้วยความเร็วสูง และอ้างอิง ecosystem ทีเกี่ยวข้อง

## Scope

ใช้สำหรับ:
- Bundle JavaScript/TypeScript ด้วยความเร็วสูง
- Migration จาก Rollup ไปยัง Rust-based bundler
- Code splitting และ tree-shaking
- Plugin system ที compatible กับ Rollup
- เลือก libraries, tools และ plugins ใน Rolldown ecosystem เป็น reference

## Execute

### Quick Start

ติดตั้งและเริ่มต้นใช้งาน:

```bash
bun add -D rolldown
```

สร้าง config file:

```typescript
import { defineConfig } from 'rolldown'

export default defineConfig({
  input: 'src/index.ts',
  output: {
    dir: 'dist',
    format: 'esm',
  },
})
```

Build project:

```bash
bunx rolldown
```

### Learning Path

1. `Getting Started`: อ่าน [Getting Started](https://rolldown.rs/guide/getting-started)
2. `Key Concepts`: เรียนรู้ [Three-stage Pipeline](https://rolldown.rs/guide/three-stage-pipeline)
3. `Best Practices`: ดู [Best Practices](https://rolldown.rs/guide/best-practices)
4. `Workflows`: ใช้ [workflows/setup-rolldown.md](workflows/setup-rolldown.md)

### Ecosystem And References

> Goal: อ้างอิง libraries, tools และ plugins ใน Rolldown ecosystem

#### 1. tsdown (rolldown/tsdown)

- Description: The elegant bundler for libraries powered by Rolldown
- Stars: 4.1k
- Features: Blazing fast build, TypeScript support, plugin ecosystem
- Use Case: Library bundling for TypeScript projects

#### 2. rolldphobia (ssssota/rolldphobia)

- Description: A modern bundle size analyzer powered by Rolldown and esm.sh
- Features: Browser-based bundling, real bundle analysis
- Use Case: Bundle size analysis tools

#### 3. vitejs/rolldown-vite

- Description: Vite with Rolldown as bundler (archived)
- Status: Archived — merged into Vite 8. ใช้สำหรับ migration จาก Vite 7 เป็น Vite 8
- Use Case: Gradual migration path to Vite 8

#### 4. cloudflare/agents

- Description: Cloudflare Agents project using tsdown
- Features: Uses tsdown for library bundling
- Use Case: Production application

#### 5. Rolldown Official Packages

- `rolldown` - Main bundler package
- `@rolldown/browser` - Browser-compatible WASM distribution
- `@rolldown/pluginutils` - Shared utilities for plugin development
- `@rolldown/debug` - Debug utilities
- `@rolldown/binding-*` - Platform-specific native bindings (15+ packages)

#### 6. rolldown-require

- Description: Load configuration files of any format for Rolldown
- Features: Support CommonJS, .mjs, TypeScript configs
- Use Case: Configuration file loading

#### 7. Built-in Plugins

- General: `BundleAnalyzerPlugin`, `ReplacePlugin`, `IsolatedDeclarationPlugin`, `EsmExternalRequirePlugin`
- Vite Compatibility: `ViteResolvePlugin`, `ViteJsonPlugin`, `ViteManifestPlugin`, `ViteReporterPlugin`, `ViteAliasPlugin`, `ViteImportGlobPlugin`

#### 8. Community Plugins

- `rolldown-plugin-dts` (sxzz/rolldown-plugin-dts) - Plugin สำหรับ generate type definitions
- `rolldown-plugin-require-cjs` - Plugin สำหรับ CJS require support
- `rolldown-plugin-node-polyfills` - Polyfill Node.js built-ins for Rolldown
- `rollup-plugin-bundle-stats` - Analyze Rollup/Vite/Rolldown bundle stats

## Rules

### 1. Usage

- ใช้ `bun add -D rolldown` สำหรับติดตั้ง
- ใช้ `bunx rolldown` สำหรับ build
- ใช้ `--watch` สำหรับ watch mode
- ใช้ `--config` สำหรับ config file
- ใช้ TypeScript สำหรับ config file (`rolldown.config.ts`)
- ใช้ `defineConfig` สำหรับ type safety

### 2. Ecosystem

- ตรวจสอบว่า library ใช้ Rolldown จริงๆ
- ตรวจสอบว่า library ยัง active อยู่
- รวมเฉพาะ libraries ทีมี public repositories
- จัดเรียงตาม popularity และ relevance
- อัปเดต list เป็นระยะ

## Expected Outcome

- JavaScript/TypeScript ที bundled ด้วยความเร็วสูง
- Migration จาก Rollup ที smooth
- Code splitting ที efficient
- Tree-shaking ที effective
- Plugin system ที compatible
- Performance ทีดีขึ้น 10-100x
- List ของ libraries ทีสร้างด้วย Rolldown พร้อม Categorization
- Reference สำหรับการเลือกใช้ libraries
- Up-to-date information ตาม maintenance status
