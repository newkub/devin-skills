# Use Case — Infinite Scroll Feed on Window Scroll

> Load the next page when the tail item appears, without duplicate requests or a scroll jump. Source: https://tanstack.com/virtual/latest (accessed 2026-10-20)

## 1. Virtualize against the window

```tsx
// src/Feed.tsx
import { useWindowVirtualizer } from "@tanstack/react-virtual";

export function Feed({ items }: { items: Post[] }) {
  const virtualizer = useWindowVirtualizer({
    count: items.length,
    estimateSize: () => 180,
    overscan: 4,
  });

  return (
    <div style={{ height: virtualizer.getTotalSize(), position: "relative" }}>
      {virtualizer.getVirtualItems().map((item) => (
        <div
          key={item.key}
          data-index={item.index}
          ref={virtualizer.measureElement}
          style={{ position: "absolute", top: 0, width: "100%", transform: `translateY(${item.start}px)` }}
        >
          <PostCard post={items[item.index]} />
        </div>
      ))}
    </div>
  );
}
```

`useWindowVirtualizer` reads `window` scroll instead of a container. Using `useVirtualizer` with `document.body` as the scroll element measures zero height and renders nothing.

## 2. Trigger the next page from the tail item

```tsx
const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
  queryKey: ["feed"],
  queryFn: ({ pageParam }) => api.feed(pageParam),
  initialPageParam: 0,
  getNextPageParam: (last) => last.nextCursor ?? undefined,
});

const items = data?.pages.flatMap((p) => p.items) ?? [];

useEffect(() => {
  const tail = virtualizer.getVirtualItems().at(-1);
  if (!tail) return;
  if (tail.index >= items.length - 1 && hasNextPage && !isFetchingNextPage) {
    void fetchNextPage();
  }
}, [virtualizer.getVirtualItems(), items.length, hasNextPage, isFetchingNextPage]);
```

The `isFetchingNextPage` guard is what prevents the effect from firing on every render while a request is in flight. Without it a single scroll to the bottom can queue a dozen pages.

## 3. Keep measurement honest for variable cards

Cards with images grow after the image decodes. `measureElement` re-measures on resize, so the list corrects itself — provided each card's container does not animate its height. An animated height makes the feed crawl as every measurement triggers a re-layout.

## 4. Handle the append moment

1. Prepend/append must not reset scroll: appending grows the bottom, which is safe; prepending (a "new posts" banner) shifts everything and needs `scrollToIndex`
2. Keep `getNextPageParam` truthful — returning a cursor forever loops the feed
3. Show a skeleton block sized like a real card, so the scrollbar does not jump when the page lands

## 5. Verify

1. `/run-test` — assert one request per tail reach, not per render
2. Scroll to the bottom twice quickly — the request count must stay at one per page
3. Open a page with images, scroll back up — no overlap or clipped cards after decode
4. Reduce to the last page — the tail trigger must stop firing
5. On failure → `/resolve-errors` max 3 rounds

## Pitfalls

- Triggering on `window.scrollY` math instead of the virtual tail index, which fires before rows exist and pages in empty state.
- Missing `isFetchingNextPage` in the guard, producing duplicate page fetches that append the same items twice.
- A `key` derived from the index while new pages append, causing every card to remount on each fetch.
- Infinite `getNextPageParam` on the server's last page, so the feed never stops asking.

## Related

- `references/apis.md`
- `best-practices/tanstack-virtual.md`
- `usecases/virtualize-long-list.md`
