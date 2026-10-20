# Use Case — Infinite Scroll, Pagination and Prefetch

> Cursor-paginated lists with `useInfiniteQuery`, plus route-level prefetch so navigation renders with data. Source: https://tanstack.com/query/latest/docs/framework/react/guides/infinite-queries (accessed 2026-10-20)

## 1. Infinite query

```tsx
import { useInfiniteQuery } from "@tanstack/react-query"

const feed = useInfiniteQuery({
  queryKey: ["feed"],
  queryFn: ({ pageParam }) => api.feed.list({ cursor: pageParam, limit: 20 }),
  initialPageParam: null as string | null,
  getNextPageParam: (lastPage) => lastPage.nextCursor,
})

const items = feed.data?.pages.flatMap(p => p.items) ?? []
```

`getNextPageParam` returning `undefined`/`null` → `hasNextPage` is false and `fetchNextPage()` becomes a no-op.

## 2. Render pages stably

```tsx
return (
  <>
    {feed.data?.pages.map((page, i) => (
      <Fragment key={page.cursor ?? i}>
        {page.items.map(item => <Row key={item.id} item={item} />)}
      </Fragment>
    ))}
    <button onClick={() => feed.fetchNextPage()} disabled={!feed.hasNextPage || feed.isFetchingNextPage}>
      {feed.isFetchingNextPage ? "Loading…" : "Load more"}
    </button>
  </>
)
```

## 3. Prefetch

```tsx
const qc = useQueryClient()
const prefetch = () => qc.prefetchQuery({ ...todosQuery("open"), staleTime: 10_000 })
return <Link to="/todos" onMouseEnter={prefetch}>Todos</Link>
```

For SSR, `await qc.prefetchQuery(...)` in the loader, then `dehydrate` + `HydrationBoundary` — the client hydrates with data and no loading flash.

## 4. Keep the old page while filters change

```tsx
useQuery({ ...todosQuery(filter), placeholderData: keepPreviousData })
```

`keepPreviousData` (imported helper) replaces v4's `keepPreviousData: true`.

## Pitfalls

- Offset pagination inside an infinite query → rows shift when new items arrive; use a cursor.
- `getNextPageParam` returning the same cursor → endless identical pages.
- Prefetching with a different key than the page uses → wasted request plus a loading state anyway.
- Rebuilding `queryFn` from inline closures on every render → refetch storms; keep it in `queryOptions`.

## Related

- `references/apis.md`
- `usecases/query-with-cache-invalidation.md`
- `usecases/mutations-with-optimistic-ui.md`
