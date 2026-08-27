---
name: gen-subtitle-video
description: สร้าง subtitle .srt จากวิดีโอด้วย bunx CLI
argument-hint: "[video-path]"
related:
  - analyze-video
  - convert-files-format
  - gen-voice
---

## Goal

สร้างไฟล์ subtitle `.srt` จากวิดีโอหรือ audio ด้วย speech-to-text CLI

## Scope

- ใช้ `bunx` CLI สำหรับ transcription
- รองรับหลาย provider: `@illyism/transcribe`, Pollinations, `whisper.cpp`
- รองรับหลายภาษา

## Execute

### 1. Prepare Input

> Goal: ตรวจสอบ input

1. รับ video หรือ audio path
2. ตรวจสอบว่าไฟล์มีอยู่และรูปแบบรองรับ (mp4, mov, avi, mkv, mp3, wav, m4a)
3. ระบุ output path (default คือ `<input>.srt`)
4. ระบุภาษา ถ้า user รู้

### 2. Choose CLI

> Goal: เลือก transcription tool

1. Primary: `bunx @illyism/transcribe <video>`
   - ใช้ OpenAI Whisper API
   - สร้าง `.srt` อัตโนมัติ
   - รองรับ video โดยตรง
2. Fallback: `bunx @pollinations/cli gen transcribe <video>`
   - ไม่ต้อง API key
   - ถ้า API รองรับ video transcription
3. Fallback (local): `whisper-subs <video> --model <model> --language <lang>`
   - ต้อง download model
4. สุดท้าย: `ffmpeg` ดึง audio แล้วใช้ `whisper` Python

### 3. Run Transcription

> Goal: สร้าง subtitle

1. รันคำสั่งพร้อม output path
2. รอจนกระทั่งเสร็จ
3. ตรวจสอบไฟล์ `.srt` มีขนาด > 0
4. ถ้าภาษาไม่ถูกต้อง → ระบุ `--language` แล้วรันใหม่

### 4. Validate

> Goal: ตรวจสอบ subtitle

1. อ่านไฟล์ `.srt` สั้นๆ ตรวจ syntax
2. นับจำนวน cues
3. รายงาน path, จำนวน cues, ระยะเวลา

## Rules

### 1. API Key

- `@illyism/transcribe` ต้องการ `OPENAI_API_KEY`
- ถ้าไม่มี → ใช้ Pollinations หรือ local whisper
- ไม่ hardcode key

### 2. ffmpeg

- ถ้า tool ต้องการ audio only → ใช้ `ffmpeg -i <video> -vn -acodec pcm_s16le -ar 16000 -ac 1 audio.wav`
- ตรวจสอบ ffmpeg ติดตั้ง

### 3. Output

- default output คือ `<input>.srt`
- รองรับ `.vtt` ถ้า user ต้องการ
- ไม่ทับไฟล์เดิมโดยไม่ถาม

## Expected Outcome

- ไฟล์ `.srt` ที sync กับวิดีโอ
- รายงาน path, จำนวน cues, tool ทีใช้
- ถ้า fail มีแนวทาง fallback
