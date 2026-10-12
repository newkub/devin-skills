---
name: follow-lib-tanstack-store
description: ใช้ TanStack Store ครบวงจร — stores, selectors, derived state, batching, cross-framework
argument-hint: "[framework]"
related:
  - follow-lib-tanstack-ecosystem
  - run-test
  - run-typecheck
  - resolve-errors
---

## Goal

ใช้ TanStack Store ครบ — client state store ที่ framework-agnostic: stores, fine-grained selectors, `Derived` computed, `batch`, และ non-React usage

## Scope

ใช้สำหรับ **client state** (UI state, drafts, prefs, ephemeral) — server state ใช้ `follow-query`/`follow-db`; เหมาะแทน Zustand-style store เมื่ออยู่ใน TanStack ecosystem อยู่แล้ว

- part of TanStack ecosystem — selection/dispatch อยู่ที่ `/follow-lib-tanstack-ecosystem`

## Execute

### 1. Install

```bash
bun add @tanstack/react-store   # adapter ครอบ @tanstack/store core — มี solid/vue/svelte/angular
```

### 2. Create Store

> Goal: typed store + derived state

```ts
import { Store, Derived } from '@tanstack/react-store'

export const appStore = new Store({
  theme: 'dark' as 'dark' | 'light',
  sidebarOpen: false,
  todos: [] as Todo[],
})

// computed — recompute เมื่อ deps เปลี่ยน
export const openCount = new Derived({
  fn: () => appStore.state.todos.filter((t) => !t.done).length,
  deps: [appStore],
})
openCount.mount()
```

### 3. Read, Write, Batch

> Goal: fine-grained reactivity

```tsx
const theme = useStore(appStore, (s) => s.theme)  // selector เสมอ — re-render เฉพาะ slice

appStore.setState((s) => ({ ...s, theme: 'light' }))

batch(() => {                          // รวม notification เดียว
  appStore.setState((s) => ({ ...s, sidebarOpen: true }))
  otherStore.setState((s) => ({ ...s, loaded: true }))
})
```

- อ่านนอก component: `appStore.state` (sync, non-reactive)
- `store.subscribe` สำหรับ side-effects นอก framework

### 4. Patterns

> Goal: ใช้งานจริงครบ

1. **Modular stores**: แยก store ตาม domain (`userStore`, `uiStore`) — ไม่ใช่ god-store ตัวเดียว
2. **Action functions**: export `updateTheme()` helper ข้าง store แทน `setState` กระจายทั่ว codebase
3. **Persist**: subscribe → `localStorage` หรือ pair กับ DB `localStorageCollectionOptions`
4. **Outside React**: core `Store` ใช้ใน vanilla/node ได้ — adapters เฉพาะตอน bind เข้า UI
5. **Testing**: สร้าง store instance ใหม่ต่อ test หรือ reset `setState` ใน `beforeEach`

### 5. Verify

1. `/run-typecheck` + `/run-test`
2. Selector granularity — component อื่นไม่ re-render เมื่อ slice ที่ไม่เกี่ยวเปลี่ยน
3. ถ้า fail → `/resolve-errors` max 3 รอบ

## Rules

- `useStore(store, selector)` — selector บังคับ ไม่งั้น re-render ทุก change
- ห้าม mutate `store.state` ตรง — `setState` เท่านั้น
- `Derived` ต้อง `.mount()`; derived จาก derived ได้ (chain)
- Store = module singleton export — ห้ามสร้างใน component
- Server state ห้ามใส่ Store — `follow-query`; reactive client DB → `follow-db`

## Expected Outcome

- Client state reactive, granular re-render ผ่าน selectors
- Derived/batch ใช้ถูกจุด
- Boundary กับ Query/DB ชัดเจน
