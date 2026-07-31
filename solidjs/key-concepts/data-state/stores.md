---
title: Stores
description: เรียนรู้เรื่อง stores ใน SolidJS
---

## สิ่งที่คือ Stores

Stores ใช้สำหรับ nested reactive state:

```jsx
const [state, setState] = createStore({
  user: { name: "John" },
  items: [],
});
```

## Basic Usage

### Creating Store

```jsx
import { createStore } from "solid-js/store";

const [state, setState] = createStore({
  count: 0,
  user: { name: "John" },
});
```

### Reading State

```jsx
console.log(state.count);
console.log(state.user.name);
```

### Updating State

```jsx
setState("count", 5);
setState("user", "name", "Jane");
```

## Nested Updates

### Deep Updates

```jsx
setState("user", "profile", "age", 30);
```

### Array Updates

```jsx
setState("items", (items) => [...items, newItem]);
```

## Immutability

### Using produce

```jsx
import { produce } from "solid-js/store";

setState(
  produce((state) => {
    state.items.push(newItem);
  })
);
```

## Store vs Signal

### Store สำหรับ Complex State

```jsx
const [state, setState] = createStore({
  user: { name: "", email: "" },
  settings: { theme: "light" },
});
```

### Signal สำหรับ Simple State

```jsx
const [count, setCount] = createSignal(0);
```

## Reconciliation

SolidJS ใช้ reconciliation สำหรับ store updates:

```jsx
setState("items", newItems);
```

## Best Practices

### ใช้ Stores สำหรับ Global State

```jsx
const [appState, setAppState] = createStore({
  user: null,
  theme: "light",
});
```

### ใช้ Signals สำหรับ Local State

```jsx
function Component() {
  const [local, setLocal] = createSignal(0);
}
```

## ถัดไป

ดู [Context](./context.md) เพื่อเรียนรู้เรื่อง context
