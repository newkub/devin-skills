---
name: optimize-rendering
description: ปรับปรุง rendering performance: re-renders, virtual lists, content-visibility, lazy components
argument-hint: "[component-or-route]"
related:
  - optimize-codebase-everything
  - optimize-perf
  - optimize-assets
  - run-build
  - report-table
---

## Goal

ปรับปรุง rendering performance บน browser: ลด re-renders, virtualize lists, ใช้ lazy components

## Scope

ใช้กับ frontend frameworks: React, Solid, Vue, Svelte โดย audit component renders และ optimize

## Execute

### 1. Measure Render Performance

> Goal: Measure Render Performance

1. รัน build production
2. ใช้ DevTools Performance panel
3. ระบุ long frames, forced reflows, re-renders

### 2. Optimize Re-Renders

> Goal: Optimize Re-Renders

1. ใช้ memo/signal/memoized components
2. ลด props drilling
3. ใช้ split props ถ้า Solid
4. หลีกเลี่ยง anonymous functions ใน render

### 3. Virtualize Lists

> Goal: Virtualize Lists

1. ใช้ virtualized list สำหรับ > 100 items
2. ใช้ `content-visibility` สำหรับ offscreen content
3. ใช้ `will-change` อย่างระมัดระวัง

### 4. Lazy Components

> Goal: Lazy Components

1. ใช้ dynamic import สำหรับ below-fold components
2. ใช้ `loading="lazy"` สำหรับ images
3. ใช้ intersection observer สำหรับ deferred content

### 5. Validate

> Goal: Validate

1. รัน `/run-build`
2. รัน `/run-test-website-by-agent-browser` ถ้ามี
3. ทำ `/report-table` สรุป metrics

## Rules

- ทำก่อน/หลัง measurements
- ไม่ optimize ก่อนมี baseline
- หลีกเลี่ยง premature micro-optimizations

## Expected Outcome

- Re-render ลดลง
- Long tasks ลดลง
- INP/LCP ดีขึ้น
