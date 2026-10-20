# TanStack Router — Best Practices

Type-safe routing — file routes, validated search, loaders, navigation

## Recommended Patterns

- Pick file-based or code-based routes and stay with it; treat `routeTree.gen.ts` as generated output
- Declare the `Register` interface once with the app's router type — it is what makes `to`, `params` and `search` type-check everywhere
- Parse every typed search param in `validateSearch` (numbers, booleans, enums, arrays) and read it back through `useSearch`
- Loaders own route-critical data; data that refetches, polls or syncs belongs to Query inside the component
- Auth and redirects belong in `beforeLoad` (`throw redirect({ to: '/login', search: { redirect } })`) so children never mount unauthenticated
- Give each route `pendingComponent`, `errorComponent` and `notFoundComponent` rather than one global fallback
- Preload on intent (`defaultPreload: 'intent'`) and call `router.invalidate()` after mutations so loaders re-run
- Navigate with `<Link>` for user actions (renders an anchor) and `useNavigate` only for imperative flows

## Common Pitfalls

- Missing `Register` silently degrades every route path to `string`
- Mixing code-based and file-based definitions for the same path produces duplicate route ids
- Parsing search only in the component leaves the URL and the UI disagreeing on reload/back
- Throwing a generic error for a missing record instead of `notFound()` bypasses the not-found boundary
- Assuming loader data is fresh forever — set `staleTime`/`gcTime` or use Query for mutable data
- Hand-editing the generated route tree is overwritten on the next dev run
- A pathless layout route without `<Outlet/>` renders its children nowhere

## Perf Notes

- Enable `autoCodeSplitting` so each route ships its own chunk; combine with intent preloading
- Matched-route loaders can run in parallel — avoid a parent loader that sequentially awaits everything children need
- Keep `validateSearch` cheap; it runs on every navigation and history event

## Do / Don't

| Do | Don't |
|----|-------|
| one routing style per app | file routes plus code routes for the same path |
| `validateSearch` for typed params | trusting raw `search` strings in components |
| `beforeLoad` guard + redirect back | guarding inside the component after mount |
| Query for refetchable data | loader as a cache for live data |
| `router.invalidate()` after mutation | manually patching loader state |
