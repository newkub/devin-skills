---
name: follow-lib-tanstack-charts
description: Use TanStack Charts — declarative grammar-of-graphics: marks, scales, guides, Canvas, interaction
argument-hint: "[chart-type]"
related:
  - follow-lib-tanstack-ecosystem
  - deep-test
  - run-typecheck
  - resolve-errors
---

## Goal

Use TanStack Charts fully — a typed grammar-of-graphics library: marks + channels + scales + guides composed into one definition, rendered as accessible SVG (Canvas opt-in) with responsive sizing, focus, tooltips, and selection

## Scope

For data visualization with TanStack Charts `1.x` (stable API contract since 1.0) — the `latest` docs track `main`, so pin the release and read its docs

- part of TanStack ecosystem — selection/dispatch lives in `/follow-lib-tanstack-ecosystem`
- if the project wants a batteries-included chart kit or deep D3 composition instead → compare via `/ask-me`

## Execute

### 1. Install

> Goal: one package, plus peers only for the adapter and scales you actually import

```bash
bun add @tanstack/charts
bun add react react-dom        # peer for @tanstack/charts/react
bun add d3-scale               # only when importing a D3 scale (time/log/...)
bun add -D @types/d3-scale
```

- marks, scales, adapters, and optional capabilities are exact subpaths — there is no aggregate `/scales` export
- do not install the `d3` umbrella; declare every `d3-*` module your source imports

### 2. Define The Chart

> Goal: marks on their natural rows, channels mapped to fields, guides next to their scales

```ts
import { barY, defineChart } from '@tanstack/charts'
import { scaleBand } from '@tanstack/charts/scales/band'
import { scaleLinear } from '@tanstack/charts/scales/linear'

const revenue = [
  { id: 'jan', month: 'Jan', amount: 42_000 },
  { id: 'feb', month: 'Feb', amount: 58_000 },
  { id: 'mar', month: 'Mar', amount: 51_000 },
] as const

export const revenueChart = defineChart({
  marks: [barY(revenue, { id: 'revenue', x: 'month', y: 'amount' })],
  scales: {
    x: { scale: () => scaleBand<string>().padding(0.15), axis: { label: 'Month' } },
    y: { scale: scaleLinear, nice: true, grid: true, axis: { label: 'Revenue (USD)' } },
  },
})
```

- a mark owns its data — layers may use different row types and lengths
- channels take a field name or an accessor `(datum, { index, data }) => value`
- scale factories infer the domain from the mark channels; pass an instance only for a fixed domain
- `axis`, `grid`, `label`, `ticks`, `format` are guide options on the scale entry

### 3. Render It

> Goal: mount on the surface the app actually uses

React:

```tsx
import { Chart } from '@tanstack/charts/react'

export function Revenue() {
  return <Chart definition={revenueChart} ariaLabel="Monthly revenue" />
}
```

Vanilla DOM:

```ts
import { mountChart } from '@tanstack/charts'

const host = mountChart(container, {
  definition: revenueChart,
  height: 360,
  initialWidth: 640,
  ariaLabel: 'Monthly revenue',
})

host.update({ definition: nextDefinition, height: 420, ariaLabel: 'Monthly revenue' })
host.destroy()
```

- omit `width` and `margin` — the host follows its container and measures guides
- `initialWidth` is the deterministic fallback for SSR, hidden containers, and the first frame
- passing a new definition is the update path; host options cover size and accessibility only

### 4. Patterns

> Goal: cover the real chart tasks

1. `Layering`: marks paint in array order — area/band, then rules, then line/bars, then dots, then labels
2. `Grouped bars`: `layout: group()`; `group({ padding })` or `group({ scale })`; `z` controls placement
3. `Stacked bars`: repeated categorical positions stack by default; `layout: stack({ order, offset })` only when configuring
4. `Time series`: use `scaleUtc` from `d3-scale` and real `Date` values on the x channel
5. `Responsive definition`: `chart: ({ width }) => ({ marks, scales })` when tick count or composition depends on size
6. `Canvas`: attach `canvasChartRenderer` to paint-heavy marks only; axes and labels stay SVG
7. `Interaction`: add `tooltip` from `@tanstack/charts/tooltip`; selection via `/selection`, brush/zoom via `/interaction/*`
8. `Decorations`: wrap a helper mark in `decorative(...)` so it does not add a second focus stop or tooltip

### 5. Verify

> Goal: prove the chart renders the real data before finishing

1. `/run-typecheck` — every channel field exists and matches the accepted value type
2. `/deep-test component` — the chart definition renders the expected marks and keeps focus/tooltip behavior
3. Real render: values match the source rows, units are on the axes, tooltip and keyboard focus agree
4. Resize the container — no clipping, no horizontal scrollbar, ticks stay readable
5. Empty, single-row, and missing-value data — explicit empty state, gaps not zero-fill
6. On failure → `/resolve-errors` max 3 rounds

### Use Cases

| Scenario | Use case |
|----------|----------|
| Bar + line composition from one record array | `usecases/bar-and-line-chart.md` |
| Time series in a responsive dashboard card | `usecases/time-series-dashboard.md` |
| Stacked vs grouped bars with a color legend | `usecases/stacked-and-grouped-bars.md` |
| Range bands, targets, and annotations | `usecases/range-and-threshold.md` |
| Dense series on Canvas without losing axes | `usecases/dense-data-canvas.md` |

## Rules

- Memoize the complete definition against captured values — definition identity is the update contract
- Keep data preparation in ordinary functions beside the definition; `defineChart` is not a data layer
- Map semantic series through `color`/`z` and the chart color scale; use `fill`/`stroke` for one-off paint only
- Bars start at zero; never connect unordered categories with a line mark
- Set `ariaLabel` and provide a table or text fallback when exact values matter
- `1.x` contract — `latest` docs track `main`, so pin the release and verify against its docs
- See best-practices/ for the pattern and pitfall checklist

## Expected Outcome

- One definition renders the right marks on the right surface, responsive and accessible
- Scales, guides, and layers encode the question without misleading defaults
