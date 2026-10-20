# Use Case — Integrate a New TanStack Library Into an Existing App

> Add one library without breaking the provider tree, the framework version, or the production bundle. Source: https://tanstack.com/libraries (accessed 2026-10-20)

## 1. Resolve the package name for the framework

The convention is `@tanstack/{framework}-{lib}`:

| Framework | Query | Router |
|-----------|-------|--------|
| React | `@tanstack/react-query` | `@tanstack/react-router` |
| Solid | `@tanstack/solid-query` | `@tanstack/solid-router` |
| Vue | `@tanstack/vue-query` | — |
| Svelte | `@tanstack/svelte-query` | — |
| Angular | `@tanstack/angular-query-experimental` | — |

Angular still ships query under an `-experimental` name — installing `@tanstack/angular-query` gets a 404, not a deprecation warning.

## 2. Install with the project's package manager

```bash
# match the lockfile already in the repo
bun add @tanstack/react-query
```

Through `/run-install` so a failing install is resolved, not skipped.

## 3. Check framework compatibility before wiring

Confirm the installed library's peer range covers the React/Solid/Vue version in `package.json`. A peer mismatch shows up later as a broken hook, and the error message names the library, not the version.

## 4. Wire the provider once, at the entry point

```tsx
// src/main.tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

root.render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>,
);
```

One client, created outside the component. Creating it inside a component body recreates the cache on every render and makes every request look uncached.

## 5. Use it in one real feature, then prove it

1. Convert one screen to the new library — one, not all
2. `/run-typecheck` — the library's types must catch a wrong argument here
3. `/run-test`
4. Add the devtools in dev to inspect state → `usecases/` in `/follow-lib-tanstack-devtools`

## 6. Check the bundle

Build and confirm the new library lands in the chunk you expect. A library pulled into a shared chunk because two routes import it is a routing decision worth knowing.

## Pitfalls

- Registering two providers of the same library (a nested `QueryClientProvider` with a different client), which splits the cache silently.
- Wrapping the provider around a single route instead of the app root, so sibling routes get no context.
- Installing the framework-agnostic core (`@tanstack/query-core`) into an app and rebuilding the framework bindings by hand.
- Migrating every call site in the same change as the install, so a rollback loses both.

## Related

- `references/apis.md`
- `best-practices/tanstack-ecosystem.md`
- `usecases/pick-library-for-a-feature.md`
