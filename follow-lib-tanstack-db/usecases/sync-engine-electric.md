# Use Case — Real-Time Sync Engine (ElectricSQL)

> Multi-user collaborative data: Postgres rows stream to every client as they change — no WebSocket plumbing, no manual cache invalidation. Source: https://tanstack.com/db/latest/docs/collections/electric-collection, /docs/overview (accessed 2026-10-20)

## 1. What the sync engine buys you

- Real-time updates — write to Postgres, changes stream to all clients automatically.
- Cascade sync — a mutation that touches several tables syncs all affected rows; no hand-written invalidation.
- Delta updates — only changed rows cross the wire, so loading large datasets client-side is practical (the Linear/Figma "load everything once" feel).

## 2. Create the collection

```ts
import { createCollection } from '@tanstack/react-db'
import { electricCollectionOptions } from '@tanstack/electric-db-collection'

export const todosCollection = createCollection(
  electricCollectionOptions({
    id: 'todos',
    schema: todoSchema,
    getKey: (item) => item.id,
    shapeOptions: {
      url: '/api/todos',            // your proxy to Electric
      params: { table: 'todos' },   // the "shape" — a filtered view of a table
    },
    onInsert: async ({ transaction, collection }) => {
      const newItem = transaction.mutations[0].modified
      const response = await api.todos.create(newItem)
      await collection.utils.awaitTxId(response.txid)   // wait for the write to sync back
    },
    onUpdate: async ({ transaction, collection }) => {
      const { original, changes } = transaction.mutations[0]
      const response = await api.todos.update(original.id, changes)
      await collection.utils.awaitTxId(response.txid)
    },
  }),
)
```

- `shapeOptions` (not `shape`) is the required config: `url` = your Electric proxy, `params.table` = the table/shape to sync.
- Every write handler should `await collection.utils.awaitTxId(txid)` so the optimistic state is held until the server's row arrives.

## 3. No txids from your API? use `awaitMatch`

```ts
import { awaitMatch } from '@tanstack/electric-db-collection'

onInsert: async ({ transaction, collection }) => {
  const newItem = transaction.mutations[0].modified
  await api.todos.create(newItem)
  await awaitMatch(collection, (row) => row.id === newItem.id) // match the synced row
}
```

## 4. Descriptor form (per-DbClient)

Same as Query collections — a stable descriptor instantiated through the client:

```ts
import { collectionOptions } from '@tanstack/react-db'
import { electricCollectionOptions } from '@tanstack/electric-db-collection'

export const todosCollection = collectionOptions('todos', () => electricCollectionOptions({ /* ... */ }))
// in a component: useDbClient().collection(todosCollection)
```

## 5. Reading it

Identical to any collection — live queries, joins, aggregates all work; the source is just real-time now:

```tsx
const { data } = useLiveQuery((q) =>
  q.from({ todo: todosCollection }).where(({ todo }) => eq(todo.completed, false)),
)
```

## Pitfalls

- Using `shape: {...}` (old/new?) instead of the documented `shapeOptions: { url, params }` → collection never connects.
- Not calling `awaitTxId`/`awaitMatch` in a write handler → optimistic state settles before the server row arrives → flicker or a temporary wrong value.
- Pointing `url` straight at Electric without a proxy → auth/tenant scoping leaks; route through your API.
- Expecting client-side filtering to reduce network → the shape is the network boundary; filter in `params` for large tables.
- Holding server state only in DB without an established sync shape → optimistic rows never reconcile; verify the row actually streams back.
