---
name: follow-lib-manimgx
description: Create math and 3D videos with ManimGX — Manim CE on a Rust GPU core, inspect before render
argument-hint: "[scene-file-or-topic]"
related:
  - follow-lang-python
  - follow-secret-manager
  - deep-research
  - run-verify
  - create-video-story
  - gen-media
  - follow-best-practice
---

## Goal

Use ManimGX to create math and 3D videos from Python scenes — the API is compatible with Manim CE but renders on a Rust + wgpu GPU core that is tens of times faster, with `inspect` letting the agent see the storyboard and layout problems before making the real video

## Scope

- Use when the task involves `manimgx` — install, write scenes, inspect, render, voice/captions, or embedding a scene in a web page
- ManimGX is not the `manim` package — never `pip install manim`, never `import manim`, never install ffmpeg or LaTeX (fonts and typesetting use Typst, and the video encoder is built in)
- Requires Python 3.13 or 3.14 only — older interpreters won't even find `manimgx`
- Latest: `manimgx@0.1.1` (PyPI + npm, verified 2026-10-12, released 2026-10-07) — still under 7 days old; verify the latest version via `/deep-research` before pinning further
- Use `/follow-lang-python` for general Python rules (venv, typing, tooling)
- If you need a video outline/script before writing scenes → do `/create-video-story` or `/gen-media` first, then map the shots to scenes
- See best-practices/ for recommended patterns and pitfalls
- References: [ManimGX — Coming From Manim CE](best-practices/from-manim-ce.md), [ManimGX — Inspect, Render And Report](best-practices/inspect-and-render.md), [ManimGX — Scene Authoring](best-practices/scene-authoring.md)

## Execute

### 1. Confirm Target And Environment

> Goal: know whether this job is one video file, many scenes, or a web embed, then pick the path

1. Identify the output: native CLI (`manimgx render`) or browser (`<manimgx-player>` via the npm `manimgx`)
2. Check the GPU: Metal (macOS), Direct3D 12 (Windows), Vulkan (Linux) — with no GPU you can still render on CPU with no extra install (Linux wheels ship Mesa lavapipe)
3. If running in a sandbox and you hit `no GPU adapter`, the sandbox is forcing the GPU — run outside the sandbox (if the tool needs approval, ask the user)
4. Read the official docs as Markdown at `https://manimgx.academa.ai/llms.txt` (every page) and `llms-full.txt` (single file)

### 2. Install

> Goal: get the `manimgx` CLI on PATH with the right Python

1. Install as a tool: `uv tool install --python 3.14 manimgx` then verify with `manimgx --version` — if uv warns that `~/.local/bin` is not on PATH, run `uv tool update-shell` and open a new shell (or call `~/.local/bin/manimgx` directly)
2. Never skip `--python 3.14` — without it uv uses the machine's default Python (3.9 on macOS) and won't find `manimgx`
3. No uv yet → `curl -LsSf https://astral.sh/uv/install.sh -o /tmp/uv-install.sh && sh /tmp/uv-install.sh` then `source $HOME/.local/bin/env`
4. Don't want a permanent install → `uvx --python 3.14 manimgx <command>`
5. In a project with a venv → `python3.14 -m venv .venv && .venv/bin/pip install manimgx` (Windows: `.venv\Scripts\pip.exe`); with uv → `uv venv --python 3.14 .venv && uv pip install --python .venv/Scripts/python.exe manimgx`
6. Web side → `npm install manimgx` then `import "manimgx";` in a module script

### 3. Set Up Type Checking

> Goal: let the checker catch keyword/API mistakes before render

1. ManimGX annotates every API with types, including keyword args and the `.animate` chain
2. Set up `ty` (https://docs.astral.sh/ty/) in the editor or run it in CI — `ty` underlines wrong names and wrong keywords (e.g. `m.Circle(colour=m.BLUE)`) before you make the video
3. `ty` must point at the interpreter that has `manimgx` installed, otherwise it reports `unresolved-import` and stays silent about every name — run `uvx ty check --python <the python that has manimgx> scene.py`; the value is the project's `.venv/Scripts/python.exe` (Windows) or `.venv/bin/python` (unix), or the tool-env python (`<uv tool dir>/manimgx/Scripts/python.exe` on Windows, `/bin/python` on unix — find the path with `uv tool dir`)
4. At runtime most mobjects/animations silently accept unknown keywords — only `ty` warns
5. Through `.animate`, `ty` knows only ManimGX's own methods — animate your class's own method with a function: `box.animate(lambda b: b.grow(2))`

### 4. Write The Scene

> Goal: a scene that actually runs and stays in frame

1. Every name hangs off the single package: `import manimgx as m` then use `m.Circle`, `m.MathTex`, `m.Create`, `m.UP`, `m.BLUE` (Manim CE-style module paths don't exist)
2. Time advances only in `self.play(...)` (1 second unless `run_time=` is given) and `self.wait(seconds)` — `self.add(...)` shows mobjects without animating
3. The frame is 14.2 wide × 8 tall, centered at the origin — everything must stay within x ∈ [-7, 7], y ∈ [-4, 4]
4. Per-frame callbacks/updaters must derive state from time or other objects — never count frames
5. Start small: `m.Scene` for 2D, `m.ThreeDScene` for 3D (+ `self.set_camera_orientation(...)`, `self.begin_ambient_camera_rotation(...)`)
6. Copy patterns from the repo's `examples/` or the gallery (`quadratic_formula.py`, `linear_maps.py`, `lorenz_attractor.py`, `heavy_top.py`) instead of writing everything fresh

### 5. Inspect Before Render

> Goal: use agent feedback before spending render time

1. Always run `manimgx inspect scene.py` before `render` — it checks every `play`/`wait` ending, prints the timeline with code lines, writes `<Scene>.storyboard.png`, then outlines numbered problems
2. Layout problems → exit code 1 (mobjects cut by the frame, overlapping text, lines through text, text too small to read) — fix then inspect again
3. Target specific moments: `manimgx inspect scene.py -t 1.5,end` (repeat `-t` or separate with `,`), name the file with `-o detail.png` — 6 images per sheet so it becomes `…-2.png`
4. 3D scenes get storyboard/timeline but skip layout checks; notes (e.g. a graph overflowing the screen) don't cause exit 1
5. Open and look at the storyboard images `inspect` produced to confirm the scene actually communicates before rendering — if not, fix the scene and inspect again

### 6. Render And Show

> Goal: get an MP4 ready to hand to the user

1. Run `manimgx render scene.py` → `1920x1080` @ `60fps`, writes the file next to the scene and prints the path (if the scene speaks, you also get a `.srt`)
2. A file with multiple scenes needs the name: `manimgx render scene.py MyScene`
3. Fast draft: `-r 1280x720 --fps 30`; vertical (Shorts/Reels/TikTok): `-r 1080x1920` or set `m.config.pixel_width, m.config.pixel_height`
4. Errors print the failing code line plus hints for wrong names (e.g. `ShowCreation is Create in ManimGX`)
5. Open the result for the user: `open <Scene>.mp4` (macOS), `xdg-open <Scene>.mp4` (Linux), then state the path
6. Renderable from Python: `SquareToCircle().render("out.mp4")` returns a `Film`; no path = run the scene without drawing (useful in tests)

### 7. Add Sound, Voice And Slides

> Goal: assemble narration and synced captions

1. Sound: `self.play(m.FadeIn(mob), m.Sound("whoosh.mp3"))` or `self.add_sound("theme.mp3")` (tune with `.gain()`, `.fade_in()`, `.loop()` — looping starts only with `add_sound`)
2. Narration: `self.say("The derivative of [x squared] is [two x].", m.Indicate(a), m.Write(b))` — the first animation starts at its bracketed word
3. The default voice is ElevenLabs Eleven v3 via fal.ai and requires `FAL_KEY` — never hardcode or commit the key; do `/follow-secret-manager` and keep it in machine/user env only; change the voice with `voice = m.voices.Fal("<model>", ...)` in the class
4. Spoken lines are cached in `voice/` next to the scene → re-renders work offline and feed the `.srt` captions
5. Slides/presentation: separate plays with `self.next_section("name")`, then `manimgx present scene.py`

### 8. Embed In A Web Page

> Goal: run a scene in the browser with no render server

1. `npm install manimgx` then `import "manimgx";` in a `<script type="module">`
2. Put the scene in a `<manimgx-player autoplay>` with a `<script type="text/python">` (Pyodide in a Web Worker + WebGPU)
3. Requires WebGPU: Chrome/Edge 113+, Safari 26 — first load is ~26 MB, then the browser caches it
4. Current browser limitations: shapes composed from other shapes (`Union`) and Chinese/Japanese/Korean characters

### 9. Verify

> Goal: confirm the result and the work path

1. Run `/run-verify` for lint/typecheck (`ty`) and tests related to the scene file
2. Open the storyboard and the actual MP4 to confirm the video matches the spec — don't judge by exit code alone
3. Check the latest official docs (`/deep-research`) before using an uncertain API — every docs page is available as Markdown at its URL + `index.md`

### Use Cases

| Scenario | Use case |
|----------|----------|
| First math scene: install, inspect, render | `usecases/first-math-scene.md` |
| Narrated video with synced `.srt` captions | `usecases/narrated-video.md` |
| 3D scene with axes, camera moves, ambient rotation | `usecases/3d-scene-and-camera.md` |
| Run a scene in the browser with `<manimgx-player>` | `usecases/web-embed-player.md` |
| Type-check a scene with `ty` before rendering | `usecases/ty-typecheck-setup.md` |

## Rules

### 1. Package Identity

- Use `manimgx` only — never install `manim`, ffmpeg, or LaTeX, and never `import manim`
- Every name hangs off the single package: `m.<Name>` — Manim CE-style module paths (`from manimgx.utils.polylabel import polylabel`) don't work; write `from manimgx import polylabel`
- Always use raw strings for `MathTex`/`Tex`: `m.MathTex(r"a^2 + b^2 = c^2")`
- Requires Python 3.13/3.14; bind versions via `/deep-research` on every re-pin

### 2. Scene Invariants

- Time advances only in `self.play(...)` and `self.wait(...)` — never expect `self.add()` to delay
- Everything within x ∈ [-7, 7], y ∈ [-4, 4] (14.2 × 8 frame); vertical video uses an 8 × ~14.2 frame keeping the same central 8×8 square
- Updaters must derive from time, not frame counts — ManimGX evaluates every frame at its own time, so results are identical at any fps
- Never leave placeholder scenes or TODOs in a delivered file; the scene must truly render successfully

### 3. Inspect Loop

- The correct order is always `inspect` → fix → `inspect` → `render` — never render blind and guess
- Layout problems cause exit 1 — treat as a failure to fix, not a warning to skip
- `inspect` checks sampled moments only; for long/complex scenes add more `-t` targets

### 4. Credentials

- `FAL_KEY` must go through `/follow-secret-manager` or machine env only — never write it in code, commit it, or put it in a prompt

### 5. Cross-Skill References

- Use `/follow-lang-python` for the scene project's Python conventions
- Use `/follow-secret-manager` when `FAL_KEY` is needed for voice
- Use `/deep-research` to verify versions/APIs before using an uncertain feature
- Use /run-verify and /follow-best-practice if needed
- Use `/create-video-story` or `/gen-media` when designing the outline/media preceding the video work

- References: [apis](references/apis.md) · [cli](references/cli.md) · See best-practices/ for recommended patterns and pitfalls

## Expected Outcome

- `manimgx` installed on Python 3.13/3.14 via uv or venv, with no `manim`/ffmpeg/LaTeX installed
- The scene uses `m.*` names correctly, stays in frame, and controls time only through `play`/`wait`
- `inspect` runs before every `render`, with layout problems resolved until exit 0
- The MP4 video (and `.srt` if narrated) is opened for the user with the path stated
- Type checking passes with `ty` without prints or tests that depend on a GPU sandbox
- No secrets (`FAL_KEY`) in source or history
