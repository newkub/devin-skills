# Use Case — Derived Collections (Materialized Views)

> Persist a live query as a reusable collection you can subscribe to, join, and read outside a component. Source: https://tanstack.com/db/latest/docs/guides/live-queries, /docs/overview (accessed 2026-10-20)

## 1. Why a derived collection

Every live query is itself a collection. `createLiveQueryCollection` materializes one so multiple components/consumers share it, or so you can read/join it outside React. The optimizer reuses the same incremental dataflow graph.

## 2. Create one (outside the component lifecycle)

```ts
import { createLiveQueryCollection, eq } from '@tanstack/db'

export const activeTodos = createLiveQueryCollection({
  startSync: true,                 // begin subscribing immediately
  query: (q) =>
    q
      .from({ todo: todoCollection })
      .where(({ todo }) => eq(todo.completed, false))
      .orderBy(({ todo }) => todo.created_at, 'asc'),
})

// read synchronously (non-reactive snapshot)
const rows = activeTodos.toArray
```

- `startSync: true` starts the subscription now; otherwise you must manage its lifecycle yourself.
- The result is a normal collection — pass it to `useLiveQuery`, `.join(...)` it, or aggregate over it.

## 3. Reuse in components

```tsx
import { useLiveQuery } from '@tanstack/react-db'
import { activeTodos } from './collections/derived'

const { data } = useLiveQuery((q) => q.from({ todo: activeTodos }))
```

Because both views read the same derived collection, they share the incremental result instead of each re-deriving.

## 4. Chain a view on top (derived-from-derived)

```ts
export const activeTodosByList = createLiveQueryCollection({
  startSync: true,
  query: (q) =>
    q
      .from({ todo: activeTodos })       // query the derived collection
      .join({ list: listCollection }, ({ todo, list }) => eq(list.id, todo.list_id), 'inner')
      .select(({ todo, list }) => ({ id: todo.id, listName: list.name })),
})
```

## 5. Subqueries / nested collections

A live query can embed another query as a column (project → issues), and that nested result is also reactive. To render it, pass it into a child that subscribes — reading `.issues` in the parent won't re-render on child change.

## 6. Lifecycle rules

| Option | Behavior |
|---|---|
| `startSync: true` | subscription begins on creation; the collection is live immediately |
| omit `startSync` | you own start/stop — call subscribe/cleanup yourself |

- `useLiveQuery` manages subscriptions automatically on mount/unmount — prefer it in components; use `createLiveQueryCollection` when the derived view must outlive a component (module-level selector, shared across routes, non-React consumers).

## Pitfalls

- Creating a derived collection inside a render/component → a new collection each render, subscriptions leak; define it at module scope.
- Forgetting `startSync: true` on a module-level derived collection → reads as empty until something subscribes.
- Re-deriving the same query in several components instead of sharing one derived collection → duplicated graphs and wasted work.
- Expecting the returned object to be plain data → it's a Collection (`toArray`, subscribe), not an array.

## Related

- `references/apis.md`
- `best-practices/tanstack-db.md`
- `usecases/live-queries-joins.md`
- `usecases/aggregations.md`
