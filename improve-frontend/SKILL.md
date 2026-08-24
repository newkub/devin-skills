---
name: improve-frontend
description: ปรับปรุง frontend ด้าน UX/UI, accessibility, SEO, rendering, assets, payload และ battery
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
  - improve-writing
  - check-accessibility
  - senior-frontend
  - review-frontend
  - improve-performance
  - validate
  - resolve-errors
  - suggest-next-action
---

## Goal

ปรับปรุง frontend ของ project ให้ใช้งานง่าย, เร็ว, ทุกคนเข้าถึงได้ และไม่กิน resource เกินควร โดยไม่มี regression

## Scope

ใช้กับ frontend (web, desktop, mobile web) ที่ต้องการปรับปรุง UX/UI, copy, accessibility, SEO, visual design, component interaction, rendering, assets, payload และ battery

## Execute

### 1. Detect Stack And Context
> Goal: เข้าใจ tech stack, user journey และ pain points
1. อ่าน `package.json`, `vite.config.*`, `next.config.*`, `nuxt.config.*` หรือ manifest ที่เกี่ยวข้อง
2. ระบุ framework/library, user flows, performance pain points
3. ทำ `/scan-codebase` เพื่อหา issues ที่เกี่ยวข้อง
4. ทำ `/review-codebase` เพื่อรายละเอียดเพิ่ม
5. ถ้าไม่พบ issues หรือ context ไม่ชัด → stop และ report หรือ `/ask-me`

### 2. Improve UX Writing, Errors And Forms
> Goal: ข้อความชัดเจน ช่วยให้ผู้ใช้กู้คืน และกรอกข้อมูลง่าย
1. ระบุ touchpoints ทั้งหมด: navigation, actions, feedback, errors, empty states
2. ปรับ microcopy, button labels, error messages, empty states ให้บอก what และ how to fix
3. หลีกเลี่ยง "Error", "Failed", "Invalid" โดยไม่มี context; ใช้ active voice
4. ปรับปรุง field labels, helper text, validation messages, inline validation, toast
5. ถ้า copy หรือ docs ต้องการปรับปรุง → ใช้ `/improve-writing`

### 3. Improve Accessibility
> Goal: ใช้งานได้กับทุกคน ตาม WCAG 2.1 AA
1. ทำ `/check-accessibility` เพื่อหา WCAG issues
2. ตรวจ keyboard navigation, tab order, focus indicators, ARIA, alt text, semantic HTML
3. ตรวจ color contrast, form labels, media captions, screen reader compatibility
4. ใช้ `/senior-frontend` ถ้าต้องการ review ลึกทาง UI/UX

### 4. Improve SEO
> Goal: ปรับปรุงการค้นหาและ discoverability
1. ตรวจสอบ meta tags, title, description, canonical, Open Graph, structured data
2. ตรวจ heading hierarchy, semantic HTML, internal links, mobile friendliness
3. ตรวจ page speed, Core Web Vitals
4. แก้ไข issues ตาม priority

### 5. Improve Visual Design And Consistency
> Goal: ให้ UI สวยงาม สม่ำเสมอ และ responsive
1. ทำ `/senior-frontend` ถ้า UI, layout, component design มีปัญหา
2. ทำ `/review-frontend` ถ้า frontend รวมหรือ performance เป็นปัญหา
3. ตรวจ responsive, visual consistency, spacing, typography, interaction

### 6. Optimize Assets And Payload
> Goal: ลดขนาดและเพิ่มประสิทธิภาพของ assets และ payload
1. ตรวจ images, fonts, icons, static files ที่ไม่ใช้หรือขนาดใหญ่
2. ใช้ modern formats (WebP, AVIF), lazy loading, responsive images, font subsets
3. ลบ unused assets, ใช้ CDN ถ้าเหมาะสม
4. ตรวจ bundle/API payload, ลด unnecessary fields, ใช้ compression

### 7. Optimize Rendering And Hydration
> Goal: ลด re-render, render time และ hydration
1. ใช้ memoization, virtual list, component splitting, code splitting, dynamic imports
2. ตรวจ hydration boundaries, ลด JavaScript ใน hydration phase
3. ใช้ streaming หรือ progressive hydration ตาม framework
4. optimize CSS layout/paint/composite (containment, will-change)

### 8. Optimize Battery
> Goal: ประหยัดพลังงานสำหรับ frontend
1. ลด animations, background tasks, polling ที่ไม่จำเป็น
2. ใช้ passive event listeners, reduce motion, lazy load offscreen
3. ตรวจงาน periodic sync, network retries, ลด unnecessary re-renders
4. ใช้ `/follow-best-practice` หรือ `/learn-from-web` ตาม platform

### 9. Validate
> Goal: ยืนยันว่าปรับปรุงแล้วดีขึ้น
1. ทำ `/validate` และ `/run-check`
2. ทำ `/check-web-performance` ถ้ามี metrics ก่อน/หลัง
3. ถ้าไม่ผ่าน → ทำ `/resolve-errors` แล้ว retry (max 3)
4. สรุปผลด้วย `/report` และ `/suggest-next-action`

## Rules

### 1. Minimal Changes
- แก้เฉพาะสิ่งที่วัดผลได้ว่าดีขึ้น
- ไม่แก้นอก scope และไม่เปลี่ยน framework ทั้งหมดโดยไม่ได้รับการยืนยัน
- ถ้าไม่แน่ใจ → ทำ `/ask-me`

### 2. User-Centric
- แก้ตาม impact ก่อน effort
- ไม่ทำลาย UX หรือ accessibility
- ทุก error message บอกวิธีแก้

### 3. Evidence Based
- ใช้ metrics ก่อน/หลัง ยืนยันผล
- ไม่อ้างว่างานเสร็จถ้า validation ไม่ผ่าน

## Expected Outcome
- UX/UI ดีขึ้น ชัดเจน เข้าใจง่าย สม่ำเสมอ
- accessibility ผ่าน WCAG 2.1 AA
- SEO ดีขึ้น
- frontend เร็วขึ้นตาม Core Web Vitals หรือ metrics ที่เกี่ยวข้อง
- payload, assets, battery ดีขึ้น
- ไม่มี regression
- รายงานสรุป before/after และ next action
