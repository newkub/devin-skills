# Use Case — Cap an API Quota and Process an Upload Queue

> Limit calls per window, then run the allowed work with bounded concurrency. Source: https://tanstack.com/pacer/latest (accessed 2026-10-20)

## 1. Pick the semantics before the tool

| Requirement | Tool |
|-------------|------|
| at most 1 call per 100ms | throttle |
| at most 5 calls per minute, drop the rest | rate limiter |
| process every item, few at a time | queuer |
| collapse 50 events into one write | batcher |

A login-attempt guard and an upload queue are not the same problem, and neither is a debounce.

## 2. Rate-limit the call in the component

```tsx
// src/InviteButton.tsx
import { useRateLimiter } from "@tanstack/react-pacer";

export function InviteButton({ email }: { email: string }) {
  const send = useRateLimiter((value: string) => api.invite(value), {
    limit: 5,
    window: 60_000,
  });

  return (
    <button onClick={() => send(email)} disabled={!send.getRemainingInWindow()}>
      Send invite
    </button>
  );
}
```

`limit` is a hard cap inside `window`, so the sixth call in the minute is dropped, not delayed. Surface that state in the UI — a silently ignored click reads as a broken button.

## 3. Rate-limit + queue outside React

```ts
// src/upload.ts
import { Queuer, RateLimiter } from "@tanstack/pacer";

const limiter = new RateLimiter((file: File) => api.upload(file), {
  limit: 3,
  window: 1000,
});

const queue = new Queuer((file: File) => limiter.maybeExecute(file), {
  concurrency: 2,
  started: true,
});

export function enqueue(file: File) {
  queue.addItem(file);
}

export function pending() {
  return queue.getAllItems();
}
```

`concurrency: 2` keeps two uploads in flight while the limiter enforces the request rate. Two independent limits, both applied — that is the composition worth having.

## 4. Clean up the core classes

Hooks cancel themselves on unmount. Core classes do not:

```ts
queue.stop();
limiter.cancel();
```

Call both from the module teardown or a `beforeunload`-style cleanup. A stopped queue that still holds items is a leak the next test run will report as a stray network call.

## 5. Test counts, not vibes

```ts
vi.useFakeTimers();

for (let i = 0; i < 8; i++) limiter.maybeExecute({ id: i } as never);
expect(api.upload).toHaveBeenCalledTimes(3); // limit 3 per window

vi.advanceTimersByTime(1000);
```

1. `/run-test` — assert call counts inside and after the window
2. Queue: enqueue 5 items with `concurrency: 2`, assert at most 2 in flight
3. Batch: assert one write after `maxSize` items or after the wait
4. On failure → `/resolve-errors` max 3 rounds

## Pitfalls

- Using debounce for a quota requirement — debounce bounds the rate of *input*, not the count per window.
- A limiter whose `window` is shorter than the provider's real refill window, so the server still returns 429.
- Queuing without a concurrency bound, turning a backlog into a thundering herd.
- Showing a spinner per click while the limiter silently drops calls; show remaining budget instead.

## Related

- `references/apis.md`
- `best-practices/tanstack-pacer.md`
- `usecases/debounce-search-input.md`
