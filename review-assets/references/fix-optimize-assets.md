# Fix Guide

(merged from: optimize-assets)

## Goal

ปรับปรุง assets (images, fonts, media) โดย audit แล้ว dispatch ไปยัง skill เฉพาะ type — ไม่ทำ optimize เองโดยตรง

## Scope

ใช้กับ web apps โดย audit `public/`, `src/assets` แล้วส่งต่อให้ `/review-assets`, `/review-assets`, `/review-assets` ตามประเภท asset

## Execute

### 1. Audit Assets

> Goal: รวบรวม assets และจัดกลุ่มตาม type

1. ตรวจ `public/`, `src/assets` files — วัดขนาดไฟล์ที่ใหญ่
2. จัดกลุ่ม: images (png/jpg/gif/svg), fonts (woff/ttf/otf), media (video/audio)
3. ระบุ assets ที่โหลด critical path และที่ไม่ optimize
4. ถ้าต้องการ review-only → ทำ `/review-assets` แทน

### 2. Dispatch By Type

> Goal: ส่งต่อไป skill เฉพาะ type

| No. | Asset Type | Skill |
|-----|-----------|-------|
| 1 | Images (PNG/JPG → WebP/AVIF, srcset, lazy) | `/review-assets` |
| 2 | Fonts (subsetting, preload, font-display) | `/review-assets` |
| 3 | Video/audio (compression, poster, lazy) | `/review-assets` |
| 4 | SVG icons / inline icons | ใช้ SVG แทน icon fonts ถ้าเหมาะสม |

### 3. Validate

> Goal: Validate

1. รัน `/run-build`
2. วัด total asset size ก่อน/หลัง
3. ทำ `/report-table` สรุป

## Rules

- Dispatch เท่านั้น — how-to อยู่ใน sub-skills ไม่ duplicate ที่นี่
- ไม่ลดคุณภาพเกินไป — รองรับ fallback formats และ responsive images

## Expected Outcome

- ทุก asset type ถูก optimize โดย skill เฉพาะทาง
- Asset size ลดลง LCP ดีขึ้น CLS ลดลง
