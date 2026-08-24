---
name: follow-awesome-rolldown-lib
description: สรุป libraries ที่สร้างด้วย Rolldown bundler
---

## Goal

สรุป libraries ที่สร้างด้วย Rolldown bundler เพื่อเป็น reference

## Scope

ใช้สำหรับ reference เมื่อต้องการเลือก library ที่สร้างด้วย Rolldown

## Execute

### 1. Libraries
> Goal: Libraries

### 1. tsdown (rolldown/tsdown)
> Goal: tsdown (rolldown/tsdown)

- Description: The elegant bundler for libraries powered by Rolldown
- Stars: 3.8k
- Features: Blazing fast build, TypeScript support, plugin ecosystem
- Use Case: Library bundling for TypeScript projects

### 2. rolldphobia (ssssota/rolldphobia)
> Goal: rolldphobia (ssssota/rolldphobia)

- Description: A modern bundle size analyzer powered by Rolldown and esm.sh
- Features: Browser-based bundling, real bundle analysis
- Use Case: Bundle size analysis tools

### 3. vitejs/rolldown-vite
> Goal: vitejs/rolldown-vite

- Description: Vite with Rolldown as bundler (WIP)
- Status: Temporary package for Vite 7 to Vite 8 migration
- Use Case: Testing Rolldown with Vite

### 4. cloudflare/agents
> Goal: cloudflare/agents

- Description: Cloudflare Agents project using tsdown
- Features: Uses tsdown for library bundling
- Use Case: Production application

### 5. Rolldown Official Packages
> Goal: Rolldown Official Packages

- `rolldown` - Main bundler package
- `@rolldown/browser` - Browser-compatible WASM distribution
- `@rolldown/pluginutils` - Shared utilities for plugin development
- `@rolldown/debug` - Debug utilities
- `@rolldown/binding-*` - Platform-specific native bindings (15+ packages)

### 6. rolldown-require
> Goal: rolldown-require

- Description: Load configuration files of any format for Rolldown
- Features: Support CommonJS, .mjs, TypeScript configs
- Use Case: Configuration file loading

### 7. Built-in Plugins
> Goal: Built-in Plugins

- General: BundleAnalyzerPlugin, ReplacePlugin, IsolatedDeclarationPlugin, EsmExternalRequirePlugin
- Vite Compatibility: ViteResolvePlugin, ViteJsonPlugin, ViteManifestPlugin, ViteReporterPlugin, ViteAliasPlugin, ViteImportGlobPlugin

### 8. Community Plugins
> Goal: Community Plugins

- rolldown-plugin-dts (sxzz/rolldown-plugin-dts) - Plugin สำหรับ generate type definitions
- rolldown-plugin-require-cjs - Plugin สำหรับ CJS require support
- rolldown-plugin-node-polyfills - Polyfill Node.js built-ins for Rolldown
- rollup-plugin-bundle-stats - Analyze Rollup/Vite/Rolldown bundle stats

## Rules

1. ตรวจสอบว่า library ใช้ Rolldown จริงๆ
2. ตรวจสอบว่า library ยัง active อยู่
3. จัดเรียงตาม popularity และ relevance
4. รวมเฉพาะ libraries ที่มี public repositories
5. อัพเดท list เป็นระยะ
6. เชื่อมโยงกับ `/follow-rolldown`

## Expected Outcome

- List ของ libraries ที่สร้างด้วย Rolldown
- Categorization ตามประเภทและ use case
- Reference สำหรับการเลือกใช้ libraries
- Up-to-date information ตาม maintenance status
