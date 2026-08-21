---
name: follow-orpc
description: แนวทางการพัฒนา API ด้วย oRPC แบบ type-safe ตาม official best practices
allowed-tools:
- read
- edit
- grep
- glob
- exec
triggers:
- user
- model
---

## Goal

พัฒนา API ด้วย oRPC แบบ type-safe ครบวงจร ตาม official best practices

## Scope

ใช้สำหรับ project ที่ใช้ oRPC เป็น API layer (ทั้ง standalone และภายใน TanStack Start/Next.js)

## Execute

### 1. Install Packages

1. ติดตั้ง `bun add @orpc/server @orpc/client`
2. ถ้าใช้ TanStack Query ติดตั้ง `bun add @orpc/tanstack-query`
3. ถ้าใช้ OpenAPI ติดตั้ง `bun add @orpc/openapi`
4. ใช้ Zod สำหรับ schema validation (ทำ `/follow-zod`)

### 2. Define Procedures

1. สร้าง `os` builder พร้อม initial context ด้วย `.$context<{ headers: Headers }>()`
2. ใช้ `.input(zodSchema)` สำหรับ input validation
3. ใช้ `.handler(async ({ input, context }) => { ... })` สำหรับ business logic
4. ใช้ `.errors({ CODE: { data: zodSchema } })` สำหรับ type-safe error definitions
5. ใช้ `.use(middleware)` สำหรับ auth, logging, หรือ resource injection
6. Export `type Router` สำหรับ client-side type inference

### 3. Setup Middleware

1. ใช้ `.$context<{ ... }>()` ก่อน `.middleware()` เพื่อระบุ dependent context
2. ใช้ `next({ context: { ... } })` สำหรับ inject execution context (auth, db, etc.)
3. ใช้ `throw new ORPCError('CODE')` สำหรับ guard และ error throwing
4. ใช้ `.mapInput()` สำหรับ adapt middleware ให้รับ input shape อื่น
5. ใช้ inline middleware ด้วย `.use(async ({ context, next }) => { ... })` สำหรับ simple cases

### 4. Setup Server Handler

1. ใช้ `RPCHandler` จาก `@orpc/server/fetch` (หรือ `@orpc/server/node` สำหรับ Node.js)
2. ตั้งค่า `interceptors: [onError((error) => console.error(error))]`
3. ใช้ `handler.handle(request, { context: { headers: request.headers } })` สำหรับ initial context
4. ตรวจสอบ `result.matched` ก่อน return response
5. ถ้าใช้ TanStack Start ใช้ `createFileRoute` พร้อม `server.handlers`

### 5. Create Client

1. ใช้ `RPCLink` จาก `@orpc/client/fetch` สำหรับ create link
2. ใช้ `createORPCClient(link)` พร้อม `RouterClient<typeof router>` type
3. ใช้ `headers: () => ({ ... })` สำหรับ dynamic headers (เช่น auth token)
4. ใช้ `interceptors: [onError((error) => { ... })]` สำหรับ client-side error logging
5. ถ้าใช้ TanStack Start ใช้ `createIsomorphicFn` สำหรับ environment-specific config

### 6. Handle Errors

1. ใช้ `.errors()` ใน procedure สำหรับ define type-safe errors
2. ใช้ `safe()` จาก `@orpc/client` แทน try/catch สำหรับ tuple/object destructuring
3. ใช้ `isDefinedError(error)` สำหรับ narrow error type จาก `.errors()`
4. ใช้ `createSafeClient` สำหรับ auto-wrap ทุก procedure calls ด้วย `safe()`
5. ห้ามใส่ sensitive information ใน `message` หรือ `data` (ถูกส่งไป client)

### 7. Integrate TanStack Query (ถ้าจำเป็น)

1. ใช้ `createTanstackQueryUtils` จาก `@orpc/tanstack-query`
2. ใช้ `orpc.<path>.queryOptions({ input: { ... } })` สำหรับ type-safe queries
3. ใช้ `orpc.<path>.mutationOptions({ ... })` สำหรับ mutations
4. ใช้ `experimental_defaults` สำหรับ default query/mutation options
5. ใช้ `isDefinedError` ใน `onError` callbacks สำหรับ type-safe error handling

## Rules

### 1. Procedure Design

- ใช้ `.$context<{ ... }>()` สำหรับ initial context (environment-specific dependencies)
- ใช้ `.input(zodSchema)` สำหรับทุก procedure ที่รับ input (ทำ `/follow-zod`)
- ใช้ `.errors()` สำหรับ application-specific errors ที่ต้องการ type safety
- ใช้ common error codes (`UNAUTHORIZED`, `NOT_FOUND`) โดยไม่ต้อง define schema ทุกครั้ง
- Export `type Router` สำหรับ client-side type inference

### 2. Middleware Design

- ใช้ `.$context` ก่อน `.middleware()` เพื่อระบุ dependent context
- ใช้ `next({ context: { ... } })` สำหรับ inject execution context
- ใช้ `throw new ORPCError('CODE')` สำหรับ guards
- ตรวจสอบ context ก่อน init resource (dedup ถ้ามีอยู่แล้ว)
- ใช้ `.mapInput()` สำหรับ reuse middleware กับ input shape อื่น

### 3. Server Setup

- ใช้ `RPCHandler` จาก package ที่ตรงกับ runtime (`/fetch`, `/node`, `bun`)
- ตั้งค่า `interceptors` สำหรับ error logging
- ส่ง initial context ผ่าน `handler.handle(request, { context: { ... } })`
- ตรวจสอบ `result.matched` ก่อน return response

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
- ใช้ `.queryOptions()`, `.mutationOptions()`, `.streamedOptions()` สำหรับ type-safe options
- ใช้ `experimental_defaults` สำหรับ default options
- ใช้ `isDefinedError` ใน `onError` callbacks

## Expected Outcome

- API แบบ type-safe ครบวงจร (server → client)
- Error handling แบบ type-safe ด้วย `safe()` และ `isDefinedError`
- Middleware สำหรับ auth, logging, resource injection
- Schema validation ด้วย Zod สำหรับทุก input
- Client ที่เรียก procedure เหมือน local function พร้อม auto-completion
- สอดคล้องกับ official oRPC documentation
