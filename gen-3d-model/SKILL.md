---
name: gen-3d-model
description: สร้าง 3D model จาก prompt หรือรูปภาพด้วย AI CLI
argument-hint: "[prompt]"
related:
  - gen-ai-images
  - analyze-image
---

## Goal

สร้าง 3D model จาก text prompt หรือ image ด้วย AI generation CLI

## Scope

- ใช้ CLI เช่น Tripo หรือ Meshy สำหรับ text/image-to-3D
- รองรับ output `.glb`, `.fbx`, `.obj`
- รองรับ post-processing: texture, rig, animation

## Execute

### 1. Prepare Input

> Goal: ระบุสิ่งทีต้องสร้าง

1. รับ prompt หรือ image path จาก user
2. ระบุ output format (default `.glb`)
3. ระบุคุณภาพหรือรูปแบบ (low-poly, high-poly, textured, rigged)
4. ถ้า user ไม่มี API key → แนะนำ Pollinations ถ้าใช้ได้

### 2. Choose CLI

> Goal: เลือก tool ทีพร้อมใช้

1. Primary: `bunx @tripo3d/cli generate text "<prompt>" --wait -o model.glb`
   - รองรับ text-to-3D
   - ต้องการ `TRIPO_API_KEY` หรือ `tripo auth login`
2. Fallback: `bunx meshy-cli make "<prompt>" -o model.glb`
   - OAuth login ผ่าน browser
3. Fallback (image): `bunx @tripo3d/cli generate image <path> --wait -o model.glb`
4. Fallback (local): ใช้ `tripo-cli` จาก source หรือ `re-ovo/tripo-cli` บน GitHub

### 3. Generate Model

> Goal: รัน 3D generation

1. ตรวจสอบ CLI และ authentication
2. รันคำสั่งพร้อม prompt/output
3. รอ task เสร็จ (CLI `--wait` จะ poll ให้)
4. ตรวจสอบไฟล์ output

### 4. Post-Process (Optional)

> Goal: ปรับแต่ง model

1. ถ้าต้องการ texture → `tripo process texture <id> --wait`
2. ถ้าต้องการ rig/animation → `tripo process rig <id> --wait`
3. ถ้าต้องการ convert format → `tripo export <id> --format fbx`

### 5. Report

> Goal: สรุปผล

1. แสดง output path
2. แสดง provider, model, format
3. แจ้ง cost หรือ credits ทีใช้ถ้าทราบ

## Rules

### 1. API Key

- Tripo/Meshy ต้องการ API key หรือ login
- ไม่ hardcode key
- ถ้า user ไม่มี → ใช้ Pollinations หรือบริการ free ก่อนถ้าได้

### 2. Cost

- 3D generation มี cost สูง
- แจ้ง user ก่อนรัน

### 3. Output

- default คือ `.glb`
- รองรับ `.fbx`, `.obj` ตาม CLI
- เก็บ output ใน project directory

## Expected Outcome

- 3D model ไฟล์ถูกสร้างจาก prompt/image
- รายงาน provider, output path, format
- ถ้า fail มีแนวทาง fallback
