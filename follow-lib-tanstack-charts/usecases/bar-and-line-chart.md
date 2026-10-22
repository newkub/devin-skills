# Use Case — Bar and Line from One Record Array

> One row per month, one bar series and one line series sharing the same scales. The grammar composes marks instead of switching chart types. Source: https://tanstack.com/charts/latest/docs/quick-start (accessed 2026-10-20)

## 1. Keep the rows you already have

```ts
// src/charts/revenue-data.ts
export type RevenueRow = {
  id: string;
  month: string;
  online: number;
  retail: number;
};

export const revenueRows: readonly RevenueRow[] = [
  { id: "jan", month: "Jan", online: 120_000, retail: 80_000 },
  { id: "feb", month: "Feb", online: 150_000, retail: 95_000 },
  { id: "mar", month: "Mar", online: 170_000, retail: 110_000 },
];
```

One row per x value, one field per series. Channels are type-filtered, so `month` is accepted by a band x channel and the number fields by the y channel. The unique `id` gives each observation stable scene and interaction identity without a separate `key`.

## 2. Compose two marks

```ts
// src/charts/revenue-chart.ts
import { barY, defineChart, lineY } from "@tanstack/charts";
import { scaleBand } from "@tanstack/charts/scales/band";
import { scaleLinear } from "@tanstack/charts/scales/linear";
import type { RevenueRow } from "./revenue-data";

export function revenueChart(rows: readonly RevenueRow[]) {
  return defineChart({
    marks: [
      barY(rows, {
        id: "online-bars",
        x: "month",
        y: "online",
        fill: "var(--chart-1)",
      }),
      lineY(rows, {
        id: "retail-line",
        x: "month",
        y: "retail",
        stroke: "var(--chart-2)",
        strokeWidth: 2,
        points: true,
      }),
    ],
    scales: {
      x: {
        scale: () => scaleBand<string>().padding(0.2),
        axis: { label: "Month" },
      },
      y: {
        scale: scaleLinear,
        nice: true,
        grid: true,
        axis: { label: "Revenue (USD)" },
      },
    },
  });
}
```

Both marks read the same rows and share the same scales. Bars start at zero; the line sits on that same quantitative scale, so the two encodings stay comparable. Array order is paint order, which puts the line above the bars.

## 3. Memoize the complete definition

```tsx
// src/components/revenue-card.tsx
import { useMemo } from "react";
import { Chart } from "@tanstack/charts/react";
import { revenueChart } from "@/charts/revenue-chart";
import type { RevenueRow } from "@/charts/revenue-data";

export function RevenueCard({ rows }: { rows: readonly RevenueRow[] }) {
  const definition = useMemo(() => revenueChart(rows), [rows]);

  return (
    <section className="h-80 min-h-0">
      <Chart
        definition={definition}
        ariaLabel="Monthly revenue: online bars and retail line"
      />
    </section>
  );
}
```

The definition closes over `rows`, so it must be rebuilt when the rows change and preserved otherwise. A `defineChart` call inline in JSX repaints on every render and drops focus state.

## 4. Theme through chart paint

```ts
fill: "var(--chart-1)",   // bar paint override
stroke: "var(--chart-2)", // line paint override
```

`fill` and `stroke` are final paint overrides, which is correct for one series per mark. When color should encode data instead, switch to `z`/`color` and a chart-level `color.scale` so categories keep the same color across charts.

## 5. Handle loading and empty states before mounting

```tsx
if (isLoading && rows.length === 0) return <ChartSkeleton />;
if (rows.length === 0) {
  return <p className="text-muted">No revenue data for this period</p>;
}
```

The chart renders axes for empty data rather than inventing a message. Decide the state in the component so an empty chart is never shown as if it were a result.

## 6. Verify

1. Every bar height and line point matches its source row
2. Hover and keyboard focus report the month plus both values
3. Empty rows → the empty message, not a blank axis
4. One row → a single bar and a single point, no crash
5. Resize the card → bars keep their band padding and labels stay readable
6. Typecheck → renaming `retail` to `retailRevenue` fails until the channel is updated

## Pitfalls

- Reshaping rows into a series container — marks take the rows directly.
- Giving both marks the same `id`, which breaks identity between updates.
- Using `y1`/`y2` when a plain length is meant, or `y` when an interval is meant.
- Starting the y axis above zero for bars, which exaggerates the differences.
- Connecting unordered categories with `lineY` — a line implies an ordered continuum.
- Rebuilding the definition on every render instead of memoizing it against its inputs.
- Applying pre-1.0 `primaryAxis`/`secondaryAxes` examples from older docs — `1.x` uses marks and scales.

## Related

- `references/apis.md`
- `best-practices/tanstack-charts.md`
- `usecases/time-series-dashboard.md`
- `usecases/stacked-and-grouped-bars.md`
