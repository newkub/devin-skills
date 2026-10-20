# Use Case — Server-Side Paging with Stable Row Selection

> Page through a large dataset on the server while keeping checkbox selection across pages, and never let a refetch select the wrong row. Source: https://tanstack.com/table/latest/docs/guide/row-selection (accessed 2026-10-20)

## 1. Manual pagination tied to the query key

```tsx
const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 20 })

const { data, isFetching } = useQuery({
  queryKey: ["orders", pagination],
  queryFn: () => api.orders({ page: pagination.pageIndex, size: pagination.pageSize }),
  placeholderData: keepPreviousData,
})

const table = useReactTable({
  data: data?.rows ?? [],
  columns,
  state: { pagination, rowSelection },
  onPaginationChange: setPagination,
  onRowSelectionChange: setRowSelection,
  manualPagination: true,
  pageCount: data ? Math.ceil(data.total / pagination.pageSize) : -1,
  getRowId: (row) => row.id,
  getCoreRowModel: getCoreRowModel(),
})
```

`pageCount` is the only thing the table knows about the dataset — pass `-1` while unknown, the real count afterwards, and `manualPagination: true` so it never slices the current page again.

## 2. Selection survives paging

```tsx
const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({})

const selectedIds = Object.keys(rowSelection).filter((id) => rowSelection[id])
```

With `getRowId`, the selection map is keyed by `order.id`, so page 2 does not inherit page 1's indexes. Checkbox cells:

```tsx
const selectionColumn: ColumnDef<Order> = {
  id: "select",
  header: ({ table }) => (
    <input type="checkbox"
      checked={table.getIsAllPageRowsSelected()}
      onChange={table.getToggleAllPageRowsSelectedHandler()} />
  ),
  cell: ({ row }) => (
    <input type="checkbox" checked={row.getIsSelected()} onChange={row.getToggleSelectedHandler()} />
  ),
}
```

## 3. Bulk action on the selection

```tsx
const bulkArchive = async () => {
  await api.archive(selectedIds)
  setRowSelection({})
  await queryClient.invalidateQueries({ queryKey: ["orders"] })
}
```

## Pitfalls

- `manualPagination: true` without `pageCount` → "next" is disabled forever and the last-page button never appears.
- Default index-based row ids → after a refetch the selected indexes point at different orders; always set `getRowId`.
- Selection ids are strings (`"42"`, not `42`) → `Number()` them before sending to the API, or key by a string id.
- Passing the whole `table` state back into `useEffect` deps → refetch loop; derive the query key from `pagination` only.

## Related

- `references/apis.md`
- `usecases/sorting-filtering-and-pagination.md`
