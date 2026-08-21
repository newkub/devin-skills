---
description: ใช้งาน TanStack Table สำหรับ table component ที่มี sorting, filtering, และ pagination
---

## Goal

ติดตั้งและใช้งาน TanStack Table สำหรับ table component ที่มี sorting, filtering, pagination และ virtualization

## Scope

- ติดตั้ง TanStack Table
- สร้าง table พื้นฐาน
- เพิ่ม sorting
- เพิ่ม filtering
- เพิ่ม pagination
- เพิ่ม virtualization

## Execute

### 1. Install TanStack Table

```bash
bun add @tanstack/react-table
```

### 2. Create Basic Table

```tsx
import { useReactTable, getCoreRowModel, flexRender } from '@tanstack/react-table'

function Table({ data, columns }) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <table>
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th key={header.id}>
                {flexRender(
                  header.column.columnDef.header,
                  header.getContext()
                )}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
```

### 3. Add Sorting

```tsx
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
} from '@tanstack/react-table'

function Table({ data, columns }) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  // Add sorting UI in header
  const header = headerGroup.headers[0]
  return (
    <th
      onClick={header.column.getToggleSortingHandler()}
      style={{ cursor: 'pointer' }}
    >
      {flexRender(header.column.columnDef.header, header.getContext())}
      {{
        asc: ' 🔼',
        desc: ' 🔽',
      }[header.column.getIsSorted() as string] ?? null}
    </th>
  )
}
```

### 4. Add Filtering

```tsx
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
} from '@tanstack/react-table'

function Table({ data, columns }) {
  const [filtering, setFiltering] = useState('')

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      globalFilter: filtering,
    },
    onGlobalFilterChange: setFiltering,
  })

  return (
    <div>
      <input
        value={filtering}
        onChange={(e) => setFiltering(e.target.value)}
        placeholder="Search..."
      />
      <table>...</table>
    </div>
  )
}
```

### 5. Add Pagination

```tsx
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
} from '@tanstack/react-table'

function Table({ data, columns }) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  return (
    <div>
      <table>...</table>
      <div>
        <button onClick={() => table.setPageIndex(0)}>First</button>
        <button
          disabled={!table.getCanPreviousPage()}
          onClick={() => table.previousPage()}
        >
          Previous
        </button>
        <button
          disabled={!table.getCanNextPage()}
          onClick={() => table.nextPage()}
        >
          Next
        </button>
        <button onClick={() => table.setPageIndex(table.getPageCount() - 1)}>
          Last
        </button>
      </div>
    </div>
  )
}
```

## Best Practices

- ใช้ column definitions ที่ type-safe
- ใช้ memoization สำหรับ cell renderers
- ใช้ virtualization สำหรับ large datasets
- แยก table logic ออกเป็น custom hooks
