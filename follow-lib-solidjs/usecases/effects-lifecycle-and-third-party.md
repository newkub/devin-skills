# Use Case — Effects, Lifecycle, and Imperative Libraries

> A chart, map, or editor instance owns memory outside Solid's graph: create it once on mount, sync it from an effect, and destroy it on cleanup. Source: https://docs.solidjs.com/reference/lifecycle/on-cleanup (accessed 2026-10-20)

## 1. Create the instance once

```tsx
import { createEffect, onCleanup, onMount } from "solid-js";
import Chart from "chart.js/auto";

export function TrendChart(props: { points: number[] }) {
  let canvas!: HTMLCanvasElement;
  let chart: Chart | undefined;

  onMount(() => {
    chart = new Chart(canvas, {
      type: "line",
      data: { labels: [], datasets: [{ label: "Requests", data: props.points }] },
      options: { animation: false, responsive: true },
    });
  });

  createEffect(() => {
    const points = props.points;
    if (!chart) return; // not initialized yet — nothing to sync
    chart.data.datasets[0].data = points;
    chart.update();
  });

  onCleanup(() => chart?.destroy());

  return <canvas ref={canvas} />;
}
```

`onMount` runs after the DOM exists and never on the server; `ref={canvas}` is assigned before it fires. The instance lives in a plain variable, not a signal or store — a store proxy wraps every read and mutates the library's internal identity checks.

## 2. Clean up before each re-run

```tsx
import { createEffect, onCleanup } from "solid-js";

createEffect(() => {
  const roomId = props.roomId; // the only tracked read
  const source = new EventSource(`/api/rooms/${roomId}/events`);
  source.onmessage = (event) => setMessages((prev) => [...prev, JSON.parse(event.data)]);

  onCleanup(() => source.close()); // runs before the next run, and on unmount
});
```

`onCleanup` registered inside an effect belongs to that effect's scope: it runs when the effect re-executes and when the component is disposed. Without it, changing `roomId` leaves the previous `EventSource` open and every room's messages arrive in the same list.

## 3. Subscribe to selected props only

```ts
import { createEffect, on } from "solid-js";

createEffect(
  on(
    () => props.roomId,
    (roomId, previous) => analytics.track("room_changed", { from: previous, to: roomId }),
    { defer: true },
  ),
);
```

`on` takes the dependency list explicitly, so unrelated prop reads inside the callback do not create subscriptions. `defer: true` skips the initial run — the right default for "log a change", where the first render is not a change. On the first real change `previous` is `undefined`, so guard accordingly.

## 4. Read without subscribing

```ts
import { createEffect, untrack } from "solid-js";

createEffect(() => {
  const room = props.room;              // tracked — re-runs on change
  const socket = untrack(connection);   // untracked — a reconnect must not re-run the join
  socket.join(room);
});
```

`untrack` is for values that must be current but must not become dependencies. Use it instead of copying a value into a local at setup, which freezes it forever.

## 5. Group updates that belong together

```ts
import { batch } from "solid-js";

batch(() => {
  setStatus("saving");
  setDraft(nextDraft);
  setDirty(false);
});
```

`batch` runs downstream computations once for the whole group. The same applies inside event handlers with several setters — without it, each setter propagates to every subscriber separately.

## 6. Verify

1. Server render — no `ReferenceError: window is not defined`, and the canvas renders empty until hydration
2. Change `points` ten times — `chart.update()` runs ten times, not once per render pass
3. Unmount the component — `destroy()` runs and the canvas is removed without a leak
4. Change `roomId` — the previous `EventSource` closes before the next one opens (Network panel)
5. First render with `defer: true` — no analytics event; the second `roomId` produces exactly one
6. Change the socket signal — the join effect does not re-run

## Pitfalls

- Putting the library instance in `createStore`/`createMutable` — the proxy breaks class internals and `instanceof` checks.
- Creating the instance inside `createEffect` with no cleanup — every re-run adds another canvas or map layer.
- Registering `onCleanup` after an `await` inside an async callback — the owner is gone, so the cleanup never runs. Register it before the first `await`.
- Reading `props.value` once in `onMount` and expecting it to stay current.
- Using `createEffect` to sync derived state (`createEffect(() => setFull(total()))`) — use a memo or a plain function.
- Touching `document`, `window`, or `localStorage` at module scope, which breaks SSR before any component runs.
- Setting a signal in an effect that also reads it — an infinite loop; move it to the event handler or wrap the read in `untrack`.
- Solid 2.0 replaces `onMount` with `onSettled`, which can return its own cleanup — one more reason to keep instance setup in a single function.

## Related

- `references/apis.md`
- `best-practices/reactivity.md`
- `best-practices/rendering-and-async.md`
- `usecases/control-flow-and-lists.md`
