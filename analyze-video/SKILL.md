---
name: analyze-video
description: วิเคราะห์เนื้อหาในวิดีโอด้วย AI vision ผ่าน frame extraction
argument-hint: "[video-path]"
related:
  - analyze-image
  - gen-subtitle-video
  - gen-ai-videos
---

## Goal

วิเคราะห์วิดีโอและสรุปเนื้อหาโดย extract key frames และใช้ AI vision

## Scope

- ใช้ `ffmpeg` สำหรับ extract frames
- ใช้ `/analyze-image` วิเคราะห์ frames
- สรุปเป็น description, actions, objects, scene transitions

## Execute

### 1. Prepare Video

> Goal: ตรวจสอบ input

1. รับ video path
2. ตรวจสอบว่าไฟล์มีอยู่
3. ตรวจสอบ duration ด้วย `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 <video>`
4. ถ้า video ยาวเกินไป → กำหนด max frames หรือถาม user

### 2. Extract Frames

> Goal: ดึง key frames ออกมา

1. สร้าง temp directory สำหรับ frames
2. ใช้ `ffmpeg -i <video> -vf "fps=1/5,scale=640:-1" -q:v 2 frame_%03d.jpg`
   - สำหรับ video 5 วินาทีจะได้ ~1 frame
   - สำหรับ 60 วินาทีจะได้ ~12 frames
3. ถ้า video ยาวมาก → ใช้ `fps=1/10` หรือ sample ที timestamps สำคัญ
4. บันทึก frame paths

### 3. Analyze Frames

> Goal: วิเคราะห์แต่ละ frame

1. ใช้ `/analyze-image` กับแต่ละ frame
2. เก็บ descriptions ของแต่ละ frame
3. ถ้ามีเสียงหรือ subtitle → ใช้ `/gen-subtitle-video` เพิ่ม context

### 4. Summarize

> Goal: สรุปเนื้อหาวิดีโอ

1. รวบรวม descriptions จาก frames
2. ระบุ objects, actions, locations, scene transitions
3. สร้าง summary สั้นๆ แบบ paragraph หรือ bullet points
4. ถ้า user ต้องการคำถามเฉพาะ → ตอบตามคำถาม

### 5. Report

> Goal: ส่งมอบผล

1. แสดง summary
2. แสดงจำนวน frames ทีวิเคราะห์
3. แสดง tool ทีใช้
4. ลบ temp frames ถ้า user ไม่ต้องการเก็บ

## Rules

### 1. Frame Rate

- ไม่ extract ทุก frame ถ้าไม่จำเป็น
- ใช้ interval เหมาะสม เช่น 1 frame ต่อ 5-10 วินาที
- ถ้า video สั้น (<10s) อาจใช้ 2-3 frames

### 2. Privacy

- ไม่ upload frames ไปยัง public service โดยไม่ถาม
- ถ้าใช้ cloud API ให้แจ้ง user

### 3. ffmpeg

- ถ้าไม่มี `ffmpeg` → ให้ติดตั้งก่อนหรือใช้ `/mise use -g ffmpeg`
- ตรวจสอบ `ffprobe` ก่อน extract

## Expected Outcome

- Summary ของวิดีโอ
- รายการ key frames ทีวิเคราะห์
- ตอบคำถามเฉพาะของ user ถ้ามี
