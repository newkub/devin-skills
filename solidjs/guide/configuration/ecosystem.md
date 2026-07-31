---
title: Ecosystem
description: ecosystem ของ SolidJS
---

## Official Libraries

### SolidStart

Full-stack framework สำหรับ SolidJS:

```bash
bun create solid@latest
```

### Router

```bash
bun add @solidjs/router
```

### Store

```bash
bun add solid-js/store
```

## UI Libraries

### Solid UI

```bash
bun add solid-ui
```

### Hope UI

```bash
bun add @hope-ui/solid
```

### Kobalte

```bash
bun add @kobalte/core
```

## State Management

### Solid Store

Built-in store system:

```jsx
import { createStore } from "solid-js/store";

const [state, setState] = createStore({ count: 0 });
```

### Zustand

```bash
bun add zustand
```

## Testing

### Solid Testing Library

```bash
bun add -D @solidjs/testing-library
```

### Vitest

```bash
bun add -D vitest
```

## Build Tools

### Vite

```bash
bun add -D vite vite-plugin-solid
```

### Rollup

```bash
bun add -D rollup
```

## Styling

### Tailwind CSS

```bash
bun add -D tailwindcss postcss autoprefixer
```

### UnoCSS

```bash
bun add -D unocss
```

## Data Fetching

### Solid Resource

Built-in async state:

```jsx
import { createResource } from "solid-js";

const [data] = createResource(fetchData);
```

### TanStack Query

```bash
bun add @tanstack/solid-query
```

## Form Libraries

### Solid Form

```bash
bun add solid-form
```

### Modular Forms

```bash
bun add modulz
```

## ถัดไป

ดู [Migration](./migration.md) เพื่อเรียนรู้เรื่อง migration
