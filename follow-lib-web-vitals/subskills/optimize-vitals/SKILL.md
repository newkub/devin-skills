---
name: follow-lib-web-vitals-optimize-vitals
description: ปรับปรุง Core Web Vitals — LCP, INP, CLS optimization patterns
argument-hint: "[metric]"
related:
  - follow-lib-web-vitals
  - deep-optimize
  - check-bottlenecks
  - report-before-after
  - run-profiler
---

## Goal

ปรับปรุง Core Web Vitals scores — LCP, INP, CLS ด้วย patterns ที่พิสูจน์แล้ว วัดผลก่อนและหลัง

## Scope

ใช้เมื่อ metrics ที่ report ผ่าน `web-vitals` ไม่ผ่านเกณฑ์ (LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1) — ครอบคลุม diagnosis ด้วย attribution และ optimization patterns ต่อ metric

## Execute

### 1. Diagnose With Attribution

> Goal: ระบุ root cause ของ metric ที่พังด้วยข้อมูลจริง

1. ใช้ `web-vitals/attribution` build เพื่อดูว่า element/sub-part ไหนทำ metric พัง (เช่น LCP element, INP interaction target, CLS shift sources)
2. ทำ `/check-bottlenecks` — แยกปัญหา: server slow (TTFB), render-blocking resources, long tasks, layout shifts
3. เก็บ baseline numbers ก่อนแก้ — ทำ `/run-profiler` หรือเช็ค field data ที่ report อยู่

### 2. Optimize LCP

> Goal: ทำให้ largest element render เร็วขึ้น

1. TTFB: ลด server response time — CDN, caching, SSR/streaming
2. Resource load: preload LCP image (`<link rel="preload">` หรือ `fetchpriority="high"`), compress/resize images, ใช้ modern formats (AVIF/WebP)
3. Render-blocking: defer async scripts, inline critical CSS, ลด render-blocking resources
4. หลีกเลี่ยง lazy-load LCP image — โหลด eager เสมอ

### 3. Optimize INP

> Goal: ลด interaction latency

1. แยก long tasks — `scheduler.yield()` หรือ chunk work ให้ main thread ว่าง
2. ลด work ใน event handlers — defer non-critical work ออกจาก interaction
3. ใช้ `useTransition`/`useDeferredValue` (React) หรือ equivalent สำหรับ expensive updates
4. ลด DOM size และ event listeners ที่ไม่จำเป็น — passive listeners สำหรับ scroll/touch

### 4. Optimize CLS

> Goal: ลด unexpected layout shifts

1. ตั้ง `width`/`height` หรือ `aspect-ratio` บน images/videos/iframes เสมอ — reserve space ก่อนโหลด
2. หลีกเลี่ยง inject content เหนือ existing content — ads, banners, late-loading UI ต้อง reserve space
3. ใช้ `font-display: swap` ระวัง + preload fonts สำหรับ web fonts — ลด FOIT/FOUT shifts
4. ใช้ CSS `transform` animations แทน layout-affecting properties (top/left/width/height)

### 5. Verify And Compare

> Goal: วัด metrics หลังแก้เทียบ baseline

1. เก็บ field data หลัง deploy หรือใช้ lab tools (Lighthouse) เทียบ baseline ด้วย `/report-before-after`
2. ทุก fix ต้องแยก commit — เพื่อ isolate impact ต่อ metric
3. ถ้า metric ไม่ดีขึ้นหรือ regression → revert จุดนั้นแล้ว report

## Rules

- Diagnose ด้วย attribution data ก่อนเสมอ — ห้ามเดา
- แก้ทีละจุดเรียง impact มาก → น้อย — ห้ามแก้หลายจุ่มพร้อมกันถ้าแยกผลไม่ได้
- preserve behavior — optimize ต้องไม่เปลี่ยน UX/output
- field data (real users) สำคัญกว่า lab scores — วัดทั้งสองแต่ field เป็นตัวตัดสิน
- ใช้ `/follow-lib-web-vitals` สำหรับ setup และ `/deep-optimize` สำหรับงานหนัก

## Expected Outcome

- Root cause ของ metric regressions ระบุได้ด้วย attribution
- LCP/INP/CLS ดีขึ้นเทียบ baseline ด้วยตัวเลขจริง
- ไม่มี UX regression
