# Use Case — Staggered Grid Reveal

> Reveal a grid of cards in a wave that starts from the center and follows the real column count. Source: https://animejs.com/documentation (accessed 2026-10-20)

## 1. Read the grid geometry

`stagger()` needs the column count to compute the wave. Read it from CSS instead of hard-coding it, so responsive layouts stay correct.

```ts
function gridColumns(el: HTMLElement) {
  return getComputedStyle(el).gridTemplateColumns.split(" ").filter(Boolean).length
}
```

## 2. Animate with a grid stagger

```ts
import { animate, stagger } from "animejs"

const container = document.querySelector<HTMLElement>(".card-grid")!
const cards = container.querySelectorAll(".card")

animate(cards, {
  opacity: [0, 1],
  y: [24, 0],
  duration: 500,
  delay: stagger(60, {
    grid: [gridColumns(container), 1],
    from: "center",
  }),
  ease: "outCubic",
})
```

- `grid: [columns, rows]` makes the delay follow 2D distance; `from: "center"` starts the wave in the middle.
- `from` also accepts a target index or `"first"`/`"last"` when the visual order matters more than the geometry.

## 3. Re-run on resize without stacking

```ts
let running: ReturnType<typeof animate> | null = null

const run = () => {
  running?.revert()
  running = animate(cards, {
    opacity: [1, 1], // resizing is not a reveal: keep cards visible
    y: [0, 0],
    delay: stagger(20, { grid: [gridColumns(container), 1], from: "center" }),
  })
}

const ro = new ResizeObserver(run)
ro.observe(container)
```

## 4. Keep it accessible

```ts
if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
  cards.forEach((card) => card.setAttribute("style", "opacity:1"))
} else {
  // run the reveal
}
```

## Pitfalls

- Passing `grid` with the wrong column count → the wave looks random; recompute from `gridTemplateColumns`.
- Animating every card individually with its own `animate()` → N animation engines; pass the whole NodeList once and let `stagger()` handle timing.
- Leaving `opacity: 0` in CSS when animation is disabled → invisible content; set the final state as the default and animate from a `from` value.
- Re-creating animations on every scroll event → memory growth; keep one instance and `revert()` before replacing it.

## Related

- `references/apis.md`
- `best-practices/animejs.md`
- `usecases/timeline-choreography.md`
