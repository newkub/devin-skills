---
title: Cheatsheet - Basic
description: Quick reference พื้นฐานสำหรับ SolidJS
---

## Core Functions

### Signals

```tsx
import { createSignal } from 'solid-js';

const [value, setValue] = createSignal(initial);
```

### Effects

```tsx
import { createEffect, onMount, onCleanup } from 'solid-js';

createEffect(() => {
  // side effect
});

onMount(() => {
  // on mount
});

onCleanup(() => {
  // cleanup
});
```

### Memos

```tsx
import { createMemo } from 'solid-js';

const memo = createMemo(() => derivedValue());
```

### Stores

```tsx
import { createStore } from 'solid-js/store';

const [state, setState] = createStore(initialState);
```

## Components

### Control Flow

```tsx
<Show when={condition()} fallback={<Fallback />}>
  <Content />
</Show>

<For each={items()}>
  {(item) => <Item item={item} />}
</For>

<Switch fallback={<Default />}>
  <Match when={condition1()}>
    <Case1 />
  </Match>
  <Match when={condition2()}>
    <Case2 />
  </Match>
</Switch>
```

### Context

```tsx
import { createContext, useContext } from 'solid-js';

const Context = createContext(defaultValue);

function Provider(props) {
  return (
    <Context.Provider value={value}>
      {props.children}
    </Context.Provider>
  );
}

function Consumer() {
  const value = useContext(Context);
  return <div>{value}</div>;
}
```

## Async

### Resources

```tsx
import { createResource } from 'solid-js';

const [data] = createResource(fetcher);
```

### Suspense

```tsx
import { Suspense } from 'solid-js';

<Suspense fallback={<Loading />}>
  <AsyncComponent />
</Suspense>
```

## Utilities

### Batch

```tsx
import { batch } from 'solid-js';

batch(() => {
  setCount(c => c + 1);
  setName('John');
});
```

### Untrack

```tsx
import { untrack } from 'solid-js';

createEffect(() => {
  const value = untrack(() => expensiveComputation());
});
```

## Common Patterns

### Derived State

```tsx
const doubled = createMemo(() => count() * 2);
```

### List Rendering

```tsx
<For each={items()} fallback={<div>No items</div>}>
  {(item) => <div>{item.name}</div>}
</For>
```

### Conditional Rendering

```tsx
<Show when={isLoggedIn()} fallback={<Login />}>
  <Dashboard />
</Show>
```
