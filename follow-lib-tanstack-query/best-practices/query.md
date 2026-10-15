# TanStack Query — Server State Patterns

Best practices for Query: query keys, caching, mutations, invalidation, and performance

## Recommended Patterns

### Query Keys Are a Contract

```ts
// query key factory — centralize in one file per domain
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (filters: Filters) => [...userKeys.lists(), filters] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
}
```

- keys must be serializable, stable, and unique per data — include every variable that changes the result (id, filters, page)
- invalidate by prefix: `queryClient.invalidateQueries({ queryKey: userKeys.all })` covers every list/detail

### Intentional Caching

| Option | Meaning | Guidance |
|---|---|---|
| `staleTime` | how long data stays fresh before it's considered stale | set to reality — high for static data, low for realtime |
| `gcTime` | how long the cache lingers after it has no observer | the 5-minute default is enough in general |
| `refetchOnWindowFocus` | refetch when returning to the tab | disable only for unneeded queries — never globally |
| `retry` | retry on failure | tune by criticality — mutations don't retry by default |

- Set `staleTime` per query rather than globally — each data type has different freshness
- Use `select` to derive only what the component needs — fewer re-renders and separated concerns

### Mutations + Invalidation

```ts
const mutation = useMutation({
  mutationFn: updateUser,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: userKeys.detail(id) })
  },
})
```

- Always invalidate after a mutation — or use `setQueryData` for optimistic/direct updates
- Optimistic updates: `onMutate` snapshot → update cache → `onError` rollback → `onSettled` invalidate
- Mutation state (`isPending`, `error`) lives in the hook — don't copy it into other state

### Dependent and Parallel Queries

- Dependent queries use `enabled: !!id` — don't fetch while the prerequisite isn't ready
- Parallel queries use `useQueries` when the count is dynamic — normal hooks when the count is fixed
- Prefetch in the route loader or `queryClient.prefetchQuery` on hover — reduces waterfalls

## Common Pitfalls

- Putting non-serializable values in a query key (Date objects, class instances) → key mismatch, permanent cache miss
- Not putting params in the key → stale cache when params change
- `staleTime: 0` everywhere → refetch storm on every mount/focus
- Invalidating with too narrow a key → the list doesn't update after a mutation
- Storing server state in a global store (Zustand/Store) duplicated with Query → two sources of truth
- `select` creating a new object every time → re-render loop (wrap in a stable reference, or rely on the default structural sharing)

## Do / Don't

| Do | Don't |
|---|---|
| Query keys as a factory per domain | hardcode key strings scattered across the codebase |
| Use `select` to derive data | map data inside the component render |
| Invalidate prefix keys after mutations | recreate queries with `useEffect` + manual fetch |
| Use `enabled` for dependent queries | guard fetches with an if in the component body |
| Optimistic update via `setQueryData` | refetch the whole list to update one item when unnecessary |
| Prefetch in loaders/hover handlers | leave queries waterfalling back to back |

## Performance Notes

- `select` reduces re-renders — the component subscribes only to the derived slice
- High `staleTime` for reference data (categories, config) — low for frequently changing data
- Pagination uses `placeholderData: keepPreviousData` — the UI doesn't flicker on page change
- Infinite queries use `useInfiniteQuery` with `getNextPageParam` — don't hand-implement it with state
- Structural sharing (on by default) makes deep-equal new data not trigger a re-render — keep it
- Devtools: open the panel during dev to watch the cache lifecycle — find queries that refetch more than needed

## Ecosystem / Integration

- Router: prefetch in the route loader via `queryClient.ensureQueryData` — data is ready before render
- Form: mutations from form submit — use `@tanstack/react-form` validators together with Query mutations
- SSR/Start: `dehydrate`/`hydrate` for server-prefetched queries — check the framework's adapter
- Don't use Query for client-only state (UI toggles, draft forms) — that's the job of `Store` or local state
- Vue/Svelte/Solid: separate packages `@tanstack/vue-query` etc. — the API is nearly identical, but read the adapter docs first
