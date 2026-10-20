# Use Case — Cached Queries and Targeted Invalidation

> Fetch once per key, keep it fresh by policy, and refetch exactly the lists a mutation touched. Source: https://tanstack.com/query/latest/docs/framework/react/guides/query-invalidation (accessed 2026-10-20)

## 1. Define queries once with `queryOptions`

```tsx
import { queryOptions, useQuery } from "@tanstack/react-query"

export const todosQuery = (filter: "all" | "open") => queryOptions({
  queryKey: ["todos", filter],
  queryFn: () => api.todos.list({ filter }),
  staleTime: 30_000,
})

function TodoList({ filter }: { filter: "all" | "open" }) {
  const { data, isPending, error } = useQuery(todosQuery(filter))
  if (isPending) return <Skeleton />
  if (error) return <ErrorState error={error} />
  return <ul>{data.map(t => <li key={t.id}>{t.title}</li>)}</ul>
}
```

Sharing one `queryOptions` between `useQuery`, `prefetchQuery` and `getQueryData` keeps keys from drifting.

## 2. Invalidate after a mutation

```tsx
const qc = useQueryClient()
const create = useMutation({
  mutationFn: api.todos.create,
  onSuccess: () => qc.invalidateQueries({ queryKey: ["todos"] }),   // matches every filter
})
```

## 3. Write the response straight into the cache when you already have the row

```tsx
onSuccess: (created) => {
  qc.setQueryData<Todo[]>(todosQuery("all").queryKey, (old = []) => [created, ...old])
  qc.invalidateQueries({ queryKey: todosQuery("all").queryKey, exact: true })
}
```

## Pitfalls

- `invalidateQueries()` with no filters → refetches the whole app.
- Different key shapes per component (`["todo", id]` vs `["todos", id]`) → invalidation misses.
- Disabling `refetchOnWindowFocus` everywhere instead of tuning `staleTime`/`refetchInterval` per query.
- Using `onSuccess` on `useQuery` → removed in v5; react to `data` in an effect or handle it in `queryFn`.

## Related

- `references/apis.md`
- `usecases/mutations-with-optimistic-ui.md`
- `usecases/infinite-scroll-and-prefetch.md`
