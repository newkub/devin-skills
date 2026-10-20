# TanStack Charts — Best Practices

Grammar-of-graphics charts — axes, series, responsive sizing, theming

## Recommended Patterns

- Keep the `data` reference stable with `useMemo`; a new array each render re-runs the whole chart
- Model the chart as grammar: `data` plus `primaryAxis` (category/time) and one `secondaryAxes` entry per series
- Normalize multi-series data into a shared key shape (`{ label, s1, s2 }`) and give each key its own axis
- Return a `Date` from the primary axis `getValue` for time series and let the scale handle it
- Give the container an explicit height — the chart follows its parent, a zero-height parent renders nothing
- Map series colors to design tokens, including a dark-mode variant
- Handle loading and empty data explicitly; the chart does not invent placeholder states
- Provide a text or table fallback for the same data so the chart is not the only access path

## Common Pitfalls

- Inline `data`/axis option objects recreate the chart on every render
- A container without height collapses the chart to zero pixels
- Assuming a Recharts-style props API — this is a 0.x grammar API that changes
- Hardcoded hex colors drift from the design system and break dark mode
- Too many points per series makes rendering and reading worse; downsample or aggregate first
- Reusing one axis config for series with different units produces a misleading graph
- Treating the beta API as stable across upgrades

## Perf Notes

- Downsample or bucket large time ranges before they reach the chart
- Memoize derived series and formatters, not just the raw data
- Animate only on meaningful data changes; disable transitions for live-updating charts

## Do / Don't

| Do | Don't |
|----|-------|
| memoized `data` | inline arrays per render |
| one axis per unit/series | mixed units on a shared axis |
| explicit container height | auto-height parent with no size |
| design-token colors | hardcoded hex values |
| loading/empty states | rendering an empty chart silently |
