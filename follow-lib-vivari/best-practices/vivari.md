# Vivari Best Practices

Source: https://vivari.run/docs (verified 2026-10-23), plus integration experience.

## 1. Isolation

- Serve the **top-level document** with `COOP: same-origin` + `COEP: require-corp`. A page is only isolated if its top-level document sends both.
- Iframes are the exception: a nested document does not inherit the embedder policy. Every framed document needs its own `require-corp` response, or you get the browser's "refused to connect" page.
- Under `require-corp`, every cross-origin subresource needs `Cross-Origin-Resource-Policy: cross-origin` or CORS. Audit fonts, analytics, CDN scripts, avatars, and images before shipping.
- Scope headers by path when a marketing site shares the origin. Isolation propagates upward, so only the embed route needs them.
- Chromium-only escape hatch for framed apps: `Document-Isolation-Policy: isolate-and-require-corp`. Other browsers still depend on host headers.
- Probe with `isCrossOriginIsolated()` and render an actionable "isolation headers missing" state. Do not boot first.

## 2. Boot

- `boot()` is expensive: kernel Worker + runtime Workers + VFS. Boot on intent (button, route, intersection), not on page load.
- One kernel per page. `@vivari/core` must exist exactly once — with React bindings it is a peer dependency. Two copies mean two `SharedArrayBuffer` worlds and the Service Worker registered twice.
- Always pass `timeout`; the default 60 s is long for a UI. 20–30 s is reasonable for a playground.
- Pass an `AbortSignal` so a route change mid-boot does not leak a kernel.
- `autoBoot: false` (React hook) for anything below the fold.
- Keep the kernel out of SSR: React modules are `"use client"`; `useVivari()` reports `idle` on the server and renders nothing.

## 3. Filesystem

- `mount()` is atomic and batched — prefer one mount over N `writeFile` calls.
- `vivari.fs` is the host control plane (read/write/stat/watch); in-VM code uses Node's own `fs`. Same VFS, different APIs. Do not expect `vivari.fs` to mirror Node's full surface.
- `fs.watch` reports every change with no coalescing: one `npm install` → thousands of events. Debounce (100–250 ms) and use one watcher per expanded directory.
- `stat()` throws `ENOENT` and has no `exists` field. Use `await fs.exists(path)` for a boolean.
- `rm`/`mkdir` default to `recursive: true`. Pass `false` explicitly when you need POSIX semantics.
- `export()` always skips `node_modules` and `.git`; check `truncated` before treating the result as a full tree.

## 4. Processes

- `spawn()` rejects with `ERR_COMMAND_NOT_FOUND` rather than returning a process that exits 127 — surface that error.
- `stdout` and `stderr` are independent views of the same chunks; reading one does not consume the other. Do not read both and concatenate.
- Stream `onOutput` into a terminal. Never accumulate per-chunk output into reactive state — `npm install` emits thousands of chunks and each one would re-render.
- Kill processes on unmount. A leaked process holds a worker slot and keeps preview ports bound.
- `exitCode` is synchronous (`null` while running); `await exit` for the final code. `-1` means the instance was torn down first.

## 5. Preview

- Wait for `"server-ready"`, never `"port"`. A dev server binds, closes, and rebinds while booting.
- Call `attachPreview(iframe)` — without it the inbound HMR/SSE tunnel is not wired and Vite HMR never gets past `[vite] connecting…`.
- Re-point the frame on every `server-ready` so restarts reconnect. Reload with a key bump; remounting drops the HMR socket.
- Same-origin previews (mode A) are the default and need no extra infrastructure. Use `previewOrigin` (mode B) or `previewWildcardDomain` (mode C) when preview code must not share your origin.
- `serviceWorkerUrl` must point at the `sw.js` from the installed `@vivari/core` version. Version skew corrupts previews.
- `devtools: true` requires hosting `/vv-devtools/chobitsu.js` at the same origin; otherwise every preview 404s.

## 6. Security

- In-VM code is untrusted. Never expose real tokens, cookies, or privileged same-origin APIs to it.
- Strip or review `postinstall` scripts from imported/generated projects before `npm install`.
- Preview or generated code that will run with user data belongs behind `previewOrigin`, not same-origin.
- Do not use `internal` — it is explicitly outside semver.

## 7. Composition

- Vivari runs code; it does not own UI state, collections, or model transport. Pair it with TanStack Store (UI state), TanStack DB (persisted collections), and TanStack AI (streaming adapter).
- Keep the file tree authoritative **in the VFS**. Store only paths, dirty flags, and UI selection in your state store; mirroring the whole tree causes drift.
- Persist a project snapshot with `vivari.export()` into your collection store, and rehydrate with `vivari.mount()` on load.
- Dynamic-import the SDK so pages without a playground never download the kernel assets.

## 8. Framework Adapters (Solid, Vue, Svelte)

- Wrap the core API in one module that owns the singleton, ref-counting, and teardown.
- Expose a discriminated status (`idle | booting | ready | error | unsupported`) so the UI can render the right state instead of a permanent spinner.
- Mirror `VivariFailure.phase` into the status message: `unsupported` ≠ `install` failure.
- Do not re-create the instance on every reactive re-run; boot inside an effect that depends only on an explicit trigger.
