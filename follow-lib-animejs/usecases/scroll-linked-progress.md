# Use Case — Scroll-Linked Reveals and Progress

> Drive animations from scroll position with `onScroll()` instead of a scroll listener, and keep the work on the compositor. Source: https://animejs.com/documentation/on-scroll (accessed 2026-10-20)

## 1. Reveal on enter, once

```ts
import { animate, onScroll, stagger } from "animejs";

animate(".card", {
  y: [40, 0],
  opacity: [0, 1],
  delay: stagger(60),
  autoplay: onScroll({
    target: ".card-grid",
    enter: "bottom bottom",
    exit: "top top",
  }),
});
```

`onScroll()` returns a playable that starts and pauses the animation as the target crosses the thresholds. `enter: "bottom bottom"` means "when the grid's bottom edge meets the viewport's bottom edge".

Use this form for entrance effects: it plays forward on entry and simply pauses on exit — nothing to reset.

## 2. Scrub a progress bar to scroll position

```ts
animate(".progress-bar", {
  scaleX: [0, 1],
  ease: "linear",
  autoplay: onScroll({
    target: ".article",
    sync: true,
    enter: "top top",
    exit: "bottom bottom",
  }),
});
```

`sync: true` maps the animation's progress to the scroll range instead of playing on a timeline — scrolling up rewinds it. Use `sync: 0.3` (a number) to smooth out wheel jitter; the cost is a few frames of lag.

`ease: "linear"` matters here. A non-linear ease on a scrubbed animation makes the bar move at a different speed than the finger.

## 3. Debug the thresholds before shipping

```ts
onScroll({
  target: ".article",
  enter: "top top",
  exit: "bottom bottom",
  debug: true,
});
```

`debug: true` renders the trigger and target markers so you can see exactly where the range starts. Remove it before shipping — it injects DOM into `document.body`.

## 4. Verify

1. `/run-dev`, scroll slowly both directions — the bar follows and rewinds
2. Scroll fast past the section — no stuck half-transparent card
3. Resize the viewport with the section mid-range — thresholds recompute, the card does not vanish
4. Reduced motion → `/follow-lib-animejs` `usecases/reduced-motion-and-cleanup.md`
5. `/run-build` — confirm the animation is not re-created on route change

## Pitfalls

- Adding a `scroll` listener that calls `animate()` per event — thousands of animations instead of one scrubbed one.
- Thresholds written as pixel values, which break on mobile URL-bar resize; use the `"<target-edge> <viewport-edge>"` form.
- Combining `sync: true` with `loop: true`, which makes the animation wrap at the range boundary.
- Leaving `debug: true` in production — the markers are visible and overlay clicks.
- Animating `top` or `height` while scrubbing, which forces layout every frame; animate `transform` and `opacity`.

## Related

- `references/apis.md`
- `best-practices/animejs.md`
- `usecases/timeline-choreography.md`
- `usecases/reduced-motion-and-cleanup.md`
