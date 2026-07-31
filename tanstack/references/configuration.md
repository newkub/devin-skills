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
const store = createStore({
  count: 0,
  name: 'default',
  increment: () => {
    store.count++;
  },
});
```

## TanStack Start

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import tanstackStart from '@tanstack/start/vite';

export default defineConfig({
  plugins: [tanstackStart()],
});
```
