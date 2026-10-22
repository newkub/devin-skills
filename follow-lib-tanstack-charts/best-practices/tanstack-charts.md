# TanStack Charts — Best Practices

Grammar-of-graphics charts — marks, channels, scales, guides, responsive sizing, accessibility

## Recommended Patterns

- Keep each mark on its natural rows — there is no universal series wrapper to reshape into
- Map fields to channels (`x`, `y`, `z`, `color`) and use accessors only for derived values
- Let scale factories infer domains from the marks; pass a configured instance only for a fixed domain
- Put guides next to the scale (`axis`, `grid`, `label`) instead of a separate chart-level config
- Memoize the complete definition against the values it captures — definition identity is the update contract
- Use `layout: group()` for side-by-side bars and `layout: stack()` only when the default stack order or offset must change
- Upgrade only the scale that needs fuller semantics (time, log) to `d3-scale`
- Give the container a height; omit `width` and `margin` so the host follows the container and measures guides
- Set `ariaLabel` — keyboard focus is on by default once the chart is named
- Provide a table or textual summary for the same data when exact values matter

## Common Pitfalls

- Rebuilding the definition inline on every render, which repaints and drops focus state
- Reshaping rows into a library-owned series structure that no channel references
- Replacing a categorical axis with a line mark — `lineY` connects ordered values only
- Letting bars start at a non-zero baseline, which exaggerates differences
- Casting a rejected channel field instead of fixing the row type
- Treating a responsive `chart: ({ width }) => ...` builder as a place to fetch or mutate state
- Using one shared y axis for series with different units
- Forgetting `d3-scale` when importing a time or log scale
- Assuming `latest` docs match the installed version — they track `main`

## Perf Notes

- Downsample or aggregate dense series before they reach the chart
- Opt paint-heavy marks into Canvas; keep axes, labels, and highlights in SVG
- Reuse the exported `canvasChartRenderer` singleton instead of creating renderers per render
- Disable motion for live-updating charts; animate only meaningful data changes
- Keep derived rows and formatters memoized with the definition

## Do / Don't

| Do | Don't |
|----|-------|
| mark-local rows | a universal series container |
| memoized complete definition | inline `defineChart` per render |
| `layout: group()` for side-by-side bars | assuming bars group automatically |
| zero baseline for bars | a truncated bar axis |
| `scaleUtc` for real time | formatted date strings as categories |
| Canvas for dense paint layers | Canvas for axes and labels |
