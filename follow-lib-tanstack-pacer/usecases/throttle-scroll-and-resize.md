# Use Case — Throttle Scroll and Resize Work

> Keep a scroll-linked header and a resize-driven layout at one update per frame window, with no listener storm and no stale measurement. Source: https://tanstack.com/pacer/latest (accessed 2026-10-20)

## 1. Throttle the effect, not the event

```tsx
// src/layout/useScrollProgress.ts
import { useThrottledCallback } from "@tanstack/react-pacer";

export function useScrollProgress() {
  const [progress, setProgress] = useState(0);

  const measure = useThrottledCallback(
    () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? window.scrollY / max : 0);
    },
    { wait: 100, leading: true },   // leading: paint the first frame immediately
  );

  useEffect(() => {
    window.addEventListener("scroll", measure, { passive: true });
    return () => window.removeEventListener("scroll", measure);
  }, [measure]);

  return progress;
}
```

`leading: true` matters for scroll: without it the progress bar only moves after the first 100 ms of scrolling, which reads as lag. The trailing call still lands the final position.

## 2. Resize: throttle, then measure once on mount

```tsx
export function useColumns() {
  const recompute = useThrottledCallback(() => {
    const width = containerRef.current?.clientWidth ?? 0;
    setColumns(Math.max(1, Math.floor(width / 280)));
  }, { wait: 150 });

  useEffect(() => {
    recompute();                                   // initial measurement, no event fired
    const ro = new ResizeObserver(recompute);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [recompute]);

  return columns;
}
```

`ResizeObserver` already batches per frame; throttling on top is for the work that follows (layout, state, chart re-render). Without the initial call the first paint uses the default count.

## 3. Read the DOM inside the throttled function

```ts
// ✅ one layout read per window
const onScroll = useThrottledCallback(() => setVisible(el.getBoundingClientRect().top < 0), { wait: 100 });

// ❌ a read behind every scroll event, then a setState with the same value
useEffect(() => {
  const handler = () => setVisible(el.getBoundingClientRect().top < 0);
  window.addEventListener("scroll", handler);
  return () => window.removeEventListener("scroll", handler);
}, []);
```

Reading and writing in the same throttled tick keeps measurement and state consistent; interleaving them across unthrottled events causes layout thrash and flicker.

## 4. Compare throttle with debounce before choosing

| Gesture | Tool | Why |
|---|---|---|
| Scroll progress bar | throttle 100 ms | continuous feedback while scrolling |
| "Save layout" after resize ends | debounce 200 ms | the user is done resizing |
| Mouse-follow tooltip | throttle 16–50 ms | smooth but capped |
| Fetch suggestions | debounce 300 ms | one request for the finished query |

Throttling a search box gives a request every 100 ms — that is the wrong tool, not a tuning problem.

## 5. Verify

1. `/run-test` with fake timers — fire 10 scroll events inside one window and assert one call
2. Scroll fast, then stop — the progress value ends at the true position (trailing call not lost)
3. Unmount — no listener and no pending callback (no "setState on unmounted component")
4. Resize the container — column count updates once per window, initial value is correct before any resize
5. On failure → `/resolve-errors` max 3 rounds

## Pitfalls

- Throttling without `leading` → the first frame of a scroll gesture looks frozen.
- `passive: true` missing on scroll/touch listeners → the browser waits on your handler and scrolling stutters.
- Creating the throttled callback inside the effect body on each run → a new instance per render, so the throttle window resets constantly.
- Measuring inside the event and writing outside the throttled callback → a layout read per event, then a state update per event anyway.
- Using `scroll` to drive a value a CSS `animation-timeline` could handle → needless JS on the main thread.

## Related

- `references/apis.md`
- `best-practices/tanstack-pacer.md`
- `usecases/debounce-search-input.md`
- `usecases/batch-writes-and-analytics.md`
