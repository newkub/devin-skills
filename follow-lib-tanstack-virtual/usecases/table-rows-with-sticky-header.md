# Use Case — Virtualize Table Rows With a Sticky Header

> Render 50 000 rows through a `<table>` without a 50 000-node DOM, keeping the header sticky and the scrollbar honest. Source: https://tanstack.com/virtual/latest/docs/introduction (accessed 2026-10-20)

## 1. Virtualize rows inside `<tbody>`

```tsx
const table = useReactTable({ data, columns, getCoreRowModel: getCoreRowModel() });
const rows = table.getRowModel().rows;

const parentRef = useRef<HTMLDivElement>(null);
const rowVirtualizer = useVirtualizer({
  count: rows.length,
  getScrollElement: () => parentRef.current,
  estimateSize: () => 44,
  overscan: 12,
});
```

The scroll container is the `<div>` around the `<table>`, not the `<tbody>` — `tbody` does not scroll.

## 2. Add padding rows instead of absolute positioning

```tsx
const items = rowVirtualizer.getVirtualItems();
const paddingTop = items.length ? items[0].start : 0;
const paddingBottom = items.length
  ? rowVirtualizer.getTotalSize() - items[items.length - 1].end
  : 0;

<div ref={parentRef} style={{ height: 560, overflow: "auto" }}>
  <table>
    <thead style={{ position: "sticky", top: 0, zIndex: 1, background: "var(--surface)" }}>
      {table.getHeaderGroups().map((hg) => (
        <tr key={hg.id}>
          {hg.headers.map((h) => <th key={h.id} style={{ width: h.getSize() }}>{flexRender(h.column.columnDef.header, h.getContext())}</th>)}
        </tr>
      ))}
    </thead>
    <tbody>
      {paddingTop > 0 && <tr><td style={{ height: paddingTop }} colSpan={columns.length} /></tr>}
      {items.map((vi) => {
        const row = rows[vi.index];
        return (
          <tr key={row.id} data-index={vi.index} ref={rowVirtualizer.measureElement}>
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
            ))}
          </tr>
        );
      })}
      {paddingBottom > 0 && <tr><td style={{ height: paddingBottom }} colSpan={columns.length} /></tr>}
    </tbody>
  </table>
</div>
```

Absolute positioning does not work inside a table layout; spacer rows are how a virtualized `<tbody>` keeps column widths and the real total height.

## 3. Key rows by id, not index

```tsx
<tr key={row.id} data-index={vi.index} ref={rowVirtualizer.measureElement}>
```

`data-index` must be the virtual index (the measurement API reads it); the React `key` must be the row id. Keying by index makes React reuse a DOM row when sorting changes, and inputs inside cells jump to another record.

## 4. Reset the measurement cache when the row shape changes

```tsx
useEffect(() => {
  rowVirtualizer.measure();      // column widths or row template changed
}, [columnVisibility, rowVirtualizer]);
```

Hiding a column can change row height (wrapped text). Without a re-measure, the scrollbar thumb keeps the old total and the last rows become unreachable.

## 5. Verify

1. `/run-test` — with 50 000 rows, the DOM holds roughly viewport rows + overscan (count `<tr>` in the body)
2. Scroll to the end — the last row is visible and the scrollbar bottom matches it
3. Sticky header stays visible while rows scroll under it
4. Sort the table — rows change but scroll position and cell inputs stay attached to their record
5. Hide a wide column — heights re-measure, no gap at the bottom
6. On failure → `/resolve-errors` max 3 rounds

## Pitfalls

- Making `<tbody>` the scroll element → it has no height; nothing virtualizes.
- Absolute-positioned rows inside a `<table>` → broken column alignment and a collapsed table.
- Keying rows by index → sorting or filtering re-parents inputs and selections to the wrong record.
- No spacer rows → the scrollbar is sized by the ~20 rendered rows, so the list ends at row 20.
- Forgetting `measure()` after a layout change → stale heights, a jumpy scrollbar, and unreachable rows.

## Related

- `references/apis.md`
- `best-practices/tanstack-virtual.md`
- `usecases/virtualize-long-list.md`
- `usecases/two-dimensional-grid.md`
