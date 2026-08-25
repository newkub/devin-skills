---
name: follow-awesome-rolldown-lib
description: สรุป libraries ที่สร้างด้วย Rolldown bundler
---

## Goal

สรุป libraries ที่สร้างด้วย Rolldown bundler เพื่อเป็น reference

## Scope

ใช้สำหรับ reference เมื่อต้องการเลือก library ที่สร้างด้วย Rolldown

## Execute

### 1. tsdown (rolldown/tsdown)

> Goal: อ้างอิง bundler หลักสำหรับสร้าง library ด้วย Rolldown

- Description: The elegant bundler for libraries powered by Rolldown
- Stars: 4.1k
- Features: Blazing fast build, TypeScript support, plugin ecosystem
- Use Case: Library bundling for TypeScript projects

### 2. rolldphobia (ssssota/rolldphobia)

> Goal: อ้างอิงเครื่องมือวิเคราะห์ bundle size ที่ใช้ Rolldown

- Description: A modern bundle size analyzer powered by Rolldown and esm.sh
- Features: Browser-based bundling, real bundle analysis
- Use Case: Bundle size analysis tools

### 3. vitejs/rolldown-vite

> Goal: อ้างอิง package สำหรับทดสอบ Rolldown กับ Vite ก่อนเปลี่ยนไป Vite 8

- Description: Vite with Rolldown as bundler (archived)
- Status: Archived — merged into Vite 8. ใช้สำหรับ migration จาก Vite 7 เป็น Vite 8
- Use Case: Gradual migration path to Vite 8

### 4. cloudflare/agents

> Goal: อ้างอิง production application ที่ใช้ tsdown สำหรับ bundling

- Description: Cloudflare Agents project using tsdown
- Features: Uses tsdown for library bundling
- Use Case: Production application

### 5. Rolldown Official Packages

> Goal: อ้างอิง official packages ของ Rolldown ecosystem

- `rolldown` - Main bundler package
- `@rolldown/browser` - Browser-compatible WASM distribution
- `@rolldown/pluginutils` - Shared utilities for plugin development
- `@rolldown/debug` - Debug utilities
- `@rolldown/binding-*` - Platform-specific native bindings (15+ packages)

### 6. rolldown-require

> Goal: อ้างอิงเครื่องมือโหลด config หลายรูปแบบสำหรับ Rolldown

- Description: Load configuration files of any format for Rolldown
- Features: Support CommonJS, .mjs, TypeScript configs
- Use Case: Configuration file loading

### 7. Built-in Plugins

> Goal: อ้างอิง built-in plugins ที่มาพร้อม Rolldown

- General: BundleAnalyzerPlugin, ReplacePlugin, IsolatedDeclarationPlugin, EsmExternalRequirePlugin
- Vite Compatibility: ViteResolvePlugin, ViteJsonPlugin, ViteManifestPlugin, ViteReporterPlugin, ViteAliasPlugin, ViteImportGlobPlugin

### 8. Community Plugins

> Goal: อ้างอิง community plugins ที่ขยายความสามารถของ Rolldown

- rolldown-plugin-dts (sxzz/rolldown-plugin-dts) - Plugin สำหรับ generate type definitions
- rolldown-plugin-require-cjs - Plugin สำหรับ CJS require support
- rolldown-plugin-node-polyfills - Polyfill Node.js built-ins for Rolldown
- rollup-plugin-bundle-stats - Analyze Rollup/Vite/Rolldown bundle stats

## Rules

### 1. Verification

- ตรวจสอบว่า library ใช้ Rolldown จริงๆ
- ตรวจสอบว่า library ยัง active อยู่
- รวมเฉพาะ libraries ที่มี public repositories

### 2. Organization

- จัดเรียงตาม popularity และ relevance
- อัพเดท list เป็นระยะ
- เชื่อมโยงกับ `/follow-tool-rolldown`

## Expected Outcome

- List ของ libraries ที่สร้างด้วย Rolldown
- Categorization ตามประเภทและ use case
- Reference สำหรับการเลือกใช้ libraries
- Up-to-date information ตาม maintenance status