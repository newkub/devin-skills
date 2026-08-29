---
name: gen-ai-videos
description: สร้างวิดีโอด้วย AI ผ่าน bunx CLI
argument-hint: "[prompt]"
related:
  - gen-ai-images
  - gen-subtitle-video
---

## Goal

สร้างวิดีโอสั้นจาก prompt ด้วย AI CLI

## Scope

- ใช้ `bunx` CLI สำหรับ text-to-video หรือ image-to-video
- รองรับทั้ง free provider (Pollinations) และ paid providers (FAL, Google Veo, Runway)
- บันทึก output เป็น `.mp4` หรือ `.webm`

## Execute

### 1. Prepare Prompt

> Goal: มี prompt และ config ทีชัดเจน

1. รับ prompt จาก user
2. ระบุ duration (default 5 วินาที), aspect ratio (16:9, 9:16, 1:1)
3. ถ้ามี first-frame image → เก็บ path
4. ระบุ output path

### 2. Choose Provider

> Goal: เลือก CLI ทีใช้งานได้

1. Default: `bunx @pollinations/cli gen video "<prompt>" --duration 5 --output <file>`
   - ไม่ต้อง API key
   - รองรับ duration และ prompt
2. ถ้า user มี API key:
   - `bunx ai-vid generate -p "<prompt>" -P <provider> -m <model> -o <file>`
   - `bunx @fal-ai/cli` ถ้ามี
3. ถ้าต้องการ high quality → ถาม user ถึง API key ก่อน

### 3. Generate Video

> Goal: รัน CLI ให้ได้วิดีโอ

1. ตรวจสอบ network และ CLI
2. รันคำสั่งพร้อม prompt, duration, output
3. รอจนกระทั่งไฟล์ถูกดาวน์โหลด
4. ตรวจสอบขนาดไฟล์ > 0

### 4. Report

> Goal: สรุปผล

1. แสดง output path
2. แสดง provider, model, duration
3. ถ้า fail → แสดง stderr และแนะนำให้ลอง provider อื่นหรือลด duration

## Rules

### 1. Cost Awareness

- แจ้ง user ว่า video generation มักมี cost สูงกว่า image
- ถ้าใช้ paid provider ต้องมี API key

### 2. Reasonable Defaults

- default duration = 5 วินาที
- default aspect ratio = 16:9
- ไม่สร้างวิดีโอนานเกินไปโดยไม่ถาม user

### 3. No Leaks

- ไม่ hardcode API key
- ใช้ environment variable หรือถามก่อน

## Expected Outcome

- ไฟล์วิดีโอถูกสร้างจาก prompt
- รายงาน provider, duration, output path
- ถ้า fail มีแนวทาง fallback
