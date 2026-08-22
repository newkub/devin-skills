# Configuration

## TanStack Query

```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 3,
    },
  },
});
```

## TanStack Router

```typescript
import { createRouter } from '@tanstack/react-router';

const router = createRouter({
  routeTree: routeTree,
  defaultPreload: 'intent',
});
```

## TanStack Table

```typescript
import { getCoreRowModel } from '@tanstack/react-table';

const table = useReactTable({
  data,
  columns,
  getCoreRowModel: getCoreRowModel(),
});
```
