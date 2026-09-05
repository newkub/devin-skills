---
name: follow-lib-elysia
description: พัฒนา API ด้วย Elysia 1.4+ บน Bun แบบ type-safe ตาม official best practices
related:
  - follow-lang-bun
  - follow-lib-zod
  - follow-best-practice
  - setup-cicd
  - use-my-packages-on-registry
---

## Goal

พัฒนา API ด้วย Elysia เวอร์ชันล่าสุดบน Bun runtime แบบ type-safe ครบวงจร ตาม official best practices

## Scope

ใช้สำหรับ project ที่ใช้ Elysia เป็น web framework บน Bun runtime

- ติดตั้ง Elysia, Eden, และ plugins ที่จำเป็น
- กำหนด routes, handlers, validation, lifecycle hooks
- ใช้ Standard Schema (Zod, Valibot, ArkType, Effect Schema, Yup, Joi)
- สร้าง type-safe client ผ่าน Eden
- สร้าง OpenAPI docs ด้วย `@elysia/openapi`

## Execute

### 1. Install And Setup

> Goal: ติดตั้ง Elysia และ setup บน Bun runtime

1. ติดตั้ง `bun add elysia` หรือ `bun add elysia@1.4.30` (latest stable)
2. ถ้าต้องการ end-to-end type safety ติดตั้ง `bun add @elysia/eden`
3. สร้าง project ใหม่ได้ด้วย `bun create elysia app`
4. ใช้ `bun --hot` สำหรับ hot reloading ใน development
5. ใช้ Bun เป็น runtime เท่านั้น (ทำ `/follow-lang-bun`)
6. สร้าง `new Elysia()` instance และ `.listen(port)`

### 2. Define Routes

> Goal: กำหนด routes ด้วย HTTP verb methods และ path parameters

1. ใช้ HTTP verb methods: `.get()`, `.post()`, `.put()`, `.patch()`, `.delete()`
2. ใช้ dynamic path parameters: `/users/:id`, `/posts/:category/:slug`
3. ใช้ wildcards: `/files/*` สำหรับ catch-all
4. ใช้ `.group()` สำหรับ route grouping และ prefix
5. ใช้ custom methods ด้วย `.route(method, path, handler)`

### 3. Handle Context

> Goal: จัดการ request context และ response headers

1. ใช้ `context.body`, `context.query`, `context.params`, `context.headers`, `context.cookie`, `context.request`
2. ใช้ `context.store` สำหรับ global mutable state
3. ใช้ `context.set.headers` สำหรับ set response headers
4. ใช้ `context.set.status` หรือ `context.status(code, value)` สำหรับ type-safe status codes
5. ใช้ `context.redirect(path)` สำหรับ redirects

### 4. Validate With Schema

> Goal: ตรวจสอบ input ด้วย schema validation

1. ใช้ `Elysia.t` (TypeBox) สำหรับ schema validation แบบ built-in
2. ใช้ Standard Schema (Zod, Valibot, ArkType, Effect Schema, Yup, Joi) ได้โดย import แล้วส่งให้ route handler
3. กำหนด schema ใน route options: `body`, `query`, `params`, `headers`, `cookie`, `response`
4. ใช้ `.model()` สำหรับ reusable named schemas
5. ใช้ `.guard()` สำหรับ apply schema และ validation แบบ scoped
6. ทำ `/follow-lib-zod` ถ้าใช้ Zod เป็น validator

### 5. Use Lifecycle Hooks

> Goal: ใช้ lifecycle hooks สำหรับ request/response pipeline

1. ใช้ `.onRequest()` สำหรับ notify new request
2. ใช้ `.onParse()` สำหรับ custom body parsing
3. ใช้ `.onTransform()` สำหรับ modify context ก่อน validation
4. ใช้ `.onBeforeHandle()` สำหรับ custom validation ก่อน handler
5. ใช้ `.onAfterHandle()` สำหรับ tweak returned value
6. ใช้ `.onMapResponse()` สำหรับ map returned value เป็น HTTP response
7. ใช้ `.onError()` สำหรับ handle errors ใน life-cycle
8. ใช้ `.onAfterResponse()` สำหรับ cleanup หลัง response ส่งแล้ว
9. ใช้ `.derive()` หรือ `.resolve()` สำหรับ derive additional context values

### 6. Use Plugins

> Goal: ใช้ plugins สำหรับ modular architecture

1. ใช้ `.use(plugin)` สำหรับ register plugin
2. ประกาศ dependency อย่างชัดเจน: main instance ต้อง `.use(auth)` ก่อนใช้ `Auth`
3. ใช้ `.decorate()` สำหรับ inject custom properties เข้า context
4. ใช้ `.state()` สำหรับ inject mutable state
5. ใช้ `.guard()` สำหรับ scoped validation และ schema
6. ใช้ `.scope()` สำหรับ control plugin merge behavior (local, scoped, global)

### 7. Setup Eden Client

> Goal: ตั้งค่า Eden Client ถ้าจำเป็น

1. Export `type App` จาก server: `export type App = typeof app`
2. ใช้ `treaty<App>(url)` จาก `@elysia/eden` (recommended)
3. เรียก API แบบ type-safe: `app.users({ id: 1 }).get()`
4. ใช้ `edenFetch<App>(url)` สำหรับ fetch-like syntax
5. จัดการ error ด้วย `{ data, error }` destructuring

### 8. OpenAPI And Production

> Goal: สร้าง OpenAPI docs และเตรียม production

1. ติดตั้ง `@elysia/openapi` ด้วย `bun add @elysia/openapi`
2. ใช้ `app.use(openapi())` เพื่อ generate OpenAPI spec และ docs UI
3. ใช้ `fromTypes()` ถ้าต้องการ generate OpenAPI จาก TypeScript types โดยตรง
4. ใช้ `@elysia/swagger` ถ้าต้องการ Swagger UI
5. รัน production ด้วย `bun run start` และตรวจสอบ `Bun.version` ให้รองรับ Elysia

## Rules

### 1. Project Setup

- ใช้ Bun เป็น runtime เท่านั้น (ทำ `/follow-lang-bun`)
- ใช้ `bun add elysia` สำหรับติดตั้ง
- ใช้ `Bun.serve` ผ่าน Elysia `.listen()` เท่านั้น
- ใช้ `bun --hot` สำหรับ hot reloading ใน development

### 2. Route Definition

- ใช้ HTTP verb methods (`.get()`, `.post()`, ฯลฯ) สำหรับ define routes
- ใช้ dynamic params ด้วย `:param` syntax
- ใช้ `.group()` สำหรับ route prefix และ organization
- ลำดับ route: static path ก่อน dynamic path

### 3. Handler Patterns

- ใช้ `context.status(code, value)` หรือ `context.set.status` สำหรับ type-safe status (v1.4)
- ใช้ `context.set.headers` สำหรับ response headers
- ใช้ `context.store` สำหรับ global state ที่ mutable
- ใช้ `context.cookie` สำหรับ cookie management
- ใช้ `context.redirect()` สำหรับ redirects

### 4. Validation

- ใช้ `Elysia.t` (TypeBox) เป็น default validator
- ใช้ Standard Schema (Zod, Valibot, ArkType, Effect Schema, Yup, Joi) ได้ถ้า project ใช้อยู่แล้ว
- กำหนด schema สำหรับ `body`, `query`, `params`, `headers`, `response`
- ใช้ `.model()` สำหรับ reusable schemas
- ใช้ `.guard()` สำหรับ scoped validation

### 5. Lifecycle Hooks

- ใช้ `.onBeforeHandle()` สำหรับ auth และ custom validation
- ใช้ `.onAfterHandle()` สำหรับ transform response
- ใช้ `.onError()` สำหรับ centralized error handling
- ใช้ `.derive()` สำหรับ derive additional context values (แนะนำสำหรับ v2)
- ใช้ `.resolve()` สำหรับ resolve values before handler (ยังใช้ได้ใน v1.4)
- ลำดับ hooks: Request → Parse → Transform → Before Handle → Handler → After Handle → Map Response → After Response

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
- ใช้ `context.status(code, message)` แทน throw เมื่อเป็นไปได้ (v1.4)
- ใช้ custom error class ถ้าจำเป็น แล้ว handle ใน `.onError()`
- ส่ง error message ที่ meaningful และไม่ leak sensitive info

### 9. Version Notes

- Latest stable: `elysia@1.4.30`, `@elysia/eden` latest (verified 2026-07-30)
- Elysia 2.0 beta: `bun add elysia@next` (2.0.0-beta.12) หรือ migrate ด้วย `bunx @elysia/codemod@latest`
- v2.0 มี breaking changes ได้แก่ route hooks/schemas ต้องอยู่ก่อน handler, `resolve` → `derive`, `as: 'scoped'` → `'plugin'`, ใช้ `problem` สำหรับ RFC 9457 errors แทน `status`
- ตรวจสอบ version ใน `package.json` ก่อนเลือก API

- ใช้ `/follow-lang-bun` ถ้าจำเป็น
- ใช้ `/follow-lib-zod` ถ้าใช้ Zod เป็น validator
- ใช้ `/follow-best-practice` ถ้าจำเป็น
- ใช้ `/setup-cicd` ถ้าจำเป็น
- ใช้ `/use-my-packages-on-registry` ถ้าจำเป็น

## Expected Outcome

- API แบบ type-safe ครบวงจร (server → client ผ่าน Eden)
- Validation ครบทุก layer (body, query, params, headers, response)
- Plugin architecture ที่ modular และ reusable
- Error handling แบบ centralized และ type-safe
- OpenAPI docs สร้างอัตโนมัติจาก code
- สอดคล้องกับ official ElysiaJS documentation
- ใช้ Bun native APIs ตาม `/follow-lang-bun`
