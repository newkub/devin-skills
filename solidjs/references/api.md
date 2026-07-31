---
title: API Reference
description: API references สำคัญของ SolidJS
---

## Core Primitives

### createSignal

สร้าง reactive signal:

```tsx
const [value, setValue] = createSignal(initialValue)
```

### createEffect

สร้าง reactive effect:

```tsx
createEffect(() => {
  // Run เมื่อ dependencies เปลี่ยน
})
```

### createMemo

สร้าง memoized value:

```tsx
const memoized = createMemo(() => derivedValue())
```

### createResource

สร้าง async resource:

```tsx
const [data] = createResource(fetcher)
```

## State Management

### createStore

สร้าง reactive store:

```tsx
const [state, setState] = createStore(initialState)
```

### createMutable

สร้าง mutable reactive object:

```tsx
const state = createMutable(initialState)
```

## Utilities

### batch

Group multiple updates:

```tsx
batch(() => {
  // Multiple updates
})
```

### on

Manual dependency tracking:

```tsx
createEffect(on([source], () => {
  // Effect logic
}))
```

### untrack

Disable tracking:

```tsx
const value = untrack(() => signal())
```

## Components

### Show

Conditional rendering:

```tsx
<Show when={condition()} fallback={<div>Fallback</div>}>
  <div>Content</div>
</Show>
```

### For

List rendering:

```tsx
<For each={items()}>
  {(item) => <div>{item}</div>}
</For>
```

### Index

List rendering ด้วย index:

```tsx
<Index each={items()}>
  {(item, index) => <div>{index()}: {item()}</div>}
</Index>
```

### Switch

Multiple conditions:

```tsx
<Switch fallback={<div>Default</div>}>
  <Match when={condition1()}>
    <div>Case 1</div>
  </Match>
  <Match when={condition2()}>
    <div>Case 2</div>
  </Match>
</Switch>
```

## Lifecycle

### onMount

Run เมื่อ component mount:

```tsx
onMount(() => {
  // Setup logic
})
```

### onCleanup

Run เมื่อ component unmount:

```tsx
onCleanup(() => {
  // Cleanup logic
})
```
