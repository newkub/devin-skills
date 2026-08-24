---
name: review-frontend
description: Review frontend quality ครอบคลุม performance, assets, hydration, rendering, UX/UI, accessibility...
allowed-tools:
  - read
  - edit
  - grep
  - glob
  - exec
  - ask_user_question
triggers:
  - user
  - model
related:
  - review-codebase
  - validate
  - suggest-next-action
---


## Goal

Review frontend ของ project ครอบคลุม performance, assets, hydration, rendering, UX/UI, และ accessibility พร้อม findings, severity, และ review score

## Scope

ใช้สำหรับ project หรือ workspace ที่มี frontend (web, desktop, mobile web) — ไม่รวม backend หรือ infrastructure review — เน้น review เท่านั้น ไม่แก้ไข code ระหว่าง review

## Execute

### 1. Prepare And Scan

เตรียม context และ scan หา frontend scope

> Goal: เข้าใจ tech stack, structure, และ pain points ของ frontend

1. ทำ `/scan-codebase` เพื่อหา frontend files: `package.json`, `vite.config.*`, `next.config.*`, `nuxt.config.*`, `index.html`, `app.vue`, `app.tsx`
2. ระบุ framework/library: React, Vue, Svelte, Solid, Angular, หรืออื่น
3. ตรวจสอบ frontend entry points, routes, layout, component tree
4. ถ้าเป็น web project → ทำ `/run-dev` เพื่อ verify dev server ก่อน review
5. ทำ `/check-web-performance` หรือ Lighthouse metrics เบื้องต้นหากมี

### 2. Review Performance

ตรวจสอบ frontend performance

> Goal: หาปัญหา performance ทีมีผลต่อ user

1. ตรวจสอบ Core Web Vitals: LCP, INP, CLS, TTFB, FCP
2. ตรวจสอบ bundle size และ bundle analysis output
3. ตรวจสอบ critical rendering path และ render-blocking resources
4. ตรวจสอบ JavaScript execution time และ long tasks
5. บันทึก metrics เป็น baseline พร้อม evidence (file, line, screenshot path)

### 3. Review Assets

ตรวจสอบ images, fonts, static files

> Goal: assets โหลดเร็ว ขนาดเหมาะสม ไม่มี waste

1. ตรวจสอบ images ขนาดใหญ่ทีไม่ optimize หรือไม่ใช้ modern formats (`WebP`, `AVIF`)
2. ตรวจสอบ responsive images, lazy loading, `srcset`, `sizes`
3. ตรวจสอบ font subsets, font-display, preconnect สำหรับ fonts
4. ตรวจสอบ unused assets และ icons ทีโหลดทั้งชุด
5. ตรวจสอบ CDN หรือ static hosting ทีใช้สำหรับ assets

### 4. Review Hydration

ตรวจสอบ SSR/CSR hydration

> Goal: hydration เร็วและไม่มี hydration mismatch

1. ตรวจสอบ server-side rendering settings และ hydration boundaries
2. ตรวจสอบ streaming, progressive hydration, partial hydration ตาม framework
3. ตรวจสอบ JavaScript ทีรันใน hydration phase และทำให้หนัก
4. ตรวจสอบ hydration mismatch, `typeof window` checks, client-only code
5. ถ้าไม่มี SSR/CSR → ข้าม section นี้และบันทึก scope

### 5. Review Rendering

ตรวจสอบ rendering efficiency

> Goal: ลด re-render และ render time

1. ตรวจสอบ avoidable re-renders, memoization, `useMemo`, `useCallback`, `memo`
2. ตรวจสอบ virtual list สำหรับ long lists
3. ตรวจสอบ code splitting, dynamic imports, route-based lazy loading
4. ตรวจสอบ CSS layout/paint/composite: containment, `will-change`, layers
5. ตรวจสอบ DOM size และ nesting depth

### 6. Review Network And Payload

ตรวจสอบ network usage และ payload

> Goal: ลด latency และขนาดข้อมูล

1. ตรวจสอบ API calls: round trips, batching, unnecessary requests
2. ตรวจสอบ payload size ของ API responses และ bundle
3. ตรวจสอบ compression, `gzip`, `brotli`, cache headers
4. ตรวจสอบ third-party scripts และ origins
5. ตรวจสอบ prefetch, preconnect, preload, DNS-prefetch usage

### 7. Review UX And UI

ตรวจสอบ UX/UI, copy, accessibility

> Goal: frontend ใช้งานง่ายและเข้าถึงได้

1. ตรวจสอบ UX copy, labels, error messages, notifications
2. ตรวจสอบ navigation, information hierarchy, visual consistency
3. ตรวจสอบ responsive breakpoints, touch/pointer targets, viewport handling
4. ตรวจสอบ accessibility: keyboard navigation, focus management, ARIA, color contrast
5. ตรวจสอบ component interaction และ feedback (loading, error, empty states)

### 8. Validate Findings

ตรวจสอบความถูกต้องของ findings

> Goal: findings ถูกต้อง ลด false positives

1. ทำ `/deep-validate` เพื่อ validate findings หลายมิติ
2. ทำ `/validate` สำหรับ validate issues จากทุก section
3. จัดลำดับการ validate ตาม severity: Critical → High → Medium → Low
4. ระบุ false positives พร้อมเหตุผล

### 9. Rate And Report

ให้คะแนนและรายงาน

> Goal: สรุปผล review เป็นตาราง

1. ให้ severity: Critical, High, Medium, Low, Info
2. คำนวณ review score ต่อ dimension และ overall
3. ทำ `/report` พร้อม `/report-table`
4. ทำ `/suggest-next-action`

## Rules

### 1. Skip Conditions

- ถ้า project ไม่มี frontend → stop และ report
- ถ้า project ไม่ใช้ SSR/CSR → ข้าม Step 4
- ถ้าไม่มี web project → ข้าม `/run-dev` และ `/check-web-performance`

### 2. Severity Classification

- Critical: LCP/CLS/INP ทรุด, hydration mismatch ใน production path, bundle ขนาดใหญ่ทำให้ TTI ช้า, hardcoded secrets ใน client bundle, broken accessibility บล็อก user flow
- High: asset ใหญ่ไม่ optimize, re-render สูงบน critical interaction, missing lazy loading, missing responsive images, API round trips ซ้ำ
- Medium: font loading ยังไม่ optimal, code splitting ขาด, minor UX copy issues, focus management ไม่สมบูรณ์
- Low: cosmetic, naming, minor CSS optimization

### 3. Evidence-Based Findings

- ทุก finding ต้องมี file path และ line number หรือ metrics
- ใช้ tools สำหรับ verification ไม่เดา
- บันทึก before/after metrics สำหรับ performance findings

### 4. Review Independence

- ทำ review เท่านั้น ไม่แก้ไข code ระหว่าง review
- แยก review process จาก fix process
- ถ้าต้องแก้ไข → แนะนำ `/senior-frontend` หรือ `optimize-frontend` หลัง report

### 5. Formatting

- ห้ามใช้ `**` (bold markers) — ใช้ backticks สำหรับ emphasis
- รายงานเป็นตารางด้วย `/report-table`
- ใช้ heading levels สำหรับ structure

## Expected Outcome

- รายงาน findings ต่อ dimension พร้อม severity, evidence, และ review score
- ตาราง aggregate findings จากทุก frontend section
- Recommended actions พร้อม priority
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`

