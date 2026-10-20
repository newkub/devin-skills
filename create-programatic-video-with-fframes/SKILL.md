---
name: create-programatic-video-with-fframes
description: Create programmatic videos with fframes — Rust SVG scenes, ffmpeg encode, Skia GPU preview
argument-hint: "[video-idea-or-scope]"
related:
  - edit-video-with-remotion
  - create-video-story
  - resolve-errors
---

## Goal

Create, edit, review, and render videos from code with [fframes](https://github.com/dmtrKovalenko/fframes) (a Rust library — `render_frame(frame) -> Svgr` returns an SVG tree per frame, scenes split the timeline, `timeline!`/springs animate, `AudioMap` places audio, ffmpeg encode)

## Scope

- Use when the user wants a video, animation, motion graphic, explainer, promo, social clip, title card, lyric/caption video, or `.mp4`/`.webm` rendered from code — including fixing/speeding up/checking existing fframes videos
- Covers: install, scaffold, design, animation, audio, review via the CLI (`inspect`/`strip`/`frame`/`onion`/`preview`), render, and verify
- Editing footage with React → `/edit-video-with-remotion`; creating from a story outline with AI media → `/create-video-story`
- Full upstream reference: `skills/fframes-video/references/{api,audio,design}.md` in the repo and the `motion-graphics`, `beta`, `audio-announce`, `teej-podcast`, `shaders` examples under `examples/`

## Execute

### 1. Install

> Goal: Install the full toolchain before scaffolding

1. Install Rust from <https://rustup.rs>, then install the system libraries that ffmpeg builds with:
   - macOS: `brew install pkg-config ffmpeg x264 x265 opus nasm ninja`
   - Debian/Ubuntu: `sudo apt-get install -y yasm nasm ffmpeg libx264-dev libx265-dev libopus-dev libclang-dev clang ninja-build libvpx-dev libasound2-dev`
   - Arch: `sudo pacman -S ninja yasm nasm ffmpeg x264 x265 opus clang`
2. Windows: link a prebuilt FFmpeg 9 shared build instead — unzip `ffmpeg-n9.0-latest-win64-gpl-shared` from BtbN/FFmpeg-Builds, then set `FFMPEG_DIR` + add `bin` to `PATH`, `winget install LLVM.LLVM` + set `LIBCLANG_PATH` (details in the fframes README)

### 2. Scaffold Project

> Goal: a new project that renders immediately

1. Run `cargo install --locked cargo-fframes`, then `cargo fframes new my-video --format landscape --fps 30 --yes` (or `curl -fsSL https://raw.githubusercontent.com/dmtrKovalenko/fframes/main/scripts/new-video.sh | bash -s -- my-video --yes`)
2. Options: `--template single-scene|multi-scene` (multi-scene accepts only `landscape|uhd`), `--format landscape|portrait|square|uhd`, `--fps`, `--title`, `--backend`, `--dir`, `--git` (uses the repo main) — always pass `--yes`
3. Use the Skia GPU backend (default — Metal on macOS, Vulkan on Linux/Windows); it is ~10x faster than CPU and has a `preview` window; use `--backend cpu` only when there is no GPU (no preview)
4. Start `cargo build --release` in the background immediately (the first build is slow — macOS/Linux download prebuilt Skia+ffmpeg in ~1 minute; other targets, or `metal`+`vulkan` together, compile Skia from source in ~20 minutes)
5. Project layout: `src/lib.rs` (the video from the template — placeholder content; replace all layout/colors/fonts/decorations), `src/main.rs` (CLI), `media/` (fonts/images/audio compiled in), `tests/frames.rs` (snapshots)
6. Every command is `cargo run --release -- <command>` — define a shell function `R() { cargo run --release -- "$@"; }` (a variable like `R="..."` does not word-split in zsh)

### 3. Review Loop

> Goal: loop after every change — the agent reviews with files, the user watches in preview

1. `$R timeline` — scenes with frame/second ranges + every audio track; check structure/pacing before looking at visuals
2. `$R inspect` — checks a frame every 0.25s plus the first/last of every scene: missing images/fonts/glyphs, text overflowing the canvas, invalid SVG (zero-size rect, bad radius), broken transforms, panics — exit code 2 on error → fix every item (warnings on scene first frames only are usually entrances — verify with strip)
3. `$R strip <scene|range> -n 12` — contact sheet `strip.png` to review layout/rhythm/motion (fastest)
4. `$R frame Intro@end,Outro@50%` — full-size PNGs in `frames/` for typography/alignment/contrast
5. `$R onion "Intro@0..Intro@1s" -n 6` — blended frames in `onion.png` reveal trajectory/easing/overshoot
6. `$R preview Intro` — real-time window with sound, for the user (space play/pause, h/l seek 1s, j/k step frame, q quit) — blocks until closed → run in the background or have the user run it
7. `$R render Intro --draft` (half resolution, ~1s per scene) → `$R render` writes the real `out.mp4`
8. `cargo test` compares settled frames against `_frame_snapshots/` — the first run only creates the baseline (view the PNGs before committing it); `FFRAMES_UPDATE_SNAPSHOTS=1 cargo test` accepts changes — snapshot mid-scene (`Intro@3s`), not during fade out

All commands:

| command | Used for |
| --- | --- |
| `timeline` | view scenes, durations, audio tracks, mix settings |
| `inspect [RANGE] [--every 0.1s \| --all-frames] [--fail-on warning]` | find problems without rendering pixels |
| `strip [RANGE] -n N [--columns 4] [--width 480]` | review flow/motion in one image |
| `frame TIMES [-o dir] [--svg]` | full-size PNG (+ laid-out SVG) of the chosen frames |
| `onion RANGE -n N` | view the trajectory/easing of movement |
| `svg TIME` | read a frame's final SVG as text |
| `preview [TIME] [--paused] [--mute]` | real-time window with sound — for the user |
| `render [RANGE] [-o out.mp4] [--draft]` | encode the video or a section (audio trimmed along) |
| `snapshot TIMES [--update]` | compare frames against approved PNGs, `.diff.png` shows the diff |
| `audio analyze [RANGE] [--waveform w.png]` | per-scene loudness (LUFS), true peak, clipping, silence |
| `audio at TIMES` | what audio plays at that point, its position in the file, and its level |
| `audio render [RANGE] -o a.wav` | mix out to WAV |

Addressing time: `120` (frame), `3.2s`, `500ms`, `1:05.5`, `50%`, `start`, `end`; scenes by struct name (`Intro` matches `IntroScene`, case-insensitive), `#3` (index), `Intro[1]` (the 2nd scene of that type); within a scene `Intro@1.2s`, `Intro@50%`, `Intro@end`; ranges `a..b` (end exclusive), `a..`, `..b`, `all`, or a scene name; commas separate multiple times

Browser editor: fframes ships a web editor (timeline + scrubbing, compiled to WASM, requires Node.js + `wasm-pack`) — set up in `editor/` of `examples/hello-world`; offer it when the user wants to tweak with a GUI — for viewing use `preview`, for review use the CLI

### 4. Write The Video

> Goal: video struct + scenes + animation that compile and render correctly

```rust
impl Video for MyVideo<'_> {
    const FPS: usize = 30; const WIDTH: usize = 1920; const HEIGHT: usize = 1080;
    fn duration(&self) -> Duration<'_> { Duration::Auto }           // sum of the scenes; or Seconds/Frames/FromAudio("f")
    fn audio(&self) -> AudioMap<'_> { AudioMap::none() }
    fn define_scenes(&self) -> Scenes<'_> { Scenes::from(vec![&self.intro as &dyn Scene, &self.main]) }
    fn render_frame<'a>(&'a self, frame: Frame, ctx: &FFramesContext<'a, '_>) -> Svgr<'a> {
        fframes::svgr!(<svg xmlns="http://www.w3.org/2000/svg" width={Self::WIDTH} height={Self::HEIGHT}>
            <rect width={Self::WIDTH} height={Self::HEIGHT} fill={BACKGROUND} />
            {ctx.render_scenes(&frame)}
        </svg>)
    }
}
```

1. 1 scene per idea, 2-6s long — inside a scene `frame.seconds()`/`frame.index` count from the scene start; `frame.global_index` = the video frame; `ctx.get_scene_info(&self.intro)` = the resolved range; `ctx.current_video_size` = the output size (scaled per `--scale`)
2. `Scene` impl: `duration`, `render_frame`, optional `overlap()` (`Overlap::Previous(0.4)` = cross-fade), optional `audio()` (times relative to the scene — SFX stay pinned to the scene when its duration changes); scenes must be zero-sized or fields of the video (`&self.intro`)
3. `svgr!` = SVG markup + `{rust expr}`; literal text as quoted strings; subtrees without `{}` are hashed/cached across frames → keep decorations literal, wrap animated values in `<g transform={..} opacity={..}>`; put gradients/clip/mask/filter in `<defs>` referencing `url(#id)` (id unique per instance)
4. Images: `self.media.logo_png.href()` (fields named after the files in `media/`) or `ctx.get_image("logo.png").map(|i| i.href())`
5. Animate: `frame.animate(&fframes::timeline!(at 0.2 => 0.8, animate 0.0_f32 => 1.0, Easing::EaseOut))` — before the first keyframe the value = `from`, after the last it stays `to`; values: `f32`, `f64`, `Color`, `Transform`; `frame.animate_loop` for ambient motion; `frame.animate_runtime(AnimateRuntimeInput { on_second, from, to, animation_runtime })` for runtime/stagger (give springs extra duration, e.g. 3.0)
6. `render_frame` runs for every frame on many threads — no panics/file IO/heavy work; prepare in the constructor or a `OnceLock`; media lookups return `Option` → fall back to `Svgr::empty()` instead of `expect`
7. Text: put font files in `media/` and reference them by family name + numeric `font-weight`; measure for real with `frame.text_width`, `frame.text_fit(.., TextOverflow::Ellipsis)` (returns `Cow` → convert to `String`), `frame.text_break_lines` returns `Svgr` with one `<tspan>` per line; helpers return `None` when the font is not loaded
8. Media: `include_media_dir!(pub struct MyMedia, "media")` embeds + `MyMedia::prepare()` in `main.rs` (audio decoded to mono); stereo/large files → `MediaDirectory::read_folder("assets")` at runtime + `CombinedMediaProvider`; subtitles `ctx.get_subtitles("subs.vtt")`; video frames `frame.get_synced_video_frame`; audio spectrum `frame.visualize_audio_frame`
9. GPU shaders (Skia only): `Shader::sksl(include_str!(...))` or `Shader::shadertoy` in the constructor, then `shader.draw(&frame, ShaderUniforms::new().float("uSpeed", 0.6).color("uTint", v))` → `<image href={layer.href()} .../>`; built-in uniforms `iResolution`/`iTime`/`iTimeDelta`/`iFrame`; SkSL follows GLSL ES 2 (constant loop bounds, no while/preprocessor); on a compile error the layer is skipped — test with `fframes_skia_renderer::render::compile_shader`

### 5. Design

> Goal: a good-looking video — common problems: too much text, everything moving at once, linear motion, no hierarchy, narrow margins, random colors

1. Pacing: ~3 words/second + 1s to take it in; title 2.5-4s, content 4-8s, outro 2-3s; social clip — the first frame must already have content (never fade from black) and a hook in the first 1.5s; hold 1-3s with small motion always present
2. Layout: margins 8-10% of width (landscape); portrait keeps content within x 8-92%, y 12-78% (platform UI covers top/bottom); grid of 2-3 x positions; left-aligned blocks read better than centered paragraphs; whitespace is the best design
3. Typography: 1-2 families (display + text); @1920x1080 — hero 140-200, title 96-120, subtitle 44-56, body 44-60, caption 28-34 — never below 28px (for 1080-wide portrait use the same sizes or larger); weight title 600-800, body 400-500; letter-spacing `-1..-3` for large titles, `+2..+6` for small caps; ≤8 words/line, ≤3 lines/card; shrink-to-fit loop then memoize in a `OnceLock`
4. Color: background + foreground + 1 accent + 1-2 tints; body text contrast ≥4.5:1; blur/drop-shadow filters are expensive on the CPU backend — apply them on a static subtree (cached) or use Skia
5. Motion: enter with ease-out/spring 300-600ms over 40-120px + opacity 0→1; exit ease-in 200-300ms over a shorter distance or fade only; stagger items 60-120ms (letters/words 20-60ms); animate only transform+opacity (font-size/layout = jitter); scale from 0.9-0.96, not 0; rotate ±6°; one focal movement at a time
6. Easing presets: `SPRING_SNAPPY { mass: 1.0, stiffness: 300.0, damping: 26.0 }` (UI-like), `SPRING_SOFT { 150.0, 18.0 }` (friendly), `SPRING_BOUNCY { 220.0, 12.0 }` (playful, use sparingly), `EASE_OUT_EXPO = CubicBezier(0.16, 1.0, 0.3, 1.0)` (slides), `EASE_IN_OUT = CubicBezier(0.65, 0.0, 0.35, 1.0)` (camera/morphs)
7. Recipes: staggered entrance (`animate_runtime` per item, `0.4 + i * 0.09`); word-by-word title (split into words + `text_width`, stagger 40-60ms, smaller spring); counter (`f32` + `EASE_OUT_EXPO` 1.2-1.8s, tabular/mono font, `text-anchor="end"`); growing bar (`rect` width from `0.5` — never `0`); underline draw-on (`stroke-dashoffset` len→0); scene transition (`overlap` + dual fade or push ∓80px); lower third (bar slide 0.5s → name +0.15s → role +0.1s → combined exit 0.25s)

### 6. Audio

> Goal: place audio from the timeline, then check with numbers (the agent cannot listen)

1. `media/` = embedded, decoded to mono at compile time (mp3/wav/flac/aac/ogg/m4a); stereo/voice-over/large files → `MediaDirectory::read_folder` at runtime
2. Place tracks:
   ```rust
   AudioMap::from([
       AudioTrack::new("music.mp3", Second(0.)..Eof).gain_db(-18.).fade_in(1.5).fade_out(2.5).fade_curve(FadeCurve::EqualPower).duck_under_voice(),
       AudioTrack::new("vo.wav", Second(0.6)..Eof).voice(),
       AudioTrack::new("whoosh.wav", Second(3.1)..Eof).gain_db(-10.).pan(0.3),
       AudioTrack::new("take.wav", Second(20.)..Second(24.)).offset(3.2),   // play the file from 3.2s..7.2s
   ])
   ```
3. Timestamps: `Second(f32)` (sample-accurate), `Frame(n)`, `Time { minutes, seconds }`, `Eof`, `DurationOfAudio("f")`, and `+`/`-`; derive SFX times from the same constants as the animation — a whoosh starts ~150ms before the movement peak, a pop/click lands on the frame the element appears (+0-50ms)
4. Gain referenced to voice at 0dB: music under voice -16..-22dB (with `duck_under_voice()` = -12dB, attack 0.2s, hold 0.3s, release 0.8s), music alone -8..-12dB, UI SFX -8..-14dB, whoosh -8..-12dB; master bus limiter -1dBFS — don't rely on the limiter, fix the gain instead
5. Check without listening: `$R timeline` → `$R audio at 3.1s,6.2s` → `$R audio analyze --waveform w.png` — targets: integrated ≈ -14 LUFS (web/social; podcast -16; broadcast -23; beyond ±2 LU → adjust gain or `audio_mix.master_gain_db`), true peak ≤ -1dBTP, `clipped_samples` = 0, LRA 4-10 LU, `silent_ranges` only where intended (`missing_files` = missing files), voice-bearing scenes within ~2 LU of each other; the waveform image has yellow cue ticks under purple scene lines — audio must line up with visual events
6. Placeholder SFX with no assets: `sox -n pop.wav synth 0.08 sine 880 fade 0 0.08 0.07` or `ffmpeg -f lavfi -i "sine=frequency=440:duration=0.2" tick.wav` — tell the user they are placeholders; have the user listen for real in `$R preview`

### 7. Finish

> Goal: verify everything before handoff

1. `$R inspect --fail-on warning` passes (or the remaining warnings are understood entrances)
2. Every scene's strip is correct + key frames checked full-size per the checklist
3. `$R audio analyze` levels are within targets
4. `$R render -o out.mp4`, then verify with `ffprobe -v error -show_entries stream=codec_type,width,height,nb_frames,duration out.mp4`
5. `cargo test` if snapshots exist, then commit `_frame_snapshots/*.png`
6. Tell the user: output path, duration, the strip image path, and the `preview` command to watch

Review checklist (check against the strip + frames of every scene): nothing important in the outer 8% (or the portrait UI zone); text fits its box + canvas, ≤~8 words/line, never below 28px; every text block stays on screen long enough to read; one focal point at a time; margins/alignment/colors consistent across scenes; enough contrast on every background including gradients behind text; transitions have no empty frame/flash (check `Scene@end` + the next scene's first frame + `onion`); the first frame is not blank (social); `inspect` clean; audio levels pass

## Rules

- View the PNGs (strip/frame/onion) before saying it looks good — never guess; prefer `strip` many times over `frame`, `--scale 0.5` when checking composition only, `--json` when parsing output (stdout = result, stderr = progress)
- Always `--release` — debug builds render many times slower; template content is a placeholder and must be fully replaced with your own design
- `preview` is for the user; the agent reviews only with `inspect`/`strip`/`frame`/`audio analyze`
- A zero-size rect / zero circle radius = invalid SVG that gets skipped (inspect reports it) → animate from `0.5`; a panic in `render_frame` stops the render (the error names the frame/second/scene)
- `font-weight` must be numeric (`600`) or `normal`/`bold`; an unknown family falls back silently — `inspect` reports "No match for ... font-family" → add the file to `media/` + use the exact family name
- A `Color::TRANSPARENT` background needs an encoder/pixel format that supports alpha; `Duration::FromAudio`/`Eof` require the file in the media provider — if missing → `RequiredAudioNotFound`
- On error → run `/resolve-errors` max 3 rounds, then report

Troubleshooting build:

- `ffmpeg-sys-fframes` fails → missing system libs from the Install step (`nasm`, `pkg-config`, codec `-dev` packages)
- `skia-bindings` bindgen/libclang error → point `LIBCLANG_PATH` at a usable libclang (macOS: `export LIBCLANG_PATH=$(xcode-select -p)/Toolchains/XcodeDefault.xctoolchain/usr/lib`); the macOS 27/Xcode 27 ``cannot find type `_Traits` `` issue happens only when compiling Skia from source → use a single GPU backend so the prebuilt matches, or patch `skia-bindings` (rust-skia #1335)
- ``can't find crate for `fframes_media_dir_macro` `` on macOS 27 → `rustup update` (1.98+) then rebuild

## Expected Outcome

- An fframes project where `$R render -o out.mp4` succeeds — passing `inspect`, strip/frame review, audio targets, and `ffprobe` verification
- `preview` ready for the user; snapshots committed if the project uses them
- Consistent with the upstream skill <https://github.com/dmtrKovalenko/fframes/tree/main/skills/fframes-video>
