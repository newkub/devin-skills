# Configuration

## TanStack Query

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 3,
    },
  },
});
```

## TanStack Router

```typescript
const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  defaultStaleTime: 0,
});
```

## TanStack Table

```typescript
const table = useReactTable({
  data,
  columns,
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
});
```

## TanStack Form

```typescript
const form = useForm({
  defaultValues: {
    name: '',
    email: '',
  },
  validators: {
    onChange: ({ value }) => {
      if (!value.email) return 'Email is required';
    },
  },
});
```

## TanStack Store

```typescript
import { createStore } from '@tanstack/store';

const store = createStore({ count: 0, name: 'default' });

// Update ผ่าน setState
store.setState((prev) => ({ ...prev, count: prev.count + 1 }));
```

## TanStack Start

```typescript
// vite.config.ts — Start v1 ใช้ plugin จาก @tanstack/react-start
// (รองรับ Vite หรือ Rsbuild เป็น build tool)
import { defineConfig } from 'vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import viteReact from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    tanstackStart(),
    // react's vite plugin must come after start's vite plugin
    viteReact(),
  ],
});
```
