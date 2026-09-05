---
name: review-assets
description: ตรวจสอบ static assets: images, fonts, media ว่า optimize, format และ loading strategy เหมาะสมหรือไม่
argument-hint: "[asset-or-folder]"
related:
  - optimize-assets
  - scan-codebase
  - report-table
  - review-bundle
---

## Goal

ตรวจสอบ static assets (images, fonts, media) ว่า optimize, format และ loading strategy เหมาะสมหรือไม่ ก่อนส่งต่อให้ `/optimize-assets`

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
2. ชี้ไป `/optimize-assets` สำหรับการแก้ไข
3. ถ้ามี bundle ปัญหาด้วย → เชื่อม `/review-bundle`

## Rules

### 1. Read Only

- ห้ามแก้ไข assets หรือ build config ระหว่าง review
- ใช้ audit และ measurement เท่านั้น

### 2. Evidence Required

- ทุก finding ต้องมี path, size, หรือ metric
- ไม่แนะนำ format โดยไม่มี browser support context

## Expected Outcome

- รายงาน findings ครอบคลุม images, fonts, media
- ทุก finding มี evidence และ severity
- next action ชัดเจนผ่าน `/optimize-assets`
