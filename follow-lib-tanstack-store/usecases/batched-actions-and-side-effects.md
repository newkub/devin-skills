# Use Case — Batched Updates and Non-UI Side Effects

> Apply several related changes as one notification, and keep persistence/analytics out of components. Source: https://tanstack.com/store/latest/docs/reference/functions/batch (accessed 2026-10-20)

## 1. Batch related writes

```ts
// src/stores/actions.ts
import { batch } from "@tanstack/store"
import { cartStore } from "./cart"
import { uiStore } from "./ui"

export function clearCartAfterCheckout() {
  batch(() => {
    cartStore.setState((s) => ({ ...s, items: [] }))
    uiStore.setState((s) => ({ ...s, cartOpen: false, banner: "Order placed" }))
  })
}
```

Two stores, one notification cycle — components never render the half-applied state (`cart empty` + `banner: null`).

## 2. Actions live beside the store, not in components

```ts
export const cartActions = {
  addItem(item: { sku: string; price: number; qty: number }) {
    cartStore.setState((s) =>
      s.items.some((i) => i.sku === item.sku)
        ? { ...s, items: s.items.map((i) => (i.sku === item.sku ? { ...i, qty: i.qty + item.qty } : i)) }
        : { ...s, items: [...s.items, item] },
    )
  },
  setQty(sku: string, qty: number) {
    cartStore.setState((s) => ({ ...s, items: s.items.map((i) => (i.sku === sku ? { ...i, qty } : i)) }))
  },
}
```

The UI calls `cartActions.addItem(...)`; the updater always returns a new object so subscribers fire exactly once.

## 3. Side effects through subscribe

```ts
// src/stores/persist.ts
import { cartStore } from "./cart"

let queued = false

cartStore.subscribe(() => {
  if (queued) return
  queued = true
  queueMicrotask(() => {                     // coalesce bursts into one write
    queued = false
    localStorage.setItem("cart", JSON.stringify(cartStore.state))
  })
})
```

## 4. Async action with rollback

```ts
export async function applyCoupon(code: string) {
  const previous = cartStore.state.coupon
  cartStore.setState((s) => ({ ...s, coupon: code }))
  try {
    await api.validateCoupon(code)
  } catch {
    cartStore.setState((s) => ({ ...s, coupon: previous }))   // revert on failure
    throw new Error("Coupon is not valid")
  }
}
```

## Pitfalls

- Mutating `state` in place (`s.items.push(x)`) → no notification, no re-render.
- `batch` around an `await` → the writes are no longer synchronous; keep `await` outside the callback.
- Persisting on every keystroke-level change → debounce or coalesce as above.
- Optimistic writes without a revert path → the UI keeps a value the server rejected.

## Related

- `references/apis.md`
- `usecases/derived-selectors-and-subscriptions.md`
