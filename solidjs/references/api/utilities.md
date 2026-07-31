---
title: Utilities
description: Utility functions ของ SolidJS
---

# Utilities

คู่มือ Utility functions ของ SolidJS

## batch

Batch updates ให้เป็น single update

```tsx
import { batch } from 'solid-js';

batch(() => {
  setCount(c => c + 1);
  setName('John');
});
```

## untrack

อ่านค่าโดยไม่ track dependencies

```tsx
import { untrack } from 'solid-js';

createEffect(() => {
  const value = untrack(() => expensiveComputation());
});
```

## lazy

Lazy loading components

```tsx
import { lazy } from 'solid-js';

const LazyComponent = lazy(() => import('./Component'));
```

## onError

Global error handler

```tsx
import { onError } from 'solid-js';

onError((err) => {
  console.error(err);
});
```

## catchError

Error boundary utility

```tsx
import { catchError } from 'solid-js';

<ErrorBoundary fallback={(err) => <Error />}>
  <Component />
</ErrorBoundary>
```

## startTransition

เริ่ม transition สำหรับ non-blocking UI updates

```tsx
import { startTransition } from 'solid-js';

startTransition(() => {
  setData(newData);
});
```

## useTransition

Hook สำหรับ transition state

```tsx
import { useTransition } from 'solid-js';

const [isPending, start] = useTransition();
start(() => setData(newData));
```

**Returns:** `[isPending, startTransition]`

## createRoot

สร้าง reactive root ใหม่สำหรับ manage reactivity

```tsx
import { createRoot } from 'solid-js';

const dispose = createRoot((dispose) => {
  // reactive scope
});
```

**Parameters:**
- `fn` - function ที่รับ dispose callback

**Returns:** dispose function

## runWithOwner

รัน function ด้วย owner context ที่ระบุ

```tsx
import { runWithOwner } from 'solid-js';

runWithOwner(owner, () => {
  // runs with specific owner
});
```

## getOwner

ดึง owner ปัจจุบัน

```tsx
import { getOwner } from 'solid-js';

const owner = getOwner();
```

**Returns:** owner object

## getListener

ดึง listener ปัจจุบัน

```tsx
import { getListener } from 'solid-js';

const listener = getListener();
```

**Returns:** listener object

## on

สร้าง reactive computation ที่ re-run เมื่อ dependencies เฉพาะเจาะจงเปลี่ยน

```tsx
import { on } from 'solid-js';

createEffect(on([source], () => {
  // only runs when source changes
}));
```

## children

แปลง JSX children เป็น reactive accessor

```tsx
import { children } from 'solid-js';

function Parent(props) {
  const resolved = children(() => props.children);
  return <div>{resolved()}</div>;
}
```

## equalFn

Utility สำหรับ custom equality checks

```tsx
import { equalFn } from 'solid-js';

const customEqual: equalFn = (a, b) => a.id === b.id;
```
