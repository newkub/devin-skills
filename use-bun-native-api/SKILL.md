---
name: use-bun-native-api
description: ใช้ Bun native APIs แทน Node.js libraries เพื่อ performance และ simplicity
---

## Goal

ใช้ Bun ecosystem ทั้งหมดแทน Node.js รวมถึง runtime, package manager, test runner, bundler, และ native APIs

## Scope

ใช้ `use-bun-native-api` สำหรับ tasks และ workflows เฉพาะที่ครอบคลุม

## Execute

### 1. Use Runtime APIs

> Goal: Use Runtime APIs

ใช้ Bun native APIs แทน Node.js libraries

1. ใช้ `Bun.file` แทน `node:fs` สำหรับอ่านไฟล์
2. ใช้ `Bun.write` สำหรับเขียน, copy, pipe, send, clone ไฟล์
3. ใช้ `Bun.mmap` สำหรับ memory-mapped files
4. ใช้ `Bun.serve` แทน Express สำหรับ HTTP server
5. ใช้ `bun:sqlite`, `Bun.sql`, `Bun.redis` แทน external drivers
6. ใช้ `Bun.$` สำหรับ shell commands
7. ใช้ `Bun.spawn` และ `Bun.spawnSync` สำหรับ child processes
8. ใช้ `Bun.gzipSync`, `Bun.deflateSync`, `Bun.zstdCompressSync` สำหรับ compression
9. ใช้ `Bun.password`, `Bun.hash`, `Bun.CryptoHasher` สำหรับ crypto
10. ใช้ `Bun.sleep`, `Bun.nanoseconds`, `Bun.deepEquals` สำหรับ utilities

### 2. Use Environment Variables

> Goal: Use Environment Variables

ใช้ environment variables ของ Bun

1. ใช้ `Bun.env` แทน `process.env` สำหรับ type safety
2. ใช้ `import.meta.env` สำหรับ build-time constants
3. ใช้ TypeScript interface merging สำหรับ `Bun.Env`
4. ตั้งค่า `NODE_TLS_REJECT_UNAUTHORIZED` สำหรับ SSL
5. ตั้งค่า `BUN_CONFIG_VERBOSE_FETCH` สำหรับ debug fetch
6. ตั้งค่า `BUN_RUNTIME_TRANSPILER_CACHE_PATH` สำหรับ cache
7. ตั้งค่า `NO_COLOR` และ `FORCE_COLOR` สำหรับ terminal colors
8. ตั้งค่า `BUN_CONFIG_MAX_HTTP_REQUESTS` สำหรับ concurrent requests
9. ตั้งค่า `BUN_CONFIG_NO_CLEAR_TERMINAL_ON_RELOAD` สำหรับ watch mode
10. ตั้งค่า `DO_NOT_TRACK` สำหรับ disable telemetry
11. ตั้งค่า `BUN_OPTIONS` สำหรับ default CLI options

### 3. Use TypeScript Support

> Goal: Use TypeScript Support

ใช้ TypeScript features ของ Bun

1. ใช้ `bun-types` แทน `@types/node` สำหรับ type definitions
2. ใช้ interface merging สำหรับ `Bun.Env` type safety
3. ใช้ `Bun.env` ที่ return `string | undefined` แทน `process.env`
4. ติดตั้ง `bun-types` ด้วย `bun add -d bun-types`
5. ใช้ `@types/bun` สำหรับ global type definitions
6. ตรวจสอบ TypeScript compatibility กับ Bun APIs

### 4. Use Package Manager

> Goal: Use Package Manager

ใช้ Bun package manager แทน npm/pnpm/yarn

1. ใช้ `bun install` แทน `npm install` สำหรับ install dependencies จาก lockfile
2. ใช้ `bun add` แทน `npm install <pkg>` สำหรับ add packages
3. ใช้ `bun add -d` แทน `npm install -D <pkg>` สำหรับ dev dependencies
4. ใช้ `bun remove` แทน `npm uninstall` สำหรับ remove packages
5. ใช้ `bun update` แทน `npm update` สำหรับ update packages
6. ใช้ `bun run` แทน `npm run` สำหรับ run scripts
7. ใช้ `bunx` แทน `npx` สำหรับ execute packages
8. ใช้ `bun pm` สำหรับ package manager commands
9. ใช้ `bun.lockb` แทน `package-lock.json` สำหรับ lockfile
10. ใช้ `bun pm cache rm` สำหรับ clear cache

### 5. Use Test Runner

> Goal: Use Test Runner

ใช้ `bun test` แทน Jest/Vitest

1. ใช้ `bun test` แทน Jest สำหรับ run tests
2. ใช้ `bun test --watch` สำหรับ watch mode
3. ใช้ `bun test --coverage` สำหรับ coverage
4. ใช้ `expect` จาก `bun:test` แทน Jest expect
5. ใช้ `describe`, `it`, `test` จาก `bun:test`
6. ใช้ `mock`, `spyOn` จาก `bun:test` สำหรับ mocking
7. ใช้ `beforeEach`, `afterEach` จาก `bun:test` สำหรับ hooks
8. ตั้งค่า `bunfig.toml` สำหรับ test configuration

### 6. Use Bundler

> Goal: Use Bundler

ใช้ `bun build` แทน webpack/rollup/esbuild

1. ใช้ `bun build` สำหรับ bundling
2. ใช้ `bun build --target` สำหรับ target platform
3. ใช้ `bun build --format` สำหรับ output format
4. ใช้ `bun build --external` สำหรับ external dependencies
5. ใช้ `bun build --splitting` สำหรับ code splitting
6. ใช้ `bun build --sourcemap` สำหรับ source maps
7. ใช้ `bun build --minify` สำหรับ minification
8. ตั้งค่า `bunfig.toml` สำหรับ build configuration

### 7. Use Advanced APIs

> Goal: Use Advanced APIs

ใช้ advanced Bun APIs

1. ใช้ `bun:ffi` สำหรับ Foreign Function Interface
2. ใช้ `Bun.Transpiler` สำหรับ JSX/TypeScript transpilation
3. ใช้ `Bun.build` สำหรับ native bundling
4. ใช้ `bun:test` สำหรับ testing
5. ใช้ `Bun.gc`, `Bun.generateHeapSnapshot` สำหรับ garbage collection
6. ใช้ `bun:jsc` สำหรับ JavaScriptCore engine APIs
7. ใช้ `Bun.TOML.parse` สำหรับ TOML parsing
8. ใช้ `Bun.semver` สำหรับ semantic versioning
9. ใช้ `Bun.markdown` สำหรับ markdown processing
10. ใช้ `Bun.color` สำหรับ terminal color detection
11. ใช้ `Bun.Image` สำหรับ image processing

### 8. Use Configuration

> Goal: Use Configuration

ตั้งค่า Bun configuration

1. สร้าง `bunfig.toml` สำหรับ global configuration
2. ตั้งค่า `[install]` section สำหรับ package manager
3. ตั้งค่า `[test]` section สำหรับ test runner
4. ตั้งค่า `[build]` section สำหรับ bundler
5. ตั้งค่า `[run]` section สำหรับ runtime
6. ตั้งค่า environment variables ใน `bunfig.toml`
7. ใช้ `--config` flag สำหรับ custom config file

## Rules

### 1. Runtime API Selection

ใช้ Bun native APIs เสมอเมื่อมีให้ใช้

- ใช้ Bun native APIs เสมอเมื่อมีให้ใช้
- ใช้ `Bun.file` แทน `node:fs` เสมอ
- ใช้ `Bun.serve` แทน Express/Fastify
- ใช้ `bun:sqlite`, `Bun.sql`, `Bun.redis` แทน external drivers

### 2. Package Manager Usage

ใช้ Bun package manager สำหรับทุก operations

- ใช้ `bun install` แทน `npm install` สำหรับ install จาก lockfile
- ใช้ `bun add` แทน `npm install <package>` สำหรับ add package
- ใช้ `bunx` แทน `npx`
- ใช้ `bun.lockb` แทน `package-lock.json`

### 3. TypeScript Integration

ใช้ TypeScript features ของ Bun

- ใช้ `bun-types` แทน `@types/node`
- ใช้ interface merging สำหรับ `Bun.Env`
- ใช้ `Bun.env` สำหรับ type-safe environment variables

### 4. Testing Strategy

ใช้ `bun test` สำหรับ testing

- ใช้ `bun test` แทน Jest/Vitest
- ใช้ APIs จาก `bun:test` สำหรับ assertions
- ใช้ `bunfig.toml` สำหรับ test configuration

### 5. Build Configuration

ใช้ `bun build` สำหรับ bundling

- ใช้ `bun build` แทน webpack/rollup
- ตั้งค่า `bunfig.toml` สำหรับ build options
- ใช้ native bundling สำหรับ performance

### 6. Web Standards Priority

ใช้ Web-standard APIs ก่อน Bun-specific APIs

- ใช้ Web-standard APIs ก่อน Bun-specific APIs
- ตรวจสอบ compatibility กับ Web standards
- ใช้ Bun APIs เฉพาะสำหรับ server-side tasks

### 7. Bun Runtime Setup

ทำ `/follow-runtime-bun` เพื่อ setup Bun runtime ก่อนใช้ Bun native APIs

- ใช้ `/follow-runtime-bun` สำหรับ install, verify, `bunfig.toml`, `bun run`, `bun test`, `bun build`
- ใช้ `/follow-lang-bun` สำหรับ Bun APIs and Web-standard APIs ใน code

## Expected Outcome

- Code ที่เร็วขึ้นด้วย native performance
- ลด dependencies ด้วย built-in APIs
- Code ที่กระชับและ maintainable
- Performance optimization อัตโนมัติ
- Full-stack development ด้วย runtime เดียว
- Type-safe environment variables
- Fast package manager
- Built-in test runner
- Native bundler