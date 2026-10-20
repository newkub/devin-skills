---
name: follow-tool-vite-plugins-frontend-lib
description: Framework and frontend Vite plugins catalog — react, vue, svelte, css, assets, routing, PWA, platform
argument-hint: "[plugin-or-need]"
related:
  - follow-tool-vite-plugins
  - follow-tool-vite
  - follow-create-web
---

## Goal

Pick and set up frontend-side Vite plugins — framework adapters, styling, assets, routing, PWA, dev tools

## Scope

Use when you need a framework/frontend-specific plugin — universal plugins (`unplugin-*`) → `/follow-tool-vite-plugins unified`

## Execute

### 1. Plugin Catalog

> Goal: pick from the maintained list — grouped by category

`Framework adapters`

| Plugin | Purpose |
|--------|---------|
| `vite-plugin-react` (@vitejs) | all-in-one React — Fast Refresh + JSX (official successor to plugin-react/plugin-react-swc) |
| `vite-plugin-react-swc` | React + SWC — if you want SWC instead of Oxc |
| `vite-plugin-svelte` | Svelte/SvelteKit — official sveltejs |
| `@vitejs/plugin-vue` | Vue 3 — official |
| `solid-start` / `vite-plugin-solid` | Solid — per `/follow-create-web-solid` |
| `vite-plugin-laravel` (laravel) | Laravel backend integration |
| `fastify-vite` | Fastify SSR integration |

`Routing / meta-framework`

| Plugin | Purpose |
|--------|---------|
| `vite-plugin-pages` | file-based routes generator |
| `unplugin-vue-router` | type-safe routing (see unified) — replaces vite-plugin-pages for Vue |
| `vike` | full-stack meta-framework — replaces Next/Nuxt |
| `vinext` (cloudflare) | Next.js API surface on Vite — deploy anywhere |
| `one` (onejs) | React web + React Native unified |
| `iles` | islands-architecture site generator |
| `tanstack-start` | TanStack Start — Nitro powered (see `/follow-solid-framework`) |

`Styling / CSS`

| Plugin | Purpose |
|--------|---------|
| `@unocss/vite` | UnoCSS — instant atomic CSS engine |
| `vite-plugin-windicss` | dead — migrate to UnoCSS |
| `tailwindcss` (v4+) | use the official `@tailwindcss/vite` plugin |

`Assets / media`

| Plugin | Purpose |
|--------|---------|
| `vite-plugin-image-optimizer` | optimize images (sharp + svgo) at build time |
| `vite-imagetools` | transform images via import directives (`?w=300&format=webp`) |
| `vite-plugin-svg-icons` | SVG sprite generation |
| `unplugin-icons` | icon components (see unified) |
| `vite-plugin-singlefile` | inline JS+CSS into a single HTML — embed/offline apps |

`DX / tooling`

| Plugin | Purpose |
|--------|---------|
| `vite-plugin-checker` | TypeScript/ESLint/vue-tsc/Stylelint checks in the dev overlay |
| `vite-plugin-inspect` | inspect intermediate plugin state — debug transforms |
| `vite-plugin-vue-devtools` | Vue DevTools integration |
| `code-inspector` (zh-lx) | click DOM → open IDE at the source location |
| `vite-plugin-mcp` | MCP server so a model understands the Vite app |
| `vite-plugin-csp-guard` | CSP headers/meta management |
| `vite-plugin-vue-preview` | Vue SFC preview |

`Platform / packaging`

| Plugin | Purpose |
|--------|---------|
| `vite-plugin-pwa` | zero-config PWA (Workbox) — manifest + SW |
| `@crxjs/vite-plugin` | Chrome extension build + HMR |
| `vite-plugin-web-extension` | web extension dev (cross-browser) |
| `vite-plugin-electron` | Electron + Vite |
| `vite-plugin-node` | run a node dev server through Vite HMR |
| `vite-plugin-monkey` | userscript dev (Tampermonkey, etc.) |
| `vite-plugin-federation` / `module-federation/vite` | module federation micro-frontend |
| `builder-vite` (storybook) | Storybook builder |
| `vite-plugin-rsw` / `vite-plugin-wasm-pack` | Rust/WASM via wasm-pack |

### 2. Setup Pattern

> Goal: correct config

1. `bun add -D <plugin>` — pin a version published ≥7 days ago
2. Add to `plugins: [...]` — the official adapter (`vite-plugin-react`, etc.) usually goes first / per docs
3. A plugin with a framework peer → install the framework first
4. Type augmentation files (`.d.ts`) — commit or gitignore per project convention

### 3. Verify

> Goal: dev + build pass

1. `bunx vite` — the plugin output works (SW registered, sprites generated, checker overlay)
2. `bunx vite build` — production passes; inspect the bundle if the plugin touches chunking
3. Do `/report` if setting up several plugins at once

## Rules

- Pick the official adapter first (`@vitejs/plugin-*`, `sveltejs/*`) — community plugins only when no official one exists
- Dead plugins are never used: `vite-plugin-windicss` → `@unocss/vite`; `vite-plugin-pages` (Vue) → `unplugin-vue-router`
- Platform plugins (electron/extension/pwa) — follow the plugin's official guide, never guess the config
- 1 job = 1 plugin — never stack `vite-plugin-svg-icons` + `unplugin-icons`, `image-optimizer` + `imagetools`
- Vite 8/Rolldown — check compat; a plugin mutating Rollup internals needs a compatible version or an upstream fix (no `rolldown-vite` fork anymore — Vite 8 is Rolldown)

- Use `/follow-tool-vite` for the main config
- Use `/follow-tool-vite-plugins unified` for `unplugin-*`
- Use `/search-github-star`, `/search-raindrop` to update the catalog when a new plugin appears

## Expected Outcome

- The chosen plugin is maintained and works in dev+build
- No duplicate or dead plugin in the config
