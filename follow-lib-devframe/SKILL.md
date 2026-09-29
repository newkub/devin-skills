---
name: follow-lib-devframe
description: สร้าง devtool ครั้งเดียวด้วย Devframe แล้ว mount ได้ทุกที่ — SPA, CLI, static, MCP, hub
argument-hint: "[adapter-or-scope]"
related:
  - follow-lib-zod
  - use-mcp
  - run-check
  - resolve-errors
---

## Goal

สร้าง devtool ด้วย `devframe` (definition เดียว) แล้ว deploy ได้ทุก surface — standalone SPA, CLI, static report, MCP server, host framework หรือ hub dock — ตาม official docs <https://devfra.me>

## Scope

ใช้สำหรับ project ที่ต้องการสร้าง devtool (inspector, analyzer, data explorer, terminal) ที่รันได้หลายที่

- ติดตั้ง `devframe` และ optional peers (`cac`, Standard Schema validator)
- สร้าง `DevframeDefinition` ผ่าน `defineDevframe()` + scoped context
- ลงทะเบียน RPC functions, shared state, streaming channels
- เลือก serving path: standard handler, `cac` CLI, dev server, build, MCP, Vite/embedded, framework kits (`@devframes/vite|nuxt|next`)
- Compose หลาย devframes ผ่าน `@devframes/hub`
- มี CLI adapter (`devframe/adapters/cac`) → ดู `references/cli.md`

## Execute

### Subskills

| Topic | Subskill |
|-------|----------|
| Scaffold devtool | `subskills/create-devframe/SKILL.md` — install, defineDevframe, RPC, SPA, run dev/build/mcp |

### 1. Install Packages

> Goal: ติดตั้ง `devframe` และ dependencies ที่จำเป็น

1. ติดตั้ง `bun add devframe` (ESM-only, ไม่มี Vite dependency — ดู `references/package-manifest.md`)
2. ถ้า ship standalone CLI → ติดตั้ง optional peer `bun add cac`
3. ติดตั้ง Standard Schema validator ตามที่ใช้: `bun add valibot` หรือ `bun add zod` (ทำ `/follow-lib-zod`)
4. ถ้า mount เข้า Vite DevTools → `bun add -D @vitejs/devtools-kit`
5. ถ้า compose hub → `bun add @devframes/hub @devframes/hub-ui`
6. บันทึก version ที่ติดตั้งจริงใน `references/package-manifest.md`

### 2. Define Devframe Definition

> Goal: `defineDevframe()` เดียวที่ adapter ใดก็ consume ได้

1. สร้าง `devframe.ts` export default `defineDevframe({ ... })` จาก `devframe`
2. ระบุ required fields: `id` (kebab-case), `name`, `version`, `packageName`, `importMetaUrl: import.meta.url`, `homepage`, `description`, `setup(ctx)`
3. ใส่ `icon` (Iconify เช่น `ph:gauge-duotone`), `clientAssets` (path หรือ `{ package, version }`), `basePath` ถ้าต้อง override
4. ตั้ง `cli` defaults ถ้า ship CLI: `command`, `port`, `portRange`, `open`, `configure(cli)`, `flags` ผ่าน `defineCliFlags`
5. ใน `setup(ctx)` ใช้ `const my = ctx.scope('<id>')` เสมอ — auto-namespace ทุก RPC id, shared-state key, channel
6. Gate runtime-specific work ด้วย `ctx.mode` (`'dev'` watchers / `'build'` static dump)

### 3. Register RPC Functions

> Goal: type-safe RPC บน birpc พร้อม schema validation

1. สร้าง `rpc/` module ด้วย `defineRpcFunction({ name, type, args, returns, setup | handler })`
2. เลือก `type`: `query` (reads เปลี่ยนแปลง), `static` (fixed per input, auto-dump), `action` (mutations), `event` (fire-and-forget)
3. ใช้ `setup: ctx => ({ handler, dump? })` เมื่อ handler ต้องการ `DevframeNodeContext`; ไม่ต้องการ → `handler(...)` shorthand
4. ตั้ง `jsonSerializable: true` เมื่อ return JSON-only (strict `JSON.stringify` wire); default ใช้ `structured-clone-es` round-trip `Map`/`Date`/`BigInt`
5. Register ผ่าน `my.rpc.register(fn)` — bare name ถูก prefix เป็น `<id>:<name>` อัตโนมัติ
6. Augment `DevframeRpcServerFunctions` ผ่าน `RpcDefinitionsToFunctionsWithNamespace` สำหรับ typed client (ดู `references/apis.md`)
7. Broadcast ไปทุก client ด้วย `my.rpc.broadcast({ method, args, optional, event, filter })`

### 4. Shared State, Streaming, Settings

> Goal: state sync node↔browser และ persisted settings

1. ใช้ `await my.rpc.sharedState('key', { initialValue })` — observable, patch-synced, survive reconnects
2. Mutate ด้วย `state.mutate(draft => { ... })`; browser subscribe ผ่าน `state.on('updated', ...)`
3. ใช้ `ctx.rpc.streaming.create<T>('<id>:channel', { replayWindow })` สำหรับ chunk feeds (ดู `references/apis.md`)
4. ใช้ `my.settings` (persisted store) สำหรับ tool settings; `ctx.staticConfig` สำหรับ boot-time config จาก connection handshake
5. ใช้ `ctx.host.getStorageDir(scope)` — `workspace` (committable), `project` (per-checkout), `global` (per-user)

### 5. Client Assets (SPA)

> Goal: UI เป็น built SPA ที่ `clientAssets` ชี้ไป

1. Build SPA (Vue/Nuxt/React อะไรก็ได้) แล้วชี้ `clientAssets` ไปที่ output dir หรือ published package `{ package, version }`
2. Nuxt: `ssr: false`, `modules: ['@devframes/nuxt/single']`, nitro `preset: 'static'` — helper wire `$rpc` ให้
3. Next.js: `output: 'export'`, `assetPrefix: '.'`, `trailingSlash: true`, `images.unoptimized` — copy `out/` ไป `clientAssets`
4. Browser side ใช้ `connectDevframe()` จาก `devframe/client` — auto-resolve connection descriptor (dev WebSocket / static dump)
5. เรียก RPC จาก client: `(await connectDevframe()).scope('<id>').rpc.call('<fn>', args)`

### 6. Choose Serving Path

> Goal: mount definition เดียวไปยัง surface ที่ต้องการ (ดู `references/apis.md` adapter matrix)

1. Raw handler: `initDevframe(def, { base })` จาก `devframe/initiate` → `.handler` (Request→Response) หรือ `.nodeMiddleware` (Connect-style)
2. Standalone CLI: `createCac(def).parse()` จาก `devframe/adapters/cac` — commands `dev` (default), `build`, `mcp` (ดู `references/cli.md`)
3. Dev server only: `createDevServer(def, { port, flags, onReady })` จาก `devframe/adapters/dev` → `StartedServer` handle
4. Static snapshot: `createBuild(def, { outDir })` จาก `devframe/adapters/build` — self-contained deploy
5. MCP server: `createMcpServer(def, { transport: 'stdio' })` จาก `devframe/adapters/mcp`
6. Vite DevTools: `createPluginFromDevframe(def)` จาก `@vitejs/devtools-kit/node`
7. Runtime registration: `createEmbedded(def, { ctx })` จาก `devframe/adapters/embedded`
8. Framework kits: `@devframes/vite|nuxt` subpaths `/single` (author) และ `/hub` (mount hub); bare import throws

### 7. Compose With Hub

> Goal: หลาย devframes อยู่หลัง handler เดียว

1. ใช้ `initHub({ base: DEVFRAMES_HUB_BASE, devframes: [...], ui: createUi() })` จาก `@devframes/hub/initiate` + `@devframes/hub-ui`
2. Hub เป็น headless — dock registry, terminal aggregation, message queue, command palette; UI provider แยก
3. Devframes ใน hub share RPC registry, state store, connection, auth gate, aggregate MCP endpoint
4. Cross-devframe capability ผ่าน `ctx.services.provide()` / `whenAvailable()` / `get()`
5. Mount hub เข้า framework ผ่าน `@devframes/vite/hub` หรือ `@devframes/nuxt/hub`

### 8. Expose To Agents (MCP)

> Goal: devtool ตอบ coding agents ผ่าน MCP/WebMCP

1. เพิ่ม `agent: { description, title }` ใน `defineRpcFunction` — opt-in ต่อ function (safety infer จาก `type`)
2. `agent` field เปิด `jsonSerializable` อัตโนมัติ — MCP consume JSON-shaped data
3. รัน MCP server ด้วย `my-tool mcp` หรือ `createMcpServer(def, { transport: 'stdio' })` — ทำ `/use-mcp` เพื่อ wire เข้า client
4. ทำ `/run-check` + `/deep-validate` ก่อน ship; ถ้า error → `/resolve-errors` max 3 รอบ

## Rules

### 1. Definition Design

- ใช้ `ctx.scope('<id>')` เสมอ — ห้าม register bare names บน `ctx.rpc` ถ้าไม่ได้ตั้งใจ cross-tool
- `importMetaUrl: import.meta.url` บังคับเมื่อ resolve `clientAssets`/`services` จาก own dependencies (pnpm strict layout safe)
- `id` เป็น kebab-case และ unique ต่อ host; naming convention `<id>:<kebab-action>`
- Source metadata จาก `package.json` (`import pkg from '../package.json' with { type: 'json' }`) — `packageName` ≠ `name`

### 2. RPC And Data Design

- Declare `args`/`returns` schemas ด้วย Standard Schema validator — enforced at runtime
- `static` เฉพาะ data ที่ fixed per input; `query` ต้อง explicit `dump` ถ้าจะ bake ใน static build (`snapshot: true` สำหรับ no-args payload)
- `jsonSerializable: true` ต้อง return JSON-only — `Map`/`Date` จะไม่ round-trip
- ใช้ `my.rpc.call('fn', args)` สำหรับ local invocation; fully-qualified `<id>:<fn>` เรียกข้าม tool

### 3. Serving And Security

- Standalone (`cli`/`build`) default basePath `/`; hosted (`vite`/`embedded`) default `/__<id>/` — override ด้วย `basePath`
- Connections bind localhost + trust handshake (OTP) โดย default — `auth: false` เฉพาะ localhost single-user tools
- Dev RPC รองรับ WebSocket + SSE fallback (serverless/buffering proxies) — birpc wire protocol เดียวกัน
- CLI `open: true` embeds OTP ใน URL — tab เปิดมา authenticated แล้ว

### 4. Version Notes

- Latest stable: `devframe@1.0.0` (released 2026-09-16, verified 2026-09-18)
- `@devframes/*` kits ตาม version เดียวกัน (`1.0.0`); `@vitejs/devtools-kit@0.7.x` เป็น adapter แยก
- Docs fetch raw markdown ได้ทุกหน้า: `https://devfra.me/raw/<path>.md`, full docs `https://devfra.me/llms-full.txt` (ดู `references/routes.md`)
- ตรวจ `package.json` + `/review-release` ก่อนเลือก API — spec อาจ drift หลัง 1.0

## Expected Outcome

- `DevframeDefinition` เดียว deploy ได้หลาย surface โดยไม่ fork code ต่อ framework
- RPC type-safe ครบทั้ง node→browser, browser→node, agent (MCP) พร้อม schema validation
- Shared state sync ข้าม reconnect; streaming channels สำหรับ chunk feeds
- CLI `my-tool` (dev/build/mcp), static snapshot ใน `dist-static/`, mount เข้า host framework หรือ hub ได้
- สอดคล้องกับ official Devframe docs <https://devfra.me>
