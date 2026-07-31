---
title: FAQ
description: Frequently asked questions สำหรับ SolidJS
---

## General Questions

### What is SolidJS?

SolidJS คือ declarative JavaScript library สำหรับ building user interfaces ด้วย fine-grained reactivity, no virtual DOM, และ compile-time optimization

### Why use SolidJS?

- **Performance** - faster than virtual DOM frameworks
- **Bundle Size** - smaller bundle size
- **Simplicity** - simple mental model
- **TypeScript** - full TypeScript support

### How is SolidJS different from React?

| Feature | SolidJS | React |
|---------|---------|-------|
| DOM | Direct | Virtual |
| Reactivity | Signals | Hooks |
| Learning | Medium | Medium |
| Bundle | Small | Medium |

## Installation

### How to install SolidJS?

```bash
bun add solid-js
bun add -D vite-plugin-solid
```

### How to create a new project?

```bash
bun create vite my-app --template solid-ts
cd my-app
bun install
```

## Development

### How to use signals?

```tsx
import { createSignal } from 'solid-js';

const [count, setCount] = createSignal(0);
console.log(count()); // access
setCount(c => c + 1); // update
```

### How to handle async data?

```tsx
import { createResource } from 'solid-js';

const [data] = createResource(async () => {
  const response = await fetch('/api/data');
  return response.json();
});
```

### How to share state between components?

```tsx
import { createContext, useContext } from 'solid-js';

const Context = createContext(defaultValue);

function Parent() {
  return (
    <Context.Provider value={value}>
      <Child />
    </Context.Provider>
  );
}

function Child() {
  const value = useContext(Context);
  return <div>{value}</div>;
}
```

## Performance

### Why is SolidJS fast?

SolidJS ใช้ fine-grained reactivity และ direct DOM manipulation ทำให้เร็วกว่า virtual DOM frameworks

### How to optimize performance?

- ใช้ `createMemo` สำหรับ derived state
- ใช้ `lazy` สำหรับ lazy loading
- ใช้ `batch` สำหรับ multiple updates
- ใช้ `untrack` เมื่อจำเป็น

## Migration

### How to migrate from React?

1. Convert `useState` to `createSignal`
2. Convert `useEffect` to `createEffect`
3. Update JSX syntax (add `()` for signals)
4. Test migration

### How to migrate from Vue?

1. Convert `ref` to `createSignal`
2. Convert `computed` to `createMemo`
3. Update component syntax
4. Test migration
