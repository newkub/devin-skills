---
name: follow-tool-vite-plugins-unified
description: unplugin ecosystem catalog — universal plugins ที่ทำงานข้าม Vite/Rollup/Webpack/esbuild/Rolldown
argument-hint: "[plugin-or-need]"
related:
  - follow-tool-vite-plugins
  - follow-tool-vite
  - follow-tool-rolldown
---

## Goal

เลือกและ setup universal plugins จาก unplugin ecosystem — เขียนครั้งเดียวทำงานได้ทั้ง Vite, Rollup, Webpack, esbuild, Rolldown

## Scope

ใช้เมื่อต้องการ plugin ที่ไม่ผูก framework เดียว — auto-import, icons, components, console, cross-bundler transforms

## Execute

### 1. Plugin Catalog

> Goal: เลือกจากรายการที่ maintained

| Plugin | Purpose | Note |
|--------|---------|------|
| `unplugin` (unjs) | core — สร้าง universal plugin เอง | plugin ทั้งหมดข้างล่าง build บนตัวนี้ |
| `unplugin-auto-import` | auto-import APIs (vue/react/composables) on-demand | config `imports: ['vue' \| 'react']`, gen `auto-imports.d.ts` |
| `unplugin-vue-components` | auto component registration (Vue) | resolvers: element-plus, naive, primevue ฯลฯ |
| `unplugin-icons` | icons เป็น components — iconify collections ทั้งหมด | `~icons/`, `i-` prefix |
| `unplugin-turbo-console` | enhanced console — jump to source, inspect | dev-only, DX boost |
| `unplugin-vue-router` | type-safe file-based routing (Vue) | ตัวแทน `vite-plugin-pages` ที่ active กว่า |
| `unplugin-swc` | SWC transform ข้าม bundler | alternative ถ้าไม่อยากพึ่ง Oxc |
| `unplugin-fonts` | font loading (google/local) | `unplugin-fonts/vite` |
| `unplugin-info` | build info banner | metadata embed |
| `unplugin-preprocessor-directives` | `#if` conditional compilation | feature flags ระดับ build |
| `unplugin-unused` | หา unused exports/files | dead-code audit |

### 2. Setup Pattern

> Goal: config ถูกต้อง

```ts
// vite.config.ts
import AutoImport from 'unplugin-auto-import/vite'
import Icons from 'unplugin-icons/vite'

export default defineConfig({
  plugins: [
    AutoImport({ imports: ['vue'], dts: 'src/auto-imports.d.ts' }),
    Icons({ compiler: 'vue3' }), // หรือ 'jsx', 'solid', 'svelte'
  ],
})
```

1. import จาก `<plugin>/vite` subpath เสมอ (ไม่ใช่ root)
2. auto-import/components ต้อง gen `.d.ts` — commit หรือ gitignore ตาม docs
3. dev-only plugins (turbo-console) — wrap ด้วย `apply: 'serve'` หรือ env check

### 3. Verify

> Goal: plugin ทำงานใน dev + build

1. `bunx vite` — ดู generated files (`auto-imports.d.ts`, `components.d.ts`)
2. `bunx vite build` — ผ่านไม่มี warnings จาก plugin
3. เช็ค bundle size — auto-import ไม่ควรดึง lib ทั้งก้อน (tree-shake ทำงาน)

## Rules

- unplugin-* ทำงานได้ทุก bundler — ถ้า project เป็น Vite-only ก็ยังใช้ได้ เลือกตาม feature ไม่ใช่เพราะ "universal"
- import ผ่าน `/vite` subpath เสมอ
- dev-only plugins ห้ามรันใน build — ใช้ `apply: 'serve'`
- `unplugin-icons` ต้อง install `@iconify-json/<set>` ของชุดที่ใช้แยกต่างหาก
- Rolldown-Vite: unplugin รองรับแล้ว แต่ถ้า plugin ใช้ Rollup-specific hooks ให้เช็ค changelog

- ใช้ `/follow-tool-vite` สำหรับ config หลัก
- ใช้ `/follow-tool-vite-plugins frontend-lib` สำหรับ framework-specific plugins

## Expected Outcome

- Plugin ที่เลือกทำงานใน dev+build, types generated
- ไม่มี duplicate transform หรือ dev-only leak เข้า production
