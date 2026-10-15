---
name: use-bun-native-api
description: Use Bun native (`Bun.*`) and Web-standard APIs to their full potential — API catalog + selection
argument-hint: "[scope]"
related:
  - follow-lang-bun
  - use-bun-shell
  - follow-create-bun-cli
  - follow-best-practice
  - use-scripts
  - deep-research

---

## Goal

Pick and use Bun native APIs (`Bun.*`) and Web-standard APIs correctly per use case — this skill is an API catalog and does not cover setup/CLI/package management (see `/follow-lang-bun`)

## Scope

Use when writing code that runs on Bun and you must choose between a `Bun.*` API, a Web-standard API, or a `node:*` module — the API surface grows every minor release, so the current version and signatures are live-checked in Step 1, never asserted from memory (official reference: https://bun.com/reference)

Not covered: installation, `bun` CLI commands, package manager, `bunfig.toml`, `bun test`/`bun build` → do `/follow-lang-bun` instead

## Execute

### 1. Identify API Category

> Goal: pick the API category that fits the use case

1. Run `/deep-research` + `/follow-best-practice` to confirm the installed `Bun.version`, the current API surface, and the Node-compat level before choosing APIs
2. Identify which category the work belongs to: HTTP server, file I/O, shell/process, networking, database, crypto, streams, data parsing, utilities
3. Decide the layer: `Bun.*` native (fast, Bun-only), Web-standard (portable), or `node:*` (compat)
4. If the code must also run on Node.js → choose Web-standard or `node:*` (never use `Bun.*`)

### 2. Read Category Reference

> Goal: use the API correctly per the docs

Read the reference for the chosen category from `references/`:

| Category | Reference |
|----------|-----------|
| HTTP Server (`Bun.serve`, routing, WebSocket, TLS) | `references/bun-http-server.md` |
| Shell & Process (`$`, `Bun.spawn`) | `references/bun-shell-process.md` |
| File I/O (`Bun.file`, `Bun.write`, `Bun.fileURLToPath`) | `references/bun-file-io.md` |
| Networking (TCP, UDP, DNS, fetch) | `references/bun-networking.md` |
| Bundler & Build API (`Bun.build`, plugins) | `references/bun-bundler.md` |
| Database (`Bun.sql`, `bun:sqlite`, Redis, S3) | `references/bun-database.md` |
| Hashing & Crypto (`Bun.hash`, `Bun.CryptoHasher`, `Bun.password`) | `references/bun-hashing-crypto.md` |
| Utilities (`Bun.sleep`, `Bun.env`, `Bun.gc`, semver, glob) | `references/bun-utilities.md` |
| Compression (`Bun.gzipSync`, `Bun.deflateSync`, `Bun.Archive`) | `references/bun-compression.md` |
| Streams & Buffer (`Bun.readableStreamTo*`, `ArrayBufferSink`) | `references/bun-streams.md` |
| Data Parsing (JSON5, JSONL, TOML, YAML, XML, `Bun.markdown`) | `references/bun-data-parsing.md` |
| Security (`Bun.secrets`, CSRF) | `references/bun-security.md` |
| FFI & Low-level (`bun:ffi`, `dlopen`, `bun:jsc`) | `references/bun-ffi.md` |
| Other (`Bun.Image`, `Bun.WebView`, `Bun.cron`, `Bun.Terminal`, workers) | `references/bun-other.md` |
| Web-standard APIs (`fetch`, `WebSocket`, `Blob`, streams, workers) | `references/bun-web-apis.md` |

### 3. Implement With Best Practices

> Goal: implement following Bun best practices

1. Use `Bun.serve()` for the HTTP server instead of `node:http`
2. Use the `$` shell template literal for shell commands (see `/use-bun-shell`)
3. Use `Bun.file()`/`Bun.write()` for file operations — streaming, without buffering the whole file
4. Use `Bun.spawn()`/`Bun.spawnSync()` for child processes
5. Use Web-standard APIs (`fetch`, `ReadableStream`, `Blob`, `Response`) when possible — more portable
6. Use `node:*` modules only when Bun/Web APIs have no equivalent or compat is required

### 4. Verify

> Goal: verify the API usage is correct

1. Check that signature/return type match the docs (read `references/bun-*.md` or https://bun.com/reference)
2. Check error handling — Bun APIs usually return a Promise or throw typed errors
3. Compare a performance claim against the real use case if it's a hot path

## Rules

### 1. API Selection

- Prefer `Bun.*` when performance matters and the code runs only on Bun
- Prefer Web-standard APIs when you need portability (edge workers, browser, Node)
- Use `node:*` when `Bun.*`/Web API doesn't cover the use case — Bun tracks a recent Node.js line for compat; check which one via `/deep-research` at use time
- Never mix `node:fs` + `Bun.file` in the same operation — pick one layer per flow

### 2. Version Awareness

- `Bun.Image`, `Bun.WebView`, `Bun.markdown`, `Bun.cron()`, `Bun.Terminal` were introduced in Bun 1.4 — check `Bun.version` at runtime if the code might run on an older runtime
- Never restate version numbers or "verified on" dates in this skill or its `references/`; live-check via `/deep-research` (principle: `/follow-up-to-date`)
- Verify new APIs from https://bun.com/reference before use — never guess a signature
- `Bun.WebView` is experimental — backends: `webkit` (macOS) / `chrome` (CDP, requires Chrome)

### 3. Non-Goals

- Never write install/CLI/package-manager instructions in this skill — they belong to `/follow-lang-bun`
- Never duplicate full API docs — `references/bun-*.md` are canonical, SKILL.md only dispatches

### 4. Related Skills

- `/follow-lang-bun` for runtime setup, CLI, package manager, bunfig, test runner, bundler
- `/use-bun-shell` for a deep dive on the `$` shell API
- `/follow-create-bun-cli` for building a CLI app
- `/follow-best-practice`, `/use-scripts` when needed

## Expected Outcome

- The right API layer chosen (`Bun.*` vs Web-standard vs `node:*`) per portability/performance
- Bun native APIs used correctly per the official docs
- Code runs on Bun faster than Node.js equivalents
- No API guessing — every usage cites the references or official docs
