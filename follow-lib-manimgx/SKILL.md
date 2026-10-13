---
name: follow-lib-manimgx
description: สร้างวิดีโอคณิตศาสตร์และ 3D ด้วย ManimGX — Manim CE บน Rust GPU core, inspect ก่อน render
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

ใช้ ManimGX สร้างวิดีโอคณิตศาสตร์และ 3D จาก Python scene — API เข้ากันได้กับ Manim CE แต่ render บน Rust + wgpu GPU core ที่เร็วกว่าหลายสิบเท่า พร้อม `inspect` ให้ agent เห็น storyboard และ layout problems ก่อนทำวิดีโอจริง

## Scope

- ใช้เมื่อ task เกี่ยวข้องกับ `manimgx` — ติดตั้ง, เขียน scene, inspect, render, voice/captions หรือ embed scene ใน web page
- ManimGX ไม่ใช่ package `manim` — ห้าม `pip install manim`, ห้าม `import manim`, ห้ามติดตั้ง ffmpeg หรือ LaTeX (fonts, typesetting ด้วย Typst และ video encoder มาในตัว)
- ต้อง Python 3.13 หรือ 3.14 เท่านั้น — interpreter เก่ากว่าจะ search หา `manimgx` ไม่เจอ
- Latest: `manimgx@0.1.1` (PyPI + npm, verified 2026-10-12, released 2026-10-07) — ยังไม่ถึง 7 วัน ตรวจเวอร์ชันล่าสุดผ่าน `/deep-research` ก่อน pin เพิ่ม
- ใช้ `/follow-lang-python` สำหรับ rule ทั่วไปของ Python (venv, typing, tooling)
- ถ้าต้องการโครงเรื่อง/สคริปต์วิดีโอก่อนเขียน scene → ทำ `/create-video-story` หรือ `/gen-media` ก่อน แล้วค่อย map ฉากเป็น scene
- ดู best-practices/ สำหรับ recommended patterns และ pitfalls

## Execute

### 1. Confirm Target And Environment

> Goal: รู้ว่างานนี้คือวิดีโอไฟล์เดียว, หลาย scene หรือ embed ในเว็บ แล้วเลือก path

1. ระบุ output: native CLI (`manimgx render`) หรือ browser (`<manimgx-player>` ผ่าน npm `manimgx`)
2. ตรวจ GPU: Metal (macOS), Direct3D 12 (Windows), Vulkan (Linux) — ไม่มี GPU ก็ render บน CPU ได้โดยไม่ต้องติดตั้งเพิ่ม (Linux wheels มี Mesa lavapipe มาให้)
3. ถ้ารันใน sandbox แล้วเจอ `no GPU adapter` แปลว่า sandbox บัง GPU อยู่ — รันนอก sandbox (ถ้า tool ต้อง approval ให้ถามผู้ใช้)
4. อ่าน official docs เป็น Markdown ที่ `https://manimgx.academa.ai/llms.txt` (ทุก page) และ `llms-full.txt` (file เดียว)

### 2. Install

> Goal: ได้ `manimgx` CLI บน PATH พร้อม Python ที่ถูกต้อง

1. ติดตั้งเป็น tool: `uv tool install --python 3.14 manimgx` แล้วตรวจด้วย `manimgx --version` — ถ้า uv warning ว่า `~/.local/bin` ไม่อยู่บน PATH ให้รัน `uv tool update-shell` แล้วเปิด shell ใหม่ (หรือเรียกตรงๆ ว่า `~/.local/bin/manimgx`)
2. ห้ามข้าม `--python 3.14` — ถ้าไม่ระบุ uv จะใช้ Python เริ่มต้นของเครื่อง (macOS คือ 3.9) แล้วหา `manimgx` ไม่เจอ
3. ยังไม่มี uv → `curl -LsSf https://astral.sh/uv/install.sh | sh` แล้ว `source $HOME/.local/bin/env`
4. ไม่อยากติดตั้งถาวร → `uvx --python 3.14 manimgx <command>`
5. ใน project ที่มี venv → `python3.14 -m venv .venv && .venv/bin/pip install manimgx` (Windows ใช้ `.venv\Scripts\pip.exe`); ถ้าใช้ uv → `uv venv --python 3.14 .venv && uv pip install --python .venv/Scripts/python.exe manimgx`
6. ฝั่ง web → `npm install manimgx` แล้ว `import "manimgx";` ใน module script

### 3. Set Up Type Checking

> Goal: ให้ checker จับผิด keyword/ชื่อ API ก่อน render

1. ManimGX annotate ทุก API ด้วย types รวมถึง keyword args และ `.animate` chain
2. ตั้ง `ty` (https://docs.astral.sh/ty/) ใน editor หรือรันใน CI — `ty` จะ underline ชื่อผิด, keyword ผิด (เช่น `m.Circle(colour=m.BLUE)`) ก่อนทำวิดีโอ
3. `ty` ต้องชี้ไปที่ interpreter ที่ติดตั้ง `manimgx` ไม่งั้นจะ report `unresolved-import` แล้วเงียบกับทุกชื่อ — รัน `uvx ty check --python <python ที่มี manimgx> scene.py` ค่าคือ `.venv/Scripts/python.exe` (Windows) หรือ `.venv/bin/python` (unix) ของ project หรือ python ใน tool env (`<uv tool dir>/manimgx/Scripts/python.exe` บน Windows, `/bin/python` บน unix — ดู path ด้วย `uv tool dir`)
4. ตอน runtime mobject/animation ส่วนใหญ่จะเงียบๆ รับ unknown keyword — มีแค่ `ty` ที่เตือน
5. ผ่าน `.animate` `ty` รู้จักเฉพาะ method ของ ManimGX — animate method ของ class เองด้วย function: `box.animate(lambda b: b.grow(2))`

### 4. Write The Scene

> Goal: scene ที่รันได้จริงและอยู่ในกรอบเฟรม

1. ทุกชื่ออยู่บน package ตัวเดียว: `import manimgx as m` แล้วใช้ `m.Circle`, `m.MathTex`, `m.Create`, `m.UP`, `m.BLUE` (module path แบบ Manim CE ไม่มีอยู่จริง)
2. time เดินใน `self.play(...)` (1 วินาที เว้นแต่ระบุ `run_time=`) และ `self.wait(seconds)` เท่านั้น — `self.add(...)` แสดง mobject โดยไม่ animate
3. เฟรมกว้าง 14.2 × สูง 8 หน่วย ศูนย์กลางที่ origin — ทุกอย่างต้องอยู่ใน x ∈ [-7, 7], y ∈ [-4, 4]
4. per-frame callback/updater ต้อง derive state จาก time หรือ object อื่น ห้ามนับ frame
5. เริ่มจาก scene เล็ก: `m.Scene` สำหรับ 2D, `m.ThreeDScene` สำหรับ 3D (+ `self.set_camera_orientation(...)`, `self.begin_ambient_camera_rotation(...)`)
6. copy pattern จาก `examples/` ใน repo หรือ gallery (`quadratic_formula.py`, `linear_maps.py`, `lorenz_attractor.py`, `heavy_top.py`) แทนการเขียนใหม่ทั้งหมด

### 5. Inspect Before Render

> Goal: ใช้ feedback ของ agent ก่อนจ่ายเวลา render

1. รัน `manimgx inspect scene.py` เสมอก่อน `render` — ตรวจทุก `play`/`wait` ending, print timeline พร้อมบรรทัด code, เขียน `<Scene>.storyboard.png` แล้ว outline numbered problems
2. layout problems → exit code 1 (mobject โดนเฟรมตัด, text ทับกัน, เส้นผ่าน text, ตัวหนังสือเล็กเกินอ่าน) — แก้แล้ว inspect ซ้ำ
3. เจาะเวลาที่ต้องการ: `manimgx inspect scene.py -t 1.5,end` (ซ้ำ `-t` หรือคั่นด้วย `,`), ตั้งชื่อ file ด้วย `-o detail.png` — 6 รูปต่อ sheet เลยไปเป็น `…-2.png`
4. 3D scene ได้ storyboard/timeline แต่ข้าม layout checks; notes (เช่น graph ล้นออกนอกจอ) ไม่ทำให้ exit 1
5. เปิดดู storyboard pictures ที่ `inspect` สร้างให้ เพื่อยืนยันว่า scene สื่อสาระได้จริงก่อน render — ไม่ผ่านก็แก้ scene แล้ว inspect ซ้ำ

### 6. Render And Show

> Goal: ได้ MP4 พร้อมส่งให้ผู้ใช้

1. รัน `manimgx render scene.py` → `1920x1080` @ `60fps` เขียน file ข้าง scene แล้ว print path (ถ้า scene speak จะได้ `.srt` ด้วย)
2. ไฟล์เดียวมีหลาย scene ต้องระบุชื่อ: `manimgx render scene.py MyScene`
3. draft เร็ว: `-r 1280x720 --fps 30`; แนวตั้ง (Shorts/Reels/TikTok): `-r 1080x1920` หรือตั้ง `m.config.pixel_width, m.config.pixel_height`
4. error จะ print บรรทัด code ที่ fail และ hint เมื่อชื่อผิด (เช่น `ShowCreation is Create in ManimGX`)
5. เปิดผลลัพธ์ให้ผู้ใช้: `open <Scene>.mp4` (macOS), `xdg-open <Scene>.mp4` (Linux) แล้วแจ้ง path
6. render จาก Python ได้: `SquareToCircle().render("out.mp4")` คืน `Film`; ไม่ใส่ path = รัน scene โดยไม่ draw (ใช้ใน test)

### 7. Add Sound, Voice And Slides

> Goal: ประกอบเสียงพูดและ captions แบบ sync

1. เสียง: `self.play(m.FadeIn(mob), m.Sound("whoosh.mp3"))` หรือ `self.add_sound("theme.mp3")` (ปรับด้วย `.gain()`, `.fade_in()`, `.loop()` — loop เริ่มด้วย `add_sound` เท่านั้น)
2. narration: `self.say("The derivative of [x squared] is [two x].", m.Indicate(a), m.Write(b))` — animation ตัวแรกเริ่มที่คำในวงเล็บของมัน
3. voice เริ่มต้นคือ ElevenLabs Eleven v3 ผ่าน fal.ai ต้องมี `FAL_KEY` — ห้าม hardcode หรือ commit key ให้ทำ `/follow-secret-manager` และ env ของเครื่อง/user เท่านั้น; เปลี่ยน voice ด้วย `voice = m.voices.Fal("<model>", ...)` ใน class
4. คำพูดถูก cache ไว้ที่ `voice/` ข้าง scene → render ซ้ำ offline ได้ และไปเป็น `.srt` captions
5. slides/presentation: `self.next_section("name")` คั่นระหว่าง plays แล้ว `manimgx present scene.py`

### 8. Embed In A Web Page

> Goal: รัน scene ในเบราว์เซอร์โดยไม่ต้องมี render server

1. `npm install manimgx` แล้ว `import "manimgx";` ใน `<script type="module">`
2. ใส่ scene ใน `<manimgx-player autoplay>` พร้อม `<script type="text/python">` (Pyodide ใน Web Worker + WebGPU)
3. ต้องใช้ WebGPU: Chrome/Edge 113+, Safari 26 — โหลดครั้งแรก ~26 MB แล้ว browser cache ไว้
4. ข้อจำกัดที่ยังใช้ไม่ได้ใน browser: shape ประกอบจาก shape อื่น (`Union`) และตัวอักษรจีน/ญี่ปุ่น/เกาหลี

### 9. Verify

> Goal: ยืนยันผลลัพธ์และทางเดินของงาน

1. ทำ `/run-verify` สำหรับ lint/typecheck (`ty`) และ tests ที่เกี่ยวข้องกับ scene file
2. เปิด storyboard และ MP4 จริงยืนยันว่า video ตรง spec ไม่ใช่ดูจาก exit code อย่างเดียว
3. ตรวจ official docs ล่าสุด (`/deep-research`) ก่อนใช้ API ที่ไม่แน่ใจ — docs ทุก page เป็น Markdown ได้จาก URL + `index.md`

## Rules

### 1. Package Identity

- ใช้ `manimgx` เท่านั้น — ห้ามติดตั้ง `manim`, ffmpeg หรือ LaTeX และห้าม `import manim`
- ทุกชื่ออยู่บน package เดียว: `m.<Name>` — module path แบบ Manim CE (`from manimgx.utils.polylabel import polylabel`) ใช้ไม่ได้ ให้เขียน `from manimgx import polylabel`
- ใช้ raw string สำหรับ `MathTex`/`Tex` เสมอ: `m.MathTex(r"a^2 + b^2 = c^2")`
- ต้องการ Python 3.13/3.14; ผูก version ผ่าน `/deep-research` ทุกครั้งที่ pin ใหม่

### 2. Scene Invariants

- time เดินเฉพาะใน `self.play(...)` และ `self.wait(...)` — อย่าหวังว่า `self.add()` จะหน่วงเวลา
- ทุกอย่างใน x ∈ [-7, 7], y ∈ [-4, 4] (เฟรม 14.2 × 8); วิดีโอแนวตั้งใช้เฟรม 8 × ~14.2 โดยยังคง central 8×8 square เหมือนเดิม
- updater ต้อง derive จาก time ไม่ใช่จำนวน frame — ManimGX evaluate ทุก frame ที่ time ของมัน ทำให้ผลเหมือนกันที่ทุก fps
- ห้ามใส่ placeholder scene หรือ TODO ใน file ที่ส่งงาน; scene ต้อง render ผ่านจริง

### 3. Inspect Loop

- ลำดับถูกต้องคือ `inspect` → fix → `inspect` → `render` เสมอ — ห้าม render ดิบแล้วเดาว่าถูก
- layout problems ทำให้ exit 1 — ถือว่าเป็น fail ต้องแก้ ไม่ใช่ warning ให้ข้าม
- `inspect` ตรวจเฉพาะ moments ที่ sample; scene ยาว/ซับซ้อนให้ระบุ `-t` เพิ่ม

### 4. Credentials

- `FAL_KEY` ต้องผ่าน `/follow-secret-manager` หรือ env ของเครื่องเท่านั้น — ห้ามเขียนลง code, commit หรือใส่ใน prompt

### 5. Cross-Skill References

- ใช้ `/follow-lang-python` สำหรับ Python conventions ของ scene project
- ใช้ `/follow-secret-manager` เมื่อต้องใช้ `FAL_KEY` สำหรับ voice
- ใช้ `/deep-research` เพื่อตรวจเวอร์ชัน/API ก่อนใช้ feature ที่ไม่แน่ใจ
- ใช้ `/run-verify` และ `/follow-best-practice` ถ้าจำเป็น
- ใช้ `/create-video-story` หรือ `/gen-media` เมื่อต้องออกแบบโครงเรื่อง/สื่อ preceding งานวิดีโอ

- References: [apis](references/apis.md) · [cli](references/cli.md) · ดู best-practices/ สำหรับ recommended patterns และ pitfalls

## Expected Outcome

- `manimgx` ติดตั้งบน Python 3.13/3.14 ด้วย uv หรือ venv โดยไม่ติดตั้ง `manim`/ffmpeg/LaTeX
- scene ใช้ `m.*` names ถูกต้อง อยู่ในกรอบเฟรมและคุมเวลาผ่าน `play`/`wait` เท่านั้น
- รัน `inspect` ก่อน `render` ทุกครั้ง และจัดการ layout problems จน exit 0
- วิดีโอ MP4 (และ `.srt` ถ้ามี narration) ถูกเปิดให้ผู้ใช้ดูพร้อมระบุ path
- type check ผ่าน `ty` โดยไม่มีการ print หรือ test ที่ต้องพึ่ง GPU sandbox
- ไม่มี secrets (`FAL_KEY`) ใน source หรือ history
