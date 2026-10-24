---
name: follow-lib-unhead
description: Use Unhead v3 for reactive document head, SEO meta, SSR rendering, and script loading
argument-hint: "[scope]"
related:
  - follow-lib-vue
  - follow-lib-react
  - follow-lib-solidjs
  - follow-create-web-nuxt
  - follow-create-web-nextjs
  - follow-create-web-svelte
  - follow-tool-vitepress
  - follow-web-standard
  - improve
---

## Goal

Manage the document head with Unhead — one reactive source of truth for title, meta, links, and scripts across client navigation and SSR, with deduplication, priority, and streaming built in

## Scope

For any JS/TS app that renders HTML and needs `<head>` tags — Vue, React, Solid, Svelte, Angular, or a framework-agnostic renderer

- Boundary: Unhead owns head tags and script loading; page content, routing, and data fetching stay with the framework (`/follow-lib-vue`, `/follow-lib-react`, `/follow-create-web-nuxt`)
- Boundary: Nuxt already ships Unhead — use its injected `useHead`/`useSeoMeta`, never add a second copy
- Boundary: Next.js App Router projects use its native Metadata API unless head logic is shared with another framework
- Boundary: Schema.org structured data → `@unhead/schema-org`; semantic HTML and native document APIs → `/follow-web-standard`
- Latest: `unhead@3.4.3` and every `@unhead/*` package at the same version (verified 2026-10-24); v3 is ESM-only and needs Node 20+

## Execute

### 1. Choose The Package

> Goal: install the smallest package that matches the framework

1. Framework-agnostic client → `unhead` (imports from `unhead/client`); server rendering → `unhead/server`
2. Vue → `@unhead/vue` (`/client`, `/server` subpaths); React → `@unhead/react`; Solid → `@unhead/solid-js`; Svelte → `@unhead/svelte`; Angular → `@unhead/angular`
3. Build-time helpers (auto-import, tree-shaking) → `@unhead/bundler` (renamed from `@unhead/addons` in v3)
4. Structured data → `@unhead/schema-org` (`UnheadSchemaOrg`)
5. Keep every `@unhead/*` package on the exact same version — mixed versions break the shared core
6. Full module map and import table → [references/apis.md](references/apis.md)

### 2. Create The Head Instance

> Goal: one instance per app, one per request on the server

1. Client: `const head = createHead()` from `unhead/client` (or the framework package)
2. Server: `createHead()` from `unhead/server` — a fresh instance per request, never a module singleton
3. Framework apps pass the instance through their own mechanism: Vue `app.use(head)`, React provider, Svelte context
4. Register plugins at creation: `createHead({ plugins: [...] })`
5. Never create the instance inside a component, request handler loop, or render function

```ts
import { createHead } from '@unhead/vue/client'

export const head = createHead({ plugins: [] })
```

### 3. Register Head Entries

> Goal: declare tags once, reactively, with stable identity

1. `useHead({ title, meta, link, script, htmlAttrs, bodyAttrs })` — reactive values are tracked automatically (Vue refs/computed; React/Solid getters)
2. `useSeoMeta({ title, description, ogTitle, ogDescription, ogImage, twitterCard, ... })` for SEO/social tags — it maps flat keys to the right `name`/`property`
3. `useHeadSafe(...)` when any value can come from user input or remote data — it allowlists safe tags and attributes
4. Give each entry a stable `key` — v3 replaced `hid`/`vmid` with `key` for deduplication
5. Order with `tagPriority` (`'critical' | 'high' | 'low' | number`) or per-tag `tagPriority`
6. `body: true` is gone — use `tagPosition: 'bodyClose'` for body tags
7. Imperative outside a component: `head.push({ ... })` returns a handle with `dispose()` — dispose on unmount
8. Later entries with the same identity override earlier ones; do not fight that with manual DOM writes

### 4. SSR And Hydration

> Goal: the server sends complete head tags and the client adopts them

1. Render once per request after the app has finished rendering: `const payload = renderSSRHead(head)` — synchronous in v3
2. Inject the payload: `htmlAttrs` on `<html>`, `bodyAttrs` on `<body>`, `headTags` in `<head>`, `bodyTags`/`bodyTagsOpen` in the body
3. Streaming: `createStreamableHead`, `wrapStream`, `prepareTemplate`, `renderSSRHeadSuspenseChunk` from `unhead/stream/server`
4. Never hand-merge head strings — the payload carries deduplication, priority, and escaping
5. On the client, create the instance before hydration renders so entries match server output
6. Full payload shape and hook contracts → [references/apis.md](references/apis.md)

### 5. Load Third-Party Scripts

> Goal: one loader for analytics, widgets, and SDKs

1. `useScript(url, { use: () => window.sdk })` from the framework package (or `unhead/scripts`) — dedupes repeated calls
2. Call the API immediately through `script.proxy.method()` — calls are queued and replayed once the SDK resolves
3. `script.status` / `script.onLoaded()` expose load state for UI that depends on the SDK
4. Never add `<script>` tags by hand next to a `useScript` call

### 6. Plugins And Hooks

> Goal: extend the pipeline at one named point

1. `defineHeadPlugin({ key, hooks })` from `unhead/plugins`
2. Hooks: `tags:resolve` (rewrite the tag set), `ssr:render` (before serialization), `ssr:rendered` (after serialization, mutate `ctx.html`)
3. `TemplateParamsPlugin` and `AliasSortingPlugin` are no longer on by default in v3 — register them explicitly if the project relies on `%param%` templates or alias ordering
4. During a v2→v3 migration add `ValidatePlugin` from `unhead/plugins` to warn about removed properties; remove it once clean
5. Plugin order matters — later plugins see earlier plugin output

### 7. Migrate From v2

> Goal: mechanical renames, no compatibility shims

1. Run `unhead migrate --dry-run` first, then `unhead migrate` — it fixes the mechanical renames
2. Core renames: `children` → `innerHTML`, `hid`/`vmid` → `key`, `body: true` → `tagPosition: 'bodyClose'`
3. Composable renames: `useServerHead`/`useServerHeadSafe`/`useServerSeoMeta` → `useHead`/`useHeadSafe`/`useSeoMeta`
4. Entry points: `createHeadCore` → `createHead` from `unhead/client` or `unhead/server`; `extractUnheadInputFromHtml` → `parseHtmlForUnheadExtraction` from `unhead/parser`
5. Types: `Head`, `MetaFlatInput`, `RuntimeMode` → `SerializableHead`, `MetaFlat`
6. Drop the legacy compat plugin and legacy imports — v3 removed the compatibility behaviors rather than keeping them
7. Per-package diff and remaining manual steps → [references/migration-v3.md](references/migration-v3.md)

### 8. Verify

> Goal: prove the rendered head matches what was declared

1. Client: inspect `<head>` after navigation — exactly one title, one canonical, no duplicated meta
2. SSR: request the page with JS disabled and confirm the same tags exist in the HTML source
3. Check social tags with a preview tool only after SSR is confirmed working
4. Run the project's typecheck and lint; then `/run-check`
5. UI change → `/deep-test website` against the running app

## Rules

### 1. One Instance

- One head instance per app; one per request on the server — never a shared module singleton in SSR
- Dispose `head.push()` handles when their owner unmounts

### 2. Never Hand-Write Tags

- No manual `document.title`, `document.head.appendChild`, or template `<head>` tags when Unhead owns the page
- Identity comes from `key`; tags with the same identity are deduplicated by design

### 3. Safety

- User input or remote content in head values → `useHeadSafe`, never raw `useHead`
- Never put secrets, tokens, or personal data into a head entry — everything there is public HTML
- Script loading goes through `useScript`, not string-concatenated `<script>` content

### 4. Correctness

- SSR and client must produce the same entries; a client-only entry is a hydration mismatch
- `renderSSRHead` is synchronous in v3 — do not `await` it
- v3 is ESM-only; a CJS build or `require()` import is a broken install, not a fallback

### 5. Version Discipline

- All `@unhead/*` packages share one version; upgrade them together
- Never mix a v2 package with a v3 core
- Nuxt: do not install Unhead — its composables are already provided

### 6. Route Elsewhere

- Framework rendering and component details → `/follow-lib-vue`, `/follow-lib-react`, `/follow-lib-solidjs`
- App scaffolding → `/follow-create-web-nuxt`, `/follow-create-web-nextjs`, `/follow-create-web-svelte`
- Docs-site head configuration → `/follow-tool-vitepress`
- SEO/head findings in an existing UI → `/improve uxui`

## Use Cases

| Scenario | Use case |
|----------|----------|
| Add reactive title/meta to an SPA | `usecases/spa-head-setup.md` |
| Render head tags during server-side rendering | `usecases/ssr-render.md` |
| Put untrusted or CMS content into meta tags | `usecases/safe-user-content.md` |
| Load an analytics or widget SDK with API proxying | `usecases/third-party-scripts.md` |
| Use Unhead inside Nuxt without a second copy | `usecases/nuxt.md` |

## References

- [Module map and API surface](references/apis.md)
- [v2 → v3 migration](references/migration-v3.md)
- [Best practices](best-practices/unhead.md)

## Expected Outcome

- The right `@unhead/*` package installed at one shared version
- One head instance per app (per request on the server), with plugins registered at creation
- Title, meta, links, and scripts declared through `useHead`/`useSeoMeta`/`useHeadSafe`/`useScript`
- SSR payload injected from `renderSSRHead` with no hand-merged HTML
- A v2 project migrated with `unhead migrate` and the renamed properties verified
