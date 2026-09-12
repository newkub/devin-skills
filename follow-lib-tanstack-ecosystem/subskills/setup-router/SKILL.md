---
name: follow-lib-tanstack-ecosystem-setup-router
description: ติดตั้ง TanStack Router — createRouter, routes, file-based vs code-based
argument-hint: "[framework]"
related:
  - follow-lib-tanstack-ecosystem
  - run-install
  - run-test
  - run-typecheck
  - resolve-errors
---

## Goal

ติดตั้งและตั้งค่า TanStack Router (v1) — `createRouter`, route tree และเลือก file-based หรือ code-based routing

## Scope

ใช้เมื่อต้อง setup TanStack Router ใน React หรือ Solid project — ครอบคลุม install, route definitions, root route, `<Outlet>` และ router provider (Router/Start รองรับเฉพาะ React และ Solid)

## Execute

### 1. Install Package

> Goal: ติดตั้ง router package ตาม framework

1. React: `bun add @tanstack/react-router`; Solid: `bun add @tanstack/solid-router`
2. สำหรับ file-based routing ติดตั้ง dev plugin: `bun add -D @tanstack/router-plugin` (Vite plugin หรือ CLI `@tanstack/router-cli`)
3. ถ้า `package.json` มี Router อยู่แล้ว → verify version เท่านั้น
4. ถ้าไม่แน่ใจ → ดู official docs ที่ `https://tanstack.com/router`

### 2. Choose Routing Mode

> Goal: เลือก file-based หรือ code-based routing

1. File-based (recommended): routes จากไฟล์ใน `src/routes/` — plugin generate `routeTree.gen.ts` อัตโนมัติ ได้ type-safety เต็มรูปแบบ
2. Code-based: สร้าง routes ด้วย `createRootRoute()`, `createRoute()`, `createFileRoute()` ใน code — เหมาะกับ route น้อยหรือ dynamic
3. ตั้งค่า Vite plugin `TanStackRouterVite()` ก่อน `react()`/`solid()` plugin ถ้าใช้ file-based
4. ถ้าเลือกไม่ได้ → stop และ `/ask-me` หรือ default เป็น file-based

### 3. Create Router And Root Route

> Goal: สร้าง route tree และ router instance

1. สร้าง root route ด้วย `createRootRoute()` ที่ render `<Outlet />` สำหรับ children
2. สร้าง routes เช่น `createRoute({ getParentRoute: () => rootRoute, path: '/', component })`
3. สร้าง router: `const router = createRouter({ routeTree })`
4. Register module augmentation เพื่อ type-safety:

   ```ts
   declare module '@tanstack/react-router' {
     interface Register { router: typeof router }
   }
   ```

5. Render `<RouterProvider router={router} />` ที่ entry point

### 4. Verify

> Goal: ตรวจสอบ routing ทำงานและ type-safe

1. ทำ `/run-typecheck` — `Register` interface ต้องให้ typed `<Link>`, `useParams`, `useSearch`
2. รัน dev server แล้ว navigate ทดสอบ route จริง
3. ทำ `/run-test` ถ้ามี tests ที่เกี่ยวข้อง
4. ถ้า verify ไม่ผ่าน → ทำ `/resolve-errors` max 3 รอบ แล้ว stop report

## Rules

- ใช้ `createFileRoute`/`createRoute` จาก package หลัก — ห้าม import จาก generated file โดยตรง
- ห้าม commit `routeTree.gen.ts` ที่แก้เอง — ไฟล์นี้ generate อัตโนมัติ
- ใช้ `<Link to="...">` ของ router เสมอ ห้ามใช้ `<a href>` สำหรับ internal navigation
- Validate search params ด้วย `validateSearch` แทน parse เองใน component
- ใช้ `/follow-lib-tanstack-ecosystem` สำหรับ overview และ ecosystem selection

## Expected Outcome

- TanStack Router ติดตั้งพร้อม route tree ที่ type-safe
- File-based หรือ code-based routing ตามที่เลือก ทำงานถูกต้อง
- Navigation ผ่าน `<Link>` และ typed params/search ใช้ได้
- Typecheck และ dev server ผ่าน
