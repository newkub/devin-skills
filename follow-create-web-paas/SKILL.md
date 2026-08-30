---
name: follow-create-web-paas
description: สร้าง SaaS+ ด้วย SolidJS, TanStack, oRPC, Elysia, UnoCSS และ advanced UX/UI
related:
  - follow-create-web
  - follow-create-web-landing
  - follow-create-web-saas
  - follow-solid-tanstack
  - follow-lib-unocss
  - follow-lib-better-auth
  - follow-service-stripe
  - review-uxui
  - review-frontend
  - deploy-to-cloudflare
  - deploy-to-vercel
---

## Goal

สร้าง SaaS ระดับ platform ทีมี UX/UI ขั้นสูง คล่องตัว และ scale ได้

## Scope

- เริ่มจาก scope ของ `/follow-create-web-saas`
- เพิ่ม advanced UI/UX features
- รองรับ onboarding, real-time, design system, animations, a11y, performance
- เหมาะสำหรับ product ทีต้องการ polish สูง

## Execute

### 1. Follow SaaS Base

> Goal: สร้าง foundation ของ SaaS

1. ทำ `/follow-create-web-saas` เพื่อสร้าง base project
2. ตรวจสอบว่า auth, payments, dashboard ครบ
3. อย่า duplicateงานที saas base ทำไปแล้ว

### 2. Advanced UX/UI Design

> Goal: ยกระดับ UX/UI

1. ใช้ `/review-uxui` สร้าง design system ทีละเอียด
2. สร้าง design tokens สำหรับ colors, spacing, typography, shadows, radius
3. ใช้ `/follow-lib-unocss` เพื่อ preset custom และ shortcuts
4. ออกแบบ micro-interactions, hover, focus, loading states

### 3. Onboarding And User Flows

> Goal: นำผู้ใช้เข้าสู่ product

1. สร้าง onboarding flow หลัง sign up
2. ใช้ progressive disclosure สำหรับ features ซับซ้อน
3. สร้าง empty states, tooltips, guided tours
4. ทำ `/review-uxui` เพื่อตรวจ user flow

### 4. Advanced Components

> Goal: สร้าง components ที polished

1. สร้าง reusable data visualization ด้วย charts/diagrams
2. สร้าง command palette สำหรับ navigation
3. ใช้ TanStack Table Virtual สำหรับ large data sets
4. สร้าง notifications, toasts, modals ที consistent

### 5. Real-Time And Performance

> Goal: รองรับ real-time และ performance

1. ใช้ WebSocket หรือ SSE สำหรับ real-time updates
2. ใช้ TanStack Query caching และ optimistic updates
3. ตรวจสอบ Core Web Vitals ด้วย `/review-frontend`
4. ใช้ lazy loading และ code splitting

### 6. Accessibility And Polish

> Goal: รองรับทุก user

1. ตรวจสอบ a11y ด้วย `/review-frontend`
2. รองรับ keyboard navigation และ screen reader
3. ตรวจสอบ contrast และ focus indicators
4. ใช้ semantic HTML และ ARIA attributes

### 7. Test And Validate

> Goal: ตรวจสอบทุกจุด

1. รัน `bun run build` และ `bun run start`
2. ทำ `/run-test-all` สำหรับ unit, integration, e2e
3. ทำ `/review-frontend` ตรวจ accessibility, performance
4. ทำ `/deep-validate` สำหรับ complex flows

### 8. Deploy

> Goal: deploy platform

1. ถ้า Cloudflare → ทำ `/follow-service-cloudflare`
2. ถ้า Vercel → ทำ `/follow-service-vercel`
3. ตรวจสอบ environment variables และ build config
4. ทดสอบ production URL ทุก critical path

## Rules

### 1. Stack Defaults

- ถ้า user ไม่ระบุ stack → ใช้ SolidJS + TanStack + oRPC + Elysia + UnoCSS
- ถ้า user ระบุ stack อื่น → ทำตาม stack นั้น

### 2. Quality

- ทำ `/follow-single-responsibility` หลัง major components
- ทำ `/review-frontend` ก่อน deploy
- ทำ `/realize-implementation` หลังเสร็จ

### 3. References

- ใช้ `?follow-create-web-saas/SKILL.md` สำหรับ base SaaS scope
- ใช้ `?follow-solid-tanstack/references/` สำหรับ framework details
- ใช้ `?follow-lib-unocss/references/index.md` สำหรับ UnoCSS

### 4. Safety

- ไม่ commit secrets ลง repository
- ใช้ `/follow-secret-manager` สำหรับ secrets
- ใช้ `environment variables` สำหรับ non-sensitive config
- ถ้ามี destructive changes → dry run ก่อน

- ใช้ /follow-create-web-landing ถ้าจำเป็น
- ใช้ /follow-lib-better-auth ถ้าจำเป็น
- ใช้ /follow-service-stripe ถ้าจำเป็น
- ใช้ /deploy-to-cloudflare ถ้าจำเป็น
- ใช้ /deploy-to-vercel ถ้าจำเป็น

## Expected Outcome

- SaaS+ platform รันด้วย SolidJS + TanStack + oRPC + Elysia + UnoCSS
- UX/UI advanced, responsive, accessible
- Real-time และ performance รองรับ
- Auth, payments, dashboard ทำงานได้
- Tests ผ่านหรือมี plan
- Deploy สำเร็จหรือพร้อม deploy
