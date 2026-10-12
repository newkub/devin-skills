---
name: follow-lib-tanstack-query
description: ใช้ TanStack Query ครบวงจร — setup, queries/mutations, caching, infinite queries, prefetch, optimistic updates, persistence
argument-hint: "[framework] [feature]"
related:
  - follow-lib-tanstack-ecosystem
  - run-test
  - run-typecheck
  - resolve-errors
---

## Goal

ใช้ TanStack Query (v5) ครบตั้งแต่ setup ถึง production patterns — provider, queries, mutations, caching strategy, dependent/infinite queries, prefetching, optimistic updates

## Scope

ใช้กับ React, Solid, Vue, Svelte, Angular — ครอบคลุม install, `QueryClient` config, `useQuery`/`useMutation`/`useInfiniteQuery`, cache management, devtools และ testing patterns

- part of TanStack ecosystem — selection/dispatch อยู่ที่ `/follow-lib-tanstack-ecosystem`

## Execute

### 1. Install Package

> Goal: ติดตั้ง package ตาม framework ที่ใช้

1. ตรวจ framework จาก `package.json` แล้วติดตั้งตาม naming convention `@tanstack/{framework}-query`:
   - `bun add @tanstack/react-query` / `solid-query` / `vue-query` / `svelte-query` / `angular-query-experimental`
2. ถ้ามีอยู่แล้ว → skip install verify version (idempotent); ถ้าไม่แน่ใจ latest → `npm view @tanstack/react-query version`

### 2. Setup QueryClientProvider

> Goal: `QueryClient` ตัวเดียว wrap app

```ts
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,      // data "fresh" 60s — ไม่ refetch ซ้ำใน window นี้
      gcTime: 300_000,        // cache เก็บ 5 นาทีหลัง unused
      retry: 1,
      refetchOnWindowFocus: false,  // ปิดถ้า app ไม่ต้องการ
    },
    mutations: { retry: 0 },  // mutations ไม่ควร retry อัตโนมัติ (non-idempotent)
  },
})
```

- React: `<QueryClientProvider client={queryClient}>`; Vue: `app.use(VueQueryPlugin)`; SSR (Next/Start) → client ต่อ request ตาม docs
- SSR + dehydration → `HydrationBoundary` + `dehydrate`/`hydrate` เพื่อส่ง cache จาก server

### 3. Query Patterns

> Goal: ใช้ query ได้ครบทุกรูปแบบ

1. **Basic**: `useQuery({ queryKey: ['todos', filters], queryFn })` — queryKey = array, ใส่ทุก variable ที่ queryFn ใช้
2. **Dependent**: `useQuery({ ..., enabled: !!userId })` — query รอ dependency
3. **Select**: `select: (data) => data.map(...)` — transform + subscribe เฉพาะ derived value (re-render น้อยลง)
4. **Infinite**: `useInfiniteQuery({ queryKey, queryFn: ({pageParam}) => fetch(pageParam), initialPageParam: 0, getNextPageParam })` + `fetchNextPage`/`hasNextPage`
5. **Shared options**: `queryOptions({ queryKey, queryFn })` — reuse ระหว่าง `useQuery`, `ensureQueryData`, prefetch
6. **Suspense**: `useSuspenseQuery` เมื่อใช้ `<Suspense>` boundaries (v5 แยก hook)

### 4. Mutation And Cache Patterns

> Goal: writes + invalidation ถูกต้อง

1. `useMutation({ mutationFn, onSuccess })` + `queryClient.invalidateQueries({ queryKey: ['todos'] })` — invalidate เฉพาะ subtree
2. **Optimistic update**: `onMutate` → `cancelQueries` + `getQueryData` snapshot + `setQueryData` optimistic → `onError` rollback → `onSettled` invalidate:

   ```ts
   useMutation({
     mutationFn: updateTodo,
     onMutate: async (newTodo) => {
       await queryClient.cancelQueries({ queryKey: ['todos'] })
       const prev = queryClient.getQueryData(['todos'])
       queryClient.setQueryData(['todos'], (old) => [...old, newTodo])
       return { prev }
     },
     onError: (_e, _v, ctx) => queryClient.setQueryData(['todos'], ctx.prev),
     onSettled: () => queryClient.invalidateQueries({ queryKey: ['todos'] }),
   })
   ```

3. **Prefetch**: `queryClient.prefetchQuery` ตอน hover/route load — ลด loading spinners
4. **Polling**: `refetchInterval: 5000` หรือ function-based interval
5. **Persist cache**: `persistQueryClient` + async storage persister สำหรับ offline/resume

### 5. Devtools And Testing

> Goal: debug ได้และเทส query code

1. `bun add -D @tanstack/react-query-devtools` → `<ReactQueryDevtools />` (หรือ unified panel — ดู `config-devtools`)
2. เทส component ที่ใช้ query: wrap ด้วย `QueryClientProvider` ที่มี `retry: false` + mock `queryFn`
3. ทำ `/run-typecheck` และ `/run-test`
4. ถ้า fail → `/resolve-errors` max 3 รอบ

## Rules

- `QueryClient` instance เดียวต่อ app — ห้ามสร้างใน component render
- queryKey เป็น array ใส่ทุก dependency — key ไม่ครบ = stale cache bugs
- `staleTime` ตั้งตาม data freshness จริง — `staleTime: 0` (default) = refetch ทุก mount
- Mutations: invalidate หรือ `setQueryData` เสมอหลัง success — ห้ามปล่อย stale UI
- `isLoading` = first load เท่านั้น; `isFetching` = ทุก fetch — เลือกให้ถูก UX
- Server state อยู่ใน Query เท่านั้น — ห้าม copy เข้า Store/useState (`follow-store`)
- ใช้ `/follow-lib-tanstack-ecosystem` สำหรับ overview และ library selection

## Expected Outcome

- Query ทำงานครบ: fetch, cache, invalidate, optimistic, infinite, prefetch
- Cache config ตรง data freshness requirements
- Devtools + tests พร้อม debug
