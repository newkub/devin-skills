---
name: generate-prompt-from-image
description: สร้าง image generation prompt จากรูปภาพด้วย AI vision ผ่าน bunx CLI
argument-hint: "[image-path] [style]"
related:
  - gen-ai-images
  - gen-image-character
  - report-codeblock
---

## Goal

สร้าง prompt สำหรับ AI image generation จากรูปภาพที่ user ให้มา

## Scope

- รองรับ local image file และ URL
- รองรับ output สำหรับ Midjourney, Stable Diffusion, DALL-E, Pollinations
- ใช้ bunx CLI หรือ vision API โดยไม่ต้องเขียน code

## Execute

### 1. Prepare Image

> Goal: ตรวจสอบ input

1. รับ image path หรือ URL
2. ถ้า local file → ตรวจสอบว่ามีอยู่จริง
3. ถ้า URL → ตรวจสอบว่าเข้าถึงได้
4. ถ้าไฟล์ใหญ่เกินไป → resize ก่อนหรือแจ้ง user

### 2. Choose Vision Tool

> Goal: เลือก tool สำหรับวิเคราะห์รูปภาพ

1. Primary: `bunx @pollinations/cli gen text "<question>" --image <path>`
   - ไม่ต้อง API key
   - ใช้คำถามเฉพาะเพื่อขอ prompt
2. Fallback: `bunx ollama run llava "<question>" --image <path>` ถ้ามี Ollama รันอยู่
3. Fallback: ใช้ OpenAI/Anthropic vision API ผ่าน `bunx openai` หรือ `curl` ถ้ามี key

### 3. Generate Prompt

> Goal: ได้ prompt จากรูปภาพ

1. สร้างคำถามเฉพาะตาม style:
   - สำหรับ Midjourney/SD: `Generate a detailed Midjourney-style prompt that describes this image, including subject, style, lighting, composition, color palette, and mood.`
   - สำหรับ DALL-E: `Generate a concise DALL-E prompt that describes this image in English.`
   - ถ้า user ไม่ระบุ style → ใช้คำถาม generic: `Generate a detailed image generation prompt that describes this image.`
2. รันคำสั่งกับ image path
3. รอผล
4. บันทึก prompt ลงไฟล์ถ้า user ต้องการ

### 4. Refine And Report

> Goal: ปรับ prompt ให้พร้อมใช้

1. ตัดส่วนที่ไม่จำเป็น เช่น "Sure, here is..."
2. ถ้า prompt ยาวเกินไป → ย่อให้เหลือประมาณ 100 คำ
3. ถ้า user ต้องการ style เฉพาะ → เติม parameters เช่น `--ar 16:9` หรือ `--v 6`
4. แสดงผลด้วย `/report-codeblock`

## Rules

### 1. No API Key Leak

- ไม่ hardcode API key
- ใช้ environment variable หรือถาม user

### 2. Image Size

- รองรับ `.png`, `.jpg`, `.jpeg`, `.webp`, `.gif`
- ถ้า image ใหญ่เกินไปให้ resize ก่อน

### 3. Prompt Output

- default ใช้ภาษาอังกฤษเพื่อ compatibility กับ image generators
- ถ้า user ขอภาษาอื่น ให้ระบุ

### 4. Output Only Prompt

- ไม่ใช้ small talk ในผลลัพธ์
- ถ้าต้องการคำอธิบายเพิ่ม ให้สรุปสั้นๆ

## Expected Outcome

- image generation prompt ที่ copy ไปใช้ได้ทันที
- ระบุ tool ที่ใช้
- ถ้า fail มีแนวทาง fallback
