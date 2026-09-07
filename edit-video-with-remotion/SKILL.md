---
name: edit-video-with-remotion
description: ตัดต่อ ประกอบ และ render วิดีโอจาก footage ด้วย Remotion v4 บน React
argument-hint: "[input-video-or-composition]"
related:
  - follow-lib-remotion
  - optimize-videos
  - gen-subtitle-video
  - follow-runtime-bun
  - follow-lib-animejs
  - follow-lib-iconify
  - optimize-images
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

ดูเพิ่มเติม: /follow-lib-remotion, /optimize-videos, /gen-subtitle-video

## Execute

### 1. Setup Project

> Goal: เตรียม Remotion project สำหรับ editing

1. สร้าง project ด้วย `bunx create-video@latest --yes --blank my-edit`
2. ติดตั้ง `@remotion/media` สำหรับ video/audio ขนาดใหญ่
3. ติดตั้ง `@remotion/gif` ถ้าต้องการใช้ GIF เป็น source/overlay
4. ใส่ input footage ใน `public/` แล้วใช้ `staticFile()` อ้างอิง
5. ติดตั้ง `bun` หรือ `npm` ตาม project

### 2. Import And Trim Source Videos

> Goal: ใช้ footage เดิมเป็น source

1. ใช้ `<OffthreadVideo>` จาก `@remotion/media` สำหรับ video ขนาดใหญ่ — ดีกว่า `<Video>` ในการ render
2. กำหนด `src` ด้วย `staticFile('/input.mp4')` หรือ path แบบ absolute
3. ใช้ `trimBefore` เพื่อข้าม frames ต้น และ `durationInFrames` เพื่อควบคุมความยาว
4. ใช้ `<Sequence>` ห่อ source video เพื่อ shift ตำแหน่งบน timeline ด้วย `from`
5. คำนวณ frames จากเวลา: `frames = time * fps` โดยใช้ `useVideoConfig()`

### 3. Concatenate Clips

> Goal: ต่อ clip หลายอันติดกัน

1. ใช้ `<Series>` และ `<Series.Sequence>` เพื่อเล่น clip ต่อกันเป็นลำดับ
2. ระบุ `durationInFrames` ในแต่ละ `<Series.Sequence>`
3. ใช้ `<Sequence>` ทั่วไปถ้าต้องการ control layout หรือ z-index มากกว่า
4. ตรวจให้ total `durationInFrames` ใน `<Composition>` ครอบคลุมทุก clip

### 4. Add Overlays And Graphics

> Goal: ใส่ overlay บนวิดีโอ

1. ใช้ `<AbsoluteFill>` เป็นภาชนะ overlay เต็ม frame
2. ใช้ `<Img>` สำหรับ logo/image overlay
3. ใช้ text component ธรรมดาใน React สำหรับ lower third, title
4. ใช้ `interpolate()` สำหรับ fade in/out ของ opacity
5. ใช้ `spring()` สำหรับ motion-based intro/outro
6. ใช้ `useCurrentFrame()` เพื่อ sync animation กับ timeline

### 5. Add Subtitles

> Goal: ใส่ subtitle/caption ลงวิดีโอ

1. สร้าง subtitle data ในรูปแบบ `{ text: string, startFrame: number, endFrame: number }[]`
2. ใช้ `/gen-subtitle-video` สำหรับสร้าง `.srt` แล้ว parse เป้น array
3. แสดง subtitle ด้วย React component ที่ conditionally render ตาม `useCurrentFrame()`
4. วาง subtitle ด้านล่างจอ พร้อม padding และ background contrast

### 6. Handle Audio

> Goal: จัดการ audio track

1. ใช้ `<OffthreadVideo>` ด้วย `muted=true` ถ้าไม่ต้องการ audio ของ source
2. ใช้ `<Html5Audio>` หรือ `<Audio>` สำหรับ background music หรือ voice over
3. ปรับ `volume` และ `playbackRate` ตาม scene
4. ใช้ `interpolate()` สำหรับ fade in/out ของ volume

### 7. Add Transitions

> Goal: ใส่ transitions ระหว่าง clip

1. ใช้ `<Series>` transition slot โดย render transition component ระหว่าง `<Series.Sequence>`
2. ใช้ `interpolate()` สำหรับ crossfade opacity ระหว่าง 2 clip
3. ใช้ `spring()` สำหรับ slide/motion transition
4. คำนวณ duration ของ transition เป็น frames และรวมไว้ในจำนวน `durationInFrames`

### 8. Render

> Goal: export วิดีโอสำเร็จรูป

1. test ใน Remotion Studio ก่อน render ด้วย `bunx remotion studio --no-open`
2. render ด้วย `bunx remotion render MyComp --codec=h264 out/video.mp4`
3. กำหนด `fps`, `width`, `height` ตาม deliverable ที่ต้องการ
4. ใช้ `--props props.json` สำหรับ dynamic input บน Windows
5. ถ้า output เป็น GIF → ใช้ `--codec=gif --every-nth-frame=2`
6. ใช้ `@remotion/lambda` หรือ `@remotion/cloudrun` สำหรับ cloud rendering ขนาดใหญ่

### 9. Optimize

> Goal: ลดขนาดและเวลา render

1. ใช้ `<OffthreadVideo>` แทน `<Video>` เพื่อลด browser decoding overhead
2. ลด resolution ของ input ถ้าไม่จำเป็นต้องใช้ 4K
3. ใช้ `/optimize-videos` สำหรับ pre-compress input
4. ใช้ `--concurrency` ที่เหมาะสมกับ CPU
5. ใช้ `--image-format=jpeg` ถ้า render ด้วย transparency ไม่จำเป็น

## Rules

### 1. Footage

- ใช้ `staticFile()` สำหรับ assets ใน `public/`
- ใช้ `<OffthreadVideo>` สำหรับ video ขนาดใหญ่
- หลีกเลี่ยง `<Video>` ใน render ขนาดใหญ่
- คำนวณ frames จาก `fps` ของ composition

### 2. Timing

- ทุก duration ต้องเป็น `durationInFrames` ไม่ใช่ milliseconds
- ใช้ `useVideoConfig()` เพื่อดึง `fps` มาคำนวณ
- ใช้ `useCurrentFrame()` เท่านั้น ไม่ใช้ CSS animations

### 3. Audio

- แยก audio track ออกจาก source ถ้าต้อง mixing ด้วย `muted=true`
- ใช้ `<Html5Audio>` สำหรับ audio ไม่ต้องการ video
- ระวัง copyright ของ background music

### 4. Overlays

- ใช้ `<AbsoluteFill>` เป็นภาชนะหลัก
- ใช้ `interpolate()` สำหรับ fade/opacity
- ใช้ `spring()` สำหรับ motion
- ใช้ `z-index` ผ่าน style หรือ component order ไม่เกิน 3 ชั้นหลัก

### 5. Subtitles

- subtitle data ต้องมี `startFrame`/`endFrame` ชัดเจน
- ใช้ font ทีอ่านง่ายและ contrast สูง
- ทดสอบบน target device หรือ resolution จริง

- ใช้ /follow-lib-remotion สำหรับรายละเอียด Remotion API
- ใช้ /optimize-videos สำหรับ optimize input/output
- ใช้ /gen-subtitle-video สำหรับ generate subtitle
- ใช้ /follow-runtime-bun ถ้าใช้ Bun เป็น runtime
- ใช้ /follow-lib-animejs ถ้าต้องการ complex animations
- ใช้ /follow-lib-iconify ถ้าต้องการ icon overlay
- ใช้ /optimize-images ถ้าต้องการ optimize image assets

## Expected Outcome

- วิดีโอที trim, ต่อ, ใส่ overlay, transitions, และ subtitle ได้ตามต้องการ
- Render output ใน format ทีเลือก (mp4, gif, image sequence)
- Audio sync กับ video ถูกต้อง
- Project สามารถ render ผ่าน CLI หรือ cloud ได้
