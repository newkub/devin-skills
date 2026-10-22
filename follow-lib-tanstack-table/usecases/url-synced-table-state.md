# Use Case — Table State in the URL

> Keep sort, filters, and page in the query string so a shared link opens the same view, with one decode/encode pair and no state loop. Source: https://tanstack.com/table/latest/docs/guide/global-filtering (accessed 2026-10-20)

## 1. Validate the URL once

```tsx
// src/routes/_app/orders.tsx
import { z } from "zod";

const searchSchema = z.object({
  page: z.number().int().min(0).catch(0),
  sort: z.string().optional(),                       // "total:desc"
  status: z.array(z.string()).default([]),           // repeated ?status=a&status=b
});

export const Route = createFileRoute("/_app/orders")({
  validateSearch: searchSchema,
  loaderDeps: ({ search }) => ({ page: search.page, sort: search.sort, status: search.status }),
  loader: ({ deps }) => api.orders(deps),
  component: OrdersPage,
});
```

`loaderDeps` is what makes the loader re-run when the URL changes. Without it, the table updates its sort arrow and the rows stay those of the previous query.

## 2. Decode into table state

```tsx
function decodeSort(sort?: string): SortingState {
  if (!sort) return [];
  const [id, dir] = sort.split(":");
  return id ? [{ id, desc: dir === "desc" }] : [];
}

function OrdersPage() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();

  const [sorting, setSorting] = useState<SortingState>(() => decodeSort(search.sort));
```

Seed from the URL on mount, then mirror changes back — the URL is the input, the table state is the working copy.

## 3. Encode back with `replace`

```tsx
const onSortingChange = (updater: Updater<SortingState>) => {
  const next = typeof updater === "function" ? updater(sorting) : updater;
  setSorting(next);

  const sort = next[0] ? `${next[0].id}:${next[0].desc ? "desc" : "asc"}` : undefined;
  navigate({
    search: (prev) => ({ ...prev, sort, page: 0 }),   // a sort change resets the page
    replace: true,                                    // sorting is not a new history entry
  });
};
```

`replace: true` keeps the back button meaningful: users expect it to leave the page, not to walk back through eight sort clicks.

## 4. Sync filters without a request per keystroke

```tsx
const [status, setStatus] = useState(search.status);
const commit = useDebouncedCallback((next: string[]) => {
  navigate({ search: (prev) => ({ ...prev, status: next, page: 0 }), replace: true });
}, { wait: 300 });
```

Text filters need debounce; toggles do not. Both must reset `page` to 0, or the user lands on an empty page 4 after filtering to three results.

## 5. Verify

1. Set sort + filters, copy the URL, open it in a new tab — same rows, same sort arrows, same page
2. Change the sort — page returns to 0 and the loader refetches (watch the request)
3. Press Back once — you leave the page, not step through each sort
4. Hand-edit `?page=-3` and `?sort=bogus` — the schema catches them and the table renders page 0, unsorted
5. `/run-typecheck` — `Route.useSearch()` returns the schema's types
6. On failure → `/resolve-errors` max 3 rounds

## Pitfalls

- `validateSearch` without a `.catch()`/default → a hand-edited URL throws and the page does not render.
- No `loaderDeps` → the URL changes, the table re-renders, the data does not.
- `push` on every sort click → the back button becomes a history of sort changes.
- Filters changing without resetting `page` → an empty page that looks like "no results".
- Two sources of truth (URL and local state) with no decode step → a hard reload lands on the default view while the URL says otherwise.

## Related

- `references/apis.md`
- `best-practices/tanstack-table.md`
- `usecases/server-side-pagination-and-selection.md`
- `usecases/column-layout-visibility-pinning-resizing.md`
