# React — Best Practices

Component, hooks, and rendering discipline for modern React

## Recommended Patterns

- Composition over prop drilling — children/render props/context depending on tree depth
- Hooks rules: call at top level only, complete deps array (`react-hooks` eslint), never conditional
- Derived state = compute in render — not `useState` + `useEffect` sync
- `useEffect` = sync with external systems only — data fetching goes to the framework/query lib; no effect chains
- Keys must be stable + unique — never the index when a list can reorder/filter
- Memoize only at measured bottlenecks — `useMemo`/`useCallback` everywhere = worse

## Common Pitfalls

- State mutation: `array.push`, `obj.x =` don't trigger render — always setState with a new reference
- `useEffect` missing deps = stale closure bugs — don't ignore the exhaustive-deps warning
- Race conditions in fetch effects — abort/`ignore` flag; or use React Query/SWR
- Deep prop drilling → context; but a new context value object every render = re-render for every consumer → memo the value
- Effects for event handling are wrong — events are handlers, not effects

## Perf Notes

- `React.memo` only for components whose props genuinely shallow-equal
- List rendering: virtualization (`react-window`/`tanstack-virtual`) beyond 1000 rows
- Code splitting: `React.lazy` + `Suspense` at route boundaries
- Server Components (RSC): data-heavy components render on the server — less client JS

## Do / Don't

| Do | Don't |
|----|-------|
| compute derived state in render | `useState` + effect to sync state |
| stable keys | array index keys on dynamic lists |
| context when depth >2-3 | prop drilling 5 levels |
| effect for external sync only | effects for event/data-fetch logic |
