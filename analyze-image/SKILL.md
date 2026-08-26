---
name: analyze-image
description: วิเคราะห์เนื้อหาในรูปภาพด้วย AI vision ผ่าน bunx CLI
argument-hint: "[image-path]"
related:
  - analyze-video
  - gen-ai-images
---

## Goal

วิเคราะห์รูปภาพและสรุปเนื้อหาด้วย AI vision model

## Scope

- ใช้ `bunx` CLI หรือ vision API เพื่อ analyze image
- รองรับ local file และ URL
- สามารถตอบคำถามเฉพาะเกี่ยวกับรูปภาพได้

## Execute

### 1. Prepare Image

> Goal: ตรวจสอบ input

1. รับ image path หรือ URL
2. ถ้า local file → ตรวจสอบว่ามีอยู่
3. ถ้า URL → ตรวจสอบว่าเข้าถึงได้
4. ถ้าไฟล์ใหญ่เกินไป → resize ก่อนหรือแจ้ง user

### 2. Choose CLI

> Goal: เลือก vision tool ทีใช้งานได้

1. Primary: `bunx @pollinations/cli gen text "<question>" --image <path>`
   - ไม่ต้อง API key
   - รองรับ prompt เช่น "describe this image", "what is in this image"
2. Fallback: `bunx ollama run llava "<question>" --image <path>` (ถ้ามี Ollama รันอยู่)
3. Fallback: ใช้ OpenAI/Anthropic API ผ่าน `bunx openai` หรือ `curl`

### 3. Run Analysis

> Goal: รัน analysis และรับผล

1. รันคำสั่งพร้อม prompt ที user ต้องการ
2. รอผล
3. บันทึก output ถ้า user ต้องการ

### 4. Report

> Goal: สรุปผล

1. แสดงคำตอบสั้นๆ
2. ถ้า user ถามหลาย aspect → สรุปเป็น bullet points
3. ระบุ tool ทีใช้

## Rules

### 1. No Leaks

- ไม่ hardcode API key
- ใช้ environment variable หรือถาม user

### 2. Image Size

- ถ้า image ใหญ่เกินไป ให้ resize ก่อน
- รองรับ `.png`, `.jpg`, `.jpeg`, `.webp`, `.gif`

### 3. Prompt

- ถ้า user ไม่ระบุคำถาม → ถาม "describe this image"
- รองรับ prompt หลายภาษา

## Expected Outcome

- คำอธิบายหรือคำตอบเกี่ยวกับรูปภาพ
- ระบุ tool ทีใช้
- ถ้า fail มีแนวทาง fallback
