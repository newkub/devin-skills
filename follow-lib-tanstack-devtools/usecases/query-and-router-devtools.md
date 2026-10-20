# Use Case — Mount Query and Router Devtools Together

> Inspect the query cache and the route tree in one dev session without slowing the app. Source: https://tanstack.com/devtools (accessed 2026-10-20)

## 1. Install as dev dependencies

```bash
bun add -D @tanstack/react-query-devtools @tanstack/react-router-devtools
```

`devDependencies` is the point: neither package belongs in a runtime install.

## 2. Render each panel inside what it inspects

```tsx
// src/main.tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { routeTree } from "./routeTree.gen";

const queryClient = new QueryClient();
const router = createRouter({ routeTree });

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
      <TanStackRouterDevtools router={router} />
    </QueryClientProvider>
  );
}
```

`ReactQueryDevtools` rendered outside `QueryClientProvider` still paints a button but shows an empty cache, which reads like "nothing is being cached" instead of "wrong mount point".

## 3. Stop the panels from covering each other

`buttonPosition="bottom-left"` on Query devtools keeps it clear of the Router panel's corner. Both panels remember their open state per browser, so no extra persistence config is needed.

## 4. Use the panels for real diagnosis

1. Open the Query panel and confirm every mounted key is fresh or fetching as expected — a key stuck in `fresh` with an old `dataUpdatedAt` explains a stale UI
2. Open the Router panel and read the match list — a missing match means the route tree, not the component, is wrong
3. Toggle a query's `staleTime` and watch the refetch behavior change without a browser reload

## 5. Verify

1. `/run-dev` — both panels open and show data
2. `/run-typecheck` — no devtools-only types leaking into app code
3. Production check → `usecases/keep-devtools-out-of-production.md`

## Pitfalls

- Creating a second `QueryClient` for the devtools, so the panel inspects a client the app never uses.
- Omitting the `router` prop in a code-based setup, leaving the Router panel unable to read the tree.
- Importing the devtools in a shared component so every route bundles a second copy.
- Using a Solid/Vue project's package name with React entry points; the Solid equivalents are `@tanstack/solid-query-devtools` and `@tanstack/solid-router-devtools` — confirm the exported component name in the package docs before importing.

## Related

- `references/apis.md`
- `best-practices/tanstack-devtools.md`
- `usecases/keep-devtools-out-of-production.md`
