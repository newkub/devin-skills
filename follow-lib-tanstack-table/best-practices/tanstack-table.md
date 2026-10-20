# TanStack Table — Best Practices

Headless datagrid — column defs, row models, controlled state, server-side data

## Recommended Patterns

- `data` and `columns` are memoized — column defs at module scope when static, `useMemo` when they close over props
- Use `createColumnHelper<T>()` for type-safe definitions; `accessor` for data columns, `display` for UI-only columns
- Enable only the row models the screen actually uses — each one is a processing pipeline stage
- Control a feature's state only when it must sync with the URL or an external store; leave the rest uncontrolled with `initialState`
- Server-side mode means `manualPagination`/`manualSorting`/`manualFiltering` + `pageCount`, with fetching in Query — never pass the full dataset and enable manual flags
- Provide a stable `getRowId` so selection and expansion survive refetch and sorting
- Render header/cell content through `flexRender` with the provided context
- Virtualize rows once the table passes roughly a thousand rows (pair with Virtual)
- Headless means a11y is yours: sortable headers are buttons, `aria-sort` reflects state, selection uses checkbox semantics

## Common Pitfalls

- Inline `data`/`columns` arrays create new references every render and can loop table updates
- Enabling `manual*` while still handing over the full data renders an empty or duplicated page
- Keying selection by row index selects the wrong rows after sorting or filtering
- `autoResetPageIndex` resets the page on every data change — disable it when the user pages deliberately
- Controlled state without its `on*Change` handler freezes the feature (sorting/paging stops responding)
- Enabling a feature without its row model silently does nothing
- Heavy computation inside cell renderers runs on every table render

## Perf Notes

- The default row model recomputes on data/state change — narrow the state you control to avoid needless passes
- Memoize cell components and hoist formatters out of render
- Server-side pagination beats client sorting/filtering for large datasets
- Combine virtualization with a stable `getRowId` so recycling rows keeps identity

## Do / Don't

| Do | Don't |
|----|-------|
| memoized `data`/`columns` | inline arrays in `useReactTable` |
| only the row models you need | enabling every row model by default |
| `manual*` + `pageCount` for server data | full dataset with manual flags |
| stable `getRowId` | index-based row keys |
| `flexRender` with cell context | string-concatenating header/cell content |
