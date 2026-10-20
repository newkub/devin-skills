# TanStack Ecosystem — Best Practices

Library selection across the TanStack family — maturity, boundaries, integration

## Recommended Patterns

- Choose by the actual problem: server state → Query, client state → Store, local-first reactive data → DB, routing → Router, full-stack → Start, forms → Form, grids → Table, long lists → Virtual
- Check maturity before adopting: 0.x and alpha packages can change their API between minors, so pin exact versions and read changelogs
- Install only the libraries the feature needs; each one brings its own adapter package per framework
- Follow the `@tanstack/{framework}-{lib}` naming and match the framework version already in the project
- Keep the boundary explicit: Query owns fetched server data, Store owns UI state, DB owns synced local data — do not duplicate one dataset across all three
- Use the per-library skill for APIs and the best-practices file for patterns; cite the official docs as the source
- Live-check versions and API names before writing code — the ecosystem moves quickly

## Common Pitfalls

- Installing Query and DB for the same resource and letting both cache it
- Putting server state in Store, then re-implementing refetch/loading by hand
- Adopting a 0.x package in a critical path without pinning or a fallback plan
- Mixing React and Solid adapters, or assuming an adapter exists for every framework (Router/Start are React/Solid only)
- Version skew between a library and the framework major (for example an old adapter with a new React)
- Treating the ecosystem table as a checklist to install everything

## Perf Notes

- Query `select` plus sensible `staleTime` removes more re-renders than any memoization pass
- Virtualize only long lists; for short lists the overhead outweighs the benefit
- Keep reactivity scopes narrow — one store/collection per domain, selectors on read

## Do / Don't

| Do | Don't |
|----|-------|
| pick by problem first | install every TanStack library |
| pin 0.x packages | float ranges on unstable APIs |
| one owner per dataset | Query + DB + Store for the same data |
| framework-matched adapter | assume every framework is supported |
| per-library skill for details | duplicate API docs here |
