| key | value |
|---|---|
| packages | `@vitejs/devtools`, `-kit`, `-vite`, `-rolldown`, `-vitest`, `-oxc` — release in lockstep (same version) |
| install | `bun add -D @vitejs/devtools` (+ `bun add -D @vitejs/devtools-kit` to author integrations) |
| stable version | `0.7.6` (published 2026-09-25, ≥7 days) — latest `0.8.0` (2026-10-14, breaking: json-render Kit → core) |
| license | MIT — VoidZero Inc. & Vite Contributors |
| docs | https://devtools.vite.dev — `/guide/`, `/kit/`, `/rolldown/`, `/vite/`, `/vitest/`, `/oxc/`, `/errors/` (docs are a VitePress SPA — navigate kit sub-pages from `/kit/`) |
| repo | https://github.com/vitejs/devtools — publish integrations with the `vite-devtools` topic tag |
| requirement | Vite `^8.3.0` or newer |
| error codes | Kit `DTK00xx`, Rolldown `RDDT00xx` on the `/errors/` page |
| verified | 2026-10-15 (npm registry + GitHub releases + official docs) |

| api / option | description | values / default |
|---|---|---|
| `devtools: true` (shorthand) | enables both `vite dev` and `vite build` | off |
| `devtools.apply` | restrict to commands | `'all'` \| `'serve'` \| `'build'` — default `'all'` |
| `devtools.embeddedVisibility` | dock start-up visibility; `passive`/`hidden` toggle with `Shift + Alt + D` (`passive` remembers) | `'normal'` \| `'passive'` \| `'hidden'` — default `'normal'` |
| `devtools.dockPreferences.defaultMode` | initial dock layout; user changes in DevTools win | string (e.g. `'edge'`) |
| `devtools.dockPreferences.defaultPosition` | initial dock position | string (e.g. `'bottom'`) |
| `devtools.build.withApp` | write static DevTools beside the app build (`build.outDir` overridable) | `boolean` — default `false` |
| `devtools.build.injection` | show the dock inside the built app; requires `build.withApp: true` | `boolean` — default `false` |
| paths | full-page UI / embed script — compose from Vite `base`, never hardcode | `/__devtools/`, `/__devtools/embedded.js` |

| Package | Role |
|---------|------|
| `@vitejs/devtools` | main package, enabled via the `devtools` option; owns json-render since `0.8.0` |
| `@vitejs/devtools-kit` | integration hub — dock, palette, terminals, `Plugin.devtools.setup` |
| `@vitejs/devtools-rolldown` | build analysis (module graph, chunks, assets, plugins, treemap, session compare) |
| `@vitejs/devtools-vite` | plugin inspector + module transforms (upstream: "work in progress") |
| `@vitejs/devtools-vitest` | Vitest UI in the dock |
| `@vitejs/devtools-oxc` | Oxlint/Oxfmt inspector — runs standalone via `bunx @vitejs/devtools-oxc` |

| Client injector subpath | Mode (use when Vite does not serve HTML — JS-only entry, middleware, backend) |
|-------------------------|------------------------------------------------------------------------------|
| `@vitejs/devtools/client/inject` | normal — shows the dock immediately |
| `@vitejs/devtools/client/inject-passive` | passive — hidden until the shortcut, then remembered |
| `@vitejs/devtools/client/inject-hidden` | hidden — hidden every session |
| (types) | declarations not shipped yet — `// @ts-expect-error` temporarily |

| Kit feature (`Plugin.devtools.setup(ctx)`) | API | What it is for |
|--------------------------------------------|-----|----------------|
| Dock | `ctx.docks.register({ id, title, icon, type, url })` | types `iframe`, `action`, `custom`, `launcher`, `json-render` (core since `0.8.0`); plus categories, when-clauses, remote dock |
| Commands | `ctx.commands.register({ id, title, handler })` | shared palette + keybindings + children + when-gating |
| RPC | via Kit (Devframe birpc + valibot) | bidirectional type-safe server↔client |
| Shared State | patch-synced | bridge server ↔ client across every integration |
| Streaming | Kit streaming | chunk feeds |
| Messages | toasts + unified messages dock | cross-tool notifications |
| Terminals | aggregation | consolidate output from every integration into one panel |
| Diagnostics | structured | error reporting (DTK error codes) |
| Isomorphic Views | embedded panels / browser extension / standalone webpage | deploy one UI across many surfaces |

| api | description | signature/example |
|---|---|---|
| `createPluginFromDevframe` | mount a Devframe definition into the Vite dock; Kit synthesises the iframe entry from `id`/`name`/`icon`/`basePath` | `createPluginFromDevframe(def, { setup(ctx) { ctx.commands.register({ id, title, handler }) } })` from `@vitejs/devtools-kit/node` |

| Integration | Behaviour |
|-------------|-----------|
| Not present in project | shows as a dock launcher — pressing installs on demand, then restart the dev server |
| Already present | mounts automatically |
| Vitest | dock appears when the project depends on `vitest`; launching installs `@vitest/ui` and runs `vitest --ui` as an iframe |
| Oxc | standalone via `bunx @vitejs/devtools-oxc`; if Vite Plus is detected, oxlint/oxfmt run through `vp` |

| Layer | Package | Scope |
|-------|---------|-------|
| Vite DevTools | `@vitejs/devtools` | ecosystem framework, built-in integrations |
| DevTools Kit | `@vitejs/devtools-kit` | hub: dock, palette, terminals, `devtools.setup` |
| Devframe | `devframe` | framework-neutral: SPA, CLI, static, MCP — standalone tools use it directly (`/follow-tool-devfra`), not the Kit |

| Ecosystem user of Kit | Note |
|-----------------------|------|
| Nuxt DevTools v4 | dock integration |
| `@vitejs/devtools-oxc` | first-party, custom RPC functions |
| UnoCSS Inspector | dock integration |
| `vite-plugin-vue-tracer` | action button → DOM inspector |
