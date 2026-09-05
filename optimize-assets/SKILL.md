---
name: optimize-assets
description: ปรับปรุง assets: images, fonts, media, formats, compression, lazy loading
argument-hint: "[asset-or-folder]"
related:
  - review-assets
  - run-build
  - report-table
---

## Goal

ปรับปรุง assets: images, fonts, media ด้วย formats, compression, lazy loading, responsive sizes

## Scope

ใช้กับ web apps โดย audit images, fonts, media files ใน `public/`, `src/assets`

## Execute

### 1. Audit Assets

> Goal: Audit Assets

1. ตรวจ `public/`, `src/assets` files
2. วัดขนาดไฟล์ทีใหญ่
3. ระบุ assets ทีไม่ optimize

### 2. Image Optimization

> Goal: Image Optimization

1. แปลง PNG/JPG เป็น WebP/AVIF
2. ใช้ `srcset` และ `sizes`
3. กำหนด `width`/`height`
4. ใช้ `loading="lazy"` สำหรับ below-fold
5. ใช้ `decoding="async"`

### 3. Font Optimization

> Goal: Font Optimization

1. ใช้ `font-display: swap`
2. Preload critical fonts
3. ใช้ subset fonts ถ้าได้
4. ลด font weights ทีไม่ใช้

### 4. Media And Icons

> Goal: Media And Icons

1. ใช้ SVG icons ถ้าเหมาะสม
2. ใช้ video lazy loading
3. ใช้ audio compression

### 5. Validate

> Goal: Validate

1. รัน `/run-build`
2. วัด total asset size
3. ทำ `/report-table` สรุป

## Rules

- ไม่ลดคุณภาพเกินไป
- รองรับ fallback formats
- ใช้ responsive images

## Expected Outcome

- Asset size ลดลง
- LCP ดีขึ้น
- CLS ลดลง
- ถ้าต้อง review ก่อน → ใช้ `/review-assets`

