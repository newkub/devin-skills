# Use Case — Dependent Queries and Derived `select`

> Wait for a prerequisite without waterfalling every request, and subscribe only to the slice a component renders. Source: https://tanstack.com/query/latest/docs/framework/react/guides/dependent-queries (accessed 2026-10-20)

## 1. Gate the query with `enabled`

```tsx
const { data: user } = useQuery({
  queryKey: ["user", userId],
  queryFn: () => api.user(userId),
});

const { data: projects, isPending } = useQuery({
  queryKey: ["projects", user?.orgId],
  queryFn: () => api.projects(user!.orgId),     // safe: enabled guarantees user exists
  enabled: !!user?.orgId,                        // the dependency gate
});
```

`enabled: false` keeps the query in `pending` without firing the request. Without the gate, `queryFn` runs with `undefined` and you get a 404 cached under a garbage key.

## 2. Put the whole dependency in the key

```ts
// ❌ same key for every org → the cache serves another org's projects
useQuery({ queryKey: ["projects"], queryFn: () => api.projects(orgId) });

// ✅ every variable the fn reads is part of the key
useQuery({ queryKey: ["projects", { orgId, archived }], queryFn: () => api.projects(orgId, { archived }) });
```

Object form is fine — TanStack Query hashes keys deterministically, so key order inside the object does not matter.

## 3. Subscribe to a derived slice

```tsx
function OpenCount() {
  const { data: count } = useQuery({
    queryKey: ["todos"],
    queryFn: api.todos,
    select: (todos) => todos.filter((t) => !t.done).length,
  });
  return <span>{count ?? 0}</span>;
}
```

`select` runs against the cached data and the component re-renders only when the selected value changes. Filtering in the component body instead re-renders on every unrelated todo update.

## 4. Keep `select` stable

```tsx
const selectNames = useCallback((users: User[]) => users.map((u) => u.name), []);
const { data: names } = useQuery({ queryKey: ["users"], queryFn: api.users, select: selectNames });
```

An inline `select` is a new function each render; v5 memoizes the result per data reference, but the selector still re-runs. Hoist it when it does real work.

## 5. Verify

1. `/run-test` — mount before `userId` resolves: the dependent query issues no request, and exactly one after
2. Switch `orgId` — a new request fires and the old org's data is not shown (key includes `orgId`)
3. Update one todo — the derived-count component renders; an unrelated component does not
4. Devtools cache list — keys read `["projects", {"orgId":"acme","archived":false}]`; no `["projects", undefined]`
5. On failure → `/resolve-errors` max 3 rounds

## Pitfalls

- `enabled` without the guard in `queryFn` → the non-null assertion hides a real runtime path; keep both consistent.
- Gating with `isLoading` in JSX but fetching unconditionally in the hook → the request fires anyway.
- A key that omits a filter → switching filters shows the previous filter's rows for a moment, then sometimes forever.
- `select` returning a new array each call with a `useMemo` on the wrong dep → memo invalidates every render.
- Chaining five `enabled` queries → five sequential round trips; fetch the prerequisite in one server call and pass it down.

## Related

- `references/apis.md`
- `best-practices/query.md`
- `usecases/query-with-cache-invalidation.md`
- `usecases/ssr-hydration-boundary.md`
