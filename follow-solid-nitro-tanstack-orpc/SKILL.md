---
name: follow-solid-nitro-tanstack-orpc
description: ตั้งค่า TanStack Start (SolidJS) กับ Nitro และ oRPC สำหรับ full-stack type-safe
allowed-tools:
  - read
  - edit
  - write
  - grep
  - glob
  - exec
triggers:
  - user
  - model
related:
  - follow-nitro
  - follow-solidjs
  - follow-orpc
  - follow-zod
  - follow-vite
  - follow-deploy-to-cloudflare
---

## Goal

ตั้งค่าและพัฒนา full-stack application ด้วย TanStack Start (SolidJS), Nitro และ oRPC แบบ type-safe

## Scope

ใช้สำหรับ projects ที่ต้องการ:

- Full-stack framework ด้วย SolidJS
- Server-side rendering (SSR) และ streaming
- Type-safe routing ด้วย TanStack Router
- Type-safe API ด้วย oRPC
- Deployment ผ่าน Nitro ไปยังหลาย platforms

## Execute

### 1. Setup Project

สร้าง project ใหม่

> Goal: มีโครงสร้างเริ่มต้นที่ถูกต้อง

1. ใช้ TanStack Start CLI:
   ```bash
   bun create @tanstack/start@latest
   ```
2. เลือก SolidJS เป็น framework
3. ตรวจสอบ project structure และไฟล์ config

### 2. Install Dependencies

ติดตั้ง packages ที่จำเป็น

> Goal: dependencies ครบสำหรับ SSR, routing, และ oRPC

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
3. Optional:
   - `@orpc/tanstack-query` สำหรับ TanStack Query integration
   - `@orpc/openapi` สำหรับ OpenAPI

### 3. Configure Build Tool

ตั้งค่า Vite หรือ Rsbuild

> Goal: build tool รองรับ SSR และ Nitro

1. Vite:
   - ใช้ `@tanstack/solid-start/plugin/vite`
   - ใช้ `vite-plugin-solid` ด้วย `ssr: true`
   - ใช้ `nitro/vite` หรือ `nitro({ preset: 'bun' })` สำหรับ Bun
2. Rsbuild:
   - ใช้ `@tanstack/solid-start/plugin/rsbuild`
   - ใช้ `@rsbuild/plugin-solid`
3. ทำตาม `/follow-vite` หรือ `/follow-vite` ตามทีเลือก

### 4. Configure TypeScript

ตั้งค่า `tsconfig.json`

> Goal: TypeScript รองรับ SolidJS, oRPC และ Nitro

1. ใช้ `jsx: "preserve"` และ `jsxImportSource: "solid-js"`
2. ใช้ `moduleResolution: "Bundler"` และ `target: "ES2022"`
3. ใช้ `module: "ESNext"` และ `skipLibCheck: true`
4. หลีกเลี่ยง `verbatimModuleSyntax` เพื่อป้องกัน server bundles รั่วไป client
5. ทำตาม `/follow-typescript`

### 5. Setup oRPC Server

สร้าง type-safe API layer

> Goal: API procedures มี validation และ context ครบ

1. สร้าง `os` builder พร้อม `.$context<{ headers: Headers }>()`
2. ใช้ `.input(zodSchema)` สำหรับทุก procedure ที่รับ input
3. ใช้ `.errors({ CODE: { data: zodSchema } })` สำหรับ application-specific errors
4. ใช้ `.use(middleware)` สำหรับ auth, logging, หรือ resource injection
5. สร้าง `RPCHandler` พร้อม `interceptors: [onError(...)]`
6. ส่ง initial context ผ่าน `handler.handle(request, { context: { headers: request.headers } })`
7. ตรวจสอบ `result.matched` ก่อน return response

### 6. Setup oRPC Client

สร้าง client สำหรับ call API

> Goal: client เรียก procedure เหมือน local function

1. ใช้ `RPCLink` จาก `@orpc/client/fetch`
2. ใช้ `createORPCClient(link)` พร้อม `RouterClient<typeof router>`
3. ใช้ `headers: () => ({ ... })` สำหรับ dynamic headers
4. ใช้ `createSafeClient` ถ้าต้องการ `safe()` ทุก procedure
5. ถ้าใช้ TanStack Query → ใช้ `createTanstackQueryUtils`

### 7. Integrate TanStack Router

สร้าง type-safe routing

> Goal: routes ทำงานร่วม SSR และ oRPC

1. ใช้ `createFileRoute` สำหรับ file-based routing
2. ใช้ server functions ผ่าน `server.handlers` ถ้าจำเป็น
3. ใช้ `HydrationScript` สำหรับ client-side hydration
4. ทำตาม `/follow-tanstack`

### 8. Build And Deploy

รัน build และ deploy

> Goal: project พร้อมใช้งานบน target platform

1. รัน `bun run build`
2. รัน `bun run start` เพื่อทดสอบ
3. เลือก Nitro preset ตาม target:
   - Bun: `bun`
   - Node.js: `node`
   - Cloudflare Workers: `cloudflare-workers`
   - Vercel/Netlify/Railway: preset ที่เกี่ยวข้อง
4. ทำตาม `/follow-deploy-to-cloudflare` ถ้า deploy ไป Cloudflare

## Rules

### 1. oRPC Procedure Design

- ใช้ `.$context<{ ... }>()` สำหรับ initial context
- ใช้ `.input(zodSchema)` สำหรับทุก procedure (ทำ `/follow-zod`)
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
- ทำตาม `/follow-solidjs`

### 4. Nitro Configuration

- ใช้ `nitro/vite` plugin สำหรับ integration กับ Vite Environments API
- ตั้งค่า `preset` ตาม deployment target
- ทำตาม `/follow-nitro` สำหรับ config ที่ครบถ้วน

### 5. Error Handling

- ใช้ `safe()` แทน try/catch ใน client code
- ใช้ `isDefinedError(error)` สำหรับ narrow typed errors
- ห้ามใส่ sensitive information ใน `message` หรือ `data`
- ใช้ `onError` interceptor ทั้ง server และ client

### 6. Performance

- ใช้ `shallowRef` สำหรับ large immutable data
- ใช้ `dynamic imports` สำหรับ lazy loading
- ใช้ `srvx` FastResponse สำหรับ Node.js throughput (~5%)
- ใช้ Vapor Mode ถ้าใช้ Vue 3.6+ (ไม่ใช่ scope หลักของ skill นี)

## Expected Outcome

- TanStack Start (SolidJS) project ที่ตั้งค่าด้วย Nitro
- oRPC API แบบ type-safe ครบวงจร (server → client)
- Type-safe routing ด้วย TanStack Router
- SSR และ streaming ทำงานได้อย่างถูกต้อง
- Deployment ไปยัง target platform ที่เลือก
- Client เรียก oRPC procedure เหมือน local function
