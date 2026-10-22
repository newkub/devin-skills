# Use Case — Move Off One Library Onto the One That Actually Fits

> Replace a mis-selected package with the TanStack library whose responsibility matches the data, one seam at a time. Source: https://tanstack.com/libraries (accessed 2026-10-20)

## 1. Name the boundary that is wrong

| Symptom | Current | Target |
|---------|---------|--------|
| server data copied into a client store by hand | `Store` | `Query` |
| two apps of the same data drifting apart offline | `Query` + manual sync | `DB` |
| client state needs live queries and sync | `Store` | `DB` |
| server functions and SSR bolted onto a Vite SPA | `Router` | `Start` |
| custom debounce/throttle hooks in every component | hand-rolled | `Pacer` |
| sorting and pagination written per table | hand-rolled | `Table` |
| keydown listeners scattered across components | hand-rolled | `Hotkeys` |

One row per migration. A change that moves two responsibilities at once has no clean verification seam.

## 2. Pick the migration seam

1. One screen or one feature first, not every call site
2. Keep the old library mounted until the new path is green
3. Delete the old dependency only when no import remains

## 3. Query to DB when the data must live locally

`Query` caches server responses; `DB` owns synced collections and live queries. Keep `Query` for request/response data and move only the collection that needs offline mutation or multi-tab sync. Running both over the same rows creates two sources of truth that disagree after a reconnect.

## 4. Store to DB when client state needs sync

`Store` is in-memory client state. If the state must survive reload, sync across tabs, or merge remote changes, the collection belongs in `DB`. Keep genuinely ephemeral UI state — panel open, draft filter — in `Store`.

## 5. Router to Start when the server enters the picture

`Start` contains `Router`. Migrating means:

1. Replace the Vite SPA entry with the Start entry and its server handler
2. Move data loading into server functions or route loaders
3. Delete the standalone `@tanstack/react-router` install only if Start's re-export covers it

Do not keep both routers mounted; two route trees produce two match lists and a devtools panel that shows the wrong one.

## 6. Hand-rolled to Pacer, Table, or Hotkeys

| Current code | Replacement | Keep |
|--------------|-------------|------|
| `setTimeout` debounce in a component | `useDebouncedValue` / `useDebouncer` | the same delay constant |
| per-table sort and page state | `Table` column and pagination state | the render markup |
| `window.addEventListener('keydown')` in each component | `Hotkeys` scope + binding | the command handlers |

These are local replacements: one component at a time, no data layer change.

## 7. Verify parity before deleting the old path

1. The migrated screen renders the same data with the same empty, loading, and error states
2. `/run-typecheck` — no `any` bridge types left behind
3. `/run-test` — the existing tests pass without rewrites that weaken assertions
4. A rollback is possible until the old dependency is removed
5. `/run-build` — the old library is no longer in the bundle

## Pitfalls

- Migrating the data layer and the UI in the same change, so a failure has two candidate causes.
- Keeping both libraries active "for safety" and letting them write the same rows.
- Replacing `Store` with `DB` for state that never leaves the tab.
- Moving to `Start` while a separate Router provider still wraps the app.
- Deleting the old dependency before the new path has a passing test.

## Related

- `references/apis.md`
- `best-practices/tanstack-ecosystem.md`
- `usecases/pick-library-for-a-feature.md`
- `usecases/evaluate-maturity-and-lock-versions.md`
