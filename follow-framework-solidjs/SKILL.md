---
name: follow-framework-solidjs
description: พัฒนา Solid.js applications ด้วย fine-grained reactivity และ performance optimization
argument-hint: "[task]"
related:
  - follow-solid-tanstack-architecture
  - follow-lang-typescript
  - follow-tool-vite
  - follow-create-vite-plugins
  - follow-tool-vitest
---

## Goal

พัฒนา Solid.js applications ด้วย fine-grained reactivity, render-once mental model, และ performance optimization

## Scope

ใช้สำหรับ Solid.js projects ที่ไม่ใช่ SolidStart (client-side only หรือ integration กับ frameworks อื่น)

## Execute

### 1. Setup And Components

> Goal: โครงสร้าง component ถูกต้องตาม Solid.js mental model

1. ตรวจ `package.json` ยืนยัน `solid-js` และ `babel-preset-solid` ถ้าขาด → ติดตั้ง `bun add solid-js` และ `bun add -D babel-preset-solid`
2. ใช้ functional components ที่รันครั้งเดียว (render-once) ใช้ `.tsx` สำหรับทุก components
3. กำหนด types ด้วย `Component<P>`, `VoidComponent<P>`, `ParentComponent<P>`, `FlowComponent<P, C>`
4. ห้าม destructure props — ใช้ `mergeProps` สำหรับ combine default props และ `splitProps` สำหรับ passing specific props เพื่อ preserve getter chain

### 2. Reactivity And State

> Goal: ใช้ reactive primitives และ state management อย่างถูกต้อง

1. ใช้ `createSignal` สำหรับ state management — setter ด้วย function: `setCount(c => c + 1)`
2. ใช้ `createMemo` เฉพาะ expensive computations — simple derived values ใช้ plain function (Solid re-evaluates ใน reactive scope)
3. ใช้ `createEffect` สำหรับ side effects เท่านั้น (DOM manipulation, third-party libraries) — ห้ามใช้สำหรับ sync derived state
4. ใช้ `createStore` สำหรับ nested reactive state ด้วย Proxies — ใช้ `createMutable` สำหรับ interop กับ external libraries (ด้วยความระมัดระวัง)
5. ใช้ `batch` สำหรับ group multiple state updates, `untrack` สำหรับ prevent dependencies, `on` helper สำหรับ manually specify effect dependencies
6. ใช้ Context API สำหรับ global state — หลีกเลี่ยง deep nesting ถ้าไม่จำเป็น

### 3. Control Flow And Async

> Goal: ใช้ control flow components และ async patterns อย่างถูกต้อง

1. ใช้ `<For>` สำหรับ lists tracked by reference (keyed list), `<Index>` สำหรับ lists ที่มี stable indices แต่ values เปลี่ยนได้
2. ใช้ `<Show>` สำหรับ conditional rendering พร้อม callback form สำหรับ type narrowing, `<Switch>`/`<Match>` สำหรับ complex conditions, `<Dynamic>` สำหรับ dynamic component rendering
3. หลีกเลี่ยง `map` และ `filter` โดยตรงบน reactive arrays
4. ใช้ `createResource` สำหรับ async data fetching (ไม่ใช้ `createEffect` เพื่อ fetch) — ใช้ `refetch` และ `mutate` actions สำหรับ cache control
5. ใช้ `Suspense` สำหรับ async data loading boundaries, `ErrorBoundary` สำหรับ error handling
6. ใช้ `createDeferred` สำหรับ defer non-critical updates, `lazy` สำหรับ code splitting และ async component loading

### 4. Optimize Performance

> Goal: ปรับปรุง performance ด้วย Solid.js patterns

1. ใช้ fine-grained updates (no Virtual DOM) — หลีกเลี่ยง reactive reads ที่ component top-level ยกเว้นใน JSX, `createMemo`, หรือ `createEffect`
2. ใช้ `<For>` และ `<Index>` สำหรับ efficient list rendering
3. ใช้ `untrack` เมื่อไม่ต้องการสร้าง dependencies
4. ใช้ SSR และ hydration สำหรับ initial load performance ถ้าจำเป็น

### 5. Testing

> Goal: ทดสอบ Solid.js applications อย่างถูกต้อง

1. ใช้ `@solidjs/testing-library` สำหรับ component testing พร้อม auto cleanup
2. ใช้ `@testing-library/user-event` สำหรับ simulate user interactions, `@testing-library/jest-dom` สำหรับ custom matchers
3. ใช้ Vitest สำหรับ unit testing — ใช้ `renderHook` สำหรับ testing primitives โดยไม่ต้อง render component
4. ใช้ `testEffect` สำหรับ testing async effects — ทดสอบ reactive behavior ด้วย `createRoot` และ `dispose`

## Rules

### 1. Render-Once Mental Model

- Components เป็น functions ที่รันครั้งเดียวเพื่อ setup view
- ห้าม destructure props — ใช้ `mergeProps` และ `splitProps` เพื่อ preserve getter chain
- ใช้ `.tsx` สำหรับทุก components
- หลีกเลี่ยงการ re-run component เมื่อ state เปลี่ยน

### 2. Reactivity Rules

- ใช้ `createEffect` สำหรับ side effects เท่านั้น ไม่ใช่ sync derived state — ใช้ function หรือ `createMemo` แทน
- ใช้ `createMemo` เฉพาะ expensive computations สำหรับ simple ใช้ plain function
- ใช้ `createResource` สำหรับ async data fetching ไม่ใช้ `createEffect`
- ใช้ `batch` สำหรับ group updates, `on` helper สำหรับ manually specify dependencies

### 3. Solid 2.0 Migration Notes

เตรียมพร้อมสำหรับ Solid 2.0 (beta):

- `Suspense` → `Loading`, `ErrorBoundary` → `Errored`
- `createResource` → async `createMemo` + `Loading` boundary
- `<Index>` ถูก removed ใช้ `<For keyed={false}>` แทน
- `SuspenseList` → `Reveal` พร้อม `order` prop (`sequential`, `together`) และ `collapsed`
- `batch` → default microtask batching ใช้ `flush()` แทน
- `onMount` → `onSettled` (รองรับ cleanup return), `mergeProps`/`splitProps` → `merge`/`omit`, `unwrap` → `snapshot`
- `createMemo` เปลี่ยน signature: second arg เป็น options ไม่ใช่ initial value
- `onError` ถูก deprecated → ใช้ `catchError` แทน
- ใหม่: `action()`, `createOptimisticStore`, `isPending()`, `latest()`, `refresh()`, `deep()`

### 4. Related Workflows

- ทำ `/follow-solid-tanstack-architecture` สำหรับ TanStack Start + SolidJS applications
- ทำ `/follow-lang-typescript` สำหรับ TypeScript best practices
- ทำ `/follow-tool-vitest` สำหรับ testing configuration

## Expected Outcome

- Solid.js components พัฒนาตาม render-once mental model
- Reactivity system ใช้งานอย่างถูกต้อง (no derived state in effects)
- Performance optimization ด้วย fine-grained updates
- Control flow และ async patterns ใช้งานอย่างเหมาะสม
- Testing setup ครบถ้วนด้วย `@solidjs/testing-library`
- เตรียมพร้อมสำหรับ Solid 2.0 migration
