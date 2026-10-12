---
name: follow-lib-solidjs-handle-async
description: SolidJS async — createResource, Suspense, lazy loading, streaming SSR, error handling
argument-hint: "[scope]"
related:
  - follow-lib-solidjs
  - run-test
  - resolve-errors
---

## Goal

จัดการ async data ใน SolidJS — `createResource` fetch/track/mutate, `Suspense` boundaries, `lazy` code-split, SSR streaming

## Scope

async lifecycle — `createResource`, `Suspense`, `ErrorBoundary` integration, `lazy()`, transition (`useTransition`), SSR `Suspense` streaming

## Execute

### 1. createResource

```ts
const [data, { refetch, mutate }] = createResource(userId, fetchUser)
// userId() เปลี่ยน → auto refetch (source signal)
data()           // value | undefined
data.loading     // boolean
data.error       // thrown error
data.latest      // last resolved (ไม่ reset ตอน refetch)
mutate(newData)  // manual update cache
refetch()        // re-fetch
```

- Source signal = reactive dependency — เปลี่ยน → fetch ใหม่อัตโนมัติ
- Options: `{ initialValue }`, `{ storage: createSignal }`, `{ deferStream }`

### 2. Suspense And Boundaries

```tsx
<Suspense fallback={<Spinner />}>
  <Profile />         {/* ใช้ data() — suspend จน resolve */}
</Suspense>
<ErrorBoundary fallback={err => <Error err={err} />}>...</ErrorBoundary>
```

- `Suspense` catch pending resources — nested boundaries สำหรับ granular fallbacks
- `<SuspenseList>` สำหรับ SSR ordered reveal (revealOrder/collapsible/tail)

### 3. Transitions And Deferred

```ts
const [pending, start] = useTransition()
start(() => setTab('heavy'))    // เก็บ UI เก่าจน branch ใหม่ resolve
```

- `useTransition` — non-blocking updates (stale-while-loading UI)
- `createDeferred` — defer expensive computed (debounce-like)

### 4. Code Split And SSR

- `const Heavy = lazy(() => import('./Heavy'))` — component code split + Suspense-ready
- SSR: `Suspense` streaming — หน้า render ก่อน, pending chunks stream ตามหลัง (SolidStart)
- `isServer`/`onMount` — client-only code paths (`onMount` ไม่ run บน server)

## Rules

- `createResource` = async canonical — อย่า manual `useEffect`-style fetch ใน `createEffect` (race conditions)
- Wrap `Suspense` รอบ suspended branches — ไม่ครอบ = crash บน SSR paths
- `mutate`/`refetch` สำหรับ cache updates — ไม่ใช่ re-create resource
- SSR streaming ใช้ `SuspenseList` เมื่อต้อง ordering — ดู SolidStart docs สำหรับ SSR deploys

## Expected Outcome

- Async data tracked + refetched ผ่าน `createResource` ถูกต้อง
- Suspense/ErrorBoundary ครบ ทุก pending branch
