---
name: follow-tool-vite-plugins-unified
description: unplugin ecosystem catalog — universal plugins that work across Vite/Rollup/Webpack/esbuild/Rolldown
argument-hint: "[plugin-or-need]"
related:
  - follow-tool-vite-plugins
  - follow-tool-vite
  - follow-tool-rolldown
---

## Goal

Pick and set up universal plugins from the unplugin ecosystem — written once, they work across Vite, Rollup, Webpack, esbuild, Rolldown

## Scope

Use when you want a plugin not tied to a single framework — auto-import, icons, components, console, cross-bundler transforms

## Execute

### 1. Plugin Catalog

> Goal: pick from the maintained list

| Plugin | Purpose | Note |
|--------|---------|------|
| `unplugin` (unjs) | core — build your own universal plugin | all plugins below are built on it |
| `unplugin-auto-import` | auto-import APIs (vue/react/composables) on-demand | config `imports: ['vue' \| 'react']`, gen `auto-imports.d.ts` |
| `unplugin-vue-components` | auto component registration (Vue) | resolvers: element-plus, naive, primevue, etc. |
| `unplugin-icons` | icons as components — all iconify collections | `~icons/`, `i-` prefix |
| `unplugin-turbo-console` | enhanced console — jump to source, inspect | dev-only, DX boost |
| `unplugin-vue-router` | type-safe file-based routing (Vue) | replaces `vite-plugin-pages`, which is less active |
| `unplugin-swc` | SWC transform across bundlers | alternative if you don't want to rely on Oxc |
| `unplugin-fonts` | font loading (google/local) | `unplugin-fonts/vite` |
| `unplugin-info` | build info banner | metadata embed |
| `unplugin-preprocessor-directives` | `#if` conditional compilation | build-level feature flags |
| `unplugin-unused` | find unused exports/files | dead-code audit |

### 2. Setup Pattern

> Goal: correct config

```ts
// vite.config.ts
import AutoImport from 'unplugin-auto-import/vite'
import Icons from 'unplugin-icons/vite'

export default defineConfig({
  plugins: [
    AutoImport({ imports: ['vue'], dts: 'src/auto-imports.d.ts' }),
    Icons({ compiler: 'vue3' }), // or 'jsx', 'solid', 'svelte'
  ],
})
```

1. Always import from the `<plugin>/vite` subpath (not the root)
2. auto-import/components must generate `.d.ts` — commit or gitignore per the docs
3. dev-only plugins (turbo-console) — wrap with `apply: 'serve'` or an env check

### 3. Verify

> Goal: the plugin works in dev + build

1. `bunx vite` — check the generated files (`auto-imports.d.ts`, `components.d.ts`)
2. `bunx vite build` — passes with no plugin warnings
3. Check bundle size — auto-import should not pull in the whole lib (tree-shaking works)

## Rules

- unplugin-* works on every bundler — if the project is Vite-only it still works; pick by feature, not because it's "universal"
- Always import via the `/vite` subpath
- dev-only plugins must never run in the build — use `apply: 'serve'`
- `unplugin-icons` requires installing `@iconify-json/<set>` for each icon set separately
- Rolldown-Vite: unplugins are supported, but if a plugin uses Rollup-specific hooks, check the changelog

- Use /follow-tool-vite if needed
- Use `/follow-tool-vite-plugins frontend-lib` for framework-specific plugins

## Expected Outcome

- The chosen plugin works in dev+build with types generated
- No duplicate transform or dev-only leak into production
