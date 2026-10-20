# Use Case — Client-Side Sort, Filter and Paginate

> One table instance over an in-memory array: sortable headers, a global filter, and pagination wired without extra state juggling. Source: https://tanstack.com/table/latest/docs/guide/pagination (accessed 2026-10-20)

## 1. Columns outside the component

```tsx
import type { ColumnDef } from "@tanstack/react-table"

type Order = { id: string; customer: string; total: number; status: "paid" | "open" }

export const columns: ColumnDef<Order>[] = [
  { accessorKey: "id", header: "ID" },
  { accessorKey: "customer", header: "Customer" },
  { accessorKey: "total", header: "Total", cell: ({ getValue }) => `$${getValue<number>().toFixed(2)}` },
  { accessorKey: "status", header: "Status" },
]
```

A new `columns` array on every render resets table state — define it at module scope or memoize it.

## 2. Table instance

```tsx
import {
  useReactTable, getCoreRowModel, getSortedRowModel,
  getFilteredRowModel, getPaginationRowModel, flexRender,
} from "@tanstack/react-table"

const table = useReactTable({
  data: orders,
  columns,
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  initialState: { pagination: { pageSize: 20 } },
})
```

`getCoreRowModel` is mandatory; the other models compose on top of it in this order.

## 3. Render from the model, never from `data`

```tsx
<table>
  <thead>
    {table.getHeaderGroups().map((hg) => (
      <tr key={hg.id}>
        {hg.headers.map((h) => (
          <th key={h.id} onClick={h.column.getToggleSortingHandler()}>
            {flexRender(h.column.columnDef.header, h.getContext())}
            {{ asc: " ▲", desc: " ▼" }[h.column.getIsSorted() as string] ?? null}
          </th>
        ))}
      </tr>
    ))}
  </thead>
  <tbody>
    {table.getRowModel().rows.map((row) => (
      <tr key={row.id}>
        {row.getVisibleCells().map((cell) => (
          <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
        ))}
      </tr>
    ))}
  </tbody>
</table>
<button onClick={table.previousPage} disabled={!table.getCanPreviousPage()}>Previous</button>
<button onClick={table.nextPage} disabled={!table.getCanNextPage()}>Next</button>
```

## 4. Controlled filter

```tsx
const [globalFilter, setGlobalFilter] = useState("")
const table = useReactTable({ /* ... */ state: { globalFilter }, onGlobalFilterChange: setGlobalFilter })
```

Only the slices you pass into `state` are controlled; leaving `sorting` out keeps it internal.

## Pitfalls

- Missing `getCoreRowModel()` → the table renders zero rows with no error.
- Mapping `data` instead of `table.getRowModel().rows` → sorting, filtering and pagination silently do nothing.
- `columns`/`data` recreated per render → state resets and the table fights your inputs; memoize both.
- Reading `getCanNextPage()` before rows exist → it is `false` on the first paint; compute after data arrives.

## Related

- `references/apis.md`
- `usecases/server-side-pagination-and-selection.md`
