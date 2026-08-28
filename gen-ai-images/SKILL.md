---
name: gen-ai-images
description: สร้างรูปภาพด้วย AI ผ่าน bunx CLI
argument-hint: "[prompt]"
related:
  - convert-to-svg
  - draw-svg-image
  - analyze-image
  - request-prompt-from-image
---

## Goal

สร้างรูปภาพจาก prompt ด้วย AI CLI โดยไม่ต้องเขียน code

## Scope

- ใช้ `bunx` CLI สำหรับ text-to-image generation
- รองรับทั้ง Pollinations (ไม่ต้อง API key) และ Replicate/FAL (ต้อง API key)
- บันทึก output เป็น `.png`, `.jpg`, หรือ `.webp`

## Execute

### 1. Prepare Prompt

> Goal: มี prompt ทีชัดเจน

1. รับ prompt จาก user
2. ถ้า prompt สั้น/กำกวม → ขยายด้วย details เช่น style, lighting, aspect ratio
3. ระบุ output path/filename
4. ระบุ aspect ratio หรือ size ถ้าจำเป็น

### 2. Choose Provider

> Goal: เลือก CLI ทีใช้งานได้

1. Default ใช้ `bunx @pollinations/cli gen image "<prompt>" --output <file>`
   - ไม่ต้อง API key
   - รองรับ `--model` เช่น `flux`, `gptimage`, `turbo`
2. ถ้า user มี Replicate API key → `bunx flux-replicate-mcp --api-key <key> --model ... --format <fmt>`
3. ถ้า user มี FAL API key → `bunx ai-vid` หรือ FAL CLI
4. ถ้าไม่มั่นใจ → ลอง Pollinations ก่อน

### 3. Generate Image

> Goal: รัน CLI ให้ได้ภาพ

1. ตรวจสอบ network และ CLI ใน PATH
2. รันคำสั่งด้วย prompt และ output ทีระบุ
3. รอจนกระทั่งภาพถูกดาวน์โหลด
4. ตรวจสอบไฟล์ output ว่ามีขนาด > 0

### 4. Report

> Goal: สรุปผล

1. แสดง output path
2. แสดง provider และ model ทีใช้
3. ถ้า fail → แสดง stderr และแนะนำ provider อื่น

## Rules

### 1. No API Key Leak

- ไม่ hardcode API key ใน skill
- อ่านจาก environment variable หรือถาม user
- ใช้ `--api-key` ผ่าน variable ไม่ใช่ literal

### 2. Default Free Provider

- ลอง Pollinations ก่อนเสมอถ้า user ไม่ระบุ provider
- ชี้แจง cost ถ้าใช้ paid provider

### 3. Output Format

- default output คือ `.png`
- รองรับ `.jpg`, `.webp` ด้วย `--format`
- เก็บ output ใน project หรือ temp directory

## Expected Outcome

- ไฟล์รูปภาพถูกสร้างจาก prompt
- รายงาน provider, model, และ output path
- ถ้า fail มีแนวทาง fallback
