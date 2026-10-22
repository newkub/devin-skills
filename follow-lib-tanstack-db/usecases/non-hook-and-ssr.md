# Use Case — Non-Hook Usage & SSR Hydration

> Read/write collections outside React, and ship server-loaded data to the browser without a refetch waterfall. Source: https://tanstack.com/db/latest/docs/overview, /docs/guides/ssr (accessed 2026-10-20)

## 1. Part A — Non-hook usage (vanilla / Node / framework adapters)

The core `@tanstack/db` package works without any UI adapter — only the React/Vue/Solid/Svelte wrappers add hooks.

### Read reactively

```ts
import { createLiveQueryCollection, eq } from '@tanstack/db'

const activeTodos = createLiveQueryCollection({
  startSync: true,
  query: (q) => q.from({ todo: todosCollection }).where(({ todo }) => eq(todo.completed, false)),
})

// snapshot read
console.log(activeTodos.toArray)

// subscribe to incremental changes
const unsub = activeTodos.subscribe(() => {
  render(activeTodos.toArray)
})
```

### Write and await settlement

```ts
todosCollection.update('1', (draft) => { draft.completed = true })

// wait for the transaction that this write belongs to
await todosCollection.state.get('1') // or observe via the subscription above
```

- `createLiveQueryCollection` without a component → you own `startSync` and cleanup.
- Use this in workers, CLI tools, tests, or a non-React view layer.

## 2. Part B — SSR / hydration (React)

The rule: a fresh `DbClient` per request — preload the data the route needs, `dehydrate()` on the server, `hydrate()` in the browser before any hook reads.

```tsx [server]
import { DbClient } from '@tanstack/react-db'

export async function loader() {
  const dbClient = new DbClient({ dependencies: { queryClient } })

  // preload an explicit collection (dehydrates as normalized rows)
  const todos = dbClient.collection(todoCollectionHolder)
  await todos.preload()

  return dbClient.dehydrate()
}
```

```tsx [client entry]
import { DbClient, DbProvider } from '@tanstack/react-db'

function App({ dehydratedDbState }) {
  const [dbClient] = React.useState(() => new DbClient())

  // hydrate BEFORE hooks read from the client
  dbClient.hydrate(dehydratedDbState)

  return (
    <DbProvider client={dbClient}>
      <Todos />
    </DbProvider>
  )
}
```

## 3. What dehydrates

| Source | Serialized as |
|---|---|
| explicitly preloaded collection | normalized collection rows |
| preloaded / render-discovered live query | ordered query-result snapshot (not its whole source collection) |

- `dbClient.applyCollectionChunk(chunk)` streams collection rows incrementally (progressive load).
- `dbClient.preloadLiveQuery(...)` preloads a query result for the route.
- `routerWithDbClient(router, dbClient)` wires render-time streaming when using a router integration.

## 4. Hydration behavior

During the first browser render, descriptor-backed queries read either hydrated rows or their matching query snapshot. Real adapter sync starts after React commits; live results hand off from snapshot → live source without a visible flash. A hydrated query payload carries results, not Collection objects — the first committed subscription claims the local source.

## Pitfalls

- Sharing one `DbClient` across requests on the server → data/optimistic state leaks between users; always `new DbClient()` per request.
- Calling `hydrate()` after a hook already read → first paint is empty then pops; hydrate in the entry/providers before rendering consumers.
- Assuming `createLiveQueryCollection` without `startSync` is live → it isn't until subscribed.
- Expecting a dehydrated live query to also ship its full source collections → it stores the result snapshot only; preload the source collection explicitly if other browser queries need it.

## Related

- `references/apis.md`
- `best-practices/tanstack-db.md`
- `usecases/local-first-storage.md`
- `usecases/query-rest-crud.md`
