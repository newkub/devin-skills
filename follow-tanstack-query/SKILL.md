---
name: follow-tanstack-query
description: ตั้งค่าและใช้งาน TanStack Query v5 สำหรับ data fetching และ cache management
---

## Goal

ตั้งค่า TanStack Query v5 สำหรับ type-safe data fetching, cache management และ optimistic updates

## Scope

ใช้สำหรับ TanStack Query v5 ใน React, Vue, Solid, Svelte, Angular, Lit projects

## Execute

### 1. Setup And Configuration

1. ติดตั้งด้วย `bun add @tanstack/[framework]-query`
2. สร้าง `QueryClient` พร้อม `defaultOptions` (`staleTime`, `retry`, `refetchOnWindowFocus`)
3. ใช้ `QueryClientProvider` ที่ app root
4. ติดตั้ง DevTools สำหรับ development: `bun add -D @tanstack/[framework]-query-devtools`

### 2. Queries

1. ใช้ `useQuery` พร้อม single object signature: `useQuery({ queryKey, queryFn, ...options })`
2. กำหนด `queryKey` ที่ unique และ serializable
3. ใช้ `staleTime` ที่เหมาะสม (ไม่ใช่ 0 โดยค่าเริ่มต้น)
4. ใช้ `useInfiniteQuery` สำหรับ pagination พร้อม `maxPages` option
5. ใช้ `staleTime: Infinity` สำหรับ data ที่ไม่เปลี่ยน
6. หลีกเลี่ยง `useQuery` ใน loops

### 3. Mutations

1. ใช้ `useMutation` พร้อม single object signature: `useMutation({ mutationFn, ...options })`
2. ใช้ `onSuccess`/`onError`/`onSettled` callbacks สำหรับ side effects
3. ใช้ `invalidateQueries` หลัง mutation สำหรับ refetch
4. ใช้ optimistic updates ระดับ UI สำหรับ localized updates
5. ใช้ `setQueryData` ระดับ cache สำหรับ multi-component updates พร้อม rollback mechanism

### 4. Prefetching And SSR

1. ใช้ `prefetchQuery` สำหรับ populate cache ล่วงหน้า (returns `Promise<void>`)
2. ใช้ `fetchQuery` เมื่อต้องการ data กลับมา
3. ใช้ `ensureQueryData` สำหรับ cache-or-fetch pattern
4. ใช้ `dehydrate()` บน server และ `HydrationBoundary` บน client สำหรับ SSR
5. สร้าง `QueryClient` ใหม่ทุก request บน server (ไม่ใช้ shared instance)
6. ตั้ง `staleTime > 0` เมื่อ prefetch บน server เพื่อหลีกเลี่ยง refetch บน client

### 5. DevTools

1. ใช้ `<TanStackQueryDevtools />` เฉพาะใน development mode
2. ใช้ floating mode ที่จำ state ใน `localStorage`
3. ใช้ browser extensions สำหรับ Chrome, Firefox, Edge

## Rules

### 1. Query Best Practices

- กำหนด `queryKey` ที่ unique และ serializable
- ใช้ `staleTime` ที่เหมาะสม (ไม่ใช่ 0 โดยค่าเริ่มต้น)
- ใช้ `useMutation` สำหรับ mutations ไม่ใช่ `useQuery`
- ใช้ `invalidateQueries` หลัง mutation สำหรับ refetch
- ใช้ `prefetchQuery` สำหรับ SSR และ prefetching
- หลีกเลี่ยง `useQuery` ใน loops

### 2. SSR Best Practices

- สร้าง `QueryClient` ใหม่ทุก request บน server
- ใช้ `dehydrate()` และ `HydrationBoundary` สำหรับ state transfer
- ตั้ง `staleTime > 0` เมื่อ prefetch บน server
- ไม่สร้าง `QueryClient` ที่ file root level บน server

### 3. Type Safety

- ใช้ TypeScript types อย่างเต็มรูปแบบ
- ใช้ type inference จาก TanStack Query APIs
- ใช้ `queryKey` ที่ type-safe

## Expected Outcome

- TanStack Query v5 ติดตั้งและทำงานได้พร้อม type-safe queries
- Cache management มีประสิทธิภาพ
- SSR ทำงานถูกต้องพร้อม hydration
- Optimistic updates รองรับทั้ง UI และ cache level
- DevTools ติดตั้งสำหรับ development
