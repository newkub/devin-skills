---
name: gen-image-character
description: สร้างภาพตัวละครแบบ consistency จากคำอธิบาย สไตล์ ท่าทาง และสีหน้า
argument-hint: "[character-description] [output]"
related:
  - gen-ai-images
  - draw-svg-image
  - convert-to-svg
  - create-video-story
---

## Goal

สร้างภาพตัวละครทีมีความคงเส้นคงวาระหว่างภาพ โดยใช้ prompt anchor, seed, และ negative prompt

## Scope

- รับคำอธิบายตัวละคร สไตล์ ท่าทาง สีหน้า และ aspect ratio
- สร้างภาพผ่าน `bunx` CLI โดย default ใช้ Pollinations (ไม่ต้อง API key)
- รองรับ paid providers เช่น Replicate/FAL ถ้ามี API key
- บันทึก output เป็น `.png`, `.jpg`, หรือ `.webp`
- ส่งต่อให้ `/create-video-story` เพื่อสร้างตัวละครประจำฉาก

## Execute

### 1. Prepare Character Brief

> Goal: รวบรวมข้อมูลตัวละครให้ชัดเจน

1. รับ `character-description` จาก user
2. ถาม `style` เช่น `anime`, `realistic`, `cartoon`, `3d-render`
3. ถาม `aspect-ratio` เช่น `portrait (9:16)`, `landscape (16:9)`, `square (1:1)`
4. ถามประเภทภาพ เช่น `full-body`, `half-body`, `close-up`
5. ระบุ `output` path/filename
6. ถ้าข้อมูลไม่ชัดเจน ให้ขยายด้วย age, clothing, hair, color palette

### 2. Build Consistency Prompt

> Goal: สร้าง prompt anchor เพื่อคงรูปแบบตัวละคร

1. สร้าง character anchor ที่ประกอบด้วยชุด ทรงผม สีผม/ตา และลักษณะเด่น
2. ระบุ pose, gesture, facial expression, camera angle ตาม user
3. เติม background ที่เหมาะสม
4. ใส่ negative prompt เพื่อลด deform, extra limbs, blurry face ถ้า CLI รองรับ
5. ถาม user สำหรับ seed หรือใช้ seed คงที เช่น `42`

### 3. Choose Provider

> Goal: เลือก CLI ทีใช้งานได้

1. Default: `bunx @pollinations/cli gen image "<prompt>" --output <file>`
   - ไม่ต้อง API key
   - รองรับ `--model` เช่น `flux`, `turbo`, `gptimage`
   - รองรับ `--seed` ถ้ามี
2. ถ้า user มี Replicate API key: `bunx flux-replicate-mcp --api-key <key> --model ...`
3. ถ้า user มี FAL API key: `bunx @fal-ai/cli`
4. ถ้าไม่มั่นใจ ให้ลอง Pollinations ก่อน

### 4. Generate Image

> Goal: รัน CLI ให้ได้ภาพ

1. ตรวจสอบ network และ CLI ใน PATH
2. รันคำสั่งพร้อม prompt, output, seed, aspect-ratio
3. รอจนกระทั่งภาพถูกดาวน์โหลด
4. ตรวจสอบไฟล์ output มีขนาด > 0

### 5. Validate

> Goal: ยืนยันว่าไฟล์ใช้งานได้

1. ใช้ `file` หรือ `ffprobe` ตรวจรูปแบบ
2. ถ้าต้องการ quality check ให้ระบุให้ user ตรวจสอบ output
3. รายงาน output path, provider, model, seed
4. ถ้า fail แสดง stderr และแนะนำ provider อื่น

## Rules

### 1. No API Key Leak

- ไม่ hardcode API key ใน skill
- อ่านจาก environment variable หรือถาม user
- ใช้ `--api-key` ผ่าน variable ไม่ใช่ literal

### 2. Consistency

- เก็บ character anchor และ seed ไว้ใน context สำหรับภาพถัดไป
- เปลี่ยนเฉพาะ pose/expression/background ระหว่างฉาก ไม่เปลี่ยน core traits
- ใช้ seed คงทีเมื่อเป็นไปได้

### 3. Output

- default output คือ `.png`
- รองรับ `.jpg` และ `.webp` ด้วย `--format`
- เก็บ output ใน project หรือ temp directory

- ใช้ /gen-ai-images ถ้าจำเป็น
- ใช้ /draw-svg-image ถ้าจำเป็น
- ใช้ /convert-to-svg ถ้าจำเป็น

## Expected Outcome

- ภาพตัวละครทีมีความคงเส้นคงวา
- รายงาน output path, prompt anchor, provider, model, seed
- ถ้า fail มีแนวทาง fallback
