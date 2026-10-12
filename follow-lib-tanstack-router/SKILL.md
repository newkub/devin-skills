---
name: follow-lib-tanstack-router
description: ใช้ TanStack Router ครบวงจร — file routes, loaders, search param validation, type-safe navigation, layouts, SSR data
argument-hint: "[react|solid]"
related:
  - follow-lib-tanstack-ecosystem
  - run-dev
  - run-typecheck
  - resolve-errors
---

## Goal

ใช้ TanStack Router (v1) ครบ — createRouter, file-based routes, type-safe params/search, loaders, navigation, layouts, error boundaries

## Scope

ใช้กับ React/Solid apps — ครอบคลุม route tree, params/search validation, data loading (`loader`), navigation APIs, nested layouts, pending/error states; full-stack SSR → `follow-start`

- part of TanStack ecosystem — selection/dispatch อยู่ที่ `/follow-lib-tanstack-ecosystem`

## Execute

### 1. Install And Router Setup

> Goal: router พร้อม type registration

```bash
bun add @tanstack/react-router
bun add -D @tanstack/router-plugin   # file-based routes + code splitting
```

1. Vite plugin: `tanstackRouter({ target: 'react', autoCodeSplitting: true })` ใน `vite.config.ts` **ก่อน** react plugin — generate `routeTree.gen.ts` อัตโนมัติ
2. `src/main.tsx`:

   ```tsx
   const router = createRouter({ routeTree })
   declare module '@tanstack/react-router' {
     interface Register { router: typeof router }  // ทำให้ type-safe ทั้ง app
   }
   <RouterProvider router={router} />
   ```

### 2. File-Based Routes

> Goal: route tree จาก `src/routes/`

- `src/routes/__root.tsx` → `createRootRoute` + `<Outlet/>`
- `routes/about.tsx` → `createFileRoute('/about')`
- `routes/posts/$postId.tsx` → param route, อ่านด้วย `Route.useParams()`
- `routes/posts/route.tsx` → pathless layout route (wrap children `<Outlet/>`)
- `routes/_auth/` → pathless group (organize ไม่เปลี่ยน URL)
- Code-based alternative: `createRoute({ getParentRoute, path, component })` — เลือกอย่างเดียว ห้ามปน

### 3. Params, Search, Loaders

> Goal: type-safe URL state + data loading

1. **Params**: `$postId` → `useParams({ from: '/posts/$postId' })` typed ทั้งชื่อและค่า
2. **Search**: `validateSearch: (s) => ({ page: Number(s.page ?? 1) })` หรือ zod/standard schema — `useSearch` typed
3. **Loader**: `loader: ({ params }) => fetchPost(params.postId)` + `Route.useLoaderData()` — cache/staleTime ผ่าน router options (`defaultPreload: 'intent'` = preload ตอน hover)
4. Route context: `beforeLoad` สำหรับ auth guards/redirects (`throw redirect({ to: '/login' })`)

### 4. Navigation And States

> Goal: navigate + pending/error UX ครบ

1. `<Link to="/posts/$postId" params={{ postId }} search={{ page: 2 }}>` — type-checked ทั้ง params+search
2. `useNavigate()` / `router.navigate({ to, params, search })`
3. Per-route `pendingComponent`, `errorComponent`, `notFoundComponent` — router-level error boundaries
4. `router.invalidate()` re-run loaders หลัง mutation (หรือ pair กับ Query ใน `loader`)

### 5. Verify

> Goal: routes + types ทำงาน

1. `/run-dev` — navigate จริงทุก route, `routeTree.gen.ts` regenerate ถูกต้อง
2. `/run-typecheck` — Link params/search errors ต้องติด typecheck
3. ทดสอบ back/forward, deep-link, 404
4. ถ้า fail → `/resolve-errors` max 3 รอบ

## Rules

- File-based หรือ code-based เลือกอย่างเดียว — `routeTree.gen.ts` ห้ามแก้เอง
- ทุก dynamic segment ต้องผ่าน `params` prop เมื่อ navigate — compiler บังคับอยู่แล้วอย่า cast หลบ
- Search params เป็น source of truth สำหรับ UI state ที่ share URL ได้ (filters, tabs, page)
- Loader data ≠ Query cache — data ที่ต้อง refetch/realtime ให้ใช้ `follow-query` ใน component ไม่ใช่ loader
- `Register` interface ต้องมี — ไม่งั้น type safety หายทั้ง app

## Expected Outcome

- Route tree generate ถูก, navigation type-safe ครบ params+search
- Loaders + pending/error boundaries ทำงาน
- Deep-link/back-forward ไม่พัง
