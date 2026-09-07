---
name: optimize-fonts
description: Optimize web fonts — subsetting, preload, font-display และ self-hosting สำหรับ LCP/CLS
argument-hint: "[font-or-path]"
related:
  - optimize-web-vitals
  - report-before-after
---

## Goal

ลด font cost ของ web app — file size, render-blocking และ layout shifts — ด้วย subsetting, preloading, `font-display` และ self-hosting

## Scope

- ตรวจ font loading: `@font-face`, `<link>` fonts, Google Fonts/CDN, CSS imports
- ครอบคลุม: file formats (woff2), subsetting, preload strategy, `font-display`, fallback metrics (`size-adjust`), variable fonts
- Action-oriented: แก้ font config จริง — วัด LCP/CLS impact ก่อน-หลัง

## Execute

### 1. Inventory Font Usage

> Goal: map fonts ทั้งหมดที่โหลด

1. หา font declarations: `@font-face`, `<link rel="stylesheet">` fonts, `next/font`, iconify, CSS `@import`
2. วัดขนาด font files จริง — แต่ละ weight/style แยก
3. flag: full-family downloads ที่ใช้ 1-2 weights, multiple font files ที่ทำ fallback chains ยาว

### 2. Measure Impact

> Goal: เชื่อม fonts กับ CWV

1. ตรวจว่า fonts block first render — render-blocking `<link>` ใน head
2. ตรวจ CLS จาก font swap — `font-display` ที่ไม่มี metrics override
3. ใช้ `/optimize-web-vitals` data ถ้ามี — LCP element ที่รอ fonts

### 3. Apply Optimizations

> Goal: แก้ตาม impact

1. Self-host: ย้ายจาก Google Fonts CDN → self-hosted woff2 (ตัด DNS+TLS ของ CDN)
2. Subset: subset fonts ตาม unicode-range ที่ใช้จริง (latin, thai) — `pyftsubset`/`glyphhanger`
3. Preload: `<link rel="preload" as="font" crossorigin>` สำหรับ critical fonts เท่านั้น
4. font-display: `swap` สำหรับ body text, `optional` สำหรับ decorative — เลือกตาม CLS tolerance
5. Fallback metrics: `size-adjust`, `ascent-override` ใน `@font-face` เพื่อลด CLS
6. Variable fonts: รวม weights เป็นไฟล์เดียวถ้าใช้หลาย weights
7. ลด font count: dedupe families/weights ที่ใกล้กัน

### 4. Verify

> Goal: วัดผลจริง

1. เทียบ font bytes ก่อน-หลัง — `/report-before-after`
2. ตรวจ visual — text rendering ต้องไม่เปลี่ยนผิด (`/run-test-visual`)
3. วัด LCP/CLS ใหม่บน affected pages

## Rules

### 1. Measure First

- ต้องรู้ว่า fonts กินเท่าไหร่และ block อะไร ก่อนแก้
- Preload เฉพาะ critical fonts — preload ทุกตัวแย่กว่าเดิม

### 2. No Visual Regression

- Subsetting ต้องครอบ glyphs ที่ content ใช้จริง — ระวัง dynamic content
- Fallback stack ต้องใกล้เคียงเพื่อลด CLS

### 3. License Aware

- ตรวจ font license ก่อน self-host/subset — บาง license ห้าม modify

## Expected Outcome

- Font payload ลดลงพร้อมตัวเลข
- LCP/CLS ดีขึ้นจาก font fixes
- Loading strategy ถูกต้อง: critical preload, non-blocking ที่เหลือ
