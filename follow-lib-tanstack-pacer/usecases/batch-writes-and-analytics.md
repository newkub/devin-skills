# Use Case — Collapse Rapid Events Into One Batch

> Turn a stream of keystroke rows, clicks, or analytics events into a bounded number of calls, flushed by size or by time. Source: https://tanstack.com/pacer/latest (accessed 2026-10-20)

## 1. Batch one handler at the call site

```tsx
// src/analytics/useTrackEvent.ts
import { useBatcher } from "@tanstack/react-pacer";

export function useTrackEvent() {
  const send = useBatcher(
    (events: TrackEvent[]) => {
      void navigator.sendBeacon("/api/events", JSON.stringify({ events }));
    },
    { wait: 2000, maxSize: 20 },
  );

  return (event: TrackEvent) => send.addItem(event);
}
```

Two triggers, whichever fires first: 20 queued events, or 2 s since the first one. A page that produces one event per second still delivers within 2 s instead of waiting for a batch that never fills.

## 2. Make the flush call idempotent

```ts
export async function postEvents(events: TrackEvent[]) {
  if (events.length === 0) return;
  await fetch("/api/events", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ events }),
    keepalive: true,          // survives the page being unloaded
  });
}
```

The batcher may flush on unmount, on visibility change, and on size. A handler that appends rather than upserts will duplicate rows when two flushes race.

## 3. Flush the tail when the page goes away

```tsx
useEffect(() => {
  const onHidden = () => { if (document.visibilityState === "hidden") send.flush(); };
  document.addEventListener("visibilitychange", onHidden);
  return () => document.removeEventListener("visibilitychange", onHidden);
}, [send]);
```

Without this, the last events of a session — exactly the ones that explain why the user left — sit in the queue when the tab closes.

## 4. Batch writes, not reads

```ts
// ✅ one storage/network write for a burst of edits
const commit = useBatcher((rows: Row[]) => api.upsertMany(rows), { wait: 500, maxSize: 50 });

// ❌ batching a read the UI waits on
const load = useBatcher((ids: string[]) => api.fetchMany(ids), { wait: 500 });
```

A batched read adds up to `wait` latency to an interaction that needs data now. Batch the writes; debounce or prefetch the reads. `maxSize` above the server's per-request limit makes the batch its own 413 — cap it at the limit.

## 5. Verify

1. `/run-test` with fake timers — 25 `addItem` calls produce two calls of 20 and 5
2. One event, then advance 2 s — one call with one event (time trigger works)
3. Hide the tab — the queue flushes once; the same flush does not repeat on `pagehide`
4. Server receives `events.length <= maxSize` and no duplicate ids
5. On failure → `/resolve-errors` max 3 rounds

## Pitfalls

- Batching UI state that must render immediately → the screen lags by `wait`; batch the side effect, not the render.
- No `maxSize` → a burst of 500 events becomes one 500-item request and a payload limit error.
- Fire-and-forget fetch without `keepalive` → the request is cancelled when the page unloads, losing the last batch.
- Batching per component instance → ten mounted widgets, ten batchers, no batching.
- Assuming a flush means success → no retry policy, so a 500 silently drops the batch; log the count.

## Related

- `references/apis.md`
- `best-practices/tanstack-pacer.md`
- `usecases/rate-limit-and-queue.md`
- `usecases/flush-and-cancel-on-unmount.md`
