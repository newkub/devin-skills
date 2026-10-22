# Use Case — Two-Dimensional Grid With Frozen Header Row

> Virtualize rows and columns of a wide grid at once, keeping the header row and first column visible as the user scrolls both axes. Source: https://tanstack.com/virtual/latest/docs/introduction (accessed 2026-10-20)

## 1. Two virtualizers, one scroll element

```tsx
const parentRef = useRef<HTMLDivElement>(null);

const rowVirtualizer = useVirtualizer({
  count: rows.length,
  getScrollElement: () => parentRef.current,
  estimateSize: () => 32,
  overscan: 10,
});

const columnVirtualizer = useVirtualizer({
  horizontal: true,
  count: columns.length,
  getScrollElement: () => parentRef.current,
  estimateSize: (i) => columns[i].width,
  overscan: 3,
});
```

Both read the same scroll container. Two separate containers means vertical scroll does not move the columns and the grid shears.

## 2. Layout items from both lists

```tsx
const items = rowVirtualizer.getVirtualItems();
const cols = columnVirtualizer.getVirtualItems();

<div ref={parentRef} style={{ height: 520, overflow: "auto", contain: "strict" }}>
  <div
    style={{
      height: rowVirtualizer.getTotalSize(),
      width: columnVirtualizer.getTotalSize(),
      position: "relative",
    }}
  >
    {items.map((rowItem) =>
      cols.map((colItem) => {
        const row = rows[rowItem.index];
        const col = columns[colItem.index];
        return (
          <div
            key={`${row.id}:${col.id}`}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: colItem.size,
              height: rowItem.size,
              transform: `translate(${colItem.start}px, ${rowItem.start}px)`,
            }}
          >
            {col.render(row)}
          </div>
        );
      }),
    )}
  </div>
</div>
```

`translate(x, y)` on a shared absolutely-positioned container is what keeps a 2D grid to one composited layer per cell instead of fighting table layout.

## 3. Freeze the header and the first column

```tsx
// header row: sticky to the top, shifts horizontally with the columns
<div style={{ position: "sticky", top: 0, zIndex: 2, display: "flex", transform: `translateX(${columnVirtualizer.scrollOffset ?? 0}px)` }}>
  {cols.map((c) => <div key={c.key} style={{ width: c.size }}>{columns[c.index].header}</div>)}
</div>

// first column: sticky left, shifts vertically with the rows
<div style={{ position: "sticky", left: 0, zIndex: 1, transform: `translateY(${rowVirtualizer.scrollOffset ?? 0}px)` }}>
```

Sticky-position a header *outside* the virtualized body but inside the same scroll container; it then stays put while the body translates. `scrollOffset` keeps it aligned with the virtual columns.

## 4. Cap the work per frame

```tsx
const virtualizer = useVirtualizer({
  count: rows.length,
  getScrollElement: () => parentRef.current,
  estimateSize: () => 32,
  overscan: 10,
  isScrollingResetDelay: 150,     // stop "isScrolling" state churn after a pause
  useScrollendEvent: true,        // where supported — fewer scroll callbacks
});
```

A 200 × 40 grid renders ~2 000 cells at rest; overscan 30 renders 5 000 and the first scroll frame drops. Overscan is a latency/CPU trade, and 3–10 columns is the useful range.

## 5. Verify

1. Scroll vertically — the header row stays and the first column does not move horizontally
2. Scroll diagonally — cells move together, no gap or overlap between the sticky parts and the body
3. `/run-test` — DOM cell count ≈ (visible rows + 2×overscan) × (visible cols + 2×overscan)
4. Resize the container — the column virtualizer re-measures and the grid fills the new width
5. Profile a scroll — no long tasks; draw count stays flat
6. On failure → `/resolve-errors` max 3 rounds

## Pitfalls

- Two scroll containers (one per axis) → the grid shears as you scroll.
- Missing `contain: strict` (or fixed width/height) on the inner spacer → the total-size div collapses and the scrollbar disappears.
- Sticky header inside the translated body → it moves with the content and vanishes.
- Overscan tuned for rows applied to both axes → cell count explodes in a 2D grid.
- `key={index}` per cell → React reuses cells across different columns after a column is hidden, showing one column's data in another's slot.

## Related

- `references/apis.md`
- `best-practices/tanstack-virtual.md`
- `usecases/table-rows-with-sticky-header.md`
- `usecases/virtualize-long-list.md`
