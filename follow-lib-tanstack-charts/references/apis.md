| key | value |
|---|---|
| install | `bun add @tanstack/charts` |
| package registry | https://www.npmjs.com/org/tanstack |
| repo | https://github.com/TanStack/charts |
| docs | https://tanstack.com/charts/latest |

| Package | Lib |
|---------|-----|
| `@tanstack/charts` | chart grammar, common marks, transforms, DOM host, static SVG |
| `@tanstack/charts/react` | React `<Chart>` adapter (SVG default) |
| `@tanstack/charts/react/canvas` | Canvas-only React `<Chart>` |
| `@tanstack/charts/react/core` | renderer-neutral React `<Chart>` |

| Entry point | Public API |
|---|---|
| `@tanstack/charts` | `defineChart`, `mountChart`, `lineY`, `barY`, `areaY`, `dot`, `ruleY`, `text`, `group`, `stack`, `colorLegend` |
| `@tanstack/charts/scales/band` | `scaleBand` |
| `@tanstack/charts/scales/linear` | `scaleLinear` |
| `@tanstack/charts/scales/point` | `scalePoint` |
| `@tanstack/charts/scales/ordinal` | `scaleOrdinal` |
| `@tanstack/charts/tooltip` | `tooltip` extension |
| `@tanstack/charts/canvas` | `canvasChartRenderer`, `mountCanvasChart` |
| `@tanstack/charts/mark/decorative` | `decorative` wrapper for non-interactive helper layers |
| `@tanstack/charts/selection` | `keyedSelection`, `whenSelected` |
| `@tanstack/charts/interaction/brush` | `brushX` |
| `@tanstack/charts/interaction/zoom` | `zoomX` |
| `@tanstack/charts/export` | SVG serialization and image export |

Scales outside linear/band/point/ordinal (time, log, power, quantile, diverging) come from `d3-scale` and must be installed directly.
