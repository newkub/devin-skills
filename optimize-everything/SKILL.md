---
name: optimize-everything
description: "Optimize ทุกอย่างที detect ได้: SEO, performance, bundle, images, a11y, CWV"
argument-hint: "[file-or-pattern]"
related:
  - review-uxui
  - follow-design-system
  - ship
  - follow-tool-vite
  - review-frontend
  - review-platform
---

## Goal

Optimize web project ทั้งหมดที detect ได้: SEO, frontend performance, bundle size, images, accessibility, Core Web Vitals, และ best practices

## Scope

- ใช้คู่กับ `/ship`
- SEO (meta tags, Open Graph, structured data, robots, sitemap)
- Frontend performance (LCP, INP, CLS, TTFB)
- Bundle size และ code splitting
- Image optimization (format, size, lazy, srcset)
- Accessibility (axe, Lighthouse, keyboard, contrast)
- Asset delivery (preconnect, preload, cache)
- TTI/TBT และ runtime performance
- ใช้ `/follow-design-system` สำหรับ design tokens
- ทำ `/review-frontend` หรือ `/review-platform` ตาม project type

## Execute

### 1. Detect Stack

> Goal: ระบุ tech stack

1. ตรวจ `package.json`, `vite.config.ts`, `wrangler.toml`, `tsconfig.json`
2. ระบุ framework, bundler, styling, deploy target
3. ถ้าใช้ Vite → ทำ `/follow-tool-vite`

### 2. SEO Audit

> Goal: ตรวจและแก้ SEO

1. ตรวจ `<title>`, `<meta name="description">`
2. ตรวจ Open Graph: `og:title`, `og:description`, `og:image`, `og:url`, `og:type`
3. ตรวจ Twitter Card: `twitter:card`, `twitter:title`, `twitter:image`
4. ตรวจ canonical URL
5. ตรวจ `robots.txt` และ `sitemap.xml`
6. ตรวจ structured data (JSON-LD)
7. ตรวจ `lang` attribute บน `<html>`
8. ถ้าขาด → สร้าง/แก้ `index.html`, `robots.txt`, `sitemap.xml`

### 3. Performance Audit

> Goal: ตรวจ Core Web Vitals และ frontend performance

1. รัน build:
   ```bash
   bun run build
   ```
2. ตรวจ bundle size ด้วย `vite-bundle-visualizer` หรือ `bunx vite-bundle-visualizer`
3. ตรวจ `dist/` ว่ามี assets อะไรบ้าง
4. ตรวจ image sizes
5. ตรวจ `loading="lazy"` และ `fetchpriority`
6. ตรวจ font loading (`font-display: swap`, preconnect)
7. ตรวจ `preconnect`/`dns-prefetch` สำหรับ CDN
8. ใช้ Google Modern Web Guidance ถ้าจำเป็น:
   ```bash
   npx -y modern-web-guidance@latest search "optimize LCP images"
   ```

### 4. Bundle Optimization

> Goal: ลด bundle size

1. ตรวจ `manualChunks` ใน `vite.config.ts`
2. ใช้ dynamic imports สำหรับ heavy components
3. ลบ unused dependencies ด้วย `/check-unused-deps`
4. ตรวจ barrel files และลบถ้ามี
5. ใช้ tree-shaking friendly imports
6. ตรวจ duplicate dependencies
7. ใช้ `brotli`/`gzip` ใน CDN

### 5. Image Optimization

> Goal: optimize รูปภาพ

1. ตรวจ format (WebP, AVIF แทน PNG/JPG)
2. ตรวจ size และ compression
3. ใช้ `srcset` และ `sizes` สำหรับ responsive
4. ใช้ `width`/`height` กำหนด aspect ratio
5. ใช้ `loading="lazy"` สำหรับ below-fold
6. ใช้ `decoding="async"`

### 6. Accessibility Audit

> Goal: ตรวจ a11y

1. รัน `bunx axe` หรือ Lighthouse a11y
2. ตรวจ color contrast
3. ตรวจ keyboard navigation
4. ตรวจ `aria-*` attributes
5. ตรวจ semantic HTML
6. ใช้ `/review-uxui` สำหรับ design/accessibility review

### 7. Runtime Performance

> Goal: ปรับ runtime

1. ตรวจ long tasks และ INP
2. ใช้ `requestIdleCallback`/`scheduler.yield`
3. ใช้ `content-visibility` สำหรับ offscreen content
4. Virtualize สำหรับ long lists
5. ตรวจ re-renders (React) หรือ signal updates (Solid)

### 8. Build Verification

> Goal: ยืนยันว่า build ผ่าน

1. รัน `bun run build`
2. รัน `bun run typecheck`
3. รัน `bun run test` ถ้ามี
4. ตรวจ `dist/` ขนาด
5. ทดสอบ preview

### 9. Report

> Goal: สรุปผล

1. ทำ `/report-table` สรุป metrics
2. รายงาน improvements
3. ทำ `/suggest-next-action`

## Rules

- ตรวจทุกอย่างที detect ได้จริง ไม่เดา
- ใช้ tools เช่น Lighthouse, axe, bundle visualizer
- เน้น high-impact optimizations ก่อน
- ทดสอบทุกครั้งหลัง optimize
- ไม่ commit ก่อนตรวจสอบ

## Expected Outcome

- SEO ครบถ้วน
- Performance ดีขึ้น
- Bundle size ลดลง
- Images optimized
- Accessibility ผ่านเกณฑ์
- Core Web Vitals ดีขึ้น

