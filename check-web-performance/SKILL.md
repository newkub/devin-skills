---
name: check-web-performance
description: ติดตั้งและตรวจสอบ web performance ด้วย Core Web Vitals และ Lighthouse
allowed-tools:
  - read
  - edit
  - grep
  - glob
  - exec
triggers:
  - user
  - model
related:
---

## Goal

ตรวจสอบ performance ด้วย Core Web Vitals และ metrics สำคัญ

## Scope

Use `check-web-performance` for the specific tasks and workflows it covers

## Execute

### 1. Install Tools

> Goal: ติดตั้ง tools สำหรับตรวจสอบ performance
> Goal: เครื่องมือพร้อมใช้งาน

1. รัน `bun add -D lighthouse` หรือ `npm install -D lighthouse`
2. ติดตั้ง Chrome DevTools (มากับ Chrome/Chromium)
3. ใช้ `npx web-vitals` หรือแพ็คเกจ `web-vitals` สำหรับ RUM
4. ติดตั้ง `unlighthouse` หรือ `@unlighthouse/cli` ถ้าต้องการ scan หลาย page

### 2. Check Core Web Vitals

> Goal: Check Core Web Vitals

1. ตรวจสอบ LCP (Largest Contentful Paint) < 2.5s
2. ตรวจสอบ INP (Interaction to Next Paint) < 200ms
3. ตรวจสอบ CLS (Cumulative Layout Shift) < 0.1
4. ใช้ Lighthouse หรือ PageSpeed Insights

### 3. Check Bundle Size

> Goal: Check Bundle Size

1. ตรวจสอบ JavaScript bundle size
2. ตรวจสอบ CSS bundle size
3. ตรวจสอบ image sizes
4. ใช้ webpack-bundle-analyzer หรือ tools ที่เทียบเท่า

### 4. Check Network

> Goal: Check Network

1. ตรวจสอบ render-blocking resources
2. ตรวจสอบ number of requests
3. ตรวจสอบ resource loading times
4. ตรวจสอบ caching strategy

### 5. Check Runtime Performance

> Goal: Check Runtime Performance

1. ตรวจสอบ JavaScript execution time
2. ตรวจสอบ memory usage
3. ตรวจสอบ frame rate (60fps)
4. ใช้ Chrome DevTools Performance tab

### 6. Check Loading Performance

> Goal: Check Loading Performance

1. ตรวจสอบ FCP (First Contentful Paint)
2. ตรวจสอบ TTI (Time to Interactive)
3. ตรวจสอบ speed index
4. ตรวจสอบ time to first byte

### 7. Run Lighthouse

> Goal: Run Lighthouse

1. รัน Lighthouse audit
2. ตรวจสอบ performance score
3. ตรวจสอบ opportunities และ diagnostics
4. แก้ไข issues ที่พบ

## Rules

### 1. Performance Targets

- LCP: < 2.5s (good), < 4s (needs improvement)
- INP: < 200ms (good), < 500ms (needs improvement)
- CLS: < 0.1 (good), < 0.25 (needs improvement)
- Performance Score: > 90 (good), > 50 (needs improvement)

### 2. Bundle Size Guidelines

- JavaScript: < 200KB compressed
- CSS: < 50KB compressed
- Images: WebP format, lazy load
- Total: < 1MB initial load

### 3. Optimization Priority

- Critical: ทำให้ page โหลดไม่ได้
- High: ทำให้ performance แย่มาก
- Medium: ทำให้ performance แย่เล็กน้อย
- Low: เป็น best practices

## Expected Outcome

- Core Web Vitals ผ่านทั้งหมด
- Performance score > 90
- Bundle size อยู่ในเกณฑ์ที่เหมาะสม
- Loading time รวดเร็ว
- Runtime performance ลื่นไหล
