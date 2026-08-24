---
name: follow-solidjs
description: พัฒนา Solid.js applications ด้วย fine-grained reactivity และ performance optimization
---

## Goal

พัฒนา Solid.js applications ด้วย fine-grained reactivity, render-once mental model, และ performance optimization

## Scope

ใช้สำหรับ Solid.js projects ที่ไม่ใช่ SolidStart (client-side only หรือ integration กับ frameworks อื่น)

## Execute

### 1. Component Development
> Goal: Component Development

พัฒนา components ตาม Solid.js patterns

1. ใช้ functional components ที่รันครั้งเดียว (render-once)
2. ใช้ `mergeProps` สำหรับ combine default props กับ incoming props
3. ใช้ `splitProps` สำหรับ passing specific props ไปยัง child components
4. กำหนด types ด้วย `Component<P>`, `VoidComponent<P>`, `ParentComponent<P>`, `FlowComponent<P, C>`
5. ใช้ `.tsx` สำหรับทุก components
6. ห้าม destructure props ใช้ `mergeProps` และ `splitProps` เพื่อ preserve getter chain

### 2. Use Control Flow Components
> Goal: Use Control Flow Components

ใช้ control flow components ที่ optimized สำหรับ Solid.js

1. ใช้ `<For>` สำหรับ lists ที่ tracked by reference (keyed list)
2. ใช้ `<Index>` สำหรับ lists ที่มี stable indices แต่ values เปลี่ยนได้
3. ใช้ `<Show>` สำหรับ conditional rendering พร้อม callback form สำหรับ type narrowing
4. ใช้ `<Switch>` และ `<Match>` สำหรับ complex conditions
5. ใช้ `<Dynamic>` สำหรับ dynamic component rendering
6. หลีกเลี่ยง `map` และ `filter` โดยตรงบน reactive arrays

### 3. Implement Reactivity
> Goal: Implement Reactivity

ใช้ reactive primitives อย่างถูกต้อง

1. ใช้ `createSignal` สำหรับ state management (getter/setter)
2. ใช้ setter ด้วย function: `setCount(c => c + 1)`
3. ใช้ `createMemo` สำหรับ derived values ที่ cache ได้ (เฉพาะ expensive computations)
4. ใช้ plain function สำหรับ simple derived values (Solid re-evaluates ใน reactive scope)
5. ใช้ `createEffect` สำหรับ side effects เท่านั้น (DOM manipulation, third-party libraries)
6. ใช้ `createComputed` สำหรับ computations ใน render phase
7. ใช้ `createStore` สำหรับ nested reactive state ด้วย Proxies
8. ใช้ `batch` สำหรับ group multiple state updates
9. ใช้ `untrack` สำหรับ prevent dependencies
10. ใช้ `on` helper สำหรับ manually specify effect dependencies
11. ห้ามใช้ `createEffect` สำหรับ sync derived state ใช้ function หรือ `createMemo` แทน

### 4. State Management
> Goal: State Management

จัดการ state ด้วย patterns ที่เหมาะสม

1. ใช้ Context API สำหรับ global state
2. ใช้ `createStore` สำหรับ complex nested state ด้วย property-level reactivity
3. ใช้ `createMutable` สำหรับ mutable state ที่ interop กับ external libraries (ใช้ด้วยความระมัดระวัง)
4. ใช้ `$RAW` สำหรับ access underlying non-proxied object
5. ใช้ `unwrap` สำหรับ get data โดยไม่มี proxy
6. ใช้ `produce` จาก `immer` สำหรับ immutable updates ถ้าจำเป็น
7. หลีกเลี่ยง deep nesting ถ้าไม่จำเป็น

### 5. Async Data And Resources
> Goal: Async Data And Resources

จัดการ async data อย่างถูกต้อง

1. ใช้ `createResource` สำหรับ async data fetching (ไม่ใช้ `createEffect` เพื่อ fetch)
2. ใช้ `Suspense` สำหรับ async data loading boundaries
3. ใช้ `ErrorBoundary` สำหรับ error handling
4. ใช้ `createDeferred` สำหรับ defer non-critical updates
5. ใช้ `lazy` สำหรับ code splitting และ async component loading
6. หลีกเลี่ยง race conditions โดยใช้ `createResource` แทน manual fetch ใน `createEffect`

### 6. Optimize Performance
> Goal: Optimize Performance

ปรับปรุง performance ด้วย Solid.js patterns

1. ใช้ fine-grained updates (no Virtual DOM)
2. หลีกเลี่ยง reactive reads ที่ component top-level ยกเว้นใน JSX, `createMemo`, หรือ `createEffect`
3. ใช้ `createMemo` เฉพาะ expensive computations (simple derivations ใช้ plain function)
4. ใช้ `<For>` และ `<Index>` สำหรับ efficient list rendering
5. ใช้ `Suspense` สำหรับ async data loading
6. ใช้ `lazy` loading สำหรับ code splitting
7. ใช้ SSR และ hydration สำหรับ initial load performance
8. ใช้ `untrack` เมื่อไม่ต้องการสร้าง dependencies

### 7. Testing
> Goal: Testing

ทดสอบ Solid.js applications

1. ใช้ `@solidjs/testing-library` สำหรับ component testing พร้อม auto cleanup
2. ใช้ `@testing-library/user-event` สำหรับ simulate user interactions
3. ใช้ `@testing-library/jest-dom` สำหรับ custom matchers
4. ใช้ Vitest สำหรับ unit testing
5. ใช้ `renderHook` สำหรับ testing primitives โดยไม่ต้อง render component
6. ใช้ `testEffect` สำหรับ testing async effects
7. ทดสอบ reactive behavior ด้วย `createRoot` และ `dispose`
8. ทดสอบ control flow components อย่างถูกต้อง

## Rules

### 1. Component Structure

พัฒนา components ตาม Solid.js mental model:

- Components เป็น functions ที่รันครั้งเดียวเพื่อ setup view
- ห้าม destructure props ใช้ `mergeProps` และ `splitProps` เพื่อ preserve getter chain
- กำหนด types ด้วย Solid.js component types (`Component`, `ParentComponent`, `FlowComponent`, `VoidComponent`)
- หลีกเลี่ยงการ re-run component เมื่อ state เปลี่ยน
- ใช้ `.tsx` สำหรับทุก components

### 2. Reactivity Patterns

ใช้ reactive primitives อย่างถูกต้อง:

- ใช้ `createSignal` สำหรับ state ที่ต้องการ reactivity
- ใช้ setter ด้วย function สำหรับ updates based on previous value
- ใช้ `createMemo` เฉพาะ expensive computations สำหรับ simple ใช้ plain function
- ใช้ `createEffect` สำหรับ side effects เท่านั้น (ไม่ใช่ sync derived state)
- ใช้ `createStore` สำหรับ nested state ที่ซับซ้อน
- ใช้ `batch` สำหรับ group updates เพื่อ single re-render
- ใช้ `on` helper สำหรับ manually specify dependencies

### 3. Control Flow

ใช้ control flow components ที่ optimized:

- ใช้ `<For>` สำหรับ lists ที่ tracked by reference
- ใช้ `<Index>` สำหรับ primitive arrays ที่ values เปลี่ยนได้
- ใช้ `<Show>` สำหรับ conditional rendering พร้อม callback form สำหรับ type narrowing
- ใช้ `<Switch>` และ `<Match>` สำหรับ complex conditions
- ใช้ `<Dynamic>` สำหรับ dynamic component rendering
- หลีกเลี่ยง `map` และ `filter` โดยตรงบน reactive arrays

### 4. Performance Optimization

ปรับปรุง performance ด้วย Solid.js principles:

- ใช้ fine-grained updates แทน Virtual DOM
- หลีกเลี่ยง reactive reads ที่ component top-level
- ใช้ `createMemo` เฉพาะ expensive computations
- ใช้ `untrack` เมื่อไม่ต้องการ dependencies
- ใช้ `Suspense` สำหรับ async operations
- ใช้ `lazy` loading สำหรับ large components

### 5. State Management

จัดการ state ด้วย patterns ที่เหมาะสม:

- ใช้ Context API สำหรับ global state
- ใช้ `createStore` สำหรับ nested state
- ใช้ `createMutable` สำหรับ interop กับ external libraries (ด้วยความระมัดระวัง)
- ใช้ `$RAW` และ `unwrap` เมื่อ interact กับ external libraries
- ใช้ `batch` สำหรับ multiple updates
- หลีกเลี่ยง deep nesting ถ้าไม่จำเป็น

### 6. Async Data

จัดการ async data อย่างถูกต้อง:

- ใช้ `createResource` สำหรับ async data fetching ไม่ใช้ `createEffect`
- ใช้ `Suspense` และ `ErrorBoundary` สำหรับ loading และ error states
- ใช้ `createDeferred` สำหรับ defer non-critical updates
- ใช้ `lazy` สำหรับ code splitting

### 7. Testing

ทดสอบ Solid.js applications อย่างถูกต้อง:

- ใช้ `@solidjs/testing-library` สำหรับ component testing พร้อม auto cleanup
- ใช้ `@testing-library/user-event` สำหรับ user interactions
- ใช้ `renderHook` สำหรับ testing primitives
- ใช้ `testEffect` สำหรับ testing async effects
- ใช้ `createRoot` และ `dispose` สำหรับ testing reactive behavior

### 8. Solid 2.0 Migration Notes

เตรียมพร้อมสำหรับ Solid 2.0 (beta):

- `Suspense` → `Loading`, `ErrorBoundary` → `Errored`
- `createResource` → async `createMemo` + `Loading` boundary
- `<Index>` ถูก removed ใช้ `<For keyed={false}>` แทน
- `SuspenseList` → `Reveal` พร้อม `order` prop
- `batch` → default microtask batching ใช้ `flush()` แทน
- `onMount` → `onSettled`
- `mergeProps`/`splitProps` → `merge`/`omit`
- `unwrap` → `snapshot`
- ใหม่: `action()`, `createOptimistic`, `isPending()`, `latest()`, `refresh()`, `deep()`

### 9. Related Workflows

เชื่อมโยงกับ workflows ที่เกี่ยวข้อง:

- ทำ `/follow-architecture` (SolidJS/TanStack pattern: `references/patterns/solid-tanstack-architecture.md`) สำหรับ TanStack Start + SolidJS applications
- ทำ `/follow-typescript` สำหรับ TypeScript best practices
- ทำ `/follow-vitest` สำหรับ testing configuration

## Expected Outcome

- Solid.js components พัฒนาตาม render-once mental model
- Reactivity system ใช้งานอย่างถูกต้อง (no derived state in effects)
- Performance optimization ด้วย fine-grained updates
- Control flow components ใช้งานอย่างเหมาะสม
- State management มีประสิทธิภาพ
- Async data จัดการอย่างถูกต้องด้วย `createResource`
- Testing setup ครบถ้วนด้วย `@solidjs/testing-library`
- เตรียมพร้อมสำหรับ Solid 2.0 migration
