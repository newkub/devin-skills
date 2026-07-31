# API Reference

## TanStack Query

### useQuery

```typescript
const { data, isLoading, error } = useQuery({
  queryKey: ['key'],
  queryFn: () => fetch('/api').then(r => r.json()),
});
```

### useMutation

```typescript
const mutation = useMutation({
  mutationFn: (data) => fetch('/api', { method: 'POST', body: JSON.stringify(data) }),
});
```

## TanStack Table

### useReactTable

```typescript
const table = useReactTable({
  data,
  columns,
  getCoreRowModel: getCoreRowModel(),
});
```

## TanStack Router

### createRouter

```typescript
const router = createRouter({
  routeTree,
});
```

### useNavigate

```typescript
const navigate = useNavigate();
navigate({ to: '/path' });
```

### useRoute

```typescript
const route = useRoute();
```

## TanStack Form

### useForm

```typescript
const form = useForm({
  defaultValues: {
    name: '',
    email: '',
  },
  onSubmit: async ({ value }) => {
    await submitForm(value);
  },
});
```

### useField

```typescript
const field = useField({
  name: 'email',
  validation: (value) => {
    if (!value) return 'Email is required';
  },
});
```

## TanStack Store

### createStore

```typescript
const store = createStore({
  count: 0,
  increment: () => {
    store.count++;
  },
});
```

### useStore

```typescript
const count = useStore(store, (state) => state.count);
```

## TanStack Start

### createRoute

```typescript
import { createRoute } from '@tanstack/react-router';

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Index,
});
```

### createFileRoute

```typescript
import { createFileRoute } from '@tanstack/react-router';

const Route = createFileRoute('/')({
  component: Index,
});
```
