# Use Case — Debounce and Throttle Without Leaks

> Slow down a handler at the call site, keep the type, and cancel pending work when the owner disappears. Source: https://es-toolkit.dev/reference/function/debounce.html (accessed 2026-10-20)

## 1. Debounce the search box

```ts
import { debounce } from "es-toolkit";

const search = debounce(
  async (query: string) => {
    const results = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
    render(await results.json());
  },
  300,
);

input.addEventListener("input", (event) => search(event.currentTarget.value));
```

`debounce` returns a function with the same parameters and return type, so no wrapper types are needed. The default is trailing-edge: only the final call in the quiet window runs.

For a leading-edge variant pass `{ leading: true, trailing: false }` — useful for a "save" button that should not double-fire.

## 2. Throttle the scroll handler

```ts
import { throttle } from "es-toolkit";

const onScroll = throttle(() => {
  header.dataset.stuck = String(window.scrollY > 8);
}, 100);
```

`throttle` runs at most once per window while calls continue. Use it for progress and position updates; use `debounce` when only the final state matters.

Both return a `DebouncedFunction` with `.cancel()` and `.flush()`, regardless of which one you used.

## 3. Cancel on unmount

```ts
export function onCleanup(dispose: () => void) {
  addEventListener("pagehide", dispose, { once: true });
}

onCleanup(() => search.cancel());
```

Cancelling stops the pending trailing call, which would otherwise run after the DOM node it writes to was removed. In React the cleanup is the `useEffect` return; in Vue `onScopeDispose`; in Solid `onCleanup`.

`flush()` is the opposite: run the pending call now, for a "submit before navigating" path.

## 4. Verify

1. Type ten characters quickly — one request, with the final value
2. Type, then navigate away before 300ms — no request fires
3. `/run-test` with fake timers — the trailing call runs once after the window
4. Throttled scroll: the handler runs at most ten times per second at 60fps scrolling

## Pitfalls

- Creating the debounced function inside a render, so a new timer starts on every render and nothing ever settles.
- Forgetting `.cancel()` on unmount, leaving a request that writes to a detached node.
- Debouncing an async function and awaiting its result — debounce returns the last call's result, which is often `undefined`.
- Using `throttle` for a search box, so intermediate queries still hit the API.
- A 1000ms debounce on an input that feels broken; 200–300ms is the usable range.

## Related

- `references/apis.md`
- `best-practices/es-toolkit.md`
- `usecases/async-retry-and-timeout.md`
- `usecases/group-and-aggregate-data.md`
