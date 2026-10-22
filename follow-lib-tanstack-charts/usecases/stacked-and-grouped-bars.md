# Use Case — Stacked vs Grouped Bars with a Color Legend

> Bars stack by default; side-by-side geometry is an explicit layout choice. Pick the comparison the reader must make, then let `z` carry series identity. Source: https://tanstack.com/charts/latest/docs/reference/marks/bar-and-rect (accessed 2026-10-20)

## 1. Use long-format rows

```ts
// src/charts/revenue-data.ts
export type RevenueRow = {
  id: string;
  quarter: string;
  channel: string;
  revenue: number;
};

export const revenueRows: readonly RevenueRow[] = [
  { id: "q1-web", quarter: "Q1", channel: "Web", revenue: 120_000 },
  { id: "q1-retail", quarter: "Q1", channel: "Retail", revenue: 80_000 },
  { id: "q1-partner", quarter: "Q1", channel: "Partner", revenue: 40_000 },
  { id: "q2-web", quarter: "Q2", channel: "Web", revenue: 150_000 },
  { id: "q2-retail", quarter: "Q2", channel: "Retail", revenue: 95_000 },
  { id: "q2-partner", quarter: "Q2", channel: "Partner", revenue: 55_000 },
];
```

One row per category × series. `quarter` is the categorical position, `channel` is the series, `revenue` is the length. Giving every row its own `id` keeps scene identity stable when a channel is added or reordered.

## 2. Stack to compare totals

```ts
// src/charts/stacked-revenue.ts
import { barY, colorLegend, defineChart } from "@tanstack/charts";
import { scaleBand } from "@tanstack/charts/scales/band";
import { scaleLinear } from "@tanstack/charts/scales/linear";
import type { RevenueRow } from "./revenue-data";

export function stackedRevenue(rows: readonly RevenueRow[]) {
  return defineChart({
    marks: [
      barY(rows, {
        id: "revenue-bars",
        x: "quarter",
        y: "revenue",
        z: "channel",
      }),
    ],
    scales: {
      x: {
        scale: () => scaleBand<string>().padding(0.25),
        axis: { label: "Quarter" },
      },
      y: {
        scale: scaleLinear,
        nice: true,
        grid: true,
        axis: { label: "Revenue (USD)" },
      },
    },
    color: { legend: colorLegend({ label: "Channel" }) },
  });
}
```

Repeated x positions stack automatically, and positive and negative values diverge from zero. `z` is the series identity; with no separate `color` channel it also feeds the categorical color scale, so the legend labels match the segments.

## 3. Group to compare channels inside a quarter

```ts
import { barY, defineChart, group } from "@tanstack/charts";

export function groupedRevenue(rows: readonly RevenueRow[]) {
  return defineChart({
    marks: [
      barY(rows, {
        id: "revenue-bars",
        x: "quarter",
        y: "revenue",
        z: "channel",
        layout: group({ padding: 0.1 }),
      }),
    ],
    scales: {
      x: {
        scale: () => scaleBand<string>().padding(0.25),
        axis: { label: "Quarter" },
      },
      y: { scale: scaleLinear, nice: true, grid: true },
    },
    color: { legend: colorLegend({ label: "Channel" }) },
  });
}
```

`group()` creates a secondary band scale inside the primary category band, so each channel gets its own sub-band. The primary x scale must be a band scale — `group()` throws when the scale has no `bandwidth`. Pass `group({ scale })` only when subgroup order is fixed application state.

## 4. Configure a stack only when the default is wrong

```ts
import { barY, defineChart, stack } from "@tanstack/charts";

barY(rows, {
  id: "revenue-bars",
  x: "quarter",
  y: "revenue",
  z: "channel",
  layout: stack({
    order: ["Web", "Retail", "Partner"],
    offset: "normalize",
  }),
});
```

`offset` accepts `diverging` (the default), `normalize`, `center`, or `wiggle`. `normalize` answers a proportion question, so label the axis as a share instead of a dollar amount. `order` also accepts input order, absolute-total order, streamgraph order, or an explicit series list.

## 5. Pin category colors across charts

```ts
import { scaleOrdinal } from "@tanstack/charts/scales/ordinal";

const channelColor = scaleOrdinal(
  ["Web", "Retail", "Partner"],
  ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)"],
);
```

Pass it as `color: { scale: channelColor, legend: colorLegend({ label: "Channel" }) }`. Without a configured ordinal scale, the default palette is fine for one chart but may assign different colors in the next one.

## 6. Verify

1. Stacked totals equal the sum of the channel rows per quarter
2. Grouped bars sit side by side inside each quarter with visible gaps
3. Legend entries match the channels present in the data
4. Negative values diverge below zero instead of stacking upward
5. Switching grouped ↔ stacked changes only `layout`, not the rows
6. Typecheck rejects a `layout: group()` on a non-band x scale
7. A null `channel` row throws instead of silently landing in an unnamed group

## Pitfalls

- Adding `layout: group()` when the question is about totals, or dropping it when the question is per-channel.
- Expecting bars to group by default — repeated positions stack.
- Using a continuous color channel as a series identity; only a discrete channel can infer groups.
- Summing incompatible units in one stack, so the total is meaningless.
- Forgetting the legend, leaving `z` colors unexplained.
- Building a legend by hand that disagrees with the resolved color scale.
- Keeping dozens of tiny segments; aggregate the long tail before stacking.

## Related

- `references/apis.md`
- `best-practices/tanstack-charts.md`
- `usecases/bar-and-line-chart.md`
- `usecases/range-and-threshold.md`
