# ManimGX — Scene Authoring

## Recommended Patterns

### File And Class Shape

- 1 scene file = 1 story/1 output — name the file after the content (`derivative.py`) and give the class the same name so the output (`<Scene>.mp4`, `<Scene>.storyboard.png`) is readable
- `def construct(self) -> None:` — add the return type so the checker sees the full signature
- split a reusable scene into sub-classes in the same file when rendering several clips from one mobject set (don't extract an unnecessarily tiny package)
- start from the official quickstart template and edit the values — don't start from a self-designed structure

### Placement Discipline

- compute layout before animating: create mobject → `.to_edge()` / `.next_to(..., buff=)` / `VGroup(...).arrange()` → then `self.play(...)`
- use relative placement (`.next_to(formula, m.DOWN)`) instead of hardcoded `.move_to([x, y, 0])` when the position depends on content — text size changes won't break the layout
- space things with `buff=` always; never add random offsets by hand; `font_size` values that are too small get caught by `inspect`
- every point is a 3-element list `[x, y, 0]` even in 2D

### Timing

- control time with `run_time=` per play and `self.wait(n)` when you want a pause — don't chain plays without timing and hope they sync with the narration
- use `Succession` for sequences, `LaggedStart` for staggers, `AnimationGroup` for simultaneity; animations of one mobject starting together are combined (movements add up)
- a `.animate` chain can carry several methods in order, and inside `Succession` each `.animate` starts from where the previous one ended
- rotation turns the whole rigid piece around a single point — to rotate about the origin use `rotate(angle, about_point=m.ORIGIN)`

### Simulation And Updaters

- an updater receives the exact time since the last call and keeps running while that mobject's animation plays — integrate from dt, not a ++ counter
- use a time-based clock (`lambda mob: f(scene.time)`) so results stay identical at every fps/resolution
- don't use `self.wait()` as the simulation's timing — use the `run_time` of the animation that drives the updater

## Do / Don't

| Do | Don't |
|---|---|
| `import manimgx as m` then call `m.<Name>` | `import manim` or CE-style module paths (`from manimgx.utils.x import y`) |
| raw strings for math: `m.MathTex(r"\int_0^1 x^2 \, dx")` | non-raw strings where the backslash gets eaten by Python |
| `box.animate.shift(m.RIGHT)` | `ApplyMethod(box.shift, ...)`, `ScaleInPlace`, `FadeToColor` (deprecated in GX) |
| `self.add(mob)` to show without animating | assuming `self.add()` delays time (time doesn't advance) |
| everything within x ∈ [-7, 7], y ∈ [-4, 4] | placing mobjects at the frame edge and only noticing when watching the MP4 |
| `m.config.background_color = m.WHITE` after the import | editing config before the import or after the scene starts |

## Common Pitfalls

- misspelled keywords (`colour=`, `fill_oppacity=`) don't error at runtime — the mobject silently swallows the keyword and color/opacity never changes; have `ty` catch it
- every scene's camera can move on its own — no need for `MovingCameraScene` (that class was merged into `Scene`)
- `VGroup` and `Group` work the same, as do `c2p` and `coords_to_point` — the docs mostly use `VGroup`/`c2p`
- advanced LaTeX needing `\def` or `usepackage` won't be converted to Typst — basic/common math works, complex macros don't carry over
- 3D + 2D can coexist, but `inspect`'s 2D layout checks are skipped in a 3D scene — you must read the storyboard yourself
- a file with multiple scenes but no scene name passed to the render command → the CLI can't tell which one

## Testing Notes

- call `SceneClass().render()` without a path to run the scene for real without drawing — a fast smoke test in the test suite
- assert on the scene's time (sum of `run_time`), not the MP4 file size — size/bitrate aren't deterministic across platforms
- if a test must really render, limit it to low resolution (`m.config.pixel_width/height`) so the suite stays fast
