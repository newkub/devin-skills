# Use Case — Selector Granularity in React

> Keep a store with a dozen slices from re-rendering every subscriber, and prove it with a render counter instead of hoping. Source: https://tanstack.com/store/latest (accessed 2026-10-20)

## 1. Always pass a selector

```tsx
// ❌ subscribes to the whole state — re-renders on every write anywhere
const state = useStore(uiStore);

// ✅ one primitive
const theme = useStore(uiStore, (s) => s.theme);
```

The second argument is not optional in practice: `useStore(store)` returns the full state object, whose identity changes on every `setState`, so every consumer re-renders.

## 2. One selector per displayed value

```tsx
function Toolbar() {
  const theme = useStore(uiStore, (s) => s.theme);            // string
  const count = useStore(uiStore, (s) => s.selectedIds.length); // number
  return <><ThemeToggle value={theme} /><span>{count} selected</span></>;
}
```

Two selectors, two primitive results. A single selector returning `{ theme, count }` allocates a new object per notification and defeats the equality check — the exact bug people blame on the library.

## 3. Derive lists outside the selector

```tsx
const ids = useStore(uiStore, (s) => s.selectedIds);          // stable array reference
const items = useMemo(() => ids.map((id) => byId.get(id)!), [ids, byId]);
```

A selector that calls `.map()` returns a new array on every notification. Select the source array, derive with `useMemo` keyed on it.

## 4. Batch writes that belong together

```ts
import { batch } from "@tanstack/react-store";

batch(() => {
  uiStore.setState((s) => ({ ...s, sidebarOpen: false }));
  filtersStore.setState((s) => ({ ...s, query: "" }));
});
```

Two stores written in one user gesture notify once. Without `batch`, components subscribed to both render twice in the same frame.

## 5. Prove it with a counter

```tsx
function RenderProbe({ label }: { label: string }) {
  const renders = useRef(0);
  renders.current++;
  const value = useStore(uiStore, (s) => s.theme);
  return <output data-testid={label}>{`${label}:${renders.current}:${value}`}</output>;
}
```

1. `/run-test` — change `sidebarOpen`; the probe watching `theme` keeps its render count
2. Change `theme`; the same probe increments once
3. Write two stores in `batch` — the component reading both renders once
4. Select an array and mutate it elsewhere — the render count does not change (same reference)
5. On failure → `/resolve-errors` max 3 rounds

## Pitfalls

- `useStore(store)` with no selector → every subscriber renders on every write; the most common performance bug with this library.
- Selector returning an object or array literal → new reference every time, so nothing bails out.
- Reading `store.state` inside render → not reactive; the component shows stale data until something else re-renders it.
- Copying the selected value into `useState` and syncing with an effect → one extra render per change and a window of stale UI.
- Creating the store inside the component → a new store per mount; subscribers never share state.

## Related

- `references/apis.md`
- `best-practices/tanstack-store.md`
- `usecases/derived-selectors-and-subscriptions.md`
- `usecases/async-actions-and-status.md`
