---
name: follow-solid-tanstack
description: ตั้งค่าและพัฒนา full-stack app ด้วย TanStack Start (SolidJS), oRPC, Elysia และ UnoCSS
related:
  - follow-lib-unocss
  - follow-tool-vite
  - follow-lang-typescript
  - follow-lib-tanstack-ecosystem
  - follow-lib-elysia
  - follow-lib-effect-ts
  - follow-single-responsibility
---

## Goal

ตั้งค่าและพัฒนา full-stack application ด้วย TanStack Start (SolidJS), Elysia และ oRPC แบบ type-safe

## Scope

ใช้สำหรับ projects ที่ต้องการ:

- Full-stack framework ด้วย SolidJS
- Server-side rendering (SSR) และ streaming
- Type-safe routing ด้วย TanStack Router
- Type-safe API ด้วย oRPC
- Backend server ด้วย Elysia บน Bun
- Styling ด้วย UnoCSS

## Execute

### 1. Setup Project

> Goal: สร้าง project ใหม่

1. ใช้ TanStack Start CLI:
   ```bash
   bun create @tanstack/start@latest
   ```
2. เลือก SolidJS เป็น framework
3. ตรวจสอบ project structure และไฟล์ config

### 2. Install Dependencies

> Goal: ติดตั้ง packages ที่จำเป็น

1. Core:
   ```bash
   bun i @tanstack/solid-start @tanstack/solid-router solid-js
   bun i -D vite vite-plugin-solid typescript @types/node
   ```
2. oRPC:
   ```bash
   bun i @orpc/server @orpc/client
   bun i -D zod
   ```
3. Elysia:
   ```bash
   bun i elysia @elysia/eden
   ```
4. UnoCSS:
   ```bash
   bun i -D unocss @iconify-json/mdi
   ```
5. Optional:
   - `@orpc/tanstack-query` สำหรับ TanStack Query integration
   - `@orpc/openapi` สำหรับ OpenAPI

### 3. Configure Build Tool

> Goal: ตั้งค่า Vite หรือ Rsbuild

1. Vite:
   - ใช้ `@tanstack/solid-start/plugin/vite`
   - ใช้ `vite-plugin-solid` ด้วย `ssr: true`
   - ใช้ `UnoCSS()` จาก `unocss/vite`
   - ใช้ `uno.css` หรือ `virtual:uno.css` ใน entry point
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

### 5. Setup oRPC Server

> Goal: สร้าง type-safe API layer

1. สร้าง `os` builder พร้อม `.$context<{ headers: Headers }>()`
2. ใช้ `.input(zodSchema)` สำหรับทุก procedure ที่รับ input
3. ใช้ `.errors({ CODE: { data: zodSchema } })` สำหรับ application-specific errors
4. ใช้ `.use(middleware)` สำหรับ auth, logging, หรือ resource injection
5. สร้าง `RPCHandler` พร้อม `interceptors: [onError(...)]`
6. ส่ง initial context ผ่าน `handler.handle(request, { context: { headers: request.headers } })`
7. ตรวจสอบ `result.matched` ก่อน return response

### 6. Setup oRPC Client

> Goal: สร้าง client สำหรับ call API

1. ใช้ `RPCLink` จาก `@orpc/client/fetch`
2. ใช้ `createORPCClient(link)` พร้อม `RouterClient<typeof router>`
3. ใช้ `headers: () => ({ ... })` สำหรับ dynamic headers
4. ใช้ `createSafeClient` ถ้าต้องการ `safe()` ทุก procedure
5. ถ้าใช้ TanStack Query → ใช้ `createTanstackQueryUtils`

### 7. Integrate TanStack Router

> Goal: สร้าง type-safe routing

1. ใช้ `createFileRoute` สำหรับ file-based routing
2. ใช้ server functions ผ่าน `server.handlers` ถ้าจำเป็น
3. ใช้ `HydrationScript` สำหรับ client-side hydration
4. ทำตาม `/follow-lib-tanstack-ecosystem`

### 8. Setup Elysia Server

> Goal: สร้าง backend server ด้วย Elysia

1. สร้าง `src/server.ts` หรือ `src/index.ts` ด้วย `new Elysia()`
2. ใช้ `.onRequest()` สำหรับ headers/context logging
3. ใช้ `.onError()` สำหรับ centralized error handling
4. Mount oRPC handler ใน Elysia route เช่น `.all('/rpc/*', handler)`
5. ใช้ `.listen(port)` สำหรับ Bun server
6. ทำตาม `/follow-lib-elysia` เพื่อ routes, validation, lifecycle

### 9. Optional Effect-TS And Single Responsibility

> Goal: ใช้ Effect-TS และตรวจสอบ single responsibility

1. ถ้ามี complex effects หรือต้องการ dependency injection → ทำ `/follow-lib-effect-ts`
2. ทำ `/follow-single-responsibility` เพื่อตรวจสอบ modules, components, procedures
3. ตรวจสอบว่า business logic แยกจาก UI และ routes ชัดเจน

### 10. Build And Deploy

> Goal: รัน build และ deploy

1. รัน `bun run build`
2. รัน `bun run start` เพื่อทดสอบ
3. ตั้งค่า Elysia port และ host ตาม target platform
4. ถ้า deploy บน Cloudflare Workers หรือ serverless → ทำ `/deploy-to-cloudflare`
5. ใช้ `bun --hot` สำหรับ development hot reload

## Rules

### 1. oRPC Procedure Design

- ใช้ `.$context<{ ... }>()` สำหรับ initial context
- ใช้ `.input(zodSchema)` สำหรับทุก procedure (ทำ `/follow-lib-zod`)
- ใช้ `.errors()` สำหรับ application-specific errors
- ใช้ common error codes เช่น `UNAUTHORIZED`, `NOT_FOUND` โดยไม่ต้อง define schema
- Export `type Router` สำหรับ client-side type inference

### 2. oRPC Middleware

- ใช้ `.$context` ก่อน `.middleware()` เพื่อระบุ dependent context
- ใช้ `next({ context: { ... } })` สำหรับ inject execution context
- ใช้ `throw new ORPCError('CODE')` สำหรับ guards
- ใช้ `.mapInput()` สำหรับ reuse middleware กับ input shape อื่น
- ไม่ pass sensitive data ผ่าน context ที่ไม่จำเป็น

### 3. SolidJS Requirements

- ใช้ SolidJS 1.x สำหรับ Bun deployment
- ตั้งค่า `vite-plugin-solid` ด้วย `ssr: true`
- ใช้ `HydrationScript` สำหรับ hydration
- ทำตาม `/follow-framework-solidjs`

### 4. Elysia Server

- ใช้ Bun เป็น runtime เท่านั้น (ทำ `/follow-lang-bun`)
- ใช้ `new Elysia()` และ `.listen(port)`
- ใช้ `.onError()` สำหรับ centralized error handling
- Mount oRPC handler ใน Elysia ด้วย `.all()`
- ทำตาม `/follow-lib-elysia` สำหรับ routes, validation, lifecycle

### 5. UnoCSS Styling

- ใช้ `unocss/vite` plugin ใน `vite.config.ts`
- ใช้ `presetWind4` และ `presetIcons`
- ใช้ `transformerVariantGroup` และ `transformerDirectives`
- ทำตาม `/follow-lib-unocss` สำหรับ config ครบถ้วน

### 6. Error Handling

- ใช้ `safe()` แทน try/catch ใน client code
- ใช้ `isDefinedError(error)` สำหรับ narrow typed errors
- ห้ามใส่ sensitive information ใน `message` หรือ `data`
- ใช้ `onError` interceptor ทั้ง server และ client

### 7. Performance

- ใช้ `shallowRef` สำหรับ large immutable data
- ใช้ `dynamic imports` สำหรับ lazy loading
- ใช้ `lazy()` พร้อม `<Suspense>` สำหรับ heavy components
- ใช้ `defaultPreload: "intent"` และ `scrollRestoration: true`
- ใช้ `manualChunks` ใน Vite config สำหรับ vendor splitting

## Expected Outcome

- TanStack Start (SolidJS) project ที่ตั้งค่าด้วย Elysia
- oRPC API แบบ type-safe ครบวงจร (server → client)
- Type-safe routing ด้วย TanStack Router
- SSR และ streaming ทำงานได้อย่างถูกต้อง
- UnoCSS พร้อมใช้งานด้วย presetWind4
- Backend server รันได้บน Bun ด้วย Elysia
- Client เรียก oRPC procedure เหมือน local function
