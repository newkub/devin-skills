# ManimGX — Inspect, Render And Report

## Recommended Patterns

### The Feedback Loop

- standard order: write → `manimgx inspect` → look at the storyboard + timeline → fix → inspect again → `manimgx render` → open the MP4 to confirm → report the path
- treat `inspect`'s exit code 1 as unfinished work — it means layout problems (mobject clipped by the frame, overlapping text, lines through text, text too small to read), not warnings to skip
- problems in the storyboard reference mobject names by the variables in the code — fix exactly that variable
- use the timeline `inspect` prints (each play with its code line) as a script to check the narrative covers the story in order

### Targeted Sampling

- the defaults sample only play/wait endings — scenes with mid-animation state (e.g. a tangent line moving over a graph) need explicit extra `-t` values
- `manimgx inspect scene.py -t 1.5,3,end` or repeat the `-t` flag to target moments; `-o detail.png` names the output
- images are ordered by time; more than 6 per sheet spills into `…-2.png`; omitting `end` makes inspect stop after the play of the last requested frame
- inspecting 3D gives storyboard/timeline only (layout checks are skipped) → you must look at the images yourself every time

### Draft Before Final

- iterate fast with `-r 1280x720 --fps 30`; once content is confirmed, do the final at the default `1920x1080` @ `60fps`
- set a faster `--preset` (`veryfast`, `ultrafast`) while iterating, `medium` is the default for the final; tune quality with `--crf` (lower = better, default 23)
- vertical (Shorts/Reels/TikTok) uses `-r 1080x1920` — the vertical frame is 8 wide × ~14.2 tall and shares the central 8×8 square with the horizontal one; don't design only for the edges
- use `manimgx preview` while developing (replays every save, keeps position, errors overlay the latest frame), then close it before CI

## Do / Don't

| Do | Don't |
|---|---|
| verify `manimgx --version` works before writing scenes | run `uv tool install manimgx` without `--python 3.14` (the machine's default Python won't find the package) |
| run GPU-related commands outside the sandbox / ask the user when a tool needs approval | conclude the environment is broken on seeing `no GPU adapter` (it's the sandbox blocking the GPU) |
| `manimgx render scene.py MyScene` when the file has multiple scenes | guess and swap the `file`/`scene` argument order |
| open the output file for the user and state its path | reporting done from the exit code without looking at the images/video |
| commit only scene files + controlled assets | committing `.mp4`, the `voice/` cache, or generated artifacts |

## Common Pitfalls

- `render` writes output next to the scene file — running from another directory makes the reported path confusing; `cd` into the scene's folder first
- narration uses a service (ElevenLabs via fal.ai by default) — if `FAL_KEY` is missing, `say` fails; the voice cache in `voice/` lets repeat renders run offline once one has completed
- a scene that speaks, when `render`ed, also produces a `.srt` — don't generate subtitles yourself again
- `inspect` only checks the sampled moments; passing them doesn't mean nothing overlaps everywhere
- error messages carry hints for old API names (e.g. `ShowCreation is Create in ManimGX`) — read the hint instead of searching fresh

## Performance Notes

- ManimGX encodes with built-in x264 and renders on the GPU — the official benchmark (Apple M4 Pro, 1080p60) is slower than ~90× versus Manim CE; if unusually slow, suspect a fallback to CPU (a server/container without a GPU), not the code
- a 36-second video renders in a few seconds — there's no reason to skip the inspect step to "save time"
- the browser path downloads Pyodide + core ~26 MB on first load then caches — for multiple scenes on one page, reuse the same player element

## CI Notes

- CI needs a GPU adapter or must accept CPU fallback (Linux wheels ship Mesa lavapipe) — if the runner forces the device, mark the render step optional and use `inspect` + `SceneClass().render()` (no path passed = runs without drawing) as the smoke test instead
- add `ty check` as a step before render to catch unknown keywords the runtime ignores — run ty with `--python` pointing at the interpreter that has `manimgx` installed (the project venv or the `uv tool dir` tool env), otherwise ty reports `unresolved-import` and stays silent on every name
- never put the secret (`FAL_KEY`) in the workflow env hardcoded — go through a repository secret/secret manager; if CI doesn't need audio, disable narration in that pipeline
