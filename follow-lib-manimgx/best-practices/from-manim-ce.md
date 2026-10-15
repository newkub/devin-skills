# ManimGX — Coming From Manim CE

## Recommended Patterns

### Migration Order

- copy the scene into a new file in the ManimGX project then run `manimgx inspect` without changing anything yet — the first signal is the CLI's error/hint, not grepping for renames yourself
- change imports to `import manimgx as m` first (Manim CE module paths don't exist in GX), then chase the API names
- use the hints from errors as your guide: the CLI prints the failing line and the new name (`ShowCreation is Create in ManimGX`)
- run `ty check` after restoring imports — it catches keywords the runtime would ignore silently
- take an output snapshot of the CE scene (script + reference frames) to compare composition, then compare against the GX storyboard moment by moment

### Name Map

- rename deprecated names (old names still work but the editor will mark them): `ShowCreation` → `Create`, `arrange_submobjects` → `arrange`, `PGroup` → `Group`, `add_foreground_mobject` → `add_foreground_mobjects`, `get_edge_center(m.UP)` → `get_top()`
- `rotate_about_origin(angle)` → `rotate(angle, about_point=m.ORIGIN)`
- `MovingCameraScene` → `Scene` — in GX the camera of every scene can move
- `ApplyMethod(square.scale, 2)`, `ScaleInPlace(square, 2)`, `FadeToColor(square, m.RED)` → `.animate`: `square.animate.scale(2)`, `square.animate.set_color(m.RED)`
- `VGroup` ≡ `Group`, `c2p` ≡ `coords_to_point` — both are kept; docs use the first name

### Behavior Differences To Re-check

- CE's quality flags (`-ql`, `-qh`) don't exist in GX → use `-r <WxH>` and `--fps <n>` instead
- vertical frame: CE is ~4.5 units wide, but GX is 8 units wide (~14.2 tall) — the short frame side is always 8 units — layouts based on the old values must be recomputed, or set `config.frame_height`
- every frame shows the scene at its own time at every fps, and the video ends with the scene's last frame — scenes relying on "the last frame isn't drawn" like CE will differ
- `.animate` applies when the animation starts; inside `Succession` each `.animate` starts from the previous one's end
- rotation turns the whole object as a rigid piece around a single point — CE scenes composing nested rotations should be checked
- animations of one mobject starting together are combined (movements add up)
- LaTeX → Typst: `Tex`/`MathTex` work without a LaTeX install, but LaTeX packages and `\def` macros aren't converted — scenes relying on `\\usepackage` or custom macros must rewrite that math in Typst-compatible form or use `Text`

### Plugin Replacements

- `manim-voiceover` → built in: `with self.voiceover(...) as tracker:` + `run_time=tracker.duration` → `self.say("... [words] ...", anims...)`
- `manim-slides` → built in: `self.next_slide()` → `self.next_section()`, `loop=True` → `"presentation.loop"`, `notes=` unchanged; open with `manimgx present`
- shape booleans coming from plugins/`manimpango` and CJK text are still unsupported on the browser path — check first whether you need them

## Do / Don't

| Do | Don't |
|---|---|
| use `.animate` for methods that were `ApplyMethod` | keep `ApplyMethod` because "it still runs" |
| re-check the vertical frame size (8 × ~14.2) | copy CE's 9:16 coordinates directly |
| rewrite math relying on `\def`/packages | be puzzled why formulas silently disappear |
| run the GX scene on a CE setup to compare | confuse `no module named manimgx` for a GX problem (it's really the environment) |

## Common Pitfalls

- the usual trip-up is helper `import` paths: `from manimgx.utils.polylabel import polylabel` → doesn't work, use `from manimgx import polylabel`
- misspelled keywords or ones lost since CE won't error — the result changes silently, e.g. `fill_colour` makes a shape transparent
- deprecated names still run, but `ty`/the editor will mark them as deprecated — the migration is truly done when no marks remain
- scenes relying on frame counting in an updater behave differently from CE because GX passes exact dt per call — rewrite as time-based
