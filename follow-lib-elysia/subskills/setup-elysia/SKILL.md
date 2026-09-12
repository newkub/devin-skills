---
name: follow-lib-elysia-setup-elysia
description: ติดตั้ง Elysia — bun add, app.listen, routes, plugins พื้นฐาน
argument-hint: "[scope]"
related:
  - follow-lib-elysia
  - use-bun-native-api
  - run-install
  - run-dev
  - resolve-errors
---

## Goal

ติดตั้งและตั้งค่า Elysia บน Bun — `new Elysia()`, `.listen()`, routes และ plugins พื้นฐาน

## Scope

ใช้เมื่อต้อง setup Elysia API ครั้งแรก — ครอบคลุม install, app instance, routes, schema validation และ plugin registration พื้นฐาน (Bun runtime เท่านั้น)

## Execute

### 1. Install Elysia

> Goal: ติดตั้ง Elysia บน Bun runtime

1. ติดตั้ง `bun add elysia` หรือสร้าง project ใหม่ด้วย `bun create elysia app`
2. ติดตั้ง `bun add @elysia/eden` ถ้าต้องการ end-to-end type safety
3. ถ้ามีอยู่แล้ว → verify version ใน `package.json` เท่านั้น (idempotent)
4. ใช้ Bun เป็น runtime เท่านั้น — ทำ `/use-bun-native-api`
5. ใช้ `bun --hot` สำหรับ hot reload ใน dev

### 2. Create App Instance

> Goal: สร้าง `new Elysia()` และ `.listen()`

```ts
import { Elysia } from 'elysia'

const app = new Elysia()
  .get('/', () => 'Hello Elysia')
  .listen(3000)
```

1. สร้าง instance เดียวต่อ app — chain methods ได้
2. `.listen(port)` start server — ใช้ `Bun.serve` ผ่าน `.listen()` เท่านั้น
3. Export `type App = typeof app` ถ้าจะใช้ Eden client

### 3. Define Routes And Validation

> Goal: routes พื้นฐานพร้อม schema validation

1. HTTP verbs: `.get()`, `.post()`, `.put()`, `.patch()`, `.delete()`; params ด้วย `/users/:id`; wildcards `/*`
2. `.group('/api', app => app...)` สำหรับ prefix grouping
3. Validation ด้วย `Elysia.t` (TypeBox) ใน route options: `body`, `query`, `params`, `response`
4. Standard Schema (Zod/Valibot/ArkType) ใช้ได้ถ้า project ใช้อยู่แล้ว — ทำ `/follow-lib-zod` ถ้าใช้ Zod
5. `context.status(code, value)` สำหรับ type-safe status codes (v1.4)

### 4. Register Plugins

> Goal: ใช้ `.use()` และ plugin patterns พื้นฐาน

1. `.use(plugin)` register plugin — ประกาศ dependency ชัดเจน (main ต้อง `.use()` ก่อน)
2. `.decorate()` inject properties เข้า context; `.state()` inject mutable state
3. `.guard()` สำหรับ scoped validation; `.scope()` control merge behavior
4. แยก logic เป็น plugins เล็กๆ ที่ใช้ซ้ำได้

### 5. Verify

> Goal: smoke test API endpoints

1. รัน `bun --hot src/index.ts` หรือ `bun run dev` — server start บน port ที่กำหนด
2. `curl` หรือเปิด endpoint ทดสอบ response และ validation (invalid body ต้อง 422)
3. ถ้าพัง → ทำ `/resolve-errors` max 3 รอบ แล้ว stop report

## Rules

- ใช้ Bun runtime เท่านั้น — Elysia ไม่รองรับ Node.js เป็น target หลัก
- สร้าง instance เดียว — chain `.use()`/routes บน instance เดียวกัน
- ใช้ `Elysia.t` เป็น default validator — Standard Schema เฉพาะเมื่อ project ใช้อยู่แล้ว
- ลำดับ route: static path ก่อน dynamic path
- ใช้ `/follow-lib-elysia` สำหรับ full reference, lifecycle hooks และ version notes

## Expected Outcome

- Elysia server รันบน Bun พร้อม routes และ validation
- Plugins register ถูกต้องด้วย `.use()`
- Smoke test endpoints ผ่าน
