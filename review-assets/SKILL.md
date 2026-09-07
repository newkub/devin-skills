---
name: review-assets
description: ตรวจสอบ static assets: images, fonts, media ว่า optimize, format และ loading strategy เหมาะสมหรือไม่
argument-hint: "[asset-or-folder]"
related:  - scan-codebase
  - report-table
  - review-bundle
---

## Goal

ตรวจสอบ static assets (images, fonts, media) ว่า optimize, format และ loading strategy เหมาะสมหรือไม่ ก่อนส่งต่อไปยัง section `## Fix`

## Scope

ใช้กับ web apps โดย audit images, fonts, media files ใน `public/`, `src/assets`

## Execute

### 1. Audit Assets

> Goal: รวบรวม assets และขนาด

1. ทำ `/scan-codebase` หา `public/`, `src/assets`
2. วัดขนาดไฟล์ทีใหญ่ จัดกลุ่มตาม type
3. ระบุ assets ทีโหลด critical path

### 2. Review Image Formats

> Goal: ตรวจรูปแบบและ responsive

1. ตรวจ `png`/`jpg` ทีควรเป้น `webp`/`avif`
2. ตรวจ `srcset`, `sizes`, `loading="lazy"`, `decoding="async"`
3. ตรวจ `width`/`height` เพื่อ prevent CLS

### 3. Review Fonts And Media

> Goal: ตรวจ font/media strategy

1. ตรวจ `font-display: swap` และ preloading
2. ตรวจ subset fonts และ weights ทีไม่ใช้
3. ตรวจ video/audio ที auto-load หรือไม่มี poster

### 4. Rate And Report

> Goal: สรุป findings พร้อม fix direction

1. ทำ `/report-table` ด้วย columns: No., Asset, Issue, Severity, Fix
2. ชี้ไป section `## Fix` สำหรับการแก้ไข
3. ถ้ามี bundle ปัญหาด้วย → เชื่อม `/review-bundle`

## Rules

### 1. Read Only

- ห้ามแก้ไข assets หรือ build config ระหว่าง review
- ใช้ audit และ measurement เท่านั้น

### 2. Evidence Required

- ทุก finding ต้องมี path, size, หรือ metric
- ไม่แนะนำ format โดยไม่มี browser support context

## Fix

> ทำ section นี้เฉพาะเมื่อ user confirm ให้แก้ findings หลังรายงาน — ข้ามถ้า scope เป็น review/report-only เช่นถูก dispatch จาก `/deep-review-codebase` หรือ `/review`

Merged from: optimize-assets, optimize-fonts, optimize-images, optimize-videos

1. จัดลำดับ findings ตาม severity — critical ก่อน แล้วแก้ทีละรายการพร้อม verify ทันทีหลังแก้
2. เลือก fix guide ที่ตรงกับ finding จากรายการด้านล่าง
3. ทุก fix ต้องรักษา behavior เดิม ผ่าน `/run-check` และ `/run-test-unit` ถ้ามี แล้วสรุปผลด้วย `/report-before-after`

- `references/fix-optimize-assets.md` — Dispatch การ optimize static assets ไปยัง review-assets, review-assets, review-assets ตาม asset type
- `references/fix-optimize-fonts.md` — Optimize web fonts — subsetting, preload, font-display และ self-hosting สำหรับ LCP/CLS
- `references/fix-optimize-images.md` — Compress และ convert รูปใน project เป็น WebP/AVIF พร้อมรายงาน size savings
- `references/fix-optimize-videos.md` — Optimize video delivery — compression, formats, poster frames และ lazy loading
## Expected Outcome

- รายงาน findings ครอบคลุม images, fonts, media
- ทุก finding มี evidence และ severity
- next action ชัดเจนผ่าน section `## Fix`
