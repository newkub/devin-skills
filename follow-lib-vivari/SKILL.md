---
name: follow-lib-vivari
description: Embed Vivari's in-browser WebContainer — boot, VFS, spawn, preview, isolation
argument-hint: "[framework] [preview-mode]"
related:
  - follow-lib-tanstack-ecosystem
  - follow-lib-tanstack-db
  - follow-lib-tanstack-store
  - follow-lib-tanstack-ai
  - follow-tool-vite
  - follow-service-cloudflare
---

## Goal

Run Node, Bun, and Python projects entirely inside the browser with Vivari — a virtual filesystem, a Node-compatible runtime, a process model, and virtual networking in Web Workers, with no server doing the work

## Scope

For apps that need to execute arbitrary project code client-side: playgrounds, live docs, in-browser IDEs, "open this repo and run it" flows, agent-generated app previews

- Boundary: Vivari runs code; it is **not** a UI kit and **not** a reactive store. UI state → `/follow-lib-tanstack-store`; client-side collections → `/follow-lib-tanstack-db`; agent transport → `/follow-lib-tanstack-ai`
- Boundary: for a static, prebuilt preview use a normal iframe/sandbox — Vivari is only worth its boot cost when the project must actually install and run
- Latest verified: `@vivari/core@1.1.2`, `@vivari/react@1.1.2` (2026-10-23), MIT
- **No Solid/Vue/Svelte bindings ship today** — only `@vivari/core` (framework-agnostic) and `@vivari/react`. Any other framework wraps the core API
- References: [API reference](references/apis.md), [Best Practices](best-practices/vivari.md)

## Execute

### 1. Check Isolation Before Anything

> Goal: fail fast on the one requirement that cannot be worked around

1. Vivari's synchronous FS/process bridge uses `SharedArrayBuffer` + `Atomics.wait()`, which browsers expose only on a **cross-origin isolated** page. Serve the page **and** the preview Service Worker with:

   ```text
   Cross-Origin-Opener-Policy: same-origin
   Cross-Origin-Embedder-Policy: require-corp
   ```

2. Call `isCrossOriginIsolated()` (exported from `@vivari/core`) to render a real "headers missing" state — do not boot and wait for a spinner that never resolves
3. `Vivari.boot()` rejects with `VivariError("ERR_NOT_ISOLATED")` before starting any worker; branch on `err.code`, never on message text
4. Host `sw.js` from the same `@vivari/core` version — `serviceWorkerUrl` defaults to `/sw.js`; pass `false` to disable previews entirely

### 2. Boot, Mount, Run

> Goal: get a project running and read its output

1. `bun add @vivari/core` (React bindings: `bun add @vivari/react @vivari/core react` — `@vivari/core` is a **peer**, never let two copies exist)
2. `const vivari = await Vivari.boot({ timeout: 30_000 })`
3. `await vivari.mount(fileSystemTree)` — WebContainer-compatible shape (`{ path: { file: { contents } } }`), applied atomically in one batch
4. `const proc = await vivari.spawn("node", ["index.js"])`; `proc.output` is merged stdout+stderr, `proc.stdout`/`proc.stderr` are split views of the same chunks (reading one does not consume the other); `await proc.exit` gives the code
5. Kill processes on unmount/route change — a leaked process holds a worker slot and keeps the preview port bound

### 3. Preview A Dev Server

> Goal: show the in-VM app

1. `vivari.attachPreview(iframe)` once, then `await vivari.once("server-ready")` — **not** `"port"`. A dev server binds, closes, and rebinds several times while booting; `"server-ready"` fires once, after the port actually answers
2. Set `iframe.src` to the returned URL, or use `vivari.previewUrl(port, pathAndQuery?)`
3. Re-point the frame on every `server-ready` so restarts reconnect; reload via a key bump, never by remounting (a remount drops the HMR socket)
4. Isolate previews on a separate origin (`previewOrigin`) or per-port origins (`previewWildcardDomain`) when the preview must not share the host origin

### 4. Framework Integration (No Bindings)

> Goal: use the core API from any framework

1. Treat `Vivari.boot()` as an effect: one shared instance per page, ref-counted by consumers, torn down when the last one unmounts
2. Expose it through framework state (Solid: `createSignal`/`createStore`; Vue: `shallowRef`; Svelte: a store) with a discriminated `status`: `idle | booting | ready | error | unsupported`
3. Gate the import behind a dynamic `import("@vivari/core")` so the kernel assets stay out of the initial bundle and pages without a playground never pay for them
4. For a file editor, mirror the VFS through `vivari.fs.readFile`/`writeFile` with a debounce — the kernel reports every change with no coalescing, so a single `npm install` fires thousands of `fs.watch` events. Debounce before touching the DOM
5. React apps can use `@vivari/react` directly (`<Vivari>`, `useVivari`, `useSpawn`, `useVivariFile`, `useVivariDir`) — see [API reference](references/apis.md)

### 5. Compose With TanStack

> Goal: keep runtime, state, data, and AI transport separate

1. **Runtime** = Vivari (execute the generated project); **UI state** = TanStack Store (phases, streaming, selection); **collections** = TanStack DB (persisted sessions/versions); **model transport** = TanStack AI adapter
2. Never mirror the VFS into a store wholesale — keep the authoritative files in the VFS and store only paths, dirty flags, and UI state
3. Persist session metadata with TanStack DB `localStorageCollectionOptions`; rehydrate the VFS on load with `vivari.mount()` from the persisted tree
4. Generation pipeline: AI adapter streams text → parse into files → `vivari.fs.writeFile` → run install/dev server → report exit codes to the UI

## Rules

### 1. Isolation Is Non-Negotiable

- Never ship Vivari to a page without COOP/COEP. A nested iframe does not inherit its embedder's policy — every document you frame needs its own `require-corp` response
- Cross-origin subresources (fonts, analytics, CDN scripts, images) need `Cross-Origin-Resource-Policy: cross-origin` or CORS, or they will be blocked under `require-corp`
- On Chromium only, a framed app can self-isolate with `Document-Isolation-Policy: isolate-and-require-corp`; other browsers still need host headers. If you pass `documentIsolationPolicy` to `boot()`, the page must really be served with that header
- Scope the headers by path when a marketing site shares the origin — isolation is contagious upward, not downward

### 2. Lifecycle Discipline

- One kernel per page unless deliberately isolated by `instanceKey`; a second kernel costs an entire worker tree
- `autoBoot: false` for anything below the fold — do not spend a kernel on a visitor who never scrolls
- Always `kill()` spawned processes and close `fs.watch` handles on teardown; use `AbortSignal` on `boot()`, `spawn()`, and `mount()`
- Version-lock `@vivari/core` and `sw.js` together — a mismatched Service Worker silently corrupts previews

### 3. Performance

- `compress: true` (default) keeps a large `node_modules` around ~70% smaller in RAM — do not disable it casually
- Stream `onOutput` into a terminal; never accumulate `npm install` output into reactive state per chunk
- Debounce file writes and directory reads (100–250 ms); `collect: true` for a `<pre>` only when the output is genuinely small
- Keep the kernel out of SSR: the React package reports `idle` on the server and renders nothing

### 4. Security

- In-VM code is untrusted by default. Do not hand it real tokens, cookies, or same-origin privileged APIs; keep secrets in the host and proxy through your own backend
- Previews are same-origin by default (mode A) — use `previewOrigin` or wildcard preview domains when preview code must be origin-isolated
- Never enable `devtools: true` unless you host `/vv-devtools/chobitsu.js`; a missing file 404s every preview
- Treat generated/imported projects as code execution: strip `postinstall` scripts you did not author before running `install`

### Use Cases

| Scenario | Use case |
|----------|----------|
| Add COOP/COEP to Vite, Cloudflare Pages, Netlify, Nginx, Express | `usecases/cross-origin-isolation.md` |
| Wrap the core API in a non-React framework (Solid) | `usecases/solid-runtime-adapter.md` |
| Combine Vivari with TanStack Store/DB/AI | `usecases/tanstack-composition.md` |
| Run a dev server and mount its preview | `usecases/dev-server-preview.md` |

## References

- [API reference](references/apis.md)
- [Best Practices](best-practices/vivari.md)

## Expected Outcome

- Cross-origin isolation verified before boot, with an honest unsupported state
- A single shared kernel, processes killed, watchers closed, previews re-pointed on restart
- Framework-agnostic adapter used where no bindings exist, with a discriminated status
- Vivari composed with TanStack Store/DB/AI instead of duplicating their responsibilities
