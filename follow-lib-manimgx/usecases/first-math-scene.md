# Use Case — First Math Scene From Install to MP4

> Install ManimGX on the right interpreter, write a 2D scene that stays in frame, inspect it, then render. Source: https://manimgx.academa.ai/llms.txt (accessed 2026-10-20)

## 1. Install on Python 3.13 or 3.14

```bash
uv tool install --python 3.14 manimgx
manimgx --version
```

Without `--python 3.14` uv uses the machine default and cannot resolve the package. Do not install `manim`, ffmpeg, or LaTeX — ManimGX bundles rendering and uses Typst for typesetting.

## 2. Write the scene

```python
import manimgx as m


class Quadratic(m.Scene):
    def construct(self):
        eq = m.MathTex(r"x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}")
        eq.scale(0.9)

        self.play(m.Write(eq), run_time=2)
        self.wait(1)

        self.play(eq.animate.shift(m.UP * 1.5).scale(0.8))
        self.wait(1)
```

Time advances only through `self.play(...)` and `self.wait(...)`; `self.add(...)` shows a mobject without advancing.

## 3. Keep everything inside the frame

The frame is 14.2 × 8 centered at the origin, so every point must stay within x ∈ [-7, 7] and y ∈ [-4, 4]. Scale text before animating it in, and shift rather than place at the edge.

## 4. Inspect before rendering

```bash
manimgx inspect scene.py
```

`inspect` prints the timeline with code lines, writes `Quadratic.storyboard.png`, and exits 1 on layout problems (cut-off mobjects, overlapping text, unreadable size). Open the storyboard and check that the scene communicates.

```bash
manimgx inspect scene.py -t 1.5,end -o detail.png
```

## 5. Render

```bash
manimgx render scene.py
```

Default output is 1920×1080 at 60 fps next to the scene file. Use `-r 1280x720 --fps 30` for a quick draft or `-r 1080x1920` for vertical video.

## 6. Type-check before the next edit

```bash
uvx ty check --python .venv/Scripts/python.exe scene.py
```

At runtime most mobjects accept unknown keywords silently; `ty` is what catches `m.Circle(colour=m.BLUE)`.

## Pitfalls

- Rendering without `inspect` → layout errors only appear after a full render; inspect is the cheap gate.
- Counting frames in an updater → results differ per fps; derive state from time or other objects.
- Using Manim CE module paths → `manimgx` exposes everything on `m`; write `m.MathTex(...)`.
- Forgetting `r"..."` on `MathTex` → backslashes in the formula are parsed as escapes.

## Related

- `references/apis.md`
- `references/cli.md`
- `best-practices/scene-authoring.md`
- `usecases/narrated-video.md`
