# Use Case — SVG Line Drawing and Shape Morphing

> Animate SVG strokes as if drawn by hand, then morph one icon into another without swapping elements. Source: https://animejs.com/documentation/svg (accessed 2026-10-20)

## 1. Turn strokes into drawable elements

```ts
import { animate, svg } from "animejs";

const drawables = svg.createDrawable(".logo path, .logo circle");
animate(drawables, {
  draw: ["0 0", "0 1"],
  duration: 1200,
  delay: (_, i) => i * 120,
  ease: "inOutSine",
});
```

`createDrawable()` converts each selected `path`, `line`, `polyline`, `polygon`, `circle`, `ellipse`, or `rect` into a `<path>` with a computed `stroke-dasharray`. The `draw` property is a two-value range over the stroke length: `"0 0"` hides it, `"0 1"` fully draws it.

The conversion happens once, at call time. Elements added later (lazy content, route change) are not drawable — call `createDrawable()` again for the new subtree.

## 2. Morph between two shapes

```ts
animate("#icon-close", {
  points: svg.morphTo("#icon-menu"),
  duration: 500,
  ease: "inOutQuad",
});
```

Both targets must be `<path>` elements with the same number of points, or the interpolation produces visible jumps. Authoring rule: draw the two icons in the same editor from the same node count, or use the morph only between variants of one glyph.

`morphTo()` is a property value, not a standalone animation — the target stays in the DOM and keeps its own event listeners, which is why icon toggles keep working mid-animation.

## 3. Keep the geometry honest

```ts
const [logo] = svg.createDrawable(".logo path");
const total = logo.getTotalLength();
if (!Number.isFinite(total) || total === 0) {
  throw new Error("logo path has no measurable length — check viewBox and d");
}
```

A zero-length path usually means an empty `d`, a hidden ancestor (`display: none` gives zero geometry), or a malformed `viewBox`. The animation then runs invisibly instead of failing loudly.

## 4. Verify

1. `/run-dev` — strokes draw in order, no flash of the finished logo on first paint
2. Toggle the icon twice quickly — the morph must reverse, not queue
3. Resize the container — a stroke that was uniform now scales, so confirm `vector-effect="non-scaling-stroke"` is set when the stroke width must stay constant
4. `/run-build` — the `animejs` import tree-shakes; a bundle jump means the whole engine was pulled in for one icon

## Pitfalls

- Animating `d` directly instead of using `morphTo()`, which only works for same-structure paths and skips the interpolation setup.
- Calling `createDrawable()` inside a resize or scroll handler, rebuilding the path elements on every frame.
- Morphing a `<polygon>` into a `<path>` — the conversion is one-way and the target selector must resolve to the same element type.
- Forgetting that `draw` needs `stroke` set; a fill-only icon renders nothing.

## Related

- `references/apis.md`
- `best-practices/animejs.md`
- `usecases/timeline-choreography.md`
- `usecases/reduced-motion-and-cleanup.md`
