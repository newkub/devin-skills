---
name: follow-tanstack-start
description: ตั้งค่า TanStack Start สำหรับ full-stack React และ Solid พร้อม SSR
---

## Goal

ตั้งค่า TanStack Start สำหรับ full-stack type-safe applications พร้อม SSR, streaming และ server functions

## Scope

ใช้สำหรับ TanStack Start ใน React Start และ Solid Start projects

## Execute

### 1. Setup And Configuration

1. ติดตั้งด้วย `bun add @tanstack/[framework]-start`
2. ใช้ Vite เป็น build tool
3. ตั้งค่า `@tanstack/router-plugin` สำหรับ file-based routing
4. ใช้ `vite.config.ts` พร้อม `tanstackStart()` plugin

### 2. Server Functions

1. ใช้ `createServerFn` สำหรับ server-side logic
2. ใช้ server functions ใน route `loader` และ `beforeLoad`
3. ส่ง data จาก server ไป client พร้อม type safety
4. ใช้ `chatParamsFromRequest()` สำหรับ parse HTTP requests

### 3. SSR And Streaming

1. ใช้ zero-configuration SSR
2. รองรับ streaming พร้อม Suspense
3. ใช้ `dehydrate()` และ `HydrationBoundary` สำหรับ TanStack Query SSR
4. ใช้ SWR caching สำหรับ loader results
5. ใช้ deployment presets สำหรับ multiple platforms

### 4. Data Fetching Integration

1. ใช้ `queryClient.ensureQueryData()` ใน `beforeLoad`
2. ใช้ `useSuspenseQuery` สำหรับ React Suspense integration
3. ส่ง `queryClient` ผ่าน Router context
4. ใช้ `loader` ใน Router สำหรับ prefetch queries

### 5. Deployment

1. ใช้ Nitro presets สำหรับ deployment targets
2. รองรับ Vercel, Cloudflare, Netlify, Node.js
3. ใช้ `vite build` สำหรับ production build

## Rules

### 1. SSR Best Practices

- สร้าง `QueryClient` ใหม่ทุก request บน server
- ใช้ `dehydrate()` และ `HydrationBoundary` สำหรับ state transfer
- ตั้ง `staleTime > 0` เมื่อ prefetch บน server
- ใช้ streaming สำหรับ progressive data loading

### 2. Type Safety

- ใช้ `createServerFn` พร้อม type inference
- ใช้ type-safe route definitions
- ใช้ type-safe `loader` และ `beforeLoad`
- End-to-end type safety จาก server ถึง client

## Expected Outcome

- TanStack Start ติดตั้งพร้อม zero-configuration SSR
- Server functions ทำงานพร้อม type safety
- Streaming และ Suspense รองรับ progressive loading
- TanStack Query integration สำหรับ data fetching
- Deployment presets รองรับ multiple platforms
