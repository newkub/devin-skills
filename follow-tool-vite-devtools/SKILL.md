---
name: follow-tool-vite-devtools
description: Set up and build integrations on Vite DevTools (`@vitejs/devtools` + DevTools Kit) per official docs
argument-hint: "[setup-or-kit-scope]"
related:
  - use-wrikka-vite-devtools
  - follow-tool-vite
  - follow-tool-vite-plugins
  - follow-tool-devfra
  - follow-tool-vitest
  - follow-tool-rolldown
  - follow-my-techstack
  - run-dev
  - resolve-errors
  - check-types-definition
---

## Goal

Enable Vite DevTools in a Vite project and create/port integrations into the dock via DevTools Kit (`Plugin.devtools.setup`) per official docs <https://devtools.vite.dev/>

## Scope

Use for work involving the Vite ecosystem devtools framework

- Install/configure `@vitejs/devtools` in `vite.config.ts` (`apply`, `embeddedVisibility`, `dockPreferences`)
- When there is no HTML entry → use the client injector from the browser entry
- Ship DevTools with the app build (`build.withApp`, `build.injection`, `/__devtools/`)
- Use built-in integrations — Rolldown, Vite, Vitest, Oxc
- Write Vite plugins that mount UI into the dock via `devtools.setup`
- Port a Devframe app into the hub with `createPluginFromDevframe`
- Option details/API matrix → `references/apis.md`

## Execute

### 1. Install

> Goal: land on versions Vite DevTools actually supports

1. Upgrade Vite to 8.3+ — `"vite": "^8.3.0"` in `package.json` (do `/follow-tool-vite`; pin versions per the `/follow-my-techstack` catalog)
2. Install the main package `bun add -D @vitejs/devtools` (docs use `pnpm add -D`; swap pm per project)
3. To author your own integration → `bun add -D @vitejs/devtools-kit`
4. Verify actual installed versions before using new APIs — all packages release together (see `### 7. Version Notes`)

### 2. Enable In Config

> Goal: open the dock in both dev and build

1. Add `devtools: true` in `defineConfig` — this shorthand mode enables both `vite dev` and `vite build`
2. To limit it to specific commands → use the object form with `apply` (`'all'` default, `'serve'`, `'build'`)
3. Run the dev server and confirm the dock appears; if it does not → see `### 6. Troubleshooting`

### 3. Tune The Dock UI

> Goal: keep the dock as unobtrusive as the team wants

1. Set `embeddedVisibility` — `'normal'` shows immediately (default), `'passive'` stays hidden until `Shift + Alt + D` and remembers, `'hidden'` uses the same shortcut but does not remember
2. Set `dockPreferences.defaultMode` / `defaultPosition` for the initial layout (e.g. `'edge'` + `'bottom'`)
3. Values the user changes inside DevTools itself override `dockPreferences` — do not set values that fight the default behaviour

### 4. Projects Without An HTML Entry

> Goal: get the dock even when Vite does not serve HTML

1. If the app is a JS-only entry / backend integration / middleware mode → import the injector from the browser entry instead of config
2. Pick exactly one entry per visibility mode: `@vitejs/devtools/client/inject` (normal), `client/inject-passive` (passive), `client/inject-hidden` (hidden)
3. Type declarations for these subpaths are not finished — add `// @ts-expect-error` on the import temporarily and remove it once upstream ships types

### 5. Ship DevTools With The Build

> Goal: get static DevTools next to the app output

1. Set `devtools: { apply: 'build', build: { withApp: true } }` to write DevTools files beside the app build (`build.outDir` overridable, Vite default otherwise)
2. The full-page UI lives at `/__devtools/`; embed the dock in the built app by loading `/__devtools/embedded.js`
3. To show the dock inside the built app → `build.injection: true` (default `false` and it requires `build.withApp: true`)
4. After deploy you must also serve the assets under the Vite `base`, otherwise the dock 404s
5. Confirm with `/deep-test website` or `/use-agent-browser` that the `/__devtools/` route really opens in the deployed build

### 6. Use Built-in Integrations

> Goal: use the tools already shipped instead of writing your own

1. Rolldown (`@vitejs/devtools-rolldown`) — module graph/chunk/asset/treemap/flamegraph, plugin hook cost, package duplication, session compare (do `/follow-tool-rolldown`)
2. Vite (`@vitejs/devtools-vite`) — plugin inspector + module transforms in pipeline order (do `/follow-tool-vite`)
3. Vitest (`@vitejs/devtools-vitest`) — test UI in the dock; the dock appears only when the project has `vitest`; launching installs `@vitest/ui` and runs `vitest --ui` as an iframe (do `/follow-tool-vitest`)
4. Oxc (`@vitejs/devtools-oxc`) — oxlint/oxfmt inspector + ESLint/Prettier/Biome migration; runs standalone via `npx @vitejs/devtools-oxc`; if Vite Plus is detected it runs through `vp`
5. Integrations not yet in the project appear as a launcher in the dock — pressing it installs on demand, then restart the dev server; ones already present mount automatically

### 7. Version Notes

> Goal: cite verified data, not memory

- `@vitejs/devtools`, `-kit`, `-vite`, `-rolldown`, `-vitest`, `-oxc` release in lockstep: stable `0.7.6` (published 2026-09-25, ≥7 days) / latest `0.8.0` (2026-10-14) — MIT, VoidZero Inc. & Vite Contributors (verified 2026-10-15)
- `0.8.0` breaking change: json-render moved from `@vitejs/devtools-kit` into `@vitejs/devtools` (vitejs/devtools#604) — on `0.8.x` import the renderer from the core package
- The `devtools-vite` upstream is still marked "work in progress" — do not hang anything critical on it
- Reference error codes when kit/rolldown breaks: DTK00xx (Kit) and RDDT00xx (Rolldown) on the docs Error Reference page
- Docs: `https://devtools.vite.dev/guide/` (Getting Started, Chrome Extension), `/kit/` (Kit), `/rolldown/`, `/vite/`, `/vitest/`, `/oxc/`, `/errors/`

## Rules

### 1. Choose The Right Layer

- Writing a plain Vite plugin → use `Plugin.devtools.setup` directly (docks, terminals, palette, custom renderers all live here)
- Already have a Devframe definition → use `createPluginFromDevframe(def, { setup })` from `@vitejs/devtools-kit/node`; the dock iframe comes automatically from `id`/`name`/`icon`/`basePath` — no plugin to write yourself
- Need a tool with zero Vite dependency (CLI/MCP/static dashboard) → go to `follow-tool-devfra`, which is the layer beneath the Kit
- Layer order: Vite DevTools → `@vitejs/devtools-kit` (hub: dock, palette, terminals, `devtools.setup`) → Devframe (framework-neutral)

### 2. Config Discipline

- With `devtools: true` set, test both `dev` and `build` before merge — this shorthand enables both
- Use `apply: 'serve'` for projects that must not ship devtools with the build
- `build.injection` only works when `build.withApp: true`; always write the config in this order
- Never hardcode the `/__devtools/` path in app code — read Vite's `base` and compose the URL

### 3. Integration Authoring

- Add `/// <reference types="@vitejs/devtools-kit" />` to the plugin file so the `devtools` hook is typed
- Register a dock with `ctx.docks.register({ id, title, icon, type, url })` — `id` must be stable because users bookmark it
- Pick the dock `type` by job: `iframe` (own UI), `action` (trigger button), `custom` (renderer), `launcher` (install on demand), `json-render` (spec from data; on `0.8.0`+ ships from `@vitejs/devtools`, not the Kit)
- Use `ctx.commands.register({ id, title, handler })` for the command palette; gate with when-clauses when not always available
- Kit RPC uses birpc + valibot; state across server↔client is patch-synced shared state (see `references/apis.md`)
- If you publish to GitHub → add the `vite-devtools` tag as the docs ask, so the ecosystem listing sees it

### 4. Boundaries With Other Skills

- General dev server/build config → `/follow-tool-vite`; plugin authoring → `/follow-tool-vite-plugins` / `/follow-create-vite-plugin`; this skill covers only the devtools layer
- Projects using the `wrikka-vite-devtools` plugin (`/use-wrikka-vite-devtools`) already have their own devtools hub on Devframe — do not stack `@vitejs/devtools` on top and end up with two docks by accident; to consolidate, mount through a single `createPluginFromDevframe`

### 5. Quality Gates

- Verify the real schema before using any option — `/check-types-definition` on the `devtools` type from Vite/Kit, or `/follow-tool-vite` when unsure
- After a config change → run `/run-dev` and verify the dock in a real browser, not just logs
- If build/CI breaks because of devtools → `/resolve-errors`; look up the error code (DTK/RDDT) in the docs before guessing

- See best-practices/ for recommended patterns and pitfalls

## Expected Outcome

1. `vite.config.ts` enables Vite DevTools deliberately (`apply`, visibility, dock layout), not a leftover shorthand
2. Projects without an HTML entry still get the dock via the client injector matching the mode
3. Built-in integrations (Rolldown/Vite/Vitest/Oxc) are used correctly and the right layer is chosen when authoring a new integration
4. Authored/ported integrations mount into the one system dock without colliding with each other
5. Every claim cites verified docs/npm versions (stable `0.7.6`, latest `0.8.0`), not memory
