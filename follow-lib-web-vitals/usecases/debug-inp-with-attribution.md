# Use Case — Find What Makes INP Slow

> Split a slow interaction into input delay, processing, and presentation, then fix the dominant one. Source: https://github.com/GoogleChrome/web-vitals/tree/main/src/attribution (accessed 2026-10-20)

## 1. Switch to the attribution build

```ts
import { onINP } from "web-vitals/attribution";

onINP(
  (metric) => {
    const a = metric.attribution;

    console.table({
      inp: Math.round(metric.value),
      inputDelay: Math.round(a.inputDelay),
      processingDuration: Math.round(a.processingDuration),
      presentationDelay: Math.round(a.presentationDelay),
      target: a.interactionTarget,
    });
  },
  { reportAllChanges: true, includeProcessedEventEntries: true },
);
```

The attribution build ships extra code — use it in a debug session or behind a query flag, never in the default bundle. In v6 `onINP` defaults `includeProcessedEventEntries` to `false`; set it to `true` when you intend to inspect the event entries yourself.

## 2. Read the three phases

| Dominant phase | What it means | Where to look |
|----------------|---------------|---------------|
| `inputDelay` high | the main thread was busy before the handler ran | long tasks, hydration, third-party scripts |
| `processingDuration` high | the event handler itself is slow | state updates, layout thrashing, big lists |
| `presentationDelay` high | rendering after the handler is slow | DOM size, style recalculation, expensive paint |

Fixing presentation when the delay is input costs a week and changes nothing. The split is the entire value of attribution.

## 3. Confirm with long tasks

The package also exports an `onLongTasks` helper for long-task observation — check the current docs for the exact entry point in your version. A long task starting just before the interaction is the usual explanation for `inputDelay`.

```ts
onLongTasks((entry) => console.log("long task", entry.duration, entry.startTime));
```

## 4. Reproduce with throttling

1. Chrome DevTools → Performance → CPU 4× slowdown
2. Click the slow control once, record, and read the trace against the three phases
3. Repeat after the fix and compare the same interaction, not the whole page load

## 5. Verify the fix moved the right number

1. `/run-verify`, then a production-like build — dev mode inflates every phase
2. Interaction still under 200ms at 4× CPU throttling
3. `inputDelay` drops after deferring a third-party script; `processingDuration` drops after memoizing the handler
4. Remove `reportAllChanges` and the attribution import before merging

## Pitfalls

- Measuring INP on a dev server with React/Vue devtools active, which adds its own long tasks to every click.
- Optimizing the largest single interaction and ignoring that INP is about the worst interaction for most users.
- Reading `metric.value` as the average — it is the (near-)worst interaction in the session, which is the point.
- Leaving the attribution build in the production bundle because "it is only a bit bigger".

## Related

- `references/apis.md`
- `best-practices/web-vitals.md`
- `usecases/report-vitals-to-endpoint.md`
