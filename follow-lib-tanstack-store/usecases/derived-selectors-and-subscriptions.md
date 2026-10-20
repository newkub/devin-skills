# Use Case — Derived State and Slice Selectors

> Compute totals once with `Derived` and let components subscribe to a single slice so an unrelated update does not re-render them. Source: https://tanstack.com/store/latest/docs/reference/classes/Derived (accessed 2026-10-20)

## 1. The store holds raw state only

```ts
// src/stores/cart.ts
import { Store, Derived } from "@tanstack/store"

type Cart = { items: { sku: string; price: number; qty: number }[] }

export const cartStore = new Store<Cart>({ items: [] })
```

Never store a computed value (`total`, `count`) — it becomes a second source of truth that drifts.

## 2. Derive, then mount

```ts
export const cartCount = new Derived({
  fn: () => cartStore.state.items.reduce((n, i) => n + i.qty, 0),
  deps: [cartStore],
})

export const cartTotal = new Derived({
  fn: () => cartStore.state.items.reduce((sum, i) => sum + i.price * i.qty, 0),
  deps: [cartStore],
})

cartCount.mount()
cartTotal.mount()
```

`mount()` is not optional: an unmounted `Derived` never recomputes and keeps its initial value.

## 3. Subscribe to a slice in components

```tsx
import { useStore } from "@tanstack/react-store"

function CartBadge() {
  const count = useStore(cartStore, (s) => s.items.length)   // only items.length changes re-render
  const total = useStore(cartTotal, (t) => t)                // or read a derived store directly
  return <span>{count} items · {total.toFixed(2)}</span>
}
```

A selector returning a primitive is compared by value; returning a new object every call re-renders on every store update.

## 4. Outside the UI

```ts
const unsubscribe = cartStore.subscribe(() => {
  analytics.track("cart_changed", { count: cartCount.state })
})
```

`cartStore.state` is a synchronous read — fine in event handlers and server code, invisible to React rendering.

## Pitfalls

- Forgetting `.mount()` → derived values stay frozen at `0`.
- Storing derived values back into the store → update loops and drift.
- `useStore(store, (s) => ({ a: s.a }))` → new object identity on every update; select primitives or combine with `useMemo`-style equality.
- Putting server data in a `Store` → it has no cache/refetch; use TanStack Query for server state.

## Related

- `references/apis.md`
- `usecases/batched-actions-and-side-effects.md`
