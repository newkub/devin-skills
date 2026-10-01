---
name: follow-tool-vite-plugins-frontend-lib
description: Framework และ frontend Vite plugins catalog — react, vue, svelte, css, assets, routing, PWA, platform
argument-hint: "[plugin-or-need]"
related:
  - follow-tool-vite-plugins
  - follow-tool-vite
  - follow-create-web
---

## Goal

เลือกและ setup Vite plugins ฝั่ง frontend — framework adapters, styling, assets, routing, PWA, dev tools

## Scope

ใช้เมื่อต้องการ plugin เฉพาะ framework/frontend — universal plugins (`unplugin-*`) → `/follow-tool-vite-plugins unified`

## Execute

### 1. Plugin Catalog

> Goal: เลือกจากรายการที่ maintained — จัดกลุ่มตามหมวด

**Framework adapters**

| Plugin | Purpose |
|--------|---------|
| `vite-plugin-react` (@vitejs) | all-in-one React — Fast Refresh + JSX (official successor ของ plugin-react/plugin-react-swc) |
| `vite-plugin-react-swc` | React + SWC — ถ้าต้องการ SWC แทน Oxc |
| `vite-plugin-svelte` | Svelte/SvelteKit — official sveltejs |
| `@vitejs/plugin-vue` | Vue 3 — official |
| `solid-start` / `vite-plugin-solid` | Solid — ตาม `/follow-create-web-solid` |
| `vite-plugin-laravel` (laravel) | Laravel backend integration |
| `fastify-vite` | Fastify SSR integration |

**Routing / meta-framework**

| Plugin | Purpose |
|--------|---------|
| `vite-plugin-pages` | file-based routes generator |
| `unplugin-vue-router` | type-safe routing (ดู unified) — ใช้แทน vite-plugin-pages ถ้า Vue |
| `vike` | full-stack meta-framework — replaces Next/Nuxt |
| `vinext` (cloudflare) | Next.js API surface บน Vite — deploy anywhere |
| `one` (onejs) | React web + React Native unified |
| `iles` | islands-architecture site generator |
| `tanstack-start` | TanStack Start — Nitro powered (ดู `/follow-solid-framework`) |

**Styling / CSS**

| Plugin | Purpose |
|--------|---------|
| `@unocss/vite` | UnoCSS — instant atomic CSS engine |
| `vite-plugin-windicss` | ตายแล้ว — migrate ไป UnoCSS |
| `tailwindcss` (v4+) | ใช้ `@tailwindcss/vite` plugin official |

**Assets / media**

| Plugin | Purpose |
|--------|---------|
| `vite-plugin-image-optimizer` | optimize images (sharp + svgo) ตอน build |
| `vite-imagetools` | transform images ด้วย import directives (`?w=300&format=webp`) |
| `vite-plugin-svg-icons` | SVG sprite generation |
| `unplugin-icons` | icon components (ดู unified) |
| `vite-plugin-singlefile` | inline JS+CSS เป็น HTML เดียว — embed/offline apps |

**DX / tooling**

| Plugin | Purpose |
|--------|---------|
| `vite-plugin-checker` | TypeScript/ESLint/vue-tsc/Stylelint checks ใน dev overlay |
| `vite-plugin-inspect` | inspect intermediate plugin state — debug transforms |
| `vite-plugin-vue-devtools` | Vue DevTools integration |
| `code-inspector` (zh-lx) | click DOM → open IDE ที่ source location |
| `vite-plugin-mcp` | MCP server ให้ model เข้าใจ Vite app |
| `vite-plugin-csp-guard` | CSP headers/meta management |
| `vite-plugin-vue-preview` | Vue SFC preview |

**Platform / packaging**

| Plugin | Purpose |
|--------|---------|
| `vite-plugin-pwa` | zero-config PWA (Workbox) — manifest + SW |
| `@crxjs/vite-plugin` | Chrome extension build + HMR |
| `vite-plugin-web-extension` | web extension dev (cross-browser) |
| `vite-plugin-electron` | Electron + Vite |
| `vite-plugin-node` | run node dev server ผ่าน Vite HMR |
| `vite-plugin-monkey` | userscript dev (Tampermonkey ฯลฯ) |
| `vite-plugin-federation` / `module-federation/vite` | module federation micro-frontend |
| `builder-vite` (storybook) | Storybook builder |
| `vite-plugin-rsw` / `vite-plugin-wasm-pack` | Rust/WASM via wasm-pack |

### 2. Setup Pattern

> Goal: config ถูกต้อง

1. `bun add -D <plugin>` — pin เผยแพร่ ≥7 วัน
2. เพิ่มใน `plugins: [...]` — official adapter (`vite-plugin-react` ฯลฯ) มักอยู่ตำแหน่งแรก/ตาม docs
3. plugin ที่มี framework peer → install framework ก่อน
4. Type augmentation files (`.d.ts`) — commit หรือ gitignore ตาม convention project

### 3. Verify

> Goal: dev + build ผ่าน

1. `bunx vite` — plugin output ทำงาน (SW registered, sprites generated, checker overlay)
2. `bunx vite build` — production ผ่าน; inspect bundle ถ้า plugin แตะ chunking
3. ทำ `/report` ถ้า setup หลาย plugin พร้อมกัน

## Rules

- เลือก official adapter ก่อน (`@vitejs/plugin-*`, `sveltejs/*`) — community plugin เมื่อ official ไม่มี
- Plugin ที่ตายแล้วห้ามใช้: `vite-plugin-windicss` → `@unocss/vite`; `vite-plugin-pages` (Vue) → `unplugin-vue-router`
- Platform plugins (electron/extension/pwa) — ทำตาม official guide ของ plugin, ห้ามเดา config
- 1 งาน = 1 plugin — ห้ามซ้อน `vite-plugin-svg-icons` + `unplugin-icons`, `image-optimizer` + `imagetools`
- Vite 8/Rolldown — เช็ค compat; plugin ที่ mutate Rollup internals ต้องหา compatible version หรือรอ upstream (ไม่มี `rolldown-vite` fork แล้ว — Vite 8 คือ Rolldown)

- ใช้ `/follow-tool-vite` สำหรับ config หลัก
- ใช้ `/follow-tool-vite-plugins unified` สำหรับ `unplugin-*`
- ใช้ `/search-github-star`, `/search-raindrop` อัปเดต catalog เมื่อเจอ plugin ใหม่

## Expected Outcome

- Plugin ที่เลือก maintained + ทำงานใน dev+build
- ไม่มี plugin ซ้ำซ้อนหรือ dead plugin ใน config
