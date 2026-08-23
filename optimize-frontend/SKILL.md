---
name: optimize-frontend
description: ปรับปรุง frontend ของ project ด้าน performance, UX, rendering, และ assets
allowed-tools:
  - read
  - edit
  - write
  - grep
  - glob
  - exec
  - ask_user_question
triggers:
  - user
  - model
related:
  - optimize-codebase
  - senior-frontend
  - optimize-latency
  - optimize-caching
  - optimize-payload
  - check-web-performance
  - validate
---

## Goal

ปรับปรุง frontend ของ project ให้เร็วขึ้น ใช้งานง่ายขึ้น และไม่มี regression

## Scope

ใช้กับ project หรือ workspace ที่มี frontend (web, desktop, mobile web) โดยประสานงานกับ optimize-* skills ที่เฉพาะทาง

## Execute

### 1. Detect Stack And Context
> Goal: เข้าใจ tech stack และ pain points ของ frontend
1. อ่าน `package.json`, `vite.config.*`, `next.config.*`, `nuxt.config.*`, หรือ manifest ที่เกี่ยวข้อง
2. ระบุ framework/library เช่น React, Vue, Svelte, Solid, Angular
3. ทำ /scan-codebase เพื่อหา issues ที่เกี่ยวข้องกับ frontend
4. ทำ /senior-frontend เพื่อวิเคราะห์ UI/UX และ architecture
5. ถ้า context ไม่ชัด → ทำ /ask-me

### 2. Analyze Performance
> Goal: หาส่วนที่ควรปรับปรุง
1. ทำ /check-web-performance เพื่อดู Core Web Vitals หรือ Lighthouse metrics
2. ตรวจ bundle size, critical rendering path, และ asset loading
3. ทำ /review-codebase เพื่อรายละเอียดเพิ่ม
4. ถ้าไม่พบ issues → stop และ report

### 3. Optimize Assets
> Goal: ลดขนาดและเพิ่มประสิทธิภาพของ assets
1. ตรวจหา images/fonts/static files ที่ขนาดใหญ่หรือไม่ได้ใช้
2. ใช้ modern formats (WebP, AVIF), lazy loading, responsive images
3. ลบ unused assets, optimize icons และ font subsets
4. ใช้ CDN ถ้าเหมาะสม

### 4. Optimize Hydration
> Goal: ลด hydration time สำหรับ SSR/CSR
1. ตรวจสอบ server-side rendering settings และ hydration boundaries
2. ใช้ streaming, progressive hydration, หรือ partial hydration ตาม framework
3. ลด JavaScript ที่รันใน hydration phase
4. ใช้ /follow-<framework> ถ้าจำเป็น เช่น /follow-nextjs, /follow-nuxt

### 5. Optimize Rendering
> Goal: ลด re-render และ render time
1. ใช้ memoization, virtual list, หรือ component splitting
2. ตรวจสอบ avoidable re-renders ด้วย React DevTools หรือ profiler
3. ใช้ code splitting, dynamic imports, route-based lazy loading
4. optimize CSS layout/paint/composite (containment, will-change)

### 6. Optimize Network And Payload
> Goal: ลด latency และขนาดข้อมูล
1. ทำ /optimize-latency ถ้า interactions หรือ API calls ช้า
2. ทำ /optimize-caching ถ้า cache policy ไม่เหมาะสม
3. ทำ /optimize-payload ถ้า bundle/API payload ใหญ่
4. ถ้าแก้ >10 ไฟล์ → ทำ /use-scripts

### 7. Validate And Report
> Goal: ยืนยันว่าปรับปรุงแล้วดีขึ้น
1. ทำ /validate และ /run-check
2. ทำ /check-web-performance อีกครั้งเพื่อ compare before/after
3. ถ้าไม่ผ่าน → ทำ /resolve-errors แล้ว retry (max 3)
4. สรุปผลด้วย /report และ /suggest-next-action

## Rules

### 1. Minimal Changes
- แก้เฉพาะสิ่งที่วัดผลได้ว่าดีขึ้น
- ไม่เปลี่ยน framework ทั้งหมด ยกเว้นได้รับการยืนยัน
- ถ้าไม่แน่ใจ → ทำ /ask-me

### 2. Prioritize User Experience
- แก้ไขตาม impact ก่อน effort
- ไม่ทำลาย UX หรือ accessibility

### 3. Evidence Based
- ใช้ metrics ก่อน/หลัง ยืนยันผล
- ไม่อ้างว่างานเสร็จถ้า validation ไม่ผ่าน

## Expected Outcome

- frontend เร็วขึ้นตาม Core Web Vitals หรือ metrics ที่เกี่ยวข้อง
- ไม่มี regression ในฟีเจอร์หรือ UX
- รายงานสรุป before/after และ next action
