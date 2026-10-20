# Use Case — Route Loader, Pending UI and Error Recovery

> Load data on the server for the first paint, show a skeleton on navigation, and give the user a real retry when the loader fails. Source: https://tanstack.com/start/latest/docs/framework/react/guide/data-loading (accessed 2026-10-20)

## 1. The loader returns what the component needs

```tsx
// src/routes/todos.tsx
import { createFileRoute } from "@tanstack/react-router"
import { listTodos } from "../server/todos"

export const Route = createFileRoute("/todos")({
  loader: async () => ({ todos: await listTodos() }),
  pendingComponent: () => <TodosSkeleton />,
  errorComponent: ({ error, reset }) => (
    <div role="alert">
      <p>{error.message}</p>
      <button onClick={reset}>Try again</button>
    </div>
  ),
  component: Todos,
})

function Todos() {
  const { todos } = Route.useLoaderData()
  return <ul>{todos.map((t) => <li key={t.id}>{t.title}</li>)}</ul>
}
```

The loader runs on the server for the initial request and in the browser for later navigations — the component reads the resolved value either way.

## 2. Keep the loader SSR-safe

```ts
// Wrong: crashes during SSR
loader: () => ({ theme: localStorage.getItem("theme") })

// Right: server-only reads go through a server function
loader: async () => ({ prefs: await getUserPrefs() })   // createServerFn behind it
```

`window`, `localStorage`, and `document` do not exist in the loader's server pass. Per-request headers/cookies come from `getWebRequest()` inside a server function.

## 3. Refresh after a mutation

```tsx
const router = useRouter()
await updateTodo({ data: { id, done: true } })
await router.invalidate()
```

`invalidate()` re-runs the active loaders — no manual refetch, no duplicated cache.

## 4. Preload on intent

```ts
export const router = createRouter({ routeTree, defaultPreload: "intent", defaultPreloadStaleTime: 0 })
```

Hovering a link starts the loader; the navigation then resolves instantly. Keep the stale time low when the data changes often.

## Pitfalls

- Serializing the whole record → only return the fields the component renders; loaders are also a network boundary on client navigations.
- Doing the fetch in `useEffect` instead of the loader → no SSR data, extra waterfall, spinner on first paint.
- Catching the loader error locally → `errorComponent` never renders; let it throw.
- A loader that reads client-only state → hydration mismatch or a server crash.

## Related

- `references/apis.md`
- `usecases/server-functions-with-middleware.md`
