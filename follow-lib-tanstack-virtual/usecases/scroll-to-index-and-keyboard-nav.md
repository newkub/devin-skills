# Use Case — Keyboard Navigation and Scroll-To-Index

> Move a focused item through a 10k-row virtual list with arrow keys, keep it visible, and let a route change jump to a deep link without breaking recycling. Source: https://tanstack.com/virtual/latest/docs/api/virtualizer (accessed 2026-10-20)

## 1. Own the active index in state

```tsx
const [active, setActive] = useState(0);
const virtualizer = useVirtualizer({
  count: items.length,
  getScrollElement: () => parentRef.current,
  estimateSize: () => 40,
  overscan: 8,
});
```

The virtualizer renders a window; it does not know which row the user considers "current". `active` is that knowledge, and it must survive scrolling out of the window.

## 2. Move and keep it in view

```tsx
function onKeyDown(e: React.KeyboardEvent) {
  if (e.key === "ArrowDown") { e.preventDefault(); move(active + 1); }
  if (e.key === "ArrowUp")   { e.preventDefault(); move(active - 1); }
  if (e.key === "Home")      { e.preventDefault(); move(0); }
  if (e.key === "End")       { e.preventDefault(); move(items.length - 1); }
}

function move(next: number) {
  const clamped = Math.max(0, Math.min(next, items.length - 1));
  setActive(clamped);
  virtualizer.scrollToIndex(clamped, { align: "auto" });   // "auto" scrolls only when out of view
}
```

`align: "auto"` scrolls only when the item is outside the viewport. Using `align: "start"` on every keypress makes the list jump so the active row sits at the top even when it was already visible.

## 3. Render the active row without losing focus

```tsx
<div role="listbox" tabIndex={0} onKeyDown={onKeyDown} aria-activedescendant={`row-${active}`}>
  {virtualizer.getVirtualItems().map((vi) => (
    <div
      key={items[vi.index].id}
      id={`row-${vi.index}`}
      role="option"
      aria-selected={vi.index === active}
      data-active={vi.index === active}
      style={{ transform: `translateY(${vi.start}px)`, position: "absolute", top: 0 }}
    >
      {items[vi.index].label}
    </div>
  ))}
</div>
```

`aria-activedescendant` keeps DOM focus on the listbox while the active row is only a visual state — so recycling can unmount the row and focus is not lost.

## 4. Deep-link into the list

```tsx
useEffect(() => {
  if (!initialId) return;
  const index = items.findIndex((i) => i.id === initialId);
  if (index < 0) return;
  setActive(index);
  virtualizer.scrollToIndex(index, { align: "center" });
}, [initialId, items, virtualizer]);
```

Jump after the items are known, not on mount. A `scrollToIndex` before the count updates is a no-op, and the user lands at the top of the list with the URL pointing at row 4 231.

## 5. Verify

1. `/run-test` — ArrowDown from the last visible row scrolls by one row; the active row is visible
2. Hold ArrowDown for 50 rows — no jump-to-top, scroll stays smooth, DOM count stays bounded
3. Scroll away with the mouse, press ArrowDown — the active row scrolls back into view (it was never unmounted as state)
4. Open a deep link to an item at index 4 000 — the list scrolls to it, centered, with the correct active state
5. `/run-typecheck` — `scrollToIndex` options and item types check
6. On failure → `/resolve-errors` max 3 rounds

## Pitfalls

- Making every row a focusable element → 10k tab stops and a Tab key that never leaves the list; one focusable container plus `aria-activedescendant`.
- `scrollToIndex(i)` with `align: "start"` on every keypress → the list jumps on each arrow key.
- Tracking the active row by DOM focus → the row unmounts when recycled and focus falls back to `body`.
- Calling `scrollToIndex` during the first render → the virtualizer has no measurement yet and the call is dropped.
- Using the array index as identity when the list is filtered → the deep link scrolls to a different item after a filter change.

## Related

- `references/apis.md`
- `best-practices/tanstack-virtual.md`
- `usecases/virtualize-long-list.md`
- `usecases/table-rows-with-sticky-header.md`
