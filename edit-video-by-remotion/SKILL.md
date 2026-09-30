---
name: edit-video-by-remotion
description: ตัดต่อ ประกอบ และ render วิดีโอจาก footage ด้วย Remotion v4 บน React
argument-hint: "[footage-or-idea]"
related:
  - follow-lib-remotion
  - deep-review
  - gen-subtitle-video
  - use-bun-native-api
  - follow-lib-animejs
  - follow-lib-iconify
  - run-build

---

## Goal

ตัดต่อ ประกอบ และ render วิดีโอจาก footage มีอยู่ด้วย Remotion v4 บน React อย่าง programmatic — trim, concatenate, overlays, transitions, subtitles, audio mix, และ export ผ่าน CLI หรือ cloud

## Scope

ใช้สำหรับ:
- ตัดต่อวิดีโอ (trim, split, concatenate)
- ใส่ overlay เช่น text, image, animation
- ใส่ transitions และ motion effects
- ใส่ subtitle/caption แบบ programmatic
- จัดการ audio (mix, fade, mute)
- Render ผ่าน Remotion CLI หรือ cloud services

ดูเพิ่มเติม: /follow-lib-remotion, /deep-review, /gen-subtitle-video

## Execute

### 1. Setup Project

> Goal: เตรียม Remotion project สำหรับ editing

1. สร้าง project ด้วย `bunx create-video@latest my-edit` แล้วเลือก template ที่เหมาะ (`--blank` สำหรับ blank template ถ้ารองรับ prompt แบบ flag)
2. ติดตั้ง packages ผ่าน `bunx remotion add <pkg>` (sync version กับ core อัตโนมัติ):
   - `@remotion/media` — `<Video>`/`<Audio>` ตัวหลัก (ต้องมีเสมอ)
   - `@remotion/transitions` — transitions ระหว่าง scene
   - `@remotion/captions` — parse `.srt` เป็น captions
   - `@remotion/gif` — GIF เป็น source/overlay
3. ใส่ input footage ใน `public/` แล้วใช้ `staticFile()` อ้างอิง
4. ใช้ `bun` เป็น runtime/package manager ตาม project

### 2. Import And Trim Source Videos

> Goal: ใช้ footage เดิมเป็น source

1. ใช้ `<Video>` จาก `@remotion/media` (Mediabunny/WebCodecs — frame-perfect, เร็วสุด, preview + render ตัวเดียวกัน)
2. fallback เป็น `<OffthreadVideo>` จาก `remotion` เมื่อ codec/container ไม่รองรับ (FFmpeg-based)
3. กำหนด `src` ด้วย `staticFile('input.mp4')` หรือ remote URL (ต้อง CORS)
4. ใช้ `trimBefore` / `trimAfter` (หน่วย frames) เพื่อตัดต้น/ท้าย โดยไม่ re-encode
5. ใช้ `<Sequence>` ห่อ source video เพื่อ shift ตำแหน่งบน timeline ด้วย `from`
6. คำนวณ frames จากเวลา: `frames = time * fps` โดยใช้ `useVideoConfig()`

### 3. Concatenate Clips

> Goal: ต่อ clip หลายอันติดกัน

1. ใช้ `<Series>` และ `<Series.Sequence>` จาก `remotion` เพื่อเล่น clip ต่อกันเป็นลำดับ (ไม่มี transition)
2. ระบุ `durationInFrames` ในแต่ละ `<Series.Sequence>`
3. ถ้าต้องการ transition ระหว่าง clip → ใช้ `<TransitionSeries>` แทน (ดูข้อ 7)
4. ใช้ `<Sequence>` ทั่วไปถ้าต้องการ control layout หรือ overlap เอง
5. ตรวจให้ total `durationInFrames` ใน `<Composition>` ครอบคลุมทุก clip (TransitionSeries ลดความยาวรวมตาม transition duration)

### 4. Add Overlays And Graphics

> Goal: ใส่ overlay บนวิดีโอ

1. ใช้ `<AbsoluteFill>` เป็นภาชนะ overlay เต็ม frame
2. ใช้ `<Img>` สำหรับ logo/image overlay และ `<Gif>` จาก `@remotion/gif` สำหรับ GIF
3. ใช้ text component ธรรมดาใน React สำหรับ lower third, title
4. ใช้ `interpolate()` สำหรับ fade in/out ของ opacity (ระบุ `extrapolateLeft/Right: 'clamp'`)
5. ใช้ `spring()` สำหรับ motion-based intro/outro
6. ใช้ `useCurrentFrame()` เพื่อ sync animation กับ timeline — ห้ามใช้ CSS animation

### 5. Add Subtitles

> Goal: ใส่ subtitle/caption ลงวิดีโอ

1. ใช้ `/gen-subtitle-video` สร้าง `.srt` แล้ววางใน `public/`
2. fetch ด้วย `fetch(staticFile('subtitles.srt'))` ภายใต้ `useDelayRender()` + `continueRender` หลัง parse เสร็จ
3. parse ด้วย `parseSrt({input})` จาก `@remotion/captions` → `Caption[]` ที่มี `startMs`, `endMs`, `text`
4. แปลง ms → frame ด้วย `(ms / 1000) * fps` แล้ว conditional render ตาม `useCurrentFrame()`
5. วาง subtitle ด้านล่างจอ พร้อม padding และ background contrast

### 6. Handle Audio

> Goal: จัดการ audio track

1. ใช้ `<Audio>` จาก `@remotion/media` สำหรับ background music / voice over
2. mute audio ของ source ด้วย `muted` prop บน `<Video>` ถ้าจะ mix แทน
3. ปรับ `volume` (number หรือ callback) และ `playbackRate` ตาม scene
4. fade volume ด้วย callback: `volume={(f) => interpolate(f, [0, fps], [0, 1], {extrapolateRight: 'clamp'})}`
5. `<Html5Audio>` จาก `remotion` เป็น legacy — ใช้เฉพาะ preview fallback

### 7. Add Transitions

> Goal: ใส่ transitions ระหว่าง clip

1. ใช้ `<TransitionSeries>` จาก `@remotion/transitions` แทนการ interpolate เอง
2. โครง: `<TransitionSeries.Sequence>` → `<TransitionSeries.Transition>` → `<TransitionSeries.Sequence>` สลับกัน
3. `presentation`: `fade()`, `slide()`, `wipe()` (import จาก `@remotion/transitions/fade` ฯลฯ)
4. `timing`: `linearTiming({durationInFrames})` หรือ `springTiming({config: {damping}})`
5. ใช้ `<TransitionSeries.Overlay>` สำหรับ effect ทับจุดต่อ (เช่น light leak) โดยไม่ลด timeline
6. จำไว้ว่า transition ทำให้ 2 scene overlap → total duration สั้นลงเท่า transition duration

### 8. Render

> Goal: export วิดีโอสำเร็จรูป

1. test ใน Remotion Studio ก่อน render ด้วย `bunx remotion studio`
2. render ด้วย `bunx remotion render <CompId> out/video.mp4` พร้อม flag เช่น `--codec=h264`
3. กำหนด `fps`, `width`, `height` ใน `<Composition>` ตาม deliverable
4. ใช้ `--props=props.json` สำหรับ dynamic input
5. ถ้า output เป็น GIF → ใช้ `--codec=gif --every-nth-frame=2`
6. ตั้งค่า default ผ่าน `remotion.config.ts` ด้วย `Config` จาก `@remotion/cli/config` (เช่น `Config.setConcurrency(8)`, `Config.setCodec('h265')`)
7. ใช้ `@remotion/lambda` หรือ `@remotion/cloudrun` สำหรับ cloud rendering ขนาดใหญ่

### 9. Optimize

> Goal: ลดขนาดและเวลา render

1. ใช้ `<Video>` จาก `@remotion/media` — render เร็วสุดและโหลด asset แบบ partial
2. ลด resolution ของ input ถ้าไม่จำเป็นต้องใช้ 4K
3. ใช้ `/deep-review` สำหรับ pre-compress input
4. ใช้ `--concurrency` ประมาณ `os.cpus().length` หรือตั้งใน `remotion.config.ts`
5. ใช้ `--image-format=jpeg` ถ้า render ไม่ต้องการ transparency

## Rules

### 1. Footage

- ใช้ `staticFile()` สำหรับ assets ใน `public/`
- ใช้ `<Video>` จาก `@remotion/media` เป็น default — `<OffthreadVideo>` เฉพาะ fallback, `<Html5Video>` legacy เท่านั้น
- คำนวณ frames จาก `fps` ของ composition

### 2. Timing

- ทุก duration ต้องเป็น `durationInFrames` ไม่ใช่ milliseconds (ยกเว้น `Caption` จาก parseSrt ที่เป็น ms — ต้องแปลง)
- ใช้ `useVideoConfig()` เพื่อดึง `fps` มาคำนวณ
- ใช้ `useCurrentFrame()` เท่านั้น ไม่ใช้ CSS animations

### 3. Audio

- แยก audio track ออกจาก source ถ้าต้อง mixing ด้วย `muted`
- ใช้ `<Audio>` จาก `@remotion/media` — `<Html5Audio>` เฉพาะ preview fallback
- ระวัง copyright ของ background music

### 4. Overlays

- ใช้ `<AbsoluteFill>` เป็นภาชนะหลัก
- ใช้ `interpolate()` สำหรับ fade/opacity
- ใช้ `spring()` สำหรับ motion
- ใช้ `z-index` ผ่าน style หรือ component order ไม่เกิน 3 ชั้นหลัก

### 5. Subtitles

- ใช้ `parseSrt()` จาก `@remotion/captions` — caption มี `startMs`/`endMs` ต้องแปลงเป็น frames
- fetch subtitle ภายใต้ `useDelayRender()` เสมอ
- ใช้ font ทีอ่านง่ายและ contrast สูง
- ทดสอบบน target device หรือ resolution จริง

- ใช้ /follow-lib-remotion สำหรับรายละเอียด Remotion API
- ใช้ /deep-review สำหรับ optimize input/output
- ใช้ /gen-subtitle-video สำหรับ generate subtitle
- ใช้ /use-bun-native-api ถ้าใช้ Bun เป็น runtime
- ใช้ /follow-lib-animejs ถ้าต้องการ complex animations
- ใช้ /follow-lib-iconify ถ้าต้องการ icon overlay

## Expected Outcome

- วิดีโอที trim, ต่อ, ใส่ overlay, transitions, และ subtitle ได้ตามต้องการ
- Render output ใน format ทีเลือก (mp4, gif, image sequence)
- Audio sync กับ video ถูกต้อง
- Project สามารถ render ผ่าน CLI หรือ cloud ได้
