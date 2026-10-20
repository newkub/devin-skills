# Use Case — Debounce a Search Input

> Fire one request after the user stops typing, and never paint a stale result. Source: https://tanstack.com/pacer/latest (accessed 2026-10-20)

## 1. Install the React adapter

```bash
bun add @tanstack/react-pacer
```

`@tanstack/pacer` is the framework-agnostic core; the hooks live in the adapter for the framework in use.

## 2. Debounce the call, not the value

```tsx
// src/SearchBox.tsx
import { useRef, useState } from "react";
import { useDebouncedCallback } from "@tanstack/react-pacer";

export function SearchBox() {
  const [results, setResults] = useState<Result[]>([]);
  const seq = useRef(0);

  const search = useDebouncedCallback(
    (query: string) => {
      const id = ++seq.current;
      api.search(query).then((data) => {
        // Drop a response that a newer keystroke already superseded
        if (id === seq.current) setResults(data);
      });
    },
    { wait: 300 },
  );

  return <input onChange={(e) => search(e.target.value)} aria-label="Search" />;
}
```

The debounce controls how often the request leaves. The sequence guard controls what paints. Debouncing alone still lets a slow first response land after a fast second one.

## 3. Choose the edge deliberately

| Need | Option |
|------|--------|
| fire after the user pauses (default) | `trailing` |
| fire on the first keystroke, then wait | `leading: true` |
| both ends | `leading: true` with trailing kept on |

A search box wants trailing. A "save draft" button wants leading so the first click feels instant.

## 4. Feed a value instead of a callback when the UI needs it

```tsx
const [query, setQuery] = useDebouncedState("", { wait: 300 });
```

`useDebouncedState` gives a debounced value for rendering. Use it when the debounced string drives a query hook; keep `useDebouncedCallback` when the debounced thing is an API call.

## 5. Test with fake timers

```ts
vi.useFakeTimers();

search("a");
search("ab");
vi.advanceTimersByTime(299);
expect(api.search).not.toHaveBeenCalled();

vi.advanceTimersByTime(1);
expect(api.search).toHaveBeenCalledTimes(1);
expect(api.search).toHaveBeenCalledWith("ab");
```

1. `/run-test` — assert the trailing call carries the last value
2. Add a leading-edge test as a separate case; do not mix edges in one assertion
3. Type a query, unmount, advance timers — no call must fire (the hook cancels on unmount)
4. On failure → `/resolve-errors` max 3 rounds

## Pitfalls

- `wait: 0` or `wait: 50` on a search box, which debounces in name only and keeps the request rate at keystroke speed.
- Creating the debounced callback inside a render without a stable identity, so the internal timer resets every keystroke and nothing ever fires.
- Debouncing the submit button, which makes a deliberate click feel broken.
- Skipping the sequence guard because "the API is fast", then shipping stale results on a slow network.

## Related

- `references/apis.md`
- `best-practices/tanstack-pacer.md`
- `usecases/rate-limit-and-queue.md`
