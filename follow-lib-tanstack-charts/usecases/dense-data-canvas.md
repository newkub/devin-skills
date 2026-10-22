# Use Case — Dense Series on Canvas Without Losing Axes

> Tens of thousands of points make SVG reconciliation the bottleneck. Canvas is opt-in per mark, so the dense geometry moves while axes, labels, and highlights stay SVG. Source: https://tanstack.com/charts/latest/docs/concepts/marks-and-layering (accessed 2026-10-20)

## 1. Measure the real cost first

```ts
// src/charts/metrics-data.ts
export type MetricSample = {
  id: string;
  at: Date;
  low: number;
  high: number;
  mean: number;
};

export function buildSamples(count: number, start: Date): MetricSample[] {
  return Array.from({ length: count }, (_, index) => {
    const at = new Date(start.getTime() + index * 60_000);
    const wave = Math.sin(index / 40) * 12;
    return {
      id: `sample-${index}`,
      at,
      low: 40 + wave,
      high: 60 + wave,
      mean: 50 + wave,
    };
  });
}
```

Downsample or aggregate first when the reader only needs the shape. Keep raw per-point geometry only when points or intervals are meaningful — that is the case Canvas is for. Measure the SVG render before switching so the change has a baseline.

## 2. Opt the heavy mark into Canvas

```ts
// src/charts/metrics-chart.ts
import { areaY, defineChart, lineY } from "@tanstack/charts";
import { canvasChartRenderer } from "@tanstack/charts/canvas";
import { scaleLinear } from "@tanstack/charts/scales/linear";
import { scaleUtc } from "d3-scale";
import type { MetricSample } from "./metrics-data";

export function metricsChart(samples: readonly MetricSample[]) {
  return defineChart({
    marks: [
      areaY(samples, {
        id: "dense-range",
        x: "at",
        y1: "low",
        y2: "high",
        renderer: canvasChartRenderer,
        fill: "var(--chart-1)",
        fillOpacity: 0.18,
      }),
      lineY(samples, {
        id: "mean-line",
        x: "at",
        y: "mean",
        stroke: "var(--chart-2)",
        strokeWidth: 1.5,
      }),
    ],
    scales: {
      x: { scale: scaleUtc, axis: { label: "Time" } },
      y: {
        scale: scaleLinear,
        nice: true,
        grid: true,
        axis: { label: "Requests per minute" },
      },
    },
  });
}
```

Only marks with `renderer: canvasChartRenderer` paint to Canvas. The line and every axis, tick, and grid stay SVG, and declaration order is preserved across the SVG and Canvas layers. Canvas adds no new interaction model — focus, tooltips, and keyboard navigation still use the shared host.

## 3. Reuse the renderer instance

```ts
import { canvasChartRenderer } from "@tanstack/charts/canvas";

// module scope: imported once, stable identity
```

`canvasChartRenderer` is an exported singleton with stable identity. Creating a renderer per render or changing the renderer sequence replaces the affected layer composition instead of reconciling it. Importing `@tanstack/charts/canvas` is the opt-in boundary that puts the painter in the bundle.

## 4. Use whole-chart Canvas only for a reason

```tsx
import { Chart } from "@tanstack/charts/react/canvas";
```

The `/canvas` entry paints the whole chart, axes included. That trades away SVG text and parts of the SVG export path, so prefer per-mark Canvas unless the entire surface is paint-heavy. `/core` exists for a renderer-neutral `<Chart>` that requires an explicit renderer.

## 5. Keep accessibility and export honest

- Set `ariaLabel` — keyboard focus is on by default once the chart is named
- Keep a table or summary for exact values; Canvas pixels are not selectable text
- Verify SVG and image export after adding Canvas marks — do not assume a Canvas layer is present in an SVG serialization
- Keep highlight dots, labels, and the focused series in SVG so hover and focus remain crisp

## 6. Verify

1. Record the SVG baseline render time and compare after the switch
2. Zoom or resize — the Canvas layer stays aligned with the SVG axes
3. Hover and Tab — tooltip and focus still resolve to the right data point
4. Export to SVG and to an image — confirm which layers are included before shipping
5. Remove `renderer` from the heavy mark — the chart must still render on SVG
6. Typecheck — `renderer` is accepted by the Cartesian mark options, not passed to `defineChart`

## Pitfalls

- Sending axes, labels, and highlights to Canvas, losing selectable text and crisp small geometry.
- Creating a new renderer per render, which replaces the layer instead of reconciling it.
- Forgetting to import `@tanstack/charts/canvas`, so `canvasChartRenderer` is undefined.
- Switching to Canvas before aggregating data that the reader only needs at a coarser grain.
- Assuming Canvas removes the need for stable `id`/`key` values between updates.
- Shipping export or print features without checking that the Canvas layer is included.
- Putting `renderer` on the chart definition instead of on the mark options.

## Related

- `references/apis.md`
- `best-practices/tanstack-charts.md`
- `usecases/time-series-dashboard.md`
- `usecases/range-and-threshold.md`
