---
name: optimize-perf
description: ปรับปรุง overall performance: CWV, long tasks, TTI, runtime benchmarks
argument-hint: "[metric-or-page]"
related:
  - optimize-codebase-everything
  - optimize-rendering
  - optimize-assets
  - optimize-network
  - run-build
  - report-table
---

## Goal

ปรับปรุง overall performance ของ web app: Core Web Vitals, long tasks, TTI, runtime benchmarks

## Scope

ใช้กับ web apps โดย measure CWV (LCP, INP, CLS, TTFB, TBT) แล้ว optimize

## Execute

### 1. Measure CWV

1. รัน Lighthouse หรือ web-vitals library
2. บันทึก LCP, INP, CLS, TTFB, TBT
3. ระบุ pages ทีมีปัญหา

### 2. Optimize Long Tasks

1. ใช้ `requestIdleCallback` หรือ `scheduler.yield`
2. Split synchronous work
3. ใช้ workers สำหรับ heavy computation

### 3. Optimize Third-Party

1. ลด third-party scripts
2. ใช้ async/defer สำหรับ scripts
3. Preload critical resources

### 4. Improve TTI

1. Code split ด้วย dynamic import
2. Defer non-critical JS
3. ลด main thread work

### 5. Validate

1. วัด CWV ใหม่
2. ทำ `/run-build`
3. ทำ `/report-table` สรุป before/after

## Rules

- Measure ก่อน optimize
- Focus ที critical pages
- ไม่ reduce UX เพื่อ performance

## Expected Outcome

- CWV ดีขึ้น
- Long tasks ลดลง
- TTI ลดลง
