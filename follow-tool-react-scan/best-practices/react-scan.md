# react-scan — Best Practices

React performance scanner — automatically finds unnecessary renders

## Recommended Patterns

- Run in dev mode: `bunx react-scan` or the script tag — the overlay highlights re-rendering components + counts
- Focus on abnormal render counts — a component that renders on every parent render while its props don't change = memo candidate
- Use with realistic interactions — click through real flows, not an idle page
- Prioritize: high-frequency renders (per keystroke/scroll/mousemove) > one-off renders
- Verify fixes with a re-scan — react-scan before/after memo/restructure

## Common Pitfalls

- Dev mode renders ≠ prod — React StrictMode double-renders in dev; read the numbers with this context
- Memoizing everything = worse — `useMemo`/`useCallback` have a cost; fix only what the scan proves
- New context value objects every render = the main re-render source — memo context values
- The children-as-props pattern often fixes re-renders better than memo — composition before optimization
- react-scan only highlights re-renders — it doesn't say a render is slow; combine a profiler for slow renders

## Workflow

1. `react-scan` dev session → interact → note top offenders
2. Diagnose cause: unstable props? context? parent renders?
3. Fix: composition/memo/state colocation — don't memo everything on the list
4. Re-scan to verify counts actually dropped

## Do / Don't

| Do | Don't |
|----|-------|
| Scan real user flows | Idle-page scans |
| Fix top-frequency offenders first | Memoizing every flagged component |
| Memo context values | Recreating object literals in a provider |
| Re-scan to confirm the fix | Assuming the fix worked |
