# Use Case — Time Series in a Responsive Dashboard Card

> Plot real timestamps, keep the chart sized to its card, and refresh without remounting. Time scales come from `d3-scale`; everything else stays in the compact grammar. Source: https://tanstack.com/charts/latest/docs/concepts/chart-definitions (accessed 2026-10-20)

## 1. Keep dates as `Date` and gaps as `null`

```ts
// src/charts/latency-data.ts
export type LatencySample = {
  id: string;
  at: Date;
  p95: number | null;
};
```

`number | null` is a valid positional channel because line and area marks define missing-value behavior. The line splits at a missing reading, which is evidence that no measurement was materialized — not a zero.

## 2. Use a time scale and a responsive builder

```ts
// src/charts/latency-chart.ts
import { areaY, defineChart, lineY } from "@tanstack/charts";
import { scaleLinear } from "@tanstack/charts/scales/linear";
import { scaleUtc } from "d3-scale";
import type { LatencySample } from "./latency-data";

export function latencyChart(readings: readonly LatencySample[]) {
  return defineChart({
    chart: ({ width }) => ({
      marks: [
        areaY(readings, {
          id: "p95-area",
          x: "at",
          y: "p95",
          fill: "var(--chart-1)",
          fillOpacity: 0.15,
        }),
        lineY(readings, {
          id: "p95-line",
          x: "at",
          y: "p95",
          stroke: "var(--chart-1)",
          strokeWidth: 2,
        }),
      ],
      scales: {
        x: {
          scale: scaleUtc,
          axis: {
            label: "Time",
            ticks: { count: width < 480 ? 3 : 6 },
          },
        },
        y: {
          scale: scaleLinear,
          nice: true,
          grid: true,
          axis: { label: "p95 latency (ms)" },
        },
      },
    }),
  });
}
```

The `chart` builder receives the resolved `width` and `height`; it must stay pure. Tick density is the common reason to use it — a fixed six ticks overlaps on a phone. `scaleUtc` requires `bun add d3-scale` and `@types/d3-scale` in the app.

## 3. Give the card a height

```tsx
// src/components/latency-card.tsx
import { useMemo } from "react";
import { Chart } from "@tanstack/charts/react";
import { latencyChart } from "@/charts/latency-chart";
import type { LatencySample } from "@/charts/latency-data";

export function LatencyCard({ readings }: { readings: readonly LatencySample[] }) {
  const definition = useMemo(() => latencyChart(readings), [readings]);

  return (
    <section className="h-72 min-h-0">
      <Chart definition={definition} ariaLabel="p95 latency over time" />
    </section>
  );
}
```

Omit `width` so the host follows the container. `min-h-0` inside a flex column stops the card from growing without bound. A parent with no height renders a zero-height chart that looks like a failure.

## 4. Refresh without remounting

```tsx
const { data, isLoading } = useQuery({
  queryKey: ["latency", range],
  queryFn: () => fetchLatency(range),
  refetchInterval: 30_000,
});

if (isLoading && !data) return <ChartSkeleton />;
return <LatencyCard readings={data ?? []} />;
```

Each poll produces new rows and therefore a new definition. The adapter reconciles by mark and datum keys, so focus, tooltip, and viewport state survive. Do not put `key={range}` on the card — that remounts the chart and throws the state away.

## 5. Keep it readable on a phone

1. Derive tick count from `width` in the responsive builder
2. Cut the number of series before shrinking the card — three lines on a phone is noise
3. Provide a table view of the same readings when exact values matter

## 6. Verify

1. Tooltip and focused point show the real timestamp, not a raw number
2. A `null` reading shows a gap, not a drop to zero
3. Empty array and a single point both render without crashing
4. Resizing the card reflows the chart with no horizontal scrollbar
5. Poll for a minute — the chart updates without a flash or lost focus
6. Typecheck catches a string date passed to the x channel

## Pitfalls

- Formatting dates to strings before the channel, which turns time spacing into categories.
- Filling missing readings with `0`, inventing latency drops that never happened.
- Fetching or mutating inside the `chart` builder — it should only read resolved size.
- Omitting the card height, so the chart resolves to zero pixels.
- Rebuilding the definition without `useMemo`, which repaints on every parent render.
- Putting `key={range}` on the chart, which discards focus and tooltip state.
- Importing `scaleUtc` without declaring `d3-scale` as a direct dependency.

## Related

- `references/apis.md`
- `best-practices/tanstack-charts.md`
- `usecases/bar-and-line-chart.md`
- `usecases/range-and-threshold.md`
