# Use Case — Column Visibility, Pinning, and Resizing That Stick

> Let users hide, freeze, and resize columns, and keep those choices across reloads without losing a column forever. Source: https://tanstack.com/table/latest/docs/guide/column-sizing (accessed 2026-10-20)

## 1. Declare sizing and pinning up front

```tsx
const columns = useMemo(() => [
  columnHelper.accessor("id", { header: "ID", size: 80, enableResizing: false }),
  columnHelper.accessor("customer", { header: "Customer", size: 240, minSize: 120 }),
  columnHelper.accessor("total", {
    header: "Total",
    size: 120,
    meta: { align: "right" as const },
  }),
  columnHelper.display({ id: "actions", header: "", size: 64 }),
], []);
```

`size` is the starting width; `minSize`/`maxSize` are the drag limits. Without a `minSize`, a user can resize a column to zero and then cannot grab the handle to bring it back.

## 2. Controlled state for the three features

```tsx
const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(() => savedLayout()?.visibility ?? {});
const [columnPinning, setColumnPinning] = useState<ColumnPinningState>(() => savedLayout()?.pinning ?? { left: ["id"], right: ["actions"] });
const [columnSizing, setColumnSizing] = useState<ColumnSizingState>(() => savedLayout()?.sizing ?? {});

const table = useReactTable({
  data, columns,
  state: { columnVisibility, columnPinning, columnSizing },
  onColumnVisibilityChange: setColumnVisibility,
  onColumnPinningChange: setColumnPinning,
  onColumnSizingChange: setColumnSizing,
  enableColumnResizing: true,
  columnResizeMode: "onChange",       // "onEnd" = cheaper, updates on release
  getCoreRowModel: getCoreRowModel(),
});
```

Three pieces of state, three setters — the pattern is the same for every controllable feature, so nothing needs a bespoke wrapper.

## 3. Freeze with sticky offsets, not separate tables

```tsx
<td
  style={{
    width: header.getSize(),
    position: "sticky",
    left: header.column.getStart("left"),     // computed by the table
    right: header.column.getAfter("right"),
    zIndex: 1,
  }}
>
```

`getStart('left')` sums the widths of the pinned columns before it, so resizing a pinned column moves the next one automatically. Hand-computed `left: 80px` breaks the moment someone drags the first column.

## 4. Persist and restore the layout

```ts
const KEY = "orders-table-layout";

function saveLayout(next: { visibility: VisibilityState; pinning: ColumnPinningState; sizing: ColumnSizingState }) {
  localStorage.setItem(KEY, JSON.stringify({ v: 1, ...next }));
}

// drop ids that no longer exist, so a removed column cannot stay "hidden" forever
function prune(layout: Layout, validIds: Set<string>): Layout {
  return {
    visibility: Object.fromEntries(Object.entries(layout.visibility).filter(([id]) => validIds.has(id))),
    pinning: { left: layout.pinning.left?.filter((id) => validIds.has(id)), right: layout.pinning.right?.filter((id) => validIds.has(id)) },
    sizing: Object.fromEntries(Object.entries(layout.sizing).filter(([id]) => validIds.has(id))),
  };
}
```

Persisted ids outlive the columns that produced them. Pruning against the current column set is what stops a renamed column from arriving hidden with no control to unhide it.

## 5. Verify

1. Hide a column — it disappears from header and body together
2. Pin `id` left, scroll horizontally — the column stays put and the border shadow is drawn on the right edge of the last pinned column
3. Drag a column narrower than `minSize` — it stops at the minimum
4. Reload — visibility, pinning, and widths are restored
5. Remove one column from the definitions, reload — the stored layout is pruned, the rest still applies
6. On failure → `/resolve-errors` max 3 rounds

## Pitfalls

- Sticky offsets hard-coded → resizing a pinned column overlaps the next header.
- `columnResizeMode: "onChange"` on a 10k-row table → every pointer move re-renders all rows; use `onEnd` for big data.
- Persisting before the columns are known → the restore runs against an empty id set and wipes the layout.
- Hiding a column that a `select`/aggregation depends on → calculations silently use the hidden value; hide the UI, keep the data.
- No default `columnVisibility` → every new column appears at the far right of a table users already arranged.

## Related

- `references/apis.md`
- `best-practices/tanstack-table.md`
- `usecases/server-side-pagination-and-selection.md`
- `usecases/url-synced-table-state.md`
