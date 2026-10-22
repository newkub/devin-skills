# Use Case — Mount Query and Router Panels in the Workbench

> Inspect the query cache and the route tree as two tabs in one devtools shell. Source: https://tanstack.com/devtools/latest/docs/quick-start (accessed 2026-10-20)

## 1. Install the panel packages

```bash
npm install -D @tanstack/react-query-devtools @tanstack/react-router-devtools
```

The panel package is the same one that ships the floating component; the `*Panel` export is what the workbench consumes.

## 2. Keep the providers, drop the floating components

```tsx
// src/main.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { ReactQueryDevtoolsPanel } from '@tanstack/react-query-devtools'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { routeTree } from './routeTree.gen'

const queryClient = new QueryClient()
const router = createRouter({ routeTree })

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
    <TanStackDevtools
      plugins={[
        { id: 'tanstack-query', name: 'TanStack Query', render: <ReactQueryDevtoolsPanel /> },
        { id: 'tanstack-router', name: 'TanStack Router', render: <TanStackRouterDevtoolsPanel /> },
      ]}
    />
  </StrictMode>,
)
```

The shell sits beside the providers, while each panel reads the state of the provider above it. Do not render `<ReactQueryDevtools />` or `<TanStackRouterDevtools />` — those create a second floating UI.

## 3. Match the adapter's plugin shape

| Framework | Panel package | Plugin field |
|-----------|---------------|--------------|
| React | `@tanstack/react-query-devtools` | `render: <ReactQueryDevtoolsPanel />` |
| Solid | `@tanstack/solid-query-devtools` | `render: <SolidQueryDevtoolsPanel />` |
| Vue | `@tanstack/vue-query-devtools` | `component: VueQueryDevtoolsPanel` |

Router panels follow the same split: `TanStackRouterDevtoolsPanel` from the matching framework package.

## 4. Read the panels for real diagnosis

1. Query tab — a key stuck `fresh` with an old `dataUpdatedAt` explains a stale UI; a key that never appears means the observer is not mounted
2. Router tab — a missing match means the route tree is wrong, not the component
3. Keep one panel open per concern; the workbench supports several panes at once but each adds render cost

## 5. Verify

1. `/run-dev` — both tabs appear and show live state
2. Trigger a refetch and watch `dataUpdatedAt` move in the Query tab
3. Navigate and watch the match list update in the Router tab
4. `/run-typecheck` — no devtools-only types in app code
5. Production check → `usecases/keep-devtools-out-of-production.md`

## Pitfalls

- Creating a second `QueryClient` for the panel, so it inspects a cache the app never uses.
- Rendering the panel outside `QueryClientProvider`, which produces an empty tab that looks like "nothing is cached".
- A code-based router without passing the router instance to the panel, leaving it unable to read the tree.
- Importing the panel in a shared component so every route bundles another copy.
- Mixing package names across frameworks — the React panel does not load in a Solid app.

## Related

- `references/apis.md`
- `best-practices/tanstack-devtools.md`
- `usecases/quick-start-framework-adapter.md`
- `usecases/keep-devtools-out-of-production.md`
