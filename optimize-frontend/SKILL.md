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
  - optimize-assets
  - optimize-hydration
  - optimize-rendering
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
3. ทำ `/scan-codebase` เพื่อหา issues ที่เกี่ยวข้องกับ frontend
4. ทำ `/senior-frontend` เพื่อวิเคราะห์ UI/UX และ architecture
5. ถ้า context ไม่ชัด → ทำ `/ask-me`

### 2. Analyze Performance
> Goal: หาส่วนที่ควรปรับปรุง
1. ทำ `/check-web-performance` เพื่อดู Core Web Vitals หรือ Lighthouse metrics
2. ตรวจ bundle size, critical rendering path, และ asset loading
3. ทำ `/review-codebase` เพื่อรายละเอียดเพิ่ม
4. ถ้าไม่พบ issues → stop และ report

### 3. Optimize By Area
> Goal: แก้ไขตามลักษณะปัญหา
1. ทำ `/optimize-assets` ถ้า images/fonts/static files เป็นปัญหา
2. ทำ `/optimize-hydration` ถ้า SSR/CSR hydration ช้า
3. ทำ `/optimize-rendering` ถ้า re-render หรือ render time สูง
4. ทำ `/optimize-latency` ถ้า interactions หรือ API calls ช้า
5. ทำ `/optimize-caching` ถ้า cache policy ไม่เหมาะสม
6. ทำ `/optimize-payload` ถ้า bundle/API payload ใหญ่
7. ทำ `/follow-<framework>` ตาม stack เมื่อจำเป็น เช่น `/follow-react`, `/follow-vue`, `/follow-svelte`
8. ถ้าแก้ >10 ไฟล์ → ทำ `/use-scripts`

### 4. Validate And Report
> Goal: ยืนยันว่าปรับปรุงแล้วดีขึ้น
1. ทำ `/validate` และ `/run-check`
2. ทำ `/check-web-performance` อีกครั้งเพื่อ compare before/after
3. ถ้าไม่ผ่าน → ทำ `/resolve-errors` แล้ว retry (max 3)
4. สรุปผลด้วย `/report` และ `/suggest-next-action`

## Rules

### 1. Minimal Changes
- แก้เฉพาะสิ่งที่วัดผลได้ว่าดีขึ้น
- ไม่เปลี่ยน framework ทั้งหมด ยกเว้นได้รับการยืนยัน
- ถ้าไม่แน่ใจ → ทำ `/ask-me`

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