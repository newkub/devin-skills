# TanStack Store — Best Practices

Framework-agnostic client state — stores, selectors, derived values, batching

## Recommended Patterns

- One module-level singleton store per domain (`userStore`, `uiStore`); never construct a store inside a component
- Always read through `useStore(store, selector)` — the selector decides re-render scope
- `Derived` for computed values, with `mount()` called once at module scope; derived-from-derived chains are supported
- Wrap multi-field/multi-store writes in `batch()` so subscribers are notified once
- Export action helpers (`updateTheme()`, `toggleSidebar()`) next to the store instead of scattering `setState` in components
- Persist by subscribing and writing to storage, or use a DB localStorage collection when the data needs querying
- Create a fresh store per test or reset it in `beforeEach` — module singletons leak across tests

## Common Pitfalls

- Calling `useStore` without a selector re-renders on every unrelated change
- Mutating `store.state` directly bypasses notification — writes must go through `setState`
- A `Derived` that was never mounted returns a stale value
- A single god-store makes every consumer a subscriber to everything
- Storing server state in the store duplicates Query/DB and drifts out of sync
- Subscribing in an effect without cleanup leaks listeners across remounts

## Perf Notes

- Selectors should return a primitive or a stable reference — returning a new object each call re-renders every time
- Batch all writes produced by one user action into a single `batch` call
- Keep stores small and domain-scoped so a change touches the smallest possible subtree

## Do / Don't

| Do | Don't |
|----|-------|
| module-singleton store | store created inside a component |
| `useStore(store, selector)` | `useStore(store)` for whole state |
| `Derived` + `mount()` | recomputing in render |
| `batch` for related writes | several `setState` calls in one handler |
| fresh store per test | shared singleton across tests |
