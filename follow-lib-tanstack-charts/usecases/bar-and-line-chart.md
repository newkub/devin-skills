# Use Case — Bar and Multi-Series Line Chart

> Turn one array of records into a themed chart with a category axis and two series. Source: https://tanstack.com/charts/latest (accessed 2026-10-20)

## 1. Shape the data once

```tsx
type Revenue = { month: string; online: number; retail: number };

const data: Revenue[] = [
  { month: "Jan", online: 120, retail: 80 },
  { month: "Feb", online: 150, retail: 95 },
  { month: "Mar", online: 170, retail: 110 },
];
```

One flat record per x value, one key per series — that is the shape the chart axes read from.

## 2. Render the chart

```tsx
import { useMemo } from "react";
import { Chart } from "@tanstack/react-charts";

export function RevenueChart({ rows }: { rows: Revenue[] }) {
  const data = useMemo(() => rows, [rows]);

  return (
    <Chart
      options={{
        data,
        primaryAxis: { getValue: (d) => d.month },
        secondaryAxes: [
          { getValue: (d) => d.online, elementType: "bar" },
          { getValue: (d) => d.retail, elementType: "line" },
        ],
      }}
    />
  );
}
```

Each entry in `secondaryAxes` is one series; mixing `bar` and `line` in the same chart is a config change, not a second chart.

## 3. Keep the data reference stable

```tsx
const data = useMemo(() => rows.map((r) => ({ ...r })), [rows]);
```

A fresh array on every render forces a full chart re-render. Derive it with `useMemo` and pass the memoized value down.

## 4. Theme with design tokens

```tsx
const seriesColors = {
  online: "var(--chart-1)",
  retail: "var(--chart-2)",
};

secondaryAxes: [
  { getValue: (d) => d.online, elementType: "bar", style: { fill: seriesColors.online } },
  { getValue: (d) => d.retail, elementType: "line", style: { stroke: seriesColors.retail } },
],
```

Colors come from tokens so light/dark mode and rebrands update both series without touching chart code.

## 5. Handle the empty and loading states yourself

```tsx
if (isLoading) return <ChartSkeleton />;
if (data.length === 0) return <p class="text-muted">No revenue data for this period</p>;
```

The chart is headless-ish about state: `data: []` renders an axis and nothing else, which reads as a bug to users.

## Pitfalls

- Building `data` inline in JSX (`data={rows.map(...)}`) so every render remounts the series.
- Putting two values in one `secondaryAxes` entry — each series needs its own entry and its own `getValue`.
- Hardcoding hex colors, which break dark mode and design-system updates.
- Rendering the chart inside a zero-height container; without a sized parent it collapses.
- Assuming the API mirrors Recharts: `0.x` is pre-stable, so read the current docs before porting an example.
- Passing numbers as strings from an API and getting a flat or empty axis — coerce at the data boundary.

## Related

- `references/apis.md`
- `best-practices/tanstack-charts.md`
- `usecases/time-series-dashboard.md`
