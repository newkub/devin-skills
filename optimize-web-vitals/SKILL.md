---
name: optimize-web-vitals
description: แก้ Core Web Vitals ของ web app ทั้ง LCP, INP, CLS ด้วย field data และ targeted fixes
argument-hint: "[url-or-metric]"
related:
  - follow-tool-unlighthouse
  - optimize-images
  - optimize-bundle
  - report-before-after
---

## Goal

วัดและแก้ Core Web Vitals — LCP (loading), INP (interactivity), CLS (visual stability) — ให้ผ่าน thresholds ที่ดี (LCP ≤2.5s, INP ≤200ms, CLS ≤0.1)

## Scope

- ตรวจ web app ที่ deploy หรือรัน local ได้ — field data (CrUX/RUM) หรือ lab data (Lighthouse/unlighthouse)
- ครอบคลุม: LCP element, render-blocking resources, image optimization, font loading, layout shifts, long tasks, hydration cost
- Action-oriented: แก้จริง — วัด metric ก่อน/หลังเสมอ

## Execute

### 1. Measure Baseline

> Goal: จับ CWV ปัจจุบันแยกตาม metric และ route

1. ใช้ `/follow-tool-unlighthouse` หรือ Lighthouse วัดทุก route สำคัญ
2. ถ้ามี RUM/CrUX data → ใช้ field data เป็น primary (lab เป็น proxy)
3. บันทึก: LCP, INP, CLS, FCP, TBT ต่อ route พร้อม device profile (mobile เป็น default)

### 2. Diagnose Per Metric

> Goal: หา root cause ของ metric ที่ fail

1. LCP: หา LCP element (image/heading) — ตรวจ render-blocking CSS/JS, image ไม่ preload, font blocking, server TTFB
2. INP/TBT: หา long tasks, heavy hydration, event handlers ช้า, main-thread blocking
3. CLS: หา images/ads/embeds ไม่มี dimensions, font swap shifts, late-injected content

### 3. Apply Fixes

> Goal: แก้ตาม metric ที่ fail โดยเรียง impact

1. LCP: preload LCP image, `fetchpriority="high"`, inline critical CSS, defer non-critical JS, แก้ TTFB (caching/edge)
2. Images: ทำ `/optimize-images` — WebP/AVIF, `width`/`height` attrs, `loading="lazy"` ใต้ fold
3. INP: แตก long tasks, defer hydration, `content-visibility`, ลด JS ใน bundle (`/optimize-bundle`)
4. CLS: กำหนด dimensions/aspect-ratio ทุก media, `font-display: swap` + size-adjust, reserve space สำหรับ dynamic content
5. Fonts: self-host, `preload` critical fonts, `font-display` ที่เหมาะ

### 4. Verify

> Goal: ยืนยัน metrics ดีขึ้นบน route เดิม

1. วัดซ้ำหลังแก้ — เทียบ per-route per-metric
2. ใช้ `/report-before-after` แสดง LCP/INP/CLS delta
3. `/run-test` + visual checks (`/run-test-visual`) เพื่อกัน regression

## Rules

### 1. Measure First

- ต้องมี baseline ต่อ route ก่อนแก้ — CWV ต้องวัดจริงไม่เดา
- รายงานเทียบ thresholds อย่างเป็นทางการ (75th percentile สำหรับ field data)

### 2. No Visual Regression

- fixes ต้องไม่ทำ layout/UX พัง — ตรวจ visual regression หลังแก้
- lazy loading ห้ามใช้กับ LCP element

### 3. Field Over Lab

- ถ้ามี field data ให้ใช้เป็นหลัก — lab data ใช้ diagnose เท่านั้น
- ระบุ device/network profile ที่วัดเสมอ

## Expected Outcome

- CWV ผ่าน thresholds บน routes หลักพร้อมตัวเลข before/after
- Root causes ถูกระบุและแก้ตาม metric
- ไม่มี visual/functional regression
