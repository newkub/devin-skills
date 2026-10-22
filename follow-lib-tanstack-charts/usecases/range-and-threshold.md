# Use Case — Range Bands, Targets, and Annotations

> A low/high temperature band, a target rule, and a label are three marks with different data on one set of scales. Layer order and one interaction owner keep it readable. Source: https://tanstack.com/charts/latest/docs/concepts/marks-and-layering (accessed 2026-10-20)

## 1. Keep interval rows explicit

```ts
// src/charts/temperature-data.ts
export type DailyRange = {
  id: string;
  date: Date;
  low: number | null;
  high: number | null;
};
```

Two endpoints per row mean interval semantics. `y1`/`y2` keeps both sides in scale materialization instead of defaulting the baseline to zero. Missing endpoints split the band at that day.

## 2. Layer band, rule, lines, and label

```ts
// src/charts/temperature-chart.ts
import {
  areaY,
  defineChart,
  lineY,
  ruleY,
  text,
} from "@tanstack/charts";
import { decorative } from "@tanstack/charts/mark/decorative";
import { scaleLinear } from "@tanstack/charts/scales/linear";
import { scaleUtc } from "d3-scale";
import type { DailyRange } from "./temperature-data";

export function temperatureChart(days: readonly DailyRange[], target: number) {
  const last = days[days.length - 1];
  const targetLabels = last
    ? [
        {
          id: "target-label",
          date: last.date,
          value: target,
          label: `Target ${target}°F`,
        },
      ]
    : [];

  return defineChart({
    marks: [
      areaY(days, {
        id: "daily-range",
        x: "date",
        y1: "low",
        y2: "high",
        fill: "var(--chart-1)",
        fillOpacity: 0.2,
      }),
      ruleY([target], {
        id: "target-rule",
        stroke: "var(--chart-4)",
        strokeDasharray: "4 2",
      }),
      decorative(
        lineY(days, {
          id: "low-line",
          x: "date",
          y: "low",
          stroke: "var(--chart-2)",
          strokeWidth: 1.5,
        }),
      ),
      lineY(days, {
        id: "high-line",
        x: "date",
        y: "high",
        stroke: "var(--chart-3)",
        strokeWidth: 1.5,
      }),
      text(targetLabels, {
        id: "target-label-mark",
        x: "date",
        y: "value",
        text: "label",
      }),
    ],
    scales: {
      x: { scale: scaleUtc, axis: { label: "Day" } },
      y: {
        scale: scaleLinear,
        nice: true,
        grid: true,
        axis: { label: "Temperature (°F)" },
      },
    },
  });
}
```

Paint order is declaration order: the band establishes context, the target rule crosses it, the lines carry the endpoints, and the label sits on top. `ruleY([target])` takes the value directly and spans the inner chart width. `decorative(...)` keeps the low line painted and measurable but removes its interaction points, so the high line is the single focus owner and does not compete for keyboard stops.

## 3. Annotate with the mark, not a second chart

```ts
text([{ id: "target-label", date: lastDate, value: target, label: "Target 65°F" }], {
  id: "target-label-mark",
  x: "date",
  y: "value",
  text: "label",
});
```

An annotation is another mark with its own rows, channels, and identity. There is no separate overlay subsystem, and the label follows the same x/y scales as the data.

## 4. Decide about clipping

```ts
const chart = defineChart({
  marks,
  scales,
  clip: true,
});
```

`clip: true` stops marks from painting outside the resolved plot rectangle; axes and legends are unaffected. Leave it off when a label or marker is meant to extend beyond the plot.

## 5. Verify

1. The band's lower edge lands on every `low` and upper edge on every `high`
2. The rule sits exactly at the target value and spans the plot
3. A `null` endpoint produces a visible gap, not a band collapsing to zero
4. Tab moves through exactly one interactive series — not two overlapping lines
5. The label stays inside the card at the smallest supported width
6. Typecheck rejects a string in `y1`, `y2`, or the rule value

## Pitfalls

- Passing one value to `y` when the data is an interval, which turns the band into an area from zero.
- Zero-filling missing endpoints, inventing data the sensor never reported.
- Leaving both endpoint lines interactive, so keyboard focus stops twice per point.
- Building the target as a second chart or an absolutely positioned div instead of a `ruleY` mark.
- Forgetting `decorative` on helper geometry and creating duplicate tooltips.
- Turning on `clip: true` and then clipping the annotation that was supposed to sit outside.
- Forgetting `d3-scale` when importing `scaleUtc`.

## Related

- `references/apis.md`
- `best-practices/tanstack-charts.md`
- `usecases/time-series-dashboard.md`
- `usecases/dense-data-canvas.md`
