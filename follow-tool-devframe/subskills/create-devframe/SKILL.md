---
name: follow-tool-devframe-create-devframe
description: Scaffold devtool ใหม่ด้วย Devframe — install, defineDevframe, RPC, SPA, run dev/build/mcp
argument-hint: "[tool-id]"
related:
  - follow-tool-devframe
  - follow-lib-zod
  - follow-create-cli
  - run-check
  - resolve-errors
---

## Goal

Scaffold devtool ใหม่ด้วย Devframe จนรันได้จริง — `my-tool` dev server, `build` static, `mcp` agent — first-time setup เท่านั้น

## Scope

- ใช้เมื่อยังไม่มี `DevframeDefinition` ใน project (ถ้ามีแล้ว → verify เท่านั้น)
- ครอบคลุม: install, definition, RPC function, SPA wiring, cac CLI entry
- ไม่ครอบคลุม hub composition, framework kits (`@devframes/vite|nuxt|next` host), embedded — ดู parent `SKILL.md`

## Execute

### 1. Check Precondition

> Goal: ตรวจ environment ก่อน scaffold

1. อ่าน `package.json` — ถ้ามี `devframe` แล้ว → skip ไป verify; เช็ค version ตรง `references/package-manifest.md`
2. ระบุ SPA stack ที่จะใช้ (Vue/Nuxt/React) และ runtime (Bun/Node)
3. ถ้า project เป็น CLI ใหม่ทั้งหมด → ทำ `/follow-create-cli` สำหรับ skeleton ก่อน

### 2. Install

> Goal: ติดตั้ง packages ขั้นต่ำ

1. รัน `bun add devframe cac` — `cac` เป็น optional peer ของ CLI adapter
2. รัน `bun add valibot` (หรือ `zod` — ทำ `/follow-lib-zod`) สำหรับ RPC schemas
3. ยืนยันทั้งหมดอยู่ใน `dependencies`

### 3. Write Definition And RPC

> Goal: `defineDevframe` + 1 RPC function ที่ call ได้

1. สร้าง `src/rpc.ts` ด้วย `defineRpcFunction` — `type: 'query'`, declare `args`/`returns` schemas
2. สร้าง `src/cli.ts` ด้วย `defineDevframe({ id, name, version, packageName, importMetaUrl, homepage, description, icon, clientAssets, cli, setup })`
3. ใน `setup(ctx)` → `const my = ctx.scope('<id>')` แล้ว `my.rpc.register(fn)`
4. Source `version`/`packageName`/`homepage`/`description` จาก `package.json` (`import pkg from '../package.json' with { type: 'json' }`)
5. ตั้ง `cli: { command: '<id>', port, open: true }` — `open` embeds OTP ให้ tab authenticated

### 4. Wire SPA

> Goal: `clientAssets` ชี้ไปที่ built UI จริง

1. Build SPA แล้วชี้ `clientAssets` ไปที่ output — Nuxt: `modules: ['@devframes/nuxt/single']`, `ssr: false`, nitro `preset: 'static'`; Next: `output: 'export'`, `assetPrefix: '.'`, `trailingSlash: true`
2. ฝั่ง browser ใช้ `connectDevframe()` จาก `devframe/client` หรือ `$rpc` (Nuxt helper)
3. เรียก `my.rpc.call('<fn>', args)` — bare name resolve ผ่าน scope อัตโนมัติ
4. ถ้ายังไม่มี UI → `clientAssets` ชี้ dir ว่างได้ชั่วคราว แต่ต้องสร้าง SPA ก่อน ship

### 5. Add CLI Entry And Run

> Goal: `my-tool` รัน dev/build/mcp ได้

1. สร้าง `bin.mjs` (shebang + `import './dist/cli.mjs'`) แล้ว wire `"bin"` ใน `package.json`
2. ท้าย `src/cli.ts`: `await createCac(myDevframe).parse(process.argv)`
3. Smoke: `my-tool` → dev server ขึ้นที่ `http://localhost:<port>/`, RPC call ผ่าน scoped client
4. Smoke: `my-tool build --out-dir dist-static` → static deploy ออกมา; `my-tool mcp` → stdio MCP server

### 6. Verify

> Goal: ผ่าน checks ก่อนจบ

1. รัน `bunx tsc --noEmit` + lint — ถ้าไม่ผ่าน → ทำ `/resolve-errors` max 3 รอบ แล้ว stop report
2. เช็ค `static`/`snapshot` functions bake ถูกใน `dist-static/` (เปิด SPA จาก static serve แล้ว call)
3. ผ่าน → `/suggest-next-action`

## Rules

- Idempotent — ถ้า scaffold ไปแล้วให้ verify เท่านั้น ห้ามเขียนทับ definition เดิม
- ใช้ `ctx.scope('<id>')` เสมอ — bare `ctx.rpc.register` เฉพาะเมื่อตั้งใจ cross-tool
- `importMetaUrl: import.meta.url` บังคับเมื่อ `clientAssets` resolve จาก own deps
- Declare `args`/`returns` ทุก RPC function ที่รับ/คืน data — validator อะไรก็ได้ที่เป็น Standard Schema
- ห้าม `auth: false` เว้นแต่ localhost single-user tool จริงๆ

## Expected Outcome

- `devframe` + `cac` ติดตั้ง; `DevframeDefinition` พร้อม scoped RPC functions
- `my-tool` (dev server), `my-tool build` (static), `my-tool mcp` (stdio MCP) ทำงานได้
- SPA เชื่อมผ่าน `connectDevframe()` หรือ `$rpc`; พร้อมขยาย adapters/hub ตาม parent `SKILL.md`
