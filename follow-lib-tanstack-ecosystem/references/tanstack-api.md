# API Reference

## Version Info (as of Sep 2026)

| Library | Package | Maturity |
|---------|---------|----------|
| Query | `@tanstack/react-query` v5.102.x | Stable |
| Router | `@tanstack/react-router` v1.170.x | Stable |
| Table | `@tanstack/react-table` v9.2.x | Stable |
| Form | `@tanstack/react-form` v1.33.x | Stable (v2 alpha) |
| Virtual | `@tanstack/react-virtual` v3.14.x | Stable |
| Store | `@tanstack/react-store` v0.11.x | 0.x |
| Start | `@tanstack/react-start` v1.168.x | Stable |
| DB | `@tanstack/react-db` v0.3.x | 0.x |
| AI | `@tanstack/ai` v0.53.x | RC |
| Pacer | `@tanstack/react-pacer` v0.23.x | 0.x |

Naming convention: `@tanstack/{framework}-{lib}` — เช่น `@tanstack/react-query`, `@tanstack/vue-query`, `@tanstack/solid-router`, `@tanstack/svelte-query` (Angular บางตัวใช้ชื่อ `*-experimental` เช่น `@tanstack/angular-query-experimental`)

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
import { createStore } from '@tanstack/store';
import { useStore } from '@tanstack/react-store'; // framework adapter

const store = createStore(0);

// Read (vanilla)
console.log(store.state);

// Read (React)
const count = useStore(store);

// Write
store.setState(() => 1);
```

### useStore with selector

```typescript
const store = createStore({ count: 0, name: 'default' });

const count = useStore(store, (state) => state.count);
```

### Derived store

```typescript
const double = createStore(() => store.state * 2);
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
