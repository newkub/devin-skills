---
name: use-bun-native-api
description: ใช้ Bun native APIs (`Bun.*`) และ Web-standard APIs อย่างเต็มประสิทธิภาพ — API catalog + selection
argument-hint: "[scope]"
related:
  - follow-lang-bun
  - use-bun-shell
  - follow-create-bun-cli
  - follow-best-practice
  - use-scripts
---

## Goal

เลือกและใช้ Bun native APIs (`Bun.*`) และ Web-standard APIs ให้ถูกต้องตาม use case — skill นี้เป็น API catalog ไม่ครอบคลุม setup/CLI/package management (ดู `/follow-lang-bun`)

## Scope

ใช้เมื่อเขียน code ที่รันบน Bun และต้องเลือกว่าจะใช้ `Bun.*` API, Web-standard API หรือ `node:*` module — runtime ปัจจุบัน `Bun 1.4.2 (verified 2026-09-18)` (Bun 1.4 เขียนใหม่ด้วย Rust, เพิ่ม `Bun.Image`, `Bun.WebView`, `Bun.markdown`, `Bun.cron()`, `Bun.Terminal`, HTTP/2 ใน `Bun.serve`)

ไม่ครอบคลุม: installation, `bun` CLI commands, package manager, `bunfig.toml`, `bun test`/`bun build` → ทำ `/follow-lang-bun` แทน

## Execute

### 1. Identify API Category

> Goal: เลือก API category ที่ตรง use case

1. ระบุว่างานเป็น category ไหน: HTTP server, file I/O, shell/process, networking, database, crypto, streams, data parsing, utilities
2. ตัดสินใจ layer: `Bun.*` native (fast, Bun-only), Web-standard (portable), หรือ `node:*` (compat)
3. ถ้า code ต้องรันบน Node.js ด้วย → เลือก Web-standard หรือ `node:*` (ห้ามใช้ `Bun.*`)

### 2. Read Category Reference

> Goal: ใช้ API ถูกต้องตาม docs

อ่าน reference ของ category ที่เลือกจาก `references/`:

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

> Goal: implement ตาม Bun best practices

1. ใช้ `Bun.serve()` สำหรับ HTTP server แทน `node:http`
2. ใช้ `$` shell template literal สำหรับ shell commands (ดู `/use-bun-shell`)
3. ใช้ `Bun.file()`/`Bun.write()` สำหรับ file operations — streaming, ไม่ buffer ทั้งไฟล์
4. ใช้ `Bun.spawn()`/`Bun.spawnSync()` สำหรับ child processes
5. ใช้ Web-standard APIs (`fetch`, `ReadableStream`, `Blob`, `Response`) เมื่อเป็นไปได้ — portable กว่า
6. ใช้ `node:*` modules เฉพาะเมื่อ Bun/Web API ไม่มี equivalent หรือต้อง compat

### 4. Verify

> Goal: verify API usage ถูกต้อง

1. ตรวจสอบ signature/return type ตรง docs (อ่าน `references/bun-*.md` หรือ https://bun.com/reference)
2. ตรวจ error handling — Bun APIs มัก return Promise หรือ throw typed errors
3. เปรียบเทียบ performance claim กับ use case จริงถ้าเป็น hot path

## Rules

### 1. API Selection

- Prefer `Bun.*` เมื่อ performance สำคัญและ code รันเฉพาะ Bun
- Prefer Web-standard APIs เมื่อต้องการ portability (edge workers, browser, Node)
- ใช้ `node:*` เมื่อ `Bun.*`/Web API ไม่ครอบ use case — Bun รองรับ Node.js 26.3.0 compat
- ห้าม mix `node:fs` + `Bun.file` ใน operation เดียวกัน — เลือก layer เดียวต่อ flow

### 2. Version Awareness

- `Bun.Image`, `Bun.WebView`, `Bun.markdown`, `Bun.cron()`, `Bun.Terminal` ต้อง `Bun >= 1.4` — check `Bun.version` ถ้า code อาจรันบน runtime เก่า
- API ใหม่ verify จาก https://bun.com/reference ก่อนใช้ — ห้ามเดา signature
- `Bun.WebView` เป็น experimental — backend: `webkit` (macOS) / `chrome` (CDP, ต้องมี Chrome)

### 3. Non-Goals

- ห้ามเขียน install/CLI/package-manager instructions ใน skill นี้ — อยู่ใน `/follow-lang-bun`
- ห้าม duplicate API docs ทั้งไฟล์ — `references/bun-*.md` เป็น canonical, SKILL.md แค่ dispatch

### 4. Related Skills

- `/follow-lang-bun` สำหรับ runtime setup, CLI, package manager, bunfig, test runner, bundler
- `/use-bun-shell` สำหรับ `$` shell API เจาะลึก
- `/follow-create-bun-cli` สำหรับสร้าง CLI app
- `/follow-best-practice`, `/use-scripts` ถ้าจำเป็น

## Expected Outcome

- เลือก API layer ถูก (`Bun.*` vs Web-standard vs `node:*`) ตาม portability/performance
- ใช้ Bun native APIs ถูกต้องตาม official docs
- Code รันบน Bun ได้เร็วกว่า Node.js equivalents
- ไม่มี API guessing — ทุก usage อ้าง references หรือ official docs
