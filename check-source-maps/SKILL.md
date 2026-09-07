---
name: check-source-maps
description: ตรวจ production build ว่า leak source maps หรือเปิดเผย source code ผ่าน .map files
argument-hint: "[build-dir-or-url]"
related:
  - review-bundle
  - run-build
  - review-security
  - improve-security
  - report-table
---

## Goal

ตรวจว่า production build หรือ deployed app leak source maps (`.map` files, `sourceMappingURL` comment) ซึ่งเปิดเผย source code, internal paths และ logic ให้ภายนอก

## Scope

- ตรวจ output directory หลัง build (`dist/`, `build/`, `.output/`, `out/`) และ deployed URL
- ครอบคลุม: `.map` files, `//# sourceMappingURL=` comments, hidden sourcemaps (sourcemap ไม่ link แต่อัปโหลด), CSS sourcemaps
- Read-only: รายงานอย่างเดียว — แก้ไขผ่าน `/improve-security`

## Execute

### 1. Identify Target

> Goal: ระบุจุดที่จะตรวจ

1. รับ `build-dir-or-url` จาก argument หรือใช้ `/run-build` เพื่อสร้าง production build ก่อน
2. ถ้าไม่มี argument → หา build output directory จาก config (`vite.config`, `next.config`, `tsconfig`, bundler config)

### 2. Scan Local Build Output

> Goal: หา source maps ใน build artifacts

1. ค้นหา `**/*.map` ใน output directory
2. ค้นหา `sourceMappingURL` ในไฟล์ JS/CSS ที่ build แล้ว
3. ตรวจว่า sourcemap mode ใน bundler config เป็น `hidden`, `true`, หรือ `nosources` — บันทึกค่าที่พบ

### 3. Probe Deployed URL

> Goal: ตรวจว่า source maps เข้าถึงได้จากภายนอก

1. ดึง JS bundle จาก URL แล้วหา `sourceMappingURL` reference
2. ลอง fetch `<asset>.map` — ถ้าได้ 200 = leak
3. ข้าม step นี้ถ้าไม่มี deployed URL

### 4. Report

> Goal: สรุป exposure

1. ใช้ `/report-table` คอลัมน์: `No.`, `File/Asset`, `Map Location`, `Exposed`, `Severity`, `Fix`
2. Severity: `critical` (map พร้อม sourcesContent เข้าถึงได้ภายนอก), `warning` (map ใน build แต่ไม่ deploy), `info` (hidden map สำหรับ error tracking)
3. แนะนำ fix: `sourcemap: 'hidden'` หรือ `false`, upload map ไป error tracking แทน, strip `sourceMappingURL`

## Rules

### 1. Evidence-Based

- ทุก finding ต้องมี path หรือ URL ที่พบจริง
- แยกชัดว่า map อยู่ใน local build เท่านั้น หรือเข้าถึงได้จาก deployed URL

### 2. Read-Only

- ไม่แก้ bundler config หรือลบไฟล์ — แนะนำผ่าน `/improve-security`

### 3. Context Aware

- การ upload sourcemap ไป Sentry/error tracking ไม่นับเป็น leak ถ้าไม่ expose สาธารณะ

- ใช้ /review-security สำหรับ security audit ภาพรวม
- ใช้ /review-bundle สำหรับ bundle analysis
- ใช้ /improve-security เมื่อต้องแก้ไข

## Expected Outcome

- รายการ source maps ที่พบพร้อม exposure level
- Severity และ fix ที่แนะนำต่อ finding
