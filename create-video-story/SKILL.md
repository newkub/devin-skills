---
name: create-video-story
description: สร้างวิดีโอจากโครงเรื่อง ฉาก ภาพ เสียง และ subtitle อย่างครบวงจร
argument-hint: "[topic]"
related:
  - gen-image-character
  - gen-ai-images
  - gen-ai-videos
  - gen-voice
  - gen-subtitle-video
  - follow-framework-remotion
  - enhance-prompt
  - report-table
---

## Goal

สร้างวิดีโอสั้นจากโครงเรื่อง โดยครอบคลุม story structure, scene details, images, video, voice, และ subtitle

## Scope

- ใช้กับโครงเรื่องสั้น เช่น social media video, story reel, promotional clip
- ถาม user เรื่อง style, orientation, และความยาว
- สร้าง story structure, บุคลิกตัวละคร, และ hooks
- สร้างรายละเอียดฉาก ได้แก่ เสียง ท่าทาง ฉากหลัง สีหน้า อารมณ์ และอื่นๆ
- สร้างภาพแต่ละฉาก โดยเรียก `/gen-image-character` เพื่อความคงเส้นคงวาของตัวละคร
- สร้างวิดีโอจากภาพ/ prompt และสร้าง subtitle

## Execute

### 1. Interview

> Goal: รวบรวม requirement ของวิดีโอ

1. รับ `topic` จาก user
2. ถาม `style` เช่น `anime`, `realistic`, `cinematic`, `motion-graphics`
3. ถาม `orientation` เช่น `portrait (9:16)`, `landscape (16:9)`, `square (1:1)`
4. ถาม `duration` หรือจำนวนฉาก (default 5 ฉาก)
5. ถาม `tone` เช่น `funny`, `dramatic`, `educational`, `emotional`
6. ถาม target audience ถ้าจำเป็น

### 2. Build Story

> Goal: สร้างโครงเรื่องและตัวละคร

1. สร้าง hook สั้นๆ ที่ดึงดูดใน 3 วินาทีแรก
2. กำหนด protagonist และ supporting characters
3. กำหนด personality, visual traits, color palette ของตัวละคร
4. สร้าง story beats: setup, conflict, climax, resolution
5. แบ่งโครงเรื่องให้พอดีกับจำนวนฉาก

### 3. Design Scenes

> Goal: วางรายละเอียดแต่ละฉาก

1. สำหรับแต่ละฉาก ระบุ:
   - หมายเลขฉากและ duration
   - สถานที่/ฉากหลัง
   - มุมกล้องและ camera movement
   - ท่าทางและ pose ของตัวละคร
   - สีหน้าและ facial expression
   - อารมณ์/บรรยากาศ
   - เสียงประกอบหรือ voiceover
   - ข้อความ subtitle
   - transition ไปฉากถัดไป
2. เก็บ scene brief ไว้ในรูปแบบ list/table
3. ใช้ `/report-table` เพื่อแสดงผล

### 4. Generate Characters

> Goal: สร้าง reference ภาพตัวละครหลัก

1. สำหรับตัวละครหลักแต่ละตัว เรียก `/gen-image-character`
2. ส่ง character brief, style, aspect-ratio, output path
3. เก็บ character anchor image และ prompt anchor
4. ตรวจสอบว่าภาพตัวละครคงเส้นคงวากัน

### 5. Generate Scene Images

> Goal: สร้างภาพสำหรับแต่ละฉาก

1. สำหรับแต่ละฉาก ประกอบ prompt จาก:
   - character anchor และ reference image
   - scene setting, pose, expression, camera angle
   - lighting, mood, style
2. เรียก `/gen-ai-images` หรือ `/gen-image-character` ตามลักษณะฉาก
3. บันทึกภาพแต่ละฉากด้วยชื่อเรียงลำดับ เช่น `scene-01.png`
4. ตรวจสอบไฟล์มีขนาด > 0

### 6. Generate Voice

> Goal: สร้างเสียงพูด/เล่าเรื่อง

1. รวบรวม script หรือ narration จากแต่ละฉาก
2. ถาม user ภาษา/เสียง ถ้าไม่ระบุให้ auto-detect
3. เรียก `/gen-voice` พร้อม text, voice, output path
4. เก็บเสียงแต่ละฉาก หรือรวมเป็นไฟล์เดียวด้วย `ffmpeg`

### 7. Generate Video

> Goal: สร้างวิดีโอจากภาพและเสียง

1. เลือกวิธีสร้างวิดีโอ:
   - เรียก `/gen-ai-videos` จาก prompt หรือ image sequence
   - ใช้ `/follow-framework-remotion` ถ้าต้องการ render แบบโปรแกรมมิ่ง
2. ระบุ duration, aspect-ratio, และ fps
3. ตรวจสอบ video file มีขนาด > 0
4. ถ้าใช้ paid provider แจ้ง user ก่อน

### 8. Generate Subtitle

> Goal: สร้าง subtitle สำหรับวิดีโอ

1. ถ้ามี video แล้ว เรียก `/gen-subtitle-video` เพื่อ transcribe
2. ถ้ามี script ก่อน สร้าง `.srt` ด้วย timestamps จาก scene durations
3. ตรวจสอบจำนวน cues และ syntax
4. บันทึกไฟล์ `<video>.srt`

### 9. Validate

> Goal: ตรวจสอบความสมบูรณ์ของวิดีโอ

1. ตรวจสอบ duration วิดีโอตรงกับ plan
2. ตรวจสอบจำนวน scene images ตรงกับ scene list
3. ตรวจสอบ subtitle cues ตรงกับเสียง
4. รายงาน outputs, scene summary, tools used

### 10. Report

> Goal: สรุปผลลัพธ์

1. ใช้ `/report-table` แสดง scenes, durations, output paths
2. ระบุ video path, subtitle path, voice path
3. ระบุ provider/model ทีใช้
4. ถ้า fail แสดง error และแนะนำ fallback

## Rules

### 1. Ask Before Paid Generation

- ถ้าต้องใช้ paid provider ให้ถาม user ก่อน
- ไม่ hardcode API key
- ใช้ environment variable หรือถาม user

### 2. Consistency

- ใช้ `/gen-image-character` เพื่อสร้าง reference ตัวละครก่อน
- เก็บ prompt anchor และ seed ของตัวละครใน context
- เปลี่ยนเฉพาะ pose/expression/background ระหว่างฉาก

### 3. No Overwrite

- ไม่ทับไฟล์เดิมโดยไม่ถาม
- ใช้ชื่อไฟล์ index เช่น `scene-01.png`, `scene-02.png`
- สร้าง output directory ถ้าจำเป็น

### 4. Reasonable Defaults

- default duration = 5 ฉาก
- default orientation = `portrait (9:16)`
- default style = `realistic` หรือ `anime` ตาม target platform
- default output format = `.mp4`

- ใช้ /enhance-prompt ถ้าจำเป็น

## Expected Outcome

- วิดีโอสั้นที่สมบูรณ์พร้อมภาพ เสียง และ subtitle
- ตารางสรุป scene ทั้งหมด
- รายงาน output paths, provider, model, duration
- ถ้า fail มีแนวทาง fallback
