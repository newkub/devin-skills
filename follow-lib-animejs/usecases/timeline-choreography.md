# Use Case — Choreographed Page Entrance With a Timeline

> Run a multi-step entrance (hero → cards → call to action) in one ordered timeline that can be paused, seeked, and replayed. Source: https://animejs.com/documentation (accessed 2026-10-20)

## 1. Install and import

```bash
bun add animejs
```

```ts
import { createTimeline, stagger, utils } from "animejs"
```

## 2. Build the timeline

```ts
const tl = createTimeline({
  defaults: { duration: 600, ease: "outQuad" },
  autoplay: false,
})

tl.label("start")
  .add(".hero", { opacity: [0, 1], y: [24, 0] })
  .add(".card", { opacity: [0, 1], y: [16, 0], delay: stagger(80) }, "-=300")
  .add(".cta", { scale: [0.9, 1], opacity: [0, 1] }, "<+=150")
```

- Positions are relative to the previous animation: `"-=300"` overlaps, `"<"` starts with the previous step, `"<+=150"` starts 150 ms after it.
- `label()` names a point so later work can target it with `tl.add(..., "start")` instead of hard-coded offsets.

## 3. Control playback from UI state

```ts
const prefersReduced = matchMedia("(prefers-reduced-motion: reduce)").matches

if (prefersReduced) {
  utils.set(".hero, .card, .cta", { opacity: 1, y: 0, scale: 1 })
} else {
  tl.play()
}

// later
tl.pause()
tl.seek("start")   // jump to a label or a millisecond value
tl.restart()
tl.stretch(1200)   // rescale the whole timeline to 1200 ms without rebuilding it
```

## 4. Clean up when the component unmounts

```ts
const controller = tl.pause()
// framework teardown
controller.revert()
```

React/Vue/Svelte teardown should call `revert()` on the timeline or on the surrounding `createScope()`, never leave the instance running.

## Pitfalls

- Rebuilding the timeline on every state change → animations stack; build once, then `play`/`seek`/`restart` the existing instance.
- Using absolute millisecond offsets for every step → one duration change breaks the whole chain; use relative positions and labels.
- Animating `width`/`height`/`top` inside the timeline → layout thrash; animate `transform` and `opacity` instead.
- Forgetting the reduced-motion branch → the content stays invisible for users who disable animation, because `opacity: [0, 1]` never runs.

## Related

- `references/apis.md`
- `best-practices/animejs.md`
- `usecases/stagger-grid.md`
