# Use Case — Time Series in a Responsive Dashboard

> Plot timestamps on the x axis, keep the chart sized to its card, and refresh without remounting. Source: https://tanstack.com/charts/latest (accessed 2026-10-20)

## 1. Give the axis real dates

```tsx
type Sample = { at: Date; p95: number };

const data: Sample[] = readings.map((r) => ({ at: new Date(r.at), p95: r.p95 }));
```

Returning a `Date` from `getValue` on the primary axis is what enables time scaling — a formatted string is treated as a category.

## 2. Configure a time-series chart

```tsx
import { useMemo } from "react";
import { Chart } from "@tanstack/react-charts";

export function LatencyChart({ readings }: { readings: Sample[] }) {
  const data = useMemo(() => readings, [readings]);

  return (
    <Chart
      options={{
        data,
        primaryAxis: { getValue: (d) => d.at },
        secondaryAxes: [{ getValue: (d) => d.p95, elementType: "line" }],
      }}
    />
  );
}
```

## 3. Size it to the card, not the window

```tsx
<section class="h-72 min-h-0">
  <LatencyChart readings={readings} />
</section>
```

The chart follows its parent, so the parent must have an explicit height. `min-h-0` inside a flex column is what stops the card from growing without bound.

## 4. Refresh without remounting

```tsx
const { data, isLoading } = useQuery({
  queryKey: ["latency", range],
  queryFn: () => fetchLatency(range),
  refetchInterval: 30_000,
});

return isLoading && !data ? <ChartSkeleton /> : <LatencyChart readings={data ?? []} />;
```

A key change on the component (for example `key={range}`) remounts and drops tooltip state — change the data prop instead.

## 5. Keep it readable on mobile

1. Limit the x axis to a few labeled ticks — a label per reading overlaps below 480px
2. Cut the series count before shrinking the chart; three series on a phone is noise
3. Provide a table view for the same data so numbers stay accessible

## 6. Verify with real data

1. Tooltip shows the timestamp, not a raw number
2. Gaps in the series render as gaps, not as zero values
3. The chart survives an empty array and a single point
4. Resizing the card reflows the chart without a horizontal scrollbar

## Pitfalls

- Formatting dates to strings before passing them in, which turns time scaling into categorical spacing.
- Filling missing readings with `0`, which invents latency drops that never happened.
- A parent with no height, so the chart renders at zero and looks like it failed.
- Recomputing the mapped array inline, causing a remount on every poll.
- Assuming `0.x` API stability across minor versions — pin the version and re-check the docs.
- Trusting `Run typecheck` alone; only a real render proves axis labels and tooltips are correct.

## Related

- `references/apis.md`
- `best-practices/tanstack-charts.md`
- `usecases/bar-and-line-chart.md`
