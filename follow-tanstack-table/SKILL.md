---
name: follow-tanstack-table
description: ตั้งค่าและใช้งาน TanStack Table v9 สำหรับ headless table management
---

## Goal

ตั้งค่า TanStack Table v9 สำหรับ headless, type-safe, tree-shakeable table management

## Scope

ใช้สำหรับ TanStack Table v9 ใน React, Solid, Vue, Svelte, Angular projects

## Execute

### 1. Setup And Features

1. ติดตั้งด้วย `bun add @tanstack/[framework]-table`
2. ใช้ `useTable` (React) หรือ `createTable` (other frameworks) พร้อม `features` property
3. ใช้ `tableFeatures()` สำหรับ explicit feature registration (tree-shakeable)
4. ใช้ `createColumnHelper` พร้อม `typeof features` เป็น first generic argument

### 2. Columns

1. กำหนด columns ด้วย `ColumnDef<TFeatures, TData>` type
2. ใช้ `columnHelper.accessor()` สำหรับ column definitions
3. ใช้ `sortFn` (renamed from `sortingFn`) สำหรับ sorting functions
4. ใช้ `filterFn` สำหรับ filtering functions

### 3. Row Models

1. Core row model รวมอัตโนมัติ
2. ใช้ `createSortedRowModel()` สำหรับ sorting
3. ใช้ `createFilteredRowModel()` สำหรับ filtering
4. ใช้ `createPaginatedRowModel()` สำหรับ pagination
5. ใช้ `createFacetedRowModel()` สำหรับ faceted filtering
6. Data flow pipeline: Core → Filtered → Grouped → Sorted → Expanded → Paginated

### 4. Rendering

1. ใช้ `<table.FlexRender>` สำหรับ render headers, cells, footers
2. ใช้ `table.getHeaderGroups()` สำหรับ headers
3. ใช้ `row.getVisibleCells()` สำหรับ body cells

### 5. Column Features

1. ใช้ `columnVisibilityFeature` สำหรับ show/hide columns
2. ใช้ `columnPinningFeature` สำหรับ sticky columns (`enableColumnPinning`)
3. ใช้ `columnSizingFeature` สำหรับ fixed widths
4. ใช้ `columnResizingFeature` สำหรับ drag-to-resize
5. ใช้ `header.getResizeHandler()` สำหรับ resize functionality

## Rules

### 1. Table Best Practices

- กำหนด `ColumnDef<TFeatures, TData>` type สำหรับ type safety
- ใช้ `tableFeatures()` สำหรับ explicit feature registration
- ใช้ `<table.FlexRender>` สำหรับ rendering
- ใช้ state สำหรับ sorting, filtering, pagination
- ใช้ `columnVisibility` และ `columnPinning` สำหรับ UX
- หลีกเลี่ยง manual row manipulation

### 2. Type Safety

- ใช้ `typeof features` เป็น first generic argument
- ใช้ type inference จาก `createColumnHelper`
- ใช้ `sortFns` และ `filterFns` registries ใน `tableFeatures`

## Expected Outcome

- TanStack Table v9 ใช้ headless UI พร้อม type-safe columns
- Tree-shakeable features ลด bundle size
- Sorting, filtering, pagination, faceted filtering ทำงานครบ
- Column visibility, pinning, resizing รองรับ UX
- Type safety ตลอดทั้งระบบ
