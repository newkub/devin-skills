---
name: follow-elysia
description: แนวทางการพัฒนา API ด้วย Elysia บน Bun แบบ type-safe ตาม official best practices
---

## Goal

พัฒนา API ด้วย Elysia บน Bun แบบ type-safe ครบวงจร ตาม official best practices

## Scope

ใช้สำหรับ project ที่ใช้ Elysia เป็น web framework บน Bun runtime

## Execute

### 1. Install And Setup

1. ติดตั้ง `bun add elysia`
2. ถ้าต้องการ end-to-end type safety ติดตั้ง `bun add @elysia/eden`
3. ใช้ Bun เป็น runtime เท่านั้น (ทำ `/follow-bun`)
4. สร้าง `new Elysia()` instance และ `.listen(port)`

### 2. Define Routes

1. ใช้ HTTP verb methods: `.get()`, `.post()`, `.put()`, `.patch()`, `.delete()`
2. ใช้ dynamic path parameters: `/users/:id`, `/posts/:category/:slug`
3. ใช้ wildcards: `/files/*` สำหรับ catch-all
4. ใช้ `.group()` สำหรับ route grouping และ prefix
5. ใช้ custom methods ด้วย `.route(method, path, handler)`

### 3. Handle Context

1. ใช้ `context.body`, `context.query`, `context.params`, `context.headers`, `context.cookie`
2. ใช้ `context.store` สำหรับ global mutable state
3. ใช้ `context.set.headers` สำหรับ set response headers
4. ใช้ `context.status(code, value)` สำหรับ type-safe status codes (never-throw approach)
5. ใช้ `context.redirect(path)` สำหรับ redirects

### 4. Validate With Schema

1. ใช้ `Elysia.t` (TypeBox) สำหรับ schema validation แบบ built-in
2. ใช้ Standard Schema (Zod, Valibot, ArkType) ได้โดย import แล้วส่งให้ route handler
3. กำหนด schema ใน route options: `body`, `query`, `params`, `headers`, `cookie`, `response`
4. ใช้ `.model()` สำหรับ reusable named schemas
5. ใช้ `.guard()` สำหรับ apply schema และ validation แบบ scoped
6. ทำ `/follow-zod` ถ้าใช้ Zod เป็น validator

### 5. Use Lifecycle Hooks

1. ใช้ `.onRequest()` สำหรับ notify new request
2. ใช้ `.parse()` สำหรับ custom body parsing
3. ใช้ `.transform()` สำหรับ modify context ก่อน validation
4. ใช้ `.beforeHandle()` สำหรับ custom validation ก่อน handler
5. ใช้ `.afterHandle()` สำหรับ tweak returned value
6. ใช้ `.mapResponse()` สำหรับ map returned value เป็น HTTP response
7. ใช้ `.onError()` สำหรับ handle errors ใน life-cycle
8. ใช้ `.afterResponse()` สำหรับ cleanup หลัง response ส่งแล้ว

### 6. Use Plugins

1. ใช้ `.use(plugin)` สำหรับ register plugin
2. ประกาศ dependency อย่างชัดเจน: main instance ต้อง `.use(auth)` ก่อนใช้ `Auth`
3. ใช้ `.decorate()` สำหรับ inject custom properties เข้า context
4. ใช้ `.state()` สำหรับ inject mutable state
5. ใช้ `.guard()` สำหรับ scoped validation และ schema
6. ใช้ `.scope()` สำหรับ control plugin merge behavior (local, scoped, global)
7. ใช้ `.lazyLoadModule()` สำหรับ deferred module loading

### 7. Setup Eden Client (ถ้าจำเป็น)

1. Export `type App` จาก server: `export type App = typeof app`
2. ใช้ `treaty<App>(url)` จาก `@elysia/eden` (recommended)
3. เรียก API แบบ type-safe: `app.users({ id: 1 }).get()`
4. ใช้ `edenFetch<App>(url)` สำหรับ fetch-like syntax
5. จัดการ error ด้วย `{ data, error }` destructuring

## Rules

### 1. Project Setup

- ใช้ Bun เป็น runtime เท่านั้น (ทำ `/follow-bun`)
- ใช้ `bun add elysia` สำหรับติดตั้ง
- ใช้ `Bun.serve` ผ่าน Elysia `.listen()` เท่านั้น
- ใช้ `bun --hot` สำหรับ hot reloading ใน development

### 2. Route Definition

- ใช้ HTTP verb methods (`.get()`, `.post()`, ฯลฯ) สำหรับ define routes
- ใช้ dynamic params ด้วย `:param` syntax
- ใช้ `.group()` สำหรับ route prefix และ organization
- ลำดับ route: static path ก่อน dynamic path

### 3. Handler Patterns

- ใช้ `context.status(code, value)` แทน `throw` (never-throw approach)
- ใช้ `context.set.headers` สำหรับ response headers
- ใช้ `context.store` สำหรับ global state ที่ mutable
- ใช้ `context.cookie` สำหรับ cookie management
- ใช้ `context.redirect()` สำหรับ redirects

### 4. Validation

- ใช้ `Elysia.t` (TypeBox) เป็น default validator
- ใช้ Standard Schema (Zod, Valibot) ได้ถ้า project ใช้อยู่แล้ว
- กำหนด schema สำหรับ `body`, `query`, `params`, `headers`, `response`
- ใช้ `.model()` สำหรับ reusable schemas
- ใช้ `.guard()` สำหรับ scoped validation

### 5. Lifecycle Hooks

- ใช้ `.beforeHandle()` สำหรับ auth และ custom validation
- ใช้ `.afterHandle()` สำหรับ transform response
- ใช้ `.onError()` สำหรับ centralized error handling
- ใช้ `.derive()` สำหรับ derive additional context values
- ใช้ `.resolve()` สำหรับ resolve values before handler
- ลำดับ hooks: Request → Parse → Transform → Before Handle → Handler → After Handle → Map Response

### 6. Plugin Design

- ประกาศ dependency อย่างชัดเจน (Dependency Injection pattern)
- ใช้ `.decorate()` สำหรับ inject services เข้า context
- ใช้ `.state()` สำหรับ inject mutable state
- ใช้ `.guard()` สำหรับ scoped schema และ validation
- ใช้ `.scope()` สำหรับ control merge behavior
- แยก logic เป็น plugins ขนาดเล็ก ใช้ซ้ำได้

### 7. Eden Type Safety

- Export `type App` จาก server
- ใช้ `treaty<App>()` (recommended) แทน `edenFetch`
- จัดการ error ด้วย `{ data, error }` destructuring
- ใช้ Eden สำหรับ type-safe unit tests

### 8. Error Handling

- ใช้ `.onError()` สำหรับ centralized error handling
- ใช้ `context.status(code, message)` แทน throw เมื่อเป็นไปได้
- ใช้ custom error class ถ้าจำเป็น แล้ว handle ใน `.onError()`
- ส่ง error message ที่ meaningful และไม่ leak sensitive info

## Expected Outcome

- API แบบ type-safe ครบวงจร (server → client ผ่าน Eden)
- Validation ครบทุก layer (body, query, params, headers, response)
- Plugin architecture ที่ modular และ reusable
- Error handling แบบ centralized และ type-safe
- สอดคล้องกับ official ElysiaJS documentation
- ใช้ Bun native APIs ตาม `/follow-bun`
