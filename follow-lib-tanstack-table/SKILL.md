---
name: follow-lib-tanstack-table
description: ใช้ TanStack Table ครบวงจร — columns, row models, sorting/filtering/pagination, selection, grouping, server-side, virtualization
argument-hint: "[framework] [feature]"
related:
  - follow-lib-tanstack-ecosystem
  - run-test
  - run-typecheck
  - resolve-errors
---

## Goal

ใช้ TanStack Table (v9) ครบ — headless datagrid: columns, row models, sorting, filtering, pagination, row selection, grouping/expanding, column features, server-side data, virtualization

## Scope

ใช้กับ data tables ทุกขนาด — headless = library จัดการ state/logic, **UI render เองทั้งหมด**; rows จำนวนมาก → `follow-virtual`

- part of TanStack ecosystem — selection/dispatch อยู่ที่ `/follow-lib-tanstack-ecosystem`

## Execute

### 1. Install

```bash
bun add @tanstack/react-table   # มี solid/vue/svelte/angular variants
```

### 2. Columns

> Goal: type-safe column definitions

```tsx
const columnHelper = createColumnHelper<Todo>()

const columns = [
  columnHelper.accessor('title', { header: 'Title' }),
  columnHelper.accessor('done', {
    header: 'Status',
    cell: (info) => (info.getValue() ? 'Done' : 'Pending'),
    filterFn: 'equals',
  }),
  columnHelper.display({ id: 'actions', cell: (props) => <RowActions row={props.row} /> }),
]
```

- `accessor` (data key), `display` (UI-only), `group` (column groups) — เลือก type ให้ถูก
- Column meta: `columnDef.meta` สำหรับ custom data (align, width, css class)

### 3. Row Models And State

> Goal: features เปิดตาม row models

```tsx
const table = useReactTable({
  data, columns,
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  getExpandedRowModel: getExpandedRowModel(),
  state: { sorting, columnFilters, globalFilter, rowSelection, expanded, columnVisibility },
  onSortingChange: setSorting,              // controlled state ทุก feature
  onRowSelectionChange: setRowSelection,
  enableRowSelection: true,
})
```

- ทุก feature state เป็น controlled หรือ uncontrolled ได้ — controlled เมื่อต้อง sync URL/external
- `initialState` สำหรับ defaults; `autoResetPageIndex` เมื่อ data เปลี่ยน

### 4. Feature Patterns

> Goal: features ที่ใช้จริง

1. **Sorting**: `column.getToggleSortingHandler()` + `getIsSorted()`; multi-sort `enableMultiSort`
2. **Filtering**: global (`setGlobalFilter`) + per-column (`column.setFilterValue`) + `filterFns` custom
3. **Pagination**: `nextPage`/`previousPage`/`setPageIndex`/`setPageSize`
4. **Selection**: `row.getToggleSelectedHandler()` + `table.getSelectedRowModel()` bulk actions
5. **Grouping/expanding**: `getGroupedRowModel` + `row.getIsExpanded()`/`toggleExpanded`
6. **Column features**: `column.toggleVisibility()`, pinning `column.pin('left')`, resizing `enableColumnResizing`
7. **Server-side**: `manualPagination`/`manualSorting`/`manualFiltering` + `pageCount` — table ไม่ process, fetch ผ่าน `follow-query`

### 5. Render And Verify

```tsx
{table.getHeaderGroups().map((hg) => hg.headers.map((h) =>
  flexRender(h.column.columnDef.header, h.getContext())))}
{table.getRowModel().rows.map((row) => row.getVisibleCells().map((cell) =>
  flexRender(cell.column.columnDef.cell, cell.getContext())))}
```

1. `/run-typecheck` + `/run-test`; ทดสอบ sort/filter/paginate/select จริง
2. >1000 rows → `useVirtualizer` บน rows (`follow-virtual`)
3. ถ้า fail → `/resolve-errors` max 3 รอบ

## Rules

- `data`/`columns` ต้อง `useMemo` — reference ใหม่ = recompute ทุก render
- `flexRender` เท่านั้นสำหรับ header/cell content
- Server-side mode = `manual*` flags + fetch เอง — อย่าส่ง data ครบแล้วเปิด manual
- Controlled state เมื่อ sync URL (`follow-router` search params)
- Headless — a11y (sort buttons, aria-sort, row selection semantics) เป็นหน้าที่ app

## Expected Outcome

- Table ครบ features ตามที่เปิด row models
- Type-safe columns + controlled/uncontrolled state ถูกต้อง
- Server-side/virtualization wiring ถูกเมื่อ data ใหญ่
