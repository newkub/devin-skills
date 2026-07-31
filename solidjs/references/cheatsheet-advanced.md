---
title: Cheatsheet - Advanced
description: Quick reference ขั้นสูงสำหรับ SolidJS
---

## Advanced Reactive

### createComputed

```tsx
import { createComputed } from 'solid-js';

createComputed(() => {
  // runs during render phase
});
```

### createRenderEffect

```tsx
import { createRenderEffect } from 'solid-js';

createRenderEffect(() => {
  // runs during render phase with DOM access
});
```

### createDeferred

```tsx
import { createDeferred } from 'solid-js';

const deferred = createDeferred(source);
```

### createSelector

```tsx
import { createSelector } from 'solid-js';

const selector = createSelector(keyFn, listFn);
```

## Transitions

### startTransition

```tsx
import { startTransition } from 'solid-js';

startTransition(() => {
  setData(newData);
});
```

### useTransition

```tsx
import { useTransition } from 'solid-js';

const [isPending, start] = useTransition();
start(() => setData(newData));
```

## Advanced Store

### unwrap

```tsx
import { unwrap } from 'solid-js/store';

const raw = unwrap(store);
```

### createMutable

```tsx
import { createMutable } from 'solid-js/store';

const state = createMutable(initialState);
state.field = newValue;
```

## Advanced Components

### Index

```tsx
<Index each={items()}>
  {(item) => <div>{item}</div>}
</Index>
```

### SuspenseList

```tsx
<SuspenseList fallback={<Loading />}>
  <Suspense fallback={<Loading1 />}>
    <Component1 />
  </Suspense>
  <Suspense fallback={<Loading2 />}>
    <Component2 />
  </Suspense>
</SuspenseList>
```

### Dynamic

```tsx
import { Dynamic } from 'solid-js/web';

<Dynamic component={currentComponent()} />
```

### Portal

```tsx
import { Portal } from 'solid-js/web';

<Portal mount={document.getElementById('modal')}>
  <Modal />
</Portal>
```

## Lifecycle Management

### createRoot

```tsx
import { createRoot } from 'solid-js';

const dispose = createRoot((dispose) => {
  // reactive scope
});
```

### runWithOwner

```tsx
import { runWithOwner } from 'solid-js';

runWithOwner(owner, () => {
  // runs with specific owner
});
```

### getOwner

```tsx
import { getOwner } from 'solid-js';

const owner = getOwner();
```

## Props Utilities

### mergeProps

```tsx
import { mergeProps } from 'solid-js/web';

const merged = mergeProps(defaultProps, userProps);
```

### splitProps

```tsx
import { splitProps } from 'solid-js/web';

const [local, others] = splitProps(props, ['class', 'style']);
```

### children

```tsx
import { children } from 'solid-js';

function Parent(props) {
  const resolved = children(() => props.children);
  return <div>{resolved()}</div>;
}
```
