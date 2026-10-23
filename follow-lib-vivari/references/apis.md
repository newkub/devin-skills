# Vivari API Reference

Verified against https://vivari.run/docs (core-api, react, cross-origin-isolation) on 2026-10-23.

## Packages

| Package | Version | Notes |
|---------|---------|-------|
| `@vivari/core` | 1.1.2 | Framework-agnostic SDK — boot, mount, spawn, fs, preview |
| `@vivari/react` | 1.1.2 | React components/hooks; `@vivari/core` is a **peer** dependency |

MIT licensed. No Solid/Vue/Svelte bindings as of 1.1.2.

## Exports (`@vivari/core`)

| Export | Kind | Purpose |
|--------|------|---------|
| `Vivari` | class | `Vivari.boot(options?)` returns the instance |
| `VivariError` | class | Carries a machine-readable `code` |
| `isCrossOriginIsolated()` | function | Runtime isolation probe |
| `VivariProcess`, `FileSystemAPI` | types | Type-only exports |

### `Vivari.boot(options?)`

| Option | Type | Default | Notes |
|--------|------|---------|-------|
| `compress` | `boolean` | `true` | VFS whole-file compression (~70% less RAM) |
| `serviceWorkerUrl` | `string \| false` | `"/sw.js"` | Must match the installed core version; `false` disables previews |
| `workerName` | `string` | `"Vivari Kernel"` | DevTools label |
| `devtools` | `boolean` | `false` | Requires hosting `/vv-devtools/chobitsu.js` |
| `timeout` | `number` | `60000` | Rejects with `ERR_BOOT_TIMEOUT` |
| `signal` | `AbortSignal` | — | Rejects with `ERR_ABORTED` |
| `previewOrigin` | `string` | — | Serve previews from a separate origin (mode B) |
| `previewWildcardDomain` | `string` | — | Per-port origins `<token>--<port>.<domain>` (mode C) |
| `previewWildcardTag` | `string` | — | Hostname suffix for mode C |
| `previewPopout` | `"same-origin" \| "isolated"` | `"same-origin"` | Where "Open in new tab" lands in mode B |
| `documentIsolationPolicy` | `"isolate-and-require-corp" \| "isolate-and-credentialless" \| "none"` | probed | Mirrored onto same-origin previews (Chromium) |

Boot rejects with `ERR_NOT_ISOLATED`, `ERR_WORKER`, `ERR_BOOT_FAILED`, `ERR_BOOT_TIMEOUT`, or `ERR_ABORTED`.

### Instance methods

| Method | Signature | Notes |
|--------|-----------|-------|
| `mount` | `(tree, { mountPoint?, signal? })` | Atomic batched write of a WebContainer-shaped tree |
| `export` | `(path?, { exclude?, signal? })` | `{ files, truncated }`; always skips `node_modules` and `.git` |
| `spawn` | `(command, args?, { cwd?, env?, signal? })` | Rejects `ERR_COMMAND_NOT_FOUND` instead of a silent exit 127 |
| `attachPreview` | `(iframe)` | Runs the inbound HMR/SSE tunnel; without it Vite HMR never connects |
| `previewUrl` | `(port, pathAndQuery?)` | Replaces the removed module-level helper |
| `once` | `("server-ready")` → `[port, url]` | Fires once, after the port actually answers |
| `on` | `(event, listener)` | `"port"` fires per bind/rebind — not for readiness |
| `internal` | — | Outside semver; never build on it |

### `VivariProcess`

| Member | Type | Notes |
|--------|------|-------|
| `output` | `OutputStream` | Merged stdout + stderr, ANSI intact |
| `stdout` / `stderr` | `OutputStream` | Independent views of the same chunks |
| `input` | `WritableStream<string>` | Close to send EOF |
| `exit` | `Promise<number>` | `-1` if the instance was torn down first |
| `exitCode` | `number \| null` | Synchronous; `null` while running |
| `pid` | `number` | In-VM pid |
| `kill` | `() => void` | — |

`OutputStream` = `ReadableStream<string>` + async iterator + `text()`.

### `vivari.fs` (host-side control plane)

| Method | Notes |
|--------|-------|
| `readFile(path)` / `readFile(path, "utf-8")` | Bytes or string |
| `writeFile(path, data)` | Creates parents; **rejects** on failure |
| `readdir(path, { withFileTypes? })` | Names or `DirEnt`s |
| `mkdir(path, { recursive? })` | `recursive` defaults to `true` |
| `rm(path, { recursive?, force? })` | Both default to `true` |
| `rename(from, to)` | — |
| `exists(path)` | Boolean; never throws for missing |
| `stat(path)` | Throws `ENOENT`; no `exists` field |
| `watch(path, options?, listener?)` | `FSWatcher`: callback + async iterable + `close()` |

Every method accepts a trailing options object with `AbortSignal`.

In-VM code uses Node's own `fs`/`fs/promises` via `require("fs")` — a much larger surface than `vivari.fs`, over the same VFS.

### Error codes

Branch on `err.code`: `ERR_NOT_ISOLATED`, `ERR_WORKER`, `ERR_BOOT_FAILED`, `ERR_BOOT_TIMEOUT`, `ERR_ABORTED`, `ERR_COMMAND_NOT_FOUND`, plus POSIX codes such as `ENOENT`, `EEXIST`, `ENOTEMPTY`.

## `@vivari/react`

| Export | Signature |
|--------|-----------|
| `<Vivari>` | `boot`, `files`, `install` (default `["npm","install"]`), `run`, `instanceKey`, `autoBoot`, `onReady`, `onServerReady`, `onOutput`, `onError`, `showPreview`, `previewPort`, `previewPath`, `fallback`, `renderError`, `children` |
| `<VivariProvider>` | Shares one ref-counted kernel across the subtree |
| `<VivariPreview>` | `port`, `path`, `vivari`, `reloadKey`, `onServerReady`, `fallback` + iframe attrs |
| `useVivari()` | `{ status, vivari, error, boot, restart }`; status `idle\|booting\|ready\|error\|unsupported` |
| `useSpawn()` | `{ run, kill, write, status, output, process }`; `collect: false` by default |
| `useVivariFile(path, { debounce })` | `[source, setSource, { status, error, save, reload }]` |
| `useVivariDir(path)` | `{ entries, status, refresh }`; non-recursive watch |

All React modules carry `"use client"`; on the server `useVivari()` reports `idle` and renders nothing.

`VivariFailure` = `{ phase: "unsupported" | "boot" | "mount" | "install" | "run", error }`; `"unsupported"` also carries `reason: "not-cross-origin-isolated" | "no-web-workers"`.

## Cross-Origin Isolation

```text
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: require-corp
```

Iframes do not inherit the embedder's policy — every framed document needs its own `require-corp` (or `credentialless`) response. Chromium-only alternative for framed apps: `Document-Isolation-Policy: isolate-and-require-corp`.
