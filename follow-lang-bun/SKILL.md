---
name: follow-lang-bun
description: พัฒนา JS/TS ด้วย Bun toolkit — runtime, package manager, test runner, bundler
argument-hint: "[scope]"
related:
  - use-bun-native-api
  - use-bun-shell
  - follow-lang-javascript
  - follow-lang-typescript
  - follow-create-bun-cli
  - follow-tool-bunup
  - follow-best-practice
  - setup-cicd
  - use-scripts
---

## Goal

กำหนดแนวทางการพัฒนา JavaScript/TypeScript projects ด้วย Bun ให้รวดเร็วและถูกต้องตาม official best practices

## Scope

ใช้สำหรับสร้างหรือปรับปรุง projects ที่รันบน Bun runtime ทั้ง single package และ monorepo

Bun คือ all-in-one toolkit binary เดียว: runtime (drop-in replacement ของ Node.js), package manager, test runner และ bundler — runtime ปัจจุบัน `Bun 1.4.2 (verified 2026-09-18)` (Bun 1.4 เขียนใหม่ด้วย Rust, เพิ่ม `Bun.Image`, `Bun.WebView`, `Bun.markdown`, `Bun.cron()`, `Bun.Terminal`, HTTP/2 ใน `Bun.serve`, `bun run --parallel`, `bun test --parallel`, `bun audit fix`, `bun dedupe`, `bun prune`, isolated installs default สำหรับ monorepo ใหม่)

ดู [references/install.md](references/install.md) สำหรับการติดตั้ง, [references/bun-cli.md](references/bun-cli.md) สำหรับ commands หลัก และ [references/website.md](references/website.md), [references/routes.md](references/routes.md) สำหรับ official docs

## Execute

### 1. Install And Setup

> Goal: ติดตั้ง Bun และ verify version

1. ติดตั้ง Bun ตาม [references/install.md](references/install.md) — ใช้ `mise use -g bun` ก่อน แล้วจึง install script หรือ package manager
2. รัน `bun --version` และ `bun --revision` เพื่อ verify
3. อัปเกรดด้วย `bun upgrade` (หรือ `bun upgrade <version>` สำหรับ pin)

### 2. Create Project

> Goal: สร้าง project ด้วย template ที่ถูกต้อง

1. รัน `bun init` สำหรับ empty project (เลือก template: blank, react, library)
2. รัน `bun create <template>` สำหรับ scaffold จาก template (vite, next, elysia ฯลฯ)
3. ทำตาม `workflows/setup-project.md` สำหรับโครงสร้าง project มาตรฐาน
4. ถ้าย้ายจาก Node.js project → ทำตาม `workflows/migrate-from-nodejs.md`

### 3. Manage Packages

> Goal: จัดการ dependencies ด้วย Bun package manager

1. ติดตั้งด้วย `bun install` / `bun add <pkg>` / `bun add -d <pkg>` (dev) / `bun add -g <pkg>` (global)
2. ลบด้วย `bun remove <pkg>`, อัปเดตด้วย `bun update` / `bun update <pkg>`
3. ตรวจสุขภาพ deps ด้วย `bun outdated`, `bun why <pkg>`, `bun audit` (แก้ด้วย `bun audit fix`)
4. บำรุงรักษา lockfile ด้วย `bun dedupe` (ลบ duplicate versions) และ `bun prune` (ลบ node_modules เกิน)
5. monorepo: ใช้ `workspaces` ใน `package.json`, `bun install --filter <pkg>`, `bun run --filter <pkg> <script>`, catalogs สำหรับ shared versions
6. ดูรายละเอียดใน [references/package-manager.md](references/package-manager.md)

### 4. Run And Develop

> Goal: รันและพัฒนาด้วย Bun runtime

1. รันไฟล์ด้วย `bun run <file>` หรือ `bun <file>` — `.ts`, `.tsx`, `.jsx` รันได้ทันทีไม่ต้อง transpile ล่วง
2. รัน package.json script ด้วย `bun run <script>` หรือ `bun <script>`
3. ใช้ `bun --watch <file>` สำหรับ restart on change และ `bun --hot <file>` สำหรับ hot reload
4. ใช้ `bunx <pkg>` สำหรับ execute package binary แบบ one-off
5. monorepo: `bun run --workspaces <script>` หรือ `bun --parallel <script>` / `bun --sequential <script>`
6. `.env` ถูก load อัตโนมัติ (ไม่ต้องใช้ dotenv); ปิดด้วย `env = false` ใน `bunfig.toml`

### 5. Test

> Goal: เขียนและรัน tests ด้วย built-in test runner

1. เขียน tests ด้วย `import { describe, test, expect } from "bun:test"` (Jest-compatible)
2. รันด้วย `bun test` — auto-discover `*.test.{ts,tsx,js,jsx}` และ `*_test.*`, `*.spec.*`
3. ใช้ `bun test --watch`, `bun test --coverage`, `bun test --parallel` (v1.4+), `bun test --bail`
4. ใช้ `[test]` section ใน `bunfig.toml` สำหรับ preload, coverage threshold, root
5. ดูรายละเอียดใน [references/test-runner.md](references/test-runner.md)

### 6. Bundle And Build

> Goal: bundle code สำหรับ browser/server หรือ compile เป็น binary

1. bundle ด้วย `bun build <entry>` — รองรับ TS/JSX/CSS/HTML imports, splitting, minify, sourcemap
2. compile เป็น standalone executable ด้วย `bun build --compile <file>`
3. ตั้งค่า defaults ใน `[build]` section ของ `bunfig.toml`
4. ถ้า build library สำหรับ publish → ใช้ `/follow-tool-bunup`
5. ดูรายละเอียดใน [references/bundler.md](references/bundler.md)

### 7. Configure

> Goal: ตั้งค่า project ผ่าน config files

1. ตั้งค่า `bunfig.toml` สำหรับ runtime, install, test, serve, build — ดู [references/bunfig.md](references/bunfig.md)
2. ตั้งค่า `package.json` (scripts, workspaces, trustedDependencies, overrides) — ดู [references/package-manifest.md](references/package-manifest.md)
3. ตั้งค่า `tsconfig.json` + `bun add -d bun-types` สำหรับ TypeScript — ดู [references/typescript.md](references/typescript.md)

### 8. Use Bun APIs

> Goal: ใช้ Bun native APIs ใน code

1. ทำ `/use-bun-native-api` สำหรับ API catalog ครบทุก category (`Bun.serve`, `Bun.file`, `$` shell, `Bun.spawn`, `Bun.sql`, `Bun.Image`, `Bun.WebView` ฯลฯ)
2. ใช้ `/use-bun-shell` สำหรับ `$` shell template literal โดยเฉพาะ
3. ถ้าสร้าง CLI → ทำ `/follow-create-bun-cli`

### 9. Verify

> Goal: ยืนยันว่า project ทำงานครบ

1. รัน `bun run <entry>` ยืนยัน app start ได้
2. รัน `bun test` ยืนยัน tests ผ่าน
3. รัน `bun build <entry>` ยืนยัน bundle สำเร็จ
4. รัน `bun install --frozen-lockfile` ยืนยัน lockfile ตรงกับ `package.json`
5. ถ้ามี error → ทำ `/resolve-errors`

## Rules

### 1. Runtime

- Bun เป็น drop-in replacement ของ Node.js — รองรับ `node:*` modules, globals (`process`, `Buffer`, `__dirname`) และ Node.js 26.3.0 compatibility
- TypeScript/JSX รันได้โดยตรง ไม่ต้อง ts-node/tsx — Bun transpile ให้เอง
- `.env` auto-load ตั้งแต่ v1 — ห้ามเพิ่ม `dotenv` dependency
- ใช้ ES modules เป็น default; CommonJS (`require`) ยังใช้ได้แต่ไม่แนะนำ
- ใช้ Web-standard APIs (`fetch`, `WebSocket`, `ReadableStream`) เมื่อเป็นไปได้ ก่อนเลือก Node-style APIs

### 2. Package Management

- ใช้ `bun install`/`bun add` เป็น default — ห้ามสลับไป npm/pnpm/yarn ใน project ที่มี `bun.lock`
- lockfile คือ `bun.lock` (text format, diff-friendly) — commit เข้า git เสมอ
- lifecycle scripts (`postinstall` ฯลฯ) ของ dependencies ไม่ถูกรันเว้นแต่ระบุใน `trustedDependencies`
- install strategy: `isolated` เป็น default สำหรับ monorepo ใหม่ (กัน phantom dependencies), `hoisted` สำหรับ single package
- ใช้ `--minimum-release-age <seconds>` หรือ `[install] minimumReleaseAge` สำหรับ supply-chain protection
- ใช้ `bun install --frozen-lockfile` หรือ `bun ci` ใน CI — ห้ามแก้ `bun.lock` ด้วยมือ

### 3. Project Configuration

- `bunfig.toml` คือ config เดียวสำหรับ runtime + package manager + test + build — อย่าสร้าง config ซ้ำในไฟล์อื่น
- `package.json` ยังเป็น source of truth สำหรับ scripts, dependencies, workspaces
- ใช้ `catalog:` protocol ใน workspaces สำหรับ share dependency versions
- ใช้ `overrides`/`resolutions` สำหรับแก้ transitive dependency versions

### 4. Bun APIs

- ใช้ Bun native APIs (`Bun.*`) แทน Node.js equivalents เมื่อ performance สำคัญ — ดู catalog ใน `/use-bun-native-api`
- ใช้ `Bun.serve()` แทน `node:http`, `Bun.file()`/`Bun.write()` แทน `fs`, `$` แทน `execa`/`child_process` สำหรับ shell
- ถ้า library ต้องรันบน Node.js ด้วย → ใช้ Web-standard APIs หรือ `node:*` modules แทน `Bun.*` (ไม่ portable)

### 5. Quality

- เขียน tests ด้วย `bun:test` — Jest-compatible (`describe`, `test`, `expect`, `mock`, `spyOn`)
- ใช้ `bun test --coverage` ใน CI พร้อม `coverageThreshold` ใน `bunfig.toml`
- รัน `bun run --bun <script>` หรือ `-b` เมื่อต้องบังคับ Bun runtime แทน Node (script ที่ shebang เป็น node)
- ถ้า typecheck → ใช้ `bunx tsc --noEmit` (Bun ไม่ typecheck ตอนรัน)

### 6. Related Skills

- `/use-bun-native-api` สำหรับ Bun `Bun.*` + Web-standard API catalog
- `/use-bun-shell` สำหรับ `$` shell API
- `/follow-create-bun-cli` สำหรับสร้าง CLI app
- `/follow-tool-bunup` สำหรับ bundle library
- `/follow-lang-javascript` หรือ `/follow-lang-typescript` สำหรับภาษา
- `/follow-best-practice`, `/setup-cicd`, `/use-scripts` ถ้าจำเป็น

## Expected Outcome

- Bun project ที่ setup ถูกต้องตาม official conventions
- Dependencies จัดการด้วย `bun.lock` และ workspace patterns ที่ถูกต้อง
- Code รันโดยตรงด้วย TypeScript/JSX โดยไม่ต้อง build step
- Tests ผ่าน `bun test` พร้อม coverage
- Bundle/build สำเร็จด้วย `bun build`
- `bunfig.toml` ครอบคลุม runtime, install, test, build config
- ใช้ Bun native APIs อย่างเหมาะสมผ่าน `/use-bun-native-api`
