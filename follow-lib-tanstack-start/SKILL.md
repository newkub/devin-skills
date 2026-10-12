---
name: follow-lib-tanstack-start
description: ใช้ TanStack Start ครบวงจร — SSR/streaming, server functions, API routes, middleware, deployment
argument-hint: "[react|solid] [deploy-target]"
related:
  - follow-lib-tanstack-ecosystem
  - run-dev
  - run-typecheck
  - resolve-errors
---

## Goal

ใช้ TanStack Start ครบตั้งแต่ scaffold ถึง deploy — SSR/streaming, `createServerFn` RPC-style functions, API routes, middleware, deployment adapters

## Scope

ใช้กับ React/Solid full-stack apps — SSR routes, server functions, REST endpoints, middleware; รองรับเฉพาะ React/Solid — Vue/Svelte → Nuxt/SvelteKit; routing details → `follow-router`

- part of TanStack ecosystem — selection/dispatch อยู่ที่ `/follow-lib-tanstack-ecosystem`

## Execute

### 1. Scaffold Or Install

> Goal: Start app ที่รันได้

1. New → `bunx @tanstack/cli create my-app` (ดู `use-cli`) หรือ official starter
2. Existing Vite app → `bun add @tanstack/react-start @tanstack/react-router` + devDeps ตาม docs
3. `vite.config.ts` ใช้ Start plugin:

   ```ts
   import { tanstackStart } from '@tanstack/react-start/plugin/vite'
   import viteReact from '@vitejs/plugin-react'

   export default defineConfig({ plugins: [tanstackStart(), viteReact()] })
   ```

### 2. App Shell And Routes

> Goal: hydration shell + file routes

1. `src/router.tsx` → `createRouter({ routeTree })` + `Register` module declaration
2. `src/routes/__root.tsx` — root document: `<html><head><Meta/><Scripts/></head>` + hydration shell + `<Outlet/>`
3. File routes ใน `src/routes/` ตาม `follow-router` conventions (`$param`, `_pathless`, `route.tsx` layouts)
4. Route `loader` รันบน server ตอน SSR, client ตอน navigate — เขียนเป็น isomorphic-safe

### 3. Server Functions

> Goal: server code callable จาก client แบบ type-safe

```ts
import { createServerFn } from '@tanstack/react-start'

export const getTodos = createServerFn({ method: 'GET' })
  .handler(async () => db.todos.findMany())

export const addTodo = createServerFn({ method: 'POST' })
  .inputValidator((data: { title: string }) => data)
  .handler(async ({ data }) => db.todos.create({ data }))
```

1. `.inputValidator()` validate payload (ใช้ zod/standard schema ได้) — types ไหลไปถึง client call site
2. Client เรียกเหมือน function ปกติ: `await addTodo({ data: { title } })` — Start serialize/HTTP ให้
3. Server-only context: `getWebRequest()`, headers, cookies ผ่าน `@tanstack/react-start/server` helpers (`setResponseHeader`, `getCookie`)

### 4. API Routes And Middleware

> Goal: REST endpoints + request pipeline

1. API routes: `src/routes/api/todos.ts` → `createFileRoute('/api/todos')({ server: { handlers: { GET, POST } } })` สำหรับ external/webhook consumers
2. Middleware: `createMiddleware()` — request/response pipeline สำหรับ auth, logging, rate-limit; chain ต่อ server functions ได้
3. เลือกให้ถูก: **server functions** = app-internal RPC, **API routes** = external HTTP contract

### 5. SSR, Streaming, Deploy

> Goal: production-ready SSR

1. SSR streaming default — slow data → deferred/`Await` patterns แทน block ทั้งหน้า
2. Deploy ตาม adapter ใน docs: Node (`bun run build` → `output/`), Cloudflare Workers, Vercel, Netlify — เลือก preset/adapter ตาม target
3. Static prerendering: routes ที่ static → prerender config ใน `tanstackStart()` options

### 6. Verify

1. `/run-dev` — view-source เห็น SSR HTML, hydration ไม่ mismatch
2. Server fn + API route ทดสอบจริง (`curl` API route, click UI สำหรับ server fn)
3. `/run-typecheck` + build production + run output จริง
4. ถ้า fail → `/resolve-errors` max 3 รอบ

## Rules

- Server-only modules (db clients, secrets) ห้าม import ใน shared/client code — bundle จะ leak; ใช้ server functions เป็น boundary
- `inputValidator` เสมอบน server functions ที่รับ input — trust boundary เหมือน API จริง
- Loader ต้อง isomorphic (รันทั้ง server+client) — code ที่ server-only ให้อยู่ใน server fn / `serverOnly()`
- Route tree generated ห้ามแก้เอง
- ใช้ `/follow-lib-tanstack-ecosystem` สำหรับ overview

## Expected Outcome

- SSR streaming app dev/build/deploy ผ่าน
- Server functions + API routes type-safe, middleware ทำงาน
- Hydration ไม่ mismatch, server secrets ไม่ leak
