# Patterns

## Common Patterns

## TanStack Query Patterns

### Compound Queries

```typescript
const postsQuery = useQuery({ queryKey: ['posts'], queryFn: fetchPosts });
const postQuery = useQuery({ 
  queryKey: ['post', postId], 
  queryFn: () => fetchPost(postId),
  enabled: !!postId
});
```

### Dependent Queries

ใช้ `enabled` option สำหรับ dependent queries

### Infinite Queries

ใช้ `useInfiniteQuery` สำหรับ pagination

## TanStack Table Patterns

### Reusable Columns

```typescript
const columns = [
  columnHelper.accessor('id', { header: 'ID' }),
  columnHelper.accessor('name', { header: 'Name' }),
];
```

### Custom Cell Renderers

```typescript
const columns = [
  columnHelper.accessor('status', {
    header: 'Status',
    cell: (info) => <Badge>{info.getValue()}</Badge>
  }),
];
```

## TanStack Router Patterns

### Route Groups

ใช้ route groups สำหรับ organize routes

### Search Params

```typescript
const searchParams = useSearch({ from: '/route' });
```
