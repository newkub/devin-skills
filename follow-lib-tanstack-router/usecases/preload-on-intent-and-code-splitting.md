# Use Case — Preload on Intent and Keep Route Chunks Small

> Make navigation feel instant by fetching on hover and shipping only the current route's code — without guessing which import broke the split. Source: https://tanstack.com/router/latest/docs/framework/react/guide/code-splitting (accessed 2026-10-20)

## 1. Turn on automatic splitting

```ts
// vite.config.ts
import { tanstackRouter } from "@tanstack/router-plugin/vite";

export default defineConfig({
  plugins: [
    tanstackRouter({ target: "react", autoCodeSplitting: true }),  // before the react plugin
    react(),
  ],
});
```

The plugin rewrites route files into loader/component chunks and regenerates `routeTree.gen.ts`. Never split by hand once this is on — a manual `lazyRouteComponent` around a route the plugin already split produces a second chunk and a stray dynamic import.

## 2. Preload on hover and on touch

```tsx
const router = createRouter({
  routeTree,
  defaultPreload: "intent",           // hover / focus starts the loader
  defaultPreloadStaleTime: 10_000,    // reuse the preloaded result for 10 s
});
```

`intent` preloads the route's code and runs its loader when a `<Link>` is hovered or focused. `defaultPreloadStaleTime` must be greater than 0, otherwise the loader runs again on click and the hover did nothing.

## 3. Preload deliberately on data-heavy routes

```tsx
<Link to="/reports/$reportId" params={{ reportId }} preload="intent" preloadDelay={80}>
  Open report
</Link>
```

`preloadDelay` avoids firing a loader for a pointer that merely crosses the link. On a list of 200 links, that is the difference between one report fetched and forty.

## 4. Keep heavy imports out of the route module

```tsx
// ❌ the chart library lands in every route that imports the barrel
import { Chart } from "@acme/ui";

// ✅ import the module the route actually uses
import { LineChart as Chart } from "@acme/ui/charts/line";
```

A barrel file defeats code splitting: one route that needs a chart pulls the whole UI package into a shared chunk that every route downloads.

## 5. Verify the split, not the config

1. `/run-build` — the output lists a chunk per route (`about-*.js`, `projects.$projectId-*.js`); one giant `index-*.js` means the split is off
2. Inspect a chunk — the chart library appears only in the route that imports it
3. Hover a link, wait, then click — the network panel shows the loader request on hover and none on click
4. Throttle to Slow 3G and navigate — `pendingComponent` shows instead of a frozen screen
5. On failure → `/resolve-errors` max 3 rounds

## Pitfalls

- `defaultPreloadStaleTime: 0` → every click refetches, so preloading costs bandwidth and saves nothing.
- Preloading every link on mount → a page with 100 links fetches 100 loaders before the user moves.
- A barrel import in `__root.tsx` → everything it re-exports joins the entry chunk.
- Reading `loaderData` as non-optional in a component that can render while pending → a crash on the first navigation instead of a skeleton.
- Splitting a route that the plugin already split → two copies of the component and a duplicated loader call.

## Related

- `references/apis.md`
- `best-practices/tanstack-router.md`
- `usecases/nested-layouts-and-pathless-routes.md`
- `usecases/validated-search-and-loaders.md`
