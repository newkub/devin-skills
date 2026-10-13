| key | value |
|---|---|
| package | `manimgx` (PyPI) · `manimgx` (npm, browser player) |
| install | `uv tool install --python 3.14 manimgx` · pip: `python3.14 -m venv .venv && .venv/bin/pip install manimgx` · web: `npm install manimgx` |
| stable version | 0.1.1 (verified 2026-10-12; released 2026-10-07 — ยังไม่ถึง 7 วัน live-check ผ่าน `/deep-research`) |
| license | MIT (bundled fonts/encoder licenses ใน wheel metadata) |
| requires | Python 3.13 หรือ 3.14 ตาม official docs (PyPI metadata ประกาศแค่ `>=3.13`); GPU: Metal / D3D12 / Vulkan, CPU fallback รวมใน Linux wheels |
| not | ไม่ใช่ package `manim` — ไม่ต้องติดตั้ง `manim`, ffmpeg หรือ LaTeX |
| docs | https://manimgx.academa.ai |
| agent docs | https://manimgx.academa.ai/llms.txt · https://manimgx.academa.ai/llms-full.txt |
| repository | https://github.com/academa-labs/manimgx |
| examples | https://github.com/academa-labs/manimgx/tree/main/examples · https://manimgx.academa.ai/gallery/ |
| type checker | `ty` — https://docs.astral.sh/ty/ |

| api | description | signature/example |
|---|---|---|
| `m.Scene` | 2D scene base; camera ของทุก scene เคลื่อนได้ | `class S(m.Scene): def construct(self) -> None: ...` |
| `m.ThreeDScene` | 3D scene with camera + lights | `class S(m.ThreeDScene): ...` |
| `self.construct` | จุดเริ่มต้นของ scene ที่ CLI/render เรียก | `def construct(self) -> None:` |
| `self.play(...)` | Time เดินที่นี่ (1 s default) | `self.play(m.Create(cube), run_time=2)` |
| `self.wait(s)` | อยู่นิ่งๆ | `self.wait(4)` |
| `self.add(...)` | แสดง mobject โดยไม่ animate | `self.add(square)` |
| `self.next_section(name)` | แบ่ง section/slide | `self.next_section("intro")` |
| `self.say(text, *anims)` | narration พร้อม sync animation กับคำในวงเล็บ | `self.say("derivative of [x squared] is [two x]", m.Indicate(a))` |
| `self.add_sound(...)` | เริ่มเสียงทันที ไม่รอ end | `music = self.add_sound(m.Sound("theme.mp3"))` |
| `m.Create` / `m.Write` | appear/draw animations | `self.play(m.Create(square), m.Write(formula))` |
| `m.FadeIn` / `m.FadeOut` | fade with optional shift | `m.FadeIn(mob, shift=m.UP)` |
| `m.Transform` / `m.ReplacementTransform` | morph one mobject to another | `self.play(m.Transform(square, circle))` |
| `m.TransformMatchingTex` | morph math by matching tokens | `m.TransformMatchingTex(a, b)` |
| `m.GrowFromCenter` / `m.Indicate` / `m.Circumscribe` | emphasis | `self.play(m.Indicate(formula))` |
| `m.Rotate` | rigid rotation about one point | `m.Rotate(mob, m.PI / 2)` |
| `m.AnimationGroup` / `m.LaggedStart` / `m.Succession` | combine animations | `self.play(m.Succession(m.Create(a), m.Create(b)))` |
| `mob.animate.<method>(...)` | animate any method call; typed chain | `box.animate.shift(m.RIGHT).scale(2)` |
| `mob.animate(fn)` | animate own class method (ty ไม่รู้จัก method เอง) | `box.animate(lambda b: b.grow(2))` |
| `m.Square` / `m.Circle` / `m.Rectangle` / `m.Triangle` | basic shapes | `m.Square(side_length=3, color=m.BLUE, fill_opacity=0.5)` |
| `m.Polygon` / `m.Line` / `m.Arrow` / `m.Dot` | point-based shapes (points เป็น `[x, y, 0]`) | `m.Polygon([0,0,0], [1,0,0], [0,1,0])` |
| `m.Brace` | brace under/over a mobject | `m.Brace(mob, m.DOWN)` |
| `m.NumberPlane` | plane with coordinates | `plane = m.NumberPlane(x_range=[-3,3])` |
| `m.Axes` + `axes.plot` | graph | `axes = m.Axes(x_range=[-3,3], y_range=[-2,2]); axes.plot(lambda x: x**2, color=m.BLUE)` |
| `m.Cube` / surfaces / solids | 3D mobjects | `m.Cube(side_length=3, fill_opacity=0.3, stroke_width=2)` |
| `m.Text` | plain words (Typst typesetting) | `m.Text("plain words", font_size=48)` |
| `m.MathTex` | LaTeX math → Typst (no LaTeX install) | `m.MathTex(r"e^{i\pi} + 1 = 0")` |
| `m.Tex` | words + inline math, raw string | `m.Tex(r"words and $x^2$")` |
| `m.Sound(...)` | sound with an animation | `self.play(m.FadeIn(mob), m.Sound("whoosh.mp3"))` |
| `Sound.gain/fade_in/loop/stop` | modify a sound; loop ต้องเริ่มด้วย `add_sound` | `m.Sound("a.mp3").gain(-18).fade_in(2).loop()` |
| `m.voices.Fal` | fal.ai TTS voice (ต้องการ `FAL_KEY`) | `voice = m.voices.Fal("fal-ai/minimax/speech-2.8-hd", voice_setting={...})` |
| `m.Speech` | any text→speech function เป็น voice ได้ | `voice = lambda text: m.Speech(...)` |
| `self.set_camera_orientation` | 3D camera angles | `self.set_camera_orientation(phi=65 * m.DEGREES, theta=-45 * m.DEGREES)` |
| `self.begin_ambient_camera_rotation` | auto orbit | `self.begin_ambient_camera_rotation(rate=0.5)` |
| `.to_edge` / `.next_to` / `.move_to` / `.shift` / `.scale` | placement | `.next_to(other, m.RIGHT, buff=0.3)` |
| `m.VGroup` / `Group` + `.arrange` | grouping | `m.VGroup(a, b).arrange(m.DOWN)` |
| `m.config` | frame/quality settings | `m.config.background_color = m.WHITE`; `pixel_width`, `pixel_height`, `frame_rate` |
| `Scene().render(path)` | render from Python; ไม่ใส่ path = รันโดยไม่ draw | `SquareToCircle().render("out.mp4")` → `Film` |
| `<manimgx-player>` | browser element (Pyodide worker + WebGPU) | `<manimgx-player autoplay><script type="text/python">...` |
