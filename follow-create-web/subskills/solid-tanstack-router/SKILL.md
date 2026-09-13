---
name: follow-create-web-solid-tanstack-router
description: ตั้งค่าและพัฒนา full-stack app ด้วย TanStack Start (SolidJS), TanStack Router และ UnoCSS
argument-hint: "[scope]"
related:
  - follow-lib-unocss
  - follow-tool-vite
  - follow-create-plugins
  - follow-lang-typescript
  - follow-lib-tanstack-ecosystem
  - follow-lib-effect-ts
  - follow-single-responsibility
  - follow-lib-solidjs
  - follow-lib-zod
  - run-dev
---


## Goal

ตั้งค่าและพัฒนา full-stack application ด้วย TanStack Start (SolidJS) แบบ type-safe — server functions และ server routes ในตัว framework โดยไม่ต้องพึ่ง backend framework แยก

## Scope

- รวม capability จาก skills เดิมที่ถูก merge เข้าตัวนี้ (merged from: follow-solid-tanstack-architecture)

ใช้สำหรับ projects ที่ต้องการ:

- Full-stack framework ด้วย SolidJS
- Server-side rendering (SSR) และ streaming หรือ SPA mode
- Type-safe routing ด้วย TanStack Router
- Type-safe server functions (RPC) และ server routes (API endpoints) ของ TanStack Start
- Styling ด้วย UnoCSS

## Execute

### 1. Setup Project

> Goal: สร้าง project ใหม่

1. ใช้ TanStack CLI:
   ```bash
   npx @tanstack/cli@latest create --framework solid
   ```
   หรือ clone official example (`npx gitpick TanStack/router/tree/main/examples/solid/start-basic my-app`)
2. ตรวจสอบ project structure และไฟล์ config

### 2. Install Dependencies

> Goal: ติดตั้ง packages ที่จำเป็น

1. Core (verified 2026-09-12 — `@tanstack/solid-start@1.168.50`, `@tanstack/solid-router@1.170.33`; start ต้องการ `vite >=7.0.0` และ `solid-js >=1.0.0`):
   ```bash
   bun i @tanstack/solid-start @tanstack/solid-router solid-js
   bun i -D vite vite-plugin-solid typescript @types/node
   ```
2. UnoCSS:
   ```bash
   bun i -D unocss @iconify-json/mdi
   ```
3. Optional:
   - `zod` สำหรับ input validation ของ server functions
   - `nitro` เมื่อต้องการ portable production server output (`.output/server/index.mjs`)

### 3. Configure Build Tool

> Goal: ตั้งค่า Vite หรือ Rsbuild

1. Vite:
   - ใช้ `@tanstack/solid-start/plugin/vite` — `tanstackStart()`
   - ใช้ `vite-plugin-solid` ด้วย `ssr: true` (ต้องอยู่หลัง start plugin)
   - ใช้ `UnoCSS()` จาก `unocss/vite`
   - ใช้ `uno.css` หรือ `virtual:uno.css` ใน entry point
   - ถ้าไม่ต้องการ SSR → `tanstackStart({ spa: { enabled: true } })`
   - ทำ `/follow-lib-unocss` เพื่อ config ครบถ้วน
2. Rsbuild:
   - ใช้ `@tanstack/solid-start/plugin/rsbuild`
   - ใช้ `@rsbuild/plugin-solid`
3. ทำตาม `/follow-tool-vite`

### 4. Configure TypeScript

> Goal: ตั้งค่า `tsconfig.json`

1. ใช้ `jsx: "preserve"` และ `jsxImportSource: "solid-js"`
2. ใช้ `moduleResolution: "Bundler"` และ `target: "ES2022"`
3. ใช้ `module: "ESNext"` และ `skipLibCheck: true`
4. หลีกเลี่ยง `verbatimModuleSyntax` เพื่อป้องกัน server bundles รั่วไป client
5. ทำตาม `/follow-lang-typescript`

### 5. Define Server Functions

> Goal: สร้าง type-safe RPC ระหว่าง client และ server

1. ใช้ `createServerFn({ method: 'GET' | 'POST' })` จาก `@tanstack/solid-start`
2. ใช้ `.validator(schema)` สำหรับ input validation (zod หรือ plain function ที่ return typed data)
3. ใช้ `.handler(async ({ data }) => ...)` — code ใน handler รันบน server เท่านั้น
4. Client เรียก server function เหมือน local async function แล้ว `router.invalidate()` เพื่อ refetch loader data
5. แยก server-only code ไว้ใน `.server.ts` files หรือใช้ `serverOnly()` guard เพื่อกัน bundle รั่วไป client

### 6. Define Server Routes

> Goal: สร้าง HTTP endpoints สำหรับ external callers

1. สร้างไฟล์ใน `src/routes/` พร้อม `server.handlers` ใน `createFileRoute`:
   ```ts
   // src/routes/api/users.ts
   export const Route = createFileRoute('/api/users')({
     server: {
       handlers: {
         GET: async ({ request }) => Response.json({ users: [] }),
         POST: async ({ request }) => { const body = await request.json(); /* ... */ },
       },
     },
   })
   ```
2. ใช้ wildcard route `src/routes/api.$.ts` (path `/api/$`) เมื่อต้องการ dispatch หลาย endpoints จาก handler เดียว
3. ใช้ `server.middleware` หรือ `createHandlers` สำหรับ auth/logging ต่อ route
4. Server routes สำหรับ HTTP จากภายนอก app; ถ้าเรียกจากภายใน app ให้ใช้ server functions แทน (Step 5)

### 7. Integrate TanStack Router

> Goal: สร้าง type-safe routing

1. ใช้ `createFileRoute` สำหรับ file-based routing — routeTree ถูก generate อัตโนมัติเป็น `src/routeTree.gen.ts`
2. ใช้ `loader` สำหรับ data loading และ `validateSearch` สำหรับ search params
3. ใช้ `HydrationScript` สำหรับ client-side hydration
4. ทำตาม `/follow-lib-tanstack-ecosystem`

### 8. Optional Custom Server Entry

> Goal: ปรับ server behavior เมื่อจำเป็น

1. สร้าง `src/server.ts` (ชื่อนี้ถูกจองโดย Start — ห้ามใช้เป็นไฟล์อื่น):
   ```ts
   import handler, { createServerEntry } from '@tanstack/solid-start/server-entry'
   export default createServerEntry({
     fetch(request) { return handler.fetch(request) },
   })
   ```
2. ใช้ `createStartHandler` + `defineHandlerCallback` เมื่อต้อง wrap render pipeline
3. Pass request context ผ่าน `handler.fetch(request, { context })` และ augment `Register['server']['requestContext']`
4. ถ้าไม่ต้องการ custom entry → ไม่ต้องสร้างไฟล์นี้

### 9. Optional Effect-TS And Single Responsibility

> Goal: ใช้ Effect-TS และตรวจสอบ single responsibility

1. ถ้ามี complex effects หรือต้องการ dependency injection → ทำ `/follow-lib-effect-ts`
2. ทำ `/follow-single-responsibility` เพื่อตรวจสอบ modules, components, server functions
3. ตรวจสอบว่า business logic แยกจาก UI และ routes ชัดเจน

### 10. Build And Deploy

> Goal: รัน build และ deploy

1. รัน `bun run build` (`vite build`)
2. Dev: `bun run dev` (`vite dev`) — server routes/functions ทำงานใน dev server โดยตรง
3. Production server:
   - ติดตั้ง `nitro` + `nitro()` plugin ใน vite config ถ้าต้องการ `bun .output/server/index.mjs` (ตั้ง `NITRO_PRESET=bun` หรือ `nitro({ preset: 'bun' })`)
   - หรือ serve `dist/client` statics + route เฉพาะ `/api/*`, `/_serverFn/*` เข้า built server entry (`dist/server/server.js` export `{ fetch }`)
4. ถ้า deploy บน Cloudflare Workers หรือ serverless → ทำ `/deploy-to-cloudflare`

## Rules

### 1. Server Functions Vs Server Routes

- ใช้ server functions สำหรับ call จากภายใน app (type-safe, auto serialization)
- ใช้ server routes สำหรับ raw HTTP endpoints (webhooks, external API, non-JSON)
- ใช้ `.validator()` ทุก server function ที่รับ input (ทำ `/follow-lib-zod` ถ้าใช้ zod)
- ห้ามใส่ secrets หรือ sensitive data ใน response `message`/`data`

### 2. Server-Only Code

- แยก server-only logic ไว้ใน `.server.ts` หรือ guard ด้วย `serverOnly()`
- หลีกเลี่ยง `verbatimModuleSyntax` เพื่อป้องกัน server bundles รั่วไป client
- ไม่ pass sensitive data ผ่าน request context ที่ไม่จำเป็น

### 3. SolidJS Requirements

- ใช้ SolidJS 1.x
- ตั้งค่า `vite-plugin-solid` ด้วย `ssr: true` (ต้องอยู่หลัง `tanstackStart()`)
- ใช้ `HydrationScript` สำหรับ hydration
- ทำตาม `/follow-lib-solidjs`

### 4. UnoCSS Styling

- ใช้ `unocss/vite` plugin ใน `vite.config.ts`
- ใช้ `presetWind4` และ `presetIcons`
- ใช้ `transformerVariantGroup` และ `transformerDirectives`
- ทำตาม `/follow-lib-unocss` สำหรับ config ครบถ้วน

### 5. Error Handling

- ใช้ route-level `middleware` และ `onError` สำหรับ centralized error handling
- ใช้ common error semantics (404, 400, 401) ตามจริง ไม่ wrap ทุก response เป็น 200
- ห้ามใส่ sensitive information ใน error `message` หรือ `data`

### 6. Performance

- ใช้ `dynamic imports` สำหรับ lazy loading
- ใช้ `lazy()` พร้อม `<Suspense>` สำหรับ heavy components
- ใช้ `defaultPreload: "intent"` และ `scrollRestoration: true`
- ใช้ `manualChunks` ใน Vite config สำหรับ vendor splitting

### 7. TanStack Library Selection

เลือก TanStack library ตาม use case จริง — ห้ามติดตั้งโดยไม่มีความจำเป็น:

- Router → type-safe routing (มีแล้วใน skill นี้)
- Query → server state (fetch/cache/mutation) เมื่อ client-side cache จำเป็น
- Store → client state เมื่อ signal เดียวไม่พอ (shared state ข้าม component)
- Start → SSR/server functions (ใช้แล้วใน skill นี้)
- Form → form state + validation (ใช้เมื่อมี form จริง เช่น login, settings)
- Table → headless data grid เมื่อมีตาราง complex (sorting/filter/pagination)
- Virtual → virtualized list เมื่อ render รายการยาว >100 items
- Pacer → debounce/throttle/rate-limit utilities
- DB → reactive local-first data — `0.x` ยังไม่ stable ต้องมีเหตุผลชัดเจนก่อนใช้
- AI → LLM integration — `RC/0.x` ใช้เฉพาะเมื่อต้องการจริง

กฎ maturity: `DB`, `Store`, `Pacer`, `AI` เป็น 0.x/RC — ห้าม adopt โดยไม่มี justification; `Query`, `Router`, `Start`, `Form`, `Table`, `Virtual` stable พร้อมใช้

- ใช้ /follow-create-plugins vite ถ้าจำเป็น (create web solid tanstack router)
- ใช้ /run-dev ถ้าจำเป็น

## Expected Outcome

- TanStack Start (SolidJS) project ที่ตั้งค่าครบ
- Server functions / server routes แบบ type-safe ครบวงจร (server → client)
- Type-safe routing ด้วย TanStack Router พร้อม generated routeTree
- SSR/streaming หรือ SPA mode ทำงานได้อย่างถูกต้อง
- UnoCSS พร้อมใช้งานด้วย presetWind4
- Client เรียก server function เหมือน local async function
