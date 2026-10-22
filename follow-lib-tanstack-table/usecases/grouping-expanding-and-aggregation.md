# Use Case — Grouped Rows With Aggregated Columns

> Collapse a flat list into category groups, show a total per group, and let the user expand one branch without expanding all of them. Source: https://tanstack.com/table/latest/docs/guide/grouping (accessed 2026-10-20)

## 1. Mark which columns can group and aggregate

```tsx
const columnHelper = createColumnHelper<Order>();

const columns = useMemo(() => [
  columnHelper.accessor("region", {
    header: "Region",
    enableGrouping: true,
    aggregationFn: "uniqueCount",     // shown on the group row
  }),
  columnHelper.accessor("status", {
    header: "Status",
    enableGrouping: true,
    aggregationFn: "count",
  }),
  columnHelper.accessor("total", {
    header: "Total",
    aggregationFn: "sum",
    cell: (info) => money(info.getValue()),
  }),
  columnHelper.accessor("placedAt", {
    header: "Placed",
    enableGrouping: false,            // dates have no useful group value
  }),
], []);
```

Grouping is opt-in per column. Enabling it globally and then hiding half the options gives users a grouping menu that mostly produces one row per order.

## 2. Turn on the row models

```tsx
const table = useReactTable({
  data,
  columns,
  state: { grouping, expanded },
  onGroupingChange: setGrouping,
  onExpandedChange: setExpanded,
  getCoreRowModel: getCoreRowModel(),
  getGroupedRowModel: getGroupedRowModel(),
  getExpandedRowModel: getExpandedRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  groupedColumnMode: "reorder",       // grouped columns move to the front
  paginateExpandedRows: false,        // a group is one page row, not one per child
});
```

Without `paginateExpandedRows: false`, a page of 10 turns into 10 children of one group and the pagination controls look broken.

## 3. Render a group row differently

```tsx
{table.getRowModel().rows.map((row) =>
  row.getIsGrouped() ? (
    <tr key={row.id} className="group-row">
      <td colSpan={row.getVisibleCells().length}>
        <button onClick={row.getToggleExpandedHandler()} aria-expanded={row.getIsExpanded()}>
          {row.getIsExpanded() ? "▾" : "▸"} {row.getValue(row.groupingColumnId!)}
        </button>
        <span>{row.subRows.length} orders</span>
        <span>{money(row.getLeafRows().reduce((n, r) => n + r.original.total, 0))}</span>
      </td>
    </tr>
  ) : (
    <tr key={row.id}>
      {row.getVisibleCells().map((cell) => (
        <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
      ))}
    </tr>
  ),
)}
```

`row.getValue(groupingColumnId)` returns the group key; `getLeafRows()` gives everything under it when you need a number the built-in aggregators do not produce.

## 4. Give users a grouping control

```tsx
<select
  value={grouping[0] ?? ""}
  onChange={(e) => setGrouping(e.target.value ? [e.target.value] : [])}
>
  <option value="">No grouping</option>
  {table.getAllColumns().filter((c) => c.getCanGroup()).map((c) => (
    <option key={c.id} value={c.id}>{String(c.columnDef.header)}</option>
  ))}
</select>
```

`getCanGroup()` reflects `enableGrouping` per column, so the menu can never offer a column the table refuses to group.

## 5. Verify

1. `/run-test` — group by `status`: three group rows, each with the correct count and sum
2. Expand one group — only that group's children appear; `aria-expanded` flips
3. With `pageSize: 10` and grouping on — one group counts as one page row
4. Group by a column with `enableGrouping: false` — it is absent from the control
5. `/run-typecheck` — `row.original` stays typed inside the group branch
6. On failure → `/resolve-errors` max 3 rounds

## Pitfalls

- Grouping enabled on every column → meaningless groups (one row per date) and a cluttered menu.
- Missing `getExpandedRowModel` → the toggle updates state but no children ever render.
- `paginateExpandedRows` left at the default with grouping → page size counts children, so page 2 starts mid-group.
- Reading `row.original` on a group row → it is the first child's data, not the group's; use `getLeafRows()`.
- Sorting after grouping without `getSortedRowModel` + a sort on the group column → groups appear in insertion order.

## Related

- `references/apis.md`
- `best-practices/tanstack-table.md`
- `usecases/sorting-filtering-and-pagination.md`
- `usecases/column-layout-visibility-pinning-resizing.md`
