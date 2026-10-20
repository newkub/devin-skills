# Use Case — Virtualize a Long List

> Render 10k rows with a bounded DOM and no scrollbar jump while sizes are measured. Source: https://tanstack.com/virtual/latest (accessed 2026-10-20)

## 1. Install the adapter

```bash
bun add @tanstack/react-virtual
```

Solid/Vue/Svelte have their own adapters with the same options object.

## 2. Give the scroll container a real height

```tsx
// src/UserList.tsx
import { useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";

export function UserList({ users }: { users: User[] }) {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: users.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 44,
    overscan: 6,
  });

  return (
    <div ref={parentRef} className="h-[480px] overflow-auto">
      <div style={{ height: virtualizer.getTotalSize(), position: "relative" }}>
        {virtualizer.getVirtualItems().map((item) => (
          <div
            key={item.key}
            data-index={item.index}
            ref={virtualizer.measureElement}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              transform: `translateY(${item.start}px)`,
            }}
          >
            {users[item.index].name}
          </div>
        ))}
      </div>
    </div>
  );
}
```

A container without a fixed height expands to fit all rows, so every item is "in view" and nothing is virtualized. The list looks correct and scrolls badly — the classic silent failure.

## 3. Size the estimate from a real row

`estimateSize` sets the initial scrollbar math. Measure one rendered row and use that number. An estimate that is 3× off makes the scrollbar jump once measurement catches up, and the jump grows with item count.

## 4. Keep keys and measurement correct

1. `key={item.key}` — never `item.index` when the list filters or reorders
2. `data-index` on the measured element, or `measureElement` cannot map a DOM node back to an item
3. No margin on the items; use the `gap` or `paddingStart` option instead, which the virtualizer accounts for

## 5. Verify DOM size, not just smoothness

1. `/run-typecheck` + `/run-test`
2. Render 10k items and count the row nodes — the count must stay near viewport rows + overscan
3. Change a row to wrap onto two lines and scroll — no overlap, no gap, no scrollbar jump
4. Filter the list to 10 items — the container must still size correctly and the last item must be reachable
5. On failure → `/resolve-errors` max 3 rounds

## Pitfalls

- Virtualizing a 40-row list, adding complexity for a scroll that was already fine.
- Absolute positioning without `left: 0; width: 100%`, so measured widths collapse and text wraps differently than the estimate.
- Measuring with `measureElement` but forgetting `data-index`, which leaves every row at the estimate.
- Recreating `getScrollElement` as a new arrow each render inside a memo boundary, detaching the virtualizer from the container.

## Related

- `references/apis.md`
- `best-practices/tanstack-virtual.md`
- `usecases/infinite-scroll-feed.md`
