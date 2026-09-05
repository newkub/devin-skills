---
name: optimize-codebase-everything
description: Optimize codebase ทั้งหมด: frontend, API, database, network, bundle, SEO, a11y, CWV
argument-hint: "[file-or-pattern]"
related:
  - optimize-bundle
  - optimize-assets
  - optimize-rendering
  - optimize-perf
  - optimize-memory
  - optimize-network
  - optimize-cost
  - optimize-algorithm
  - follow-tool-vite
  - run-build
  - review-uxui
  - review-frontend
  - follow-design-system
  - check-bottlenecks
  - report-table
---

## Goal

Optimize codebase ทั้งหมดที detect ได้: frontend, API, database, network, bundle size, SEO, accessibility, Core Web Vitals

## Scope

ใช้กับ web project, monorepo, platform ที่มี frontend, backend, API, database โดยรวม best practices ทุก layer

## Execute

### 1. Detect Stack And Artifacts

> Goal: รู้ว่าต้อง optimize อะไร

1. ตรวจ `package.json`, `vite.config.ts`, `wrangler.jsonc`, `turbo.json`
2. ตรวจ `apps/*` และ `packages/*` สำหรับ monorepo
3. ระบุ framework, bundler, database, API style, deploy target
4. รัน `bun run build` เพื่อสร้าง production artifacts
5. ทำ `/run-build` ถ้าต้องการ build ตาม pipeline

### 2. Frontend And Bundle Optimization

> Goal: ลด bundle size และ improve CWV

1. ใช้ `/optimize-bundle` สำหรับ manual chunks, dynamic imports, tree-shaking
2. ใช้ `/optimize-assets` สำหรับ images, fonts, media
3. ใช้ `/optimize-rendering` สำหรับ re-renders, virtual lists, lazy components
4. ลบ unused dependencies ด้วย `/check-unused-deps`
5. เปิด compression `brotli`/`gzip` สำหรับ CDN
6. ทำ `/run-build` เพื่อวัด bundle size

### 3. SEO Audit

> Goal: ตรวจและแก้ SEO

1. ตรวจ `<title>`, `<meta name="description">`
2. ตรวจ Open Graph: `og:title`, `og:description`, `og:image`, `og:url`
3. ตรวจ Twitter Card tags
4. ตรวจ canonical URL
5. ตรวจ `robots.txt` และ `sitemap.xml`
6. ตรวจ structured data JSON-LD
7. ตรวจ `lang` attribute บน `<html>`

### 4. Accessibility And UX Review

> Goal: ตรวจ accessibility และ UX

1. ใช้ `bunx axe` หรือ Lighthouse a11y
2. ตรวจ color contrast
3. ตรวจ keyboard navigation
4. ตรวจ `aria-*` attributes
5. ตรวจ semantic HTML
6. ใช้ `/improve-uxui` สำหรับ design/accessibility review

### 5. Runtime And Memory Optimization

> Goal: ปรับ runtime บน browser

1. ใช้ `/optimize-perf` สำหรับ CWV, long tasks, third-party scripts
2. ใช้ `/optimize-memory` สำหรับ leaks, caches, large objects
3. ตรวจ long tasks และ INP
4. ใช้ `requestIdleCallback` หรือ `scheduler.yield`

### 6. API Optimization

> Goal: ปรับปรุง API performance

1. ใช้ `/improve-api` เพื่อ optimize endpoints
2. ใช้ `/improve-data-validation` เพื่อ strengthen input validation
3. ตรวจ response payload size
4. ใช้ pagination, cursor, หรือ limit/offset
5. ตรวจ caching headers (`Cache-Control`, `ETag`)
6. ใช้ batch endpoints แทน N+1 requests

### 7. Database Optimization

> Goal: ปรับปรุง DB queries

1. ใช้ `/improve-database` เพื่อ optimize queries, indexes, migrations
2. ตรวจ slow queries ด้วย logs หรือ observability
3. ตรวจ indexes สำหรับ WHERE, JOIN, ORDER BY
4. หลีกเลี่ยง N+1 queries
5. ใช้ connection pool ให้เหมาะสม

### 8. Network Optimization

> Goal: ปรับปรุงการสื่อสาร network

1. ใช้ `/optimize-network` เพื่อ reduce requests, caching, compression
2. ตรวจ HTTP/2 หรือ HTTP/3
3. ใช้ CDN สำหรับ static assets
4. ตรวจ SSL/TLS handshake time
5. ใช้ keep-alive และ connection reuse
6. ตรวจ service worker caching strategy

### 9. Algorithm And Cost Optimization

> Goal: ปรับ algorithm และ infrastructure cost

1. ใช้ `/optimize-algorithm` สำหรับ hot paths, data structures
2. ใช้ `/optimize-cost` สำหรับ compute, storage, bandwidth
3. ตรวจ complexity ของ loops และ recursive functions
4. ตรวจ cloud billing และ idle resources

### 10. Verify And Report

> Goal: ยืนยันว่า optimization ทำงาน

1. รัน `bun run build` อีกครั้ง
2. รัน `/run-build` ถ้าต้องการ full pipeline
3. ตรวจ `dist/` size, chunk count, build time
4. ทำ `/report-table` เปรียบเทียบ before/after
5. ทำ `/suggest-next-action`

## Rules

### 1. Build First

- ต้อง build ก่อน optimize
- ไม่ optimize บน code ทีไม่ผ่าน build
- ใช้ `/run-build` สำหรับ full build pipeline

### 2. Evidence-Based

- ทุก optimization ต้องมetrics ก่อน/หลัง
- ใช้ tools สำหรับ measurement
- ไม่เดา optimization

### 3. Layered Optimization

- Frontend → API → DB → Network
- ไม่ทำทั้งหมดพร้อมกัน แยก phase
- แก้ทีละ layer แล้ว verify

### 4. No Regression

- ทุก optimization ต้องผ่าน build, typecheck, tests
- ไม่ลด security เพื่อ performance
- ไม่ลด accessibility เพื่องดปุ่มหรือ UX

### 5. Minimal Changes

- หลีกเลี่ยง over-engineering
- แก้เฉพาะจุดที metrics บ่งชี้
- ไม่เปลี่ยน architecture ถ้าไม่จำเป็น

- ใช้ /ship ถ้าจำเป็น
- ใช้ /follow-tool-vite ถ้าจำเป็น
- ใช้ /review-uxui ถ้าจำเป็น
- ใช้ /review-platform ถ้าจำเป็น
- ใช้ /review-frontend ถ้าจำเป็น
- ใช้ /follow-design-system ถ้าจำเป็น
- ใช้ /deep-build ถ้าจำเป็น
- ใช้ /check-bottlenecks ถ้าจำเป็น

## Expected Outcome

- Bundle size ลดลง
- Build time ลดหรือคงที
- Core Web Vitals ดีขึ้น
- API latency ลดลง
- DB query time ลดลง
- Network transfer ลดลง
- ไม่มี regression ทาง functionality
