---
name: follow-lib-orpc
description: พัฒนา API ด้วย oRPC 1.15+ แบบ type-safe ตาม official best practices
related:
  - follow-lib-zod
  - follow-best-practice
  - use-my-packages-on-registry
  - setup-cicd
---

## Goal

พัฒนา API ด้วย oRPC เวอร์ชันล่าสุด แบบ type-safe ครบวงจร ตาม official best practices

## Scope

ใช้สำหรับ project ที่ใช้ oRPC เป็น API layer (ทั้ง standalone และภายใน TanStack Start/Next.js)

- ติดตั้ง oRPC packages (server, client, openapi, tanstack-query)
- สร้าง procedures พร้อม input/output validation และ type-safe errors
- ตั้งค่า middleware, server handler, client
- ใช้ TanStack Query และ OpenAPI ถ้าจำเป็น

## Execute

### 1. Install Packages

> Goal: ติดตั้ง oRPC packages และ dependencies

1. ติดตั้ง `bun add @orpc/server@1.15.0 @orpc/client` หรือ `bun add @orpc/server @orpc/client` (latest stable)
2. ถ้าใช้ OpenAPI ติดตั้ง `bun add @orpc/openapi`
3. ถ้าใช้ TanStack Query ติดตั้ง `bun add @orpc/tanstack-query`
4. ถ้าต้องการ contract-first ติดตั้ง `bun add @orpc/contract`
5. ใช้ Zod สำหรับ schema validation (ทำ `/follow-lib-zod`)

### 2. Define Procedures

> Goal: สร้าง procedures พร้อม input validation และ error handling

1. สร้าง `os` builder จาก `@orpc/server`
2. ใช้ `.$context<{ headers: Headers }>()` สำหรับ initial context
3. ใช้ `.meta(...)` สำหรับ OpenAPI metadata ถ้าจำเป็น
4. ใช้ `.input(zodSchema)` สำหรับ input validation
5. ใช้ `.output(zodSchema)` สำหรับ output validation ถ้าจำเป็น
6. ใช้ `.errors({ CODE: { data: zodSchema } })` สำหรับ type-safe error definitions
7. ใช้ `.handler(async ({ input, context, errors }) => { ... })` สำหรับ business logic
8. ใช้ `.use(middleware)` สำหรับ auth, logging, หรือ resource injection
9. Export `type Router` สำหรับ client-side type inference

### 3. Setup Middleware

> Goal: ตั้งค่า middleware สำหรับ auth และ resource injection

1. ใช้ `.$context<{ ... }>()` ก่อน `.use()` เพื่อระบุ dependent context
2. ใช้ `next({ context: { ... } })` สำหรับ inject execution context (auth, db, etc.)
3. ใช้ `throw new ORPCError('CODE')` สำหรับ guard และ error throwing
4. ใช้ inline middleware ด้วย `.use(async ({ context, next }) => { ... })` สำหรับ simple cases
5. ใช้ `.mapInput()` บน middleware ถ้าต้องการรับ input shape อื่น

### 4. Setup Server Handler

> Goal: ตั้งค่า server handler สำหรับ runtime

1. ใช้ `RPCHandler` จาก `@orpc/server/fetch` (หรือ `@orpc/server/node` สำหรับ Node.js)
2. ใช้ `OpenAPIHandler` จาก `@orpc/openapi/*` ถ้าต้องการรองรับ OpenAPI/REST
3. ตั้งค่า `interceptors: [onError((error) => console.error(error))]`
4. ใช้ `handler.handle(request, { context: { headers: request.headers } })` สำหรับ initial context
5. ตรวจสอบ `matched` ก่อน return response
6. ถ้าใช้ TanStack Start ใช้ `createFileRoute` พร้อม `server.handlers`

### 5. Create Client

> Goal: สร้าง type-safe client สำหรับเรียก procedures

1. ใช้ `RPCLink` จาก `@orpc/client/fetch` สำหรับ create link
2. ใช้ `createORPCClient(link)` พร้อม `RouterClient<typeof router>` type
3. ใช้ `headers: () => ({ ... })` สำหรับ dynamic headers (เช่น auth token)
4. ใช้ `interceptors: [onError((error) => { ... })]` สำหรับ client-side error logging
5. ถ้าใช้ TanStack Start ใช้ `createIsomorphicFn` สำหรับ environment-specific config

### 6. Handle Errors

> Goal: จัดการ errors แบบ type-safe ด้วย `safe()` และ `isDefinedError`

1. ใช้ `.errors()` ใน procedure สำหรับ define type-safe errors
2. ใช้ `safe()` จาก `@orpc/client` แทน try/catch สำหรับ tuple destructuring
3. ใช้ `isDefinedError(error)` จาก `@orpc/client` สำหรับ narrow error type จาก `.errors()`
4. ใช้ `createSafeClient` สำหรับ auto-wrap ทุก procedure calls ด้วย `safe()`
5. ห้ามใส่ sensitive information ใน `message` หรือ `data` (ถูกส่งไป client)

### 7. Integrate TanStack Query

> Goal: ตั้งค่า TanStack Query ถ้าจำเป็น

1. ใช้ `createTanstackQueryUtils` จาก `@orpc/tanstack-query`
2. ใช้ `orpc.<path>.queryOptions({ input: { ... } })` สำหรับ type-safe queries
3. ใช้ `orpc.<path>.mutationOptions({ ... })` สำหรับ mutations
4. ใช้ `isDefinedError` ใน `onError` callbacks สำหรับ type-safe error handling

### 8. OpenAPI And Contracts

> Goal: สร้าง OpenAPI docs และ contract-first API ถ้าจำเป็น

1. ใช้ `OpenAPIHandler` จาก `@orpc/openapi/fetch` หรือ adapter ทีตรงกับ runtime
2. ตั้งค่า `prefix` ให้ตรงกับ route handler
3. ใช้ `@orpc/contract` สำหรับ define contract ก่อน implement
4. ใช้ `ContractRouterClient<typeof contract>` สำหรับ client จาก contract

## Rules

### 1. Procedure Design

- ใช้ `.$context<{ ... }>()` สำหรับ initial context (environment-specific dependencies)
- ใช้ `.input(zodSchema)` สำหรับทุก procedure ที่รับ input (ทำ `/follow-lib-zod`)
- ใช้ `.output(zodSchema)` เมื่อต้องการ validate response และ OpenAPI
- ใช้ `.errors()` สำหรับ application-specific errors ที่ต้องการ type safety
- ใช้ common error codes (`UNAUTHORIZED`, `NOT_FOUND`) โดยไม่ต้อง define schema ทุกครั้ง
- Export `type Router` สำหรับ client-side type inference

### 2. Middleware Design

- ใช้ `.$context` ก่อน `.use()` เพื่อระบุ dependent context
- ใช้ `next({ context: { ... } })` สำหรับ inject execution context
- ใช้ `throw new ORPCError('CODE')` สำหรับ guards
- ตรวจสอบ context ก่อน init resource (dedup ถ้ามีอยู่แล้ว)

### 3. Server Setup

- ใช้ `RPCHandler` จาก package ที่ตรงกับ runtime (`/fetch`, `/node`)
- ใช้ `OpenAPIHandler` ถ้าต้องการรองรับ OpenAPI/REST
- ตั้งค่า `interceptors` สำหรับ error logging
- ส่ง initial context ผ่าน `handler.handle(request, { context: { ... } })`
- ตรวจสอบ `matched` ก่อน return response

### 4. Client Setup

- ใช้ `RPCLink` จาก `@orpc/client/fetch`
- ใช้ `RouterClient<typeof router>` สำหรับ type-safe client
- ใช้ `headers: () => ({ ... })` สำหรับ dynamic headers
- ใช้ `createIsomorphicFn` สำหรับ SSR/CSR environment-specific config
- ใช้ `createSafeClient` ถ้าใช้ `safe()` บ่อย

### 5. Error Handling

- ใช้ `safe()` แทน try/catch ใน client code
- ใช้ `isDefinedError(error)` สำหรับ narrow typed errors
- ห้ามใส่ sensitive information ใน `message` หรือ `data`
- ใช้ `.errors()` เฉพาะ application-specific cases ไม่ใช่ common errors
- ใช้ `ORPCError` โดยตรงใน utility functions ที่ไม่มี access to `errors` object

### 6. Context Management

- ใช้ initial context สำหรับ environment-specific values (headers, env vars, db URLs)
- ใช้ execution context สำหรับ runtime data (auth, db connections)
- รวมทั้งสองแบบ: initial context สำหรับ static deps, middleware สำหรับ dynamic deps
- อย่า pass sensitive data ผ่าน context ที่ไม่จำเป็น

### 7. TanStack Query Integration

- ใช้ `createTanstackQueryUtils` แทนการสร้าง custom query utils
- ใช้ `.queryOptions()`, `.mutationOptions()` สำหรับ type-safe options
- ใช้ `isDefinedError` ใน `onError` callbacks

### 8. Version Notes

- Latest stable: `@orpc/server@1.15.0` / `@orpc/client@1.15.0` (verified 2026-07-30)
- oRPC v2 beta: `@orpc/server@beta @orpc/client@beta` (2.0.0-beta.32) มี breaking changes เช่น `route`/`prefix`/`tag` → `meta(openapi(...))`, `isDefinedError` → `isInferableError`, `safe` คืน `[error, data, inferableError]`, `eventIterator` → `asyncIteratorObject`
- ตรวจสอบ version ใน `package.json` ก่อนเลือก API

- ใช้ `/follow-lib-zod` ถ้าใช้ Zod เป็น validator
- ใช้ `/follow-best-practice` ถ้าจำเป็น
- ใช้ `/use-my-packages-on-registry` ถ้าจำเป็น
- ใช้ `/setup-cicd` ถ้าจำเป็น

## Expected Outcome

- API แบบ type-safe ครบวงจร (server → client)
- Error handling แบบ type-safe ด้วย `safe()` และ `isDefinedError`
- Middleware สำหรับ auth, logging, resource injection
- Schema validation ด้วย Zod สำหรับทุก input/output
- Client ที่เรียก procedure เหมือน local function พร้อม auto-completion
- สอดคล้องกับ official oRPC documentation
