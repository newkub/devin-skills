# TanStack DB — Best Practices

Reactive client store — collections, live queries, optimistic writes, sync drivers

## Recommended Patterns

- One collection per server resource; `getKey` returns a stable, unique id — never the array index
- Attach a `schema` (Standard Schema) to the collection — types and runtime validation in one place
- Match the driver to the backend: `queryCollectionOptions` with the app's own `queryClient`, `electricCollectionOptions` for realtime shapes, `localStorageCollectionOptions` for persistence, `localOnlyCollectionOptions` for ephemeral data
- Do filtering, joins, ordering and aggregation inside the live query — let the query engine work on collections, not on arrays in render
- Writes go through `collection.insert`/`update`/`delete`; the write handler (`onInsert`/`onUpdate`/`onDelete`) persists, and a thrown error rolls the optimistic state back
- Gate UI that depends on persistence with `tx.isPersisted`/`awaitTxId` — navigate only after the server confirmed
- Reusable views are derived collections (`liveQueryCollectionOptions`), shared across components instead of duplicated queries
- Non-hook usage (`createLiveQueryCollection`) plus dehydration/hydration for SSR and workers

## Common Pitfalls

- A mutable `getKey` field (or index) reinserts rows instead of updating them
- A write handler that swallows errors leaves the optimistic row in place forever
- Creating a second `QueryClient` for a Query-backed collection splits cache and sync
- Joining on a key that is `undefined` on one side silently returns no rows
- A collection that never starts syncing stays empty until something subscribes — trigger sync explicitly
- Using `localOnlyCollectionOptions` for data that must survive a reload; use the localStorage driver
- Treating the package as stable 1.x — the 0.x API changes between minors, read the changelog before upgrading

## Perf Notes

- Project only the fields the UI renders in `select`; whole-row results on large collections cost memory and re-renders
- Prefer `eq` predicates on indexed/join keys over broad range scans
- Keep the query builder function stable (module scope where possible) so live queries are not recreated per render

## Do / Don't

| Do | Don't |
|----|-------|
| stable unique `getKey` | array index or mutable field |
| schema on every collection | untyped collection + manual casts |
| driver that matches the backend | Query driver with a foreign `queryClient` |
| rollback via thrown handler error | catch-and-ignore in the write handler |
| derived collections for reuse | the same live query copy-pasted per component |
