# Fix Guide

(merged from: optimize-performance)

## Goal

วัดและแก้ web performance — LCP (loading), INP (interactivity), CLS (visual stability), long tasks, TTI, third-party scripts — ให้ผ่าน thresholds ที่ดี (LCP ≤2.5s, INP ≤200ms, CLS ≤0.1)

รวม scope จาก `/optimize-web-vitals` ที่ถูก merge เข้าตัวนี้

## Scope

- ตรวจ web app ที่ deploy หรือรัน local ได้ — field data (CrUX/RUM) หรือ lab data (Lighthouse/unlighthouse)
- ครอบคลุม: LCP element, render-blocking resources, image optimization, font loading, layout shifts, long tasks, hydration cost, third-party scripts, TTI
- Action-oriented: แก้จริง — วัด metric ก่อน/หลังเสมอ

## Execute

### 1. Measure Baseline

> Goal: จับ CWV ปัจจุบันแยกตาม metric และ route

1. ใช้ `/follow-tool-unlighthouse` หรือ Lighthouse วัดทุก route สำคัญ
2. ถ้ามี RUM/CrUX data → ใช้ field data เป็น primary (lab เป็น proxy)
3. บันทึก: LCP, INP, CLS, FCP, TBT, TTI ต่อ route พร้อม device profile (mobile เป็น default)
4. ระบุ pages ที่มีปัญหา

### 2. Diagnose Per Metric

> Goal: หา root cause ของ metric ที่ fail

1. LCP: หา LCP element (image/heading) — ตรวจ render-blocking CSS/JS, image ไม่ preload, font blocking, server TTFB
2. INP/TBT: หา long tasks, heavy hydration, event handlers ช้า, main-thread blocking
3. CLS: หา images/ads/embeds ไม่มี dimensions, font swap shifts, late-injected content

### 3. Apply Fixes

> Goal: แก้ตาม metric ที่ fail โดยเรียง impact

1. LCP: preload LCP image, `fetchpriority="high"`, inline critical CSS, defer non-critical JS, แก้ TTFB (caching/edge)
2. Images: ทำ `/review-assets` — WebP/AVIF, `width`/`height` attrs, `loading="lazy"` ใต้ fold
3. INP/long tasks: แตก long tasks ด้วย `requestIdleCallback`/`scheduler.yield`, defer hydration, `content-visibility`, workers สำหรับ heavy computation
4. CLS: กำหนด dimensions/aspect-ratio ทุก media, `font-display: swap` + size-adjust, reserve space สำหรับ dynamic content
5. Fonts: self-host, `preload` critical fonts, `font-display` ที่เหมาะ
6. Third-party: ลด third-party scripts, ใช้ async/defer, preload critical resources
7. TTI: code split ด้วย dynamic import, ลด main thread work (`/review-bundle`)

### 4. Verify

> Goal: ยืนยัน metrics ดีขึ้นบน route เดิม

1. วัดซ้ำหลังแก้ — เทียบ per-route per-metric
2. ใช้ `/report-before-after` แสดง LCP/INP/CLS delta
3. ทำ `/run-build` และ `/run-test` + visual checks (`/run-test-visual`) เพื่อกัน regression

## Rules

### 1. Measure First

- ต้องมี baseline ต่อ route ก่อนแก้ — CWV ต้องวัดจริงไม่เดา
- รายงานเทียบ thresholds อย่างเป็นทางการ (75th percentile สำหรับ field data)

### 2. No Visual Regression

- fixes ต้องไม่ทำ layout/UX พัง — ตรวจ visual regression หลังแก้
- lazy loading ห้ามใช้กับ LCP element
- ไม่ reduce UX เพื่อ performance

### 3. Field Over Lab

- ถ้ามี field data ให้ใช้เป็นหลัก — lab data ใช้ diagnose เท่านั้น
- ระบุ device/network profile ที่วัดเสมอ

## Expected Outcome

- CWV ผ่าน thresholds บน routes หลักพร้อมตัวเลข before/after
- Long tasks และ TTI ลดลง
- Root causes ถูกระบุและแก้ตาม metric
- ไม่มี visual/functional regression
- ถ้าต้อง review ก่อน → ใช้ `/review-performance`
