---
name: follow-lib-solidjs-manage-state
description: SolidJS reactivity — createSignal, createStore, createMemo, createEffect, batch, untrack, context
argument-hint: "[primitive]"
related:
  - follow-lib-solidjs
  - run-test
  - resolve-errors
---

## Goal

ใช้ SolidJS primitives ครบ — signals, stores, memos, effects, batching, context — ด้วย fine-grained reactivity model

## Scope

state management — `createSignal`, `createStore`, `produce`/`reconcile`, `createMemo`, `createEffect`/`on`, `createRoot`, `createContext`, `untrack`/`batch`

## Execute

### 1. Signals

```ts
const [count, setCount] = createSignal(0)
setCount(c => c + 1)
setCount(5)            // replace
count()                // read — track ใน reactive scope
```

- `createSignal(v, { equals: false })` — always notify; custom `equals` comparator
- Signals = atom ของ Solid — track เฉพาะอ่านใน reactive scope (JSX/memo/effect)

### 2. Stores (Nested State)

```ts
const [state, setState] = createStore({ todos: [], filter: 'all' })
setState('todos', state.todos.length, newTodo)       // path-based update
setState(produce(s => s.todos.push(todo)))            // immer-style mutation
setState('filter', reconcile(newFilter))              // deep merge replace
```

- Store = proxy — อ่าน nested ใน JSX reactive ทั้งหมด (`state.todos` track อัตโนมัติ)
- `produce` = mutation API; `reconcile` = diff-merge; `unwrap` = snapshot non-proxy

### 3. Derived Values

```ts
const doubled = createMemo(() => count() * 2)
const filtered = createMemo(() => todos().filter(t => !t.done))
```

- `createMemo` — cached derived; `createComputed` — eager derived (pre-render)
- `createSelector` — selection reactivity (list item compare per item)

### 4. Effects And Control

```ts
createEffect(() => console.log(count()))                    // track deps อัตโนมัติ
createEffect(on(count, v => console.log(v)))                // explicit deps
onCleanup(() => sub.unsubscribe())                          // cleanup ใน effect/root
batch(() => { setA(1); setB(2) })                           // single update flush
untrack(() => count())                                      // read โดยไม่ track
```

- `createRoot` — manual disposal scope; `createContext`+`useContext` — DI tree

### 5. Patterns

1. `createResource` สำหรับ async → `handle-async` workflow
2. Global state: create signal/store ที่ module top-level — ไม่มี Provider requirement
3. Forms: controlled input = `value`/`onInput` — ไม่มี re-render cost

## Rules

- อ่าน signal นอก reactive scope = static value — ห้าม cache `const v = count()` แล้วใช้ใน JSX
- `createEffect` สำหรับ side effects เท่านั้น — derived state ใช้ `createMemo`
- Store updates ผ่าน path/`produce`/`reconcile` — ห้าม mutate `state.x = v` ตรงๆ
- `untrack` เมื่ออ่านโดยไม่อยาก subscribe; `batch` รวม updates เป็น flush เดียว

## Expected Outcome

- Fine-grained reactivity ถูกต้อง — ไม่มี stale reads / over-tracking
- Stores/signals/memos/effects ใช้ถูกประเภท
