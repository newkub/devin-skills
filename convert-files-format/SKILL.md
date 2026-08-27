---
name: convert-files-format
description: แปลงไฟล์ระหว่าง formats ต่างๆ ด้วย bunx CLI โดยรองรับ image และ document
argument-hint: "[input] [output-format]"
related:
  - convert-to-svg
---

## Goal

แปลงไฟล์จาก format หนึ่งไปอีก format ด้วย `bunx` CLI ตาม output format ที user ระบุ

## Scope

- รองรับ image formats: `.webp`, `.svg` (vector)
- ใช้ `bunx` CLI ตาม format
- ส่งต่อไปยัง skill เฉพาะทางถ้า format มี skill ของตัวเอง
- รองรับ single file และ directory

## Execute

### 1. Identify Input

> Goal: ตรวจสอบ input และ output format

1. รับ input path จาก user
2. ระบุ output format จาก argument หรือ extension ทีต้องการ
3. ตรวจสอบ input file มีอยู่และเป็น format ทีรองรับ
4. ถ้าไม่ระบุ output format → `/ask-me`

### 2. Route By Format

> Goal: เลือกวิธีแปลงตาม format

1. ถ้า output เป็น `.webp` → ใช้ [references/webp.md](references/webp.md)
2. ถ้า output เป็น `.svg` → ทำ `/convert-to-svg`
3. ถ้า output เป็น format อื่น → หา CLI หรือ library ทีรองรับ
4. ถ้าไม่มี tool → `/ask-me` หรือเขียน Bun script

### 3. Run Conversion

> Goal: รัน command แปลง format

1. รันคำสั่งตาม guide ของ format ทีเลือก
2. ตรวจสอบ output path
3. ถ้า input เป็น directory → ทำ batch/recursive

### 4. Validate

> Goal: ยืนยัน output ถูกต้อง

1. ตรวจสอบ output file มีขนาด > 0
2. ตรวจ type ด้วย `file` command หรือเปิดดู
3. รายงาน input/output paths, tool ทีใช้

## Rules

### 1. Format Selection

- ถ้า output เป็น `.webp` ใช้ guide ใน `references/webp.md`
- ถ้า output เป็น `.svg` ใช้ `/convert-to-svg`
- ไม่ลบไฟล์ต้นฉบับโดย default

### 2. Fallback

- ถ้า `bunx` CLI ไม่พร้อม → ใช้ `sharp` สำหรับ image หรือเขียน Bun script
- ถ้า fail → ลอง tool ถัดไปใน chain ของ format

### 3. Quality

- สำหรับ WebP: default quality = 85
- สำหรับ SVG: ใช้กับ line art/logo ดีทีสุด
- แจ้ง user ถ้า format ไม่เหมาะกับ input

## Expected Outcome

- Output file ถูกสร้างตาม format ทีระบุ
- รายงาน tool, paths, options
- ไม่มีไฟล์ต้นฉบับถูกลบ
