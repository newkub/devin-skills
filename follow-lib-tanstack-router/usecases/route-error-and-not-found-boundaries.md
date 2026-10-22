# Use Case — Route-Level Error, Pending, and Not-Found Boundaries

> Give each level of the route tree its own failure UI, so a broken widget does not blank the whole app and a bad URL still shows navigation. Source: https://tanstack.com/router/latest/docs/framework/react/guide/error-boundaries (accessed 2026-10-20)

## 1. Boundaries belong to the route, not the component

```tsx
export const Route = createFileRoute("/_app/projects/$projectId")({
  loader: ({ params }) => api.project(params.projectId),

  pendingComponent: () => <ProjectSkeleton />,
  errorComponent: ({ error, reset }) => (
    <ErrorPanel
      title="Could not load this project"
      message={error.message}
      onRetry={() => { reset(); router.invalidate(); }}
    />
  ),
  notFoundComponent: () => <EmptyState title="Project not found" cta={{ to: "/projects", label: "All projects" }} />,
});
```

Each surface (route) decides how it fails. One global boundary answers every failure with the same screen, which is wrong for a tab-level fetch.

## 2. Throw `notFound()` for a missing record

```ts
import { notFound } from "@tanstack/react-router";

loader: async ({ params }) => {
  const project = await api.project(params.projectId);
  if (!project) throw notFound();          // renders notFoundComponent, not a 500 page
  return project;
},
```

Returning `null` and rendering nothing is the common alternative — it leaves users on a blank page with a 200 status and no way back.

## 3. Let a child capture its own error

```tsx
// _app.projects.$projectId.activity.tsx
export const Route = createFileRoute("/_app/projects/$projectId/activity")({
  loader: () => api.activity(),
  errorComponent: ({ error }) => <InlineError error={error} />,  // small panel inside the tab
});
```

A throw from the activity loader is caught by the nearest boundary — the project header and the other tabs keep working. That is the reason to place boundaries at leaves, not only at the root.

## 4. Reset rather than reload

```tsx
errorComponent: ({ error, reset }) => (
  <ErrorPanel
    error={error}
    onRetry={() => {
      reset();                    // clear the boundary state
      router.invalidate();        // re-run the loader for this match
    }}
  />
),
```

`window.location.reload()` loses scroll, filters, and any in-progress form. `reset()` + `invalidate()` retries only the failed match.

## 5. Verify

1. `/run-dev` — force the loader to throw: the route shows the panel, the shell and nav still work
2. Navigate to `/projects/does-not-exist` — `notFoundComponent` renders with a working link back
3. Break only the activity tab — the header and sibling tabs still render
4. Click Retry with the API fixed — data appears without a full page reload
5. `/run-typecheck` — `reset` and `error` props stay typed
6. On failure → `/resolve-errors` max 3 rounds

## Pitfalls

- Only a root `errorComponent` → any leaf failure blanks the whole app including the nav.
- Rendering `error.message` from a server error verbatim → leaks internal paths and SQL; map to a safe message and log the original.
- `notFoundComponent` on the root only → the 404 has no navigation because the shell was never rendered; put it under the layout too.
- Retry without `invalidate()` → the boundary resets and re-renders the same thrown state.
- Catching errors inside the component instead of letting the loader throw → no boundary sees it and the UI renders half a page.

## Related

- `references/apis.md`
- `best-practices/tanstack-router.md`
- `usecases/nested-layouts-and-pathless-routes.md`
- `usecases/validated-search-and-loaders.md`
