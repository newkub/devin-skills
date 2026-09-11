---
name: optimize-web-vitals
description: วัด Core Web Vitals ด้วย tools จริงแล้ว optimize — LCP, CLS, INP, loading, rendering, images
argument-hint: "[url]"
related:
  - follow-lib-web-vitals
  - follow-tool-unlighthouse
  - review-performance
  - review-web
  - use-agent-browser
  - check-bundle-regression
  - use-subagents
  - run-check
  - report
  - suggest-next-action
---

## Goal

วัด Core Web Vitals (LCP, CLS, INP, TTFB) ของเว็บที่รันอยู่ด้วย tools จริง จากนั้น optimize ที่ root cause จนคะแนนผ่านเกณฑ์ — รวม images, fonts, render-blocking, hydration ด้วย

## Scope

ใช้เมื่อต้องการ web performance pass แบบ measure-then-fix — ต่างจาก `/review-performance` ที่ review code อย่างเดียว skill นี้ต้องวัดผลจริงก่อนและหลัง optimize

- ถ้าต้องการ bundle-level optimization → `/optimize-bundling`
- ถ้าต้องการ review เว็บทุกมิติก่อน → `/review-web`; bundle budget regression → `/check-bundle-regression`
- ถ้า scope ใหญ่หลาย routes → dispatch ผ่าน `/use-subagents`
- ถ้าไม่มี server รัน → `/run-dev` ก่อน

## Execute

### 1. Setup Measurement

> Goal: มี baseline metrics ที่เชื่อถือได้

1. confirm server รันอยู่ผ่าน `/use-agent-browser` หรือ dev server URL จาก context
2. ติดตั้ง tools ถ้ายังไม่มี: `bun add -D lighthouse` หรือใช้ `/follow-tool-unlighthouse` (unlighthouse สำหรับ scan ทุก route), `web-vitals` lib สำหรับ field data ตาม `/follow-lib-web-vitals`
3. รัน Lighthouse/unlighthouse เก็บ baseline: LCP, CLS, INP, TTFB, total bytes, request count ต่อ route

### 2. Analyze Bottlenecks

> Goal: รู้ว่าอะไรทำ metrics พัง

1. map metrics → causes: LCP สูง = render-blocking resources/large hero image/slow TTFB; CLS = images ไม่มี dimensions/font swap/late injection; INP = long tasks/hydration หนัก
2. ดู network waterfall จาก Lighthouse trace — หา blocking scripts, unused CSS/JS, unoptimized images
3. ทำ `/review-performance` หา code-level causes (re-renders, heavy components)

### 3. Fix LCP And Loading

> Goal: LCP ≤2.5s

1. preload/priority LCP element (hero image `fetchpriority="high"`, critical CSS inline)
2. ลด render-blocking: defer/async scripts, code-split heavy libs, minify
3. optimize TTFB: caching headers, edge/SSR ที่เหมาะ, ลด server work ต่อ request

### 4. Fix CLS And Visual Stability

> Goal: CLS ≤0.1

1. ทุก image/video/iframe มี `width`/`height` หรือ `aspect-ratio` — จองพื้นที่ล่วงหน้า
2. fonts: `font-display: swap` + `size-adjust` fallback หรือ preload font หลัก
3. ห้าม inject content เหนือ viewport หลัง load (ads, banners, late skeletons)

### 5. Fix INP And Runtime

> Goal: INP ≤200ms

1. split long tasks — `scheduler.yield`, lazy hydration, `content-visibility`
2. ลด hydration cost — islands/partial hydration ถ้า framework รองรับ
3. debounce handlers หนัก, virtualize long lists

### 6. Optimize Assets

> Goal: bytes ลดลงอย่างมีนัยสำคัญ

1. images: modern formats (AVIF/WebP), responsive `srcset`, lazy-load นอก viewport
2. fonts: subset + `woff2`, preconnect ไป font CDN
3. compress: brotli/gzip, HTTP/2+, cache-control ที่เหมาะ

### 7. Re-measure And Report

> Goal: ยืนยัน improvement ด้วยตัวเลขจริง

1. re-run Lighthouse/unlighthouse ทุก route ที่แก้ — เทียบ before/after
2. เกณฑ์ผ่าน: LCP ≤2.5s, CLS ≤0.1, INP ≤200ms — ถ้าไม่ผ่าน loop กลับ Step 2 (สูงสุด 3 รอบ)
3. ทำ `/run-check` + `/report` พร้อม metrics table, waterfall evidence, fixes applied
4. ทำ `/suggest-next-action`

## Rules

### 1. Measure First

- ห้าม optimize โดยไม่มี baseline — ทุก fix ต้องมี before/after metrics
- ใช้ tools จริง (Lighthouse, web-vitals, traces) — ห้ามเดาจาก code อย่างเดียว

### 2. All Routes

- วัดทุก public route (unlighthouse scan หรือ Lighthouse ต่อ route) — ห้ามวัดแค่ homepage
- report metrics ต่อ route ไม่ใช่แค่ average

### 3. Root Cause

- แก้ที่สาเหตุจริง — ห้าม hack เช่น `loading="lazy"` บน LCP image หรือ fake skeleton
- fixes ต้องไม่ทำ functionality/UX regressions — verify ผ่าน `/use-agent-browser` screenshot

### 4. Budgets

- เกณฑ์: LCP ≤2.5s, CLS ≤0.1, INP ≤200ms, TTFB ≤800ms
- ถ้าแก้แล้วยังไม่ผ่าน 3 รอบ → stop และ report blockers

## Expected Outcome

- baseline + after metrics ต่อ route ผ่าน Lighthouse/web-vitals
- Core Web Vitals ผ่านเกณฑ์ หรือ report blockers ชัดเจน
- assets optimized (images, fonts, scripts) พร้อม byte savings
