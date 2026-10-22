# Use Case — REST CRUD via TanStack Query (QueryCollection)

> Load an existing REST API into normalized collections and write back with optimistic mutations. Source: https://tanstack.com/db/latest/docs/overview, /docs/collections/query-collection (accessed 2026-10-20)

## 1. Wire the clients once

`DbClient` wraps a `QueryClient`; provide both through `DbProvider` so `collectionOptions` factories can pull the shared `queryClient` dependency.

```tsx
import { DbClient, DbProvider } from '@tanstack/react-db'
import { QueryClient } from '@tanstack/query-core'

const queryClient = new QueryClient()
const dbClient = new DbClient({ dependencies: { queryClient } })

const App = () => (
  <DbProvider client={dbClient}>
    <Todos />
  </DbProvider>
)
```

## 2. Define a collection factory (module scope)

Collections are declared as stable `collectionOptions` descriptors, instantiated per `DbClient` via `useDbClient().collection(...)`. Define the descriptor once, reuse it everywhere.

```ts [collections.ts]
import { collectionOptions } from '@tanstack/react-db'
import { queryCollectionOptions } from '@tanstack/query-db-collection'
import type { QueryClient } from '@tanstack/query-core'
import { z } from 'zod'

const todoSchema = z.object({
  id: z.string(),
  text: z.string(),
  completed: z.boolean().default(false),
  list_id: z.string(),
})

export const todoCollection = collectionOptions('todos', (client) =>
  queryCollectionOptions({
    id: 'todos',
    queryKey: ['todos'],
    queryClient: client.requireDependency<QueryClient>('queryClient'),
    queryFn: () => fetch('/api/todos').then((r) => r.json()),
    getKey: (item) => item.id,        // stable + unique, never the array index
    schema: todoSchema,               // standard schema → types + runtime validation
    onInsert: async ({ transaction, collection }) => {
      await api.todos.create(transaction.mutations[0].changes)
      await collection.utils.refetch()
      return { refetch: false }        // stop the pre-1.0 wrapper refetching again
    },
    onUpdate: async ({ transaction }) => {
      const { original, changes } = transaction.mutations[0]
      await api.todos.update(original.id, changes)
    },
    onDelete: async ({ transaction }) => {
      const { original } = transaction.mutations[0]
      await api.todos.delete(original.id)
    },
  }),
)
```

## 3. Read + write in a component

```tsx
import { useDbClient, useLiveQuery, eq } from '@tanstack/react-db'
import { todoCollection } from './collections'

const Todos = () => {
  const todos = useDbClient().collection(todoCollection)

  const { data } = useLiveQuery({
    query: (q) => q.from({ todo: todos }).where(({ todo }) => eq(todo.completed, false)),
  })

  const complete = (todo) =>
    todos.update(todo.id, (draft) => { draft.completed = true }) // instant optimistic

  return <ul>{data?.map((t) => <li key={t.id} onClick={() => complete(t)}>{t.text}</li>)}</ul>
}
```

## 4. Sync mode (large / partial datasets)

Pick `syncMode` by data size — it lives in the collection options:

| Mode | Loads | Use for |
|---|---|---|
| `eager` (default) | whole collection upfront | <10k mostly static rows (prefs, small refs) |
| `on-demand` | only what each query requests | >50k rows, search/catalog; the query becomes the API call via `ctx.meta.loadSubsetOptions` |
| `progressive` | query subset now, full set in background | collaborative apps needing instant first paint |

## 5. Verify

1. `/run-typecheck` + `/run-test`.
2. Mutate → UI updates instantly → server confirms → on handler throw, the row rolls back.
3. `/run-dev` the query re-renders only the affected slice.
4. Fail → `/resolve-errors` max 3 rounds.

## Pitfalls

- A Query-backed collection MUST reuse the app's `queryClient` (`requireDependency('queryClient')`) or it won't share cache/policies.
- `getKey` on the array index → wrong diffing + lost optimistic state after reorder.
- Passing both a `schema` and an explicit `createCollection<T>()` type param → invalid; the schema drives the type.
- Forgetting `return { refetch: false }` after `collection.utils.refetch()` in `onInsert` → double refetch.
- Plain one-shot fetching that needs no live query/join/optimistic → stays with `follow-lib-tanstack-query`, not DB.

## Related

- `references/apis.md`
- `best-practices/tanstack-db.md`
- `usecases/optimistic-mutations.md`
- `usecases/live-queries-joins.md`
