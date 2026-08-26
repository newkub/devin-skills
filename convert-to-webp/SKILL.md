---
name: convert-to-webp
description: แปลงรูปภาพเป็น WebP ด้วย bunx CLI
argument-hint: "[input]"
related:
  - convert-to-svg
  - draw-svg-image
---

## Goal

แปลงรูปภาพ PNG/JPG/GIF เป็น `.webp` ด้วย `bunx` CLI อย่างรวดเร็ว

## Scope

- รับ input เป็นไฟล์หรือ directory
- รองรับ quality, output directory, recursive
- รองรับหลาย CLI ตามสภาพแวดล้อม

## Execute

### 1. Identify Input

> Goal: ระบุสิ่งทีต้องแปลง

1. รับ input path จาก user
2. ตรวจสอบว่าเป็นไฟล์หรือ directory
3. ถ้าไฟล์ → ระบุนามสกุล `.png`, `.jpg`, `.jpeg`, `.gif`, `.tiff`
4. ถ้า directory → ระบุว่า recursive หรือไม่

### 2. Choose CLI

> Goal: เลือก tool ทีพร้อมใช้

1. Primary: `bunx lazywebp <input>`
   - ไฟล์: `bunx lazywebp -q 85 photo.png`
   - หลายไฟล์: `bunx lazywebp a.png b.png`
   - directory: `bunx lazywebp -r -q 85 -o output/ images/`
2. Fallback: `bunx @nathievzm/lumi -i <input> -f .webp`
3. Fallback: `bunx 2webp <input> --format=webp --output=<dir>`
4. ถ้าไม่มี CLI ใดเลย → เขียน Bun script ด้วย `sharp`

### 3. Run Conversion

> Goal: แปลงไฟล์ให้เสร็จ

1. รันคำสั่งพร้อม quality ทีระบุ (default 85)
2. ตรวจสอบ output path
3. ถ้า input เป็น directory ให้ preserve structure
4. รอจนกระทั่ง process เสร็จ

### 4. Validate

> Goal: ยืนยันว่า WebP ถูกสร้าง

1. ตรวจสอบไฟล์ output มีขนาด > 0
2. เปิดดูหรือใช้ `file` command ตรวจ type
3. รายงาน input/output paths และขนาดไฟล์

## Rules

### 1. Quality

- default quality = 85
- ถ้า user ไม่ระบุ quality ให้ใช้ 85
- quality 0-100

### 2. Backup

- ไม่ลบไฟล์ต้นฉบับโดย default
- ถ้า user ต้องการ replace → ขอ confirm

### 3. Fallback Chain

- ลอง `lazywebp` ก่อน
- ถ้า fail → `lumi` หรือ `2webp`
- สุดท้าย → `sharp` script

## Expected Outcome

- ไฟล์ `.webp` ถูกสร้างจาก input
- ขนาดไฟล์น้อยลงกว่าต้นฉบับ
- รายงาน paths, quality, และ tool ทีใช้
