# Use Case — Async Actions With Derived Loading and Error State

> Model a request inside the store so every component reads the same status, and a failed call rolls the optimistic change back. Source: https://tanstack.com/store/latest (accessed 2026-10-20)

## 1. Put status in the state, not in each component

```ts
// src/stores/checkout.ts
import { Derived, Store } from "@tanstack/react-store";

type Status = "idle" | "saving" | "saved" | "error";

export const checkoutStore = new Store({
  items: [] as Item[],
  coupon: "",
  status: "idle" as Status,
  error: null as string | null,
});

export const isSaving = new Derived({
  fn: () => checkoutStore.state.status === "saving",
  deps: [checkoutStore],
});
isSaving.mount();
```

`status` is the single source of truth: a button, a banner, and a form field all subscribe to the same value instead of three local `useState` flags that disagree.

## 2. One action owns the transition

```ts
export async function applyCoupon(code: string) {
  checkoutStore.setState((s) => ({ ...s, status: "saving", error: null }));
  try {
    const priced = await api.applyCoupon(code);
    checkoutStore.setState((s) => ({ ...s, coupon: code, items: priced.items, status: "saved" }));
  } catch (err) {
    checkoutStore.setState((s) => ({
      ...s,
      status: "error",
      error: err instanceof Error ? err.message : "Could not apply the coupon",
    }));
  }
}
```

Components call `applyCoupon(code)` and never touch `setState` for status. When the same request is triggered from a keyboard shortcut and a button, both get identical behaviour.

## 3. Roll back the optimistic value on failure

```ts
export async function removeItem(id: string) {
  const snapshot = checkoutStore.state.items;
  checkoutStore.setState((s) => ({ ...s, items: s.items.filter((i) => i.id !== id) }));

  const result = await api.removeItem(id);
  if (!result.ok) {
    checkoutStore.setState((s) => ({ ...s, items: snapshot, status: "error", error: result.message }));
  }
}
```

Snapshot the slice before the optimistic write; restore the snapshot itself, not a reconstruction. Rebuilding "the old list" from the new data loses ordering and any server-added fields.

## 4. Render from selectors

```tsx
function CheckoutButton() {
  const saving = useStore(checkoutStore, (s) => s.status === "saving");
  const error = useStore(checkoutStore, (s) => s.error);
  return (
    <>
      <button disabled={saving}>{saving ? "Saving…" : "Place order"}</button>
      {error && <p role="alert">{error}</p>}
    </>
  );
}
```

Two narrow selectors beat one selector returning an object: an object literal is a new reference on every change, so the component re-renders for updates it does not display.

## 5. Verify

1. `/run-test` — a failing coupon call leaves `status: "error"`, `error` set, `items` unchanged
2. A failing remove restores the exact original order
3. Click the action twice while saving — one request (guard on `status === "saving"`)
4. Unrelated components do not re-render when `coupon` changes
5. `/run-typecheck` — the `Status` union rejects a typo in an action
6. On failure → `/resolve-errors` max 3 rounds

## Pitfalls

- Local `isLoading` per component → two buttons show different states for the same request.
- Clearing `error` on mount instead of on the next action → the user dismisses the message and it never comes back for a repeated failure.
- No in-flight guard → double submit creates two orders.
- A selector returning `{ saving, error }` → new object each notification, so the memo never bails out.
- Storing the `Error` object in state → serialisation, DevTools, and equality all behave worse than a message string.

## Related

- `references/apis.md`
- `best-practices/tanstack-store.md`
- `usecases/batched-actions-and-side-effects.md`
- `usecases/selector-granularity-in-react.md`
