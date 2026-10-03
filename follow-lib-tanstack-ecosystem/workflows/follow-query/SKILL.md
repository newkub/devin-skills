---
name: follow-lib-tanstack-ecosystem-setup-query
description: ติดตั้ง TanStack Query — QueryClientProvider, query/mutation basics
argument-hint: "[framework]"
related:
  - follow-lib-tanstack-ecosystem
  - run-install
  - run-test
  - run-typecheck
  - resolve-errors
---

## Goal

ติดตั้งและตั้งค่า TanStack Query (v5) ให้พร้อมใช้งาน — `QueryClient`, `QueryClientProvider` และ query/mutation basics

## Scope

ใช้เมื่อต้อง setup TanStack Query ใน React, Solid, Vue, Svelte หรือ Angular project — ครอบคลุม install, provider setup, `useQuery`, `useMutation` และ cache invalidation พื้นฐาน

## Execute

### 1. Install Package

> Goal: ติดตั้ง package ตาม framework ที่ใช้

1. ตรวจ framework จาก `package.json` แล้วติดตั้งตาม naming convention `@tanstack/{framework}-query`:
   - `bun add @tanstack/react-query` สำหรับ React
   - `bun add @tanstack/solid-query` สำหรับ Solid
   - `bun add @tanstack/vue-query` สำหรับ Vue
   - `bun add @tanstack/svelte-query` สำหรับ Svelte
2. ถ้า `package.json` มี Query อยู่แล้ว → skip install และ verify version เท่านั้น (idempotent)
3. ถ้าไม่แน่ใจ version ล่าสุด → ดู official docs ที่ `https://tanstack.com/query`

### 2. Setup QueryClientProvider

> Goal: สร้าง `QueryClient` และ wrap app ด้วย provider

1. สร้าง `QueryClient` instance หนึ่งตัวที่ entry point:

   ```ts
   import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

   const queryClient = new QueryClient({
     defaultOptions: {
       queries: { staleTime: 60_000, retry: 1 },
     },
   })
   ```

2. Wrap root component: `<QueryClientProvider client={queryClient}>` (React) หรือ equivalent ของ framework นั้น — Vue ใช้ `app.use(VueQueryPlugin)`, Solid ใช้ `<QueryClientProvider>`
3. ตั้ง `staleTime` และ `gcTime` defaults ให้เหมาะกับ app — อย่าเว้น `staleTime: 0` ถ้า data ไม่เปลี่ยนบ่อย
4. สำหรับ SSR frameworks (Next.js, SolidStart) → สร้าง client ต่อ request ตาม official docs

### 3. Write Queries And Mutations

> Goal: ใช้ `useQuery` และ `useMutation` พื้นฐาน

1. ใช้ `useQuery({ queryKey, queryFn })` — queryKey เป็น array เช่น `['todos', id]` ห้ามใช้ string เดี่ยวถ้ามี params
2. ใช้ `useMutation({ mutationFn, onSuccess })` สำหรับ write operations
3. Invalidate cache หลัง mutation: `queryClient.invalidateQueries({ queryKey: ['todos'] })`
4. Handle `isPending`, `isError`, `data` states ใน UI ครบทุก branch

### 4. Verify

> Goal: ตรวจสอบว่า Query ทำงานถูกต้อง

1. ทำ `/run-typecheck` และ `/run-test`
2. ทดสอบ query fetch จริงใน dev — เช็ค loading/error states
3. ถ้า verify ไม่ผ่าน → ทำ `/resolve-errors` max 3 รอบ แล้ว stop report

## Rules

- สร้าง `QueryClient` instance เดียวต่อ app — ห้ามสร้างใน component
- ใช้ queryKey แบบ hierarchical array เสมอ ห้าม duplicate keys ข้าม features
- ห้ามใช้ `useQuery` สำหรับ mutations — ใช้ `useMutation` เท่านั้น
- invalidate แค่ keys ที่เกี่ยวข้อง — ห้าม invalidate ทั้ง cache ถ้าไม่จำเป็น
- ใช้ `/follow-lib-tanstack-ecosystem` สำหรับ overview และ library selection

## Expected Outcome

- TanStack Query ติดตั้งและ provider wrap root component ถูกต้อง
- `useQuery`/`useMutation` ใช้งานได้พร้อม loading/error states
- Cache invalidation ทำงานหลัง mutations
- Typecheck และ tests ผ่าน
