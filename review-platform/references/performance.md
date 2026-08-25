---
name: performance
description: Web performance review ด้วย Core Web Vitals, Lighthouse, bundle size, network, runtime
---

## Goal

Review web performance ครอบคลุม Core Web Vitals, bundle size, network loading, runtime performance และ Lighthouse audit

## Core Web Vitals

| Metric | Good | Needs Improvement | Poor |
|---|---|---|---|
| LCP (Largest Contentful Paint) | < 2.5s | 2.5s - 4s | > 4s |
| INP (Interaction to Next Paint) | < 200ms | 200ms - 500ms | > 500ms |
| CLS (Cumulative Layout Shift) | < 0.1 | 0.1 - 0.25 | > 0.25 |
| FCP (First Contentful Paint) | < 1.8s | 1.8s - 3s | > 3s |
| TTI (Time to Interactive) | < 3.8s | 3.8s - 7.3s | > 7.3s |
| Speed Index | < 3.4s | 3.4s - 5.8s | > 5.8s |
| TTFB (Time to First Byte) | < 0.8s | 0.8s - 1.8s | > 1.8s |

## Bundle Size Guidelines

| Resource | Good | Needs Improvement |
|---|---|---|
| JavaScript | < 200KB compressed | 200KB - 500KB |
| CSS | < 50KB compressed | 50KB - 150KB |
| Images | WebP/AVIF, lazy load | JPEG/PNG, no lazy load |
| Total initial load | < 1MB | 1MB - 3MB |

## Review Checklist

### 1. Core Web Vitals

1. ตรวจ LCP < 2.5s — ระบุ largest content element และ loading bottleneck
2. ตรวจ INP < 200ms — ระบุ slow event handlers และ long tasks
3. ตรวจ CLS < 0.1 — ระบุ layout shift จาก images, ads, fonts ไม่มี dimensions
4. ใช้ Lighthouse หรือ PageSpeed Insights สำหรับ measurement

### 2. Bundle Size

1. ตรวจ JavaScript bundle size — ใช้ webpack-bundle-analyzer หรือ equivalent
2. ตรวจ CSS bundle size — ระบุ unused CSS
3. ตรวจ image sizes — เช็ค format, dimensions, lazy loading
4. ตรวจ code splitting และ tree shaking effectiveness

### 3. Network

1. ตรวจ render-blocking resources — CSS, fonts, sync scripts
2. ตรวจ number of requests — ระบุ opportunities สำหรับ bundling, HTTP/2
3. ตรวจ resource loading times — ระบุ slow resources
4. ตรวจ caching strategy — Cache-Control, ETag, service worker cache

### 4. Runtime Performance

1. ตรวจ JavaScript execution time — ระบุ long tasks > 50ms
2. ตรวจ memory usage — ระบุ memory leaks, excessive allocations
3. ตรวจ frame rate — ยืนยัน 60fps, ระบุ jank
4. ใช้ Chrome DevTools Performance tab สำหรับ profiling

### 5. Loading Performance

1. ตรวจ FCP — ระบุ render-blocking และ server response time
2. ตรวจ TTI — ระบุ main thread blocking
3. ตรวจ Speed Index — ระบุ visually slow rendering
4. ตรวจ TTFB — ระบุ server response, CDN, caching issues

### 6. Lighthouse Audit

1. รัน Lighthouse audit ครบทุก category: Performance, Accessibility, Best Practices, SEO
2. ตรวจ Performance Score > 90 (good), > 50 (needs improvement)
3. รีวิว opportunities และ diagnostics
4. รีวิว passed audits สำหรับ best practices compliance

## Severity Classification

- Critical: page โหลดไม่ได้, LCP > 4s, INP > 500ms, CLS > 0.25
- High: LCP > 2.5s, INP > 200ms, CLS > 0.1, Performance Score < 50, bundle > 500KB
- Medium: Performance Score 50-90, bundle 200-500KB, missing lazy load, missing caching
- Low: Performance Score > 90 แต่มี minor opportunities, missing best practices

## Tools

- `lighthouse` — Google Lighthouse CLI
- `web-vitals` — RUM library สำหรับ field data
- `unlighthouse` หรือ `@unlighthouse/cli` — scan หลาย page
- `webpack-bundle-analyzer` — bundle visualization
- Chrome DevTools Performance tab — runtime profiling

## Expected Outcome

- Core Web Vitals ผ่านเกณฑ์ good ทั้งหมด
- Performance score > 90
- Bundle size อยู่ในเกณฑ์
- ระบุ bottleneck และ optimization opportunities พร้อม severity
