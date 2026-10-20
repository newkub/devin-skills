# Use Case — Responsive UI with Transitions and Deferred Values

> Keep typing instant while a heavy list re-renders, and mark non-urgent updates so React can interrupt them. Source: https://react.dev/reference/react/useDeferredValue (accessed 2026-10-20)

## 1. Defer an expensive derived list

```tsx
"use client"
import { useDeferredValue, useState } from "react"

export function Search({ items }: { items: Item[] }) {
  const [query, setQuery] = useState("")
  const deferred = useDeferredValue(query)          // lags behind, never blocks typing
  const filtered = items.filter(i => i.name.includes(deferred))
  return (
    <>
      <input value={query} onChange={e => setQuery(e.target.value)} />
      <ul style={{ opacity: query !== deferred ? 0.5 : 1 }}>
        {filtered.map(i => <li key={i.id}>{i.name}</li>)}
      </ul>
    </>
  )
}
```

## 2. `useTransition` for navigation-like updates

```tsx
const [isPending, startTransition] = useTransition()

function selectTab(id: string) {
  startTransition(() => setTab(id))   // React may interrupt or discard this render
}
```

Use it when the next UI is expensive and the current one must stay interactive.

## 3. Let the React Compiler handle memoization

With the compiler enabled, drop hand-written `useMemo`/`useCallback` for plain derivations. Keep `useMemo` only when referential identity is a dependency of another Hook, or the computation is genuinely expensive.

## Pitfalls

- Wrapping the controlled-input `setState` in `startTransition` → the input becomes laggy; transition the expensive result, not the keystroke.
- Passing a second argument to `useDeferredValue` expecting it to seed every render → it only applies to the initial render.
- Hand-memoizing everything next to the compiler → redundant work plus stale dependency bugs.
- Profiling a dev build → React is much slower there; measure the production build.

## Related

- `references/apis.md`
- `usecases/data-fetching-with-suspense.md`
- `usecases/forms-with-server-actions.md`
