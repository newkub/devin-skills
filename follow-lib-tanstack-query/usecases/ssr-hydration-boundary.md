# Use Case — Server-Rendered Data Without a Client Refetch

> Prefetch on the server, dehydrate the cache into the HTML, and let the client hydrate it so the first paint uses the data it already has. Source: https://tanstack.com/query/latest/docs/framework/react/guides/ssr (accessed 2026-10-20)

## 1. One client per request on the server

```tsx
// src/entry-server.tsx
import { QueryClient, dehydrate } from "@tanstack/react-query";
import { prefetchTodos } from "./queries/todos";

export async function render({ request }: { request: Request }) {
  const queryClient = new QueryClient();          // never module scope on a server

  await prefetchTodos(queryClient);               // await the data the page needs
  const html = renderToString(<App />);

  return { html, dehydrated: dehydrate(queryClient) };
}
```

A module-scope `QueryClient` on the server leaks one user's cached data into another user's HTML. One client per request is the rule that makes everything else safe.

## 2. Prefetch through `queryOptions`, not a copy of the key

```ts
// src/queries/todos.ts
import { queryOptions } from "@tanstack/react-query";

export const todosQuery = queryOptions({
  queryKey: ["todos"],
  queryFn: () => api.todos(),
  staleTime: 30_000,
});

export const prefetchTodos = (qc: QueryClient) => qc.ensureQueryData(todosQuery);
```

The component consumes `useQuery(todosQuery)` and the server consumes `ensureQueryData(todosQuery)` — one key, one fn, no chance of a mismatch that turns into a double fetch.

## 3. Hydrate on the client

```tsx
// src/entry-client.tsx
const queryClient = new QueryClient();

hydrate(queryClient, window.__DEHYDRATED__);

root.render(
  <QueryClientProvider client={queryClient}>
    <HydrationBoundary state={window.__DEHYDRATED__}>
      <App />
    </HydrationBoundary>
  </QueryClientProvider>,
);
```

Serialise with `superjson` (or your framework's serializer) when data contains `Date`. Plain `JSON.stringify` turns dates into strings, and the client then renders `[object Object]`-era differences that break hydration.

## 4. Make `staleTime` cover the trip

```ts
new QueryClient({
  defaultOptions: { queries: { staleTime: 30_000, refetchOnMount: false } },
});
```

With the default `staleTime: 0`, the hydrated data is stale the moment it lands and the client refetches immediately — the server render bought nothing. `staleTime` is what turns prefetching into a real win.

## 5. Verify

1. `/run-test` — render the route server-side, then mount it with the dehydrated state: `queryFn` is not called on mount
2. View the network panel on first load — no duplicate request for the prefetched key
3. Disable JS — the server HTML still contains the data
4. Two parallel requests with different users — no shared cache (assert the prefetched payload differs)
5. On failure → `/resolve-errors` max 3 rounds

## Pitfalls

- Module-scope `QueryClient` on the server → cross-request data leaks between users.
- Prefetching with a hand-written key that differs from the component's → two cache entries and a visible refetch.
- Forgetting `staleTime` → the client refetches everything the server just sent.
- `JSON.stringify` on dates/`Map` → hydration mismatch that only shows on data with non-JSON types.
- Prefetching data the route does not render → slower TTFB and a bigger HTML payload for nothing.

## Related

- `references/apis.md`
- `best-practices/query.md`
- `usecases/dependent-queries-and-derived-select.md`
- `usecases/query-with-cache-invalidation.md`
