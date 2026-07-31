---
name: follow-tanstack-router
description: ตั้งค่าและใช้งาน TanStack Router v1 สำหรับ file-based routing และ type-safe navigation
---

## Goal

ตั้งค่า TanStack Router v1 สำหรับ file-based routing, type-safe navigation และ SSR กับ TanStack Start

## Scope

ใช้สำหรับ TanStack Router v1 ใน React, Solid, Vue projects

## Execute

### 1. Setup And File-Based Routing

1. ติดตั้งด้วย `bun add @tanstack/[framework]-router`
2. ใช้ `@tanstack/router-plugin` สำหรับ Vite เพื่อ file-based routing
3. สร้าง route tree อัตโนมัติด้วย `autoRouterGenerator`
4. ไฟล์ใน `src/routes/` สร้าง routes อัตโนมัติตาม directory structure
5. ใช้ `routeFileIgnorePattern` เพื่อ exclude ไฟล์ที่ไม่ใช่ routes

### 2. Type-Safe Search Params

1. กำหนด `validateSearch` พร้อม Zod schema สำหรับ type-safe URL search params
2. ใช้ `useSearch()` สำหรับอ่าน search params
3. ใช้ `useNavigate()` สำหรับ type-safe navigation
4. URL search params เป็น state manager ที่ share ได้

### 3. Route Guards And Data Loading

1. ใช้ `beforeLoad` สำหรับ auth guards และ redirects
2. ใช้ `redirect()` ใน `beforeLoad` สำหรับ auth redirects
3. ใช้ `loader` สำหรับ route-level data loading
4. กำหนด `staleTime` และ `gcTime` สำหรับ loader caching (SWR)
5. Loaders ทำงานบน client โดย default และบน server กับ TanStack Start

### 4. Type-Safe Navigation

1. ใช้ `<Link>` พร้อม type-safe `to` prop (auto-complete paths และ params)
2. ส่ง `params` ผ่าน `<Link>` พร้อม type checking
3. Register router instance ด้วย TypeScript module declaration
4. Type safety ครอบคลุม paths, params, search params และ context

### 5. SSR With TanStack Start

1. ใช้ TanStack Start สำหรับ zero-configuration SSR
2. รองรับ streaming และ deployment presets
3. Server functions ผ่าน `createServerFn`
4. ใช้ SWR caching สำหรับ loader results

## Rules

### 1. Routing Best Practices

- ใช้ file-based routing สำหรับ auto route tree generation
- กำหนด `validateSearch` สำหรับ type-safe search params
- ใช้ `beforeLoad` สำหรับ auth guards
- ใช้ `loader` สำหรับ data prefetching
- ใช้ `<Link>` พร้อม type-safe `to` prop
- ใช้ `redirect()` สำหรับ auth redirects

### 2. Type Safety

- Register router instance ด้วย module declaration
- ใช้ type inference จาก route definitions
- ใช้ Zod สำหรับ `validateSearch` schemas
- Type safety ครอบคลุม paths, params, search params, context

## Expected Outcome

- TanStack Router v1 ใช้ file-based routing พร้อม auto route tree
- Type-safe search params ด้วย Zod validation
- Auth guards และ data loading ผ่าน `beforeLoad` และ `loader`
- Type-safe navigation ด้วย `<Link>` และ `useNavigate`
- SSR ทำงานได้กับ TanStack Start
