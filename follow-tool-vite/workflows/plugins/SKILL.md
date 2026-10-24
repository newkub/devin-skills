---
name: follow-tool-vite-plugins
description: Pick and set up Vite plugins — unified (unplugin ecosystem) and frontend-lib catalog
argument-hint: "[plugin-or-topic | unified | frontend-lib]"
related:
  - follow-tool-vite
  - follow-create-plugins
  - follow-create-vite-plugin
  - search-github-star
  - search-raindrop
  - report
---

## Goal

Pick the Vite plugin that fits the job and set it up in `vite.config.ts` — the catalog covers the unplugin ecosystem (`unified`) and framework/frontend plugins (`frontend-lib`)

## Scope

- Pick/setup a plugin for a Vite project — the plugin catalog lives in `workflows/`
- Create a new plugin → `/follow-create-plugins` or `/follow-create-vite-plugin`
- Vite core config (resolve/build/server) → `/follow-tool-vite`
- Catalog sources: `search-raindrop` bookmarks + `search-github-star` (vite-plugin by stars) + awesome-vite
- References: [Vite APIs for plugins](../../references/apis-plugins.md) — no `cli.md`: the catalog wraps no CLI of its own
- References: [Vite Plugins — Best Practices](../../best-practices/vite-plugins.md)

## Execute

### 1. Identify Need

> Goal: know what kind of plugin is needed

1. Read `vite.config.ts` + `package.json` — check the plugins already present (never duplicate)
2. Identify the category: framework adapter, auto-import, assets, PWA, DX tooling, platform (electron/extension/meta-framework)

### 2. Pick From Catalog

> Goal: pick a plugin that is maintained and fits the job

| Topic | Workflow |
|-------|----------|
| Universal plugins — work across bundlers (`unplugin-*` ecosystem) | `workflows/unified/SKILL.md` |
| Framework/frontend plugins — react, vue, svelte, css, assets, routing | `workflows/frontend-lib/SKILL.md` |

- Not in the catalog → do `/search-github-star` or `/search-raindrop` to find a maintained plugin (stars, last publish ≥7 days)

### 3. Install And Wire

> Goal: the plugin works in the config

1. `bun add -D <plugin>` — pin a version published ≥7 days ago
2. Add it to `plugins: [...]` in `vite.config.ts` per the official docs — always use option defaults first
3. Vite 8 (Rolldown) — check the plugin supports rolldown; if a plugin is tied to Rollup/Rollup hooks, check the compat layer
4. Type augmentation (e.g. auto-import `.d.ts`) → run dev once to generate

### 4. Verify And Report

> Goal: the plugin really works and doesn't break the build

1. Run `bunx vite` dev server — confirm no errors + the plugin output works
2. `bunx vite build` — the production build passes
3. Do `/report` table: `Plugin`, `Purpose`, `Version`, `Status`

### Use Cases

| Scenario | Use case |
|----------|----------|
| Order plugins and drop duplicates | `../../usecases/plugin-order-and-duplicates.md` |
| Check a plugin against Rolldown before committing | `../../usecases/rolldown-compat-check.md` |

## Rules

- Official/framework plugins first (`@vitejs/plugin-*`) — community plugins only when no official one exists
- Check maintenance — last publish ≥7 days, stars, open issues; a dead plugin (e.g. windicss → unocss) is never used
- Plugin order matters — auto-import/code-transform plugins come before the framework plugin per the docs
- Never add 2 plugins doing the same job (e.g. `vite-plugin-svgr` + `unplugin-icons` for svg)

- Use `/follow-tool-vite` for the main config
- Use `/search-github-star`, `/search-raindrop` to find plugins not in the catalog
- Use `/follow-create-plugins` if you must write a plugin yourself

## Expected Outcome

- The selected plugin is installed and works in dev + build
- No duplicate or unmaintained plugins
- A complete report with versions
