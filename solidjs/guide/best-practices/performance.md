---
title: Performance
description: เรื่อง performance ใน SolidJS
---

## Why SolidJS is Fast

SolidJS เร็วเพราะ:

- No Virtual DOM overhead
- Fine-grained reactivity
- Compile-time optimizations
- Direct DOM operations

## Memoization

ใช้ `createMemo` สำหรับ computed values:

```jsx
const doubled = createMemo(() => count() * 2);
```

เฉพาะเมื่อ `count()` เปลี่ยน `doubled` จึงจะ recompute

## Batch Updates

ใช้ `batch` สำหรับ multiple updates:

```jsx
import { batch } from "solid-js";

function updateMultiple() {
  batch(() => {
    setCount(count() + 1);
    setName("New Name");
  });
}
```

## Lazy Evaluation

ใช้ `lazy` สำหรับ code splitting:

```jsx
const LazyComponent = lazy(() => import("./HeavyComponent"));

<Suspense fallback={<p>Loading...</p>}>
  <LazyComponent />
</Suspense>
```

## Avoid Unnecessary Recomputations

ใช้ `createMemo` แทนการคำนวณใน JSX:

```jsx
// ❌ Bad
<div>{expensiveCalculation()}</div>

// ✅ Good
const result = createMemo(() => expensiveCalculation());
<div>{result()}</div>
```

## List Rendering Optimization

ใช้ `For` แทน map:

```jsx
// ❌ Bad
{items().map((item) => <div>{item.name}</div>)}

// ✅ Good
<For each={items()}>
  {(item) => <div>{item.name}</div>}
</For>
```

## Store Optimization

ใช้ `produce` สำหรับ immutable updates:

```jsx
import { produce } from "solid-js/store";

setState(
  produce((state) => {
    state.items.push newItem);
  })
);
```

## Event Delegation

SolidJS ใช้ event delegation อัตโนมัติ:

- Events ถูก delegate ไปยัง root
- ลด memory usage
- Performance ดีกว่า individual listeners

## SSR Performance

ใช้ `renderToStream` สำหรับ streaming:

```jsx
import { renderToStream } from "solid-js/web";

renderToStream(() => <App />);
```

## ถัดไป

ดู [Integration](./integration.md) เพื่อเรียนรู้เรื่อง integration
