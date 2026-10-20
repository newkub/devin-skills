# Use Case — Nested Form State with Stores

> Edit a nested object in a form without rewriting the whole tree on every keystroke, and keep validation next to the field. Source: https://docs.solidjs.com/concepts/stores (accessed 2026-10-20)

## 1. Why a store, not a signal

A signal replacing an object re-renders every reader. `createStore` gives each path its own subscription, so typing in `billing.email` does not invalidate `shipping.*`.

```ts
import { createStore, produce } from "solid-js/store"

type Form = {
  customer: { name: string; email: string }
  items: { sku: string; qty: number }[]
}

const [form, setForm] = createStore<Form>({
  customer: { name: "", email: "" },
  items: [{ sku: "", qty: 1 }],
})
```

## 2. Path updates and reconciliation

```ts
// Update one field — only readers of customer.email re-run
setForm("customer", "email", "a@b.co")

// Array item by index
setForm("items", 0, "qty", 2)

// Append (fine-grained: existing rows keep their identity)
setForm("items", (items) => [...items, { sku: "", qty: 1 }])
```

`reconcile` is for replacing the whole object with server data — it diffs keys so untouched rows stay subscribed:

```ts
import { reconcile } from "solid-js/store"

setForm(reconcile(await res.json(), { key: "sku" }))
```

`produce` is for multi-step edits on the same draft:

```ts
setForm(produce((draft) => {
  draft.items = draft.items.filter((i) => i.qty > 0)
  draft.customer.name = draft.customer.name.trim()
}))
```

## 3. Field validation

```tsx
const errors = () => ({
  email: form.customer.email.includes("@") ? undefined : "Invalid email",
})

<input
  value={form.customer.email}
  onInput={(e) => setForm("customer", "email", e.currentTarget.value)}
  aria-invalid={errors().email ? "true" : undefined}
/>
```

Derive errors in a plain function (or `createMemo` if expensive) — never copy them into a second store.

## Pitfalls

- Spreading a store (`{...form}`) → loses granularity; pass the store or a path.
- Destructuring props/store at the top of a component → reads once, never updates; access through a getter or path.
- `setForm(reconcile(next))` without `key` on keyed arrays → rows rebuild and lose focus.
- Mixing `produce` and direct path setters on the same draft → pick one per update.

## Related

- `references/apis.md`
- `best-practices/reactivity.md`
- `usecases/async-data-with-resource.md`
