---
name: create-programatic-video-with-fframes
description: สร้างวิดีโอ programmatic ด้วย fframes — Rust SVG scenes, ffmpeg encode, Skia GPU preview
argument-hint: "[video-idea-or-scope]"
related:
  - follow-lang-rust
  - edit-video-with-remotion
  - create-video-story
  - run-check
  - resolve-errors
---

## Goal

สร้าง แก้ไข review และ render วิดีโอจาก code ด้วย [fframes](https://github.com/dmtrKovalenko/fframes) (Rust library — `render_frame(frame) -> Svgr` คืน SVG tree ทุก frame, scene แบ่ง timeline, `timeline!`/springs animate, `AudioMap` วางเสียง, ffmpeg encode)

## Scope

- ใช้เมื่อ user ต้องการ video, animation, motion graphic, explainer, promo, social clip, title card, lyric/caption video หรือ `.mp4`/`.webm` ที่ render จาก code — รวมถึง fix/speed up/check fframes video ที่มีอยู่
- ครอบคลุม: install, scaffold, design, animation, audio, review ผ่าน CLI (`inspect`/`strip`/`frame`/`onion`/`preview`), render และ verify
- ตัดต่อ footage ด้วย React → `/edit-video-with-remotion`; สร้างจากโครงเรื่องด้วย AI media → `/create-video-story`
- Reference เต็มของ upstream: `skills/fframes-video/references/{api,audio,design}.md` ใน repo และ examples `motion-graphics`, `beta`, `audio-announce`, `teej-podcast`, `shaders` ใต้ `examples/`

## Execute

### 1. Install

> Goal: ติดตั้ง toolchain ครบก่อน scaffold

1. ติดตั้ง Rust จาก <https://rustup.rs> แล้วติดตั้ง system libraries ที่ ffmpeg build ด้วย:
   - macOS: `brew install pkg-config ffmpeg x264 x265 opus nasm ninja`
   - Debian/Ubuntu: `sudo apt-get install -y yasm nasm ffmpeg libx264-dev libx265-dev libopus-dev libclang-dev clang ninja-build libvpx-dev libasound2-dev`
   - Arch: `sudo pacman -S ninja yasm nasm ffmpeg x264 x265 opus clang`
2. Windows: link prebuilt FFmpeg 9 shared build แทน — unzip `ffmpeg-n9.0-latest-win64-gpl-shared` จาก BtbN/FFmpeg-Builds แล้วตั้ง `FFMPEG_DIR` + เพิ่ม `bin` ลง `PATH`, `winget install LLVM.LLVM` + ตั้ง `LIBCLANG_PATH` (รายละเอียดใน fframes README)

### 2. Scaffold Project

> Goal: project ใหม่ที่ render ได้ทันที

1. รัน `cargo install --locked cargo-fframes` แล้ว `cargo fframes new my-video --format landscape --fps 30 --yes` (หรือ `curl -fsSL https://raw.githubusercontent.com/dmtrKovalenko/fframes/main/scripts/new-video.sh | bash -s -- my-video --yes`)
2. Options: `--template single-scene|multi-scene` (multi-scene รับเฉพาะ `landscape|uhd`), `--format landscape|portrait|square|uhd`, `--fps`, `--title`, `--backend`, `--dir`, `--git` (ใช้ repo main) — ใส่ `--yes` เสมอ
3. ใช้ Skia GPU backend (default — Metal บน macOS, Vulkan บน Linux/Windows) เร็วกว่า CPU ~10x และมี `preview` window; `--backend cpu` เฉพาะตอนไม่มี GPU (ไม่มี preview)
4. รัน `cargo build --release` ใน background ทันที (build แรกช้า — macOS/Linux โหลด prebuilt Skia+ffmpeg ~1 นาที; target อื่นหรือ `metal`+`vulkan` พร้อมกัน compile Skia ~20 นาที)
5. โครง project: `src/lib.rs` (video จาก template — เป็น placeholder ให้แทนที่ layout/colors/fonts/decorations ทั้งหมด), `src/main.rs` (CLI), `media/` (fonts/images/audio compiled-in), `tests/frames.rs` (snapshots)
6. ทุก command คือ `cargo run --release -- <command>` — นิยาม shell function `R() { cargo run --release -- "$@"; }` (variable เช่น `R="..."` ไม่ split words ใน zsh)

### 3. Review Loop

> Goal: loop หลังแก้ทุกครั้ง — agent review ด้วยไฟล์, user ดูใน preview

1. `$R timeline` — scenes พร้อม frame/second ranges + ทุก audio track; เช็ค structure/pacing ก่อนดูภาพ
2. `$R inspect` — เช็ค frame ทุก 0.25s + first/last ของทุก scene: missing images/fonts/glyphs, text ล้น canvas, invalid SVG (zero-size rect, bad radius), broken transforms, panics — exit code 2 เมื่อ error → แก้ทุกรายการ (warning เฉพาะ first frames ของ scene มักเป็น entrance — เช็คด้วย strip)
3. `$R strip <scene|range> -n 12` — contact sheet `strip.png` เปิดดู layout/rhythm/motion (เร็วสุด)
4. `$R frame Intro@end,Outro@50%` — PNG เต็มขนาดใน `frames/` สำหรับ typography/alignment/contrast
5. `$R onion "Intro@0..Intro@1s" -n 6` — blend frames ใน `onion.png` เห็น trajectory/easing/overshoot
6. `$R preview Intro` — real-time window พร้อมเสียงสำหรับ user (space play/pause, h/l seek 1s, j/k step frame, q quit) — block จนปิด → รัน background หรือให้ user รันเอง
7. `$R render Intro --draft` (ครึ่ง resolution ~1s ต่อ scene) → `$R render` เขียน `out.mp4` จริง
8. `cargo test` เทียบ settled frames กับ `_frame_snapshots/` — รันแรกสร้าง baseline เท่านั้น (ดู PNG ก่อน commit baseline); `FFRAMES_UPDATE_SNAPSHOTS=1 cargo test` accept changes — snapshot กลาง scene (`Intro@3s`) ไม่ใช่ตอน fade out

Commands ทั้งหมด:

| command | ใช้เพื่อ |
| --- | --- |
| `timeline` | ดู scenes, durations, audio tracks, mix settings |
| `inspect [RANGE] [--every 0.1s \| --all-frames] [--fail-on warning]` | หา problems โดยไม่ render pixels |
| `strip [RANGE] -n N [--columns 4] [--width 480]` | review flow/motion ในภาพเดียว |
| `frame TIMES [-o dir] [--svg]` | PNG เต็มขนาด (+ laid-out SVG) ของ frame ที่เลือก |
| `onion RANGE -n N` | ดู trajectory/easing ของ movement |
| `svg TIME` | อ่าน SVG สุดท้ายของ frame เป็น text |
| `preview [TIME] [--paused] [--mute]` | real-time window พร้อมเสียง — สำหรับ user |
| `render [RANGE] [-o out.mp4] [--draft]` | encode วิดีโอ/ส่วนหนึ่ง (audio ตัดตาม) |
| `snapshot TIMES [--update]` | เทียบ frames กับ approved PNGs, `.diff.png` แสดง diff |
| `audio analyze [RANGE] [--waveform w.png]` | loudness (LUFS), true peak, clipping, silence ต่อ scene |
| `audio at TIMES` | เสียงอะไรเล่น ณ จุดนั้น ตำแหน่งในไฟล์ และระดับ |
| `audio render [RANGE] -o a.wav` | mix ออกเป็น WAV |

Addressing time: `120` (frame), `3.2s`, `500ms`, `1:05.5`, `50%`, `start`, `end`; scene ด้วย struct name (`Intro` match `IntroScene`, case-insensitive), `#3` (index), `Intro[1]` (scene ที่ 2 ของ type นั้น); ใน scene `Intro@1.2s`, `Intro@50%`, `Intro@end`; ranges `a..b` (end exclusive), `a..`, `..b`, `all`, หรือ scene name; comma แยกหลายเวลา

Browser editor: fframes มี web editor (timeline + scrubbing, compile เป็น WASM, ต้อง Node.js + `wasm-pack`) — setup ใน `editor/` ของ `examples/hello-world`; เสนอเมื่อ user อยาก tweak ด้วย GUI — สำหรับดูใช้ `preview`, สำหรับ review ใช้ CLI

### 4. Write The Video

> Goal: video struct + scenes + animation ที่ compile และ render ถูก

```rust
impl Video for MyVideo<'_> {
    const FPS: usize = 30; const WIDTH: usize = 1920; const HEIGHT: usize = 1080;
    fn duration(&self) -> Duration<'_> { Duration::Auto }           // sum ของ scenes; หรือ Seconds/Frames/FromAudio("f")
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

1. 1 scene ต่อ 1 idea, ยาว 2-6s — ใน scene `frame.seconds()`/`frame.index` นับจาก scene start; `frame.global_index` = video frame; `ctx.get_scene_info(&self.intro)` = resolved range; `ctx.current_video_size` = output size (scale ตาม `--scale`)
2. `Scene` impl: `duration`, `render_frame`, optional `overlap()` (`Overlap::Previous(0.4)` = cross-fade), optional `audio()` (เวลา relative ต่อ scene — SFX ติด scene เมื่อ duration เปลี่ยน); scenes ต้อง zero-sized หรือเป็น field ของ video (`&self.intro`)
3. `svgr!` = SVG markup + `{rust expr}`; literal text เป็น quoted strings; subtree ที่ไม่มี `{}` ถูก hash/cache ข้าม frames → decoration เก็บ literal, wrap animated values ด้วย `<g transform={..} opacity={..}>`; gradients/clip/mask/filter ใส่ `<defs>` อ้าง `url(#id)` (id unique ต่อ instance)
4. Images: `self.media.logo_png.href()` (field ตามชื่อไฟล์ใน `media/`) หรือ `ctx.get_image("logo.png").map(|i| i.href())`
5. Animate: `frame.animate(&fframes::timeline!(at 0.2 => 0.8, animate 0.0_f32 => 1.0, Easing::EaseOut))` — ก่อน keyframe แรกค่า = `from`, หลังสุดท้ายค้าง `to`; values: `f32`, `f64`, `Color`, `Transform`; `frame.animate_loop` สำหรับ ambient; `frame.animate_runtime(AnimateRuntimeInput { on_second, from, to, animation_runtime })` สำหรับ runtime/stagger (spring ใส่ duration เผื่อ เช่น 3.0)
6. `render_frame` รันทุก frame หลาย threads — ห้าม panic/file IO/heavy work; prepare ใน constructor หรือ `OnceLock`; media lookups คืน `Option` → fallback `Svgr::empty()` แทน `expect`
7. Text: font files ใน `media/` อ้างด้วย family name + numeric `font-weight`; วัดจริงด้วย `frame.text_width`, `frame.text_fit(.., TextOverflow::Ellipsis)` (คืน `Cow` → แปลงเป็น `String`), `frame.text_break_lines` คืน `Svgr` พร้อม `<tspan>` ต่อ line; helpers return `None` เมื่อ font ไม่โหลด
8. Media: `include_media_dir!(pub struct MyMedia, "media")` embed + `MyMedia::prepare()` ใน `main.rs` (audio decode เป็น mono); stereo/large → `MediaDirectory::read_folder("assets")` runtime + `CombinedMediaProvider`; subtitles `ctx.get_subtitles("subs.vtt")`; video frames `frame.get_synced_video_frame`; audio spectrum `frame.visualize_audio_frame`
9. GPU shaders (Skia only): `Shader::sksl(include_str!(...))` หรือ `Shader::shadertoy` ใน constructor แล้ว `shader.draw(&frame, ShaderUniforms::new().float("uSpeed", 0.6).color("uTint", v))` → `<image href={layer.href()} .../>`; built-in uniforms `iResolution`/`iTime`/`iTimeDelta`/`iFrame`; SkSL ตาม GLSL ES 2 (loop bounds คงที่, ไม่มี while/preprocessor); compile error → layer ถูก skip — ทดสอบด้วย `fframes_skia_renderer::render::compile_shader`

### 5. Design

> Goal: วิดีโอที่ดูดี — ปัญหาที่พบบ่อย: text เยอะ, ทุกอย่างขยับพร้อมกัน, motion linear, ไม่มี hierarchy, margin แคบ, สีสุ่ม

1. Pacing: ~3 words/วินาที + 1s ให้เห็น; title 2.5-4s, content 4-8s, outro 2-3s; social clip — first frame ต้องมีของแล้ว (ห้าม fade from black) และ hook ใน 1.5s แรก; hold 1-3s พร้อม motion เล็กๆ อยู่เสมอ
2. Layout: margin 8-10% ของ width (landscape); portrait เก็บ content ใน x 8-92%, y 12-78% (platform UI บังบนล่าง); grid 2-3 x positions; left-aligned block อ่านดีกว่า center paragraph; whitespace คือ design ที่ดีที่สุด
3. Typography: 1-2 families (display + text); @1920x1080 — hero 140-200, title 96-120, subtitle 44-56, body 44-60, caption 28-34 — ห้ามต่ำกว่า 28px (portrait 1080 กว้างใช้ขนาดเดียวกันหรือใหญ่กว่า); weight title 600-800, body 400-500; letter-spacing `-1..-3` title ใหญ่, `+2..+6` small caps; ≤8 words/line, ≤3 lines/card; shrink-to-fit loop แล้ว memoize ใน `OnceLock`
4. Color: background + foreground + 1 accent + 1-2 tints; contrast body text ≥4.5:1; blur/drop-shadow filters แพงบน CPU backend — ใส่บน static subtree (cache) หรือใช้ Skia
5. Motion: enter ด้วย ease-out/spring 300-600ms จากระยะ 40-120px + opacity 0→1; exit ease-in 200-300ms ระยะสั้นกว่าหรือ fade อย่างเดียว; stagger items 60-120ms (letters/words 20-60ms); animate เฉพาะ transform+opacity (font-size/layout = jitter); scale จาก 0.9-0.96 ไม่ใช่ 0; rotate ±6°; 1 focal movement ต่อครั้ง
6. Easing presets: `SPRING_SNAPPY { mass: 1.0, stiffness: 300.0, damping: 26.0 }` (UI-like), `SPRING_SOFT { 150.0, 18.0 }` (friendly), `SPRING_BOUNCY { 220.0, 12.0 }` (playful, ใช้น้อย), `EASE_OUT_EXPO = CubicBezier(0.16, 1.0, 0.3, 1.0)` (slides), `EASE_IN_OUT = CubicBezier(0.65, 0.0, 0.35, 1.0)` (camera/morphs)
7. Recipes: staggered entrance (`animate_runtime` ต่อ item, `0.4 + i * 0.09`); word-by-word title (แยกคำ + `text_width`, stagger 40-60ms, spring เล็กขึ้น); counter (`f32` + `EASE_OUT_EXPO` 1.2-1.8s, tabular/mono font, `text-anchor="end"`); growing bar (`rect` width จาก `0.5` — ห้าม `0`); underline draw-on (`stroke-dashoffset` len→0); scene transition (`overlap` + dual fade หรือ push ∓80px); lower third (bar slide 0.5s → name +0.15s → role +0.1s → exit รวม 0.25s)

### 6. Audio

> Goal: วางเสียงจาก timeline แล้ว check ด้วยตัวเลข (agent ฟังไม่ได้)

1. `media/` = embed, decode เป็น mono ตอน compile (mp3/wav/flac/aac/ogg/m4a); stereo/voice-over/ไฟล์ใหญ่ → `MediaDirectory::read_folder` runtime
2. วาง tracks:
   ```rust
   AudioMap::from([
       AudioTrack::new("music.mp3", Second(0.)..Eof).gain_db(-18.).fade_in(1.5).fade_out(2.5).fade_curve(FadeCurve::EqualPower).duck_under_voice(),
       AudioTrack::new("vo.wav", Second(0.6)..Eof).voice(),
       AudioTrack::new("whoosh.wav", Second(3.1)..Eof).gain_db(-10.).pan(0.3),
       AudioTrack::new("take.wav", Second(20.)..Second(24.)).offset(3.2),   // เล่นไฟล์ 3.2s..7.2s
   ])
   ```
3. Timestamps: `Second(f32)` (sample-accurate), `Frame(n)`, `Time { minutes, seconds }`, `Eof`, `DurationOfAudio("f")` และ `+`/`-`; เวลา SFX derive จาก constants เดียวกับ animation — whoosh เริ่ม ~150ms ก่อน movement peak, pop/click ตรง frame element ขึ้น (+0-50ms)
4. Gain อ้าง voice 0dB: music ใต้ voice -16..-22dB (+ `duck_under_voice()` = -12dB, attack 0.2s, hold 0.3s, release 0.8s), music เดี่ยว -8..-12dB, UI SFX -8..-14dB, whoosh -8..-12dB; master bus limiter -1dBFS — อย่าพึ่ง limiter ให้แก้ gain
5. Check โดยไม่ฟัง: `$R timeline` → `$R audio at 3.1s,6.2s` → `$R audio analyze --waveform w.png` — targets: integrated ≈ -14 LUFS (web/social; podcast -16; broadcast -23; เกิน ±2 LU → ปรับ gain หรือ `audio_mix.master_gain_db`), true peak ≤ -1dBTP, `clipped_samples` = 0, LRA 4-10 LU, `silent_ranges` เฉพาะที่ตั้งใจ (`missing_files` = ไฟล์หาย), scenes ที่มี voice ต่างกันไม่เกิน ~2 LU; waveform image มี cue ticks เหลืองใต้ scene lines ม่วง — เสียงต้องตรง visual event
6. Placeholder SFX ไร้ assets: `sox -n pop.wav synth 0.08 sine 880 fade 0 0.08 0.07` หรือ `ffmpeg -f lavfi -i "sine=frequency=440:duration=0.2" tick.wav` — บอก user ว่าเป็น placeholder; ให้ user ฟังจริงใน `$R preview`

### 7. Finish

> Goal: verify ครบก่อนส่งมอบ

1. `$R inspect --fail-on warning` ผ่าน (หรือ warning ที่เหลือคือ entrance ที่เข้าใจแล้ว)
2. strip ทุก scene ถูก + key frames เช็คเต็มขนาดตาม checklist
3. `$R audio analyze` levels อยู่ใน targets
4. `$R render -o out.mp4` แล้ว verify `ffprobe -v error -show_entries stream=codec_type,width,height,nb_frames,duration out.mp4`
5. `cargo test` ถ้ามี snapshots แล้ว commit `_frame_snapshots/*.png`
6. บอก user: output path, duration, path ของ strip image และคำสั่ง `preview` สำหรับดู

Review checklist (เช็คกับ strip + frame ทุก scene): ไม่มีของสำคัญใน outer 8% (หรือ portrait UI zone); text fit box + canvas, ไม่เกิน ~8 words/line, ไม่ต่ำกว่า 28px; ทุก text อยู่พอให้อ่าน; 1 focal point ต่อครั้ง; margins/alignment/colors consistent ข้าม scenes; contrast พอทุก background รวม gradient หลัง text; transition ไม่มี frame ว่าง/flash (เช็ค `Scene@end` + first frame ถัดไป + `onion`); first frame ไม่ blank (social); `inspect` clean; audio levels ผ่าน

## Rules

- ดู PNG (strip/frame/onion) ก่อนบอกว่าดี — ห้ามเดา; prefer `strip` มากกว่า `frame` หลายครั้ง, `--scale 0.5` เมื่อดูแค่ composition, `--json` เมื่อ parse output (stdout = result, stderr = progress)
- `--release` เสมอ — debug build render ช้าหลายเท่า; template content เป็น placeholder ต้องแทนที่ design ทั้งหมด
- `preview` สำหรับ user; agent review ด้วย `inspect`/`strip`/`frame`/`audio analyze` เท่านั้น
- rect ขนาด 0 / circle radius 0 = invalid SVG ถูก skip (inspect report) → animate จาก `0.5`; panic ใน `render_frame` หยุด render (error บอก frame/second/scene)
- `font-weight` ต้อง numeric (`600`) หรือ `normal`/`bold`; family ไม่รู้จัก fallback เงียบ — `inspect` report "No match for ... font-family" → เพิ่มไฟล์ลง `media/` + ใช้ family name เป๊ะ
- `Color::TRANSPARENT` background ต้อง encoder/pixel format ที่รองรับ alpha; `Duration::FromAudio`/`Eof` ต้องมีไฟล์ใน media provider — หายไป → `RequiredAudioNotFound`
- ถ้า error → ทำ `/resolve-errors` max 3 รอบแล้ว report

Troubleshooting build:

- `ffmpeg-sys-fframes` fail → ขาด system lib จากขั้น Install (`nasm`, `pkg-config`, codec `-dev` packages)
- `skia-bindings` bindgen/libclang error → ชี้ `LIBCLANG_PATH` ไป libclang ที่ใช้ได้ (macOS: `export LIBCLANG_PATH=$(xcode-select -p)/Toolchains/XcodeDefault.xctoolchain/usr/lib`); macOS 27/Xcode 27 ``cannot find type `_Traits` `` เกิดเฉพาะตอน compile Skia จาก source → ใช้ GPU backend เดียวให้ prebuilt match หรือ patch `skia-bindings` (rust-skia #1335)
- ``can't find crate for `fframes_media_dir_macro` `` บน macOS 27 → `rustup update` (1.98+) แล้ว rebuild

## Expected Outcome

- project fframes ที่ `$R render -o out.mp4` สำเร็จ — ผ่าน `inspect`, strip/frame review, audio targets และ `ffprobe` verify
- `preview` พร้อมให้ user ดู; snapshots committed ถ้า project ใช้
- สอดคล้องกับ upstream skill <https://github.com/dmtrKovalenko/fframes/tree/main/skills/fframes-video>
