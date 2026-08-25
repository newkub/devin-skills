# API Reference

## Version Info (as of Aug 2026)

| Library | Package | Maturity |
|---------|---------|----------|
| Query | `@tanstack/react-query` v5.101.x | Stable |
| Router | `@tanstack/react-router` v1.x | Stable |
| Table | `@tanstack/react-table` v8.x | Stable |
| Form | `@tanstack/react-form` v1.x | Stable |
| Virtual | `@tanstack/react-virtual` v3.x | Stable |
| Store | `@tanstack/react-store` v1.x | Newer |
| Start | `@tanstack/start` | RC |
| DB | `@tanstack/db` | Alpha |
| AI | `@tanstack/ai` | Alpha |

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

### useField (v1 API)

```typescript
const form = useForm({ defaultValues: { email: '' } });

const field = useField({ name: 'email', form });
// Access: field.state.value, field.handleChange
```

### validators (v1 API)

```typescript
const form = useForm({
  defaultValues: { email: '' },
  validators: {
    onChange: ({ value }) => {
      if (!value.email) return 'Email is required';
    },
  },
});
```

## TanStack Store

### createStore

```typescript
import { createStore } from '@tanstack/react-store';

const store = createStore(0);

// Read
const count = useStore(store);

// Write
store.setState((prev) => prev + 1);
```

### useStore with selector

```typescript
const store = createStore({ count: 0, name: 'default' });

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

## Sources

- https://tanstack.com/query/latest
- https://tanstack.com/router/latest
- https://tanstack.com/table/latest
- https://tanstack.com/form/latest
- https://tanstack.com/store/latest
- https://tanstack.com/virtual/latest
- https://tanstack.com/start/latest
